use std::cmp::Reverse;
use std::net::IpAddr;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

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
    expires: Option<SystemTime>,
}

impl RedirectCookies {
    pub(super) fn collect(&mut self, url: &Url, headers: &[(String, String)]) {
        self.collect_at(url, headers, SystemTime::now());
    }

    fn collect_at(&mut self, url: &Url, headers: &[(String, String)], now: SystemTime) {
        self.0.retain(|cookie| !cookie.expired(now));
        for (_, value) in headers
            .iter()
            .filter(|(key, _)| key.eq_ignore_ascii_case("set-cookie"))
        {
            let Some(cookie) = Cookie::parse(url, value, now) else {
                continue;
            };
            // An insecure response cannot shadow or delete a Secure cookie.
            if url.scheme() != "https"
                && self.0.iter().any(|old| {
                    old.secure
                        && old.name == cookie.name
                        && (domain_matches(&old.domain, &cookie.domain)
                            || domain_matches(&cookie.domain, &old.domain))
                        && path_matches(&cookie.path, &old.path)
                })
            {
                continue;
            }
            let previous = self.0.iter().position(|old| {
                old.name == cookie.name
                    && old.domain == cookie.domain
                    && old.host_only == cookie.host_only
                    && old.path == cookie.path
            });
            match (previous, cookie.expired(now)) {
                (Some(index), true) => {
                    self.0.remove(index);
                }
                // Replacing in place retains creation order for equal paths.
                (Some(index), false) => self.0[index] = cookie,
                (None, false) => self.0.push(cookie),
                (None, true) => {}
            }
        }
    }

    pub(super) fn header(&self, url: &Url) -> Option<String> {
        self.header_at(url, SystemTime::now())
    }

    fn header_at(&self, url: &Url, now: SystemTime) -> Option<String> {
        let host = url.host_str()?;
        let mut cookies: Vec<_> = self
            .0
            .iter()
            .filter(|cookie| {
                !cookie.expired(now)
                    && (host == cookie.domain
                        || (!cookie.host_only && domain_matches(host, &cookie.domain)))
                    && path_matches(url.path(), &cookie.path)
                    && (!cookie.secure || url.scheme() == "https")
            })
            .collect();
        cookies.sort_by_key(|cookie| Reverse(cookie.path.len()));
        let values: Vec<_> = cookies
            .into_iter()
            .map(|cookie| {
                if cookie.name.is_empty() {
                    cookie.value.clone()
                } else {
                    format!("{}={}", cookie.name, cookie.value)
                }
            })
            .collect();
        (!values.is_empty()).then(|| values.join("; "))
    }
}

impl Cookie {
    fn parse(url: &Url, value: &str, now: SystemTime) -> Option<Self> {
        if value
            .bytes()
            .any(|byte| matches!(byte, 0..=8 | 10..=31 | 127))
        {
            return None;
        }
        let mut parts = value.split(';').map(trim_wsp);
        let pair = parts.next()?;
        let (name, value) = pair.split_once('=').unwrap_or(("", pair));
        let (name, value) = (trim_wsp(name), trim_wsp(value));
        if (name.is_empty() && value.is_empty()) || name.len() + value.len() > 4096 {
            return None;
        }
        let host = url.host_str()?;
        let default_path = url
            .path()
            .rsplit_once('/')
            .map(|(parent, _)| if parent.is_empty() { "/" } else { parent })
            .unwrap_or("/");
        let mut domain = "";
        let mut path = default_path;
        let mut explicit_root_path = false;
        let mut secure = false;
        let mut expires = None;
        let mut max_age = None;
        for attribute in parts {
            let (key, value) = attribute.split_once('=').unwrap_or((attribute, ""));
            let value = trim_wsp(value);
            if value.len() > 1024 {
                continue;
            }
            match trim_wsp(key).to_ascii_lowercase().as_str() {
                "domain" => domain = value.strip_prefix('.').unwrap_or(value),
                "path" => {
                    path = if value.starts_with('/') {
                        value
                    } else {
                        default_path
                    };
                    explicit_root_path = value == "/";
                }
                "secure" => secure = true,
                "expires" => {
                    if let Some(date) = cookie_date(value) {
                        expires = Some(date);
                    }
                }
                "max-age" => {
                    if let Some(seconds) = max_age_seconds(value) {
                        max_age = Some(now.checked_add(Duration::from_secs(seconds))?);
                    }
                }
                _ => {}
            }
        }
        let mut host_only = domain.is_empty();
        let domain = if host_only {
            host.to_owned()
        } else {
            let domain = canonical_domain(domain)?;
            if !domain_matches(host, &domain) {
                return None;
            }
            if psl::suffix_str(&domain) == Some(domain.as_str()) {
                if domain != host {
                    return None;
                }
                // A public suffix can set cookies for its own host only.
                host_only = true;
            }
            domain
        };
        if secure && url.scheme() != "https" {
            return None;
        }
        let prefix = if name.is_empty() { value } else { name };
        let secure_prefix = starts_with_ignore_case(prefix, "__Secure-");
        let host_prefix = starts_with_ignore_case(prefix, "__Host-");
        if (name.is_empty() && (secure_prefix || host_prefix))
            || (secure_prefix && !secure)
            || (host_prefix && (!secure || !host_only || !explicit_root_path))
        {
            return None;
        }
        Some(Self {
            name: name.into(),
            value: value.into(),
            domain,
            path: path.into(),
            host_only,
            secure,
            expires: max_age.or(expires),
        })
    }

