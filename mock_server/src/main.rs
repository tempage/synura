use std::path::PathBuf;
use std::process;

use mock_server::{Config, Server};

fn print_usage() {
    eprintln!("Usage of mock_server:");
    eprintln!("  -addr string");
    eprintln!("        server listen address (default \":8080\")");
    eprintln!("  -examples string");
    eprintln!("        directory served under /examples/ (default \"extensions\")");
    eprintln!("  -path string");
    eprintln!("        optional directory to serve at /ext/");
    eprintln!("  -synura string");
    eprintln!("        path to synura.js to serve (default \"testdata/mock_server/synura.js\")");
}

#[tokio::main]
async fn main() {
    let mut cfg = Config::default();
    let args: Vec<String> = std::env::args().skip(1).collect();

    let mut i = 0;
    let mut positional = Vec::new();

    while i < args.len() {
        let arg = &args[i];
        if arg == "-h" || arg == "--help" || arg == "-help" {
            print_usage();
            process::exit(0);
        } else if arg == "-addr" || arg == "--addr" {
            i += 1;
            if i < args.len() {
                cfg.addr = args[i].clone();
            } else {
                eprintln!("flag needs an argument: {arg}");
                print_usage();
                process::exit(2);
            }
        } else if let Some(val) = arg.strip_prefix("-addr=").or_else(|| arg.strip_prefix("--addr=")) {
            cfg.addr = val.to_string();
        } else if arg == "-path" || arg == "--path" {
            i += 1;
            if i < args.len() {
                cfg.additional_script_path = Some(PathBuf::from(&args[i]));
            } else {
                eprintln!("flag needs an argument: {arg}");
                print_usage();
                process::exit(2);
            }
        } else if let Some(val) = arg.strip_prefix("-path=").or_else(|| arg.strip_prefix("--path=")) {
            cfg.additional_script_path = Some(PathBuf::from(val));
        } else if arg == "-synura" || arg == "--synura" {
            i += 1;
            if i < args.len() {
                cfg.synura_script_path = PathBuf::from(&args[i]);
            } else {
                eprintln!("flag needs an argument: {arg}");
                print_usage();
                process::exit(2);
            }
        } else if let Some(val) = arg.strip_prefix("-synura=").or_else(|| arg.strip_prefix("--synura=")) {
            cfg.synura_script_path = PathBuf::from(val);
        } else if arg == "-examples" || arg == "--examples" {
            i += 1;
            if i < args.len() {
                cfg.extensions_dir = PathBuf::from(&args[i]);
            } else {
                eprintln!("flag needs an argument: {arg}");
                print_usage();
                process::exit(2);
            }
        } else if let Some(val) = arg.strip_prefix("-examples=").or_else(|| arg.strip_prefix("--examples=")) {
            cfg.extensions_dir = PathBuf::from(val);
        } else if !arg.starts_with('-') {
            positional.push(arg.clone());
        } else {
            eprintln!("flag provided but not defined: {arg}");
            print_usage();
            process::exit(2);
        }
        i += 1;
    }

    if cfg.additional_script_path.is_none() && !positional.is_empty() {
        cfg.additional_script_path = Some(PathBuf::from(&positional[0]));
    }

    let server = match Server::new(cfg) {
        Ok(s) => s,
        Err(err) => {
            eprintln!("{err}");
            process::exit(1);
        }
    };

    if let Err(err) = server.run().await {
        eprintln!("server error: {err}");
        process::exit(1);
    }
}
