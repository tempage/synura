use std::borrow::Cow;
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use std::env;
use std::fs;
use std::io::{self, BufRead, IsTerminal};
use std::path::{Path, PathBuf};
use std::rc::Rc;
use std::time::Instant;

use base64::{engine::general_purpose, Engine as _};
use encoding_rs::{Encoding, UTF_8};
use kuchiki::traits::TendrilSink;
use kuchiki::{NodeData, NodeRef};
use rquickjs::{CatchResultExt, Coerced, Context, Ctx, Exception, Function, Runtime as JsRuntime};
use rustyline::completion::{Completer, Pair};
use rustyline::error::ReadlineError;
use rustyline::highlight::Highlighter;
use rustyline::hint::Hinter;
use rustyline::validate::Validator;
use rustyline::{CompletionType, Config, Editor, Helper};
use serde::{Deserialize, Serialize};
use serde_json::{json, Map, Value};
use url::Url;

mod fetch_scope;
mod fetch_session;
#[cfg(test)]
mod fetch_tests;
mod fetch_transport;

use fetch_scope::{FetchScope, NetworkPackage};
use fetch_session::RedirectCookies;
pub use fetch_transport::FetchCancellation;
use fetch_transport::{HttpResponse, HttpTransport, TransportSettings, MAX_BODY_BYTES};

const DEFAULT_TIMEOUT_MS: u64 = 10_000;
const DEFAULT_LOCALE: &str = "en-US";

const C_RESET: &str = "\x1b[0m";
const C_BOLD: &str = "\x1b[1m";
const C_DIM: &str = "\x1b[2m";
const C_UNDERLINE: &str = "\x1b[4m";
const C_RED: &str = "\x1b[31m";
const C_GREEN: &str = "\x1b[32m";
const C_BLUE: &str = "\x1b[34m";
const C_MAGENTA: &str = "\x1b[35m";
const C_CYAN: &str = "\x1b[36m";
const C_BRIGHT_BLACK: &str = "\x1b[90m";
const C_BRIGHT_RED: &str = "\x1b[91m";
const C_BRIGHT_BLUE: &str = "\x1b[94m";
const C_BRIGHT_MAGENTA: &str = "\x1b[95m";
const C_BRIGHT_GREEN: &str = "\x1b[92m";
const C_BRIGHT_YELLOW: &str = "\x1b[93m";
const C_BRIGHT_CYAN: &str = "\x1b[96m";
const C_BRIGHT_WHITE: &str = "\x1b[97m";

fn color_enabled() -> bool {
    match env::var("SYNURART_COLOR") {
        Ok(value) if value.eq_ignore_ascii_case("always") => true,
        Ok(value) if value.eq_ignore_ascii_case("never") => false,
        _ => env::var_os("NO_COLOR").is_none() && io::stdout().is_terminal(),
    }
}

fn color(text: impl AsRef<str>, codes: &[&str]) -> String {
    let text = text.as_ref();
    if codes.is_empty() || !color_enabled() {
        return text.to_string();
    }
    let mut out = String::new();
    for code in codes {
        out.push_str(code);
    }
    out.push_str(text);
    out.push_str(C_RESET);
    out
}

fn bold(text: impl AsRef<str>) -> String {
    color(text, &[C_BOLD])
}

fn dim(text: impl AsRef<str>) -> String {
    color(text, &[C_DIM])
}

fn tag(label: &str, codes: &[&str]) -> String {
    color(format!("[{label}]"), codes)
}

fn fmt_index(n: usize, width: usize) -> String {
    color(format!("{n:>width$}."), &[C_BRIGHT_BLACK])
}

fn index_width(count: usize) -> usize {
    count.max(1).to_string().len()
}

pub fn run_cli() {
    if let Err(err) = run() {
        eprintln!("{} {err}", color("error:", &[C_RED]));
        std::process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let opts = Options::parse(env::args().collect())?;
    if opts.help {
        if opts.json {
            json_out(&help_commands_json());
        } else {
            print_help();
        }
        return Ok(());
    }

    let storage_path = env::current_dir()
        .map_err(|e| format!("resolve working directory: {e}"))?
        .join(".synurart")
        .join("local_storage.json");

    let mut state = ShellState::new(opts.json, storage_path, opts.ext_path.as_deref())?;
    state.render_load_after_command = opts.eval.is_none();
    if let Some(path) = opts.ext_path.as_deref() {
        state.load(path, !opts.no_home, opts.eval.is_none())?;
    } else if !opts.json {
        println!(
            "{} {}",
            dim("No extension loaded."),
            dim("Use: load <path/to/extension.js>")
        );
    }

    if let Some(cmd) = opts.eval.as_deref() {
        let args = split_args(cmd)?;
        if !args.is_empty() {
            state.run_command(&args)?;
        }
        return Ok(());
    }

    if io::stdin().is_terminal() {
        return run_interactive_shell(&mut state);
    }

    for line in io::stdin().lock().lines() {
        let line = line.map_err(|e| format!("read stdin: {e}"))?;
        if run_input_line(&mut state, &line)? {
            break;
        }
    }
    Ok(())
}

fn run_interactive_shell(state: &mut ShellState) -> Result<(), String> {
    let config = Config::builder()
        .history_ignore_space(true)
        .completion_type(CompletionType::List)
        .auto_add_history(true)
        .build();
    let completion_snapshot = Rc::new(RefCell::new(CompletionSnapshot::default()));
    let mut editor =
        Editor::<SynurartCompleter, rustyline::history::DefaultHistory>::with_config(config)
            .map_err(|e| format!("initialize line editor: {e}"))?;
    editor.set_helper(Some(SynurartCompleter {
        snapshot: completion_snapshot.clone(),
    }));
    loop {
        *completion_snapshot.borrow_mut() = CompletionSnapshot::from_state(state);
        match editor.readline("synurart> ") {
            Ok(line) => {
                if run_input_line(state, &line)? {
                    break;
                }
            }
            Err(ReadlineError::Interrupted | ReadlineError::Eof) => break,
            Err(err) => return Err(format!("read line: {err}")),
        }
    }
    Ok(())
}

fn run_input_line(state: &mut ShellState, line: &str) -> Result<bool, String> {
    let trimmed = line.trim();
    if trimmed.is_empty() {
        return Ok(false);
    }
    let args = match split_args(trimmed) {
        Ok(args) => args,
        Err(err) => {
            print_shell_error(state.json, &format!("parse error: {err}"));
            return Ok(false);
        }
    };
    if args.first().is_some_and(|cmd| is_exit_command(cmd)) {
        return Ok(true);
    }
    if let Err(err) = state.run_command(&args) {
        print_shell_error(state.json, &err);
    }
    Ok(false)
}

fn is_exit_command(cmd: &str) -> bool {
    matches!(cmd.to_ascii_lowercase().as_str(), "quit" | "q" | "exit")
}

fn print_shell_error(json_mode: bool, err: &str) {
    if json_mode {
        json_out(&json!({"type":"error","message":err}));
    } else {
        eprintln!("{} {err}", color("error:", &[C_RED]));
    }
}

#[derive(Default, Clone)]
struct CompletionSnapshot {
    value: Value,
}

impl CompletionSnapshot {
    fn from_state(state: &ShellState) -> Self {
        Self {
            value: state.runtime.snapshot().unwrap_or_else(|_| json!({})),
        }
    }

    fn view_ids(&self) -> Vec<String> {
        self.value
            .get("views")
            .and_then(Value::as_array)
            .into_iter()
            .flatten()
            .filter_map(|view| view.get("id").and_then(Value::as_i64))
            .map(|id| id.to_string())
            .collect()
    }

    fn active_models(&self) -> Option<Map<String, Value>> {
        self.value
            .get("activeView")
            .and_then(|view| view.get("models"))
            .and_then(Value::as_object)
            .cloned()
    }
}

struct SynurartCompleter {
    snapshot: Rc<RefCell<CompletionSnapshot>>,
}

impl Helper for SynurartCompleter {}
impl Validator for SynurartCompleter {}

impl Highlighter for SynurartCompleter {
    fn highlight_prompt<'b, 's: 'b, 'p: 'b>(
        &'s self,
        prompt: &'p str,
        _default: bool,
    ) -> Cow<'b, str> {
        Cow::Owned(color(prompt, &[C_BRIGHT_CYAN, C_BOLD]))
    }
}

impl Hinter for SynurartCompleter {
    type Hint = String;
}

impl Completer for SynurartCompleter {
    type Candidate = Pair;

    fn complete(
        &self,
        line: &str,
        pos: usize,
        _ctx: &rustyline::Context<'_>,
    ) -> rustyline::Result<(usize, Vec<Self::Candidate>)> {
        let ctx = parse_completion_context(line, pos);
        Ok((ctx.token_start, self.suggestions(&ctx)))
    }
}

impl SynurartCompleter {
    fn suggestions(&self, ctx: &CompletionContext) -> Vec<Pair> {
        let snapshot = self.snapshot.borrow();
        if ctx.arg_index == 0 {
            return filter_completion_suggestions(REPL_COMMAND_SUGGESTIONS, &ctx.current, false);
        }
        let Some(cmd) = ctx.args_before.first().map(|cmd| cmd.to_ascii_lowercase()) else {
            return Vec::new();
        };

        match cmd.as_str() {
            "load" if ctx.arg_index == 1 => path_suggestions(&ctx.current, true),
            "view" | "v" | "render" | "resume" | "refresh" | "r" | "n" | "next" | "query"
            | "submit" | "close" | "c"
                if ctx.arg_index == 1 =>
            {
                completion_pairs(snapshot.view_ids(), &ctx.current, false)
            }
            "menu" if ctx.arg_index == 1 => {
                completion_pairs(snapshot.view_ids(), &ctx.current, false)
            }
            "menu" if ctx.arg_index == 2 => {
                completion_pairs(menu_labels(&snapshot), &ctx.current, false)
            }
            "event" if ctx.arg_index == 1 => {
                completion_pairs(snapshot.view_ids(), &ctx.current, false)
            }
            "event" if ctx.arg_index == 2 => filter_completion_suggestions(
                REPL_EVENT_SUGGESTIONS,
                &ctx.current.to_ascii_uppercase(),
                false,
            ),
            "storage" if ctx.arg_index == 1 => {
                filter_completion_suggestions(&["local", "session", "clear"], &ctx.current, false)
            }
            "storage"
                if ctx.arg_index == 2
                    && ctx
                        .args_before
                        .get(1)
                        .is_some_and(|arg| arg.eq_ignore_ascii_case("clear")) =>
            {
                filter_completion_suggestions(&["local", "session", "all"], &ctx.current, false)
            }
            "timeout" if ctx.arg_index == 1 => {
                filter_completion_suggestions(&["10s", "5s", "30s", "1m"], &ctx.current, false)
            }
            "locale" if ctx.arg_index == 1 => {
                filter_completion_suggestions(&["en-US", "ko-KR", "ja-JP"], &ctx.current, false)
            }
            "mapurl" if ctx.arg_index == 1 => {
                filter_completion_suggestions(&["list", "clear"], &ctx.current, false)
            }
            "mapurl" if ctx.arg_index == 2 => path_suggestions(&ctx.current, false),
            "tap" | "click" => self.tap_suggestions(&snapshot, ctx),
            "s" if ctx.arg_index == 1 => {
                completion_pairs(index_labels(&snapshot), &ctx.current, false)
            }
            "s" if ctx.arg_index == 2 => completion_pairs(snapshot.view_ids(), &ctx.current, false),
            "itemmenu" if ctx.arg_index == 1 => {
                completion_pairs(snapshot.view_ids(), &ctx.current, false)
            }
            "itemmenu" if ctx.arg_index == 2 => {
                completion_pairs(item_menu_labels(&snapshot), &ctx.current, false)
            }
            "itemmenu" if ctx.arg_index == 3 => {
                completion_pairs(index_labels(&snapshot), &ctx.current, false)
            }
            "reorder" if ctx.arg_index == 1 => {
                completion_pairs(snapshot.view_ids(), &ctx.current, false)
            }
            "reorder" if ctx.arg_index == 2 || ctx.arg_index == 3 => {
                completion_pairs(index_labels(&snapshot), &ctx.current, false)
            }
            _ => Vec::new(),
        }
    }

    fn tap_suggestions(&self, snapshot: &CompletionSnapshot, ctx: &CompletionContext) -> Vec<Pair> {
        match ctx.arg_index {
            1 => filter_completion_suggestions(
                &["index", "title", "author", "category"],
                &ctx.current,
                false,
            ),
            2 => match ctx.args_before.get(1).map(|arg| arg.to_ascii_lowercase()) {
                Some(mode) if mode == "index" => {
                    completion_pairs(index_labels(snapshot), &ctx.current, false)
                }
                Some(mode) if mode == "title" => {
                    completion_pairs(item_field_labels(snapshot, "title"), &ctx.current, true)
                }
                Some(mode) if mode == "author" => {
                    completion_pairs(author_labels(snapshot), &ctx.current, true)
                }
                Some(mode) if mode == "category" => {
                    completion_pairs(category_labels(snapshot), &ctx.current, true)
                }
                _ => Vec::new(),
            },
            3 => completion_pairs(snapshot.view_ids(), &ctx.current, false),
            _ => Vec::new(),
        }
    }
}

struct CompletionContext {
    args_before: Vec<String>,
    arg_index: usize,
    current: String,
    token_start: usize,
}

fn parse_completion_context(line: &str, pos: usize) -> CompletionContext {
    let cursor = pos.min(line.len());
    let bytes = line.as_bytes();
    let mut args = Vec::new();
    let mut current = String::new();
    let mut token_start = cursor;
    let mut current_start = cursor;
    let mut quote = None;
    let mut escaped = false;
    let mut token_active = false;

    for i in 0..cursor {
        let byte = bytes[i];
        if escaped {
            if !token_active {
                token_active = true;
                current_start = i;
            }
            current.push(byte as char);
            escaped = false;
            continue;
        }

        if byte == b'\\' {
            if !token_active {
                token_active = true;
                current_start = i;
            }
            escaped = true;
            continue;
        }

        if let Some(q) = quote {
            if byte == q {
                quote = None;
                continue;
            }
            if !token_active {
                token_active = true;
                current_start = i;
            }
            current.push(byte as char);
            continue;
        }

        match byte {
            b'\'' | b'"' => {
                if !token_active {
                    token_active = true;
                    current_start = i;
                }
                quote = Some(byte);
            }
            b' ' | b'\t' => {
                if token_active {
                    args.push(std::mem::take(&mut current));
                    token_active = false;
                }
            }
            _ => {
                if !token_active {
                    token_active = true;
                    current_start = i;
                }
                current.push(byte as char);
            }
        }
    }

    if token_active {
        token_start = current_start;
    }

    CompletionContext {
        arg_index: args.len(),
        args_before: args,
        current,
        token_start,
    }
}

const REPL_COMMAND_SUGGESTIONS: &[&str] = &[
    "help", "h", "?", "load", "quit", "q", "exit", "views", "ls", "v", "view", "render", "home",
    "deeplink", "resume", "event", "refresh", "r", "n", "next", "menu", "query", "submit", "tap",
    "click", "s", "itemmenu", "reorder", "c", "close", "timeout", "locale", "mapurl", "storage",
    "eval",
];

const REPL_EVENT_SUGGESTIONS: &[&str] = &[
    "LOAD",
    "CLICK",
    "AUTHOR_CLICK",
    "CATEGORY_CLICK",
    "REFRESH",
    "MENU_CLICK",
    "ITEM_MENU_CLICK",
    "QUERY",
    "SUBMIT",
    "REORDER",
    "CLOSE",
    "SCROLL_TO_END",
];

#[derive(Default)]
struct Options {
    ext_path: Option<PathBuf>,
    no_home: bool,
    eval: Option<String>,
    json: bool,
    help: bool,
}

impl Options {
    fn parse(args: Vec<String>) -> Result<Self, String> {
        let mut opts = Options::default();
        let mut i = 1;
        while i < args.len() {
            match args[i].as_str() {
                "-ext" | "--ext" => {
                    i += 1;
                    opts.ext_path = args.get(i).map(PathBuf::from);
                }
                "-no-home" | "--no-home" => opts.no_home = true,
                "-json" | "--json" => opts.json = true,
                "-e" | "--eval" => {
                    i += 1;
                    opts.eval = args.get(i).cloned();
                }
                "-h" | "--help" => opts.help = true,
                other if other.starts_with("--ext=") => {
                    opts.ext_path = Some(PathBuf::from(&other["--ext=".len()..]));
                }
                other if !other.starts_with('-') && opts.ext_path.is_none() => {
                    opts.ext_path = Some(PathBuf::from(other));
                }
                other => return Err(format!("unknown argument: {other}\n\n{}", help_text())),
            }
            i += 1;
        }
        Ok(opts)
    }
}

struct ShellState {
    runtime: SynurartRuntime,
    json: bool,
    storage_path: PathBuf,
    ext_path: Option<PathBuf>,
    timeout_ms: u64,
    locale: String,
    render_load_after_command: bool,
}

impl ShellState {
    fn new(json: bool, storage_path: PathBuf, ext_path: Option<&Path>) -> Result<Self, String> {
        let namespace = ext_path
            .map(|path| absolute_path(path).unwrap_or_else(|_| path.to_path_buf()))
            .unwrap_or_default();
        let runtime = SynurartRuntime::new(json, storage_path.clone(), namespace)?;
        Ok(Self {
            runtime,
            json,
            storage_path,
            ext_path: ext_path.map(PathBuf::from),
            timeout_ms: DEFAULT_TIMEOUT_MS,
            locale: DEFAULT_LOCALE.to_string(),
            render_load_after_command: true,
        })
    }

    fn reset_runtime(&mut self, ext_path: &Path) -> Result<(), String> {
        let namespace = absolute_path(ext_path).unwrap_or_else(|_| ext_path.to_path_buf());
        let runtime = SynurartRuntime::new(self.json, self.storage_path.clone(), namespace)?;
        self.runtime = runtime;
        self.runtime.set_timeout(self.timeout_ms)?;
        self.runtime.set_locale(&self.locale)?;
        self.ext_path = Some(ext_path.to_path_buf());
        Ok(())
    }

    fn load(&mut self, ext_path: &Path, auto_home: bool, render_after: bool) -> Result<(), String> {
        self.reset_runtime(ext_path)?;
        self.runtime.load_extension(ext_path)?;
        if !self.json {
            println!(
                "{} {}",
                color("✓", &[C_GREEN, C_BOLD]),
                color(ext_path.display().to_string(), &[C_CYAN])
            );
        }
        if auto_home {
            if let Err(err) = self.runtime.call_main("home", &[]) {
                if self.json {
                    eprintln!("{}", json!({"type":"error","message":err}));
                } else {
                    println!("{} {err}", color("✗", &[C_RED]));
                }
            }
        }
        if render_after {
            self.render_views()
        } else {
            Ok(())
        }
    }

