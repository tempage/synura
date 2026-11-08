//! Generic Web Crypto conformance using RFC vectors and synthetic test keys.
//! No service responses, user data, or application keys are used here.

use serde_json::{json, Value};
use std::sync::atomic::{AtomicU64, Ordering};

static NEXT_RUNTIME: AtomicU64 = AtomicU64::new(0);

const HELPERS: &str = r#"
const hex = data => Array.from(new Uint8Array(data), n => n.toString(16).padStart(2, '0')).join('');
const unhex = value => new Uint8Array(value.match(/../g)?.map(n => parseInt(n, 16)) || []);
const text = value => new TextEncoder().encode(value);
const reject = async promise => {
    try { await promise; return 'resolved'; } catch (error) { return error.name; }
};
const pubJwk = source => {
    const result = {...source};
    for (const name of ['d','p','q','dp','dq','qi']) delete result[name];
    return result;
};
"#;

fn evaluate(body: &str) -> Value {
    let path = std::env::temp_dir().join(format!(
        "synurart-extended-crypto-{}-{}",
        std::process::id(),
        NEXT_RUNTIME.fetch_add(1, Ordering::Relaxed)
    ));
    let runtime =
        synurart::SynurartRuntime::new(true, path.join("storage.json"), path.join("extension.js"))
            .unwrap();
    runtime
        .eval_js(&format!(
            "(async () => {{ const vectors = {VECTORS}; {HELPERS} {body} }})()"
        ))
        .unwrap()["result"]
        .clone()
}

#[test]
fn pbkdf2_matches_rfc6070_including_embedded_nul_bytes() {
    // https://www.rfc-editor.org/rfc/rfc6070#section-2
    let actual = evaluate(
        r#"
        const examples = [
            ['password','salt',1,160], ['password','salt',2,160],
            ['password','salt',4096,160],
            ['passwordPASSWORDpassword','saltSALTsaltSALTsaltSALTsaltSALTsalt',4096,200],
            ['pass\0word','sa\0lt',4096,128]
        ];
        const output = [];
        for (const [password,salt,iterations,length] of examples) {
            const key = await crypto.subtle.importKey('raw',text(password),'pbkdf2',false,['deriveBits']);
            output.push(hex(await crypto.subtle.deriveBits(
                {name:'PBKDF2',hash:'SHA-1',salt:text(salt),iterations},key,length)));
        }
        return output;
        "#,
    );
    assert_eq!(
        actual,
        json!([
            "0c60c80f961f0e71f3a9b524af6012062fe037a6",
            "ea6c014dc72d6f8ccd1ed92ace1d41f0d8de8957",
            "4b007901b765489abead49d926f721d065a429c1",
            "3d2eec4fe41c849b80c8d83662c0e44a8b291a964cf2f07038",
            "56fa6aa75548099dcc37d7f03425e0c3"
        ])
    );
}

#[test]
fn pbkdf2_sha2_derives_nonextractable_keys_with_independent_expected_bytes() {
    // Synthetic password/salt, independently computed with Node crypto.pbkdf2Sync.
    let actual = evaluate(
        r#"
        const out = [];
        for (const hash of ['SHA-256','SHA-384','SHA-512']) {
            const base = await crypto.subtle.importKey('raw',text('password'),'PBKDF2',false,['deriveBits','deriveKey']);
            const algorithm = {name:'PBKDF2',hash,salt:text('salt'),iterations:2};
            const key = await crypto.subtle.deriveKey(algorithm,base,{name:'AES-CBC',length:256},false,['encrypt']);
            const bytes = await crypto.subtle.deriveBits(algorithm,base,256);
            const expectedKey = await crypto.subtle.importKey('raw',bytes,'AES-CBC',false,['encrypt']);
            const cipher = {name:'AES-CBC',iv:new Uint8Array(16)};
            out.push({bytes:hex(bytes),extractable:key.extractable,
                equal:hex(await crypto.subtle.encrypt(cipher,key,text('derived key'))) ===
                    hex(await crypto.subtle.encrypt(cipher,expectedKey,text('derived key'))),
                export:await reject(crypto.subtle.exportKey('raw',key))});
        }
        return out;
        "#,
    );
    let expected = [
        "ae4d0c95af6b46d32d0adff928f06dd02a303f8ef3c251dfd6e2d85a95474c43",
        "54f775c6d790f21930459162fc535dbf04a939185127016a04176a0730c6f1f4",
        "e1d9c16aa681708a45f5c7c4e215ceb66e011a2e9f0040713f18aefdb866d53c",
    ];
    assert_eq!(
        actual,
        Value::Array(
            expected
                .into_iter()
                .map(|bytes| json!({
                    "bytes":bytes,"extractable":false,"equal":true,"export":"InvalidAccessError"
                }))
                .collect()
        )
    );
}

