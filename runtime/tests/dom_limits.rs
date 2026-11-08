//! Retained native DOM quotas apply to parsing, cloning and mutation.
use serde_json::{json, Value};
use synura_runtime::rquickjs::{promise::MaybePromise, CatchResultExt};
use synura_runtime::{Vm, VmConfig};

fn evaluate(vm: &Vm, source: &str) -> Value {
    vm.begin_turn().unwrap();
    let encoded = vm.context().with(|ctx| {
        ctx.eval::<MaybePromise, _>(format!("JSON.stringify(({source}))"))
            .and_then(|value| vm.finish::<String>(&ctx, value))
            .catch(&ctx)
            .map_err(|error| error.to_string())
    });
    serde_json::from_str(&encoded.unwrap()).unwrap()
}

#[test]
fn retained_documents_share_one_byte_budget_without_eviction() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
            const parser = new DOMParser();
            const first = parser.parseFromString('<p>retained</p>', 'text/html');
            const html = '<p>' + 'x'.repeat(2 * 1024 * 1024) + '</p>';
            let count = 0, failure = '';
            const retained = [];
            for (; count < 32; count++) {
                try { retained.push(parser.parseFromString(html, 'text/html')); }
                catch (error) { failure = error.name; break; }
            }
            return {count, failure, first:first.querySelector('p').textContent};
        })()"#,
    );
    let count = actual["count"].as_u64().unwrap();
    assert!((1..16).contains(&count), "{actual}");
    assert_eq!(actual["failure"], "RangeError");
    assert_eq!(actual["first"], "retained");
}

#[test]
fn cloned_subtrees_count_toward_the_same_node_budget() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
            const doc = new DOMParser().parseFromString('<div>' + '<i>x</i>'.repeat(1000) + '</div>', 'text/html');
            const original = doc.querySelector('div');
            let count = 0, failure = '', latest;
            for (; count < 100; count++) {
                try { latest = original.cloneNode(true); }
                catch (error) { failure = error.name; break; }
            }
            return {count, failure, original:original.textContent.length, latest:latest.textContent.length};
        })()"#,
    );
    let count = actual["count"].as_u64().unwrap();
    assert!((10..50).contains(&count), "{actual}");
    assert_eq!(actual["failure"], "RangeError");
    assert_eq!(actual["original"], 1000);
    assert_eq!(actual["latest"], 1000);
}

#[test]
fn shallow_clones_fit_when_copying_the_descendants_exceeds_the_quota() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
            const doc = new DOMParser().parseFromString('<div id="large">' + '<i>x</i>'.repeat(30000) + '</div>', 'text/html');
            const original = doc.querySelector('div');
            let failure = '';
            try { original.cloneNode(true); }
            catch (error) { failure = error.name; }
            const copies = [];
            for (let index = 0; index < 256; index++) copies.push(original.cloneNode(false));
            return [failure, copies.length, copies.every(node => node.id === 'large' && node.childNodes.length === 0),
                original.cloneNode().childNodes.length, original.children.length];
        })()"#,
    );
    assert_eq!(actual, json!(["RangeError",256,true,0,30000]));
}

#[test]
fn shallow_template_clones_charge_an_empty_content_fragment() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
            const doc = new DOMParser().parseFromString('<template>' + '<i>x</i>'.repeat(30000) + '</template>', 'text/html');
            const original = doc.querySelector('template');
            let deepFailure = '', shallowFailure = '', count = 0;
            try { original.cloneNode(true); }
            catch (error) { deepFailure = error.name; }
            for (; count < 20500; count++) {
                try { original.cloneNode(false); }
                catch (error) { shallowFailure = error.name; break; }
            }
            return {deepFailure, shallowFailure, count};
        })()"#,
    );
    assert_eq!(actual["deepFailure"], "RangeError");
    assert_eq!(actual["shallowFailure"], "RangeError");
    // The source retains about 60,000 nodes. Each shallow copy needs two more
    // (template and empty content fragment), leaving room for about 20,000.
    let count = actual["count"].as_u64().unwrap();
    assert!((19000..20000).contains(&count), "{actual}");
}

