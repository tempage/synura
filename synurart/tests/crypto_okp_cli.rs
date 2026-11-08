//! Public RFC8032/RFC7748 vectors and synthetic Web Crypto conformance cases.
//! These fixtures contain no application keys, user data, or service responses.
use serde_json::{json, Value};
use std::sync::atomic::{AtomicU64, Ordering};

static NEXT_RUNTIME: AtomicU64 = AtomicU64::new(0);
const HELPERS: &str = r#"
const hex = data => Array.from(new Uint8Array(data), n => n.toString(16).padStart(2,'0')).join('');
const unhex = value => new Uint8Array(value.match(/../g)?.map(n => parseInt(n,16)) || []);
const text = value => new TextEncoder().encode(value);
const reject = async promise => { try {await promise; return 'resolved';} catch(error) {return error.name;} };
const pkcs8 = (name,seed) => unhex('302e020100300506032b65'+(name==='Ed25519'?'70':'6e')+'04220420'+seed);
const spki = (name,key) => unhex('302a300506032b65'+(name==='Ed25519'?'70':'6e')+'032100'+key);
const publicJwk = source => {const out={...source};delete out.d;return out;};
"#;
fn evaluate(body: &str) -> Value {
    let path = std::env::temp_dir().join(format!(
        "synurart-okp-{}-{}",
        std::process::id(),
        NEXT_RUNTIME.fetch_add(1, Ordering::Relaxed)
    ));
    let runtime =
        synurart::SynurartRuntime::new(true, path.join("storage.json"), path.join("extension.js"))
            .unwrap();
    runtime
        .eval_js(&format!(
            "(async()=>{{const vectors={VECTORS};{HELPERS}{body}}})()"
        ))
        .unwrap()["result"]
        .clone()
}

#[test]
fn ed25519_signatures_match_rfc8032_and_reject_corruption() {
    // RFC 8032 section 7.1, first three Ed25519 test vectors.
    let actual = evaluate(
        r#"
        const out=[];
        for(const vector of vectors.ed) {
            const privateKey=await crypto.subtle.importKey('pkcs8',pkcs8('Ed25519',vector.seed),'ed25519',false,['sign']);
            const publicKey=await crypto.subtle.importKey('raw',unhex(vector.public),'Ed25519',true,['verify']);
            const message=unhex(vector.message);
            const signature=await crypto.subtle.sign('Ed25519',privateKey,message);
            const changed=new Uint8Array(signature.slice(0));changed[0]^=1;
            out.push({signature:hex(signature),valid:await crypto.subtle.verify('Ed25519',publicKey,unhex(vector.signature),message),
                changed:await crypto.subtle.verify('Ed25519',publicKey,changed,message),
                changedMessage:await crypto.subtle.verify('Ed25519',publicKey,signature,new Uint8Array(message.length+1)),
                short:await crypto.subtle.verify('Ed25519',publicKey,new Uint8Array(63),message),
                long:await crypto.subtle.verify('Ed25519',publicKey,new Uint8Array(65),message),
                // Ed25519 is pure EdDSA; an unrelated hash dictionary member is ignored.
                extraHash:hex(await crypto.subtle.sign({name:'Ed25519',hash:'SHA-256'},privateKey,message))===vector.signature});
        }
        return out;
    "#,
    );
    let vectors: Value = serde_json::from_str(VECTORS).unwrap();
    for (actual, expected) in actual
        .as_array()
        .unwrap()
        .iter()
        .zip(vectors["ed"].as_array().unwrap())
    {
        assert_eq!(
            actual,
            &json!({"signature":expected["signature"],"valid":true,"changed":false,
            "changedMessage":false,"short":false,"long":false,"extraHash":true})
        );
    }
}

