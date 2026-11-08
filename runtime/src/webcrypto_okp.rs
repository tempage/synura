//! Ed25519 and X25519 Web Crypto key formats and Ed25519 signatures.
use super::*;
use boring2::pkey::{HasPublic, PKeyRef};

fn id(name: &str) -> Id {
    if name == "Ed25519" {
        Id::ED25519
    } else {
        Id::X25519
    }
}

pub(super) fn public_bytes<T: HasPublic>(key: &PKeyRef<T>) -> Result<[u8; 32]> {
    let mut output = [0; 32];
    let count = key
        .raw_public_key(&mut output)
        .map_err(|_| CryptoError::operation())?
        .len();
    if count != output.len() {
        return Err(CryptoError::operation());
    }
    Ok(output)
}

pub(super) fn generate(
    state: &mut CryptoState,
    name: &str,
    extractable: bool,
    usages: Vec<String>,
) -> Result<Value> {
    let signing = name == "Ed25519";
    validate_usages(
        &usages,
        if signing {
            &SIGN_USAGES
        } else {
            &DERIVE_USAGES
        },
        true,
    )?;
    let private_usages = subset(&usages, if signing { &["sign"] } else { &DERIVE_USAGES });
    if private_usages.is_empty() {
        return Err(CryptoError::syntax());
    }
    let mut seed = Zeroizing::new([0u8; 32]);
    rand_bytes(&mut *seed).map_err(|_| CryptoError::operation())?;
    let private =
        backend::raw_private_key(id(name), &*seed).map_err(|_| CryptoError::operation())?;
    let public = backend::raw_public_key(id(name), &public_bytes(&private)?)
        .map_err(|_| CryptoError::operation())?;
    let algorithm = json!({"name":name});
    state.add_pair(
        Key {
            material: Material::Public(public),
            name: name.into(),
            hash: None,
            algorithm: algorithm.clone(),
            extractable: true,
            usages: subset(&usages, if signing { &["verify"] } else { &[] }),
        },
        Key {
            material: Material::Private(private),
            name: name.into(),
            hash: None,
            algorithm,
            extractable,
            usages: private_usages,
        },
    )
}

pub(super) fn import(
    name: &str,
    format: &str,
    data: &KeyData<'_>,
    extractable: bool,
    usages: Vec<String>,
) -> Result<Key> {
    let signing = name == "Ed25519";
    let private = match format {
        "raw" | "spki" => false,
        "pkcs8" => true,
        "jwk" => data.jwk()?.get("d").is_some(),
        _ => return Err(CryptoError::unsupported()),
    };
    validate_usages(
        &usages,
        match (signing, private) {
            (true, true) => &["sign"],
            (true, false) => &["verify"],
            (false, true) => &DERIVE_USAGES,
            (false, false) => &[],
        },
        true,
    )?;
    let material = match format {
        "raw" => {
            let bytes = data.bytes()?;
            if bytes.len() != 32 {
                return Err(CryptoError::data());
            }
            Material::Public(
                backend::raw_public_key(id(name), bytes).map_err(|_| CryptoError::data())?,
            )
        }
        "spki" => {
            let bytes = data.bytes()?;
            validate_der_envelope(bytes)?;
            let key = PKey::public_key_from_der(bytes).map_err(|_| CryptoError::data())?;
            // BoringSSL's RFC 8410 parsers reject present AlgorithmIdentifier
            // parameters, and enforce the nested key's exact length.
            if key.id() != id(name) {
                return Err(CryptoError::data());
            }
            Material::Public(key)
        }
        "pkcs8" => {
            let bytes = data.bytes()?;
            validate_der_envelope(bytes)?;
            let key = PKey::private_key_from_pkcs8(bytes).map_err(|_| CryptoError::data())?;
            if key.id() != id(name) {
                return Err(CryptoError::data());
            }
            Material::Private(key)
        }
        "jwk" => {
            let jwk = data.jwk()?;
            if string(jwk, "kty").map_err(|_| CryptoError::data())? != "OKP"
                || string(jwk, "crv").map_err(|_| CryptoError::data())? != name
            {
                return Err(CryptoError::data());
            }
            let x = Zeroizing::new(jwk_bytes(jwk, "x")?);
            if x.len() != 32 {
                return Err(CryptoError::data());
            }
            if private {
                let d = Zeroizing::new(jwk_bytes(jwk, "d")?);
                if d.len() != 32 {
                    return Err(CryptoError::data());
                }
                let key =
                    backend::raw_private_key(id(name), &d).map_err(|_| CryptoError::data())?;
                if !memcmp::eq(&public_bytes(&key)?, &x) {
                    return Err(CryptoError::data());
                }
                Material::Private(key)
            } else {
                Material::Public(
                    backend::raw_public_key(id(name), &x).map_err(|_| CryptoError::data())?,
                )
            }
        }
        _ => return Err(CryptoError::unsupported()),
    };
    Ok(Key {
        material,
        name: name.into(),
        hash: None,
        algorithm: json!({"name":name}),
        extractable,
        usages,
    })
}