    fn expired(&self, now: SystemTime) -> bool {
        self.expires.is_some_and(|expires| expires <= now)
    }
}

fn trim_wsp(value: &str) -> &str {
    value.trim_matches([' ', '\t'])
}

fn starts_with_ignore_case(value: &str, prefix: &str) -> bool {
    value
        .get(..prefix.len())
        .is_some_and(|start| start.eq_ignore_ascii_case(prefix))
}

fn is_ip(host: &str) -> bool {
    host.trim_start_matches('[')
        .trim_end_matches(']')
        .parse::<IpAddr>()
        .is_ok()
}

fn canonical_domain(domain: &str) -> Option<String> {
    let domain = domain.to_ascii_lowercase();
    if is_ip(&domain) {
        return Some(domain);
    }
    if domain.len() > 253
        || domain.split('.').any(|label| {
            label.is_empty()
                || label.len() > 63
                || label.starts_with('-')
                || label.ends_with('-')
                || !label
                    .bytes()
                    .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')
        })
    {
        return None;
    }
    Some(domain)
}

fn domain_matches(host: &str, domain: &str) -> bool {
    host == domain
        || (!is_ip(host)
            && !is_ip(domain)
            && host
                .strip_suffix(domain)
                .is_some_and(|prefix| prefix.ends_with('.')))
}

fn path_matches(path: &str, cookie_path: &str) -> bool {
    path == cookie_path
        || path
            .strip_prefix(cookie_path)
            .is_some_and(|suffix| cookie_path.ends_with('/') || suffix.starts_with('/'))
}

fn max_age_seconds(value: &str) -> Option<u64> {
    let digits = value.strip_prefix('-').unwrap_or(value);
    if digits.is_empty() || !digits.bytes().all(|byte| byte.is_ascii_digit()) {
        return None;
    }
    if value.starts_with('-') {
        return Some(0);
    }
    // Cookie lifetime limits cap even syntactically valid overflowing integers.
    Some(digits.parse::<u64>().unwrap_or(u64::MAX).min(400 * 86400))
}

// RFC 6265 cookie dates accept more layouts than an HTTP-date header.
fn cookie_date(value: &str) -> Option<SystemTime> {
    let mut time = None;
    let mut day = None;
    let mut month = None;
    let mut year = None;
    for token in value
        .as_bytes()
        .split(|byte| matches!(*byte, 0x09 | 0x20..=0x2f | 0x3b..=0x40 | 0x5b..=0x60 | 0x7b..=0x7e))
    {
        if time.is_none() {
            if let Some(parsed) = date_time(token) {
                time = Some(parsed);
                continue;
            }
        }
        if day.is_none() {
            if let Some((parsed, _)) = date_number(token, 1, 2) {
                day = Some(parsed);
                continue;
            }
        }
        if month.is_none() {
            if let Some(prefix) = token.get(..3) {
                month = [
                    b"jan", b"feb", b"mar", b"apr", b"may", b"jun", b"jul", b"aug", b"sep", b"oct",
                    b"nov", b"dec",
                ]
                .iter()
                .position(|name| prefix.eq_ignore_ascii_case(*name));
                if month.is_some() {
                    continue;
                }
            }
        }
        if year.is_none() {
            year = date_number(token, 2, 4).map(|(parsed, _)| parsed);
        }
    }
    let [hour, minute, second] = time?;
    let day = day?;
    let month = month?;
    let mut year = i64::from(year?);
    year += match year {
        0..=69 => 2000,
        70..=99 => 1900,
        _ => 0,
    };
    if year < 1601 || hour > 23 || minute > 59 || second > 59 {
        return None;
    }
    let leap = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    let month_days = [
        31,
        if leap { 29 } else { 28 },
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];
    if day == 0 || day > month_days[month] {
        return None;
    }
    let previous_year = year - 1;
    let days_before_year =
        365 * previous_year + previous_year / 4 - previous_year / 100 + previous_year / 400;
    let days_before_month: u16 = month_days[..month].iter().sum();
    let days = days_before_year - 719162 + i64::from(days_before_month + day - 1);
    let seconds =
        days * 86400 + i64::from(hour) * 3600 + i64::from(minute) * 60 + i64::from(second);
    if seconds >= 0 {
        UNIX_EPOCH.checked_add(Duration::from_secs(seconds as u64))
    } else {
        UNIX_EPOCH.checked_sub(Duration::from_secs(seconds.unsigned_abs()))
    }
}