#[test]
fn hkdf_matches_rfc5869_and_derives_aes_and_hmac_keys() {
    // RFC 5869 Appendix A.1 and A.3, including empty salt and info.
    let actual = evaluate(
        r#"
        const key = await crypto.subtle.importKey('raw',new Uint8Array(22).fill(11),
            'HKDF',false,['deriveBits','deriveKey']);
        const algorithm = {name:'HKDF',hash:'SHA-256',
            salt:unhex('000102030405060708090a0b0c'),info:unhex('f0f1f2f3f4f5f6f7f8f9')};
        const aes = await crypto.subtle.deriveKey(algorithm,key,{name:'AES-GCM',length:128},true,['encrypt']);
        const hmac = await crypto.subtle.deriveKey(algorithm,key,{name:'HMAC',hash:'SHA-256',length:256},true,['sign']);
        return {
            case1:hex(await crypto.subtle.deriveBits(algorithm,key,336)),
            case3:hex(await crypto.subtle.deriveBits({...algorithm,salt:new Uint8Array(),info:new Uint8Array()},key,336)),
            aes:{bytes:hex(await crypto.subtle.exportKey('raw',aes)),algorithm:aes.algorithm,usages:aes.usages},
            hmac:{bytes:hex(await crypto.subtle.exportKey('raw',hmac)),algorithm:hmac.algorithm,usages:hmac.usages},
            base:{algorithm:key.algorithm,extractable:key.extractable,type:key.type},
            zero:(await crypto.subtle.deriveBits(algorithm,key,0)).byteLength
        };
        "#,
    );
    assert_eq!(
        actual,
        json!({
            "case1":"3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865",
            "case3":"8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d9d201395faa4b61a96c8",
            "aes":{"bytes":"3cb25f25faacd57a90434f64d0362f2a","algorithm":{"name":"AES-GCM","length":128},"usages":["encrypt"]},
            "hmac":{"bytes":"3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf","algorithm":{"name":"HMAC","hash":{"name":"SHA-256"},"length":256},"usages":["sign"]},
            "base":{"algorithm":{"name":"HKDF"},"extractable":false,"type":"secret"},"zero":0
        })
    );
}

#[test]
fn key_derivation_enforces_key_usage_parameters_and_extractability() {
    let actual = evaluate(
        r#"
        const results = [];
        for (const name of ['PBKDF2','HKDF']) {
            const key = await crypto.subtle.importKey('raw',text('password'),name,false,['deriveBits']);
            const algorithm = {name,hash:'SHA-256',salt:text('salt'),info:new Uint8Array(),iterations:1};
            results.push({
                extractable:await reject(crypto.subtle.importKey('raw',text('x'),name,true,['deriveBits'])),
                usage:await reject(crypto.subtle.importKey('raw',text('x'),name,false,['sign'])),
                export:await reject(crypto.subtle.exportKey('raw',key)),
                generation:await reject(crypto.subtle.generateKey(name,false,['deriveBits'])),
                notByteLength:await reject(crypto.subtle.deriveBits(algorithm,key,7)),
                nullLength:await reject(crypto.subtle.deriveBits(algorithm,key,null)),
                zeroLength:(await crypto.subtle.deriveBits(algorithm,key,0)).byteLength,
                deriveKeyUsage:await reject(crypto.subtle.deriveKey(algorithm,key,{name:'AES-CBC',length:128},true,['encrypt']))
            });
        }
        const hkdf = await crypto.subtle.importKey('raw',text('x'),'HKDF',false,['deriveBits']);
        const tooLong = await reject(crypto.subtle.deriveBits(
            {name:'HKDF',hash:'SHA-256',salt:new Uint8Array(),info:new Uint8Array()},hkdf,(255*32+1)*8));
        const pbkdf = await crypto.subtle.importKey('raw',text('x'),'PBKDF2',false,['deriveBits']);
        const zeroIterations = await reject(crypto.subtle.deriveBits(
            {name:'PBKDF2',hash:'SHA-256',salt:new Uint8Array(),iterations:0},pbkdf,128));
        return {results,tooLong,zeroIterations};
        "#,
    );
    let expected = json!({
        "extractable":"SyntaxError","usage":"SyntaxError","export":"NotSupportedError",
        "generation":"NotSupportedError","notByteLength":"OperationError","nullLength":"OperationError",
        "zeroLength":0,"deriveKeyUsage":"InvalidAccessError"
    });
    assert_eq!(
        actual,
        json!({"results":[expected.clone(),expected],"tooLong":"OperationError","zeroIterations":"OperationError"})
    );
}