#[test]
fn okp_keys_use_standard_rfc8410_and_jwk_encodings() {
    let actual = evaluate(
        r#"
        const out=[];
        for(const [name,vector,usage] of [['Ed25519',vectors.ed[0],'sign'],['X25519',vectors.x[0],'deriveBits']]) {
            const privateKey=await crypto.subtle.importKey('jwk',vector.jwk,name,true,[usage]);
            const publicKey=await crypto.subtle.importKey('spki',spki(name,vector.public),name,true,name==='Ed25519'?['verify']:[]);
            const jwk=await crypto.subtle.exportKey('jwk',privateKey);
            const publicJson=await crypto.subtle.exportKey('jwk',publicKey);
            const fromPrivate=await crypto.subtle.importKey('pkcs8',await crypto.subtle.exportKey('pkcs8',privateKey),name,true,[usage]);
            const fromPublic=await crypto.subtle.importKey('jwk',publicJson,name,true,publicKey.usages);
            out.push({name,algorithm:privateKey.algorithm,privateDer:hex(await crypto.subtle.exportKey('pkcs8',privateKey))===hex(pkcs8(name,vector.seed)),
                publicDer:hex(await crypto.subtle.exportKey('spki',publicKey))===hex(spki(name,vector.public)),
                raw:hex(await crypto.subtle.exportKey('raw',publicKey))===vector.public,
                jwk:{kty:jwk.kty,crv:jwk.crv,x:jwk.x===vector.jwk.x,d:jwk.d===vector.jwk.d,alg:jwk.alg??null},
                publicHasPrivate:Object.hasOwn(publicJson,'d'),
                roundtripPrivate:(await crypto.subtle.exportKey('jwk',fromPrivate)).d===vector.jwk.d,
                roundtripPublic:hex(await crypto.subtle.exportKey('raw',fromPublic))===vector.public,
                rawPrivate:await reject(crypto.subtle.exportKey('raw',privateKey))});
        }
        return out;
    "#,
    );
    for (actual, name) in actual.as_array().unwrap().iter().zip(["Ed25519", "X25519"]) {
        assert_eq!(
            actual,
            &json!({"name":name,"algorithm":{"name":name},"privateDer":true,"publicDer":true,
            "raw":true,"jwk":{"kty":"OKP","crv":name,"x":true,"d":true,"alg":if name=="Ed25519" {json!("Ed25519")} else {Value::Null}},
            "publicHasPrivate":false,"roundtripPrivate":true,"roundtripPublic":true,"rawPrivate":"InvalidAccessError"})
        );
    }
}

#[test]
fn okp_generated_keys_partition_usages_and_enforce_extractability() {
    let actual = evaluate(
        r#"
        const out=[];
        for(const [name,usages] of [['Ed25519',['sign','verify']],['X25519',['deriveBits','deriveKey']]]) {
            const pair=await crypto.subtle.generateKey(name.toLowerCase(),false,usages);
            let valid;
            if(name==='Ed25519') {
                const signature=await crypto.subtle.sign(name,pair.privateKey,text('synthetic'));
                valid=await crypto.subtle.verify(name,pair.publicKey,signature,text('synthetic'));
            } else {
                const other=await crypto.subtle.generateKey(name,false,['deriveBits']);
                const first=await crypto.subtle.deriveBits({name,public:other.publicKey},pair.privateKey);
                const second=await crypto.subtle.deriveBits({name,public:pair.publicKey},other.privateKey,null);
                valid=hex(first)===hex(second)&&first.byteLength===32;
            }
            out.push({name,valid,public:{type:pair.publicKey.type,extractable:pair.publicKey.extractable,usages:pair.publicKey.usages},
                private:{type:pair.privateKey.type,extractable:pair.privateKey.extractable,usages:pair.privateKey.usages},
                size:(await crypto.subtle.exportKey('raw',pair.publicKey)).byteLength,
                hidden:await reject(crypto.subtle.exportKey('pkcs8',pair.privateKey)),
                noUsages:await reject(crypto.subtle.generateKey(name,true,[])),
                badUsages:await reject(crypto.subtle.generateKey(name,true,['encrypt']))});
        }
        return out;
    "#,
    );
    assert_eq!(
        actual,
        json!([
            {"name":"Ed25519","valid":true,"public":{"type":"public","extractable":true,"usages":["verify"]},
                "private":{"type":"private","extractable":false,"usages":["sign"]},"size":32,"hidden":"InvalidAccessError","noUsages":"SyntaxError","badUsages":"SyntaxError"},
            {"name":"X25519","valid":true,"public":{"type":"public","extractable":true,"usages":[]},
                "private":{"type":"private","extractable":false,"usages":["deriveKey","deriveBits"]},"size":32,"hidden":"InvalidAccessError","noUsages":"SyntaxError","badUsages":"SyntaxError"}
        ])
    );
}

