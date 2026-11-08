//! Native DOM wrappers preserve identity and live mutation without exposing handles.
use serde_json::{json, Value};
use synura_runtime::rquickjs::CatchResultExt;
use synura_runtime::{Vm, VmConfig};

fn evaluate(vm: &Vm, source: &str) -> Value {
    vm.begin_turn().unwrap();
    let encoded = vm
        .context()
        .with(|ctx| {
            ctx.eval::<String, _>(format!("JSON.stringify(({source}))"))
                .catch(&ctx)
                .map_err(|error| error.to_string())
        })
        .unwrap();
    serde_json::from_str(&encoded).unwrap()
}

#[test]
fn native_nodes_preserve_identity_and_hide_unforgeable_handles() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
        const doc = new DOMParser().parseFromString('<main><p id="a">first</p> text <p id="b">second</p></main>', 'text/html');
        const main = doc.querySelector('main');
        const first = doc.querySelector('#a');
        const second = doc.querySelector('#b');
        const fake = Object.create(Object.getPrototypeOf(first));
        fake.__docId = 1; fake.__nodeId = 1;
        let forged = '';
        try { fake.getAttribute('id'); } catch (error) { forged = error.name; }
        const hidden = !('__docId' in first) && !('__nodeId' in first);
        first.__docId = 999; first.__nodeId = 999;
        return {
            docType:doc.nodeType, docName:doc.nodeName,
            identity:main.firstChild === first && first.parentNode === main && first.nextSibling.nextSibling === second,
            elements:first.nextElementSibling === second && second.previousElementSibling === first,
            hidden, forged, unaffected:first.getAttribute('id'),
            bridges:Object.getOwnPropertyNames(globalThis).filter(name => name.startsWith('__host_dom_'))
        };
    })()"#,
    );
    assert_eq!(
        actual,
        json!({"docType":9,"docName":"#document","identity":true,"elements":true,
        "hidden":true,"forged":"TypeError","unaffected":"a","bridges":[]})
    );
}

#[test]
fn dataset_and_class_list_remain_live_after_parser_is_collected() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    evaluate(
        &vm,
        r#"(() => {
        globalThis.saved = (() => {
            const node = new DOMParser().parseFromString('<p data-empty="" data-user-id="1" class="first">text</p>', 'text/html').querySelector('p');
            return {node, dataset:node.dataset, classes:node.classList};
        })();
        return true;
    })()"#,
    );
    vm.runtime().run_gc();
    let actual = evaluate(
        &vm,
        r#"(() => {
        saved.dataset.userId = 2;
        saved.node.setAttribute('data-later-value', 'live');
        const keys = Object.keys(saved.dataset).sort();
        const empty = saved.dataset.empty;
        const descriptor = Object.getOwnPropertyDescriptor(saved.dataset, 'userId');
        delete saved.dataset.empty;
        saved.classes.add('second', 'third');
        saved.classes.toggle('first');
        saved.classes.toggle('third', true);
        return { keys, empty, user:saved.node.getAttribute('data-user-id'),
            removed:!saved.node.hasAttribute('data-empty'), later:saved.dataset.laterValue,
            descriptor:[descriptor.value, descriptor.enumerable, descriptor.configurable],
            classes:saved.node.className, length:saved.classes.length,
            item:saved.classes.item(0), absent:saved.classes.item(99) };
    })()"#,
    );
    assert_eq!(
        actual,
        json!({"keys":["empty","laterValue","userId"],"empty":"","user":"2",
        "removed":true,"later":"live","descriptor":["2",true,true],
        "classes":"second third","length":2,"item":"second","absent":null})
    );
    evaluate(&vm, "delete globalThis.saved");
    vm.runtime().run_gc();
}

#[test]
fn retained_node_wrappers_survive_collection_and_clone_independently() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
        const doc = new DOMParser().parseFromString('<article><a class="link" href="/one">value</a></article>', 'text/html');
        const original = doc.querySelector('article');
        const cloned = original.cloneNode(true);
        cloned.querySelector('a').setAttribute('href', '/two');
        original.querySelector('a').remove();
        return [original.children.length, cloned.children.length, cloned.firstChild.getAttribute('href'),
            cloned.firstChild === cloned.querySelector('a'), cloned.firstChild.parentNode === cloned];
    })()"#,
    );
    assert_eq!(actual, json!([0, 1, "/two", true, true]));
    vm.runtime().run_gc();
}

#[test]
fn clone_node_defaults_to_shallow_and_copies_attributes_independently() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
        const doc = new DOMParser().parseFromString('<div id="source" class="kept"><p>child</p></div>', 'text/html');
        const original = doc.querySelector('div');
        const omitted = original.cloneNode();
        const shallow = original.cloneNode(false);
        const deep = original.cloneNode(true);
        const copies = [omitted, shallow, deep];
        const attributes = copies.map(node => [node.id, node.className]);
        omitted.id = 'omitted';
        shallow.className = 'shallow';
        deep.firstChild.setAttribute('id', 'deep-child');
        return {
            children:copies.map(node => node.childNodes.length),
            text:copies.map(node => node.textContent),
            attributes,
            independent:copies.every(node => node !== original && node.parentNode === null)
                && omitted !== shallow && shallow !== deep
                && original.id === 'source' && original.className === 'kept'
                && original.firstChild.id === '' && deep.firstChild !== original.firstChild,
            documents:[doc.cloneNode().childNodes.length, doc.cloneNode(true).querySelector('p').textContent]
        };
    })()"#,
    );
    assert_eq!(
        actual,
        json!({"children":[0,0,1],"text":["","","child"],
            "attributes":[["source","kept"],["source","kept"],["source","kept"]],
            "independent":true,"documents":[0,"child"]})
    );
}

#[test]
fn clone_node_converts_the_deep_flag_and_preserves_text_nodes() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
        const node = new DOMParser().parseFromString('<p>text</p>', 'text/html').querySelector('p');
        const counts = [undefined, false, null, 0, '', true, 1, 'false', {}]
            .map(deep => node.cloneNode(deep).childNodes.length);
        const text = node.firstChild;
        const clones = [text.cloneNode(), text.cloneNode(false), text.cloneNode(true)];
        return [counts, clones.map(copy => [copy.nodeType, copy.textContent, copy.childNodes.length,
            copy !== text, copy.parentNode === null])];
    })()"#,
    );
    assert_eq!(
        actual,
        json!([[0,0,0,0,0,1,1,1,1],
            [[3,"text",0,true,true],[3,"text",0,true,true],[3,"text",0,true,true]]])
    );
}

#[test]
fn wrapper_cache_ignores_object_prototype_properties() {
    let vm = Vm::new(VmConfig::default()).unwrap();
    let actual = evaluate(
        &vm,
        r#"(() => {
        Object.defineProperty(Object.prototype, '1:0', {
            configurable:true, get() { throw new Error('prototype cache access'); }
        });
        try {
            const doc = new DOMParser().parseFromString('<p __proto__="attribute">safe</p>', 'text/html');
            const node = doc.querySelector('p');
            return [node.textContent, node.attributes.__proto__, Object.keys(node.attributes)];
        } finally { delete Object.prototype['1:0']; }
    })()"#,
    );
    assert_eq!(actual, json!(["safe", "attribute", ["__proto__"]]));
}
