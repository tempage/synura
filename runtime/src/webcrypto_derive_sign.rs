//! Standards-based signature formats and key derivation.
use super::*;

impl CryptoState {
    pub(super) fn signature(&self, input: &CryptoRequest) -> Result<CryptoOutput> {
        let request = &input.params;
        let verify = string(request, "op")? == "verify";
        let key = self.key(request, "key")?;
        let algorithm = required(request, "algorithm")?;
        key.permits(if verify { "verify" } else { "sign" }, algorithm)?;
        let data = input.binary(request, "data")?;
        let signature = if verify {
            Some(input.binary(request, "signature")?)
        } else {
            None
        };
        match key.name.as_str() {
            "Ed25519" => okp::signature(key, data, signature),
            "HMAC" => {
                let actual = Zeroizing::new(
                    backend::hmac(
                        key.hash.ok_or_else(CryptoError::data)?.md(),
                        key.secret()?,
                        data,
                    )
                    .map_err(|_| CryptoError::operation())?,
                );
                if let Some(expected) = signature {
                    Ok(CryptoOutput::json(json!(
                        expected.len() == actual.len() && memcmp::eq(expected, &actual)
                    )))
                } else {
                    Ok(CryptoOutput::secret(actual))
                }
            }
            "RSASSA-PKCS1-v1_5" | "RSA-PSS" => {
                let md = key.hash.ok_or_else(CryptoError::access)?.md();
                let salt = if key.name == "RSA-PSS" {
                    let length = integer(algorithm, "saltLength")?;
                    Some(i32::try_from(length).map_err(|_| CryptoError::operation())?)
                } else {
                    None
                };
                let padding = if salt.is_some() {
                    Padding::PKCS1_PSS
                } else {
                    Padding::PKCS1
                };
                match (&key.material, signature) {
                    (Material::Private(pkey), None) => {
                        let mut signer =
                            Signer::new(md, pkey).map_err(|_| CryptoError::operation())?;
                        signer
                            .set_rsa_padding(padding)
                            .map_err(|_| CryptoError::operation())?;
                        if let Some(salt) = salt {
                            signer
                                .set_rsa_mgf1_md(md)
                                .map_err(|_| CryptoError::operation())?;
                            signer
                                .set_rsa_pss_saltlen(RsaPssSaltlen::custom(salt))
                                .map_err(|_| CryptoError::operation())?;
                        }
                        signer.update(data).map_err(|_| CryptoError::operation())?;
                        Ok(CryptoOutput::bytes(
                            signer.sign_to_vec().map_err(|_| CryptoError::operation())?,
                        ))
                    }
                    (Material::Public(pkey), Some(signature)) => {
                        let mut verifier =
                            Verifier::new(md, pkey).map_err(|_| CryptoError::operation())?;
                        verifier
                            .set_rsa_padding(padding)
                            .map_err(|_| CryptoError::operation())?;
                        if let Some(salt) = salt {
                            verifier
                                .set_rsa_mgf1_md(md)
                                .map_err(|_| CryptoError::operation())?;
                            verifier
                                .set_rsa_pss_saltlen(RsaPssSaltlen::custom(salt))
                                .map_err(|_| CryptoError::operation())?;
                        }
                        verifier
                            .update(data)
                            .map_err(|_| CryptoError::operation())?;
                        Ok(CryptoOutput::json(json!(verifier
                            .verify(signature)
                            .unwrap_or(false))))
                    }
                    _ => Err(CryptoError::access()),
                }
            }
            "ECDSA" => {
                let curve = Curve::parse(string(&key.algorithm, "namedCurve")?)?;
                let md = Hash::parse(required(algorithm, "hash")?)?.md();
                let digest = hash(md, data).map_err(|_| CryptoError::operation())?;
                match (&key.material, signature) {
                    (Material::Private(pkey), None) => {
                        let ec = pkey.ec_key().map_err(|_| CryptoError::operation())?;
                        let sig =
                            EcdsaSig::sign(&digest, &ec).map_err(|_| CryptoError::operation())?;
                        let mut bytes = bn_fixed(sig.r(), curve.bytes())?;
                        bytes.extend_from_slice(&bn_fixed(sig.s(), curve.bytes())?);
                        Ok(CryptoOutput::bytes(bytes))
                    }
                    (Material::Public(pkey), Some(bytes)) => {
                        if bytes.len() != 2 * curve.bytes() {
                            return Ok(CryptoOutput::json(json!(false)));
                        }
                        let r = BigNum::from_slice(&bytes[..curve.bytes()])
                            .map_err(|_| CryptoError::operation())?;
                        let s = BigNum::from_slice(&bytes[curve.bytes()..])
                            .map_err(|_| CryptoError::operation())?;
                        let sig = EcdsaSig::from_private_components(r, s)
                            .map_err(|_| CryptoError::operation())?;
                        let ec = pkey.ec_key().map_err(|_| CryptoError::operation())?;
                        Ok(CryptoOutput::json(json!(sig
                            .verify(&digest, &ec)
                            .unwrap_or(false))))
                    }
                    _ => Err(CryptoError::access()),
                }
            }
            _ => Err(CryptoError::unsupported()),
        }
    }