#[test]
fn attribute_growth_is_checked_before_mutation_and_removal_releases_bytes() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
            const node = new DOMParser().parseFromString('<p id="original">text</p>', 'text/html').querySelector('p');
            const value = 'x'.repeat(1024 * 1024);
            let count = 0, failure = '';
            for (; count < 40; count++) {
                try { node.setAttribute('data-' + count, value); }
                catch (error) { failure = error.name; break; }
            }
            const rejectedAbsent = !node.hasAttribute('data-' + count);
            node.removeAttribute('data-0');
            node.setAttribute('data-' + count, value);
            return {count, failure, rejectedAbsent, retained:node.getAttribute('id'),
                recovered:node.getAttribute('data-' + count).length, removed:!node.hasAttribute('data-0')};
        })()"#,
    );
    let count = actual["count"].as_u64().unwrap();
    assert!((1..32).contains(&count), "{actual}");
    assert_eq!(actual["failure"], "RangeError");
    assert_eq!(actual["rejectedAbsent"], true);
    assert_eq!(actual["retained"], "original");
    assert_eq!(actual["recovered"], 1024 * 1024);
    assert_eq!(actual["removed"], true);
}

#[test]
fn excessive_parsed_nodes_fail_without_consuming_document_slots() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
            const parser = new DOMParser();
            let failure = '';
            try { parser.parseFromString('<i></i>'.repeat(100001), 'text/html'); }
            catch (error) { failure = error.name; }
            return [failure, parser.parseFromString('<p>after</p>', 'text/html').querySelector('p').textContent];
        })()"#,
    );
    assert_eq!(actual, json!(["RangeError", "after"]));
}

#[test]
fn deep_clone_uses_an_explicit_stack() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
            const depth = 1500;
            const doc = new DOMParser().parseFromString('<div>'.repeat(depth) + 'leaf' + '</div>'.repeat(depth), 'text/html');
            const clone = doc.cloneNode(true);
            return [doc.textContent, clone.textContent];
        })()"#,
    );
    assert_eq!(actual, json!(["leaf", "leaf"]));
}

#[test]
fn reusable_parser_reclaims_discarded_documents_before_rejecting_quota() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
        const parser = new DOMParser();
        const first = parser.parseFromString('<p>retained</p>', 'text/html').querySelector('p');
        let total = 0;
        for (let i = 0; i < 1024; i++) {
            const doc = parser.parseFromString('<p>comment</p>', 'text/html');
            total += doc.querySelector('p').textContent.length;
        }
        return [total, first.textContent, first === first.parentNode.querySelector('p')];
    })()"#,
    );
    assert_eq!(actual, json!([7168, "retained", true]));
}

#[test]
fn document_slots_are_returned_after_collection_but_live_descendants_remain_valid() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    evaluate(
        &vm,
        r#"(() => {
        globalThis.parser = new DOMParser();
        globalThis.nodes = [];
        for (let i = 0; i < 128; i++)
            nodes.push(parser.parseFromString('<p data-id="' + i + '">kept</p>', 'text/html').querySelector('p'));
        return true;
    })()"#,
    );
    let error = evaluate(
        &vm,
        r#"(() => {
        try { parser.parseFromString('<p>full</p>', 'text/html'); return 'unexpected success'; }
        catch (error) { return error.name; }
    })()"#,
    );
    assert_eq!(error, json!("RangeError"));
    // A dataset alone must retain its native document after the node is dropped.
    evaluate(
        &vm,
        "(globalThis.data = nodes[0].dataset, nodes = null, true)",
    );
    vm.runtime().run_gc();
    let actual = evaluate(
        &vm,
        r#"(() => {
        const fresh = [];
        for (let i = 0; i < 127; i++)
            fresh.push(parser.parseFromString('<p>new</p>', 'text/html'));
        data.id = 'still live';
        let error = '';
        try { parser.parseFromString('<p>full</p>', 'text/html'); }
        catch (e) { error = e.name; }
        return [fresh.length, data.id, error];
    })()"#,
    );
    assert_eq!(actual, json!([127, "still live", "RangeError"]));
}

#[test]
fn collected_documents_return_mutated_cloned_and_detached_node_budgets() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    for _ in 0..4 {
        let actual = evaluate(
            &vm,
            r#"(() => {
            const doc = new DOMParser().parseFromString('<div>' + '<i>x</i>'.repeat(18000) + '</div>', 'text/html');
            const div = doc.querySelector('div');
            const clone = div.cloneNode(true);
            clone.setAttribute('data-large', 'x'.repeat(2 * 1024 * 1024));
            clone.setAttribute('data-large', 'short');
            clone.setAttribute('data-remove', 'y'.repeat(1024 * 1024));
            clone.removeAttribute('data-remove');
            div.remove();
            return [clone.textContent.length, div.textContent.length];
        })()"#,
        );
        assert_eq!(actual, json!([18000, 18000]));
        vm.runtime().run_gc();
    }
}
