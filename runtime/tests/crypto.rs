//! Public cryptographic vectors and synthetic Web Crypto API conformance cases.
//! These fixtures contain no service responses, account data, or application keys.

use serde_json::{json, Value};
use synura_runtime::rquickjs;
use synura_runtime::rquickjs::{promise::MaybePromise, CatchResultExt};
use synura_runtime::{Vm, VmConfig};

fn runtime() -> Vm {
    Vm::new(VmConfig::default()).unwrap()
}

fn result(vm: &Vm, code: &str) -> Value {
    vm.begin_turn().unwrap();
    let source = format!("(async () => JSON.stringify(await ({code})))()");
    let encoded = vm.context().with(|ctx| {
        ctx.eval::<MaybePromise, _>(source)
            .and_then(|value| vm.finish::<String>(&ctx, value))
            .catch(&ctx)
            .unwrap()
    });
    vm.drain().unwrap();
    serde_json::from_str(&encoded).unwrap()
}

const HELPERS: &str = r#"
  const hex = data => Array.from(new Uint8Array(data), n => n.toString(16).padStart(2, '0')).join('');
  const unhex = text => new Uint8Array(text.match(/../g)?.map(n => parseInt(n, 16)) || []);
  const text = value => new TextEncoder().encode(value);
  const rejection = async promise => {
    try { await promise; return 'resolved'; }
    catch (error) { return error.name; }
  };
"#;

fn evaluate(body: &str) -> Value {
    result(
        &runtime(),
        &format!("(async () => {{\n{HELPERS}\n{body}\n}})()"),
    )
}

#[test]
fn native_crypto_returns_pending_promises_before_host_completion() {
    let rt = runtime();
    // The host has not pumped native completions yet. Even a fast operation
    // must return to JavaScript before its Promise is fulfilled.
    rt.context().with(|ctx| {
        let promise = ctx
            .eval::<rquickjs::Promise, _>(
                "globalThis.nativePending = crypto.subtle.digest('SHA-256', new Uint8Array()); nativePending",
            )
            .unwrap();
        assert_eq!(promise.state(), rquickjs::promise::PromiseState::Pending);
        ctx.eval::<(), _>("globalThis.afterNativeCall = true")
            .unwrap();
    });
    assert_eq!(
        result(
            &rt,
            "nativePending.then(bytes => [afterNativeCall, bytes.byteLength])"
        ),
        json!([true, 32])
    );
}

#[test]
fn invalid_standard_ranges_reject_without_large_allocations_or_work() {
    let actual = evaluate(
        r#"
        const password = await crypto.subtle.importKey('raw', text('synthetic password'),
            'PBKDF2', false, ['deriveBits']);
        return [
            await rejection(crypto.subtle.generateKey(
                {name:'HMAC',hash:'SHA-256',length:2**32},false,['sign'])),
            await rejection(crypto.subtle.importKey('raw',new Uint8Array(),
                {name:'HMAC',hash:'SHA-256'},false,['sign'])),
            await rejection(crypto.subtle.deriveBits(
                {name:'PBKDF2',hash:'SHA-256',salt:text('salt'),iterations:2**32},password,256)),
            await rejection(crypto.subtle.deriveBits(
                {name:'PBKDF2',hash:'SHA-256',salt:text('salt'),iterations:0},password,256))
        ];
        "#,
    );
    assert_eq!(
        actual,
        json!(["TypeError", "DataError", "TypeError", "OperationError"])
    );
}

#[test]
fn large_hmac_keys_roundtrip_raw_and_wrapped_jwk() {
    let actual = evaluate(
        r#"
        const algorithm={name:'HMAC',hash:'SHA-256'};
        const raw=await crypto.subtle.importKey('raw',new Uint8Array(65537),algorithm,false,Array(80).fill('sign'));
        const generated=await crypto.subtle.generateKey({...algorithm,length:65537*8},true,['sign']);
        // A 100 KiB synthetic key exercises the JWK binary-to-text expansion.
        const jwk=await crypto.subtle.importKey('jwk',{kty:'oct',k:'A'.repeat(136534)},algorithm,true,['sign']);
        const wrapping=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['wrapKey','unwrapKey']);
        const parameters={name:'AES-GCM',iv:new Uint8Array(12)};
        const wrapped=await crypto.subtle.wrapKey('jwk',jwk,wrapping,parameters);
        const restored=await crypto.subtle.unwrapKey('jwk',wrapped,wrapping,parameters,algorithm,true,['sign']);
        return [raw.algorithm.length,(await crypto.subtle.exportKey('raw',generated)).byteLength,
            jwk.algorithm.length,(await crypto.subtle.exportKey('raw',restored)).byteLength];
        "#,
    );
    assert_eq!(actual, json!([524296, 65537, 819200, 102400]));
}

#[test]
fn many_large_keys_work_and_remain_collectable() {
    let rt = runtime();
    assert_eq!(
        result(
            &rt,
            r#"(async()=>{
                globalThis.syntheticKeys=[];
                for(let i=0;i<65;i++) syntheticKeys.push(await crypto.subtle.importKey(
                    'raw',new Uint8Array(65536),{name:'HMAC',hash:'SHA-256'},false,['sign']));
                return syntheticKeys.length;
            })()"#,
        ),
        json!(65)
    );
    rt.context().with(|ctx| {
        ctx.eval::<(), _>("delete globalThis.syntheticKeys")
            .unwrap();
    });
    rt.runtime().run_gc();
    assert_eq!(
        result(
            &rt,
            "crypto.subtle.importKey('raw',new Uint8Array(65536),{name:'HMAC',hash:'SHA-256'},false,['sign']).then(key=>key.algorithm.length)",
        ),
        json!(524288)
    );
}

#[test]
fn many_live_keys_can_coexist_with_an_asymmetric_key_pair() {
    let actual = evaluate(
        r#"
        const keys=[];
        for(let i=0;i<1025;i++) keys.push(await crypto.subtle.importKey(
            'raw',new Uint8Array(16),'AES-GCM',false,['encrypt']));
        const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
        return [keys.length,pair.publicKey.type,pair.privateKey.type];
        "#,
    );
    assert_eq!(actual, json!([1025, "public", "private"]));
}

#[test]
fn concurrent_digest_operations_complete_with_consistent_outputs() {
    let actual = evaluate(
        r#"
        const results=[];
        for(let batch=0;batch<2;batch++) {
            const pending=[];
            for(let i=0;i<40;i++) pending.push(crypto.subtle.digest('SHA-256',text('synthetic')));
            results.push(...await Promise.all(pending));
        }
        const next=await crypto.subtle.digest('SHA-256',new Uint8Array());
        return [results.length,results.every(bytes=>bytes.byteLength===32),next.byteLength];
        "#,
    );
    assert_eq!(actual, json!([80, true, 32]));
}

#[test]
fn ecdh_getter_only_peer_is_kept_alive_during_parameter_conversion() {
    let rt = runtime();
    rt.context().with(|ctx| {
        ctx.globals()
            .set(
                "forceSyntheticGc",
                rquickjs::Function::new(ctx.clone(), |ctx: rquickjs::Ctx<'_>| ctx.run_gc())
                    .unwrap(),
            )
            .unwrap();
    });
    let actual = result(
        &rt,
        r#"(async()=>{
            const base=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},false,['deriveBits']);
            let peer=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},false,['deriveBits']);
            const expected=await crypto.subtle.deriveBits({name:'ECDH',public:peer.publicKey},base.privateKey,256);
            const algorithm={name:'ECDH',get public(){const key=peer.publicKey;peer=null;return key;}};
            const length={valueOf(){forceSyntheticGc();return 256;}};
            const actual=await crypto.subtle.deriveBits(algorithm,base.privateKey,length);
            return Array.from(new Uint8Array(actual)).join()===Array.from(new Uint8Array(expected)).join();
        })()"#,
    );
    assert_eq!(actual, json!(true));
}