    fn run_command(&mut self, args: &[String]) -> Result<(), String> {
        let cmd = args[0].to_ascii_lowercase();
        match cmd.as_str() {
            "help" | "h" | "?" => {
                if self.json {
                    json_out(&help_commands_json());
                } else {
                    print_help();
                }
            }
            "load" => {
                if args.len() < 2 {
                    return Err("usage: load <path/to/extension.js> [--no-home]".to_string());
                }
                let auto_home = !matches!(
                    args.get(2).map(String::as_str),
                    Some("--no-home" | "nohome")
                );
                self.load(
                    Path::new(&args[1]),
                    auto_home,
                    self.render_load_after_command,
                )?;
            }
            "views" | "ls" => self.render_views()?,
            "v" => {
                if args.len() == 1 {
                    self.render_views()?;
                } else if args.len() == 2 {
                    self.render_view(parse_i64(&args[1])?)?;
                } else {
                    return Err("usage: v [viewId]".to_string());
                }
            }
            "view" => {
                if args.len() != 2 {
                    return Err("usage: view <id>".to_string());
                }
                self.render_view(parse_i64(&args[1])?)?;
            }
            "render" => {
                let id = self.resolve_view_id(args.get(1))?;
                self.render_view_content(id)?;
            }
            "home" => {
                self.runtime.call_main("home", &[])?;
                self.render_views()?;
            }
            "deeplink" => {
                if args.len() < 2 {
                    return Err("usage: deeplink <url>".to_string());
                }
                self.runtime.call_main("deeplink", &[json!(args[1])])?;
                self.render_views()?;
            }
            "resume" => {
                if args.len() < 2 {
                    return Err("usage: resume <viewId> [jsonContext]".to_string());
                }
                let ctx = if args.len() > 2 {
                    parse_json_object(&args[2])?
                } else {
                    json!({})
                };
                self.runtime
                    .call_main("resume", &[json!(parse_i64(&args[1])?), ctx])?;
                self.emit_ok();
            }
            "event" => {
                if args.len() < 3 {
                    return Err("usage: event <viewId> <EVENT_ID> [jsonData]".to_string());
                }
                let data = if args.len() > 3 {
                    parse_json_object(&args[3])?
                } else {
                    json!({})
                };
                self.runtime
                    .emit(parse_i64(&args[1])?, &args[2].to_ascii_uppercase(), data)?;
                self.emit_ok();
            }
            "n" | "next" => {
                if args.len() > 2 {
                    return Err(format!("usage: {cmd} [viewId]"));
                }
                let id = self.resolve_view_id(args.get(1))?;
                self.runtime.emit(id, "SCROLL_TO_END", json!({}))?;
                self.emit_ok();
            }
            "refresh" | "r" => {
                if args.len() > 2 {
                    return Err(format!("usage: {cmd} [viewId]"));
                }
                let id = self.resolve_view_id(args.get(1))?;
                self.runtime.emit(id, "REFRESH", json!({}))?;
                self.emit_ok();
            }
            "menu" => {
                if args.len() < 3 {
                    return Err("usage: menu <viewId> <label>".to_string());
                }
                self.runtime
                    .emit(parse_i64(&args[1])?, "MENU_CLICK", json!({"menu":args[2]}))?;
                self.emit_ok();
            }
            "query" => {
                if args.len() < 3 {
                    return Err("usage: query <viewId> <text>".to_string());
                }
                self.runtime
                    .emit(parse_i64(&args[1])?, "QUERY", json!({"query":args[2]}))?;
                self.emit_ok();
            }
            "submit" => {
                if args.len() < 3 {
                    return Err("usage: submit <viewId> <jsonData>".to_string());
                }
                self.runtime
                    .emit(parse_i64(&args[1])?, "SUBMIT", parse_json_object(&args[2])?)?;
                self.emit_ok();
            }
            "s" => {
                if args.len() < 2 || args.len() > 3 {
                    return Err("usage: s <index> [viewId]".to_string());
                }
                let mut tap = vec!["index".to_string(), args[1].clone()];
                tap.extend(args.iter().skip(2).cloned());
                self.handle_tap(&tap)?;
                self.emit_ok();
            }
            "tap" | "click" => {
                self.handle_tap(&args[1..])?;
                self.emit_ok();
            }
            "itemmenu" => {
                self.handle_item_menu(&args[1..])?;
                self.emit_ok();
            }
            "reorder" => {
                self.handle_reorder(&args[1..])?;
                self.emit_ok();
            }
            "c" | "close" => {
                if args.len() > 2 {
                    return Err(format!("usage: {cmd} [viewId]"));
                }
                let id = self.resolve_view_id(args.get(1))?;
                self.runtime.close(id)?;
                self.emit_ok();
            }
            "timeout" => {
                if args.len() > 2 {
                    return Err("usage: timeout [duration]".to_string());
                }
                if let Some(raw) = args.get(1) {
                    self.timeout_ms = parse_duration_ms(raw)?;
                    self.runtime.set_timeout(self.timeout_ms)?;
                }
                if self.json {
                    json_out(
                        &json!({"type":"timeout","timeout":format_duration(self.timeout_ms),"seconds":self.timeout_ms as f64 / 1000.0}),
                    );
                } else {
                    println!(
                        "{} {}",
                        dim("timeout:"),
                        color(format_duration(self.timeout_ms), &[C_BRIGHT_YELLOW])
                    );
                }
            }
            "locale" => {
                if args.len() > 2 {
                    return Err("usage: locale [tag]".to_string());
                }
                if let Some(raw) = args.get(1) {
                    self.locale = normalize_locale(raw)?;
                    self.runtime.set_locale(&self.locale)?;
                }
                if self.json {
                    json_out(&json!({"type":"locale","locale":self.locale}));
                } else {
                    println!(
                        "{} {}",
                        dim("locale:"),
                        color(&self.locale, &[C_BRIGHT_YELLOW])
                    );
                }
            }
            "mapurl" => self.handle_mapurl(&args[1..])?,
            "storage" => self.handle_storage(&args[1..])?,
            "eval" => {
                if args.len() < 2 {
                    return Err("usage: eval <javascript>".to_string());
                }
                let result = self.runtime.eval_js(&args[1..].join(" "))?;
                if self.json {
                    json_out(&result);
                } else if let Some(value) = result.get("result") {
                    println!("{}", stringify_json_value(value));
                }
            }
            other => return Err(format!("unknown command: {other} (type 'help')")),
        }
        Ok(())
    }

    fn handle_tap(&mut self, args: &[String]) -> Result<(), String> {
        if args.len() < 2 {
            return Err("usage: tap <title|author|category|index> <value> [viewId]".to_string());
        }
        let kind = args[0].to_ascii_lowercase();
        let id = self.resolve_view_id(args.get(2))?;
        let view = self.runtime.view(id)?;
        let models = view
            .pointer("/models")
            .cloned()
            .unwrap_or_else(|| json!({}));
        let items = model_details(models.get("contents"));
        match kind.as_str() {
            "index" => {
                if items.is_empty() {
                    return Err(format!("view #{id} has no tappable list items"));
                }
                let index = args[1]
                    .parse::<usize>()
                    .map_err(|e| format!("invalid index: {e}"))?;
                if index == 0 || index > items.len() {
                    return Err(format!("index out of range: 1..{}", items.len()));
                }
                let mut item = items[index - 1].clone();
                ensure_object_field(&mut item, "_index", json!(index - 1));
                self.runtime.emit(id, "CLICK", item)
            }
            "title" => {
                for (index, mut item) in items.into_iter().enumerate() {
                    let title = item
                        .get("title")
                        .map(value_text)
                        .unwrap_or_default()
                        .trim()
                        .to_string();
                    if eq_fold(&title, args[1].trim()) {
                        ensure_object_field(&mut item, "_index", json!(index));
                        return self.runtime.emit(id, "CLICK", item);
                    }
                }
                Err(format!("title not found in view #{id}: {:?}", args[1]))
            }
            "author" | "category" => {
                let key = kind.as_str();
                for item in items {
                    let label = item
                        .get(key)
                        .map(value_text)
                        .unwrap_or_default()
                        .trim()
                        .to_string();
                    if eq_fold(&label, args[1].trim()) {
                        let mut data = json!({key: label});
                        if let Some(link) = item.get("link").and_then(Value::as_str) {
                            ensure_object_field(&mut data, "link", json!(link));
                        }
                        return self.runtime.emit(
                            id,
                            if key == "author" {
                                "AUTHOR_CLICK"
                            } else {
                                "CATEGORY_CLICK"
                            },
                            data,
                        );
                    }
                }
                if models
                    .get(key)
                    .and_then(|model| model_message(Some(model)))
                    .is_some_and(|label| eq_fold(label.trim(), args[1].trim()))
                {
                    let mut data = json!({key: args[1]});
                    if let Some(link) = models
                        .get("link")
                        .and_then(|model| model_message(Some(model)))
                        .map(|link| link.trim().to_string())
                        .filter(|link| !link.is_empty())
                    {
                        ensure_object_field(&mut data, "link", json!(link));
                    }
                    return self.runtime.emit(
                        id,
                        if key == "author" {
                            "AUTHOR_CLICK"
                        } else {
                            "CATEGORY_CLICK"
                        },
                        data,
                    );
                }
                Err(format!("{key} not found in view #{id}: {:?}", args[1]))
            }
            other => Err(format!("unknown tap target: {other}")),
        }
    }

    fn handle_item_menu(&mut self, args: &[String]) -> Result<(), String> {
        if args.len() < 2 || args.len() > 3 {
            return Err("usage: itemmenu <viewId> <label> [index]".to_string());
        }
        let id = parse_i64(&args[0])?;
        let index = args
            .get(2)
            .map(|raw| {
                raw.parse::<usize>()
                    .map_err(|e| format!("invalid index: {e}"))
            })
            .transpose()?
            .unwrap_or(1);
        let view = self.runtime.view(id)?;
        let models = view
            .pointer("/models")
            .cloned()
            .unwrap_or_else(|| json!({}));
        let mut items = model_details(models.get("contents"));
        if items.is_empty() {
            items = model_details(models.get("comments"));
        }
        if items.is_empty() {
            return Err(format!("view #{id} has no item data for ITEM_MENU_CLICK"));
        }
        if index == 0 || index > items.len() {
            return Err(format!("index out of range: 1..{}", items.len()));
        }
        let mut payload = items[index - 1].clone();
        ensure_object_field(&mut payload, "menu", json!(args[1]));
        ensure_object_field(&mut payload, "_index", json!(index - 1));
        self.runtime.emit(id, "ITEM_MENU_CLICK", payload)
    }

    fn handle_reorder(&mut self, args: &[String]) -> Result<(), String> {
        if args.len() != 3 {
            return Err("usage: reorder <viewId> <fromIndex> <toIndex>".to_string());
        }
        let id = parse_i64(&args[0])?;
        let from = args[1]
            .parse::<usize>()
            .map_err(|e| format!("invalid fromIndex: {e}"))?;
        let to = args[2]
            .parse::<usize>()
            .map_err(|e| format!("invalid toIndex: {e}"))?;
        let view = self.runtime.view(id)?;
        let models = view
            .pointer("/models")
            .cloned()
            .unwrap_or_else(|| json!({}));
        let items = model_details(models.get("contents"));
        if items.is_empty() {
            return Err(format!("view #{id} has no list items for REORDER"));
        }
        if from == 0 || from > items.len() {
            return Err(format!("fromIndex out of range: 1..{}", items.len()));
        }
        if to == 0 || to > items.len() {
            return Err(format!("toIndex out of range: 1..{}", items.len()));
        }
        let mut payload = items[from - 1].clone();
        ensure_object_field(&mut payload, "_index", json!(from - 1));
        ensure_object_field(&mut payload, "_newIndex", json!(to - 1));
        self.runtime.emit(id, "REORDER", payload)
    }

    fn handle_mapurl(&mut self, args: &[String]) -> Result<(), String> {
        match args {
            [cmd] if cmd == "list" => {
                let overrides = self.runtime.host.borrow().fetch_overrides.clone();
                if self.json {
                    json_out(&json!({"type":"mapurl","overrides":overrides}));
                } else if overrides.is_empty() {
                    println!("{} {}", dim("url overrides:"), dim("(none)"));
                } else {
                    let mut urls = overrides.keys().cloned().collect::<Vec<_>>();
                    urls.sort();
                    println!("{}", dim("url overrides:"));
                    for url in urls {
                        if let Some(path) = overrides.get(&url) {
                            println!("  {} -> {}", color(url, &[C_BRIGHT_CYAN]), path);
                        }
                    }
                }
            }
            [cmd] if cmd == "clear" => {
                self.runtime.host.borrow_mut().fetch_overrides.clear();
                if self.json {
                    json_out(&json!({"type":"mapurl_cleared"}));
                } else {
                    println!(
                        "{} {}",
                        dim("cleared url overrides:"),
                        color("all", &[C_BRIGHT_YELLOW])
                    );
                }
            }
            [url, file] => {
                let abs = absolute_path(Path::new(file))?;
                fs::metadata(&abs).map_err(|e| format!("stat {}: {e}", abs.display()))?;
                self.runtime
                    .host
                    .borrow_mut()
                    .fetch_overrides
                    .insert(normalize_url(url)?, abs.to_string_lossy().into_owned());
                if self.json {
                    json_out(&json!({"type":"mapurl_set","url":url,"file":file}));
                } else {
                    println!(
                        "{} {} -> {}",
                        dim("mapped url:"),
                        color(url, &[C_BRIGHT_CYAN]),
                        file
                    );
                }
            }
            _ => return Err("usage: mapurl <url> <file> | mapurl list | mapurl clear".to_string()),
        }
        Ok(())
    }

    fn handle_storage(&mut self, args: &[String]) -> Result<(), String> {
        match args {
            [] => self.print_storage(true, true),
            [kind] if kind == "local" => self.print_storage(true, false),
            [kind] if kind == "session" => self.print_storage(false, true),
            [cmd] if cmd == "clear" => self.clear_storage(true, true),
            [cmd, kind] if cmd == "clear" && kind == "local" => self.clear_storage(true, false),
            [cmd, kind] if cmd == "clear" && kind == "session" => self.clear_storage(false, true),
            [cmd, kind] if cmd == "clear" && kind == "all" => self.clear_storage(true, true),
            _ => Err(
                "usage: storage [local|session] | storage clear [local|session|all]".to_string(),
            ),
        }
    }

    fn print_storage(&self, local: bool, session: bool) -> Result<(), String> {
        let snapshot = self.runtime.storage_snapshot()?;
        if self.json {
            let mut out = Map::new();
            out.insert("type".to_string(), json!("storage"));
            if local {
                out.insert(
                    "local".to_string(),
                    snapshot.get("local").cloned().unwrap_or_else(|| json!({})),
                );
            }
            if session {
                out.insert(
                    "session".to_string(),
                    snapshot
                        .get("session")
                        .cloned()
                        .unwrap_or_else(|| json!({})),
                );
            }
            json_out(&Value::Object(out));
        } else {
            if local {
                println!(
                    "{}",
                    pretty_json(snapshot.get("local").unwrap_or(&json!({})))
                );
            }
            if session {
                println!(
                    "{}",
                    pretty_json(snapshot.get("session").unwrap_or(&json!({})))
                );
            }
        }
        Ok(())
    }

    fn clear_storage(&mut self, local: bool, session: bool) -> Result<(), String> {
        self.runtime.clear_storage(local, session)?;
        if self.json {
            json_out(&json!({"type":"storage_cleared","local":local,"session":session}));
        } else {
            println!("{}", color("cleared storage", &[C_GREEN]));
        }
        Ok(())
    }

    fn resolve_view_id(&self, raw: Option<&String>) -> Result<i64, String> {
        if let Some(raw) = raw {
            if !raw.trim().is_empty() {
                return parse_i64(raw);
            }
        }
        let snapshot = self.runtime.snapshot()?;
        snapshot
            .get("views")
            .and_then(Value::as_array)
            .and_then(|views| {
                views
                    .iter()
                    .find(|view| view.get("active").and_then(Value::as_bool) == Some(true))
            })
            .and_then(|view| view.get("id"))
            .and_then(Value::as_i64)
            .ok_or_else(|| "no active views".to_string())
    }

    fn render_views(&self) -> Result<(), String> {
        let snapshot = self.runtime.snapshot()?;
        if self.json {
            json_out(&snapshot_for_json(&snapshot));
            return Ok(());
        }
        let views = snapshot
            .get("views")
            .and_then(Value::as_array)
            .cloned()
            .unwrap_or_default();
        if views.is_empty() {
            println!("{}", dim("(no views)"));
            return Ok(());
        }
        println!("{}", bold("View Stack:"));
        for view in &views {
            let id = view.get("id").and_then(Value::as_i64).unwrap_or_default();
            let path = view.get("path").and_then(Value::as_str).unwrap_or("");
            let title = view.get("title").and_then(Value::as_str).unwrap_or("");
            let items = view
                .get("items")
                .and_then(Value::as_u64)
                .unwrap_or_default();
            if view.get("active").and_then(Value::as_bool) == Some(true) {
                println!(
                    "{} {} {:<14} {}={} {}={}",
                    color("▸", &[C_BRIGHT_CYAN, C_BOLD]),
                    bold(format!("#{id}")),
                    color(path, &[C_CYAN]),
                    dim("title"),
                    color(format!("{title:?}"), &[C_BRIGHT_WHITE]),
                    dim("items"),
                    color(items.to_string(), &[C_BRIGHT_YELLOW])
                );
            } else {
                println!(
                    "{} {} {:<14} {}={} {}={}",
                    dim(" "),
                    dim(format!("#{id}")),
                    dim(path),
                    dim("title"),
                    dim(format!("{title:?}")),
                    dim("items"),
                    dim(items.to_string())
                );
            }
        }
        if let Some(active) = snapshot.get("activeView") {
            render_active_text(active);
        }
        Ok(())
    }

    fn render_view(&self, id: i64) -> Result<(), String> {
        let view = self.runtime.view(id)?;
        ensure_view_ok(&view, id)?;
        if self.json {
            json_out(&view_for_json(&view, "view"));
        } else {
            println!(
                "{} {}",
                bold("View"),
                color(format!("#{id}"), &[C_CYAN, C_BOLD])
            );
            print_json_compact(&view_data_for_display(&view));
            render_active_text(&view);
        }
        Ok(())
    }

    fn render_view_content(&self, id: i64) -> Result<(), String> {
        let view = self.runtime.view(id)?;
        ensure_view_ok(&view, id)?;
        if self.json {
            json_out(&view_for_json(&view, "render"));
        } else {
            render_active_text(&view);
        }
        Ok(())
    }

    fn emit_ok(&self) {
        if self.json {
            json_out(&json!({"type":"ok"}));
        }
    }
}

pub struct SynurartRuntime {
    _js_runtime: JsRuntime,
    ctx: Context,
    host: Rc<RefCell<HostState>>,
}