#[test]
fn rsa_signatures_interoperate_with_independent_node_vectors() {
    let actual = evaluate(
        r#"
        const output = [];
        for (const name of ['RSASSA-PKCS1-v1_5','RSA-PSS']) {
            const algorithm = {name,hash:'SHA-256'};
            const privateKey = await crypto.subtle.importKey('jwk',vectors.rsa.privateJwk,algorithm,true,['sign']);
            const publicKey = await crypto.subtle.importKey('jwk',pubJwk(vectors.rsa.privateJwk),algorithm,true,['verify']);
            const operation = name === 'RSA-PSS' ? {name,saltLength:32} : name;
            const fixture = unhex(name === 'RSA-PSS' ? vectors.rsa.pss : vectors.rsa.pkcs1);
            const data = text(vectors.message);
            const signature = await crypto.subtle.sign(operation,privateKey,data);
            const changed = fixture.slice(); changed[0] ^= 1;
            output.push({name:privateKey.algorithm.name,
                fixture:await crypto.subtle.verify(operation,publicKey,fixture,data),
                generated:await crypto.subtle.verify(operation,publicKey,signature,data),
                deterministic:name === 'RSA-PSS' || hex(signature) === vectors.rsa.pkcs1,
                changed:await crypto.subtle.verify(operation,publicKey,changed,data),
                wrongMessage:await crypto.subtle.verify(operation,publicKey,fixture,text('different')),
                short:await crypto.subtle.verify(operation,publicKey,fixture.subarray(1),data),
                publicSign:await reject(crypto.subtle.sign(operation,publicKey,data)),
                length:signature.byteLength
            });
        }
        return output;
        "#,
    );
    for (item, name) in actual
        .as_array()
        .unwrap()
        .iter()
        .zip(["RSASSA-PKCS1-v1_5", "RSA-PSS"])
    {
        assert_eq!(
            item,
            &json!({"name":name,"fixture":true,"generated":true,"deterministic":true,
            "changed":false,"wrongMessage":false,"short":false,"publicSign":"InvalidAccessError","length":256})
        );
    }
}

#[test]
fn rsa_signature_keys_roundtrip_formats_and_enforce_pss_salt_length() {
    let actual = evaluate(
        r#"
        const out = [];
        for (const name of ['RSASSA-PKCS1-v1_5','RSA-PSS']) {
            const algorithm = {name,hash:'SHA-256'};
            const original = await crypto.subtle.importKey('jwk',vectors.rsa.privateJwk,algorithm,true,['sign']);
            const pkcs8 = await crypto.subtle.exportKey('pkcs8',original);
            const privateKey = await crypto.subtle.importKey('pkcs8',pkcs8,algorithm,true,['sign']);
            const publicKey = await crypto.subtle.importKey('jwk',pubJwk(vectors.rsa.privateJwk),algorithm,true,['verify']);
            const spki = await crypto.subtle.exportKey('spki',publicKey);
            const imported = await crypto.subtle.importKey('spki',spki,algorithm,true,['verify']);
            const jwk = await crypto.subtle.exportKey('jwk',privateKey);
            const operation = name === 'RSA-PSS' ? {name,saltLength:0} : name;
            const signature = await crypto.subtle.sign(operation,privateKey,text('roundtrip'));
            const badJwk = {...jwk,alg:'RSA-OAEP-256'};
            out.push({alg:jwk.alg,
                valid:await crypto.subtle.verify(operation,imported,signature,text('roundtrip')),
                badJwk:await reject(crypto.subtle.importKey('jwk',badJwk,algorithm,true,['sign'])),
                nonextractable:await reject(crypto.subtle.exportKey('pkcs8',await crypto.subtle.importKey('pkcs8',pkcs8,algorithm,false,['sign'])))
            });
        }
        const algorithm = {name:'RSA-PSS',hash:'SHA-256'};
        const pss = await crypto.subtle.importKey('jwk',vectors.rsa.privateJwk,algorithm,false,['sign']);
        const pub = await crypto.subtle.importKey('jwk',pubJwk(vectors.rsa.privateJwk),algorithm,false,['verify']);
        return {out,
            missing:await reject(crypto.subtle.sign('RSA-PSS',pss,text('x'))),
            impossible:await reject(crypto.subtle.sign({name:'RSA-PSS',saltLength:256},pss,text('x'))),
            wrongSalt:await crypto.subtle.verify({name:'RSA-PSS',saltLength:0},pub,unhex(vectors.rsa.pss),text(vectors.message))
        };
        "#,
    );
    assert_eq!(
        actual,
        json!({"out":[
        {"alg":"RS256","valid":true,"badJwk":"DataError","nonextractable":"InvalidAccessError"},
        {"alg":"PS256","valid":true,"badJwk":"DataError","nonextractable":"InvalidAccessError"}
    ],"missing":"TypeError","impossible":"OperationError","wrongSalt":false})
    );
}