#[test]
fn failed_jwk_conversions_do_not_break_later_operations() {
    let actual = evaluate(
        r#"
        const errors=[];
        for(let i=0;i<65;i++) {
            const jwk={kty:'oct',k:'A'.repeat(22),get key_ops(){throw new Error('synthetic getter');}};
            errors.push(await rejection(crypto.subtle.importKey('jwk',jwk,'AES-GCM',false,['encrypt'])));
        }
        const key=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['encrypt']);
        return [errors.every(name=>name==='Error'),key.algorithm.length];
        "#,
    );
    assert_eq!(actual, json!([true, 128]));
}

#[test]
fn unwrapped_jwk_parser_accepts_escapes_and_recovers_from_partial_parse_errors() {
    let actual = evaluate(
        r#"
        const wrapping=await crypto.subtle.importKey('raw',new Uint8Array(16),
            'AES-GCM',false,['encrypt','unwrapKey']);
        const valid=JSON.stringify({kty:'oct',k:'A'.repeat(22),key_ops:['encrypt']});
        const escaped=valid.replace('"kty"','"\\u006bty"').replace('"k":"A','"k":"\\u0041');
        const sources=[valid.slice(0,-1),valid+' trailing',escaped,valid];
        const output=[];
        for(let index=0;index<sources.length;index++) {
            const algorithm={name:'AES-GCM',iv:new Uint8Array(12).fill(index)};
            const encrypted=await crypto.subtle.encrypt(algorithm,wrapping,text(sources[index]));
            try {
                const key=await crypto.subtle.unwrapKey('jwk',encrypted,wrapping,algorithm,'AES-GCM',true,['encrypt']);
                output.push(hex(await crypto.subtle.exportKey('raw',key)));
            } catch(error) {output.push(error.name);}
        }
        return output;
        "#,
    );
    assert_eq!(
        actual,
        json!([
            "DataError",
            "DataError",
            "00000000000000000000000000000000",
            "00000000000000000000000000000000"
        ])
    );
}