impl SynurartRuntime {
    pub fn new(json_mode: bool, storage_path: PathBuf, namespace: PathBuf) -> Result<Self, String> {
        let js_runtime = JsRuntime::new().map_err(|e| format!("create JS runtime: {e}"))?;
        let ctx = Context::full(&js_runtime).map_err(|e| format!("create JS context: {e}"))?;
        let local_storage = read_local_storage(&storage_path, &namespace)?;
        let host = Rc::new(RefCell::new(HostState::new(
            json_mode,
            storage_path,
            namespace,
            local_storage.clone(),
        )));
        let init_result: Result<(), String> = ctx.with(|ctx| {
            install_host_functions(&ctx, host.clone())
                .map_err(|e| format!("install host functions: {e}"))?;
            ctx.eval::<(), _>(BOOTSTRAP)
                .catch(&ctx)
                .map_err(|e| format!("bootstrap JS: {e}"))?;
            let init = format!(
                "__synurart_init({}, {}, {});",
                serde_json::to_string(&local_storage).unwrap(),
                serde_json::to_string(DEFAULT_LOCALE).unwrap(),
                DEFAULT_TIMEOUT_MS
            );
            ctx.eval::<(), _>(init)
                .catch(&ctx)
                .map_err(|e| format!("initialize JS globals: {e}"))
        });
        init_result?;
        Ok(Self {
            _js_runtime: js_runtime,
            ctx,
            host,
        })
    }

    pub fn load_extension(&self, path: &Path) -> Result<(), String> {
        let abs = absolute_path(path)?;
        let script =
            fs::read_to_string(&abs).map_err(|e| format!("read {}: {e}", abs.display()))?;
        self.host.borrow_mut().fetch_scope = Some(FetchScope::default());
        self.ctx.with(|ctx| -> Result<(), String> {
            ctx.eval::<(), _>(script)
                .catch(&ctx)
                .map_err(|e| format!("evaluate extension: {e}"))?;
            let package = ctx
                .eval::<String, _>("__synurart_network_package()")
                .catch(&ctx)
                .map_err(|e| format!("read extension network metadata: {e}"))?;
            self.host.borrow_mut().bind_network(&package)
        })
    }

    pub fn call_main(&self, name: &str, args: &[Value]) -> Result<(), String> {
        let src = format!(
            "__synurart_call_main({}, {});",
            serde_json::to_string(name).unwrap(),
            serde_json::to_string(args).unwrap()
        );
        self.eval_unit(&src)
    }

    pub fn emit(&self, view_id: i64, event_id: &str, data: Value) -> Result<(), String> {
        let src = format!(
            "__synurart_emit({}, {}, {});",
            view_id,
            serde_json::to_string(event_id).unwrap(),
            serde_json::to_string(&data).unwrap()
        );
        let result = self.eval_json(&src)?;
        if result.get("ok").and_then(Value::as_bool) == Some(true) {
            Ok(())
        } else {
            Err(result
                .get("error")
                .and_then(Value::as_str)
                .unwrap_or("event failed")
                .to_string())
        }
    }

    pub fn close(&self, view_id: i64) -> Result<(), String> {
        let src = format!("__synurart_close({view_id});");
        let result = self.eval_json(&src)?;
        if result.get("success").and_then(Value::as_bool) == Some(true) {
            Ok(())
        } else {
            Err(result
                .get("error")
                .and_then(Value::as_str)
                .unwrap_or("close failed")
                .to_string())
        }
    }

    pub fn snapshot(&self) -> Result<Value, String> {
        self.eval_json("__synurart_snapshot();")
    }

    pub fn view(&self, view_id: i64) -> Result<Value, String> {
        self.eval_json(&format!("__synurart_view({view_id});"))
    }

    pub fn storage_snapshot(&self) -> Result<Value, String> {
        self.eval_json("__synurart_storage_snapshot();")
    }

    pub fn clear_storage(&self, local: bool, session: bool) -> Result<(), String> {
        self.eval_unit(&format!(
            "__synurart_clear_storage({}, {});",
            local, session
        ))
    }

    pub fn set_timeout(&self, timeout_ms: u64) -> Result<(), String> {
        self.host.borrow_mut().timeout_ms = timeout_ms;
        self.eval_unit(&format!("__synurart_set_timeout({timeout_ms});"))
    }

    /// Set the host's proxy; this setting is not controlled by extension scripts.
    pub fn set_fetch_proxy(&self, proxy: Option<&str>) -> Result<(), String> {
        let proxy = proxy.map(str::trim).filter(|value| !value.is_empty());
        if let Some(proxy) = proxy {
            wreq::Proxy::all(proxy).map_err(|e| format!("invalid proxy: {e}"))?;
        }
        self.host.borrow_mut().fetch_proxy = proxy.map(str::to_string);
        Ok(())
    }

    /// Replace the request's cancellation handle before invoking an extension.
    pub fn set_fetch_cancellation(&self, cancellation: FetchCancellation) {
        self.host.borrow_mut().fetch_cancellation = cancellation;
    }

    pub fn set_locale(&self, locale: &str) -> Result<(), String> {
        let locale = normalize_locale(locale)?;
        self.host.borrow_mut().locale = locale.clone();
        self.eval_unit(&format!(
            "__synurart_set_locale({});",
            serde_json::to_string(&locale).unwrap()
        ))
    }

    pub fn eval_js(&self, code: &str) -> Result<Value, String> {
        let src = format!("__synurart_eval({});", serde_json::to_string(code).unwrap());
        self.eval_json(&src)
    }

    pub fn set_fetch_override(&self, url: &str, file: impl Into<PathBuf>) -> Result<(), String> {
        let normalized = normalize_url(url)?;
        let file = file.into();
        fs::metadata(&file).map_err(|e| format!("stat {}: {e}", file.display()))?;
        self.host
            .borrow_mut()
            .fetch_overrides
            .insert(normalized, file.to_string_lossy().into_owned());
        Ok(())
    }

    pub fn clear_fetch_overrides(&self) {
        self.host.borrow_mut().fetch_overrides.clear();
    }

    fn eval_json(&self, src: &str) -> Result<Value, String> {
        let text = self.ctx.with(|ctx| -> Result<String, String> {
            ctx.eval::<String, _>(src.to_string())
                .catch(&ctx)
                .map_err(|e| format!("execute JS: {e}"))
        })?;
        serde_json::from_str(&text).map_err(|e| format!("decode JS result: {e}: {text}"))
    }

    fn eval_unit(&self, src: &str) -> Result<(), String> {
        self.ctx.with(|ctx| -> Result<(), String> {
            ctx.eval::<(), _>(src.to_string())
                .catch(&ctx)
                .map_err(|e| format!("execute JS: {e}"))
        })
    }
}

fn install_host_functions(ctx: &Ctx<'_>, host: Rc<RefCell<HostState>>) -> rquickjs::Result<()> {
    let globals = ctx.globals();

    globals.set(
        "__host_log",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |level: Coerced<String>, args_json: Coerced<String>| {
                host.borrow().log(&level.0, &args_json.0);
            }
        })?,
    )?;

    globals.set(
        "__host_runtime_log",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |kind: Coerced<String>, data_json: Coerced<String>| {
                host.borrow().runtime_log(&kind.0, &data_json.0);
            }
        })?,
    )?;

    globals.set(
        "__host_fetch",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |ctx: Ctx<'_>, req_json: Coerced<String>| -> rquickjs::Result<String> {
                if host.borrow().fetch_scope.is_none() {
                    let package: String = ctx.eval("__synurart_network_package()")?;
                    host.borrow_mut()
                        .bind_network(&package)
                        .map_err(|e| Exception::throw_message(&ctx, &e))?;
                }
                host.borrow_mut()
                    .fetch(&req_json.0)
                    .map_err(|e| Exception::throw_message(&ctx, &e))
            }
        })?,
    )?;

    globals.set(
        "__host_storage_save",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |json_text: Coerced<String>| -> rquickjs::Result<()> {
                host.borrow_mut()
                    .save_local_storage(&json_text.0)
                    .map_err(|e| rquickjs::Error::new_into_js_message("rust", "js", e))
            }
        })?,
    )?;

    globals.set(
        "__host_dom_parse",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |html: Coerced<String>| -> i64 { host.borrow_mut().dom_parse(&html.0) }
        })?,
    )?;

    globals.set(
        "__host_dom_query",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64, selector: Coerced<String>| -> String {
                serde_json::to_string(&host.borrow_mut().dom_query(doc_id, node_id, &selector.0))
                    .unwrap()
            }
        })?,
    )?;

    globals.set(
        "__host_dom_children",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64| -> String {
                serde_json::to_string(&host.borrow_mut().dom_children(doc_id, node_id)).unwrap()
            }
        })?,
    )?;

    globals.set(
        "__host_dom_next_sibling",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64| -> i64 {
                host.borrow_mut().dom_sibling(doc_id, node_id, true)
            }
        })?,
    )?;

    globals.set(
        "__host_dom_previous_sibling",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64| -> i64 {
                host.borrow_mut().dom_sibling(doc_id, node_id, false)
            }
        })?,
    )?;

    globals.set(
        "__host_dom_text",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64| -> String { host.borrow().dom_text(doc_id, node_id) }
        })?,
    )?;

    globals.set(
        "__host_dom_tag",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64| -> String { host.borrow().dom_tag(doc_id, node_id) }
        })?,
    )?;

    globals.set(
        "__host_dom_attr",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64, name: Coerced<String>| -> String {
                host.borrow()
                    .dom_attr(doc_id, node_id, &name.0)
                    .unwrap_or_default()
            }
        })?,
    )?;

    globals.set(
        "__host_dom_has_attr",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64, name: Coerced<String>| -> bool {
                host.borrow().dom_attr(doc_id, node_id, &name.0).is_some()
            }
        })?,
    )?;

    globals.set(
        "__host_dom_set_attr",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64, name: Coerced<String>, value: Coerced<String>| {
                host.borrow_mut()
                    .dom_set_attr(doc_id, node_id, &name.0, &value.0);
            }
        })?,
    )?;

    globals.set(
        "__host_dom_remove_attr",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64, name: Coerced<String>| {
                host.borrow_mut().dom_remove_attr(doc_id, node_id, &name.0);
            }
        })?,
    )?;

    globals.set(
        "__host_dom_remove",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64| {
                host.borrow_mut().dom_remove(doc_id, node_id);
            }
        })?,
    )?;

    globals.set(
        "__host_dom_clone",
        Function::new(ctx.clone(), {
            let host = host.clone();
            move |doc_id: i64, node_id: i64| -> i64 { host.borrow_mut().dom_clone(doc_id, node_id) }
        })?,
    )?;

    globals.set(
        "__host_decode",
        Function::new(
            ctx.clone(),
            move |label: Coerced<String>,
                  body_base64: Coerced<String>|
                  -> rquickjs::Result<String> {
                decode_text(&label.0, &body_base64.0)
                    .map_err(|e| rquickjs::Error::new_into_js_message("rust", "js", e))
            },
        )?,
    )?;

    Ok(())
}

struct HostState {
    json_mode: bool,
    timeout_ms: u64,
    locale: String,
    storage_path: PathBuf,
    storage_namespace: PathBuf,
    local_storage: HashMap<String, String>,
    fetch_overrides: HashMap<String, String>,
    fetch_scope: Option<FetchScope>,
    fetch_proxy: Option<String>,
    fetch_cancellation: FetchCancellation,
    transport: Option<HttpTransport>,
    doms: HashMap<i64, DomDoc>,
    next_doc_id: i64,
}

impl HostState {
    fn new(
        json_mode: bool,
        storage_path: PathBuf,
        storage_namespace: PathBuf,
        local_storage: HashMap<String, String>,
    ) -> Self {
        Self {
            json_mode,
            timeout_ms: DEFAULT_TIMEOUT_MS,
            locale: DEFAULT_LOCALE.to_string(),
            storage_path,
            storage_namespace,
            local_storage,
            fetch_overrides: HashMap::new(),
            fetch_scope: None,
            fetch_proxy: None,
            fetch_cancellation: FetchCancellation::default(),
            transport: None,
            doms: HashMap::new(),
            next_doc_id: 1,
        }
    }

    fn log(&self, level: &str, args_json: &str) {
        let args = serde_json::from_str::<Vec<Value>>(args_json).unwrap_or_default();
        let message = args
            .iter()
            .map(stringify_json_value)
            .collect::<Vec<_>>()
            .join(" ");
        if self.json_mode {
            eprintln!(
                "{}",
                json!({"type":"console","level":level.to_ascii_lowercase(),"message":message})
            );
        } else {
            let code = match level.to_ascii_lowercase().as_str() {
                "error" => C_BRIGHT_RED,
                "warn" => C_BRIGHT_YELLOW,
                _ => C_BRIGHT_CYAN,
            };
            println!(
                "{} {}",
                tag(
                    &format!("JS {}", level.to_ascii_uppercase()),
                    &[code, C_BOLD]
                ),
                message
            );
        }
    }

    fn runtime_log(&self, kind: &str, data_json: &str) {
        if self.json_mode {
            eprintln!("{data_json}");
            return;
        }
        let data = serde_json::from_str::<Value>(data_json).unwrap_or_else(|_| json!({}));
        match kind {
            "open" => println!(
                "{} {} {}",
                tag("OPEN", &[C_BRIGHT_GREEN, C_BOLD]),
                color(
                    format!(
                        "#{}",
                        data.get("viewId")
                            .and_then(Value::as_i64)
                            .unwrap_or_default()
                    ),
                    &[C_BOLD]
                ),
                color(
                    data.get("path").and_then(Value::as_str).unwrap_or(""),
                    &[C_CYAN]
                )
            ),
            "update" => println!(
                "{} {} {}",
                tag("UPDATE", &[C_BRIGHT_YELLOW, C_BOLD]),
                color(
                    format!(
                        "#{}",
                        data.get("viewId")
                            .and_then(Value::as_i64)
                            .unwrap_or_default()
                    ),
                    &[C_BOLD]
                ),
                data.get("diff")
                    .map(stringify_json_value)
                    .unwrap_or_else(|| "{}".to_string())
            ),
            "close" => println!(
                "{} {}",
                tag("CLOSE", &[C_BRIGHT_RED, C_BOLD]),
                color(
                    format!(
                        "#{}",
                        data.get("viewId")
                            .and_then(Value::as_i64)
                            .unwrap_or_default()
                    ),
                    &[C_BOLD]
                )
            ),
            "event" => println!(
                "{} {} {} {}",
                tag("EVENT→EXT", &[C_MAGENTA, C_BOLD]),
                color(
                    format!(
                        "#{}",
                        data.get("viewId")
                            .and_then(Value::as_i64)
                            .unwrap_or_default()
                    ),
                    &[C_BOLD]
                ),
                color(
                    data.get("eventId").and_then(Value::as_str).unwrap_or(""),
                    &[C_BRIGHT_CYAN]
                ),
                data.get("data")
                    .map(stringify_json_value)
                    .unwrap_or_else(|| "{}".to_string())
            ),
            _ => {}
        }
    }

    fn save_local_storage(&mut self, json_text: &str) -> Result<(), String> {
        self.local_storage =
            serde_json::from_str(json_text).map_err(|e| format!("parse localStorage: {e}"))?;
        save_local_storage(
            &self.storage_path,
            &self.storage_namespace,
            &self.local_storage,
        )
    }

    fn bind_network(&mut self, package: &str) -> Result<(), String> {
        let package: NetworkPackage =
            serde_json::from_str(package).map_err(|e| format!("invalid network metadata: {e}"))?;
        self.fetch_scope = Some(FetchScope::new(package)?);
        Ok(())
    }

    fn fetch(&mut self, req_json: &str) -> Result<String, String> {
        let req: FetchRequest =
            serde_json::from_str(req_json).map_err(|e| format!("parse fetch request: {e}"))?;
        let (response, network_ms) = self.fetch_response(&req)?;
        let HttpResponse {
            status,
            status_text,
            url: final_url,
            headers,
            body,
            progress,
        } = response;

        let body_text = String::from_utf8_lossy(&body).into_owned();
        let method_label = req.method.to_ascii_uppercase();
        let logic_ms = 0u64;
        if self.json_mode {
            let mut data = json!({
                "type": "fetch",
                "method": method_label,
                "url": req.url,
                "status": status,
                "totalTime": format_go_duration_ms(network_ms),
                "totalMs": network_ms,
                "backendTime": format_go_duration_ms(logic_ms),
                "logicMs": logic_ms,
                "networkMs": network_ms,
                "logicTime": format_go_duration_ms(logic_ms),
                "networkTime": format_go_duration_ms(network_ms),
            });
            if let Some((_, location)) = headers
                .iter()
                .find(|(name, value)| name.eq_ignore_ascii_case("location") && !value.is_empty())
            {
                data["redirectTo"] = json!(location);
            }
            eprintln!("{}", data);
        } else {
            let status_color = if (200..400).contains(&status) {
                C_BRIGHT_GREEN
            } else if status >= 400 {
                C_BRIGHT_RED
            } else {
                C_BRIGHT_YELLOW
            };
            println!(
                "{} {} {} -> {} (b={}ms, network={}ms)",
                tag("FETCH", &[C_BLUE, C_BOLD]),
                method_label,
                color(req.url, &[C_CYAN]),
                color(status.to_string(), &[status_color, C_BOLD]),
                logic_ms,
                network_ms
            );
        }
        serde_json::to_string(&FetchResponse {
            status,
            status_text,
            url: final_url,
            headers,
            body_text,
            body_base64: general_purpose::STANDARD.encode(&body),
            progress,
        })
        .map_err(|e| format!("encode fetch response: {e}"))
    }

