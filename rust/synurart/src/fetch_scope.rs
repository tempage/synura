use std::net::IpAddr;

use serde::Deserialize;
use url::Url;

/// Network metadata is captured when an extension is loaded, not on each request.
#[derive(Default, Deserialize)]
pub(super) struct NetworkPackage {
    #[serde(default)]
    domain: String,
    #[serde(default)]
    host_permissions: Vec<String>,
    pub bypass: Option<String>,
}

#[derive(Default)]
pub(super) struct FetchScope {
    rules: Vec<Rule>,
    pub bypass: Option<String>,
}

struct Rule {
    scheme: String,
    host: String,
    port: String,
    path: String,
    subdomains: bool,
}

impl FetchScope {
    pub(super) fn new(package: NetworkPackage) -> Result<Self, String> {
        if let Some(bypass) = &package.bypass {
            let mut parts = bypass.split('/');
            if !matches!(parts.next(), Some("chrome" | "firefox" | "tor"))
                || parts.next().is_some_and(|os| {
                    !matches!(os, "windows" | "linux" | "android" | "ios" | "macos")
                })
            {
                return Err(format!("unsupported bypass profile: {bypass}"));
            }
        }
        let (domain, port) = domain_authority(&package.domain)?;
        let mut rules = Vec::new();
        for pattern in &package.host_permissions {
            let rule = Rule::parse(pattern)?;
            let same_family = if is_local(&domain) || is_local(&rule.host) {
                domain == rule.host && !rule.subdomains && port == rule.port
            } else {
                domain == rule.host
                    || psl::domain_str(&domain)
                        .zip(psl::domain_str(&rule.host))
                        .is_some_and(|(a, b)| a == b)
            };
            if domain.is_empty() || !same_family {
                return Err(format!(
                    "host permission {pattern:?} is outside extension domain {:?}",
                    package.domain
                ));
            }
            rules.push(rule);
        }
        if rules.is_empty() && !domain.is_empty() {
            // The implicit scope is a host scope. Explicit patterns carry ports.
            rules.push(Rule {
                scheme: "*".into(),
                host: domain,
                port: String::new(),
                path: "/*".into(),
                subdomains: false,
            });
        }
        Ok(Self {
            rules,
            bypass: package.bypass,
        })
    }

    pub(super) fn check(&self, url: &Url) -> Result<(), String> {
        if self.rules.is_empty() {
            return Err("Network access is disabled: declare SYNURA.domain".into());
        }
        if !matches!(url.scheme(), "http" | "https") {
            return Err("fetch only supports http and https URLs".into());
        }
        if self.rules.iter().any(|rule| rule.matches(url)) {
            Ok(())
        } else {
            Err(format!("fetch URL is not allowed: {url}"))
        }
    }
}

impl Rule {
    fn parse(pattern: &str) -> Result<Self, String> {
        let invalid = || format!("invalid host permission: {pattern:?}");
        let pattern = pattern.trim();
        if pattern.contains(['?', '#']) {
            return Err(invalid());
        }
        let (scheme, tail) = pattern.split_once("://").ok_or_else(invalid)?;
        if !matches!(scheme, "http" | "https" | "*") {
            return Err(invalid());
        }
        let (authority, path) = tail.find('/').map_or((tail, "/"), |i| tail.split_at(i));
        if authority.is_empty() || authority.contains('@') {
            return Err(invalid());
        }
        let (host, port) = split_authority(authority)?;
        if host.is_empty() || !port.bytes().all(|b| b.is_ascii_digit()) {
            return Err(invalid());
        }
        let subdomains = host.starts_with("*.");
        let host = host.strip_prefix("*.").unwrap_or(&host).to_string();
        if host.is_empty() || host.contains('*') {
            return Err(invalid());
        }
        if subdomains
            && (host.parse::<IpAddr>().is_ok()
                || psl::suffix(host.as_bytes()).is_some_and(|suffix| {
                    suffix.as_bytes() == host.as_bytes() && suffix.typ() == Some(psl::Type::Icann)
                }))
        {
            return Err(format!("invalid wildcard host permission: {pattern:?}"));
        }
        Ok(Self {
            scheme: scheme.into(),
            host,
            port,
            path: path.into(),
            subdomains,
        })
    }

    fn matches(&self, url: &Url) -> bool {
        let host = normalize(url.host_str().unwrap_or_default());
        (self.scheme == "*" || self.scheme == url.scheme())
            && (self.port.is_empty()
                || url.port().is_some_and(|port| self.port == port.to_string()))
            && (host == self.host
                || (self.subdomains && host.ends_with(&format!(".{}", self.host))))
            && super::wildcard_match(&self.path, url.path())
    }
}

fn normalize(host: &str) -> String {
    host.trim().trim_end_matches('.').to_ascii_lowercase()
}

fn is_local(host: &str) -> bool {
    host.parse::<IpAddr>().is_ok() || host == "localhost" || host.ends_with(".localhost")
}

fn domain_authority(domain: &str) -> Result<(String, String), String> {
    let domain = domain.trim();
    if domain.contains("://") {
        let url = Url::parse(domain).map_err(|e| format!("invalid extension domain: {e}"))?;
        Ok((
            normalize(url.host_str().unwrap_or_default()),
            url.port().map(|port| port.to_string()).unwrap_or_default(),
        ))
    } else {
        split_authority(domain.split(['/', '?', '#']).next().unwrap_or_default())
    }
}

fn split_authority(authority: &str) -> Result<(String, String), String> {
    let authority = authority.trim();
    let (host, port) = if let Some(ipv6) = authority.strip_prefix('[') {
        let (host, tail) = ipv6
            .split_once(']')
            .ok_or_else(|| format!("invalid host: {authority}"))?;
        let port = if tail.is_empty() {
            ""
        } else {
            tail.strip_prefix(':')
                .ok_or_else(|| format!("invalid host: {authority}"))?
        };
        (host, port)
    } else if authority.matches(':').count() == 1 {
        authority.split_once(':').unwrap()
    } else {
        (authority, "")
    };
    Ok((normalize(host), port.into()))
}