#[test]
fn digest_matches_public_abc_vectors_and_accepts_algorithm_identifiers() {
    // FIPS 180-4 SHA examples for the ASCII message "abc".
    let actual = evaluate(
        r#"
        const algorithms = ['sha-1', {name:'SHA-256'}, 'sHa-384', {name:'sha-512'}];
        const output = [];
        for (const algorithm of algorithms) {
          const promise = crypto.subtle.digest(algorithm, text('abc'));
          const digest = await promise;
          output.push({promise:promise instanceof Promise, buffer:digest instanceof ArrayBuffer, hex:hex(digest)});
        }
        return output;
        "#,
    );
    let expected = [
        "a9993e364706816aba3e25717850c26c9cd0d89d",
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
        "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7",
        "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    ];
    assert_eq!(
        actual,
        Value::Array(
            expected
                .into_iter()
                .map(|hex| json!({"promise":true,"buffer":true,"hex":hex}))
                .collect()
        )
    );
}

#[test]
fn hmac_matches_rfc_vectors_and_rejects_changed_messages_and_signatures() {
    // RFC 2202 case 1 (SHA-1), RFC 4231 case 1 (SHA-256/384/512).
    // https://www.rfc-editor.org/rfc/rfc4231#section-4.2
    let actual = evaluate(
        r#"
        const output = [];
        for (const hash of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
          const key = await crypto.subtle.importKey('raw', new Uint8Array(20).fill(0x0b),
            {name:'HMAC', hash}, false, ['sign', 'verify']);
          const signature = await crypto.subtle.sign('HMAC', key, text('Hi There'));
          const changed = new Uint8Array(signature.slice(0)); changed[0] ^= 1;
          output.push({
            signature:hex(signature),
            valid:await crypto.subtle.verify('HMAC', key, signature, text('Hi There')),
            changedMessage:await crypto.subtle.verify('HMAC', key, signature, text('Hi There!')),
            changedSignature:await crypto.subtle.verify('HMAC', key, changed, text('Hi There')),
            shortSignature:await crypto.subtle.verify('HMAC', key, changed.subarray(1), text('Hi There'))
          });
        }
        return output;
        "#,
    );
    let expected = [
        "b617318655057264e28bc0b6fb378c8ef146be00",
        "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7",
        "afd03944d84895626b0825f4ab46907f15f9dadbe4101ec682aa034c7cebc59cfaea9ea9076ede7f4af152e8b2fa9cb6",
        "87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b30545e17cdedaa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f1702e696c203a126854",
    ];
    assert_eq!(
        actual,
        Value::Array(
            expected
                .into_iter()
                .map(|signature| {
                    json!({"signature":signature,"valid":true,
                        "changedMessage":false,"changedSignature":false,"shortSignature":false})
                })
                .collect()
        )
    );
}

#[test]
fn hmac_non_byte_lengths_mask_unused_bits_before_export_and_signing() {
    // Web Crypto HMAC Import Key uses the first `length` bits, padded with zero
    // bits when represented as bytes. Expected signatures were independently
    // checked against Node Web Crypto using these synthetic inputs.
    let actual = evaluate(
        r#"
        const imported = [];
        const generated = [];
        for (const length of [1,7,9,15]) {
          const raw = new Uint8Array(Math.ceil(length/8)).fill(255);
          const key = await crypto.subtle.importKey('raw',raw,
            {name:'HMAC',hash:'SHA-256',length},true,['sign']);
          imported.push({length:key.algorithm.length,raw:hex(await crypto.subtle.exportKey('raw',key)),
            signature:hex(await crypto.subtle.sign('HMAC',key,text('abc')))});
          const fresh = await crypto.subtle.generateKey({name:'HMAC',hash:'SHA-256',length},true,['sign']);
          const bytes = new Uint8Array(await crypto.subtle.exportKey('raw',fresh));
          const unusedMask = (1 << (8-length%8))-1;
          generated.push(fresh.algorithm.length===length && bytes.length===Math.ceil(length/8) &&
            (bytes[bytes.length-1] & unusedMask)===0);
        }
        const jwk = await crypto.subtle.importKey('jwk',
          {kty:'oct',k:'_w',alg:'HS256'}, {name:'HMAC',hash:'SHA-256',length:1},true,['sign']);
        return {imported,generated,jwk:hex(await crypto.subtle.exportKey('raw',jwk)),
          empty:await rejection(crypto.subtle.importKey('raw',new Uint8Array([255]),
            {name:'HMAC',hash:'SHA-256',length:0},true,['sign'])),
          wholeByteTruncation:await rejection(crypto.subtle.importKey('raw',new Uint8Array([255,255]),
            {name:'HMAC',hash:'SHA-256',length:8},true,['sign']))};
        "#,
    );
    assert_eq!(
        actual,
        json!({"imported":[
            {"length":1,"raw":"80","signature":"9138de93f664fdd9a6f212936ca91a16603a555ace160820ce712560b1b6118e"},
            {"length":7,"raw":"fe","signature":"d541c1f0298466f49ae4ee1607ac9bd6378d7e32ec7285a16d62ca5acc39a1c7"},
            {"length":9,"raw":"ff80","signature":"a731528e73bc01f9b0232e63db735955f62b6a2b0cfc263adca4fe6e2de0d552"},
            {"length":15,"raw":"fffe","signature":"f69d81e34a23610a244ad2192f7c2cfebd15d67c0e672101eb1c86013670222e"}
        ],"generated":[true,true,true,true],"jwk":"80","empty":"DataError","wholeByteTruncation":"DataError"})
    );
}

#[test]
fn aes_gcm_matches_nist_zero_key_vectors_for_all_key_lengths() {
    // NIST GCM examples with a 96-bit zero IV and a zero key/plaintext.
    // Expected output is ciphertext followed by the authentication tag.
    let actual = evaluate(
        r#"
        const output = [];
        for (const length of [128, 192, 256]) {
          const key = await crypto.subtle.importKey('raw', new Uint8Array(length / 8),
            'AES-GCM', false, ['encrypt', 'decrypt']);
          const algorithm = {name:'AES-GCM', iv:new Uint8Array(12)};
          const empty = await crypto.subtle.encrypt(algorithm, key, new Uint8Array());
          const block = await crypto.subtle.encrypt(algorithm, key, new Uint8Array(16));
          output.push({empty:hex(empty), block:hex(block),
            plaintext:hex(await crypto.subtle.decrypt(algorithm, key, block))});
        }
        return output;
        "#,
    );
    assert_eq!(
        actual,
        json!([
            {"empty":"58e2fccefa7e3061367f1d57a4e7455a",
             "block":"0388dace60b6a392f328c2b971b2fe78ab6e47d42cec13bdf53a67b21257bddf",
             "plaintext":"00000000000000000000000000000000"},
            {"empty":"cd33b28ac773f74ba00ed1f312572435",
             "block":"98e7247c07f0fe411c267e4384b0f6002ff58d80033927ab8ef4d4587514f0fb",
             "plaintext":"00000000000000000000000000000000"},
            {"empty":"530f8afbc74536b9a963b4f1c4cb738b",
             "block":"cea7403d4d606b6e074ec5d3baf39d18d0d1c8a799996bf0265b98b5d48ab919",
             "plaintext":"00000000000000000000000000000000"}
        ])
    );
}

#[test]
fn aes_gcm_supports_standard_tag_sizes_and_fails_closed_on_tampering() {
    let actual = evaluate(
        r#"
        const key = await crypto.subtle.importKey('raw', new Uint8Array(16),
          'AES-GCM', false, ['encrypt', 'decrypt']);
        const ciphertext = unhex('0388dace60b6a392f328c2b971b2fe78');
        const tag = unhex('ab6e47d42cec13bdf53a67b21257bddf');
        const lengths = [];
        for (const tagLength of [32, 64, 96, 104, 112, 120, 128]) {
          const algorithm = {name:'AES-GCM', iv:new Uint8Array(12), tagLength};
          const expected = new Uint8Array(16 + tagLength / 8);
          expected.set(ciphertext); expected.set(tag.subarray(0, tagLength / 8), 16);
          const actual = await crypto.subtle.encrypt(algorithm, key, new Uint8Array(16));
          const plaintext = await crypto.subtle.decrypt(algorithm, key, expected);
          lengths.push(hex(actual) === hex(expected) && hex(plaintext) === '00'.repeat(16));
        }
        const algorithm = {name:'AES-GCM', iv:new Uint8Array(12), additionalData:text('header')};
        const encrypted = new Uint8Array(await crypto.subtle.encrypt(algorithm, key, text('synthetic payload')));
        const badTag = encrypted.slice(); badTag[badTag.length - 1] ^= 1;
        const badCiphertext = encrypted.slice(); badCiphertext[0] ^= 1;
        return {lengths,
          badTag:await rejection(crypto.subtle.decrypt(algorithm, key, badTag)),
          badCiphertext:await rejection(crypto.subtle.decrypt(algorithm, key, badCiphertext)),
          badAad:await rejection(crypto.subtle.decrypt({...algorithm, additionalData:text('changed')}, key, encrypted)),
          badLength:await rejection(crypto.subtle.encrypt({...algorithm, tagLength:48}, key, text('data'))),
          shortInput:await rejection(crypto.subtle.decrypt(algorithm, key, new Uint8Array(15)))
        };
        "#,
    );
    assert_eq!(
        actual,
        json!({"lengths":[true,true,true,true,true,true,true],
            "badTag":"OperationError","badCiphertext":"OperationError","badAad":"OperationError",
            "badLength":"OperationError","shortInput":"OperationError"})
    );
}

#[test]
fn aes_gcm_accepts_non_default_iv_lengths_with_aad() {
    // Synthetic vectors generated independently with Node's Web Crypto API.
    // A 16-byte IV exercises the non-96-bit GCM path; 32 bytes also exercises
    // the backend's dynamically allocated IV storage.
    let actual = evaluate(
        r#"
        const key=await crypto.subtle.importKey('raw',new Uint8Array(16),
          'AES-GCM',false,['encrypt','decrypt']);
        const output=[];
        for (const [length,ciphertext] of [
          [16,'d0cb45f021cadbd5b5e0ef4d83f18ddff750cf455eea526bb524b837ba44baaf8b'],
          [32,'dd0f1d7eaee463ddb362dbe8fa03def9a1498400b955909f495a8db2c8a241e9c7']
        ]) {
          const parameters={name:'AES-GCM',iv:new Uint8Array(length),additionalData:text('header')};
          const expected=unhex(ciphertext);
          output.push({matches:hex(await crypto.subtle.encrypt(parameters,key,text('synthetic payload')))===ciphertext,
            plaintext:hex(await crypto.subtle.decrypt(parameters,key,expected)),
            wrongIv:await rejection(crypto.subtle.decrypt({...parameters,iv:new Uint8Array(length).fill(1)},key,expected))});
        }
        return output;
        "#,
    );
    let expected = json!({"matches":true,"plaintext":"73796e746865746963207061796c6f6164","wrongIv":"OperationError"});
    assert_eq!(actual, json!([expected, expected]));
}

#[test]
fn aes_cbc_matches_nist_first_block_and_applies_pkcs7_padding() {
    // NIST SP 800-38A F.2.1, with Web Crypto's mandatory PKCS#7 padding.
    let actual = evaluate(
        r#"
        const key = await crypto.subtle.importKey('raw', unhex('2b7e151628aed2a6abf7158809cf4f3c'),
          'AES-CBC', false, ['encrypt', 'decrypt']);
        const algorithm = {name:'AES-CBC', iv:unhex('000102030405060708090a0b0c0d0e0f')};
        const plaintext = unhex('6bc1bee22e409f96e93d7e117393172a');
        const ciphertext = await crypto.subtle.encrypt(algorithm, key, plaintext);
        const empty = await crypto.subtle.encrypt(algorithm, key, new Uint8Array());
        return {firstBlock:hex(ciphertext.slice(0,16)), bytes:ciphertext.byteLength,
          plaintext:hex(await crypto.subtle.decrypt(algorithm, key, ciphertext)),
          emptyCiphertextBytes:empty.byteLength,
          emptyPlaintextBytes:(await crypto.subtle.decrypt(algorithm, key, empty)).byteLength,
          truncated:await rejection(crypto.subtle.decrypt(algorithm, key, ciphertext.slice(0,-1))),
          invalidIv:await rejection(crypto.subtle.encrypt({name:'AES-CBC',iv:new Uint8Array(15)}, key, plaintext))
        };
        "#,
    );
    assert_eq!(
        actual,
        json!({"firstBlock":"7649abac8119b246cee98e9b12e9197d","bytes":32,
            "plaintext":"6bc1bee22e409f96e93d7e117393172a","emptyCiphertextBytes":16,
            "emptyPlaintextBytes":0,"truncated":"OperationError","invalidIv":"OperationError"})
    );
}

#[test]
fn buffer_sources_respect_offsets_and_are_copied_at_call_time() {
    let actual = evaluate(
        r#"
        const source = text('!abc?');
        const digest = crypto.subtle.digest('SHA-256', new DataView(source.buffer, 1, 3));
        source.fill(0);
        const raw = new Uint8Array(18).fill(0x33);
        raw.subarray(1,17).fill(0);
        const algorithm = {name:'AES-GCM'};
        const usages = ['encrypt'];
        const imported = crypto.subtle.importKey('raw', raw.subarray(1,17), algorithm, true, usages);
        raw.fill(0xff); algorithm.name = 'AES-CBC'; usages.push('decrypt');
        const key = await imported;
        const ivBacking = new Uint8Array(14).fill(0x77); ivBacking.subarray(1,13).fill(0);
        const plainBacking = new Uint8Array(18).fill(0x77); plainBacking.subarray(1,17).fill(0);
        const params = {name:'AES-GCM', iv:new DataView(ivBacking.buffer,1,12)};
        const encrypted = crypto.subtle.encrypt(params, key, new DataView(plainBacking.buffer,1,16));
        ivBacking.fill(1); plainBacking.fill(1); params.tagLength = 32;
        return {digest:hex(await digest), rawKey:hex(await crypto.subtle.exportKey('raw',key)),
          algorithm:key.algorithm.name, usages:key.usages, ciphertext:hex(await encrypted)};
        "#,
    );
    assert_eq!(
        actual,
        json!({"digest":"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
            "rawKey":"00000000000000000000000000000000","algorithm":"AES-GCM","usages":["encrypt"],
            "ciphertext":"0388dace60b6a392f328c2b971b2fe78ab6e47d42cec13bdf53a67b21257bddf"})
    );
}

#[test]
fn subtle_validation_returns_rejected_promises_instead_of_throwing_synchronously() {
    let actual = evaluate(
        r#"
        const cases = [
          () => crypto.subtle.digest('unknown', new Uint8Array()),
          () => crypto.subtle.digest('SHA-256', 'not a BufferSource'),
          () => crypto.subtle.digest(),
          () => crypto.subtle.importKey('raw',new Uint8Array(15),'AES-GCM',false,['encrypt']),
          () => crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['sign']),
          () => crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,[])
        ];
        const out = [];
        for (const action of cases) {
          try {
            const promise = action();
            out.push({synchronousThrow:false, promise:promise instanceof Promise, error:await rejection(promise)});
          } catch (error) {out.push({synchronousThrow:true,error:error.name});}
        }
        return out;
        "#,
    );
    assert_eq!(
        actual,
        Value::Array(
            [
                "NotSupportedError",
                "TypeError",
                "TypeError",
                "DataError",
                "SyntaxError",
                "SyntaxError",
            ]
            .into_iter()
            .map(|error| json!({"synchronousThrow":false,"promise":true,"error":error}))
            .collect()
        )
    );
}