    fn fetch_response(&mut self, req: &FetchRequest) -> Result<(HttpResponse, u64), String> {
        let mut url = Url::parse(&req.url).map_err(|e| format!("invalid fetch url: {e}"))?;
        let scope = self
            .fetch_scope
            .as_ref()
            .ok_or("network scope is not initialized")?;
        let mut cookies = RedirectCookies::default();
        let mut network_ms = 0;
        for _ in 0..10 {
            if self.fetch_cancellation.is_cancelled() {
                return Err("context canceled".into());
            }
            scope.check(&url)?;
            let response = if let Some(file) = self.fetch_overrides.get(url.as_str()) {
                let body = fs::read(file).map_err(|e| format!("read override file {file}: {e}"))?;
                if body.len() > MAX_BODY_BYTES {
                    return Err(format!(
                        "fetch response exceeds {MAX_BODY_BYTES} bytes: {url}"
                    ));
                }
                let size = body.len() as i64;
                HttpResponse {
                    status: 200,
                    status_text: "200 OK".into(),
                    url: url.to_string(),
                    headers: vec![(
                        "content-type".into(),
                        mime_guess::from_path(file)
                            .first_or_text_plain()
                            .to_string(),
                    )],
                    body,
                    progress: if req.progress {
                        vec![(size, size)]
                    } else {
                        Vec::new()
                    },
                }
            } else {
                let started = Instant::now();
                let mut headers = req.headers.clone();
                if !headers
                    .iter()
                    .any(|(name, _)| name.eq_ignore_ascii_case("user-agent"))
                {
                    let ua = scope
                        .bypass
                        .as_deref()
                        .and_then(user_agent_from_bypass)
                        .unwrap_or("Go-http-client/1.1");
                    headers.insert(0, ("User-Agent".into(), ua.into()));
                }
                if !headers
                    .iter()
                    .any(|(name, _)| name.eq_ignore_ascii_case("cookie"))
                {
                    if let Some(value) = cookies.header(&url) {
                        headers.push(("Cookie".into(), value));
                    }
                }
                if self.transport.is_none() {
                    self.transport = Some(HttpTransport::new()?);
                }
                let response = self.transport.as_mut().unwrap().fetch(
                    url.as_str(),
                    req,
                    &headers,
                    TransportSettings {
                        bypass: scope.bypass.as_deref(),
                        timeout_ms: self.timeout_ms,
                        proxy: self.fetch_proxy.as_deref(),
                        cancellation: &self.fetch_cancellation,
                    },
                )?;
                network_ms += started.elapsed().as_millis() as u64;
                response
            };
            if (300..400).contains(&response.status) {
                cookies.collect(&url, &response.headers);
                if let Some((_, location)) = response
                    .headers
                    .iter()
                    .find(|(name, _)| name.eq_ignore_ascii_case("location"))
                {
                    url = url
                        .join(location)
                        .map_err(|e| format!("invalid redirect URL: {e}"))?;
                    scope.check(&url)?;
                    continue;
                }
            }
            return Ok((response, network_ms));
        }
        Err("stopped after 10 redirects".into())
    }

    fn dom_parse(&mut self, html: &str) -> i64 {
        let doc_id = self.next_doc_id;
        self.next_doc_id += 1;
        self.doms
            .insert(doc_id, DomDoc::new(kuchiki::parse_html().one(html)));
        doc_id
    }

    fn dom_query(&mut self, doc_id: i64, node_id: i64, selector: &str) -> Vec<i64> {
        if selector.contains(',') {
            return Vec::new();
        }
        let Some(doc) = self.doms.get_mut(&doc_id) else {
            return Vec::new();
        };
        let Some(node) = doc.nodes.get(&node_id).cloned() else {
            return Vec::new();
        };
        let mut out = Vec::new();
        let mut seen = HashSet::new();
        if node_matches(&node, selector) {
            let id = doc.intern(node.clone());
            seen.insert(id);
            out.push(id);
        }
        let Ok(matches) = node.select(selector) else {
            return out;
        };
        for matched in matches {
            let id = doc.intern(matched.as_node().clone());
            if seen.insert(id) {
                out.push(id);
            }
        }
        out
    }

    fn dom_children(&mut self, doc_id: i64, node_id: i64) -> Vec<i64> {
        let Some(doc) = self.doms.get_mut(&doc_id) else {
            return Vec::new();
        };
        let Some(node) = doc.nodes.get(&node_id).cloned() else {
            return Vec::new();
        };
        node.children()
            .filter(|child| child.as_element().is_some() || child.as_text().is_some())
            .map(|child| doc.intern(child))
            .collect()
    }

    fn dom_sibling(&mut self, doc_id: i64, node_id: i64, next: bool) -> i64 {
        let Some(doc) = self.doms.get_mut(&doc_id) else {
            return -1;
        };
        let Some(node) = doc.nodes.get(&node_id).cloned() else {
            return -1;
        };
        let mut sibling = if next {
            node.next_sibling()
        } else {
            node.previous_sibling()
        };
        while let Some(candidate) = sibling {
            if candidate.as_element().is_some() || candidate.as_text().is_some() {
                return doc.intern(candidate);
            }
            sibling = if next {
                candidate.next_sibling()
            } else {
                candidate.previous_sibling()
            };
        }
        -1
    }

    fn dom_text(&self, doc_id: i64, node_id: i64) -> String {
        self.doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .map(NodeRef::text_contents)
            .unwrap_or_default()
    }

    fn dom_tag(&self, doc_id: i64, node_id: i64) -> String {
        self.doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .and_then(|node| {
                node.as_element()
                    .map(|el| el.name.local.to_string().to_uppercase())
            })
            .unwrap_or_default()
    }

    fn dom_attr(&self, doc_id: i64, node_id: i64, name: &str) -> Option<String> {
        self.doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .and_then(|node| node.as_element())
            .and_then(|el| el.attributes.borrow().get(name).map(ToString::to_string))
    }

    fn dom_set_attr(&mut self, doc_id: i64, node_id: i64, name: &str, value: &str) {
        if let Some(el) = self
            .doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .and_then(|node| node.as_element())
        {
            el.attributes.borrow_mut().insert(name, value.to_string());
        }
    }

    fn dom_remove_attr(&mut self, doc_id: i64, node_id: i64, name: &str) {
        if let Some(el) = self
            .doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .and_then(|node| node.as_element())
        {
            el.attributes.borrow_mut().remove(name);
        }
    }

    fn dom_remove(&mut self, doc_id: i64, node_id: i64) {
        if let Some(node) = self
            .doms
            .get(&doc_id)
            .and_then(|doc| doc.nodes.get(&node_id))
            .cloned()
        {
            node.detach();
        }
    }

    fn dom_clone(&mut self, doc_id: i64, node_id: i64) -> i64 {
        let Some(doc) = self.doms.get_mut(&doc_id) else {
            return 0;
        };
        let Some(node) = doc.nodes.get(&node_id).cloned() else {
            return 0;
        };
        doc.intern(clone_node_deep(&node))
    }
}

fn clone_node_deep(node: &NodeRef) -> NodeRef {
    let cloned = match node.data() {
        NodeData::Text(text) => NodeRef::new_text(text.borrow().clone()),
        NodeData::Comment(comment) => NodeRef::new_comment(comment.borrow().clone()),
        NodeData::Element(element) => NodeRef::new_element(
            element.name.clone(),
            element.attributes.borrow().map.clone(),
        ),
        NodeData::ProcessingInstruction(value) => {
            let value = value.borrow();
            NodeRef::new_processing_instruction(value.0.clone(), value.1.clone())
        }
        NodeData::Doctype(value) => NodeRef::new_doctype(
            value.name.clone(),
            value.public_id.clone(),
            value.system_id.clone(),
        ),
        NodeData::Document(_) => NodeRef::new_document(),
        NodeData::DocumentFragment => NodeRef::new(NodeData::DocumentFragment),
    };
    for child in node.children() {
        cloned.append(clone_node_deep(&child));
    }
    cloned
}

struct DomDoc {
    nodes: HashMap<i64, NodeRef>,
    node_ids: HashMap<usize, i64>,
    next_node_id: i64,
}

impl DomDoc {
    fn new(root: NodeRef) -> Self {
        let key = node_key(&root);
        let mut nodes = HashMap::new();
        nodes.insert(0, root);
        let mut node_ids = HashMap::new();
        node_ids.insert(key, 0);
        Self {
            nodes,
            node_ids,
            next_node_id: 1,
        }
    }

    fn intern(&mut self, node: NodeRef) -> i64 {
        let key = node_key(&node);
        if let Some(id) = self.node_ids.get(&key) {
            return *id;
        }
        let id = self.next_node_id;
        self.next_node_id += 1;
        self.node_ids.insert(key, id);
        self.nodes.insert(id, node);
        id
    }
}

fn node_key(node: &NodeRef) -> usize {
    Rc::as_ptr(&node.0) as usize
}

#[derive(Deserialize)]
struct FetchRequest {
    url: String,
    method: String,
    #[serde(default)]
    headers: Vec<(String, String)>,
    body: String,
    progress: bool,
}

#[derive(Serialize)]
struct FetchResponse {
    status: u16,
    #[serde(rename = "statusText")]
    status_text: String,
    url: String,
    headers: Vec<(String, String)>,
    #[serde(rename = "bodyText")]
    body_text: String,
    #[serde(rename = "bodyBase64")]
    body_base64: String,
    progress: Vec<(i64, i64)>,
}