#[test]
fn asymmetric_key_generation_has_standard_metadata_and_usage_partitioning() {
    let actual = evaluate(
        r#"
        const out = [];
        for (const name of ['RSASSA-PKCS1-v1_5','RSA-PSS','ECDSA','ECDH']) {
            const algorithm = name.startsWith('RSA') ?
                {name,hash:'SHA-256',modulusLength:1024,publicExponent:new Uint8Array([1,0,1])} : {name,namedCurve:'P-256'};
            const usages = name === 'ECDH' ? ['deriveBits','deriveKey'] : ['sign','verify'];
            const pair = await crypto.subtle.generateKey(algorithm,false,usages);
            out.push({name:pair.privateKey.algorithm.name,publicType:pair.publicKey.type,privateType:pair.privateKey.type,
                publicExtractable:pair.publicKey.extractable,privateExtractable:pair.privateKey.extractable,
                publicUsages:[...pair.publicKey.usages].sort(),privateUsages:[...pair.privateKey.usages].sort()});
        }
        return out;
        "#,
    );
    for (item, name) in
        actual
            .as_array()
            .unwrap()
            .iter()
            .zip(["RSASSA-PKCS1-v1_5", "RSA-PSS", "ECDSA", "ECDH"])
    {
        let (public, private) = if name == "ECDH" {
            (json!([]), json!(["deriveBits", "deriveKey"]))
        } else {
            (json!(["verify"]), json!(["sign"]))
        };
        assert_eq!(
            item,
            &json!({"name":name,"publicType":"public","privateType":"private",
            "publicExtractable":true,"privateExtractable":false,"publicUsages":public,"privateUsages":private})
        );
    }
}

#[test]
fn ecdsa_verifies_independent_p1363_vectors_for_all_supported_curves() {
    let actual = evaluate(
        r#"
        const out = [];
        for (const curve of vectors.curves) {
            const algorithm = {name:'ECDSA',namedCurve:curve.name};
            const publicKey = await crypto.subtle.importKey('jwk',pubJwk(curve.privateJwk),algorithm,true,['verify']);
            const privateKey = await crypto.subtle.importKey('jwk',curve.privateJwk,algorithm,true,['sign']);
            const operation = {name:'ECDSA',hash:'SHA-256'};
            const fixture = unhex(curve.signature);
            const generated = await crypto.subtle.sign(operation,privateKey,text(vectors.message));
            out.push({curve:curve.name,size:generated.byteLength,
                fixture:await crypto.subtle.verify(operation,publicKey,fixture,text(vectors.message)),
                generated:await crypto.subtle.verify(operation,publicKey,generated,text(vectors.message)),
                short:await crypto.subtle.verify(operation,publicKey,fixture.subarray(1),text(vectors.message)),
                wrongMessage:await crypto.subtle.verify(operation,publicKey,fixture,text('different')),
                zero:await crypto.subtle.verify(operation,publicKey,new Uint8Array(curve.size*2),text(vectors.message)),
                missingHash:await reject(crypto.subtle.sign('ECDSA',privateKey,text('x')))
            });
        }
        return out;
        "#,
    );
    for (item, (name, size)) in
        actual
            .as_array()
            .unwrap()
            .iter()
            .zip([("P-256", 64), ("P-384", 96), ("P-521", 132)])
    {
        assert_eq!(
            item,
            &json!({"curve":name,"size":size,"fixture":true,"generated":true,
            "short":false,"wrongMessage":false,"zero":false,"missingHash":"TypeError"})
        );
    }
}

#[test]
fn ec_keys_roundtrip_jwk_raw_spki_and_pkcs8_and_reject_invalid_points() {
    let actual = evaluate(
        r#"
        const out = [];
        for (const curve of vectors.curves) {
            const algorithm = {name:'ECDSA',namedCurve:curve.name};
            const privateKey = await crypto.subtle.importKey('jwk',curve.privateJwk,algorithm,true,['sign']);
            const publicKey = await crypto.subtle.importKey('jwk',pubJwk(curve.privateJwk),algorithm,true,['verify']);
            const pkcs8 = await crypto.subtle.exportKey('pkcs8',privateKey);
            const importedPrivate = await crypto.subtle.importKey('pkcs8',pkcs8,algorithm,true,['sign']);
            const signature = await crypto.subtle.sign({name:'ECDSA',hash:'SHA-384'},importedPrivate,text('formats'));
            const checks = [];
            for (const format of ['raw','spki','jwk']) {
                const exported = await crypto.subtle.exportKey(format,publicKey);
                const imported = await crypto.subtle.importKey(format,exported,algorithm,true,['verify']);
                checks.push(await crypto.subtle.verify({name:'ECDSA',hash:'SHA-384'},imported,signature,text('formats')));
            }
            const badPoint = new Uint8Array(1 + 2*curve.size); badPoint[0]=4;
            const trailing = new Uint8Array(pkcs8.byteLength+1);trailing.set(new Uint8Array(pkcs8));
            out.push({curve:curve.name,checks,
                badPoint:await reject(crypto.subtle.importKey('raw',badPoint,algorithm,true,['verify'])),
                privateRaw:await reject(crypto.subtle.exportKey('raw',privateKey)),
                trailing:await reject(crypto.subtle.importKey('pkcs8',trailing,algorithm,true,['sign'])),
                scalar:(await crypto.subtle.exportKey('jwk',importedPrivate)).d === curve.privateJwk.d
            });
        }
        return out;
        "#,
    );
    for (item, name) in actual
        .as_array()
        .unwrap()
        .iter()
        .zip(["P-256", "P-384", "P-521"])
    {
        assert_eq!(
            item,
            &json!({"curve":name,"checks":[true,true,true],"badPoint":"DataError",
            "privateRaw":"NotSupportedError","trailing":"DataError","scalar":true})
        );
    }
}