#[test]
fn crypto_interfaces_preserve_brands_readonly_metadata_and_exception_types() {
    let actual = evaluate(
        r#"
        const key=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['encrypt']);
        const syncError=action=>{try{action();return 'resolved';}catch(error){return error.name;}};
        const constructors=[Crypto,SubtleCrypto,CryptoKey].map(Type=>syncError(()=>new Type()));
        const subtleGetter=Object.getOwnPropertyDescriptor(Crypto.prototype,'subtle').get;
        const keyGetter=Object.getOwnPropertyDescriptor(CryptoKey.prototype,'type').get;
        const brands=[syncError(()=>subtleGetter.call({})),syncError(()=>keyGetter.call({})),
          syncError(()=>crypto.getRandomValues.call({},new Uint8Array(1))),
          syncError(()=>crypto.randomUUID.call({}))];
        let rejectedReceiver;
        try {
          const promise=crypto.subtle.digest.call({},'SHA-256',new Uint8Array());
          rejectedReceiver={promise:promise instanceof Promise,error:await rejection(promise)};
        } catch(error) {rejectedReceiver={synchronousThrow:true,error:error.name};}
        let unsupported,conversion;
        try {await crypto.subtle.digest('unsupported',new Uint8Array());}
        catch(error) {unsupported={name:error.name,dom:error instanceof DOMException};}
        try {await crypto.subtle.digest('SHA-256','invalid bytes');}
        catch(error) {conversion={name:error.name,type:error instanceof TypeError};}
        return {constructors,brands,rejectedReceiver,unsupported,conversion,
          instances:[crypto instanceof Crypto,crypto.subtle instanceof SubtleCrypto,key instanceof CryptoKey],
          tags:[crypto,crypto.subtle,key].map(value=>Object.prototype.toString.call(value)),
          metadataIdentity:key.algorithm===key.algorithm && key.usages===key.usages,
          metadataHasNoSetter:Object.getOwnPropertyDescriptor(CryptoKey.prototype,'extractable').set===undefined};
        "#,
    );
    assert_eq!(
        actual,
        json!({"constructors":["TypeError","TypeError","TypeError"],
            "brands":["TypeError","TypeError","TypeError","TypeError"],
            "rejectedReceiver":{"promise":true,"error":"TypeError"},
            "unsupported":{"name":"NotSupportedError","dom":true},
            "conversion":{"name":"TypeError","type":true},
            "instances":[true,true,true],"tags":["[object Crypto]","[object SubtleCrypto]","[object CryptoKey]"],
            "metadataIdentity":true,"metadataHasNoSetter":true})
    );
}

#[test]
fn algorithm_dictionaries_and_iterables_are_converted_before_promise_return() {
    let actual = evaluate(
        r#"
        const events=[];
        const algorithm={get name(){events.push('name');return {toString(){events.push('string');return 'aEs-GcM';}};}};
        const usages={*[Symbol.iterator](){events.push('usages');yield {toString(){return 'encrypt';}};}};
        const imported=crypto.subtle.importKey('raw',new Uint8Array(16),algorithm,0,usages);
        const convertedSynchronously=events.includes('name') && events.includes('string') && events.includes('usages');
        const key=await imported;
        const generated=await crypto.subtle.generateKey({name:'AES-GCM',length:{valueOf(){return 128.9;}}},true,new Set(['encrypt']));
        const sentinel=new Error('synthetic getter exception');
        let getter;
        try {
          const promise=crypto.subtle.digest({get name(){throw sentinel;}},new Uint8Array());
          try {await promise;getter={resolved:true};}
          catch(error){getter={promise:promise instanceof Promise,sameException:error===sentinel};}
        } catch(error) {getter={synchronousThrow:true};}
        return {convertedSynchronously,name:key.algorithm.name,extractable:key.extractable,
          usages:key.usages,generatedBits:generated.algorithm.length,getter,
          bigintLength:await rejection(crypto.subtle.generateKey({name:'AES-GCM',length:BigInt(128)},true,['encrypt'])),
          uppercaseUsage:await rejection(crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['ENCRYPT'])),
          uppercaseFormat:await rejection(crypto.subtle.importKey('RAW',new Uint8Array(16),'AES-GCM',false,['encrypt']))};
        "#,
    );
    assert_eq!(
        actual,
        json!({"convertedSynchronously":true,"name":"AES-GCM","extractable":false,
            "usages":["encrypt"],"generatedBits":128,
            "getter":{"promise":true,"sameException":true},
            "bigintLength":"TypeError","uppercaseUsage":"TypeError","uppercaseFormat":"TypeError"})
    );
}

#[test]
fn buffer_source_extraction_ignores_shadowed_view_metadata() {
    let actual = evaluate(
        r#"
        function shadow(view) {
          Object.defineProperties(view,{buffer:{value:new ArrayBuffer(100)},
            byteOffset:{value:42},byteLength:{value:70000},length:{value:70000}});
          return view;
        }
        const source=text('!abc?');
        const typed=shadow(new Uint8Array(source.buffer,1,3));
        const data=shadow(new DataView(source.buffer,1,3));
        const typedDigest=hex(await crypto.subtle.digest('SHA-256',typed));
        const dataDigest=hex(await crypto.subtle.digest('SHA-256',data));
        const backing=new Uint8Array(8).fill(0x5a);
        const random=shadow(new Uint8Array(backing.buffer,2,4));
        const same=crypto.getRandomValues(random)===random;
        return {typedDigest,dataDigest,same,
          untouched:[backing[0],backing[1],backing[6],backing[7]].every(value=>value===0x5a)};
        "#,
    );
    let digest = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
    assert_eq!(
        actual,
        json!({"typedDigest":digest,"dataDigest":digest,"same":true,"untouched":true})
    );
}