const BOOTSTRAP: &str = r#"
(function() {
  const state = { views: [], callbacks: {}, nextViewId: 1, localStorage: {}, sessionStorage: {}, locale: "en-US", timeoutMs: 10000, currentCallbackViewId: null };
  const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
  const asObject = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const modelWrapper = (value) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).every((key) => ["code","message","details","value"].includes(key));
  function inferModel(value) {
    if (value == null) return {};
    if (modelWrapper(value)) return clone(value);
    if (typeof value === "string") return { message: value };
    if (typeof value === "number") return { value: value, code: Math.trunc(value) };
    if (typeof value === "boolean") return { message: String(value) };
    if (Array.isArray(value)) return { details: clone(value) };
    if (typeof value === "object") return { message: JSON.stringify(value) };
    return { message: String(value) };
  }
  function processModels(models) {
    const out = {};
    for (const [key, value] of Object.entries(asObject(models))) out[key] = inferModel(value);
    return out;
  }
  function modelDetails(model) {
    return model && Array.isArray(model.details) ? model.details : [];
  }
  function modelMessage(model) {
    if (!model) return "";
    if (model.message != null) return String(model.message);
    if (model.value != null) return String(model.value);
    if (model.code != null) return String(model.code);
    return "";
  }
  function titleFor(view) {
    return String((view.data.styles && view.data.styles.title) || modelMessage(view.data.models && view.data.models.title) || "");
  }
  function renderedSummary(view) {
    if (!view) return null;
    const models = view.data.models || {};
    const styles = view.data.styles || {};
    if (view.path === "/views/list") {
      return {
        items: modelDetails(models.contents).map((item, index) => ({
          index: index + 1,
          title: item && item.title || "",
          author: item && item.author || "",
          link: item && item.link || "",
          meta: item && item.category ? "[cat:" + item.category + "]" : undefined
        })),
        menus: modelDetails(models.menus).map((item) => typeof item === "string" ? item : item && (item.label || item.message || ""))
      };
    }
    if (view.path === "/views/post") {
      return {
        title: modelMessage(models.title) || styles.title || "",
        author: modelMessage(models.author),
        contentBlocks: modelDetails(models.content).length,
        commentsCount: modelDetails(models.comments).length
      };
    }
    return {};
  }
  function viewPublic(view) {
    if (!view) return null;
    return { type: "view", viewId: view.id, path: view.path, data: clone(view.data), models: view.data.models || {}, styles: view.data.styles || {}, rendered: renderedSummary(view) };
  }
  function logRuntime(type, data) {
    data.type = type;
    __host_runtime_log(type, JSON.stringify(data));
  }
  function synuraPackage() {
    if (globalThis.SYNURA) return globalThis.SYNURA;
    if (typeof SYNURA !== "undefined") return SYNURA;
    return undefined;
  }
  function dispatch(view, event) {
    const callback = state.callbacks[view.id];
    if (typeof callback !== "function") return;
    const previous = state.currentCallbackViewId;
    state.currentCallbackViewId = view.id;
    try {
      callback(event);
    } finally {
      state.currentCallbackViewId = previous;
    }
  }
  function dropForwardViews(viewId) {
    const idx = state.views.findIndex((view) => view.id === viewId);
    if (idx >= 0 && idx < state.views.length - 1) {
      for (const view of state.views.slice(idx + 1)) delete state.callbacks[view.id];
      state.views = state.views.slice(0, idx + 1);
    }
  }
  globalThis.__synurart_init = function(localStorageJson, locale, timeoutMs) {
    state.localStorage = typeof localStorageJson === "string" ? JSON.parse(localStorageJson || "{}") : (localStorageJson || {});
    state.locale = locale || "en-US";
    state.timeoutMs = timeoutMs || 10000;
    globalThis.navigator = { language: state.locale };
  };
  globalThis.__synurart_set_locale = function(locale) {
    state.locale = locale || "en-US";
    globalThis.navigator.language = state.locale;
  };
  globalThis.__synurart_set_timeout = function(timeoutMs) { state.timeoutMs = timeoutMs || 10000; };
  globalThis.__synurart_snapshot = function() {
    const views = state.views.map((view, index) => ({ id: view.id, path: view.path, title: titleFor(view), items: modelDetails(view.data.models && view.data.models.contents).length, active: index === state.views.length - 1 }));
    const active = state.views[state.views.length - 1];
    const out = { type: "views", views };
    if (active) out.activeView = viewPublic(active);
    return JSON.stringify(out);
  };
  globalThis.__synurart_view = function(id) {
    const view = state.views.find((view) => view.id === Number(id));
    return JSON.stringify(view ? viewPublic(view) : { type: "error", message: "view not found: " + id });
  };
  globalThis.__synurart_emit = function(id, eventId, data) {
    const view = state.views.find((view) => view.id === Number(id));
    if (!view) return JSON.stringify({ ok: false, error: "view not found: " + id });
    logRuntime("event", { viewId: view.id, eventId, data: data || {} });
    dispatch(view, { viewId: view.id, eventId, context: clone(view.data.context || {}), data: clone(data || {}) });
    return JSON.stringify({ ok: true });
  };
  globalThis.__synurart_close = function(id) {
    const idx = state.views.findIndex((view) => view.id === Number(id));
    if (idx < 0) return JSON.stringify({ success: false, error: "view not found" });
    state.views.splice(idx, 1);
    delete state.callbacks[id];
    logRuntime("close", { viewId: Number(id) });
    return JSON.stringify({ success: true, viewId: Number(id), id: Number(id) });
  };
  globalThis.__synurart_call_main = function(name, args) {
    const pkg = synuraPackage();
    if (!pkg) throw new Error("SYNURA is not defined");
    const main = pkg.main;
    if (!main || typeof main[name] !== "function") throw new Error("SYNURA.main." + name + " is not a function");
    main[name].apply(main, args || []);
  };
  globalThis.__synurart_storage_snapshot = function() {
    return JSON.stringify({ local: clone(state.localStorage), session: clone(state.sessionStorage) });
  };
  globalThis.__synurart_clear_storage = function(local, session) {
    if (local) {
      state.localStorage = {};
      __host_storage_save(JSON.stringify(state.localStorage));
    }
    if (session) state.sessionStorage = {};
  };
  globalThis.__synurart_eval = function(code) {
    const result = (0, eval)(code);
    return JSON.stringify({ type: "eval", result: result === undefined ? null : result });
  };
  globalThis.console = {
    log: (...args) => __host_log("log", JSON.stringify(args.map(String))),
    warn: (...args) => __host_log("warn", JSON.stringify(args.map(String))),
    error: (...args) => __host_log("error", JSON.stringify(args.map(String)))
  };
  globalThis.localStorage = {
    setItem: (key, value) => { state.localStorage[String(key)] = String(value); __host_storage_save(JSON.stringify(state.localStorage)); },
    getItem: (key) => Object.prototype.hasOwnProperty.call(state.localStorage, String(key)) ? state.localStorage[String(key)] : null,
    removeItem: (key) => { delete state.localStorage[String(key)]; __host_storage_save(JSON.stringify(state.localStorage)); },
    clear: () => { state.localStorage = {}; __host_storage_save(JSON.stringify(state.localStorage)); }
  };
  globalThis.sessionStorage = {
    setItem: (key, value) => { state.sessionStorage[String(key)] = clone(value); },
    getItem: (key) => Object.prototype.hasOwnProperty.call(state.sessionStorage, String(key)) ? clone(state.sessionStorage[String(key)]) : null,
    removeItem: (key) => { delete state.sessionStorage[String(key)]; },
    clear: () => { state.sessionStorage = {}; }
  };
  globalThis.synura = {
    isPolyfill: true,
    open(arg0, arg1, arg2) {
      let options, context = {}, callback;
      if (typeof arg0 === "string") {
        options = Object.assign({}, asObject(arg1), { view: arg0 });
        if (typeof arg2 === "function") callback = arg2;
      } else {
        options = Object.assign({}, asObject(arg0));
        if (typeof arg1 === "function") callback = arg1;
        else if (arg1 != null) context = asObject(arg1);
        if (typeof arg2 === "function") callback = arg2;
      }
      const path = options.view || options.viewName;
      if (!path) return { success: false, error: "view is required" };
      if (state.currentCallbackViewId != null) dropForwardViews(state.currentCallbackViewId);
      const id = state.nextViewId++;
      const data = clone(options);
      data.models = processModels(data.models || {});
      data.styles = asObject(data.styles);
      data.context = clone(context || {});
      const view = { id, path, data };
      state.views.push(view);
      if (typeof callback === "function") state.callbacks[id] = callback;
      logRuntime("open", { viewId: id, path });
      if (typeof callback === "function") dispatch(view, { viewId: id, eventId: "LOAD", context: clone(data.context), data: {} });
      return { success: true, viewId: id, id, viewName: String(path).split("/").pop() };
    },
    update(viewId, diff) {
      const view = state.views.find((view) => view.id === Number(viewId));
      if (!view) return { success: false, error: "view not found" };
      diff = asObject(diff);
      if (diff.styles) view.data.styles = Object.assign({}, asObject(view.data.styles), asObject(diff.styles));
      if (diff.models) {
        const processed = processModels(diff.models);
        view.data.models = Object.assign({}, asObject(view.data.models));
        if (processed.append) {
          if (view.path === "/views/list") {
            const contents = view.data.models.contents || { details: [] };
            contents.details = (contents.details || []).concat(processed.append.details || []);
            view.data.models.contents = contents;
          } else if (view.path === "/views/chat") {
            const append = view.data.models.append || { details: [] };
            append.details = (append.details || []).concat(processed.append.details || []);
            view.data.models.append = append;
          }
          delete processed.append;
        }
        Object.assign(view.data.models, processed);
      }
      logRuntime("update", { viewId: view.id, diff });
      return { success: true, viewId: view.id, id: view.id };
    },
    connect(viewId, context, callback) {
      const view = state.views.find((view) => view.id === Number(viewId));
      if (!view) return { success: false, error: "view not found" };
      if (typeof context === "function") {
        callback = context;
        context = undefined;
      }
      if (context != null) view.data.context = asObject(context);
      if (typeof callback === "function") state.callbacks[view.id] = callback;
      if (typeof state.callbacks[view.id] === "function") dispatch(view, { viewId: view.id, eventId: "LOAD", context: clone(view.data.context || {}), data: {} });
      return { success: true, viewId: view.id, id: view.id };
    },
    close(viewId) { return JSON.parse(__synurart_close(Number(viewId))); },
    parse(_type, element) { return domDetails(element); }
  };
  globalThis.view = globalThis.synura;
  function b64ToBytes(input) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const bytes = [];
    let buffer = 0, bits = 0;
    for (const ch of String(input).replace(/=+$/, "")) {
      const value = chars.indexOf(ch);
      if (value < 0) continue;
      buffer = (buffer << 6) | value;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        bytes.push((buffer >> bits) & 255);
      }
    }
    return new Uint8Array(bytes);
  }
  function bytesToB64(bytes) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let out = "";
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      const n = (a << 16) | (b << 8) | c;
      out += chars[(n >> 18) & 63] + chars[(n >> 12) & 63] + (i + 1 < bytes.length ? chars[(n >> 6) & 63] : "=") + (i + 2 < bytes.length ? chars[n & 63] : "=");
    }
    return out;
  }
  function dataName(prop) {
    return "data-" + String(prop).replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  }
  function attrMap(node) {
    const out = {};
    if (!node || !node.__attrs) return out;
    for (const key of Object.keys(node.__attrs)) out[key] = node.__attrs[key];
    return out;
  }
  function domDetails(node) {
    const details = [];
    const visit = (current) => {
      if (!current) return;
      if (current.nodeType === 3) {
        const text = String(current.textContent || "").replace(/\s+/g, " ").trim();
        if (text) details.push({ type: "text", value: text });
        return;
      }
      const tag = String(current.tagName || "").toLowerCase();
      if (tag === "script" || tag === "style") return;
      if (tag === "br") {
        details.push({ type: "text", value: "\n" });
        return;
      }
      if (tag === "img") {
        const src = current.getAttribute("src") || current.getAttribute("data-src") || "";
        if (src) details.push({ type: "image", value: src, alt: current.getAttribute("alt") || "", ariaLabel: current.getAttribute("aria-label") || "", title: current.getAttribute("title") || "" });
        return;
      }
      if (tag === "video" || tag === "audio") {
        let src = current.getAttribute("src") || "";
        const source = current.querySelector("source[src]");
        if (source) src = source.getAttribute("src") || src;
        if (src) details.push({ type: tag, value: src, poster: current.getAttribute("poster") || "", ariaLabel: current.getAttribute("aria-label") || "", title: current.getAttribute("title") || "" });
        return;
      }
      if (tag === "a") {
        const href = current.getAttribute("href") || "";
        const text = String(current.textContent || "").replace(/\s+/g, " ").trim();
        if (href && text) {
          details.push({ type: "link", value: text, link: href });
          return;
        }
      }
      for (const child of current.childNodes || []) visit(child);
    };
    visit(node);
    return details;
  }
  const domNodeCache = {};
  function domNode(docId, nodeId) {
    const key = docId + ":" + nodeId;
    if (!domNodeCache[key]) domNodeCache[key] = new SynuraDomNode(docId, nodeId);
    return domNodeCache[key];
  }
  class SynuraDomNode {
    constructor(docId, nodeId) { this.__docId = docId; this.__nodeId = nodeId; }
    get textContent() { return __host_dom_text(this.__docId, this.__nodeId); }
    get innerText() { return this.textContent; }
    get tagName() { return __host_dom_tag(this.__docId, this.__nodeId); }
    get nodeType() { return this.tagName ? 1 : 3; }
    get id() { return this.getAttribute("id") || ""; }
    get className() { return this.getAttribute("class") || ""; }
    get childNodes() { return JSON.parse(__host_dom_children(this.__docId, this.__nodeId)).map((id) => domNode(this.__docId, id)); }
    get children() { return this.childNodes.filter((node) => node.tagName); }
    get firstChild() { return this.childNodes[0] || null; }
    get lastChild() { const children = this.childNodes; return children[children.length - 1] || null; }
    get nextSibling() { const id = __host_dom_next_sibling(this.__docId, this.__nodeId); return id >= 0 ? domNode(this.__docId, id) : null; }
    get previousSibling() { const id = __host_dom_previous_sibling(this.__docId, this.__nodeId); return id >= 0 ? domNode(this.__docId, id) : null; }
    get classList() {
      const owner = this;
      return {
        contains(name) { return String(owner.className).split(/\s+/).includes(String(name)); },
        add(name) { const set = new Set(String(owner.className).split(/\s+/).filter(Boolean)); set.add(String(name)); owner.setAttribute("class", Array.from(set).join(" ")); },
        remove(name) { const set = new Set(String(owner.className).split(/\s+/).filter(Boolean)); set.delete(String(name)); owner.setAttribute("class", Array.from(set).join(" ")); },
        toggle(name) { const set = new Set(String(owner.className).split(/\s+/).filter(Boolean)); const key = String(name); const had = set.has(key); had ? set.delete(key) : set.add(key); owner.setAttribute("class", Array.from(set).join(" ")); return !had; }
      };
    }
    get dataset() {
      const owner = this;
      return new Proxy({}, {
        get(_, prop) { return owner.getAttribute(dataName(prop)) || undefined; },
        set(_, prop, value) { owner.setAttribute(dataName(prop), String(value)); return true; },
        deleteProperty(_, prop) { owner.removeAttribute(dataName(prop)); return true; },
        ownKeys() { return Object.keys(attrMap(owner)).filter((key) => key.startsWith("data-")).map((key) => key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())); },
        getOwnPropertyDescriptor(_, prop) { return { enumerable: true, configurable: true, value: owner.getAttribute(dataName(prop)) || undefined }; }
      });
    }
    get __attrs() {
      const attrs = {};
      for (const name of ["id", "class", "href", "src", "data-src", "alt", "aria-label", "title", "poster", "width"]) {
        if (this.hasAttribute(name)) attrs[name] = this.getAttribute(name) || "";
      }
      return attrs;
    }
    getAttribute(name) { const value = __host_dom_attr(this.__docId, this.__nodeId, String(name)); return value === "" && !this.hasAttribute(name) ? null : value; }
    hasAttribute(name) { return __host_dom_has_attr(this.__docId, this.__nodeId, String(name)); }
    setAttribute(name, value) { __host_dom_set_attr(this.__docId, this.__nodeId, String(name), String(value)); }
    removeAttribute(name) { __host_dom_remove_attr(this.__docId, this.__nodeId, String(name)); }
    remove() { __host_dom_remove(this.__docId, this.__nodeId); }
    matches(selector) { const found = this.querySelector(selector); return !!found && found.__docId === this.__docId && found.__nodeId === this.__nodeId; }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    querySelectorAll(selector) { return JSON.parse(__host_dom_query(this.__docId, this.__nodeId, String(selector))).map((id) => domNode(this.__docId, id)); }
    cloneNode() { return domNode(this.__docId, __host_dom_clone(this.__docId, this.__nodeId)); }
  }
  globalThis.DOMParser = class { parseFromString(html) { return domNode(__host_dom_parse(String(html)), 0); } };
  globalThis.URLSearchParams = class {
    constructor(init) {
      this._pairs = [];
      if (init == null) return;
      if (typeof init === "string") {
        const decode = (part) => {
          const text = part.replace(/\+/g, " ");
          try { return decodeURIComponent(text); } catch (_) { return text; }
        };
        const text = init.charAt(0) === "?" ? init.slice(1) : init;
        if (!text) return;
        for (const part of text.split("&")) {
          if (part === "") continue;
          const index = part.indexOf("=");
          const key = index < 0 ? part : part.slice(0, index);
          const value = index < 0 ? "" : part.slice(index + 1);
          this.append(decode(key), decode(value));
        }
      } else if (typeof init[Symbol.iterator] === "function") {
        for (const pair of init) this.append(pair[0], pair[1]);
      } else if (typeof init === "object") {
        for (const key of Object.keys(init)) this.append(key, init[key]);
      }
    }
    append(key, value) { this._pairs.push([String(key), String(value)]); }
    delete(key) { key = String(key); this._pairs = this._pairs.filter((pair) => pair[0] !== key); }
    get(key) { key = String(key); const pair = this._pairs.find((pair) => pair[0] === key); return pair ? pair[1] : null; }
    getAll(key) { key = String(key); return this._pairs.filter((pair) => pair[0] === key).map((pair) => pair[1]); }
    has(key) { key = String(key); return this._pairs.some((pair) => pair[0] === key); }
    set(key, value) {
      key = String(key);
      const first = this._pairs.findIndex((pair) => pair[0] === key);
      if (first < 0) { this.append(key, value); return; }
      this._pairs[first][1] = String(value);
      this._pairs = this._pairs.filter((pair, index) => pair[0] !== key || index === first);
    }
    keys() { return this._pairs.map((pair) => pair[0])[Symbol.iterator](); }
    values() { return this._pairs.map((pair) => pair[1])[Symbol.iterator](); }
    entries() { return this._pairs.map((pair) => pair.slice())[Symbol.iterator](); }
    [Symbol.iterator]() { return this.entries(); }
    toString() {
      const enc = (value) => encodeURIComponent(String(value)).replace(/%20/g, "+");
      return this._pairs.map((pair) => enc(pair[0]) + "=" + enc(pair[1])).join("&");
    }
  };
  function makeResponse(res) {
    const pairs = Array.isArray(res.headers) ? res.headers : Object.entries(res.headers || {});
    const headers = {};
    function allHeaders(name) {
      if (!arguments.length) throw new TypeError("header name is required");
      const lower = String(name).toLowerCase();
      return pairs.filter(pair => pair[0].toLowerCase() === lower).map(pair => pair[1]);
    }
    function header(name) {
      if (!arguments.length) throw new TypeError("header name is required");
      const values = allHeaders(name);
      return values.length ? values.join(String(name).toLowerCase() === "set-cookie" ? "\n" : ", ") : undefined;
    }
    for (const [name] of pairs) headers[name] = header(name);
    headers.get = header;
    headers.getAll = allHeaders;
    headers.entries = () => pairs.map(pair => pair.slice());
    const text = res.bodyText;
    return {
      status: res.status,
      statusText: res.statusText,
      ok: res.status >= 200 && res.status < 300,
      url: res.url,
      headers,
      text() { return text; },
      json() { return JSON.parse(text); },
      arrayBuffer() { return b64ToBytes(res.bodyBase64 || "").buffer; },
      dom(mimeType = "text/html") {
        if (String(mimeType).toLowerCase() !== "text/html") throw new TypeError("Unsupported mimeType for dom(): " + mimeType);
        return new DOMParser().parseFromString(text, "text/html");
      }
    };
  }
  globalThis.__synurart_network_package = function() {
    const pkg = synuraPackage() || {};
    const domain = pkg.domain;
    const permissions = pkg.host_permissions;
    return JSON.stringify({domain: typeof domain === "string" ? domain : "", host_permissions: permissions == null ? [] : permissions, bypass: pkg.bypass});
  };
  globalThis.fetch = function(url, options) {
    if (!arguments.length) throw new TypeError("fetch URL is required");
    url = String(url);
    const progress = options && typeof options.onProgress === "function" ? options.onProgress : null;
    if (arguments.length >= 2) {
      const serialized = JSON.stringify(options);
      if (serialized === undefined) throw new TypeError("expected a JSON-serializable value");
      options = asObject(JSON.parse(serialized));
    } else {
      options = {};
    }
    let headers = [];
    if (Object.prototype.hasOwnProperty.call(options, "headers")) {
      const source = options.headers;
      if (!source || typeof source !== "object" || Array.isArray(source)) throw new TypeError("fetch headers must be an object");
      headers = Object.keys(source).sort().map(name => {
        if (typeof source[name] !== "string") throw new TypeError("fetch headers values must be strings");
        return [name, source[name]];
      });
    }
    function bodyJson(value) {
      if (Array.isArray(value)) return "[" + value.map(bodyJson).join(",") + "]";
      if (value && typeof value === "object") return "{" + Object.keys(value).sort().map(key => JSON.stringify(key) + ":" + bodyJson(value[key])).join(",") + "}";
      return JSON.stringify(value);
    }
    const req = {
      url,
      method: typeof options.method === "string" && options.method.trim() ? options.method : "GET",
      headers,
      body: options.body == null ? "" : typeof options.body === "string" ? options.body : bodyJson(options.body),
      progress: !!progress
    };
    const response = JSON.parse(__host_fetch(JSON.stringify(req)));
    if (progress) {
      for (const [current, total] of response.progress) {
        try { progress(current, total); } catch (_) {}
      }
    }
    return makeResponse(response);
  };
  globalThis.TextEncoder = class {
    constructor() { this.encoding = "utf-8"; }
    encode(input) { return new Uint8Array(Array.from(unescape(encodeURIComponent(String(input))), (ch) => ch.charCodeAt(0))); }
    encodeInto(input, destination) {
      const out = destination || new Uint8Array();
      const len = out.length || 0;
      let read = 0, written = 0;
      for (const ch of String(input)) {
        const encoded = this.encode(ch);
        if (written + encoded.length > len) break;
        for (let i = 0; i < encoded.length; i++) out[written + i] = encoded[i];
        written += encoded.length;
        read += ch.length;
      }
      return { read, written };
    }
  };
  globalThis.TextDecoder = class {
    constructor(label) { this.encoding = String(label || "utf-8").trim().toLowerCase(); this.fatal = false; this.ignoreBOM = false; }
    decode(input) {
      const bytes = input ? (input.buffer ? new Uint8Array(input.buffer, input.byteOffset || 0, input.byteLength) : new Uint8Array(input)) : new Uint8Array();
      return __host_decode(this.encoding, bytesToB64(bytes));
    }
  };
})();
"#;

fn node_matches(node: &NodeRef, selector: &str) -> bool {
    let Some(parent) = node.parent() else {
        return false;
    };
    let Ok(mut matches) = parent.select(selector) else {
        return false;
    };
    matches.any(|matched| matched.as_node() == node)
}

fn decode_text(label: &str, body_base64: &str) -> Result<String, String> {
    let bytes = general_purpose::STANDARD
        .decode(body_base64)
        .map_err(|e| format!("decode base64 text body: {e}"))?;
    let encoding = Encoding::for_label(label.as_bytes()).unwrap_or(UTF_8);
    let (text, _, _) = encoding.decode(&bytes);
    Ok(text.into_owned())
}

fn user_agent_from_bypass(bypass: &str) -> Option<&'static str> {
    let mut parts = bypass.trim().to_ascii_lowercase();
    if parts.is_empty() || parts == "-" {
        return None;
    }
    parts = parts.replace('_', "-");
    let mut split = parts.split('/');
    let browser = split.next().filter(|s| !s.is_empty()).unwrap_or("chrome");
    let os_name = split.next().filter(|s| !s.is_empty()).unwrap_or("windows");
    let ua = match browser {
        "firefox" => match os_name {
            "linux" => "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0",
            "macos" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0",
            "android" => "Mozilla/5.0 (Android 16; Mobile; rv:144.0) Gecko/144.0 Firefox/144.0",
            "ios" => "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/144.0 Mobile/15E148 Safari/605.1.15",
            _ => "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0",
        },
        "tor" => match os_name {
            "linux" => "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
            "macos" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
            "android" => "Mozilla/5.0 (Android 10; Mobile; rv:128.0) Gecko/134.0 Firefox/128.0",
            "ios" => "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/128.3 Mobile/15E148 Safari/605.1.15",
            _ => "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
        },
        _ => match os_name {
            "linux" => "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "macos" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "android" => "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
            "ios" => "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.7444.77 Mobile/15E148 Safari/604.1",
            _ => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
        },
    };
    Some(ua)
}

fn wildcard_match(pattern: &str, value: &str) -> bool {
    let (pattern, value) = (pattern.as_bytes(), value.as_bytes());
    let (mut p, mut v, mut star, mut retry) = (0, 0, None, 0);
    while v < value.len() {
        if p < pattern.len() && pattern[p] == b'*' {
            star = Some(p);
            p += 1;
            retry = v;
        } else if p < pattern.len() && pattern[p] == value[v] {
            p += 1;
            v += 1;
        } else if let Some(previous) = star {
            retry += 1;
            v = retry;
            p = previous + 1;
        } else {
            return false;
        }
    }
    while p < pattern.len() && pattern[p] == b'*' {
        p += 1;
    }
    p == pattern.len()
}

fn normalize_url(value: &str) -> Result<String, String> {
    Url::parse(value)
        .map(|url| url.to_string())
        .map_err(|e| format!("invalid url {value:?}: {e}"))
}

fn read_local_storage(path: &Path, namespace: &Path) -> Result<HashMap<String, String>, String> {
    let Ok(body) = fs::read_to_string(path) else {
        return Ok(HashMap::new());
    };
    let all = serde_json::from_str::<HashMap<String, HashMap<String, String>>>(&body)
        .map_err(|e| format!("parse local storage file {}: {e}", path.display()))?;
    Ok(all
        .get(&namespace.to_string_lossy().to_string())
        .cloned()
        .unwrap_or_default())
}

fn save_local_storage(
    path: &Path,
    namespace: &Path,
    values: &HashMap<String, String>,
) -> Result<(), String> {
    let mut all = if let Ok(body) = fs::read_to_string(path) {
        serde_json::from_str::<HashMap<String, HashMap<String, String>>>(&body)
            .map_err(|e| format!("parse local storage file {}: {e}", path.display()))?
    } else {
        HashMap::new()
    };
    let key = namespace.to_string_lossy().to_string();
    if values.is_empty() {
        all.remove(&key);
    } else {
        all.insert(key, values.clone());
    }
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("create {}: {e}", parent.display()))?;
    }
    let body =
        serde_json::to_string_pretty(&all).map_err(|e| format!("encode local storage: {e}"))?;
    fs::write(path, format!("{body}\n")).map_err(|e| format!("write {}: {e}", path.display()))
}

fn split_args(line: &str) -> Result<Vec<String>, String> {
    let mut args = Vec::new();
    let mut current = String::new();
    let mut chars = line.chars().peekable();
    let mut quote = None;
    while let Some(ch) = chars.next() {
        match (quote, ch) {
            (Some(q), c) if c == q => quote = None,
            (Some(_), '\\') => {
                if let Some(next) = chars.next() {
                    current.push(next);
                } else {
                    return Err("dangling escape".to_string());
                }
            }
            (Some(_), c) => current.push(c),
            (None, '"' | '\'') => quote = Some(ch),
            (None, c) if c.is_whitespace() => {
                if !current.is_empty() {
                    args.push(std::mem::take(&mut current));
                }
            }
            (None, '\\') => {
                if let Some(next) = chars.next() {
                    current.push(next);
                } else {
                    return Err("dangling escape".to_string());
                }
            }
            (None, c) => current.push(c),
        }
    }
    if quote.is_some() {
        return Err("unterminated quote".to_string());
    }
    if !current.is_empty() {
        args.push(current);
    }
    Ok(args)
}

fn parse_json_object(raw: &str) -> Result<Value, String> {
    let value =
        serde_json::from_str::<Value>(raw).map_err(|e| format!("parse JSON object: {e}"))?;
    if value.is_object() {
        Ok(value)
    } else {
        Err("expected JSON object".to_string())
    }
}

fn parse_i64(raw: &str) -> Result<i64, String> {
    raw.parse::<i64>()
        .map_err(|e| format!("invalid integer {raw:?}: {e}"))
}

