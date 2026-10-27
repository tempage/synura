use url::Url;

// Only lives for one fetch call; extensions retain control of persistent cookies.
#[derive(Default)]
pub(super) struct RedirectCookies(Vec<Cookie>);

struct Cookie {
    name: String,
    value: String,
    domain: String,
    path: String,
    host_only: bool,
    secure: bool,
}

impl RedirectCookies {
    pub(super) fn collect(&mut self, url: &Url, headers: &[(String, String)]) {
        for (_, value) in headers
            .iter()
            .filter(|(key, _)| key.eq_ignore_ascii_case("set-cookie"))
        {
            let mut parts = value.split(';').map(str::trim);
            let Some((name, value)) = parts.next().and_then(|part| part.split_once('=')) else {
                continue;
            };
            if name.trim().is_empty() {
                continue;
            }
            let host = url.host_str().unwrap_or("").trim_end_matches('.');
            let mut cookie = Cookie {
                name: name.trim().into(),
                value: value.trim().into(),
                domain: host.into(),
                path: url
                    .path()
                    .rsplit_once('/')
                    .map(|(parent, _)| if parent.is_empty() { "/" } else { parent })
                    .unwrap_or("/")
                    .into(),
                host_only: true,
                secure: false,
            };
            for attribute in parts {
                let (key, value) = attribute.split_once('=').unwrap_or((attribute, ""));
                match key.trim().to_ascii_lowercase().as_str() {
                    "domain" => {
                        cookie.domain = value.trim().trim_matches('.').to_ascii_lowercase();
                        cookie.host_only = false;
                    }
                    "path" if value.trim().starts_with('/') => cookie.path = value.trim().into(),
                    "secure" => cookie.secure = true,
                    _ => {}
                }
            }
            if cookie.domain.is_empty()
                || (host != cookie.domain && !host.ends_with(&format!(".{}", cookie.domain)))
            {
                continue;
            }
            self.0.retain(|old| {
                !old.name.eq_ignore_ascii_case(&cookie.name)
                    || old.domain != cookie.domain
                    || old.path != cookie.path
            });
            self.0.push(cookie);
        }
    }

    pub(super) fn header(&self, url: &Url) -> Option<String> {
        let host = url.host_str().unwrap_or("").trim_end_matches('.');
        let values: Vec<_> = self
            .0
            .iter()
            .filter(|cookie| {
                let domain = host == cookie.domain
                    || (!cookie.host_only && host.ends_with(&format!(".{}", cookie.domain)));
                let path = url.path() == cookie.path
                    || url.path().strip_prefix(&cookie.path).is_some_and(|suffix| {
                        cookie.path.ends_with('/') || suffix.starts_with('/')
                    });
                domain && path && (!cookie.secure || url.scheme() == "https")
            })
            .map(|cookie| format!("{}={}", cookie.name, cookie.value))
            .collect();
        (!values.is_empty()).then(|| values.join("; "))
    }
}