#[test]
fn pending_operations_retain_keys_across_garbage_collection() {
    let rt = runtime();
    result(
        &rt,
        r#"crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['encrypt'])
            .then(key=>{globalThis.syntheticKey=key;return true;})"#,
    );
    // Schedule the operation without the host's usual promise/job drain, then
    // release the caller's last key reference before forcing a collection.
    rt.context().with(|ctx| {
        ctx.eval::<(), _>(
            r#"globalThis.syntheticPending=crypto.subtle.encrypt(
                 {name:'AES-GCM',iv:new Uint8Array(12)},syntheticKey,new Uint8Array());
               delete globalThis.syntheticKey;"#,
        )
        .unwrap();
    });
    rt.runtime().run_gc();
    let actual = result(
        &rt,
        r#"syntheticPending.then(bytes=>Array.from(new Uint8Array(bytes),
             n=>n.toString(16).padStart(2,'0')).join(''))"#,
    );
    assert_eq!(actual, json!("58e2fccefa7e3061367f1d57a4e7455a"));
}

#[test]
fn native_key_metadata_cycles_are_reclaimed_by_garbage_collection() {
    let rt = runtime();
    result(
        &rt,
        r#"(async()=>{
            globalThis.syntheticKeyReferences=[];
            for(let index=0;index<16;index++) {
                const key=await crypto.subtle.importKey('raw',new Uint8Array(16),
                    'AES-GCM',false,['encrypt']);
                key.algorithm.owner=key;
                key.usages.owner=key;
                syntheticKeyReferences.push(new WeakRef(key));
            }
            return true;
        })()"#,
    );
    rt.runtime().run_gc();
    assert_eq!(
        result(
            &rt,
            "syntheticKeyReferences.every(reference=>reference.deref()===undefined)",
        ),
        json!(true)
    );
    // Dropping the runtime also exercises native class teardown after cycles.
}

#[test]
fn crypto_output_buffers_can_be_transferred_and_collected() {
    let rt = runtime();
    let actual = result(
        &rt,
        r#"(async () => {
            const output = await crypto.subtle.digest('SHA-256', new Uint8Array());
            const transferred = output.transfer();
            const bytes = Array.from(new Uint8Array(transferred),
                n => n.toString(16).padStart(2, '0')).join('');
            return [output.byteLength, bytes];
        })()"#,
    );
    assert_eq!(
        actual,
        json!([0, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"])
    );
    rt.runtime().run_gc();
    assert_eq!(
        result(
            &rt,
            "crypto.subtle.digest('SHA-256',new Uint8Array()).then(bytes=>bytes.byteLength)",
        ),
        json!(32)
    );
}

#[test]
fn cryptokeys_enforce_usages_extractability_and_cannot_be_forged() {
    let actual = evaluate(
        r#"
        const key = await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['encrypt']);
        const algorithm = {name:'AES-GCM',iv:new Uint8Array(12)};
        const originalUsages=[...key.usages];
        try {key.extractable=true;} catch (_) {}
        try {key.usages.push('decrypt');} catch (_) {}
        key.algorithm.length=256;
        const ciphertext=await crypto.subtle.encrypt(algorithm,key,new Uint8Array(16));
        const forged = Object.create(CryptoKey.prototype);
        const fake = {type:'secret',extractable:true,algorithm:{name:'AES-GCM',length:128},usages:['encrypt'],id:1};
        return {instance:key instanceof CryptoKey, extractable:key.extractable,
          usages:originalUsages, algorithm:key.algorithm.name, ciphertext:hex(ciphertext),
          privateBridge:typeof globalThis.__host_crypto,
          exportError:await rejection(crypto.subtle.exportKey('raw',key)),
          usageError:await rejection(crypto.subtle.decrypt(algorithm,key,ciphertext)),
          mismatchError:await rejection(crypto.subtle.encrypt({name:'AES-CBC',iv:new Uint8Array(16)},key,new Uint8Array())),
          forgedError:await rejection(crypto.subtle.encrypt(algorithm,forged,new Uint8Array())),
          fakeError:await rejection(crypto.subtle.encrypt(algorithm,fake,new Uint8Array()))};
        "#,
    );
    assert_eq!(
        actual,
        json!({"instance":true,"extractable":false,"usages":["encrypt"],"algorithm":"AES-GCM",
            "ciphertext":"0388dace60b6a392f328c2b971b2fe78ab6e47d42cec13bdf53a67b21257bddf",
            "privateBridge":"undefined","exportError":"InvalidAccessError",
            "usageError":"InvalidAccessError","mismatchError":"InvalidAccessError",
            "forgedError":"TypeError","fakeError":"TypeError"})
    );
}

#[test]
fn shadowed_extractable_metadata_cannot_change_native_export_permissions() {
    let actual = evaluate(
        r#"
        const wrapping=await crypto.subtle.generateKey({name:'AES-GCM',length:128},false,['wrapKey']);
        const getExtractable=Object.getOwnPropertyDescriptor(CryptoKey.prototype,'extractable').get;
        const output=[];
        for (const extractable of [false,true]) {
            const key=await crypto.subtle.generateKey({name:'AES-GCM',length:128},extractable,['encrypt','decrypt']);
            Object.defineProperty(key,'extractable',{value:!extractable});
            const cipher={name:'AES-GCM',iv:new Uint8Array(12)};
            const ciphertext=await crypto.subtle.encrypt(cipher,key,new Uint8Array([1,2,3]));
            output.push({visible:key.extractable,native:getExtractable.call(key),
                plaintext:hex(await crypto.subtle.decrypt(cipher,key,ciphertext)),
                raw:await rejection(crypto.subtle.exportKey('raw',key)),
                jwk:await rejection(crypto.subtle.exportKey('jwk',key)),
                wrap:await rejection(crypto.subtle.wrapKey('raw',key,wrapping,
                    {name:'AES-GCM',iv:new Uint8Array(12).fill(extractable?1:0)}))});
        }
        return output;
        "#,
    );
    assert_eq!(
        actual,
        json!([
            {"visible":true,"native":false,"plaintext":"010203",
             "raw":"InvalidAccessError","jwk":"InvalidAccessError","wrap":"InvalidAccessError"},
            {"visible":false,"native":true,"plaintext":"010203",
             "raw":"resolved","jwk":"resolved","wrap":"resolved"}
        ])
    );
}

#[test]
fn prototype_json_hooks_cannot_observe_or_rewrite_native_crypto_requests() {
    let actual = evaluate(
        r#"
        const key=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',true,['encrypt']);
        let objectCalls=0,arrayCalls=0,leakedHandle=null,output;
        Object.defineProperty(Object.prototype,'toJSON',{configurable:true,value:function(){
          objectCalls++;
          if (typeof this.key==='number') leakedHandle=this.key;
          if (this.op==='digest' && leakedHandle!==null)
            return {op:'exportKey',format:'raw',key:leakedHandle};
          return this;
        }});
        Object.defineProperty(Array.prototype,'toJSON',{configurable:true,value:function(){
          arrayCalls++;return this;
        }});
        try {
          const exported=hex(await crypto.subtle.exportKey('raw',key));
          const digest=hex(await crypto.subtle.digest('SHA-256',text('abc')));
          const imported=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',true,['encrypt']);
          const jwk=await crypto.subtle.exportKey('jwk',imported);
          const ciphertext=hex(await crypto.subtle.encrypt({name:'AES-GCM',iv:new Uint8Array(12)},imported,new Uint8Array(16)));
          const random=new Uint8Array(1);
          const randomIdentity=crypto.getRandomValues(random)===random;
          const uuidValid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(crypto.randomUUID());
          output={exported,digest,ciphertext,randomIdentity,uuidValid,
            keyAlgorithm:imported.algorithm.name,jwkAlgorithm:jwk.alg};
        } finally {
          delete Object.prototype.toJSON;
          delete Array.prototype.toJSON;
        }
        return {objectCalls,arrayCalls,handleLeaked:leakedHandle!==null,...output};
        "#,
    );
    assert_eq!(
        actual,
        json!({"objectCalls":0,"arrayCalls":0,"handleLeaked":false,
            "exported":"00000000000000000000000000000000",
            "digest":"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
            "ciphertext":"0388dace60b6a392f328c2b971b2fe78ab6e47d42cec13bdf53a67b21257bddf",
            "randomIdentity":true,"uuidValid":true,"keyAlgorithm":"AES-GCM","jwkAlgorithm":"A128GCM"})
    );
}