#[test]
fn ecdh_matches_independent_scalar_vectors_and_truncates_bits_correctly() {
    let actual = evaluate(
        r#"
        const out = [];
        for (const curve of vectors.curves) {
            const algorithm = {name:'ECDH',namedCurve:curve.name};
            const privateKey = await crypto.subtle.importKey('jwk',curve.privateJwk,algorithm,true,['deriveBits','deriveKey']);
            const peer = await crypto.subtle.importKey('raw',unhex(curve.peer),algorithm,true,[]);
            const operation = {name:'ECDH',public:peer};
            const expected = unhex(curve.shared);
            const prefix = await crypto.subtle.deriveBits(operation,privateKey,13);
            const masked = expected.slice(0,2);masked[1]&=0xf8;
            const aes = await crypto.subtle.deriveKey(operation,privateKey,{name:'AES-GCM',length:256},true,['decrypt']);
            const imported = await crypto.subtle.importKey('pkcs8',await crypto.subtle.exportKey('pkcs8',privateKey),algorithm,false,['deriveBits']);
            out.push({curve:curve.name,secret:hex(await crypto.subtle.deriveBits(operation,privateKey,null)),
                full:hex(await crypto.subtle.deriveBits(operation,privateKey,curve.size*8))===curve.shared,
                truncated:hex(prefix)===hex(masked),zero:(await crypto.subtle.deriveBits(operation,privateKey,0)).byteLength,
                aes:hex(await crypto.subtle.exportKey('raw',aes))===hex(expected.slice(0,32)),
                privateFormat:hex(await crypto.subtle.deriveBits(operation,imported,null))===curve.shared,
                tooLong:await reject(crypto.subtle.deriveBits(operation,privateKey,curve.size*8+1)),
                publicAsBase:await reject(crypto.subtle.deriveBits(operation,peer,128)),
                privateAsPeer:await reject(crypto.subtle.deriveBits({name:'ECDH',public:privateKey},privateKey,128)),
                peerUsages:peer.usages
            });
        }
        return out;
        "#,
    );
    let fixtures: Value = serde_json::from_str(VECTORS).unwrap();
    for (item, curve) in actual
        .as_array()
        .unwrap()
        .iter()
        .zip(fixtures["curves"].as_array().unwrap())
    {
        assert_eq!(
            item,
            &json!({"curve":curve["name"],"secret":curve["shared"],"full":true,
            "truncated":true,"zero":0,"aes":true,"privateFormat":true,"tooLong":"OperationError",
            "publicAsBase":"InvalidAccessError","privateAsPeer":"InvalidAccessError","peerUsages":[]})
        );
    }
}

#[test]
fn ecdh_derives_kdf_base_keys_using_the_full_shared_secret() {
    // HKDF/PBKDF2 Get Key Length returns null, so ECDH supplies its full secret.
    // https://www.w3.org/TR/2017/REC-WebCryptoAPI-20170126/#hkdf-operations
    let actual = evaluate(
        r#"
        const curve = vectors.curves[0];
        const algorithm = {name:'ECDH',namedCurve:curve.name};
        const privateKey = await crypto.subtle.importKey('jwk',curve.privateJwk,algorithm,false,['deriveKey']);
        const peer = await crypto.subtle.importKey('raw',unhex(curve.peer),algorithm,true,[]);
        const out = [];
        for (const name of ['HKDF','PBKDF2']) {
            const derived = await crypto.subtle.deriveKey({name:'ECDH',public:peer},privateKey,name,false,['deriveBits']);
            const expected = await crypto.subtle.importKey('raw',unhex(curve.shared),name,false,['deriveBits']);
            const operation = {name,hash:'SHA-256',salt:text('salt'),info:text('context'),iterations:2};
            out.push({name:derived.algorithm.name,extractable:derived.extractable,
                equal:hex(await crypto.subtle.deriveBits(operation,derived,256)) ===
                    hex(await crypto.subtle.deriveBits(operation,expected,256)),
                invalidExtractability:await reject(crypto.subtle.deriveKey({name:'ECDH',public:peer},privateKey,name,true,['deriveBits']))
            });
        }
        const base = await crypto.subtle.importKey('raw',text('x'),'HKDF',false,['deriveKey']);
        return {out,nullKdfLength:await reject(crypto.subtle.deriveKey(
            {name:'HKDF',hash:'SHA-256',salt:new Uint8Array(),info:new Uint8Array()},base,'HKDF',false,['deriveBits']))};
        "#,
    );
    assert_eq!(
        actual,
        json!({"out":[
        {"name":"HKDF","extractable":false,"equal":true,"invalidExtractability":"SyntaxError"},
        {"name":"PBKDF2","extractable":false,"equal":true,"invalidExtractability":"SyntaxError"}
    ],"nullKdfLength":"OperationError"})
    );
}