#[test]
fn x25519_matches_rfc7748_and_supports_bit_truncation() {
    let actual = evaluate(
        r#"
        const keys=[];
        for(const vector of vectors.x) keys.push({
            privateKey:await crypto.subtle.importKey('pkcs8',pkcs8('X25519',vector.seed),'X25519',false,['deriveBits','deriveKey']),
            publicKey:await crypto.subtle.importKey('raw',unhex(vector.public),'X25519',true,[])});
        const op={name:'X25519',public:keys[1].publicKey};
        const masked=unhex(vectors.shared).slice(0,2);masked[1]&=0xf8;
        return {alice:hex(await crypto.subtle.deriveBits(op,keys[0].privateKey,null)),
            bob:hex(await crypto.subtle.deriveBits({name:'X25519',public:keys[0].publicKey},keys[1].privateKey)),
            prefix:hex(await crypto.subtle.deriveBits(op,keys[0].privateKey,13))===hex(masked),
            zero:(await crypto.subtle.deriveBits(op,keys[0].privateKey,0)).byteLength,
            tooLong:await reject(crypto.subtle.deriveBits(op,keys[0].privateKey,257)),
            basePublic:await reject(crypto.subtle.deriveBits(op,keys[0].publicKey,128)),
            peerPrivate:await reject(crypto.subtle.deriveBits({name:'X25519',public:keys[1].privateKey},keys[0].privateKey,128))};
    "#,
    );
    let vectors: Value = serde_json::from_str(VECTORS).unwrap();
    assert_eq!(
        actual,
        json!({"alice":vectors["shared"],"bob":vectors["shared"],"prefix":true,"zero":0,
        "tooLong":"OperationError","basePublic":"InvalidAccessError","peerPrivate":"InvalidAccessError"})
    );
}

#[test]
fn x25519_derives_symmetric_and_kdf_keys_from_the_shared_secret() {
    let actual = evaluate(
        r#"
        const privateKey=await crypto.subtle.importKey('jwk',vectors.x[0].jwk,'X25519',false,['deriveKey']);
        const publicKey=await crypto.subtle.importKey('raw',unhex(vectors.x[1].public),'X25519',true,[]);
        const op={name:'X25519',public:publicKey};
        const aes=await crypto.subtle.deriveKey(op,privateKey,{name:'AES-GCM',length:128},true,['encrypt']);
        const hmac=await crypto.subtle.deriveKey(op,privateKey,{name:'HMAC',hash:'SHA-256',length:256},true,['sign']);
        const kd=[];
        for(const name of ['HKDF','PBKDF2']) {
            const derived=await crypto.subtle.deriveKey(op,privateKey,name,false,['deriveBits']);
            const expected=await crypto.subtle.importKey('raw',unhex(vectors.shared),name,false,['deriveBits']);
            const params={name,hash:'SHA-256',salt:text('salt'),info:text('info'),iterations:2};
            kd.push(hex(await crypto.subtle.deriveBits(params,derived,256))===hex(await crypto.subtle.deriveBits(params,expected,256)));
        }
        return {aes:hex(await crypto.subtle.exportKey('raw',aes))===vectors.shared.slice(0,32),
            hmac:hex(await crypto.subtle.exportKey('raw',hmac))===vectors.shared,kd,
            wrongUsage:await reject(crypto.subtle.deriveBits(op,privateKey,256))};
    "#,
    );
    assert_eq!(
        actual,
        json!({"aes":true,"hmac":true,"kd":[true,true],"wrongUsage":"InvalidAccessError"})
    );
}

#[test]
fn x25519_rejects_zero_secrets_before_truncation_and_masks_public_high_bit() {
    let actual = evaluate(
        r#"
        const base=await crypto.subtle.importKey('jwk',vectors.x[0].jwk,'X25519',false,['deriveBits']);
        const failures=[];
        for(const first of [0,1]) {
            const raw=new Uint8Array(32);raw[0]=first;
            const peer=await crypto.subtle.importKey('raw',raw,'X25519',true,[]);
            for(const length of [null,0,1]) failures.push(await reject(crypto.subtle.deriveBits({name:'X25519',public:peer},base,length)));
        }
        const high=unhex(vectors.x[1].public);high[31]|=128;
        const peer=await crypto.subtle.importKey('raw',high,'X25519',true,[]);
        const noncanonical=await crypto.subtle.importKey('raw',unhex('f6'+'ff'.repeat(30)+'7f'),'X25519',true,[]);
        return {failures,high:hex(await crypto.subtle.deriveBits({name:'X25519',public:peer},base))===vectors.shared,
            noncanonical:hex(await crypto.subtle.deriveBits({name:'X25519',public:noncanonical},base))===vectors.x[0].public};
    "#,
    );
    assert_eq!(
        actual,
        json!({"failures":vec!["OperationError";6],"high":true,"noncanonical":true})
    );
}