fn parse_duration_ms(raw: &str) -> Result<u64, String> {
    let raw = raw.trim();
    if raw.is_empty() {
        return Err("timeout is required".to_string());
    }

    if let Ok(seconds) = raw.parse::<f64>() {
        if seconds <= 0.0 {
            return Err("timeout must be greater than 0".to_string());
        }
        return Ok((seconds * 1000.0).ceil() as u64);
    }

    let mut rest = raw;
    let mut total_ms = 0.0f64;
    while !rest.is_empty() {
        let number_end = rest
            .char_indices()
            .take_while(|(_, ch)| ch.is_ascii_digit() || matches!(ch, '.'))
            .map(|(index, ch)| index + ch.len_utf8())
            .last()
            .unwrap_or(0);
        if number_end == 0 {
            return Err(invalid_timeout_message(raw));
        }
        let number = rest[..number_end]
            .parse::<f64>()
            .map_err(|_| invalid_timeout_message(raw))?;
        if number < 0.0 {
            return Err("timeout must be greater than 0".to_string());
        }
        rest = &rest[number_end..];
        let (unit, next) = duration_unit(rest).ok_or_else(|| invalid_timeout_message(raw))?;
        total_ms += number * unit;
        rest = next;
    }
    if total_ms <= 0.0 {
        return Err("timeout must be greater than 0".to_string());
    }
    Ok(total_ms.ceil() as u64)
}

fn duration_unit(raw: &str) -> Option<(f64, &str)> {
    for (suffix, multiplier) in [
        ("ms", 1.0),
        ("us", 0.001),
        ("µs", 0.001),
        ("μs", 0.001),
        ("ns", 0.000001),
        ("h", 3_600_000.0),
        ("m", 60_000.0),
        ("s", 1_000.0),
    ] {
        if let Some(rest) = raw.strip_prefix(suffix) {
            return Some((multiplier, rest));
        }
    }
    None
}

fn invalid_timeout_message(raw: &str) -> String {
    format!("invalid timeout: {raw:?} (use values like 10s, 500ms, or 10)")
}

fn format_duration(ms: u64) -> String {
    if ms >= 3_600_000 {
        let hours = ms / 3_600_000;
        let rest = ms % 3_600_000;
        if rest == 0 {
            format!("{hours}h0m0s")
        } else {
            format!("{hours}h{}", format_duration_minutes(rest))
        }
    } else if ms >= 60_000 {
        format_duration_minutes(ms)
    } else if ms >= 1000 {
        format!("{}s", format_seconds(ms))
    } else {
        format!("{ms}ms")
    }
}

fn format_go_duration_ms(ms: u64) -> String {
    if ms == 0 {
        "0s".to_string()
    } else {
        format_duration(ms)
    }
}

fn format_duration_minutes(ms: u64) -> String {
    let minutes = ms / 60_000;
    let rest = ms % 60_000;
    format!("{minutes}m{}s", format_seconds(rest))
}

fn format_seconds(ms: u64) -> String {
    if ms % 1000 == 0 {
        return (ms / 1000).to_string();
    }
    let whole = ms / 1000;
    let fraction = ms % 1000;
    format!("{whole}.{fraction:03}")
        .trim_end_matches('0')
        .to_string()
}

fn normalize_locale(raw: &str) -> Result<String, String> {
    let mut parts = raw
        .trim()
        .replace('_', "-")
        .split('-')
        .map(str::to_string)
        .collect::<Vec<_>>();
    if parts.is_empty() || parts[0].is_empty() {
        return Err("locale is required".to_string());
    }
    parts[0] = parts[0].to_ascii_lowercase();
    if parts.len() > 1 {
        parts[1] = parts[1].to_ascii_uppercase();
    }
    Ok(parts.join("-"))
}

fn absolute_path(path: &Path) -> Result<PathBuf, String> {
    if path.is_absolute() {
        Ok(path.to_path_buf())
    } else {
        env::current_dir()
            .map_err(|e| format!("resolve working directory: {e}"))?
            .join(path)
            .canonicalize()
            .map_err(|e| format!("resolve {}: {e}", path.display()))
    }
}

fn model_details(model: Option<&Value>) -> Vec<Value> {
    model
        .and_then(|model| model.get("details"))
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default()
}

fn ensure_object_field(value: &mut Value, key: &str, field: Value) {
    if !value.is_object() {
        *value = json!({});
    }
    if let Some(object) = value.as_object_mut() {
        object.entry(key.to_string()).or_insert(field);
    }
}

fn render_active_text(view: &Value) {
    let id = view
        .get("viewId")
        .and_then(Value::as_i64)
        .unwrap_or_default();
    let path = view.get("path").and_then(Value::as_str).unwrap_or("");
    let empty_models = Map::new();
    let empty_styles = Map::new();
    let models = view
        .get("models")
        .and_then(Value::as_object)
        .unwrap_or(&empty_models);
    let styles = view
        .get("styles")
        .and_then(Value::as_object)
        .unwrap_or(&empty_styles);
    println!(
        "{} {} {}",
        bold("Render"),
        color(format!("#{id}"), &[C_CYAN, C_BOLD]),
        dim(format!("({path})"))
    );

    render_style_summary(styles);
    match path {
        "/views/list" => render_list(models, styles),
        "/views/post" => render_post(models, styles),
        "/views/chat" => render_chat(models),
        "/views/markdown" => render_markdown(models, styles),
        "/views/source" => render_source(models, styles),
        "/views/settings" => render_settings(models, styles),
        "/views/editor" => render_editor(models, styles),
        "/views/browser" => render_browser(models),
        "/views/simple" => render_simple(models, styles),
        "/dialogs/input" => render_input_dialog(models, styles),
        "/dialogs/confirmation" => render_confirmation_dialog(models, styles),
        _ => render_generic(models),
    }
    render_snackbar(models);
}

fn render_list(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let menus = labels_from_model(models.get("menus"));
    if !menus.is_empty() {
        println!("  {} {}", dim("menus:"), menus.join(", "));
    }

    let items = details_from_model(models.get("contents"));
    let width = index_width(items.len());
    let show_media = bool_from_value(styles.get("media"));
    let hot_threshold = int_from_value(styles.get("hotThreshold"));
    let cold_threshold = int_from_value(styles.get("coldThreshold"));

    for (index, raw) in items.iter().enumerate() {
        let item = raw.as_object();
        let title = item
            .and_then(|item| item.get("title"))
            .map(value_text)
            .unwrap_or_else(|| value_text(raw));
        let mut line = format!("  {} {}", fmt_index(index + 1, width), bold(title));

        if let Some(author) = item.and_then(|item| item.get("author")).map(value_text) {
            if !author.trim().is_empty() {
                line.push_str("  ");
                line.push_str(&dim("by "));
                line.push_str(&color(author, &[C_BRIGHT_BLACK]));
            }
        }
        if let Some(item) = item {
            if let Some(meta) = list_item_meta(item) {
                line.push_str("  ");
                line.push_str(&color(meta, &[C_BRIGHT_BLACK]));
            }
            let signals = hot_cold_signal_tags(
                int_from_value(item.get("hotCount")),
                hot_threshold,
                int_from_value(item.get("coldCount")),
                cold_threshold,
            );
            if !signals.is_empty() {
                line.push_str("  ");
                line.push_str(&signals.join(" "));
            }
            if let Some(link) = item.get("link").map(value_text) {
                if !link.trim().is_empty() {
                    line.push_str("  ");
                    line.push_str(&color(link, &[C_CYAN]));
                }
            }
        }
        println!("{}", compact_text(&line, 240));

        if let Some(item) = item {
            if let Some(memo) = item
                .get("memo")
                .map(value_text)
                .filter(|v| !v.trim().is_empty())
            {
                println!("      {} {}", dim("memo:"), compact_text(memo.trim(), 220));
            }
            if show_media {
                let media_line = list_item_media_line(item);
                if !media_line.is_empty() {
                    println!("      {} {}", dim("media:"), compact_text(&media_line, 220));
                }
            }
            let item_menus = labels_from_model(item.get("menus"));
            if !item_menus.is_empty() {
                println!(
                    "      {} {}",
                    dim("menu:"),
                    color(item_menus.join(", "), &[C_BRIGHT_BLACK])
                );
            }
        }
    }
}

fn render_post(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let title = model_message_or(models.get("title"), styles.get("title"));
    let author = model_message(models.get("author")).unwrap_or_default();
    let content = details_from_model(models.get("content"));
    let comments = details_from_model(models.get("comments"));
    let post_signals = hot_cold_signal_tags(
        int_from_value(models.get("hotCount").and_then(model_scalar)),
        int_from_value(styles.get("hotThreshold")),
        int_from_value(models.get("coldCount").and_then(model_scalar)),
        int_from_value(styles.get("coldThreshold")),
    );

    println!("  {} {}", dim("title:"), bold(title));
    println!(
        "  {} {}",
        dim("author:"),
        color(author, &[C_BRIGHT_MAGENTA])
    );
    println!(
        "  {} {}",
        dim("content:"),
        color(format!("{} blocks", content.len()), &[C_BRIGHT_YELLOW])
    );
    println!(
        "  {} {}",
        dim("comments:"),
        color(comments.len().to_string(), &[C_BRIGHT_YELLOW])
    );
    if !post_signals.is_empty() {
        println!("  {} {}", dim("signals:"), post_signals.join(" "));
    }

    render_post_content_compact(&content);
    render_post_comments_compact(
        &comments,
        comment_threshold(styles, "commentHotThreshold", "hotThreshold"),
        comment_threshold(styles, "commentColdThreshold", "coldThreshold"),
    );
}

fn render_post_content_compact(content: &[Value]) {
    if content.is_empty() {
        return;
    }
    println!("  {}", dim("content blocks:"));
    let width = index_width(content.len());
    for (index, raw) in content.iter().enumerate() {
        println!(
            "  {} {}",
            fmt_index(index + 1, width),
            summarize_content_block(raw)
        );
    }
}

fn render_post_comments_compact(comments: &[Value], hot_threshold: i64, cold_threshold: i64) {
    if comments.is_empty() {
        return;
    }
    println!("  {}", dim("comment list:"));
    let width = index_width(comments.len());
    for (index, raw) in comments.iter().enumerate() {
        let Some(item) = raw.as_object() else {
            println!(
                "  {} {}",
                fmt_index(index + 1, width),
                compact_text(value_text(raw), 120)
            );
            continue;
        };

        let author = item
            .get("author")
            .map(value_text)
            .filter(|v| !v.trim().is_empty())
            .unwrap_or_else(|| "(anon)".to_string());
        let level = int_from_value(item.get("level")).clamp(0, 6) as usize;
        let body = summarize_comment_body(item.get("content"));
        let mut meta = Vec::new();
        if let Some(date) = item
            .get("date")
            .map(value_text)
            .filter(|v| !v.trim().is_empty())
        {
            meta.push(date);
        }
        if let Some(like) = item
            .get("likeCount")
            .map(value_text)
            .filter(|v| !v.trim().is_empty())
        {
            meta.push(format!("like:{like}"));
        }
        let mut line = format!("{}{}: {}", "  ".repeat(level), author, body);
        if !meta.is_empty() {
            line.push_str(&format!(" [{}]", meta.join(" | ")));
        }
        let signals = hot_cold_signal_tags(
            int_from_value(item.get("hotCount")),
            hot_threshold,
            int_from_value(item.get("coldCount")),
            cold_threshold,
        );
        if !signals.is_empty() {
            line.push(' ');
            line.push_str(&signals.join(" "));
        }
        let menus = labels_from_model(item.get("menus"));
        if !menus.is_empty() {
            line.push_str(&format!(" {{menus:{}}}", menus.join(", ")));
        }
        println!(
            "  {} {}",
            fmt_index(index + 1, width),
            compact_text(line, 120)
        );
    }
}

fn render_chat(models: &Map<String, Value>) {
    let messages = details_from_model(models.get("append"));
    let width = index_width(messages.len());
    for (index, raw) in messages.iter().enumerate() {
        let msg = raw.as_object();
        let user = msg
            .and_then(|m| m.get("user"))
            .map(value_text)
            .unwrap_or_default();
        let message = msg
            .and_then(|m| m.get("message"))
            .map(value_text)
            .unwrap_or_else(|| value_text(raw));
        println!(
            "  {} {} {}",
            fmt_index(index + 1, width),
            color(user, &[C_BRIGHT_CYAN, C_BOLD]),
            message
        );
    }
}

fn render_browser(models: &Map<String, Value>) {
    let url = model_message(models.get("url")).unwrap_or_default();
    println!("  {} {}", dim("url:"), color(url, &[C_CYAN, C_UNDERLINE]));
}

fn render_markdown(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let title = model_message_or(models.get("title"), styles.get("title"));
    let content = model_message(models.get("content")).unwrap_or_default();
    let menus = details_from_model(models.get("menus"));
    println!("  {} {}", dim("title:"), bold(title));
    println!(
        "  {} {}",
        dim("lines:"),
        color(line_count(&content).to_string(), &[C_BRIGHT_YELLOW])
    );
    println!(
        "  {} {}",
        dim("menus:"),
        color(menus.len().to_string(), &[C_BRIGHT_YELLOW])
    );
    if !content.trim().is_empty() {
        println!(
            "  {} {}",
            dim("preview:"),
            compact_text(content.trim(), 200)
        );
    }
}

fn render_source(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let content = model_message(models.get("content")).unwrap_or_default();
    let language = styles
        .get("language")
        .map(value_text)
        .filter(|v| !v.trim().is_empty())
        .unwrap_or_else(|| "auto".to_string());
    println!(
        "  {} {}",
        dim("language:"),
        color(language, &[C_BRIGHT_CYAN])
    );
    println!(
        "  {} {}",
        dim("lines:"),
        color(line_count(&content).to_string(), &[C_BRIGHT_YELLOW])
    );
    println!(
        "  {} {}",
        dim("lineNumbers:"),
        bool_from_value(styles.get("lineNumbers"))
    );
    println!(
        "  {} {}",
        dim("wordWrap:"),
        bool_from_value(styles.get("wordWrap"))
    );
    if !content.trim().is_empty() {
        println!(
            "  {} {}",
            dim("preview:"),
            compact_text(content.trim(), 200)
        );
    }
}

fn render_settings(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let title = model_message_or(models.get("title"), styles.get("title"));
    let message = styles.get("message").map(value_text).unwrap_or_default();
    let fields = details_from_model(models.get("body"));
    let buttons = labels_from_model(models.get("buttons"));
    println!("  {} {}", dim("title:"), bold(title));
    if !message.trim().is_empty() {
        println!("  {} {}", dim("message:"), compact_text(message, 160));
    }
    println!(
        "  {} {}",
        dim("fields:"),
        color(fields.len().to_string(), &[C_BRIGHT_YELLOW])
    );
    println!(
        "  {} {}",
        dim("buttons:"),
        color(buttons.len().to_string(), &[C_BRIGHT_YELLOW])
    );
    render_form_fields(&fields);
    if !buttons.is_empty() {
        println!("  {} {}", dim("button labels:"), buttons.join(", "));
    }
}

fn render_editor(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let types = styles
        .get("acceptableFileType")
        .map(value_text)
        .unwrap_or_default();
    let max = int_from_value(styles.get("max")).max(1);
    println!(
        "  {} {}",
        dim("acceptableFileType:"),
        color(types, &[C_BRIGHT_CYAN])
    );
    println!(
        "  {} {}",
        dim("maxAttachments:"),
        color(max.to_string(), &[C_BRIGHT_YELLOW])
    );
    if let Some(title) = model_message(models.get("title")).filter(|v| !v.trim().is_empty()) {
        println!("  {} {}", dim("title:"), compact_text(title, 120));
    }
    if let Some(content) = model_message(models.get("content")).filter(|v| !v.trim().is_empty()) {
        println!("  {} {}", dim("content:"), compact_text(content, 200));
    }
}

fn render_simple(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let title = model_message_or(models.get("title"), styles.get("title"));
    let content = model_message(models.get("content")).unwrap_or_default();
    println!("  {} {}", dim("title:"), bold(title));
    println!("  {} {}", dim("content:"), compact_text(content, 200));
}

fn render_input_dialog(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let title = model_message_or(models.get("title"), styles.get("title"));
    let message = styles.get("message").map(value_text).unwrap_or_default();
    let fields = details_from_model(models.get("body"));
    let buttons = labels_from_model(models.get("buttons"));
    println!("  {} {}", dim("title:"), bold(title));
    if !message.trim().is_empty() {
        println!("  {} {}", dim("message:"), compact_text(message, 160));
    }
    println!(
        "  {} {}",
        dim("close:"),
        bool_from_value(styles.get("close"))
    );
    println!(
        "  {} {}",
        dim("fields:"),
        color(fields.len().to_string(), &[C_BRIGHT_YELLOW])
    );
    println!(
        "  {} {}",
        dim("buttons:"),
        color(buttons.len().to_string(), &[C_BRIGHT_YELLOW])
    );
    render_form_fields(&fields);
    if !buttons.is_empty() {
        println!("  {} {}", dim("button labels:"), buttons.join(", "));
    }
}

fn render_confirmation_dialog(models: &Map<String, Value>, styles: &Map<String, Value>) {
    let title = model_message_or(models.get("title"), styles.get("title"));
    let message = styles.get("message").map(value_text).unwrap_or_default();
    let mut buttons = labels_from_model(models.get("buttons"));
    if buttons.is_empty() {
        buttons.push("OK".to_string());
    }
    println!("  {} {}", dim("title:"), bold(title));
    if !message.trim().is_empty() {
        println!("  {} {}", dim("message:"), compact_text(message, 200));
    }
    println!(
        "  {} {}",
        dim("close:"),
        bool_from_value(styles.get("close"))
    );
    println!("  {} {}", dim("buttons:"), buttons.join(", "));
}

fn render_form_fields(fields: &[Value]) {
    if fields.is_empty() {
        return;
    }
    println!("  {}", dim("field list:"));
    let width = index_width(fields.len());
    for (index, raw) in fields.iter().enumerate() {
        let Some(field) = raw.as_object() else {
            println!(
                "  {} {}",
                fmt_index(index + 1, width),
                compact_text(value_text(raw), 120)
            );
            continue;
        };
        let typ = field
            .get("type")
            .map(value_text)
            .filter(|v| !v.trim().is_empty())
            .unwrap_or_else(|| "field".to_string());
        let mut parts = vec![typ];
        if let Some(name) = field
            .get("name")
            .map(value_text)
            .filter(|v| !v.trim().is_empty())
        {
            parts.push(name);
        }
        if let Some(label) = field
            .get("label")
            .map(value_text)
            .filter(|v| !v.trim().is_empty())
        {
            parts.push(format!("({label})"));
        }
        if let Some(value) = field
            .get("value")
            .map(value_text)
            .filter(|v| !v.trim().is_empty())
        {
            parts.push(format!("value={value}"));
        }
        if let Some(format) = field
            .get("format")
            .map(value_text)
            .filter(|v| !v.trim().is_empty())
        {
            parts.push(format!("format={format}"));
        }
        let options = array_from_value(field.get("options"));
        if !options.is_empty() {
            parts.push(format!("options={}", options.len()));
        }
        println!(
            "  {} {}",
            fmt_index(index + 1, width),
            compact_text(parts.join(" "), 140)
        );
    }
}

fn render_generic(models: &Map<String, Value>) {
    let mut keys = models.keys().cloned().collect::<Vec<_>>();
    keys.sort();
    println!(
        "  {} {}",
        dim("model keys:"),
        color(keys.join(", "), &[C_BRIGHT_BLACK])
    );
}