#[test]
fn jwk_import_checks_algorithm_usage_and_extractability_constraints() {
    let actual = evaluate(
        r#"
        const base = {kty:'oct',k:'AAAAAAAAAAAAAAAAAAAAAA',alg:'A128GCM',ext:true,key_ops:['encrypt','decrypt']};
        const key = await crypto.subtle.importKey('jwk',base,'AES-GCM',false,['encrypt']);
        const errors = [];
        for (const change of [
          {ext:false}, {key_ops:['decrypt']}, {alg:'A256GCM'}, {use:'sig'}, {kty:'RSA'}
        ]) {
          errors.push(await rejection(crypto.subtle.importKey('jwk',{...base,...change},'AES-GCM',true,['encrypt'])));
        }
        return {type:key.type,extractable:key.extractable,usages:key.usages,
          algorithm:key.algorithm,errors};
        "#,
    );
    assert_eq!(
        actual,
        json!({"type":"secret","extractable":false,"usages":["encrypt"],
            "algorithm":{"name":"AES-GCM","length":128},
            "errors":["DataError","DataError","DataError","DataError","DataError"]})
    );
}

#[test]
fn generated_secret_keys_have_expected_lengths_and_roundtrip_jwk() {
    let actual = evaluate(
        r#"
        const output = [];
        for (const name of ['AES-GCM','AES-CBC']) {
          for (const length of [128,192,256]) {
            const key=await crypto.subtle.generateKey({name,length},true,['encrypt','decrypt']);
            const raw=await crypto.subtle.exportKey('raw',key);
            const jwk=await crypto.subtle.exportKey('jwk',key);
            const imported=await crypto.subtle.importKey('jwk',jwk,{name},true,['encrypt']);
            output.push(raw.byteLength===length/8 && key.algorithm.length===length &&
              hex(raw)===hex(await crypto.subtle.exportKey('raw',imported)) && jwk.kty==='oct');
          }
        }
        const hmac256=await crypto.subtle.generateKey({name:'HMAC',hash:'SHA-256'},true,['sign']);
        const hmac512=await crypto.subtle.generateKey({name:'HMAC',hash:'SHA-512'},true,['sign']);
        return {aes:output,hmacDefaultLengths:[hmac256.algorithm.length,hmac512.algorithm.length],
          hmacRawLengths:[(await crypto.subtle.exportKey('raw',hmac256)).byteLength,
            (await crypto.subtle.exportKey('raw',hmac512)).byteLength]};
        "#,
    );
    assert_eq!(
        actual,
        json!({"aes":[true,true,true,true,true,true],"hmacDefaultLengths":[512,1024],"hmacRawLengths":[64,128]})
    );
}

#[test]
fn random_values_use_typed_array_byte_limits_and_preserve_view_boundaries() {
    let actual = evaluate(
        r#"
        const constructors=[Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,
          Int32Array,Uint32Array,BigInt64Array,BigUint64Array];
        const identities=constructors.map(Type=>{const data=new Type(3);return crypto.getRandomValues(data)===data;});
        const backing=new Uint8Array(12).fill(0x5a),view=new Uint8Array(backing.buffer,3,6);
        const viewIdentity=crypto.getRandomValues(view)===view;
        const outside=[...backing.subarray(0,3),...backing.subarray(9)].every(value=>value===0x5a);
        const maximum=new Uint32Array(16384),tooLarge=new Uint32Array(16385).fill(7);
        const maximumIdentity=crypto.getRandomValues(maximum)===maximum;
        const errors=[];
        for (const data of [tooLarge,new Float32Array(1),new Float64Array(1),new DataView(new ArrayBuffer(1))]) {
          try {crypto.getRandomValues(data);errors.push('no error');} catch(error) {errors.push(error.name);}
        }
        const empty=new Uint8Array();
        return {identities,viewIdentity,outside,maximumIdentity,errors,
          quotaDidNotWrite:tooLarge.every(n=>n===7),emptyIdentity:crypto.getRandomValues(empty)===empty};
        "#,
    );
    assert_eq!(
        actual,
        json!({"identities":[true,true,true,true,true,true,true,true,true],"viewIdentity":true,
            "outside":true,"maximumIdentity":true,"quotaDidNotWrite":true,"emptyIdentity":true,
            "errors":["QuotaExceededError","TypeMismatchError","TypeMismatchError","TypeMismatchError"]})
    );
}

#[test]
fn random_uuid_has_rfc4122_version_and_variant_bits() {
    assert_eq!(
        evaluate(
            r#"
            const uuid=crypto.randomUUID();
            return typeof uuid==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid);
            "#
        ),
        json!(true)
    );
}