#[test]
fn derive_bits_length_uses_nullable_unsigned_long_conversion() {
    // The published Level 2 draft and browser-compatible Node API use ordinary
    // unsigned conversion here; the evolving editor's draft differs.
    let actual = evaluate(
        r#"
        const curve = vectors.curves[0];
        const algorithm = {name:'ECDH',namedCurve:curve.name};
        const base = await crypto.subtle.importKey('jwk',curve.privateJwk,algorithm,false,['deriveBits']);
        const peer = await crypto.subtle.importKey('raw',unhex(curve.peer),algorithm,true,[]);
        const operation = {name:'ECDH',public:peer};
        const sizes = [];
        for (const length of [undefined,null,NaN,Infinity,4294967296,8.9]) {
            sizes.push((await crypto.subtle.deriveBits(operation,base,length)).byteLength);
        }
        return {sizes,negative:await reject(crypto.subtle.deriveBits(operation,base,-1)),
            bigint:await reject(crypto.subtle.deriveBits(operation,base,1n)),
            omitted:(await crypto.subtle.deriveBits(operation,base)).byteLength,
            arity:crypto.subtle.deriveBits.length};
        "#,
    );
    assert_eq!(
        actual,
        json!({"sizes":[32,32,0,0,0,1],"negative":"OperationError", "bigint":"TypeError","omitted":32,"arity":2})
    );
}

#[test]
fn derive_key_separately_normalizes_import_and_length_algorithms() {
    // Standard deriveKey steps 4 and 6 normalize the target independently.
    // The observable getter order and result were checked against Node Web Crypto.
    let actual = evaluate(
        r#"
        const base = await crypto.subtle.importKey('raw',text('input'),'HKDF',false,['deriveKey']);
        const operation = {name:'HKDF',hash:'SHA-256',salt:new Uint8Array(),info:new Uint8Array()};
        const calls = []; let reads=0;
        const target = {
            get name(){calls.push('name');return ++reads===1 ? 'AES-GCM' : 'HMAC'},
            get hash(){calls.push('hash');return 'SHA-256'},
            get length(){calls.push('length');return 256}
        };
        const derived = await crypto.subtle.deriveKey(operation,base,target,true,['encrypt']);
        let errors=0;
        const throwing = {get name(){if (++errors===2) throw new RangeError('second normalization');return 'AES-GCM'},length:128};
        return {algorithm:derived.algorithm,calls,
            secondError:await reject(crypto.subtle.deriveKey(operation,base,throwing,true,['encrypt'])),errors};
        "#,
    );
    assert_eq!(
        actual,
        json!({"algorithm":{"name":"AES-GCM","length":256},
        "calls":["name","name","hash","length"],"secondError":"RangeError","errors":2})
    );
}

#[test]
fn algorithms_and_keys_cannot_cross_operation_boundaries() {
    let actual = evaluate(
        r#"
        const pair = await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
        const otherCurve = await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-384'},true,['deriveBits']);
        const signatureKey = await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
        return {
            otherCurve:await reject(crypto.subtle.deriveBits({name:'ECDH',public:otherCurve.publicKey},pair.privateKey,128)),
            otherAlgorithm:await reject(crypto.subtle.deriveBits({name:'ECDH',public:signatureKey.publicKey},pair.privateKey,128)),
            nonstandard:await reject(crypto.subtle.generateKey({name:'RSAES-PKCS1-v1_5',modulusLength:2048,
                publicExponent:new Uint8Array([1,0,1])},true,['encrypt','decrypt'])),
            unsupportedCurve:await reject(crypto.subtle.generateKey({name:'ECDSA',namedCurve:'secp256k1'},true,['sign'])),
            ctr:await reject(crypto.subtle.generateKey({name:'AES-CTR',length:128},true,['encrypt']))
        };
        "#,
    );
    assert_eq!(
        actual,
        json!({"otherCurve":"InvalidAccessError","otherAlgorithm":"InvalidAccessError",
        "nonstandard":"NotSupportedError","unsupportedCurve":"NotSupportedError","ctr":"NotSupportedError"})
    );
}