fn date_number(token: &[u8], min: usize, max: usize) -> Option<(u16, usize)> {
    let length = token
        .iter()
        .take_while(|byte| byte.is_ascii_digit())
        .count();
    if !(min..=max).contains(&length) {
        return None;
    }
    Some((
        token[..length]
            .iter()
            .fold(0, |number, byte| number * 10 + u16::from(byte - b'0')),
        length,
    ))
}

fn date_time(token: &[u8]) -> Option<[u16; 3]> {
    let (hour, length) = date_number(token, 1, 2)?;
    let rest = token.get(length..)?.strip_prefix(b":")?;
    let (minute, length) = date_number(rest, 1, 2)?;
    let rest = rest.get(length..)?.strip_prefix(b":")?;
    let (second, _) = date_number(rest, 1, 2)?;
    Some([hour, minute, second])
}

#[cfg(test)]
mod tests {
    use super::*;

    fn now() -> SystemTime {
        UNIX_EPOCH + Duration::from_secs(1_700_000_000)
    }

    fn set(jar: &mut RedirectCookies, url: &str, cookies: &[&str]) {
        jar.collect_at(
            &Url::parse(url).unwrap(),
            &cookies
                .iter()
                .map(|value| ("Set-Cookie".into(), (*value).into()))
                .collect::<Vec<_>>(),
            now(),
        );
    }

    fn get(jar: &RedirectCookies, url: &str) -> Option<String> {
        jar.header_at(&Url::parse(url).unwrap(), now())
    }

    #[test]
    fn cookies_match_hosts_paths_and_secure_transport() {
        let mut jar = RedirectCookies::default();
        set(
            &mut jar,
            "https://a.example.com/account/start",
            &[
                "host=one",
                "shared=two; Domain=.EXAMPLE.COM; Path=/",
                "secure=three; Path=/; Secure",
            ],
        );
        assert_eq!(
            get(&jar, "https://a.example.com/account/end").as_deref(),
            Some("host=one; shared=two; secure=three")
        );
        assert_eq!(
            get(&jar, "https://a.example.com/accounting").as_deref(),
            Some("shared=two; secure=three")
        );
        assert_eq!(
            get(&jar, "http://a.example.com/account/end").as_deref(),
            Some("host=one; shared=two")
        );
        assert_eq!(
            get(&jar, "https://b.example.com/account/end").as_deref(),
            Some("shared=two")
        );
        assert_eq!(get(&jar, "https://unrelated.test/account/end"), None);
    }

    #[test]
    fn cookie_names_are_case_sensitive_and_replacement_retains_order() {
        let mut jar = RedirectCookies::default();
        set(
            &mut jar,
            "https://example.com/",
            &[
                "Token=one; Path=/",
                "token=two; Path=/",
                "tail=three; Path=/",
                "Token=four; Path=/",
                "deep=five; Path=/a",
            ],
        );
        assert_eq!(
            get(&jar, "https://example.com/a/end").as_deref(),
            Some("deep=five; Token=four; token=two; tail=three")
        );
        set(
            &mut jar,
            "https://example.com/",
            &["token=deleted; Path=/; Max-Age=0"],
        );
        assert_eq!(
            get(&jar, "https://example.com/").as_deref(),
            Some("Token=four; tail=three")
        );
    }

    #[test]
    fn cookie_max_age_takes_precedence_and_expires_between_redirects() {
        let mut jar = RedirectCookies::default();
        set(
            &mut jar,
            "https://example.com/",
            &[
                "short=one; Max-Age=2; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
                "deleted=two; Expires=Thu, 01 Jan 2099 00:00:00 GMT; Max-Age=-1",
                "old=three; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
                "invalid=four; Expires=bad; Max-Age=+2",
            ],
        );
        assert_eq!(
            get(&jar, "https://example.com/").as_deref(),
            Some("short=one; invalid=four")
        );
        assert_eq!(
            jar.header_at(
                &Url::parse("https://example.com/").unwrap(),
                now() + Duration::from_secs(2)
            )
            .as_deref(),
            Some("invalid=four")
        );
        set(
            &mut jar,
            "https://example.com/",
            &["invalid=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT"],
        );
        assert_eq!(
            get(&jar, "https://example.com/").as_deref(),
            Some("short=one")
        );
        assert_eq!(
            max_age_seconds("99999999999999999999999999999999999"),
            Some(400 * 86400)
        );
        assert_eq!(
            max_age_seconds("-9999999999999999999999999999999999"),
            Some(0)
        );
        assert_eq!(max_age_seconds("10seconds"), None);
    }