#[test]
fn ed25519_rejects_small_order_forgery_and_noncanonical_signature_scalar() {
    let actual = evaluate(
        r#"
        const out=[];
        // All eight points in the small torsion subgroup. Negating x changes
        // the sign bit except for the two points with x=0 (y=1 and y=-1).
        const small=[unhex('01'+'00'.repeat(31)),unhex('ec'+'ff'.repeat(30)+'7f')];
        for(const encoded of ['00'.repeat(32),
            '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05',
            'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a']) {
            const point=unhex(encoded);small.push(point);const negated=point.slice();negated[31]^=128;small.push(negated);
        }
        for(const raw of small) {
            const key=await crypto.subtle.importKey('raw',raw,'Ed25519',true,['verify']);
            const forged=new Uint8Array(64);forged[0]=1;
            out.push(await crypto.subtle.verify('Ed25519',key,forged,new Uint8Array()));
        }
        const key=await crypto.subtle.importKey('raw',unhex(vectors.ed[0].public),'Ed25519',true,['verify']);
        for(const point of small) {
            const forged=unhex(vectors.ed[0].signature);forged.set(point);
            out.push(await crypto.subtle.verify('Ed25519',key,forged,new Uint8Array()));
        }
        const signature=unhex(vectors.ed[0].signature);
        signature.set(unhex('edd3f55c1a631258d69cf7a2def9de1400000000000000000000000000000010'),32);
        out.push(await crypto.subtle.verify('Ed25519',key,signature,new Uint8Array()));
        return out;
    "#,
    );
    assert_eq!(actual, json!(vec![false; 17]));
}

#[test]
fn okp_import_validates_jwk_private_consistency_and_permissions() {
    let actual = evaluate(
        r#"
        const output=[];
        for(const [name,vector,privateUsage,publicUsage] of [['Ed25519',vectors.ed[0],'sign','verify'],['X25519',vectors.x[0],'deriveBits',null]]) {
            const jwk=vector.jwk;
            const cases=[{...jwk,kty:'EC'},{...jwk,crv:name==='Ed25519'?'X25519':'Ed25519'},
                {...jwk,x:'A'.repeat(43)},{...jwk,d:'A'.repeat(43)},{...jwk,x:undefined},
                {...jwk,d:'AA'},{...jwk,ext:false},{...jwk,key_ops:[]},
                {...jwk,use:name==='Ed25519'?'enc':'sig'}];
            const errors=[];
            for(const data of cases) errors.push(await reject(crypto.subtle.importKey('jwk',data,name,true,[privateUsage])));
            const aliases=[];
            for(const alg of ['Ed25519','EdDSA','ECDH-ES']) aliases.push(await reject(crypto.subtle.importKey('jwk',{...jwk,alg},name,true,[privateUsage])));
            output.push({name,errors,aliases,
                badPublicUsage:await reject(crypto.subtle.importKey('raw',unhex(vector.public),name,true,[privateUsage])),
                badPrivateUsage:await reject(crypto.subtle.importKey('pkcs8',pkcs8(name,vector.seed),name,true,[publicUsage??'verify']))});
        }
        return output;
    "#,
    );
    assert_eq!(
        actual,
        json!([
            {"name":"Ed25519","errors":vec!["DataError";9],"aliases":["resolved","resolved","DataError"],"badPublicUsage":"SyntaxError","badPrivateUsage":"SyntaxError"},
            {"name":"X25519","errors":vec!["DataError";9],"aliases":["resolved","resolved","resolved"],"badPublicUsage":"SyntaxError","badPrivateUsage":"SyntaxError"}
        ])
    );
}

#[test]
fn okp_import_rejects_malformed_der_parameters_oids_and_lengths() {
    let actual = evaluate(
        r#"
        const results=[];
        for(const [name,vector,usage] of [['Ed25519',vectors.ed[0],'sign'],['X25519',vectors.x[0],'deriveBits']]) {
            const oid=name==='Ed25519'?'70':'6e';const other=name==='Ed25519'?'X25519':'Ed25519';
            const publicUsages=name==='Ed25519'?['verify']:[];
            const errors=[];
            for(const size of [0,31,33]) errors.push(await reject(crypto.subtle.importKey('raw',new Uint8Array(size),name,true,publicUsages)));
            errors.push(await reject(crypto.subtle.importKey('spki',spki(other,vector.public),name,true,publicUsages)));
            errors.push(await reject(crypto.subtle.importKey('pkcs8',pkcs8(other,vector.seed),name,true,[usage])));
            errors.push(await reject(crypto.subtle.importKey('spki',unhex('302c300706032b65'+oid+'0500032100'+vector.public),name,true,publicUsages)));
            errors.push(await reject(crypto.subtle.importKey('pkcs8',unhex('3030020100300706032b65'+oid+'050004220420'+vector.seed),name,true,[usage])));
            errors.push(await reject(crypto.subtle.importKey('spki',unhex(hex(spki(name,vector.public))+'00'),name,true,publicUsages)));
            errors.push(await reject(crypto.subtle.importKey('pkcs8',unhex(hex(pkcs8(name,vector.seed))+'00'),name,true,[usage])));
            results.push(errors);
        }
        return results;
    "#,
    );
    assert_eq!(actual, json!([vec!["DataError"; 9], vec!["DataError"; 9]]));
}