#[test]
fn rsa_oaep_roundtrips_standard_formats_and_binds_hash_and_label() {
    let actual = evaluate(
        r#"
        const pair=await crypto.subtle.generateKey({name:'RSA-OAEP',modulusLength:1024,
          publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['encrypt','decrypt','wrapKey','unwrapKey']);
        const spki=await crypto.subtle.exportKey('spki',pair.publicKey);
        const pkcs8=await crypto.subtle.exportKey('pkcs8',pair.privateKey);
        const publicJwk=await crypto.subtle.exportKey('jwk',pair.publicKey);
        const privateJwk=await crypto.subtle.exportKey('jwk',pair.privateKey);
        const algorithm={name:'RSA-OAEP',hash:'SHA-256'};
        const publicDer=await crypto.subtle.importKey('spki',spki,algorithm,true,['encrypt']);
        const privateDer=await crypto.subtle.importKey('pkcs8',pkcs8,algorithm,false,['decrypt']);
        const publicJson=await crypto.subtle.importKey('jwk',publicJwk,algorithm,true,['encrypt']);
        const privateJson=await crypto.subtle.importKey('jwk',privateJwk,algorithm,false,['decrypt']);
        const wrongHash=await crypto.subtle.importKey('pkcs8',pkcs8,{name:'RSA-OAEP',hash:'SHA-1'},false,['decrypt']);
        const parameters={name:'RSA-OAEP',label:text('synthetic label')};
        const plaintext=text('synthetic RSA payload');
        const encrypted=await crypto.subtle.encrypt(parameters,publicJson,plaintext);
        const other=await crypto.subtle.encrypt(parameters,publicDer,plaintext);
        return {publicType:pair.publicKey.type,privateType:pair.privateKey.type,
          publicUsages:pair.publicKey.usages,privateUsages:pair.privateKey.usages,
          exponent:Array.from(pair.publicKey.algorithm.publicExponent),hash:pair.publicKey.algorithm.hash.name,
          encryptedBytes:encrypted.byteLength,
          derPlaintext:hex(await crypto.subtle.decrypt(parameters,privateDer,encrypted)),
          jwkPlaintext:hex(await crypto.subtle.decrypt(parameters,privateJson,other)),
          expected:hex(plaintext),
          wrongLabel:await rejection(crypto.subtle.decrypt({name:'RSA-OAEP',label:text('wrong label')},privateDer,encrypted)),
          wrongHash:await rejection(crypto.subtle.decrypt(parameters,wrongHash,encrypted)),
          wrongType:await rejection(crypto.subtle.decrypt(parameters,pair.publicKey,encrypted)),
          privateExport:await rejection(crypto.subtle.exportKey('pkcs8',privateDer))};
        "#,
    );
    let plaintext = "73796e74686574696320525341207061796c6f6164";
    assert_eq!(
        actual,
        json!({"publicType":"public","privateType":"private","publicUsages":["encrypt","wrapKey"],
            "privateUsages":["decrypt","unwrapKey"],"exponent":[1,0,1],"hash":"SHA-256",
            "encryptedBytes":128,"derPlaintext":plaintext,"jwkPlaintext":plaintext,"expected":plaintext,
            "wrongLabel":"OperationError","wrongHash":"OperationError","wrongType":"InvalidAccessError",
            "privateExport":"InvalidAccessError"})
    );
}

#[test]
fn rsa_oaep_decrypts_independent_vectors_for_all_hashes_and_labels() {
    // This key pair was generated solely for this test with Node Web Crypto.
    // The ciphertexts were produced there too, so changing both local encrypt
    // and decrypt in the same incorrect way cannot make this test pass.
    let actual = evaluate(
        r#"
        const fixture=
        {
          "spki": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c955de08c1653a2e262e63ba9b22d0e20be79708860f8ffeae401efcc389e52616a08062b1263e88640ff28cb6e2050f465378b97c18bfba743fbdecadfce7ce714491ec1da5bf7c1bb17d714e32a811cccc8bfc060162d0107bd06fae6ae988231e8d421bfe189749342f234ae3a5fbd0edd418494756527543eaf7135eb7b98edf7f9b4e0932eeb6d89050afe31417ad257cca092dc1a7e0f1cdae465c85718ace0b550667081e5d1ed338e8716786f6c9c160481892844bc553e563d53a207b4c76a9d5d6d2a268e206817c3876de982f40a76548c07b632f43dd05f11083efad430e319011af48aba4efe12979850c0ca45caa5562d9e8b93a62b83339730203010001",
          "pkcs8": "308204bc020100300d06092a864886f70d0101010500048204a6308204a20201000282010100c955de08c1653a2e262e63ba9b22d0e20be79708860f8ffeae401efcc389e52616a08062b1263e88640ff28cb6e2050f465378b97c18bfba743fbdecadfce7ce714491ec1da5bf7c1bb17d714e32a811cccc8bfc060162d0107bd06fae6ae988231e8d421bfe189749342f234ae3a5fbd0edd418494756527543eaf7135eb7b98edf7f9b4e0932eeb6d89050afe31417ad257cca092dc1a7e0f1cdae465c85718ace0b550667081e5d1ed338e8716786f6c9c160481892844bc553e563d53a207b4c76a9d5d6d2a268e206817c3876de982f40a76548c07b632f43dd05f11083efad430e319011af48aba4efe12979850c0ca45caa5562d9e8b93a62b833397302030100010282010011d81ef036b7d292c1868e073d75b5febae06145fb9fc87ae195c44951c9587a6a39fa7704cd67706e31eda4e4169f2d2de5fb06b1857e04b805e83ee062d066bf2a3d26a8b0068b28e72fbf89973ac72d1819f611d030a2513bb00b1df1d2d5e28af4291e530479f01e846903dbae5be5b6167cba8dec8c2d61822338dfc5b7afa1b284c5874c995f6b6529250ec5dc0a25704a5a048838522f0213d409b921221adfd0630d1f12790a0f7a148520aa936b76ec4b032e6e2017e29ac9d3a3644648d1cd1d14094b843050afab1a09aed3e07ead19db9e91f318bd419f8467c3027c6685755e8e03a8844309d3e4345b7dd6cb0937477667fe1f1bec288ab56102818100f5312a19883aecfb0589176fc5406de01b76c4a7c053b02db006e7a61bb7da03616c35098828633765cbdeeda2fd3569d84078964702d2d5835ba532ae15efc300826bedb3181710d8e5f84d6eea5000e073032f6122326b1026d6103682f9bb35586f53f92f607741a736623ccc4184cced0d1e4edd78b98079c77ca3e4b26102818100d235cf10046e4c44d4b084a4f798b6e292c908aa480501dc1ab0aa8a4417e45b7c7b6cdc25d54dad4a8e19988dd5cf5bc407a64781840b79b20b8e1923b100481e4c1398ba651231434ded5e91ef5667b56de5bc921f8745ff925ce76b23d0290a0abd4ce10bb9574bcc1a8ba96e5fd5a9bf0dbbff1ad874851c84cd828fe45302818068c26dcb64e250585c201bcc5c89cfa83df3bbc834ab4d0de834bb0ac4b303ca07f8f49c32f9969297c2c867de08b3a69a87c93de3ef37e793ed3722f530583587e53179e8d8351ab4a1653aa85622828d63768beac372a93dc86a139946d2ae82f75af194f9020d5216c06caeaf529b0bf78870579fd6b1e34ba4c903397661028180649f6345ac894bb2eb08b005f38b438803717dd75cf020aac68fe8a294e3c6e8d01698ce6cc1c513fd8b35cf639d844bcdf34772151a2b100edd1f210387b7b5cde2e6c285fed98d81452d29c6bb8565d16010c78a3ed356fb768948316e0c3788da093162cc64e4d7a094d863bb34dea709903e7c67d2533c60a1656a690c870281801abf2437e50853373579b8206cd24b5b772968b34a2fb4c4281405358fffae00bffeb1f9dda4b8209d4bb83cba5a1e6557fc00e570b6a33691ac37378bbff4759055a8d58240036065798f0ec67c93c732a4a991071646e2c707ead89a88b503046fee648fea397ee93436ef9da68f3c53ec88f7c0fa39c417a8c18051e3ab48",
          "vectors": [
            {
              "hash": "SHA-1",
              "label": "",
              "ciphertext": "36da538dcec201c79c08f2de896d02b8332ebf2cc80e7f52bbc0052f6ea1242a9f7015fd205af117a871f066ccfe4bb9481ec61fe3b96a657277eabbdcf1427de95afbcaf79c89cafd741262e0289d20f0334c143fa97e3fb5ea4766279ddb1fc22caf3e1d6c38aa66109262a5b711aba09e0eba95341c7d9dac92024aeed19b5e3fe4eff3d6eef44ffd6807d610a0b33f1fa2e61331c9489c3a57718b15217462d76240b42d49f2a2ed0620df31a2bd77696e07f43318619aec083d6324cf77db232742f51fbe9d6240d74ff74ac68b70f93c87043cdd9bd55404c7a72069407b2d3578fea27da96fa9052c47e862c66d7f4452ff43fc794f697be86d59707c"
            },
            {
              "hash": "SHA-256",
              "label": "000180ff",
              "ciphertext": "75e7eb1cf33f26b943ac29a7edbd9acf43a12a48e869b75c6e11234c9c2c19ebebb41859075ec54040d879c41c5815daea4ce6677a8e91de7ead77f80be084e5c565bd66b397d0aa6d90250ffc31a79c0ef66d999acac5d5f75a779c8d5e43343f6f3551109ec90e98017f1988d2369c2f7e3bca460f5608b03c9e4e6901106ffc599a13f4f9be8915eb71f240b2026197b06915606cf85ca309bd964ca17621be8e6d4f31d6f78688f98f7f6e7e483a6643d2551c02d6c92e377b6a81fa320634b6c2c75489d83f77200e87d77460560152866dcd12718a4cf19aa814afdffb8eccb00b7c52b546041e3cc449e42193bf845c50ea8f3d01a579ef93e72ac97a"
            },
            {
              "hash": "SHA-384",
              "label": "",
              "ciphertext": "204975f3eb431eff53078797f2435bbbdfecb77ab75685beda51e2eb999a04ad3f967d41fea9b2ad68b83cff40a788f04be656c71adeddd181a36a678b7309d660457b7e4206c01cd92431357e084357ef53a56276a8f942cf8b97bb772f9b5f4e46b2d40494cfe98c213a638ffac457ca9e45667f448567dba0a1400dbb88bfea0dbf3a456f22a3aec3011a530522658e39c18358d69cd64ff358b9f236d4c70999cea028ae78f5a733d7f77ab4d2f3bd5c2f5590bbedc9d6d373cb56141eaddbd4335c9dff66c95d3cd4280a24b42ba64ed06046730e0d40c52c89bb8488325c62112dd5bbf62e0a333d14c951ca03835439a1c409a9299a3d9be253ba1dde"
            },
            {
              "hash": "SHA-512",
              "label": "000180ff",
              "ciphertext": "bd2574acfce0b423ef5e936faf66af78d3b33ce132623f7f8e7f26e90e06926718a2fc508ddb2d29f86dbe24f56daab5b515ca92d0e95bd6f708d3747a9967fbde4dd367b8d72808061ab006953c7693259693def5c5fd50ad671c64e4879c5602d1e9a2257a9115f4bf3b832fc789ae4ee7a4ac0d6060ed33097f9719b767113a5d2bf0ec478b3b8ba2fdb07c81468e0d2816163f9257d27538f8dbc7879a891411955c821b35f7f649fbba5a82beaba0443d494b0b737380092a0778290ef08df02c52cfcc4b7fb64c80c35807a9ed438547dbd5f5e77a2b971abe123dbd7aa28e570489d9f3eb5df81332214af777a002410c1f3d3f9727694f18ca4736b0"
            }
          ]
        };
        const expected=hex(text('synthetic OAEP interoperability'));
        const output=[];
        let privateKey;
        for (const vector of fixture.vectors) {
          const algorithm={name:'RSA-OAEP',hash:vector.hash};
          privateKey=await crypto.subtle.importKey('pkcs8',unhex(fixture.pkcs8),algorithm,true,['decrypt']);
          const publicKey=await crypto.subtle.importKey('spki',unhex(fixture.spki),algorithm,false,['encrypt']);
          const parameters={name:'RSA-OAEP',label:unhex(vector.label)};
          const ciphertext=unhex(vector.ciphertext);
          const otherParameters={name:'RSA-OAEP',label:vector.label?new Uint8Array():new Uint8Array([0,1,128,255])};
          const encrypted=await crypto.subtle.encrypt(otherParameters,publicKey,text('synthetic OAEP interoperability'));
          output.push({independent:hex(await crypto.subtle.decrypt(parameters,privateKey,ciphertext))===expected,
            otherLabel:hex(await crypto.subtle.decrypt(otherParameters,privateKey,encrypted))===expected,
            wrongLabel:await rejection(crypto.subtle.decrypt(otherParameters,privateKey,ciphertext)),
            shortCiphertext:await rejection(crypto.subtle.decrypt(parameters,privateKey,ciphertext.subarray(0,128)))});
        }
        const jwk=await crypto.subtle.exportKey('jwk',privateKey);
        const generation={name:'RSA-OAEP',modulusLength:1024,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'};
        return {output,
          invalidCrt:await rejection(crypto.subtle.importKey('jwk',{...jwk,qi:'AA'},
            {name:'RSA-OAEP',hash:'SHA-512'},false,['decrypt'])),
          invalidExponent:await rejection(crypto.subtle.importKey('jwk',{kty:'RSA',n:jwk.n,e:'Ag'},
            {name:'RSA-OAEP',hash:'SHA-512'},false,['encrypt'])),
          roundedModulus:await rejection(crypto.subtle.generateKey({...generation,modulusLength:1025},false,['decrypt'])),
          oversizedExponent:await rejection(crypto.subtle.generateKey({...generation,publicExponent:new Uint8Array([1,0,0,0,1])},false,['decrypt']))};
        "#,
    );
    let case = json!({"independent":true,"otherLabel":true,
        "wrongLabel":"OperationError","shortCiphertext":"OperationError"});
    assert_eq!(
        actual,
        json!({"output":[case,case,case,case],
        "invalidCrt":"DataError","invalidExponent":"DataError",
        "roundedModulus":"OperationError","oversizedExponent":"OperationError"})
    );
}

#[test]
fn rsa_generated_public_key_remains_exportable_when_private_key_is_not() {
    let actual = evaluate(
        r#"
        const pair=await crypto.subtle.generateKey({name:'RSA-OAEP',modulusLength:1024,
          publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},false,['encrypt','decrypt']);
        return {publicExtractable:pair.publicKey.extractable,privateExtractable:pair.privateKey.extractable,
          publicExport:(await crypto.subtle.exportKey('spki',pair.publicKey)).byteLength>0,
          privateExport:await rejection(crypto.subtle.exportKey('jwk',pair.privateKey))};
        "#,
    );
    assert_eq!(
        actual,
        json!({"publicExtractable":true,"privateExtractable":false,"publicExport":true,"privateExport":"InvalidAccessError"})
    );
}

#[test]
fn rsa_der_import_requires_an_exact_der_envelope() {
    // Web Crypto's "parse a subjectPublicKeyInfo" and "parse a PrivateKeyInfo"
    // explicitly require exactData=true and DER encoding. Node/OpenSSL accepts
    // some trailing bytes, so this checks the specification rather than that
    // permissive behavior: https://www.w3.org/TR/WebCryptoAPI/#terminology
    let actual = evaluate(
        r#"
        const pair=await crypto.subtle.generateKey({name:'RSA-OAEP',modulusLength:1024,
          publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['encrypt','decrypt']);
        const output=[];
        for (const [format,key,usage] of [['spki',pair.publicKey,'encrypt'],['pkcs8',pair.privateKey,'decrypt']]) {
          const der=new Uint8Array(await crypto.subtle.exportKey(format,key));
          const algorithm={name:'RSA-OAEP',hash:'SHA-256'};
          const imported=await crypto.subtle.importKey(format,der,algorithm,false,[usage]);
          const trailing=new Uint8Array(der.length+1);trailing.set(der);
          const nonminimal=new Uint8Array(der.length+1);
          nonminimal[0]=der[0];nonminimal[1]=der[1]+1;nonminimal[2]=0;nonminimal.set(der.subarray(2),3);
          output.push({valid:imported.type===key.type,
            trailing:await rejection(crypto.subtle.importKey(format,trailing,algorithm,false,[usage])),
            truncated:await rejection(crypto.subtle.importKey(format,der.subarray(0,der.length-1),algorithm,false,[usage])),
            nonminimal:await rejection(crypto.subtle.importKey(format,nonminimal,algorithm,false,[usage]))});
        }
        return output;
        "#,
    );
    assert_eq!(
        actual,
        json!([
            {"valid":true,"trailing":"DataError","truncated":"DataError","nonminimal":"DataError"},
            {"valid":true,"trailing":"DataError","truncated":"DataError","nonminimal":"DataError"}
        ])
    );
}

#[test]
fn wrapping_keys_respects_wrap_permissions_and_unwrapped_key_policy() {
    let actual = evaluate(
        r#"
        const wrapping=await crypto.subtle.generateKey({name:'AES-GCM',length:128},false,['wrapKey','unwrapKey']);
        const key=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',true,['encrypt']);
        const sealed=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['encrypt']);
        const parameters={name:'AES-GCM',iv:new Uint8Array(12)};
        const wrapped=await crypto.subtle.wrapKey('raw',key,wrapping,parameters);
        const restored=await crypto.subtle.unwrapKey('raw',wrapped,wrapping,parameters,'AES-GCM',false,['encrypt']);
        const ciphertext=await crypto.subtle.encrypt(parameters,restored,new Uint8Array(16));
        const changed=new Uint8Array(wrapped);changed[0]^=1;
        return {wrappedBytes:wrapped.byteLength,extractable:restored.extractable,usages:restored.usages,
          ciphertext:hex(ciphertext),
          exportError:await rejection(crypto.subtle.exportKey('raw',restored)),
          encryptWithWrappingKey:await rejection(crypto.subtle.encrypt(parameters,wrapping,new Uint8Array())),
          wrapNonextractable:await rejection(crypto.subtle.wrapKey('raw',sealed,wrapping,parameters)),
          tampered:await rejection(crypto.subtle.unwrapKey('raw',changed,wrapping,parameters,'AES-GCM',false,['encrypt']))};
        "#,
    );
    assert_eq!(
        actual,
        json!({"wrappedBytes":32,"extractable":false,"usages":["encrypt"],
            "ciphertext":"0388dace60b6a392f328c2b971b2fe78ab6e47d42cec13bdf53a67b21257bddf",
            "exportError":"InvalidAccessError","encryptWithWrappingKey":"InvalidAccessError",
            "wrapNonextractable":"InvalidAccessError","tampered":"OperationError"})
    );
}
