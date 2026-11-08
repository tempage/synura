use serde_json::json;
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

struct FixtureDirectory(PathBuf);

impl Drop for FixtureDirectory {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}

#[test]
fn post_link_blocks_show_labels_and_full_destinations() {
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let directory = FixtureDirectory(std::env::temp_dir().join(format!(
        "synurart-render-test-{}-{stamp}",
        std::process::id()
    )));
    fs::create_dir(&directory.0).unwrap();
    let destination = "https://example.test/articles/sample?source=cli#detail";
    let long_destination = format!(
        "https://example.test/{}?view=full#end",
        "long-path-".repeat(20)
    );
    let value_only = format!("https://example.test/{}", "value-only-".repeat(15));
    let view = json!({"view":"/views/post", "models":{"content":[
        {"type":"link", "value":"Example article", "link":destination},
        {"type":"link", "value":"", "label":"Fallback label", "link":"https://example.test/fallback"},
        {"type":"link", "value":"Href label", "link":" ", "href":"https://example.test/href"},
        {"type":"link", "value":"https://example.test/same", "link":"https://example.test/same"},
        {"type":"link", "value":"Long label ".repeat(20), "link":long_destination},
        {"type":"link", "value":value_only},
        {"type":"text", "value":"Plain text still renders normally"}
    ]}});
    let script = directory.0.join("fixture.js");
    fs::write(&script, format!(
        "globalThis.SYNURA = {{name:'render fixture', main:{{home:function(){{synura.open({view});}}}}}};"
    )).unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_synurart"))
        .args(["-ext", script.to_str().unwrap(), "-e", "render"])
        .env("SYNURART_COLOR", "never")
        .current_dir(&directory.0)
        .output()
        .unwrap();
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(
        stdout.contains(&format!("1. link: Example article -> {destination}")),
        "{stdout}"
    );
    assert!(
        stdout.contains("link: Fallback label -> https://example.test/fallback"),
        "{stdout}"
    );
    assert!(
        stdout.contains("link: Href label -> https://example.test/href"),
        "{stdout}"
    );
    assert!(
        stdout.contains("link: https://example.test/same"),
        "{stdout}"
    );
    assert!(!stdout.contains("https://example.test/same ->"), "{stdout}");
    assert!(
        stdout.contains(&format!(" -> {long_destination}")),
        "{stdout}"
    );
    assert!(stdout.contains(&format!("link: {value_only}")), "{stdout}");
    assert!(
        stdout.contains("text: Plain text still renders normally"),
        "{stdout}"
    );
}