#[test]
fn okp_keys_wrap_and_unwrap_using_standard_aes_gcm() {
    let actual = evaluate(
        r#"
        const wrapping=await crypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['wrapKey','unwrapKey']);
        const out=[];
        for(const [name,vector,usage] of [['Ed25519',vectors.ed[0],'sign'],['X25519',vectors.x[0],'deriveBits']]) {
            const key=await crypto.subtle.importKey('jwk',vector.jwk,name,true,[usage]);
            for(const format of ['jwk','pkcs8']) {
                const algorithm={name:'AES-GCM',iv:new Uint8Array(12).fill(out.length)};
                const wrapped=await crypto.subtle.wrapKey(format,key,wrapping,algorithm);
                const imported=await crypto.subtle.unwrapKey(format,wrapped,wrapping,algorithm,name,true,[usage]);
                out.push((await crypto.subtle.exportKey('jwk',imported)).d===vector.jwk.d);
            }
        }
        return out;
    "#,
    );
    assert_eq!(actual, json!([true, true, true, true]));
}

// https://www.rfc-editor.org/rfc/rfc8032#section-7.1
// https://www.rfc-editor.org/rfc/rfc7748#section-6.1
const VECTORS: &str = r#"{
  "ed": [
    {
      "seed": "9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60",
      "public": "d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a",
      "message": "",
      "signature": "e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b",
      "jwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
        "d": "nWGxne_9WmC6hEr0kuwsxERJxWl7MmkZcDusAxyuf2A"
      }
    },
    {
      "seed": "4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb",
      "public": "3d4017c3e843895a92b70aa74d1b7ebc9c982ccf2ec4968cc0cd55f12af4660c",
      "message": "72",
      "signature": "92a009a9f0d4cab8720e820b5f642540a2b27b5416503f8fb3762223ebdb69da085ac1e43e15996e458f3613d0f11d8c387b2eaeb4302aeeb00d291612bb0c00",
      "jwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "PUAXw-hDiVqStwqnTRt-vJyYLM8uxJaMwM1V8Sr0Zgw",
        "d": "TM0Imyj_ltqdtsNG7BFOD1uKMZ81q6Yk2oz27U-4pvs"
      }
    },
    {
      "seed": "c5aa8df43f9f837bedb7442f31dcb7b166d38535076f094b85ce3a2e0b4458f7",
      "public": "fc51cd8e6218a1a38da47ed00230f0580816ed13ba3303ac5deb911548908025",
      "message": "af82",
      "signature": "6291d657deec24024827e69c3abe01a30ce548a284743a445e3680d7db5ac3ac18ff9b538d16f290ae67f760984dc6594a7c15e9716ed28dc027beceea1ec40a",
      "jwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "_FHNjmIYoaONpH7QAjDwWAgW7RO6MwOsXeuRFUiQgCU",
        "d": "xaqN9D-fg3vtt0QvMdy3sWbThTUHbwlLhc46LgtEWPc"
      }
    }
  ],
  "x": [
    {
      "seed": "77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a",
      "public": "8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a",
      "jwk": {
        "kty": "OKP",
        "crv": "X25519",
        "x": "hSDwCYkwp1R0i33ctD73Wg2_Og0mOBr066SpjqqbTmo",
        "d": "dwdtCnMYpX08FsFyUbJmRd9ML4frwJkqsXf7pR25LCo"
      }
    },
    {
      "seed": "5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb",
      "public": "de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f",
      "jwk": {
        "kty": "OKP",
        "crv": "X25519",
        "x": "3p7bfXt9wbTTW2HC7OQ1Nz-DQ8hbeGdNrfx-FG-IK08",
        "d": "XasIfmJKikt54X-Lg4AO5m87sSkmGLb9HC-LJ_-I4Os"
      }
    }
  ],
  "shared": "4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742"
}"#;
