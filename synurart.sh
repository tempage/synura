#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
rust_synurart="${repo_root}/target/debug/synurart"
cargo_args=(--manifest-path "${repo_root}/Cargo.toml" -p synurart --bin synurart)

if ! cargo build "${cargo_args[@]}" >/dev/null 2>&1; then
  cargo build "${cargo_args[@]}"
fi

exec "${rust_synurart}" "$@"