// Generated exclusively for this test with Node 24's independent crypto backend.
// RSA: fresh 2048-bit pair, SHA-256 PKCS#1 signature and PSS signature (32-byte salt).
// EC: deliberately public scalars 1 and 2; peer = 2*G and shared secret = x(2*G).
// ECDSA signatures use SHA-256 and IEEE P1363 fixed-width r || s encoding.
// These are disposable test credentials and must never be used for real data.
const VECTORS: &str = r#"{
  "message": "synurart public synthetic interoperability fixture",
  "rsa": {
    "privateJwk": {
      "kty": "RSA",
      "n": "uJUW3oz311TY_Zvztdx7dFYbUVDctQ2Vk14upQJQX5ZA2uuK40rIzo_-yerGxWUGsuCOq1ECY8Wkwflm3RIfdgdUv6n93gAiSI-kJB04iMOJnB6g6Os34wLn6vIfB85hhU10gsmEMbwC3r0C0XrxP0-HCskoE19f-ZNBVU9kxaQBQtdei9o6wEGkCU-L_RvKTtbC7ZpJ4J363t8d6S_22hhIqvmTvRB9b0B4XTAxp1i_9ZhV7sg8gN_b7v6pkX13uccHrfpBVod7K1eOcqD8wsX-mDvxM3XK8_tVJLLM0KzoK57AXDB88_ctgYo8tpFGFgbrhyy9gCgX2JtykHpypw",
      "e": "AQAB",
      "d": "JC1sfxAoH3dM1GA1oyZkuAeMcSKlL4NLFsg14jeS4zlC2uWhoiztMLc-W_r9HIFRj8u9isxk6IM7aJ1mUNwVeH-1V5-M1281SP2GUWG8y-lvVj8WkLBRktfl9sGf3VrQ-FyXAm9Wzpyn_1oSbFZpZFxE_pMwnKNr3zHCc2MNQEMv3_hhwH-FuwoqtfRAjhGywcUWsCjxPTJfNE5VXV3JRrmCqbB2Bs4Nphg9l6hEwnp6L_HffWO4ymrK1G0Aunh-CNv_eArOBsVJAie4wN7vEJqqQ1okG7URRDyd6h7zJgY-9oo47CE3LRJ9_uvnGr7IBON7NzymfxSPYCb97mYs4Q",
      "p": "96v2tW9zgd93HjHDUiVTOEGkZECNPNZsPfitzrPkC67o1m3U_zp-BV6pfV9LQXXSzFye8JpJg_bANql-o4xl6fv5euhPC1RxPeaX-5Nny28OdpxjlTVF9xP62tABIldapZno1WVzo04EKL2POrm0d3vuZ2-3PhWKdeb0AjW2KZE",
      "q": "vsoIWLxkr0zu1xLwkCITxQXis2SnJCfgsd1LC6bVmgsunxPEEKsRdBiGKnJtaP5rDYSax56HziknImMjpSvAbgu6c1IhJ6rEgtXNxAHjRqlIENKFuH2in-RE6gsYcHA-zwUKnF-BsSow5lMFCDFmbYy7lKOb41m75abUa0jY_Lc",
      "dp": "7JCel3Ka-6P83SRfEimAsa1RXkiiH0gYH6FWMqd03Qv2bkp-NkMid_KRJaVN9nqaHIUjc2GLcrbPpeaDhafm-HWrOBCI36OKfruw06VacN_lCroaDDzUVUoKQ9KGIs0ZUjAOSzYaHBO6uUdGdatHixEfCEGW34AnvrIYw7uWAWE",
      "dq": "WcrD-t9Pk6Fllxt21J71JvkKJNvuPfn2qj84Hpe6V_GDU6L918prQHR6UGfiTlPPFmGeZuyZhdGgdXKrSAU7X49thPDWYdDhA6KUYPdye8MYA7LQ9G9MpmvMc0odim2JYe1BfS8F3te4g-32pFB7oHtnnSETMQD-iarmtkdmuCk",
      "qi": "evaxJuBiL1u84L_81E0oiBj2qngpPC_4EF00tSgVDmdhdchugiWZOiL66zh1Sxu7HtC0DEuCwzLj53UMRqu_HxZT2XLdeviY0F775cN0_J0rdSJLpQwt7ADAPY0u0mm-VqvL-ckJS_du1ni9tNi_G1Qdkz8goyPCuaD0Kk2NThI"
    },
    "pkcs1": "09c7e7bd4c6d7c6f0eb8c5aa24e97e2bef31cb687397677bba21a630985451cec6df1571a619372335b9693633d83466e142e96b73985d1314e6a57dcb88952fd55fc22a976be0019a8048e58528eb353516c6df5a55c601b41ab44084756ac474e4033adc29caf2221c39b475ec4409ba58b84d24140259c147315a498e8363082f022ea5b88de27fcc11b0b762217d8897ab51d1b46d6f79f7c3a18226bb60d90c9006a0f9500f635500b056da731b845eb8b9b262d3b29fab02d3b227027f10e1cd7c93724af302e6559f3b2a327e6c4101e8211812e52a57508364b7e76b8610d719dc40134cac232c73273d58cbb2cf0aa767d2ffcd5772bc7874ca20d9",
    "pss": "7f35421e1beda664dd4d654c120dfa394f0b76879e7720ea5a5f280ef63db80cffb7adf92ae18bb6a982b2c4f76449c826c3967769a67dd85e53fdb44a9d89577285ae96b33c3628b9b13ad96395fdbc1d4ae4ba76c97997ef4c6ef917a609d2518315f49e50e9527850217be7706f36de8a5d849d1b0a171e4ac1a2c1f84804751c9eb6beaa6c1f3498136d4a3f3421a8de73fad4c08c2a6d77a4a221a08c2de4e6118bc3e40f01bb213f69251cff42721113556817b5aa91c029f1d18cc3d02d150fbd25c63784fd24a6437a36ffeed4af9453646715e88fb314be406fa38603e79fb898443277a987e466f7db6807d944bc85353c01c5940201b812d04c86"
  },
  "curves": [
    {
      "name": "P-256",
      "size": 32,
      "privateJwk": {
        "kty": "EC",
        "crv": "P-256",
        "x": "axfR8uEsQkf4vOblY6RA8ncDfYEt6zOg9KE5RdiYwpY",
        "y": "T-NC4v4af5uO5-tKfA-eFivOM1drMV7Oy7ZAaDe_UfU",
        "d": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE"
      },
      "peer": "047cf27b188d034f7e8a52380304b51ac3c08969e277f21b35a60b48fc4766997807775510db8ed040293d9ac69f7430dbba7dade63ce982299e04b79d227873d1",
      "shared": "7cf27b188d034f7e8a52380304b51ac3c08969e277f21b35a60b48fc47669978",
      "signature": "877d24fa04ce95f501648dba6cd258c7fe60c1c5ca8e6909b222ae0d17745fc3240a121988e9682684ccce956059aca90f0e6f72b400582e124259ad48014410"
    },
    {
      "name": "P-384",
      "size": 48,
      "privateJwk": {
        "kty": "EC",
        "crv": "P-384",
        "x": "qofKIr6LBTeOscce8yCtdG4dO2KLp5uYWfdB4IJUKjhVAvJdv1UpbDpUXjhydgq3",
        "y": "NhfeSpYmLG9dnpi_kpLcKfj0Hb0omhR86doxE7XwuMAKYLHOHX6BnXpDHXyQ6g5f",
        "d": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB"
      },
      "peer": "0408d999057ba3d2d969260045c55b97f089025959a6f434d651d207d19fb96e9e4fe0e86ebe0e64f85b96a9c75295df618e80f1fa5b1b3cedb7bfe8dffd6dba74b275d875bc6cc43e904e505f256ab4255ffd43e94d39e22d61501e700a940e80",
      "shared": "08d999057ba3d2d969260045c55b97f089025959a6f434d651d207d19fb96e9e4fe0e86ebe0e64f85b96a9c75295df61",
      "signature": "f2f1f2b1fd810e3e72aa1e604995479991afaa91d16e7164ac1d5a14f181fdb06a074e3a6f0f8cc0778b370741057d9f179b8416fd69b1d4da8c8932c939026d6eb3b227af1c93676eb3f17a01e4c1b90192a4f4b726c2658bbeb5633551db8e"
    },
    {
      "name": "P-521",
      "size": 66,
      "privateJwk": {
        "kty": "EC",
        "crv": "P-521",
        "x": "AMaFjga3BATpzZ4-y2YjlbRCnGSBOQU_tSH4KK9ga009uqFLXnfv51ko_h3BJ6L_qN4zSLPBhWpCm_l-fjHC5b1m",
        "y": "ARg5KWp4mjvABFyKX7QsfRvZmPVESVebRGgXr70XJz5mLJfucple9CZAxVC5AT-tB2E1PHCGonLCQIi-lHaf0WZQ",
        "d": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB"
      },
      "peer": "0400433c219024277e7e682fcb288148c282747403279b1ccc06352c6e5505d769be97b3b204da6ef55507aa104a3a35c5af41cf2fa364d60fd967f43e3933ba6d783d00f4bb8cc7f86db26700a7f3eceeeed3f0b5c6b5107c4da97740ab21a29906c42dbbb3e377de9f251f6b93937fa99a3248f4eafcbe95edc0f4f71be356d661f41b02",
      "shared": "00433c219024277e7e682fcb288148c282747403279b1ccc06352c6e5505d769be97b3b204da6ef55507aa104a3a35c5af41cf2fa364d60fd967f43e3933ba6d783d",
      "signature": "00e05c1789cd3e694cdeb287457083ca367e5158dc6b644afcdd984d9d1e01b55d90e068f4c72145a8ae3856e7ce91dcd7a0e400d000cff7bba82d31320d21f442510181ecc990835d6e0abbf26525c38da0caaa4e1650d38a62ccdf6d1a1f7cace4ca9710e805e78a00a023bba0bc89edb83bb6f5a70aeb974b72788d67d3264d128ca6"
    }
  ]
}"#;