pub(super) fn export(key: &Key, format: &str) -> Result<CryptoOutput> {
    match (format, &key.material) {
        ("raw", Material::Public(pkey)) => Ok(CryptoOutput::bytes(public_bytes(pkey)?.to_vec())),
        ("spki", Material::Public(pkey)) => Ok(CryptoOutput::bytes(
            pkey.public_key_to_der()
                .map_err(|_| CryptoError::operation())?,
        )),
        ("pkcs8", Material::Private(pkey)) => Ok(CryptoOutput::bytes(
            pkey.private_key_to_der_pkcs8()
                .map_err(|_| CryptoError::operation())?,
        )),
        ("raw" | "spki", Material::Private(_)) | ("pkcs8", Material::Public(_)) => {
            Err(CryptoError::access())
        }
        ("jwk", material) => {
            let mut jwk = SensitiveJson(
                json!({"kty":"OKP","crv":key.name,"key_ops":key.usages,"ext":key.extractable}),
            );
            if key.name == "Ed25519" {
                jwk["alg"] = json!("Ed25519");
            }
            let public = match material {
                Material::Public(pkey) => public_bytes(pkey)?,
                Material::Private(pkey) => {
                    let mut seed = Zeroizing::new([0; 32]);
                    if pkey
                        .raw_private_key(&mut *seed)
                        .map_err(|_| CryptoError::operation())?
                        .len()
                        != 32
                    {
                        return Err(CryptoError::operation());
                    }
                    jwk["d"] = Value::String(general_purpose::URL_SAFE_NO_PAD.encode(&*seed));
                    public_bytes(pkey)?
                }
                _ => return Err(CryptoError::access()),
            };
            jwk["x"] = Value::String(general_purpose::URL_SAFE_NO_PAD.encode(public));
            Ok(CryptoOutput::json(std::mem::take(&mut jwk.0)))
        }
        _ => Err(CryptoError::unsupported()),
    }
}

pub(super) fn signature(key: &Key, data: &[u8], signature: Option<&[u8]>) -> Result<CryptoOutput> {
    match (&key.material, signature) {
        (Material::Private(pkey), None) => {
            let mut signer =
                Signer::new_without_digest(pkey).map_err(|_| CryptoError::operation())?;
            Ok(CryptoOutput::bytes(
                signer
                    .sign_oneshot_to_vec(data)
                    .map_err(|_| CryptoError::operation())?,
            ))
        }
        (Material::Public(pkey), Some(signature)) => {
            if signature.len() != 64
                || !acceptable_ed_point(&public_bytes(pkey)?)
                || !acceptable_ed_point(&signature[..32])
            {
                return Ok(CryptoOutput::json(json!(false)));
            }
            let mut verifier =
                Verifier::new_without_digest(pkey).map_err(|_| CryptoError::operation())?;
            Ok(CryptoOutput::json(json!(verifier
                .verify_oneshot(signature, data)
                .unwrap_or(false))))
        }
        _ => Err(CryptoError::access()),
    }
}

fn acceptable_ed_point(encoded: &[u8]) -> bool {
    // RFC 8032 encodes y in little endian with the sign of x in the top bit.
    // Reject noncanonical y and the five y coordinates of the eight torsion
    // points (both signs). BoringSSL validates the curve equation and signature.
    let mut y: [u8; 32] = encoded.try_into().unwrap();
    y[31] &= 0x7f;
    let mut p = [0xff; 32];
    p[0] = 0xed;
    p[31] = 0x7f;
    if y.iter().rev().cmp(p.iter().rev()) != std::cmp::Ordering::Less {
        return false;
    }
    let zero = [0; 32];
    let mut one = zero;
    one[0] = 1;
    let mut minus_one = p;
    minus_one[0] -= 1;
    // The order-eight y coordinates are roots of the Edwards doubling formula;
    // these public constants also appear in libsodium's ref10 torsion checks:
    // https://github.com/jedisct1/libsodium/blob/1.0.20-RELEASE/src/libsodium/crypto_core/ed25519/ref10/ed25519_ref10.c#L998
    let order_eight_a = [
        0x26, 0xe8, 0x95, 0x8f, 0xc2, 0xb2, 0x27, 0xb0, 0x45, 0xc3, 0xf4, 0x89, 0xf2, 0xef, 0x98,
        0xf0, 0xd5, 0xdf, 0xac, 0x05, 0xd3, 0xc6, 0x33, 0x39, 0xb1, 0x38, 0x02, 0x88, 0x6d, 0x53,
        0xfc, 0x05,
    ];
    let order_eight_b = [
        0xc7, 0x17, 0x6a, 0x70, 0x3d, 0x4d, 0xd8, 0x4f, 0xba, 0x3c, 0x0b, 0x76, 0x0d, 0x10, 0x67,
        0x0f, 0x2a, 0x20, 0x53, 0xfa, 0x2c, 0x39, 0xcc, 0xc6, 0x4e, 0xc7, 0xfd, 0x77, 0x92, 0xac,
        0x03, 0x7a,
    ];
    ![zero, one, minus_one, order_eight_a, order_eight_b].contains(&y)
}