    #[test]
    fn cookie_domains_reject_public_suffixes_and_malformed_values() {
        let mut jar = RedirectCookies::default();
        set(
            &mut jar,
            "https://a.example.com/",
            &[
                "a=1; Domain=com",
                "b=2; Domain=other.com",
                "c=3; Domain=example.com.",
                "d=4; Domain=..example.com",
                "e=5; Domain=example..com",
                "f=6; Domain=example.com:443",
                "ok=7; Domain=example.com",
            ],
        );
        assert_eq!(get(&jar, "https://b.example.com/").as_deref(), Some("ok=7"));
        set(
            &mut jar,
            "https://a.github.io/",
            &["private=bad; Domain=github.io"],
        );
        assert_eq!(get(&jar, "https://b.github.io/"), None);
        set(
            &mut jar,
            "https://github.io/",
            &["self=ok; Domain=github.io"],
        );
        assert_eq!(get(&jar, "https://github.io/").as_deref(), Some("self=ok"));
        assert_eq!(get(&jar, "https://b.github.io/"), None);
    }

    #[test]
    fn cookie_domains_do_not_suffix_match_ip_addresses() {
        let mut jar = RedirectCookies::default();
        set(
            &mut jar,
            "http://127.0.0.1/",
            &["suffix=bad; Domain=0.0.1", "exact=ok; Domain=127.0.0.1"],
        );
        assert_eq!(
            get(&jar, "http://127.0.0.1:1234/").as_deref(),
            Some("exact=ok")
        );
        assert_eq!(get(&jar, "http://127.0.0.2/"), None);
        set(&mut jar, "http://[::1]/", &["ipv6=ok"]);
        assert_eq!(get(&jar, "http://[::1]:1234/").as_deref(), Some("ipv6=ok"));
        assert_eq!(get(&jar, "http://[::2]/"), None);
    }

    #[test]
    fn insecure_responses_cannot_set_or_shadow_secure_cookies() {
        let mut jar = RedirectCookies::default();
        set(
            &mut jar,
            "https://example.com/login",
            &["id=secure; Secure; Path=/login"],
        );
        set(
            &mut jar,
            "http://example.com/login",
            &[
                "new=bad; Secure",
                "id=deleted; Max-Age=0; Path=/login",
                "id=shadow; Path=/login/en",
            ],
        );
        assert_eq!(
            get(&jar, "https://example.com/login/en").as_deref(),
            Some("id=secure")
        );
        assert_eq!(get(&jar, "http://example.com/login/en"), None);
    }

    #[test]
    fn host_and_secure_prefixes_require_their_scope_attributes() {
        let mut jar = RedirectCookies::default();
        set(
            &mut jar,
            "https://example.com/",
            &[
                "__Secure-bad=1",
                "__Host-domain=2; Secure; Path=/; Domain=example.com",
                "__Host-path=3; Secure",
                "__secure-good=4; Secure",
                "__Host-good=5; Secure; Path=/",
                "=__Host-disguised=6",
            ],
        );
        assert_eq!(
            get(&jar, "https://example.com/").as_deref(),
            Some("__secure-good=4; __Host-good=5")
        );
    }

    #[test]
    fn cookie_dates_accept_cookie_formats_and_reject_impossible_dates() {
        let expected = UNIX_EPOCH + Duration::from_secs(784_111_777);
        for date in [
            "Sun, 06 Nov 1994 08:49:37 GMT",
            "Sunday, 06-Nov-94 08:49:37 GMT",
            "Sun Nov  6 08:49:37 1994",
            "06/november/1994 8:49:37 UTC",
        ] {
            assert_eq!(cookie_date(date), Some(expected), "{date}");
        }
        assert_eq!(
            cookie_date("Thu, 01 Jan 1970 00:00:00 GMT"),
            Some(UNIX_EPOCH)
        );
        assert_eq!(
            cookie_date("Wed, 31 Dec 1969 23:59:59 GMT"),
            Some(UNIX_EPOCH - Duration::from_secs(1))
        );
        assert!(cookie_date("29 Feb 2000 00:00:00 GMT").is_some());
        for date in [
            "29 Feb 1900 00:00:00 GMT",
            "31 Apr 2024 00:00:00 GMT",
            "01 Jan 1600 00:00:00 GMT",
            "01 Jan 2024 24:00:00 GMT",
            "01 Jan 2024 00:00:60 GMT",
            "01 Jan 2024 000:00:00 GMT",
            "not a date",
        ] {
            assert_eq!(cookie_date(date), None, "{date}");
        }
    }
}