fn render_snackbar(models: &Map<String, Value>) {
    if let Some(message) = model_message(models.get("snackbar")).filter(|v| !v.trim().is_empty()) {
        println!(
            "  {} {}",
            dim("snackbar:"),
            color(message, &[C_BRIGHT_MAGENTA])
        );
    }
}

fn render_style_summary(styles: &Map<String, Value>) {
    if styles.is_empty() {
        return;
    }
    let order = [
        "title",
        "layout",
        "appbar",
        "pagination",
        "menu",
        "media",
        "history",
        "authorClickable",
        "categoryClickable",
        "close",
        "message",
    ];
    let mut seen = HashSet::new();
    let mut parts = Vec::new();
    for key in order {
        if let Some(value) = styles.get(key) {
            seen.insert(key.to_string());
            let summary = if key == "appbar" {
                summarize_appbar(value)
            } else {
                compact_text(value_text(value), 60)
            };
            parts.push(format!("{key}={summary}"));
        }
    }
    let mut extras = styles
        .iter()
        .filter(|(key, _)| !seen.contains(*key))
        .map(|(key, value)| format!("{key}={}", compact_text(value_text(value), 40)))
        .collect::<Vec<_>>();
    extras.sort();
    parts.extend(extras);
    println!(
        "  {} {}",
        dim("style:"),
        color(compact_text(parts.join(" | "), 220), &[C_BRIGHT_BLACK])
    );
}

fn summarize_appbar(value: &Value) -> String {
    let Some(map) = value.as_object() else {
        return compact_text(value_text(value), 48);
    };
    let typ = map
        .get("type")
        .map(value_text)
        .filter(|v| !v.trim().is_empty())
        .unwrap_or_else(|| "custom".to_string());
    let label = map.get("label").map(value_text).unwrap_or_default();
    let hint = map.get("hint").map(value_text).unwrap_or_default();
    match (!label.trim().is_empty(), !hint.trim().is_empty()) {
        (true, true) => format!(
            "{}({}, hint:{})",
            typ,
            compact_text(label, 24),
            compact_text(hint, 24)
        ),
        (true, false) => format!("{}({})", typ, compact_text(label, 24)),
        (false, true) => format!("{}(hint:{})", typ, compact_text(hint, 24)),
        (false, false) => typ,
    }
}

fn list_item_meta(item: &Map<String, Value>) -> Option<String> {
    let mut parts = Vec::new();
    for (key, label) in [
        ("category", "cat"),
        ("date", "date"),
        ("commentCount", "cmt"),
        ("likeCount", "like"),
        ("viewCount", "view"),
    ] {
        if let Some(value) = item
            .get(key)
            .map(value_text)
            .filter(|v| !v.trim().is_empty() && v.trim() != "0")
        {
            parts.push(format!("{label}:{value}"));
        }
    }
    if parts.is_empty() {
        None
    } else {
        Some(format!("[{}]", parts.join(" | ")))
    }
}

fn list_item_media_line(item: &Map<String, Value>) -> String {
    let mut parts = Vec::new();
    if let Some(media_type) = item
        .get("mediaType")
        .map(value_text)
        .filter(|v| !v.trim().is_empty())
    {
        parts.push(format!("type={media_type}"));
    }
    if let Some(media_url) = item
        .get("mediaUrl")
        .map(value_text)
        .filter(|v| !v.trim().is_empty())
    {
        parts.push(format!("url={media_url}"));
    }
    parts.join(" ")
}

fn hot_cold_signal_tags(
    hot_count: i64,
    hot_threshold: i64,
    cold_count: i64,
    cold_threshold: i64,
) -> Vec<String> {
    let mut out = Vec::new();
    if let Some(signal) = threshold_signal_tag("hot", hot_count, hot_threshold) {
        out.push(signal);
    }
    if let Some(signal) = threshold_signal_tag("cold", cold_count, cold_threshold) {
        out.push(signal);
    }
    out
}

fn threshold_signal_tag(kind: &str, count: i64, threshold: i64) -> Option<String> {
    if threshold <= 0 || count <= 0 {
        return None;
    }
    let label = format!("{} {count}/{threshold}", kind.to_ascii_uppercase());
    let color_code = match kind {
        "hot" => C_BRIGHT_RED,
        "cold" => C_BRIGHT_BLUE,
        _ => C_BRIGHT_BLACK,
    };
    Some(tag(&label, &[color_code, C_BOLD]))
}

fn summarize_content_block(raw: &Value) -> String {
    let Some(item) = raw.as_object() else {
        return compact_text(value_text(raw), 96);
    };
    let kind = item
        .get("type")
        .map(value_text)
        .filter(|v| !v.trim().is_empty())
        .unwrap_or_else(|| "item".to_string())
        .to_ascii_lowercase();
    let text = item
        .get("value")
        .or_else(|| item.get("label"))
        .or_else(|| item.get("link"))
        .map(value_text)
        .filter(|v| !v.trim().is_empty())
        .unwrap_or_else(|| value_text(raw));
    compact_text(format!("{kind}: {text}"), 96)
}

fn summarize_comment_body(raw: Option<&Value>) -> String {
    let Some(raw) = raw else {
        return String::new();
    };
    let blocks = array_from_value(Some(raw));
    if !blocks.is_empty() {
        let (first, extra) = summarize_comment_blocks(&blocks);
        if extra > 0 {
            return compact_text(format!("{first} (+{extra})"), 96);
        }
        return first;
    }
    if let Some(message) = model_message(Some(raw)).filter(|v| !v.trim().is_empty()) {
        return compact_text(message, 96);
    }
    compact_text(value_text(raw), 96)
}

fn summarize_comment_blocks(blocks: &[Value]) -> (String, usize) {
    let mut first = None;
    let mut meaningful = 0usize;
    for block in blocks {
        if is_skippable_comment_block(block) {
            continue;
        }
        if first.is_none() {
            first = Some(summarize_comment_block(block));
        }
        meaningful += 1;
    }
    if let Some(first) = first {
        (first, meaningful.saturating_sub(1))
    } else if let Some(block) = blocks.first() {
        (
            summarize_comment_block(block),
            blocks.len().saturating_sub(1),
        )
    } else {
        (String::new(), 0)
    }
}

fn is_skippable_comment_block(raw: &Value) -> bool {
    raw.as_object()
        .and_then(|item| item.get("type"))
        .map(value_text)
        .map(|kind| kind.eq_ignore_ascii_case("anchor"))
        .unwrap_or(false)
}

fn summarize_comment_block(raw: &Value) -> String {
    let Some(item) = raw.as_object() else {
        return compact_text(value_text(raw), 96);
    };
    let kind = item
        .get("type")
        .map(value_text)
        .unwrap_or_default()
        .to_ascii_lowercase();
    let text = item
        .get("value")
        .or_else(|| item.get("label"))
        .or_else(|| item.get("link"))
        .map(value_text)
        .filter(|v| !v.trim().is_empty())
        .unwrap_or_else(|| value_text(raw));
    if kind.is_empty() || kind == "text" {
        compact_text(text, 96)
    } else {
        compact_text(format!("{kind}: {text}"), 96)
    }
}

fn labels_from_model(value: Option<&Value>) -> Vec<String> {
    array_from_value(value)
        .iter()
        .filter_map(|item| {
            if let Some(map) = item.as_object() {
                map.get("label")
                    .or_else(|| map.get("message"))
                    .or_else(|| map.get("value"))
                    .map(value_text)
                    .filter(|label| !label.trim().is_empty())
            } else {
                let label = value_text(item);
                (!label.trim().is_empty()).then_some(label)
            }
        })
        .collect()
}

fn details_from_model(value: Option<&Value>) -> Vec<Value> {
    if let Some(value) = value {
        if let Some(details) = value.get("details").and_then(Value::as_array) {
            return details.clone();
        }
        if let Some(array) = value.as_array() {
            return array.clone();
        }
    }
    Vec::new()
}

fn array_from_value(value: Option<&Value>) -> Vec<Value> {
    value
        .and_then(|value| {
            value
                .as_array()
                .cloned()
                .or_else(|| value.get("details").and_then(Value::as_array).cloned())
        })
        .unwrap_or_default()
}

fn model_scalar(value: &Value) -> Option<&Value> {
    value
        .get("value")
        .or_else(|| value.get("message"))
        .or_else(|| value.get("code"))
        .or(Some(value))
}

fn model_message(value: Option<&Value>) -> Option<String> {
    let value = value?;
    if let Some(map) = value.as_object() {
        for key in ["message", "value", "code"] {
            if let Some(v) = map.get(key) {
                let text = value_text(v);
                if !text.trim().is_empty() {
                    return Some(text);
                }
            }
        }
    }
    let text = value_text(value);
    (!text.trim().is_empty()).then_some(text)
}

fn model_message_or(model: Option<&Value>, fallback: Option<&Value>) -> String {
    model_message(model)
        .or_else(|| fallback.map(value_text))
        .unwrap_or_default()
}

fn int_from_value(value: Option<&Value>) -> i64 {
    let Some(value) = value else {
        return 0;
    };
    if let Some(n) = value.as_i64() {
        return n;
    }
    if let Some(n) = value.as_u64() {
        return n as i64;
    }
    if let Some(n) = value.as_f64() {
        return n as i64;
    }
    value
        .as_str()
        .and_then(|s| s.trim().parse::<i64>().ok())
        .unwrap_or(0)
}

fn bool_from_value(value: Option<&Value>) -> bool {
    let Some(value) = value else {
        return false;
    };
    if let Some(v) = value.as_bool() {
        return v;
    }
    if let Some(v) = value.as_i64() {
        return v != 0;
    }
    value
        .as_str()
        .map(|s| {
            matches!(
                s.trim().to_ascii_lowercase().as_str(),
                "1" | "true" | "yes" | "on"
            )
        })
        .unwrap_or(false)
}

fn value_text(value: &Value) -> String {
    match value {
        Value::Null => String::new(),
        Value::String(value) => value.clone(),
        Value::Bool(value) => value.to_string(),
        Value::Number(value) => value.to_string(),
        other => stringify_json_value(other),
    }
}

fn compact_text(text: impl AsRef<str>, max_chars: usize) -> String {
    let compact = text
        .as_ref()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ");
    if compact.chars().count() <= max_chars {
        return compact;
    }
    let take = max_chars.saturating_sub(3);
    let mut out = compact.chars().take(take).collect::<String>();
    out.push_str("...");
    out
}

fn line_count(text: &str) -> usize {
    if text.trim().is_empty() {
        0
    } else {
        text.matches('\n').count() + 1
    }
}

fn comment_threshold(styles: &Map<String, Value>, key: &str, fallback: &str) -> i64 {
    let value = int_from_value(styles.get(key));
    if value > 0 {
        value
    } else {
        int_from_value(styles.get(fallback))
    }
}

fn filter_completion_suggestions(values: &[&str], prefix: &str, force_quote: bool) -> Vec<Pair> {
    completion_pairs(
        values.iter().map(|value| (*value).to_string()).collect(),
        prefix,
        force_quote,
    )
}

fn completion_pairs(values: Vec<String>, prefix: &str, force_quote: bool) -> Vec<Pair> {
    let mut out = values
        .into_iter()
        .filter_map(|value| {
            let value = value.trim().to_string();
            if value.is_empty() || !has_prefix_fold(&value, prefix) {
                return None;
            }
            let replacement = if force_quote || needs_quoting(&value) {
                quote_arg(&value)
            } else {
                value.clone()
            };
            Some(Pair {
                display: value,
                replacement,
            })
        })
        .collect::<Vec<_>>();
    out = unique_completion_pairs(out);
    if out.len() == 1 {
        out[0].replacement.push(' ');
    }
    out
}

fn path_suggestions(prefix: &str, only_js: bool) -> Vec<Pair> {
    let (dir_part, name_part) = prefix
        .rfind(std::path::MAIN_SEPARATOR)
        .map(|index| prefix.split_at(index + 1))
        .unwrap_or(("", prefix));
    let search_dir = if dir_part.is_empty() { "." } else { dir_part };
    let Ok(entries) = fs::read_dir(search_dir) else {
        return Vec::new();
    };

    let mut out = Vec::new();
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().into_owned();
        if !has_prefix_fold(&name, name_part) {
            continue;
        }
        let Ok(file_type) = entry.file_type() else {
            continue;
        };
        if only_js && !file_type.is_dir() && !name.to_ascii_lowercase().ends_with(".js") {
            continue;
        }

        let mut value = format!("{dir_part}{name}");
        let append_space = !file_type.is_dir();
        if file_type.is_dir() {
            value.push(std::path::MAIN_SEPARATOR);
        }
        let mut replacement = if needs_quoting(&value) {
            quote_arg(&value)
        } else {
            value.clone()
        };
        if append_space {
            replacement.push(' ');
        }
        out.push(Pair {
            display: value,
            replacement,
        });
    }
    unique_completion_pairs(out)
}

fn has_prefix_fold(value: &str, prefix: &str) -> bool {
    value
        .to_ascii_lowercase()
        .starts_with(&prefix.to_ascii_lowercase())
}

fn needs_quoting(value: &str) -> bool {
    value.is_empty()
        || value
            .chars()
            .any(|ch| ch.is_whitespace() || matches!(ch, '"' | '\'' | '\\'))
}

fn quote_arg(value: &str) -> String {
    let escaped = value.replace('\\', "\\\\").replace('"', "\\\"");
    format!("\"{escaped}\"")
}

fn unique_completion_pairs(values: Vec<Pair>) -> Vec<Pair> {
    let mut seen = HashSet::new();
    let mut out = values
        .into_iter()
        .filter(|pair| seen.insert(pair.display.to_ascii_lowercase()))
        .collect::<Vec<_>>();
    out.sort_by(|a, b| {
        a.display
            .to_ascii_lowercase()
            .cmp(&b.display.to_ascii_lowercase())
    });
    out
}

fn active_models(snapshot: &CompletionSnapshot) -> Map<String, Value> {
    snapshot.active_models().unwrap_or_default()
}

fn active_items(snapshot: &CompletionSnapshot) -> Vec<Value> {
    let models = active_models(snapshot);
    details_from_model(models.get("contents"))
}

fn active_items_or_comments(snapshot: &CompletionSnapshot) -> Vec<Value> {
    let models = active_models(snapshot);
    let mut items = details_from_model(models.get("contents"));
    if items.is_empty() {
        items = details_from_model(models.get("comments"));
    }
    items
}

fn index_labels(snapshot: &CompletionSnapshot) -> Vec<String> {
    let count = active_items_or_comments(snapshot).len();
    (1..=count).map(|index| index.to_string()).collect()
}

fn menu_labels(snapshot: &CompletionSnapshot) -> Vec<String> {
    let models = active_models(snapshot);
    labels_from_model(models.get("menus"))
}

fn item_menu_labels(snapshot: &CompletionSnapshot) -> Vec<String> {
    let mut labels = Vec::new();
    for raw in active_items_or_comments(snapshot) {
        if let Some(item) = raw.as_object() {
            labels.extend(labels_from_model(item.get("menus")));
        }
    }
    unique_sorted_strings(labels)
}

fn item_field_labels(snapshot: &CompletionSnapshot, key: &str) -> Vec<String> {
    let mut labels = Vec::new();
    for raw in active_items(snapshot) {
        if let Some(value) = raw
            .as_object()
            .and_then(|item| item.get(key))
            .map(value_text)
        {
            if !value.trim().is_empty() {
                labels.push(value);
            }
        }
    }
    unique_sorted_strings(labels)
}

fn author_labels(snapshot: &CompletionSnapshot) -> Vec<String> {
    let mut labels = item_field_labels(snapshot, "author");
    let models = active_models(snapshot);
    if let Some(author) =
        model_message(models.get("author")).filter(|value| !value.trim().is_empty())
    {
        labels.push(author);
    }
    unique_sorted_strings(labels)
}

fn category_labels(snapshot: &CompletionSnapshot) -> Vec<String> {
    let mut labels = item_field_labels(snapshot, "category");
    let models = active_models(snapshot);
    if let Some(category) =
        model_message(models.get("category")).filter(|value| !value.trim().is_empty())
    {
        labels.push(category);
    }
    unique_sorted_strings(labels)
}

fn unique_sorted_strings(values: Vec<String>) -> Vec<String> {
    let mut seen = HashSet::new();
    let mut out = values
        .into_iter()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
        .filter(|value| seen.insert(value.to_ascii_lowercase()))
        .collect::<Vec<_>>();
    out.sort_by_key(|value| value.to_ascii_lowercase());
    out
}

fn snapshot_for_json(snapshot: &Value) -> Value {
    let mut out = Map::new();
    out.insert("type".to_string(), json!("views"));
    out.insert(
        "views".to_string(),
        snapshot.get("views").cloned().unwrap_or_else(|| json!([])),
    );
    if let Some(active) = snapshot.get("activeView") {
        let path = active.get("path").and_then(Value::as_str).unwrap_or("");
        let models = active.get("models").cloned().unwrap_or_else(|| json!({}));
        let styles = active.get("styles").cloned().unwrap_or_else(|| json!({}));
        out.insert(
            "activeView".to_string(),
            json!({
                "viewId": active.get("viewId").cloned().unwrap_or_else(|| json!(0)),
                "path": path,
                "models": models,
                "styles": styles,
                "rendered": rendered_summary(path, active.get("models"), active.get("styles")),
            }),
        );
    }
    Value::Object(out)
}

fn view_for_json(view: &Value, kind: &str) -> Value {
    let path = view.get("path").and_then(Value::as_str).unwrap_or("");
    let models = view.get("models").cloned().unwrap_or_else(|| json!({}));
    let styles = view.get("styles").cloned().unwrap_or_else(|| json!({}));
    let mut out = Map::new();
    out.insert("type".to_string(), json!(kind));
    out.insert(
        "viewId".to_string(),
        view.get("viewId").cloned().unwrap_or_else(|| json!(0)),
    );
    out.insert("path".to_string(), json!(path));
    if kind == "view" {
        out.insert(
            "data".to_string(),
            view.get("data")
                .cloned()
                .unwrap_or_else(|| json!({"models": models, "styles": styles})),
        );
    } else {
        out.insert("models".to_string(), models);
        out.insert("styles".to_string(), styles);
    }
    out.insert(
        "rendered".to_string(),
        rendered_summary(path, view.get("models"), view.get("styles")),
    );
    Value::Object(out)
}

fn rendered_summary(path: &str, models: Option<&Value>, styles: Option<&Value>) -> Value {
    let empty_models = Map::new();
    let empty_styles = Map::new();
    let models = models.and_then(Value::as_object).unwrap_or(&empty_models);
    let styles = styles.and_then(Value::as_object).unwrap_or(&empty_styles);
    match path {
        "/views/list" => rendered_list_summary(models, styles),
        "/views/post" => rendered_post_summary(models, styles),
        _ => Value::Null,
    }
}

