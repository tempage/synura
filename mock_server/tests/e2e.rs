use std::net::SocketAddr;
use std::path::PathBuf;
use std::time::Duration;

use mock_server::{Config, Server};

struct TestEnv {
    addr: SocketAddr,
    _handle: tokio::task::JoinHandle<()>,
}

fn get_workspace_root() -> PathBuf {
    if std::path::Path::new("extensions").is_dir() {
        PathBuf::from(".")
    } else if std::path::Path::new("../extensions").is_dir() {
        PathBuf::from("..")
    } else {
        PathBuf::from("../..")
    }
}

impl TestEnv {
    async fn start() -> Self {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let root = get_workspace_root();

        let cfg = Config {
            addr: addr.to_string(),
            synura_script_path: root.join("testdata/mock_server/synura.js"),
            extensions_dir: root.join("extensions"),
            additional_script_path: None,
        };

        let server = Server::new(cfg).unwrap();
        let handle = tokio::spawn(async move {
            server.run_with_listener(listener).await.unwrap();
        });

        // Yield to allow server to start
        tokio::time::sleep(Duration::from_millis(10)).await;

        Self {
            addr,
            _handle: handle,
        }
    }

    fn url(&self, path: &str) -> String {
        format!("http://{}{}", self.addr, path)
    }
}

#[tokio::test]
async fn test_e2e_full_flow() {
    let env = TestEnv::start().await;
    let client = wreq::Client::builder().build().unwrap();

    // 1. GET /login
    let resp = client.get(&env.url("/login")).send().await.unwrap();
    assert_eq!(resp.status().as_u16(), 200);

    let cookie_header = resp
        .headers()
        .get("set-cookie")
        .expect("expected set-cookie")
        .to_str()
        .unwrap()
        .to_string();
    assert!(cookie_header.contains("session_id="));
    let token_cookie = cookie_header.split(';').next().unwrap().to_string();

    // 2. GET /login/get without cookie -> 401
    let resp = client.get(&env.url("/login/get")).send().await.unwrap();
    assert_eq!(resp.status().as_u16(), 401);

    // 3. GET /login/get with cookie -> 200
    let resp = client
        .get(&env.url("/login/get?query=pass"))
        .header("Cookie", &token_cookie)
        .send()
        .await
        .unwrap();
    assert_eq!(resp.status().as_u16(), 200);
    let bytes = resp.bytes().await.unwrap();
    let json: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(json["query"]["query"], "pass");

    // 4. POST /login/post with cookie -> 200
    let resp = client
        .post(&env.url("/login/post"))
        .header("Cookie", &token_cookie)
        .header("Content-Type", "application/json")
        .body(r#"{"e2e":true}"#)
        .send()
        .await
        .unwrap();
    assert_eq!(resp.status().as_u16(), 200);
    let bytes = resp.bytes().await.unwrap();
    let json: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(json["json"]["e2e"], true);

    // 5. GET /synura.js -> 200
    let resp = client.get(&env.url("/synura.js")).send().await.unwrap();
    assert_eq!(resp.status().as_u16(), 200);
    let bytes = resp.bytes().await.unwrap();
    assert!(bytes.len() > 100);

    // 6. GET /examples/basic/hello_world.js -> 200
    let resp = client
        .get(&env.url("/examples/basic/hello_world.js"))
        .send()
        .await
        .unwrap();
    assert_eq!(resp.status().as_u16(), 200);

    // 7. GET /logout -> 200
    let resp = client
        .get(&env.url("/logout"))
        .header("Cookie", &token_cookie)
        .send()
        .await
        .unwrap();
    assert_eq!(resp.status().as_u16(), 200);

    // 8. GET /login/get after logout -> 401
    let resp = client
        .get(&env.url("/login/get"))
        .header("Cookie", &token_cookie)
        .send()
        .await
        .unwrap();
    assert_eq!(resp.status().as_u16(), 401);
}