    pub(super) fn derive(&mut self, input: &CryptoRequest) -> Result<CryptoOutput> {
        let request = &input.params;
        let deriving_key = string(request, "op")? == "deriveKey";
        let base = self.key(request, "key")?;
        let algorithm = required(request, "algorithm")?;
        base.permits(
            if deriving_key {
                "deriveKey"
            } else {
                "deriveBits"
            },
            algorithm,
        )?;
        let derived_algorithm = if deriving_key {
            Some(required(request, "derivedKeyAlgorithm")?)
        } else {
            None
        };
        let length = if derived_algorithm.is_some() {
            derived_key_length(required(request, "derivedKeyLengthAlgorithm")?)?
        } else if request.get("length").map_or(true, Value::is_null) {
            None
        } else {
            Some(integer(request, "length")?)
        };
        let mut bytes = match base.name.as_str() {
            "PBKDF2" | "HKDF" => {
                let length = length.ok_or_else(CryptoError::operation)?;
                if length % 8 != 0 {
                    return Err(CryptoError::operation());
                }
                let md = Hash::parse(required(algorithm, "hash")?)?.md();
                let salt = input.binary(algorithm, "salt")?;
                let size = length / 8;
                if base.name == "PBKDF2" {
                    let iterations = integer(algorithm, "iterations")?;
                    if iterations == 0 {
                        return Err(CryptoError::operation());
                    }
                    let mut output = Zeroizing::new(allocate(size)?);
                    if size != 0 {
                        pbkdf2_hmac(base.secret()?, salt, iterations, md, &mut output)
                            .map_err(|_| CryptoError::operation())?;
                    }
                    output
                } else {
                    if size > 255 * md.size() {
                        return Err(CryptoError::operation());
                    }
                    let info = input.binary(algorithm, "info")?;
                    hkdf(md, base.secret()?, salt, info, size)?
                }
            }
            "ECDH" | "X25519" => {
                let peer = self.key(algorithm, "public")?;
                if peer.name != base.name
                    || peer.algorithm["namedCurve"] != base.algorithm["namedCurve"]
                {
                    return Err(CryptoError::access());
                }
                let (private, public) = match (&base.material, &peer.material) {
                    (Material::Private(private), Material::Public(public)) => (private, public),
                    _ => return Err(CryptoError::access()),
                };
                let secret_bytes = if base.name == "X25519" {
                    32
                } else {
                    Curve::parse(string(&base.algorithm, "namedCurve")?)?.bytes()
                };
                let length = length.unwrap_or(secret_bytes * 8);
                if length > secret_bytes * 8 {
                    return Err(CryptoError::operation());
                }
                let mut deriver = Deriver::new(private).map_err(|_| CryptoError::operation())?;
                deriver
                    .set_peer(public)
                    .map_err(|_| CryptoError::operation())?;
                let mut output = Zeroizing::new(allocate(secret_bytes)?);
                let count = deriver
                    .derive(&mut output)
                    .map_err(|_| CryptoError::operation())?;
                if count != secret_bytes {
                    return Err(CryptoError::operation());
                }
                if base.name == "X25519" && memcmp::eq(&output, &[0u8; 32]) {
                    return Err(CryptoError::operation());
                }
                // Explicitly erase discarded bytes before shortening the live
                // vector; Zeroizing only sees its current length on Drop.
                use zeroize::Zeroize;
                output[length.div_ceil(8)..].zeroize();
                output.truncate(length.div_ceil(8));
                mask_unused_key_bits(&mut output, length);
                output
            }
            _ => return Err(CryptoError::unsupported()),
        };
        if let Some(algorithm) = derived_algorithm {
            // importKey applies the standard target algorithm, usage, and
            // extractability checks to the directly derived bytes.
            let key = import_key(
                "raw",
                KeyData::Bytes(&bytes),
                algorithm,
                boolean(request, "extractable")?,
                parse_usages(required(request, "usages")?)?,
            )?;
            use zeroize::Zeroize;
            bytes.zeroize();
            Ok(CryptoOutput::json(self.add(key)?))
        } else {
            Ok(CryptoOutput::secret(bytes))
        }
    }
}

fn derived_key_length(algorithm: &Value) -> Result<Option<usize>> {
    match algorithm_name(algorithm)?.as_str() {
        "AES-CBC" | "AES-GCM" => {
            let length = integer(algorithm, "length")?;
            if ![128, 192, 256].contains(&length) {
                return Err(CryptoError::operation());
            }
            Ok(Some(length))
        }
        "HMAC" => {
            let hash = Hash::parse(required(algorithm, "hash")?)?;
            let length = optional_integer(algorithm, "length")?.unwrap_or(hash.block_bits());
            if length == 0 {
                return Err(CryptoError::operation());
            }
            Ok(Some(length))
        }
        "PBKDF2" | "HKDF" => Ok(None),
        _ => Err(CryptoError::unsupported()),
    }
}

fn hkdf(
    md: MessageDigest,
    ikm: &[u8],
    salt: &[u8],
    info: &[u8],
    length: usize,
) -> Result<Zeroizing<Vec<u8>>> {
    let prk = Zeroizing::new(backend::hmac(md, salt, ikm).map_err(|_| CryptoError::operation())?);
    let mut output = Zeroizing::new(allocate(length)?);
    let mut previous = Zeroizing::new(Vec::new());
    let mut offset = 0;
    for counter in 1..=length.div_ceil(md.size()) {
        let input_length = previous
            .len()
            .checked_add(info.len())
            .and_then(|n| n.checked_add(1))
            .ok_or_else(CryptoError::limit)?;
        let mut message = Zeroizing::new(allocate(input_length)?);
        message[..previous.len()].copy_from_slice(&previous);
        message[previous.len()..previous.len() + info.len()].copy_from_slice(info);
        *message.last_mut().unwrap() = counter as u8;
        previous = Zeroizing::new(
            backend::hmac(md, &prk, &message).map_err(|_| CryptoError::operation())?,
        );
        let size = (length - offset).min(previous.len());
        output[offset..offset + size].copy_from_slice(&previous[..size]);
        offset += size;
    }
    Ok(output)
}