fn rendered_list_summary(models: &Map<String, Value>, styles: &Map<String, Value>) -> Value {
    let items = details_from_model(models.get("contents"));
    let show_media = bool_from_value(styles.get("media"));
    let hot_threshold = int_from_value(styles.get("hotThreshold"));
    let cold_threshold = int_from_value(styles.get("coldThreshold"));
    let mut out_items = Vec::new();
    for (index, raw) in items.iter().enumerate() {
        let mut entry = Map::new();
        entry.insert("index".to_string(), json!(index + 1));
        let Some(item) = raw.as_object() else {
            insert_nonempty(&mut entry, "text", value_text(raw));
            out_items.push(Value::Object(entry));
            continue;
        };
        for key in ["title", "author", "link"] {
            if let Some(value) = item.get(key).map(value_text) {
                insert_nonempty(&mut entry, key, value);
            }
        }
        if let Some(memo) = item.get("memo").map(value_text) {
            insert_nonempty(&mut entry, "memo", memo);
        }
        if let Some(meta) = list_item_meta(item) {
            insert_nonempty(&mut entry, "meta", meta);
        }
        if show_media {
            if let Some(media_type) = item.get("mediaType").map(value_text) {
                insert_nonempty(&mut entry, "mediaType", media_type);
            }
            if let Some(media_url) = item.get("mediaUrl").map(value_text) {
                insert_nonempty(&mut entry, "mediaUrl", media_url);
            }
        }
        let menus = labels_from_model(item.get("menus"));
        if !menus.is_empty() {
            entry.insert("menus".to_string(), json!(menus));
        }
        append_hot_cold_summaries(
            &mut entry,
            int_from_value(item.get("hotCount")),
            hot_threshold,
            int_from_value(item.get("coldCount")),
            cold_threshold,
        );
        out_items.push(Value::Object(entry));
    }
    json!({
        "items": out_items,
        "menus": labels_from_model(models.get("menus")),
    })
}

fn rendered_post_summary(models: &Map<String, Value>, styles: &Map<String, Value>) -> Value {
    let title = model_message(models.get("title"))
        .filter(|value| !value.trim().is_empty())
        .or_else(|| styles.get("title").map(value_text))
        .unwrap_or_default();
    let author = model_message(models.get("author")).unwrap_or_default();
    let content = details_from_model(models.get("content"));
    let comments = details_from_model(models.get("comments"));
    let mut out = Map::new();
    out.insert("title".to_string(), json!(title.trim()));
    out.insert("author".to_string(), json!(author.trim()));
    out.insert("contentBlocks".to_string(), json!(content.len()));
    out.insert("commentsCount".to_string(), json!(comments.len()));
    append_hot_cold_summaries(
        &mut out,
        int_from_value(models.get("hotCount").and_then(model_scalar)),
        int_from_value(styles.get("hotThreshold")),
        int_from_value(models.get("coldCount").and_then(model_scalar)),
        int_from_value(styles.get("coldThreshold")),
    );
    if !comments.is_empty() {
        let hot_threshold = comment_threshold(styles, "commentHotThreshold", "hotThreshold");
        let cold_threshold = comment_threshold(styles, "commentColdThreshold", "coldThreshold");
        let rendered = comments
            .iter()
            .enumerate()
            .map(|(index, raw)| rendered_comment_summary(index, raw, hot_threshold, cold_threshold))
            .collect::<Vec<_>>();
        out.insert("comments".to_string(), Value::Array(rendered));
    }
    Value::Object(out)
}

fn rendered_comment_summary(
    index: usize,
    raw: &Value,
    hot_threshold: i64,
    cold_threshold: i64,
) -> Value {
    let mut entry = Map::new();
    entry.insert("index".to_string(), json!(index + 1));
    let Some(item) = raw.as_object() else {
        insert_nonempty(&mut entry, "text", value_text(raw));
        return Value::Object(entry);
    };
    let author = item
        .get("author")
        .map(value_text)
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
        .unwrap_or_else(|| "(anon)".to_string());
    entry.insert("author".to_string(), json!(author));
    if let Some(content) = item.get("content") {
        insert_nonempty(&mut entry, "body", summarize_comment_body(Some(content)));
    }
    for key in ["date", "likeCount"] {
        if let Some(value) = item.get(key).map(value_text) {
            insert_nonempty(&mut entry, key, value);
        }
    }
    let level = int_from_value(item.get("level"));
    if level > 0 {
        entry.insert("level".to_string(), json!(level));
    }
    let menus = labels_from_model(item.get("menus"));
    if !menus.is_empty() {
        entry.insert("menus".to_string(), json!(menus));
    }
    append_hot_cold_summaries(
        &mut entry,
        int_from_value(item.get("hotCount")),
        hot_threshold,
        int_from_value(item.get("coldCount")),
        cold_threshold,
    );
    Value::Object(entry)
}

fn append_hot_cold_summaries(
    entry: &mut Map<String, Value>,
    hot_count: i64,
    hot_threshold: i64,
    cold_count: i64,
    cold_threshold: i64,
) {
    if let Some(hot) = threshold_signal_summary("hot", hot_count, hot_threshold) {
        entry.insert("hot".to_string(), hot);
    }
    if let Some(cold) = threshold_signal_summary("cold", cold_count, cold_threshold) {
        entry.insert("cold".to_string(), cold);
    }
}

fn threshold_signal_summary(kind: &str, count: i64, threshold: i64) -> Option<Value> {
    if threshold <= 0 || count <= 0 {
        return None;
    }
    Some(json!({
        "kind": kind,
        "count": count,
        "threshold": threshold,
        "label": format!("{} {count}/{threshold}", kind.to_ascii_uppercase()),
    }))
}

fn insert_nonempty(entry: &mut Map<String, Value>, key: &str, value: String) {
    let value = value.trim();
    if !value.is_empty() {
        entry.insert(key.to_string(), json!(value));
    }
}

fn eq_fold(left: &str, right: &str) -> bool {
    left.to_lowercase() == right.to_lowercase()
}

fn stringify_json_value(value: &Value) -> String {
    match value {
        Value::Null => String::new(),
        Value::String(value) => value.clone(),
        other => other.to_string(),
    }
}

fn pretty_json(value: &Value) -> String {
    serde_json::to_string_pretty(value).unwrap_or_else(|_| value.to_string())
}

fn print_json_compact(value: &Value) {
    println!(
        "{}",
        serde_json::to_string(value).unwrap_or_else(|_| value.to_string())
    );
}

fn json_out(value: &Value) {
    println!("{}", serde_json::to_string(value).unwrap());
}

const HELP_ENTRIES: &[(&str, &str)] = &[
    ("help", "Show help"),
    (
        "load <path> [--no-home]",
        "Load extension file into fresh runtime",
    ),
    (
        "timeout [duration]",
        "Show or set fetch timeout (default 10s)",
    ),
    (
        "locale [tag]",
        "Show or set navigator.language (for example ko-KR)",
    ),
    (
        "mapurl <url> <file>",
        "Map one fetch URL to a local file for this runtime",
    ),
    ("mapurl list", "Show runtime URL-to-file fetch overrides"),
    ("mapurl clear", "Clear runtime URL-to-file fetch overrides"),
    ("views | ls", "Show view stack and top view render"),
    (
        "v [id]",
        "Show stack, or show one view JSON + render when id is given",
    ),
    ("view <id>", "Show view data JSON + render"),
    ("render [id]", "Render one view (default top)"),
    ("home", "Call SYNURA.main.home()"),
    ("deeplink <url>", "Call SYNURA.main.deeplink(url)"),
    ("resume <id> [json]", "Call SYNURA.main.resume(id, context)"),
    ("s <n> [id]", "Alias for tap index <n> [id]"),
    (
        "tap title <text> [id]",
        "Emit CLICK for list item matching title",
    ),
    (
        "tap author <name> [id]",
        "Emit AUTHOR_CLICK for matching author",
    ),
    (
        "tap category <name> [id]",
        "Emit CATEGORY_CLICK for matching category",
    ),
    ("tap index <n> [id]", "Emit CLICK by 1-based item index"),
    ("itemmenu <id> <label> [index]", "Emit ITEM_MENU_CLICK"),
    ("reorder <id> <from> <to>", "Emit REORDER for list item"),
    ("refresh [id]", "Emit REFRESH (default top view)"),
    ("r [id]", "Alias for refresh [id]"),
    (
        "n [id] | next [id]",
        "Alias for event <id> SCROLL_TO_END (default top view)",
    ),
    ("close [id]", "Close a view (default top view)"),
    ("c [id]", "Alias for close [id]"),
    (
        "event <id> SCROLL_TO_END",
        "Emit pagination event (fetch next page)",
    ),
    ("menu <id> <label>", "Emit MENU_CLICK"),
    ("query <id> <text>", "Emit QUERY"),
    ("submit <id> <json>", "Emit SUBMIT with JSON object"),
    (
        "event <id> <EVENT> [json]",
        "Emit custom event with JSON object",
    ),
    ("storage [local|session]", "Show storage snapshots"),
    (
        "storage clear [local|session|all]",
        "Clear storage and persist localStorage changes",
    ),
    ("eval <javascript>", "Evaluate JS in current runtime"),
    ("quit", "Exit shell"),
];

fn print_help() {
    let width = HELP_ENTRIES
        .iter()
        .map(|(cmd, _)| cmd.len())
        .max()
        .unwrap_or(0);
    println!("{}", bold("Commands:"));
    for (cmd, desc) in HELP_ENTRIES {
        println!(
            "  {}  {}",
            color(format!("{cmd:<width$}"), &[C_BRIGHT_CYAN]),
            dim(desc)
        );
    }
}

fn help_commands_json() -> Value {
    json!({
        "type": "help",
        "commands": HELP_ENTRIES
            .iter()
            .map(|(command, description)| json!({"command": command, "description": description}))
            .collect::<Vec<_>>()
    })
}

fn view_data_for_display(view: &Value) -> Value {
    let mut out = Map::new();
    if let Some(models) = view.get("models") {
        out.insert("models".to_string(), models.clone());
    }
    if let Some(styles) = view.get("styles") {
        out.insert("styles".to_string(), styles.clone());
    }
    Value::Object(out)
}

fn ensure_view_ok(view: &Value, id: i64) -> Result<(), String> {
    if view.get("type").and_then(Value::as_str) == Some("error") {
        return Err(view
            .get("message")
            .and_then(Value::as_str)
            .map(str::to_string)
            .unwrap_or_else(|| format!("view not found: {id}")));
    }
    Ok(())
}

fn help_text() -> String {
    "usage: synurart [-ext extension.js] [-json] [-no-home] [-e command]\n\
commands: load, views, v, view, render, home, deeplink, resume, tap, click, s, itemmenu, reorder, refresh, r, n, next, menu, query, submit, event, close, c, timeout, locale, mapurl, storage, eval, quit"
        .to_string()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicU64, Ordering};
    use std::time::{SystemTime, UNIX_EPOCH};

    static NEXT_ID: AtomicU64 = AtomicU64::new(1);

    fn temp_dir() -> PathBuf {
        let nanos = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = env::temp_dir().join(format!(
            "synurart-test-{}-{}-{nanos}",
            std::process::id(),
            NEXT_ID.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(&path).unwrap();
        path
    }

    pub(super) fn runtime() -> SynurartRuntime {
        let dir = temp_dir();
        SynurartRuntime::new(
            true,
            dir.join("local_storage.json"),
            dir.join("extension.js"),
        )
        .unwrap()
    }

    pub(super) fn result(rt: &SynurartRuntime, code: &str) -> Value {
        rt.eval_js(code).unwrap().get("result").cloned().unwrap()
    }

    #[test]
    fn url_search_params_global_and_core_ops() {
        let rt = runtime();
        let out = result(
            &rt,
            r#"
(() => {
  const p = new URLSearchParams("?a=1&b=2&a=3+4");
  p.set("b", "9");
  p.append("c", "x y");
  return { type: typeof URLSearchParams, a: p.get("a"), all: p.getAll("a"), hasB: p.has("b"), s: p.toString() };
})()
"#,
        );
        assert_eq!(out["type"], "function");
        assert_eq!(out["a"], "1");
        assert_eq!(out["all"], json!(["1", "3 4"]));
        assert_eq!(out["hasB"], true);
        assert_eq!(out["s"], "a=1&b=9&a=3+4&c=x+y");
    }

    #[test]
    fn url_search_params_matches_app_iteration_and_mutation_contract() {
        let rt = runtime();
        let out = result(
            &rt,
            r#"(() => {
            const params = new URLSearchParams("a=1&b=2&a=3");
            params.set("a", "9");
            const copy = new URLSearchParams(params);
            copy.append("c", "x y");
            const malformed = new URLSearchParams("bad=%ZZ&plus=a+b");
            return {query:params.toString(), copy:copy.toString(),
                pairs:Array.from(params), keys:Array.from(params.keys()), values:Array.from(params.values()),
                map:new URLSearchParams(new Map([["q", "test"]])).toString(),
                malformed:malformed.get("bad"), plus:malformed.get("plus"),
                forEach:typeof params.forEach, sort:typeof params.sort};
        })()"#,
        );
        assert_eq!(
            out,
            json!({"query":"a=9&b=2", "copy":"a=9&b=2&c=x+y",
            "pairs":[["a","9"],["b","2"]], "keys":["a","b"], "values":["9","2"],
            "map":"q=test", "malformed":"%ZZ", "plus":"a b", "forEach":"undefined", "sort":"undefined"})
        );
    }

    #[test]
    fn navigator_language_exposes_only_language() {
        let rt = runtime();
        rt.set_locale("ko_KR").unwrap();
        let out = result(
            &rt,
            r#"
(() => ({ type: typeof navigator, language: navigator.language, languages: String(navigator.languages) }))()
"#,
        );
        assert_eq!(out["type"], "object");
        assert_eq!(out["language"], "ko-KR");
        assert_eq!(out["languages"], "undefined");
    }

    #[test]
    fn text_encoder_runtime_apis() {
        let rt = runtime();
        let out = result(
            &rt,
            r#"
(() => {
  const encoder = new TextEncoder();
  const dest = new Uint8Array(3);
  const partial = encoder.encodeInto("A\u{1F642}", dest);
  return { encoding: encoder.encoding, partial, dest: Array.from(dest), bytes: Array.from(encoder.encode("A\u00e9")) };
})()
"#,
        );
        assert_eq!(out["encoding"], "utf-8");
        assert_eq!(out["partial"], json!({"read": 1, "written": 1}));
        assert_eq!(out["dest"], json!([65, 0, 0]));
        assert_eq!(out["bytes"], json!([65, 195, 169]));
    }

    #[test]
    fn dom_dataset_classlist_clone_and_self_query_behaviour() {
        let rt = runtime();
        let out = result(
            &rt,
            r##"
(() => {
  const doc = new DOMParser().parseFromString('<div id="root" class="match foo" data-user-id="42"><span class="match"></span><a class="replyNum">9</a></div>');
  const root = doc.querySelector("#root");
  const self = root.querySelector(".match") === root;
  root.dataset.userId = "43";
  root.dataset.newKey = "abc";
  const added = root.getAttribute("data-new-key");
  delete root.dataset.newKey;
  root.classList.add("bar");
  root.classList.toggle("foo");
  const cloned = root.cloneNode(true);
  const reply = cloned.querySelector(".replyNum");
  if (reply) reply.remove();
  return {
    self,
    count: root.querySelectorAll(".match").length,
    rejectComma: root.querySelectorAll(".match, .replyNum").length,
    data: root.getAttribute("data-user-id"),
    added,
    deleted: root.hasAttribute("data-new-key"),
    className: root.className,
    originalText: root.textContent,
    cloneText: cloned.textContent
  };
})()
"##,
        );
        assert_eq!(out["self"], true);
        assert_eq!(out["count"], 2);
        assert_eq!(out["rejectComma"], 0);
        assert_eq!(out["data"], "43");
        assert_eq!(out["added"], "abc");
        assert_eq!(out["deleted"], false);
        assert_eq!(out["className"], "match bar");
        assert_eq!(out["originalText"], "9");
        assert_eq!(out["cloneText"], "");
    }

    #[test]
    fn fetch_override_uses_the_bound_domain_and_throws_for_other_hosts() {
        let dir = temp_dir();
        let fixture = dir.join("saved.html");
        fs::write(
            &fixture,
            r#"<html><head><title>Saved Page</title></head><body><div class="item">fixture-body</div></body></html>"#,
        )
        .unwrap();
        let rt = SynurartRuntime::new(
            true,
            dir.join("local_storage.json"),
            dir.join("extension.js"),
        )
        .unwrap();
        rt.set_fetch_override("https://saved.example/path", &fixture)
            .unwrap();
        let out = result(
            &rt,
            r#"
(() => {
  globalThis.SYNURA = { domain: "saved.example" };
  const ok = fetch("https://saved.example/path");
  const doc = ok.dom();
  SYNURA.domain = "allowed.example";
  const pinned = fetch("https://saved.example/path");
  let blockedError;
  try { fetch("https://allowed.example/path"); } catch (error) { blockedError = error.message; }
  return {
    status: ok.status,
    url: ok.url,
    networkMs: typeof ok.networkMs,
    title: doc.querySelector("title").textContent,
    body: doc.querySelector(".item").textContent,
    pinnedStatus: pinned.status,
    blockedError
  };
})()
"#,
        );
        assert_eq!(out["status"], 200);
        assert_eq!(out["url"], "https://saved.example/path");
        assert_eq!(out["networkMs"], "undefined");
        assert_eq!(out["title"], "Saved Page");
        assert_eq!(out["body"], "fixture-body");
        assert_eq!(out["pinnedStatus"], 200);
        assert!(out["blockedError"]
            .as_str()
            .unwrap()
            .contains("not allowed"));
    }

    #[test]
    fn synura_open_update_emit_and_snapshot() {
        let dir = temp_dir();
        let ext = dir.join("extension.js");
        fs::write(
            &ext,
            r#"
globalThis.SYNURA = {
  domain: "example.com",
  main: {
    home() {
      synura.open({ view: "/views/list", styles: { title: "Home" }, models: { contents: [{ title: "First", link: "https://example.com/1" }] } }, { kind: "home" }, function(event) {
        if (event.eventId === "CLICK") synura.update(event.viewId, { models: { snackbar: event.data.title } });
      });
    }
  }
};
"#,
        )
        .unwrap();
        let rt = SynurartRuntime::new(true, dir.join("local_storage.json"), ext.clone()).unwrap();
        rt.load_extension(&ext).unwrap();
        rt.call_main("home", &[]).unwrap();
        let snapshot = rt.snapshot().unwrap();
        let view_id = snapshot["views"][0]["id"].as_i64().unwrap();
        assert_eq!(snapshot["views"][0]["title"], "Home");
        rt.emit(view_id, "CLICK", json!({"title":"First"})).unwrap();
        let view = rt.view(view_id).unwrap();
        assert_eq!(view["models"]["snackbar"]["message"], "First");
    }
}
