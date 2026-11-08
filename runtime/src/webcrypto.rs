//! Native primitives and opaque key storage for the Rust Web Crypto bindings.
//!
//! Public classes expose only key metadata and operation results. Key usages
//! and extractability are enforced here independently of mutable JS metadata.
use std::collections::{HashMap, HashSet};

use base64::{engine::general_purpose, Engine as _};
use boring2::bn::{BigNum, BigNumContext, BigNumRef};
use boring2::derive::Deriver;
use boring2::ec::{EcGroup, EcKey, EcPoint, PointConversionForm};
use boring2::ecdsa::EcdsaSig;
use boring2::hash::{hash, MessageDigest};
use boring2::memcmp;
use boring2::nid::Nid;
use boring2::pkcs5::pbkdf2_hmac;
use boring2::pkey::{Id, PKey, Private, Public};
use boring2::rand::rand_bytes;
use boring2::rsa::{Padding, Rsa};
use boring2::sign::{RsaPssSaltlen, Signer, Verifier};
use boring2::symm::{Cipher, Crypter, Mode};
use rquickjs::Ctx;

#[path = "webcrypto_boring.rs"]
mod backend;
#[path = "webcrypto_bindings.rs"]
mod bindings;
use serde_json::{json, Value};
use zeroize::Zeroizing;
#[path = "webcrypto_derive_sign.rs"]
mod derive_sign;
#[path = "webcrypto_okp.rs"]
mod okp;
#[path = "webcrypto_transport.rs"]
mod transport;
pub(crate) use bindings::CryptoPump;
use transport::{CryptoOutput, CryptoRequest, SensitiveJson, MAX_ARRAY_BUFFER_BYTES};

type Result<T> = std::result::Result<T, CryptoError>;

struct CryptoError {
    name: &'static str,
    message: &'static str,
}

impl CryptoError {
    fn new(name: &'static str, message: &'static str) -> Self {
        Self { name, message }
    }
    fn limit() -> Self {
        Self::new(
            "OperationError",
            "Cryptographic input exceeds implementation representation limits",
        )
    }
    fn data() -> Self {
        Self::new("DataError", "Invalid key data")
    }
    fn operation() -> Self {
        Self::new("OperationError", "The cryptographic operation failed")
    }
    fn access() -> Self {
        Self::new(
            "InvalidAccessError",
            "The key does not permit this operation",
        )
    }
    fn unsupported() -> Self {
        Self::new(
            "NotSupportedError",
            "The requested algorithm or format is not supported",
        )
    }
    fn syntax() -> Self {
        Self::new("SyntaxError", "Invalid key usages")
    }
    fn parameter() -> Self {
        Self::new("TypeError", "Invalid cryptographic parameters")
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Hash {
    Sha1,
    Sha256,
    Sha384,
    Sha512,
}

impl Hash {
    fn parse(value: &Value) -> Result<Self> {
        match algorithm_name(value)?.as_str() {
            "SHA-1" => Ok(Self::Sha1),
            "SHA-256" => Ok(Self::Sha256),
            "SHA-384" => Ok(Self::Sha384),
            "SHA-512" => Ok(Self::Sha512),
            _ => Err(CryptoError::unsupported()),
        }
    }
    fn name(self) -> &'static str {
        match self {
            Self::Sha1 => "SHA-1",
            Self::Sha256 => "SHA-256",
            Self::Sha384 => "SHA-384",
            Self::Sha512 => "SHA-512",
        }
    }
    fn md(self) -> MessageDigest {
        match self {
            Self::Sha1 => MessageDigest::sha1(),
            Self::Sha256 => MessageDigest::sha256(),
            Self::Sha384 => MessageDigest::sha384(),
            Self::Sha512 => MessageDigest::sha512(),
        }
    }
    fn block_bits(self) -> usize {
        match self {
            Self::Sha1 | Self::Sha256 => 512,
            Self::Sha384 | Self::Sha512 => 1024,
        }
    }
    fn hmac_jwk(self) -> &'static str {
        match self {
            Self::Sha1 => "HS1",
            Self::Sha256 => "HS256",
            Self::Sha384 => "HS384",
            Self::Sha512 => "HS512",
        }
    }
    fn rsa_jwk(self) -> &'static str {
        match self {
            Self::Sha1 => "RSA-OAEP",
            Self::Sha256 => "RSA-OAEP-256",
            Self::Sha384 => "RSA-OAEP-384",
            Self::Sha512 => "RSA-OAEP-512",
        }
    }
}

enum Material {
    Secret(Zeroizing<Vec<u8>>),
    Public(PKey<Public>),
    Private(PKey<Private>),
}

struct Key {
    material: Material,
    name: String,
    hash: Option<Hash>,
    algorithm: Value,
    extractable: bool,
    usages: Vec<String>,
}

impl Key {
    fn kind(&self) -> &'static str {
        match self.material {
            Material::Secret(_) => "secret",
            Material::Public(_) => "public",
            Material::Private(_) => "private",
        }
    }
    fn permits(&self, usage: &str, algorithm: &Value) -> Result<()> {
        if self.name != algorithm_name(algorithm)? || !self.usages.iter().any(|s| s == usage) {
            return Err(CryptoError::access());
        }
        Ok(())
    }
    fn secret(&self) -> Result<&[u8]> {
        match &self.material {
            Material::Secret(bytes) => Ok(bytes),
            _ => Err(CryptoError::access()),
        }
    }
    fn descriptor(&self, id: u64) -> Value {
        json!({"id":id,"type":self.kind(),"extractable":self.extractable,
            "algorithm":self.algorithm,"usages":self.usages})
    }
    fn jwk_alg(&self) -> Result<String> {
        match self.name.as_str() {
            "AES-GCM" => Ok(format!("A{}GCM", self.secret()?.len() * 8)),
            "AES-CBC" => Ok(format!("A{}CBC", self.secret()?.len() * 8)),
            "HMAC" => Ok(self.hash.ok_or_else(CryptoError::data)?.hmac_jwk().into()),
            "RSA-OAEP" => Ok(self.hash.ok_or_else(CryptoError::data)?.rsa_jwk().into()),
            "RSASSA-PKCS1-v1_5" | "RSA-PSS" => {
                let hash = self.hash.ok_or_else(CryptoError::data)?;
                let prefix = if self.name == "RSA-PSS" { "PS" } else { "RS" };
                let suffix = match hash {
                    Hash::Sha1 => "1",
                    Hash::Sha256 => "256",
                    Hash::Sha384 => "384",
                    Hash::Sha512 => "512",
                };
                Ok(format!("{prefix}{suffix}"))
            }
            "ECDSA" => Ok(match string(&self.algorithm, "namedCurve")? {
                "P-256" => "ES256",
                "P-384" => "ES384",
                "P-521" => "ES512",
                _ => return Err(CryptoError::data()),
            }
            .into()),
            "Ed25519" => Ok("Ed25519".into()),
            _ => Err(CryptoError::unsupported()),
        }
    }
}

#[derive(Default)]
struct CryptoState {
    next_key: u64,
    keys: HashMap<u64, Key>,
    max_key_bytes: usize,
}

pub(crate) fn install(
    ctx: &Ctx<'_>,
    max_pending: usize,
    max_bytes: usize,
    revoked: crate::CancellationToken,
) -> rquickjs::Result<CryptoPump> {
    bindings::install(ctx, max_pending, max_bytes, revoked)
}

impl CryptoState {
    fn remove_key(&mut self, id: u64) {
        self.keys.remove(&id);
    }
    fn add(&mut self, key: Key) -> Result<Value> {
        let estimate = |key: &Key| match &key.material {
            Material::Secret(bytes) => bytes.len(),
            // Conservative per-key allowance for supported native RSA/EC keys.
            Material::Public(_) | Material::Private(_) => 16 * 1024,
        };
        let used: usize = self.keys.values().map(estimate).sum();
        if self.keys.len() >= 4096 || used.saturating_add(estimate(&key)) > self.max_key_bytes {
            return Err(CryptoError::limit());
        }
        if key.kind() != "public" && key.usages.is_empty() {
            return Err(CryptoError::syntax());
        }
        self.keys
            .try_reserve(1)
            .map_err(|_| CryptoError::operation())?;
        self.next_key = self
            .next_key
            .checked_add(1)
            .ok_or_else(CryptoError::operation)?;
        let descriptor = key.descriptor(self.next_key);
        self.keys.insert(self.next_key, key);
        Ok(descriptor)
    }
    fn add_pair(&mut self, public: Key, private: Key) -> Result<Value> {
        if private.usages.is_empty() {
            return Err(CryptoError::syntax());
        }
        self.keys
            .try_reserve(2)
            .map_err(|_| CryptoError::operation())?;
        let public_key = self.add(public)?;
        match self.add(private) {
            Ok(private_key) => Ok(json!({"publicKey":public_key,"privateKey":private_key})),
            Err(error) => {
                self.remove_key(public_key["id"].as_u64().unwrap());
                Err(error)
            }
        }
    }
    fn key(&self, request: &Value, field: &str) -> Result<&Key> {
        let id = request
            .get(field)
            .and_then(Value::as_u64)
            .ok_or_else(CryptoError::access)?;
        self.keys.get(&id).ok_or_else(CryptoError::access)
    }
    fn execute(&mut self, input: &CryptoRequest) -> Result<CryptoOutput> {
        let request = &input.params;
        match string(request, "op")? {
            "digest" => {
                let md = Hash::parse(required(request, "algorithm")?)?.md();
                let output = hash(md, input.binary(request, "data")?)
                    .map_err(|_| CryptoError::operation())?;
                Ok(CryptoOutput::bytes(output.to_vec()))
            }
            "importKey" => {
                let format = string(request, "format")?;
                let data = key_data(input, format, required(request, "keyData")?)?;
                let key = import_key(
                    format,
                    data,
                    required(request, "algorithm")?,
                    boolean(request, "extractable")?,
                    parse_usages(required(request, "usages")?)?,
                )?;
                Ok(CryptoOutput::json(self.add(key)?))
            }
            "generateKey" => Ok(CryptoOutput::json(self.generate(input)?)),
            "exportKey" => export_key(self.key(request, "key")?, string(request, "format")?),
            "encrypt" | "decrypt" => {
                let encrypt = string(request, "op")? == "encrypt";
                let key = self.key(request, "key")?;
                let algorithm = required(request, "algorithm")?;
                key.permits(if encrypt { "encrypt" } else { "decrypt" }, algorithm)?;
                Ok(CryptoOutput::secret(cipher_operation(
                    input,
                    key,
                    algorithm,
                    input.binary(request, "data")?,
                    encrypt,
                )?))
            }
            "sign" | "verify" => self.signature(input),
            "deriveBits" | "deriveKey" => self.derive(input),
            "wrapKey" => {
                let key = self.key(request, "key")?;
                let wrapping = self.key(request, "wrappingKey")?;
                let algorithm = required(request, "algorithm")?;
                wrapping.permits("wrapKey", algorithm)?;
                let format = string(request, "format")?;
                let mut exported = export_key(key, format)?;
                let data = if format == "jwk" {
                    Zeroizing::new(
                        serde_json::to_vec(&exported.value)
                            .map_err(|_| CryptoError::operation())?,
                    )
                } else {
                    exported.bytes.take().ok_or_else(CryptoError::operation)?
                };
                Ok(CryptoOutput::secret(cipher_operation(
                    input, wrapping, algorithm, &data, true,
                )?))
            }
            "unwrapKey" => {
                let wrapping = self.key(request, "unwrappingKey")?;
                let algorithm = required(request, "algorithm")?;
                wrapping.permits("unwrapKey", algorithm)?;
                let plain = cipher_operation(
                    input,
                    wrapping,
                    algorithm,
                    input.binary(request, "data")?,
                    false,
                )?;
                let format = string(request, "format")?;
                let parsed;
                let data = if format == "jwk" {
                    parsed = serde_json::from_slice::<SensitiveJson>(&plain)
                        .map_err(|_| CryptoError::data())?;
                    KeyData::Jwk(&parsed)
                } else {
                    KeyData::Bytes(&plain)
                };
                let key = import_key(
                    format,
                    data,
                    required(request, "unwrappedKeyAlgorithm")?,
                    boolean(request, "extractable")?,
                    parse_usages(required(request, "usages")?)?,
                )?;
                Ok(CryptoOutput::json(self.add(key)?))
            }
            _ => Err(CryptoError::unsupported()),
        }
    }

    fn generate(&mut self, input: &CryptoRequest) -> Result<Value> {
        let request = &input.params;
        let algorithm = required(request, "algorithm")?;
        let name = algorithm_name(algorithm)?;
        let extractable = boolean(request, "extractable")?;
        let usages = parse_usages(required(request, "usages")?)?;
        match name.as_str() {
            "Ed25519" | "X25519" => okp::generate(self, &name, extractable, usages),
            "AES-GCM" | "AES-CBC" | "HMAC" => {
                let (hash, length, meta) = if name == "HMAC" {
                    validate_usages(&usages, &["sign", "verify"], false)?;
                    let hash = Hash::parse(required(algorithm, "hash")?)?;
                    let length =
                        optional_integer(algorithm, "length")?.unwrap_or(hash.block_bits());
                    if length == 0 {
                        return Err(CryptoError::operation());
                    }
                    (
                        Some(hash),
                        length,
                        json!({"name":name,"hash":{"name":hash.name()},"length":length}),
                    )
                } else {
                    validate_usages(
                        &usages,
                        &["encrypt", "decrypt", "wrapKey", "unwrapKey"],
                        false,
                    )?;
                    let length = integer(algorithm, "length")?;
                    if ![128, 192, 256].contains(&length) {
                        return Err(CryptoError::operation());
                    }
                    (None, length, json!({"name":name,"length":length}))
                };
                let byte_length = length.div_ceil(8);
                let mut bytes = Zeroizing::new(allocate(byte_length)?);
                rand_bytes(&mut bytes).map_err(|_| CryptoError::operation())?;
                mask_unused_key_bits(&mut bytes, length);
                self.add(Key {
                    material: Material::Secret(bytes),
                    name,
                    hash,
                    algorithm: meta,
                    extractable,
                    usages,
                })
            }
            "RSA-OAEP" | "RSASSA-PKCS1-v1_5" | "RSA-PSS" => {
                let signing = name != "RSA-OAEP";
                let allowed = if signing {
                    &SIGN_USAGES[..]
                } else {
                    &CIPHER_USAGES[..]
                };
                validate_usages(&usages, allowed, true)?;
                let public_usages = subset(
                    &usages,
                    if signing {
                        &["verify"]
                    } else {
                        &["encrypt", "wrapKey"]
                    },
                );
                let private_usages = subset(
                    &usages,
                    if signing {
                        &["sign"]
                    } else {
                        &["decrypt", "unwrapKey"]
                    },
                );
                if private_usages.is_empty() {
                    return Err(CryptoError::syntax());
                }
                let hash = Hash::parse(required(algorithm, "hash")?)?;
                let modulus_length = integer(algorithm, "modulusLength")?;
                if !(512..=16384).contains(&modulus_length) || modulus_length % 128 != 0 {
                    return Err(CryptoError::operation());
                }
                let exponent = input.binary(algorithm, "publicExponent")?;
                let exponent =
                    BigNum::from_slice(exponent).map_err(|_| CryptoError::operation())?;
                if !(2..=32).contains(&exponent.num_bits()) || !exponent.is_bit_set(0) {
                    return Err(CryptoError::operation());
                }
                let private = Rsa::generate_with_e(modulus_length as u32, &exponent)
                    .map_err(|_| CryptoError::operation())?;
                let public = Rsa::from_public_components(
                    private
                        .n()
                        .to_owned()
                        .map_err(|_| CryptoError::operation())?,
                    private
                        .e()
                        .to_owned()
                        .map_err(|_| CryptoError::operation())?,
                )
                .map_err(|_| CryptoError::operation())?;
                let meta = rsa_algorithm(&name, private.n(), private.e(), hash);
                let public = Key {
                    material: Material::Public(
                        PKey::from_rsa(public).map_err(|_| CryptoError::operation())?,
                    ),
                    name: name.clone(),
                    hash: Some(hash),
                    algorithm: meta.clone(),
                    extractable: true,
                    usages: public_usages,
                };
                let private = Key {
                    material: Material::Private(
                        PKey::from_rsa(private).map_err(|_| CryptoError::operation())?,
                    ),
                    name,
                    hash: Some(hash),
                    algorithm: meta,
                    extractable,
                    usages: private_usages,
                };
                self.add_pair(public, private)
            }
            "ECDSA" | "ECDH" => {
                let signing = name == "ECDSA";
                validate_usages(
                    &usages,
                    if signing {
                        &SIGN_USAGES
                    } else {
                        &DERIVE_USAGES
                    },
                    true,
                )?;
                let private_usages =
                    subset(&usages, if signing { &["sign"] } else { &DERIVE_USAGES });
                if private_usages.is_empty() {
                    return Err(CryptoError::syntax());
                }
                let curve = Curve::parse(string(algorithm, "namedCurve")?)?;
                let meta = json!({"name":name,"namedCurve":curve.name()});
                let public_usages = subset(&usages, if signing { &["verify"] } else { &[] });
                let group = curve.group()?;
                let private = EcKey::generate(&group).map_err(|_| CryptoError::operation())?;
                let public = EcKey::from_public_key(&group, private.public_key())
                    .map_err(|_| CryptoError::operation())?;
                let public = Key {
                    material: Material::Public(
                        PKey::from_ec_key(public).map_err(|_| CryptoError::operation())?,
                    ),
                    name: name.clone(),
                    hash: None,
                    algorithm: meta.clone(),
                    extractable: true,
                    usages: public_usages,
                };
                let private = Key {
                    material: Material::Private(
                        PKey::from_ec_key(private).map_err(|_| CryptoError::operation())?,
                    ),
                    name,
                    hash: None,
                    algorithm: meta,
                    extractable,
                    usages: private_usages,
                };
                self.add_pair(public, private)
            }
            _ => Err(CryptoError::unsupported()),
        }
    }
}

const SIGN_USAGES: [&str; 2] = ["sign", "verify"];
const DERIVE_USAGES: [&str; 2] = ["deriveKey", "deriveBits"];
const CIPHER_USAGES: [&str; 4] = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
enum KeyData<'a> {
    Bytes(&'a [u8]),
    Jwk(&'a Value),
}
impl<'a> KeyData<'a> {
    fn bytes(&self) -> Result<&'a [u8]> {
        match self {
            Self::Bytes(bytes) => Ok(bytes),
            _ => Err(CryptoError::data()),
        }
    }
    fn jwk(&self) -> Result<&'a Value> {
        match self {
            Self::Jwk(value) => Ok(value),
            _ => Err(CryptoError::data()),
        }
    }
}
fn key_data<'a>(input: &'a CryptoRequest, format: &str, value: &'a Value) -> Result<KeyData<'a>> {
    if format == "jwk" {
        Ok(KeyData::Jwk(value))
    } else {
        Ok(KeyData::Bytes(input.bytes(value)?))
    }
}

fn import_key(
    format: &str,
    data: KeyData<'_>,
    algorithm: &Value,
    extractable: bool,
    usages: Vec<String>,
) -> Result<Key> {
    let name = algorithm_name(algorithm)?;
    let key = match name.as_str() {
        "Ed25519" | "X25519" => okp::import(&name, format, &data, extractable, usages)?,
        "AES-GCM" | "AES-CBC" | "HMAC" | "PBKDF2" | "HKDF" => {
            let kdf = name == "PBKDF2" || name == "HKDF";
            validate_usages(
                &usages,
                if kdf {
                    &DERIVE_USAGES[..]
                } else if name == "HMAC" {
                    &SIGN_USAGES[..]
                } else {
                    &CIPHER_USAGES[..]
                },
                true,
            )?;
            if kdf && extractable {
                return Err(CryptoError::syntax());
            }
            let mut bytes = Zeroizing::new(match format {
                "raw" => copy_bytes(data.bytes()?)?,
                "jwk" if !kdf => {
                    let jwk = data.jwk()?;
                    if string(jwk, "kty").map_err(|_| CryptoError::data())? != "oct" {
                        return Err(CryptoError::data());
                    }
                    jwk_bytes(jwk, "k")?
                }
                _ => return Err(CryptoError::unsupported()),
            });
            let bit_length = bytes.len().checked_mul(8).ok_or_else(CryptoError::data)?;
            let (hash, meta) = if name == "HMAC" {
                // HmacKeyAlgorithm.length is an unsigned long in Web IDL.
                if bit_length == 0 || u32::try_from(bit_length).is_err() {
                    return Err(CryptoError::data());
                }
                let hash = Hash::parse(required(algorithm, "hash")?)?;
                let length = optional_integer(algorithm, "length")?.unwrap_or(bit_length);
                if length > bit_length || length <= bit_length.saturating_sub(8) {
                    return Err(CryptoError::data());
                }
                mask_unused_key_bits(&mut bytes, length);
                (
                    Some(hash),
                    json!({"name":name,"hash":{"name":hash.name()},"length":length}),
                )
            } else if kdf {
                (None, json!({"name":name}))
            } else {
                if ![128, 192, 256].contains(&bit_length) {
                    return Err(CryptoError::data());
                }
                (None, json!({"name":name,"length":bit_length}))
            };
            Key {
                material: Material::Secret(bytes),
                name,
                hash,
                algorithm: meta,
                extractable,
                usages,
            }
        }
        "RSA-OAEP" | "RSASSA-PKCS1-v1_5" | "RSA-PSS" => {
            let hash = Hash::parse(required(algorithm, "hash")?)?;
            let signing = name != "RSA-OAEP";
            let material = match format {
                "spki" => {
                    let bytes = data.bytes()?;
                    validate_der_envelope(bytes)?;
                    let key = PKey::public_key_from_der(bytes).map_err(|_| CryptoError::data())?;
                    if key.id() != Id::RSA {
                        return Err(CryptoError::data());
                    }
                    Material::Public(key)
                }
                "pkcs8" => {
                    let bytes = data.bytes()?;
                    validate_der_envelope(bytes)?;
                    let key =
                        PKey::private_key_from_pkcs8(bytes).map_err(|_| CryptoError::data())?;
                    if key.id() != Id::RSA {
                        return Err(CryptoError::data());
                    }
                    Material::Private(key)
                }
                "jwk" => {
                    let jwk = data.jwk()?;
                    if string(jwk, "kty").map_err(|_| CryptoError::data())? != "RSA" {
                        return Err(CryptoError::data());
                    }
                    if jwk.get("oth").is_some() {
                        return Err(CryptoError::unsupported());
                    }
                    let n = jwk_bn(jwk, "n")?;
                    let e = jwk_bn(jwk, "e")?;
                    validate_rsa_public(&n, &e)?;
                    if jwk.get("d").is_some() {
                        let key = Rsa::from_private_components(
                            n,
                            e,
                            jwk_bn(jwk, "d")?,
                            jwk_bn(jwk, "p")?,
                            jwk_bn(jwk, "q")?,
                            jwk_bn(jwk, "dp")?,
                            jwk_bn(jwk, "dq")?,
                            jwk_bn(jwk, "qi")?,
                        )
                        .map_err(|_| CryptoError::data())?;
                        Material::Private(PKey::from_rsa(key).map_err(|_| CryptoError::data())?)
                    } else {
                        let key =
                            Rsa::from_public_components(n, e).map_err(|_| CryptoError::data())?;
                        Material::Public(PKey::from_rsa(key).map_err(|_| CryptoError::data())?)
                    }
                }
                _ => return Err(CryptoError::unsupported()),
            };
            let meta = match &material {
                Material::Public(key) => {
                    validate_usages(
                        &usages,
                        if signing {
                            &["verify"]
                        } else {
                            &["encrypt", "wrapKey"]
                        },
                        true,
                    )?;
                    let rsa = key.rsa().map_err(|_| CryptoError::data())?;
                    validate_rsa_public(rsa.n(), rsa.e())?;
                    rsa_algorithm(&name, rsa.n(), rsa.e(), hash)
                }
                Material::Private(key) => {
                    validate_usages(
                        &usages,
                        if signing {
                            &["sign"]
                        } else {
                            &["decrypt", "unwrapKey"]
                        },
                        true,
                    )?;
                    let rsa = key.rsa().map_err(|_| CryptoError::data())?;
                    validate_rsa_public(rsa.n(), rsa.e())?;
                    validate_rsa_components(&rsa)?;
                    if !rsa.check_key().map_err(|_| CryptoError::data())? {
                        return Err(CryptoError::data());
                    }
                    rsa_algorithm(&name, rsa.n(), rsa.e(), hash)
                }
                _ => return Err(CryptoError::data()),
            };
            Key {
                material,
                name,
                hash: Some(hash),
                algorithm: meta,
                extractable,
                usages,
            }
        }
        "ECDSA" | "ECDH" => {
            let curve = Curve::parse(string(algorithm, "namedCurve")?)?;
            let group = curve.group()?;
            let material = match format {
                "raw" => {
                    let bytes = data.bytes()?;
                    if bytes.len() != 1 + 2 * curve.bytes() || bytes[0] != 4 {
                        return Err(CryptoError::data());
                    }
                    let mut ctx = BigNumContext::new().map_err(|_| CryptoError::operation())?;
                    let point = EcPoint::from_bytes(&group, bytes, &mut ctx)
                        .map_err(|_| CryptoError::data())?;
                    let key =
                        EcKey::from_public_key(&group, &point).map_err(|_| CryptoError::data())?;
                    Material::Public(PKey::from_ec_key(key).map_err(|_| CryptoError::data())?)
                }
                "spki" => {
                    let bytes = data.bytes()?;
                    validate_der_envelope(bytes)?;
                    let key = PKey::public_key_from_der(bytes).map_err(|_| CryptoError::data())?;
                    if key.id() != Id::EC {
                        return Err(CryptoError::data());
                    }
                    Material::Public(key)
                }
                "pkcs8" => {
                    let bytes = data.bytes()?;
                    validate_der_envelope(bytes)?;
                    let key =
                        PKey::private_key_from_pkcs8(bytes).map_err(|_| CryptoError::data())?;
                    if key.id() != Id::EC {
                        return Err(CryptoError::data());
                    }
                    Material::Private(key)
                }
                "jwk" => {
                    let jwk = data.jwk()?;
                    if string(jwk, "kty").map_err(|_| CryptoError::data())? != "EC"
                        || string(jwk, "crv").map_err(|_| CryptoError::data())? != curve.name()
                    {
                        return Err(CryptoError::data());
                    }
                    let x = Zeroizing::new(jwk_bytes(jwk, "x")?);
                    let y = Zeroizing::new(jwk_bytes(jwk, "y")?);
                    if x.len() != curve.bytes() || y.len() != curve.bytes() {
                        return Err(CryptoError::data());
                    }
                    let x = BigNum::from_slice(&x).map_err(|_| CryptoError::data())?;
                    let y = BigNum::from_slice(&y).map_err(|_| CryptoError::data())?;
                    let public = EcKey::from_public_key_affine_coordinates(&group, &x, &y)
                        .map_err(|_| CryptoError::data())?;
                    if jwk.get("d").is_some() {
                        let d = Zeroizing::new(jwk_bytes(jwk, "d")?);
                        if d.len() != curve.bytes() {
                            return Err(CryptoError::data());
                        }
                        let d = BigNum::from_slice(&d).map_err(|_| CryptoError::data())?;
                        let key = EcKey::from_private_components(&group, &d, public.public_key())
                            .map_err(|_| CryptoError::data())?;
                        Material::Private(PKey::from_ec_key(key).map_err(|_| CryptoError::data())?)
                    } else {
                        Material::Public(
                            PKey::from_ec_key(public).map_err(|_| CryptoError::data())?,
                        )
                    }
                }
                _ => return Err(CryptoError::unsupported()),
            };
            match &material {
                Material::Public(key) => {
                    validate_usages(
                        &usages,
                        if name == "ECDSA" { &["verify"] } else { &[] },
                        true,
                    )?;
                    let ec = key.ec_key().map_err(|_| CryptoError::data())?;
                    if ec.group().curve_name() != Some(curve.nid()) {
                        return Err(CryptoError::data());
                    }
                    ec.check_key().map_err(|_| CryptoError::data())?;
                }
                Material::Private(key) => {
                    validate_usages(
                        &usages,
                        if name == "ECDSA" {
                            &["sign"]
                        } else {
                            &DERIVE_USAGES
                        },
                        true,
                    )?;
                    let ec = key.ec_key().map_err(|_| CryptoError::data())?;
                    if ec.group().curve_name() != Some(curve.nid()) {
                        return Err(CryptoError::data());
                    }
                    ec.check_key().map_err(|_| CryptoError::data())?;
                }
                _ => return Err(CryptoError::data()),
            }
            let meta = json!({"name":name,"namedCurve":curve.name()});
            Key {
                material,
                name,
                hash: None,
                algorithm: meta,
                extractable,
                usages,
            }
        }
        _ => return Err(CryptoError::unsupported()),
    };
    if format == "jwk" {
        validate_jwk(data.jwk()?, &key)?;
    }
    Ok(key)
}

fn export_key(key: &Key, format: &str) -> Result<CryptoOutput> {
    if matches!(key.name.as_str(), "PBKDF2" | "HKDF") {
        return Err(CryptoError::unsupported());
    }
    if !key.extractable {
        return Err(CryptoError::access());
    }
    if matches!(key.name.as_str(), "Ed25519" | "X25519") {
        return okp::export(key, format);
    }
    match (format, &key.material) {
        ("raw", Material::Secret(bytes)) => Ok(CryptoOutput::bytes(copy_bytes(bytes)?)),
        ("raw", Material::Public(pkey)) if pkey.id() == Id::EC => {
            let ec = pkey.ec_key().map_err(|_| CryptoError::operation())?;
            let mut ctx = BigNumContext::new().map_err(|_| CryptoError::operation())?;
            Ok(CryptoOutput::bytes(
                ec.public_key()
                    .to_bytes(ec.group(), PointConversionForm::UNCOMPRESSED, &mut ctx)
                    .map_err(|_| CryptoError::operation())?,
            ))
        }
        ("spki", Material::Public(pkey)) => Ok(CryptoOutput::bytes(
            pkey.public_key_to_der()
                .map_err(|_| CryptoError::operation())?,
        )),
        ("pkcs8", Material::Private(pkey)) => Ok(CryptoOutput::bytes(
            pkey.private_key_to_der_pkcs8()
                .map_err(|_| CryptoError::operation())?,
        )),
        ("jwk", material) => {
            let mut jwk = SensitiveJson(json!({"key_ops":key.usages,"ext":key.extractable}));
            // EC exports do not attach a hash: Web Crypto EC keys are not bound
            // to a particular digest, unlike RSA/HMAC keys.
            if !matches!(key.name.as_str(), "ECDSA" | "ECDH") {
                jwk["alg"] = json!(key.jwk_alg()?);
            }
            match material {
                Material::Secret(bytes) => {
                    jwk["kty"] = json!("oct");
                    jwk["k"] = Value::String(encode_secret_jwk(bytes)?);
                }
                Material::Public(pkey) if pkey.id() == Id::EC => {
                    let ec = pkey.ec_key().map_err(|_| CryptoError::operation())?;
                    ec_jwk(&mut jwk, key, ec.group(), ec.public_key())?;
                }
                Material::Private(pkey) if pkey.id() == Id::EC => {
                    let ec = pkey.ec_key().map_err(|_| CryptoError::operation())?;
                    ec_jwk(&mut jwk, key, ec.group(), ec.public_key())?;
                    let curve = Curve::parse(string(&key.algorithm, "namedCurve")?)?;
                    let bytes = Zeroizing::new(bn_fixed(ec.private_key(), curve.bytes())?);
                    jwk["d"] = Value::String(general_purpose::URL_SAFE_NO_PAD.encode(&bytes));
                }
                Material::Public(pkey) => {
                    let rsa = pkey.rsa().map_err(|_| CryptoError::operation())?;
                    jwk["kty"] = json!("RSA");
                    jwk["n"] = bn_value(rsa.n());
                    jwk["e"] = bn_value(rsa.e());
                }
                Material::Private(pkey) => {
                    let rsa = pkey.rsa().map_err(|_| CryptoError::operation())?;
                    jwk["kty"] = json!("RSA");
                    jwk["n"] = bn_value(rsa.n());
                    jwk["e"] = bn_value(rsa.e());
                    jwk["d"] = bn_value(rsa.d());
                    jwk["p"] = bn_value(rsa.p().ok_or_else(CryptoError::operation)?);
                    jwk["q"] = bn_value(rsa.q().ok_or_else(CryptoError::operation)?);
                    jwk["dp"] = bn_value(rsa.dmp1().ok_or_else(CryptoError::operation)?);
                    jwk["dq"] = bn_value(rsa.dmq1().ok_or_else(CryptoError::operation)?);
                    jwk["qi"] = bn_value(rsa.iqmp().ok_or_else(CryptoError::operation)?);
                }
            }
            Ok(CryptoOutput::json(std::mem::take(&mut jwk.0)))
        }
        ("spki", Material::Private(_)) | ("pkcs8", Material::Public(_)) => {
            Err(CryptoError::access())
        }
        _ => Err(CryptoError::unsupported()),
    }
}

#[derive(Clone, Copy)]
enum Curve {
    P256,
    P384,
    P521,
}
impl Curve {
    fn parse(name: &str) -> Result<Self> {
        match name {
            "P-256" => Ok(Self::P256),
            "P-384" => Ok(Self::P384),
            "P-521" => Ok(Self::P521),
            _ => Err(CryptoError::unsupported()),
        }
    }
    fn name(self) -> &'static str {
        match self {
            Self::P256 => "P-256",
            Self::P384 => "P-384",
            Self::P521 => "P-521",
        }
    }
    fn bytes(self) -> usize {
        match self {
            Self::P256 => 32,
            Self::P384 => 48,
            Self::P521 => 66,
        }
    }
    fn nid(self) -> Nid {
        match self {
            Self::P256 => Nid::X9_62_PRIME256V1,
            Self::P384 => Nid::SECP384R1,
            Self::P521 => Nid::SECP521R1,
        }
    }
    fn group(self) -> Result<EcGroup> {
        EcGroup::from_curve_name(self.nid()).map_err(|_| CryptoError::operation())
    }
}
fn ec_jwk(
    jwk: &mut Value,
    key: &Key,
    group: &boring2::ec::EcGroupRef,
    point: &boring2::ec::EcPointRef,
) -> Result<()> {
    let curve = Curve::parse(string(&key.algorithm, "namedCurve")?)?;
    let mut ctx = BigNumContext::new().map_err(|_| CryptoError::operation())?;
    let bytes = point
        .to_bytes(group, PointConversionForm::UNCOMPRESSED, &mut ctx)
        .map_err(|_| CryptoError::operation())?;
    if bytes.len() != 1 + 2 * curve.bytes() {
        return Err(CryptoError::operation());
    }
    jwk["kty"] = json!("EC");
    jwk["crv"] = json!(curve.name());
    jwk["x"] = json!(general_purpose::URL_SAFE_NO_PAD.encode(&bytes[1..1 + curve.bytes()]));
    jwk["y"] = json!(general_purpose::URL_SAFE_NO_PAD.encode(&bytes[1 + curve.bytes()..]));
    Ok(())
}
fn bn_fixed(value: &BigNumRef, length: usize) -> Result<Vec<u8>> {
    let bytes = Zeroizing::new(value.to_vec());
    if bytes.len() > length {
        return Err(CryptoError::operation());
    }
    let mut output = allocate(length)?;
    output[length - bytes.len()..].copy_from_slice(&bytes);
    Ok(output)
}

fn cipher_operation(
    input: &CryptoRequest,
    key: &Key,
    algorithm: &Value,
    data: &[u8],
    encrypt: bool,
) -> Result<Zeroizing<Vec<u8>>> {
    match algorithm_name(algorithm)?.as_str() {
        "AES-GCM" | "AES-CBC" => symmetric(input, key, algorithm, data, encrypt),
        "RSA-OAEP" => rsa_oaep(input, key, algorithm, data, encrypt),
        _ => Err(CryptoError::unsupported()),
    }
}

fn symmetric(
    input: &CryptoRequest,
    key: &Key,
    algorithm: &Value,
    data: &[u8],
    encrypt: bool,
) -> Result<Zeroizing<Vec<u8>>> {
    if data.len() > MAX_ARRAY_BUFFER_BYTES {
        return Err(CryptoError::limit());
    }
    let bytes = key.secret()?;
    let gcm = key.name == "AES-GCM";
    let cipher = match (gcm, bytes.len()) {
        (true, 16) => Cipher::aes_128_gcm(),
        (true, 24) => Cipher::aes_192_gcm(),
        (true, 32) => Cipher::aes_256_gcm(),
        (false, 16) => Cipher::aes_128_cbc(),
        (false, 24) => Cipher::aes_192_cbc(),
        (false, 32) => Cipher::aes_256_cbc(),
        _ => return Err(CryptoError::access()),
    };
    let iv = input.binary(algorithm, "iv")?;
    if (gcm && iv.is_empty()) || (!gcm && iv.len() != 16) {
        return Err(CryptoError::operation());
    }
    let mode = if encrypt {
        Mode::Encrypt
    } else {
        Mode::Decrypt
    };
    let mut crypter =
        Crypter::new(cipher, mode, bytes, Some(&iv)).map_err(|_| CryptoError::operation())?;
    let (ciphertext, tag_length) = if gcm {
        let bits = optional_integer(algorithm, "tagLength")?.unwrap_or(128);
        if ![32, 64, 96, 104, 112, 120, 128].contains(&bits) {
            return Err(CryptoError::operation());
        }
        let tag_length = bits / 8;
        let aad = input.optional_binary(algorithm, "additionalData")?;
        crypter
            .aad_update(&aad)
            .map_err(|_| CryptoError::operation())?;
        if encrypt {
            (data, tag_length)
        } else {
            if data.len() < tag_length {
                return Err(CryptoError::operation());
            }
            let split = data.len() - tag_length;
            crypter
                .set_tag(&data[split..])
                .map_err(|_| CryptoError::operation())?;
            (&data[..split], tag_length)
        }
    } else {
        (data, 0)
    };
    let output_length = ciphertext
        .len()
        .checked_add(cipher.block_size())
        .ok_or_else(CryptoError::operation)?;
    // The BoringSSL Rust wrapper requires a signed-int-sized output slice.
    // The final result must also fit QuickJS's ArrayBuffer representation.
    if output_length > i32::MAX as usize
        || (gcm
            && encrypt
            && data
                .len()
                .checked_add(tag_length)
                .filter(|n| *n <= MAX_ARRAY_BUFFER_BYTES)
                .is_none())
    {
        return Err(CryptoError::limit());
    }
    let mut output = Zeroizing::new(allocate(output_length)?);
    let count = crypter
        .update(ciphertext, &mut output)
        .map_err(|_| CryptoError::operation())?;
    let final_count = crypter
        .finalize(&mut output[count..])
        .map_err(|_| CryptoError::operation())?;
    use zeroize::Zeroize;
    output[count + final_count..].zeroize();
    output.truncate(count + final_count);
    if gcm && encrypt {
        let mut tag = vec![0; tag_length];
        crypter
            .get_tag(&mut tag)
            .map_err(|_| CryptoError::operation())?;
        output
            .try_reserve(tag.len())
            .map_err(|_| CryptoError::operation())?;
        output.extend_from_slice(&tag);
    }
    Ok(output)
}

fn rsa_oaep(
    input: &CryptoRequest,
    key: &Key,
    algorithm: &Value,
    data: &[u8],
    encrypt: bool,
) -> Result<Zeroizing<Vec<u8>>> {
    let md = key.hash.ok_or_else(CryptoError::access)?.md();
    let label = input.optional_binary(algorithm, "label")?;
    match (&key.material, encrypt) {
        (Material::Public(key), true) => backend::encrypt_oaep(key, md, &label, data)
            .map(Zeroizing::new)
            .map_err(|_| CryptoError::operation()),
        (Material::Private(key), false) => backend::decrypt_oaep(key, md, &label, data)
            .map(Zeroizing::new)
            .map_err(|_| CryptoError::operation()),
        _ => Err(CryptoError::access()),
    }
}

fn validate_jwk(jwk: &Value, key: &Key) -> Result<()> {
    if let Some(alg) = jwk
        .get("alg")
        .filter(|_| !matches!(key.name.as_str(), "ECDH" | "X25519"))
    {
        if !(key.name == "Ed25519" && alg.as_str() == Some("EdDSA"))
            && alg.as_str() != Some(key.jwk_alg()?.as_str())
        {
            return Err(CryptoError::data());
        }
    }
    if let Some(ext) = jwk.get("ext") {
        let ext = ext.as_bool().ok_or_else(CryptoError::data)?;
        if !ext && key.extractable {
            return Err(CryptoError::data());
        }
    }
    if !key.usages.is_empty() {
        if let Some(use_) = jwk.get("use") {
            let expected = if matches!(
                key.name.as_str(),
                "HMAC" | "RSASSA-PKCS1-v1_5" | "RSA-PSS" | "ECDSA" | "Ed25519"
            ) {
                "sig"
            } else {
                "enc"
            };
            if use_.as_str() != Some(expected) {
                return Err(CryptoError::data());
            }
        }
    }
    if let Some(ops) = jwk.get("key_ops") {
        let ops = ops.as_array().ok_or_else(CryptoError::data)?;
        let mut seen = HashSet::new();
        for op in ops {
            if !seen.insert(op.as_str().ok_or_else(CryptoError::data)?) {
                return Err(CryptoError::data());
            }
        }
        if key.usages.iter().any(|u| !seen.contains(u.as_str())) {
            return Err(CryptoError::data());
        }
    }
    Ok(())
}

const USAGES: &[&str] = &[
    "encrypt",
    "decrypt",
    "sign",
    "verify",
    "deriveKey",
    "deriveBits",
    "wrapKey",
    "unwrapKey",
];

fn parse_usages(value: &Value) -> Result<Vec<String>> {
    let values = value.as_array().ok_or_else(CryptoError::parameter)?;
    let strings = values
        .iter()
        .map(|v| v.as_str().ok_or_else(CryptoError::parameter))
        .collect::<Result<Vec<_>>>()?;
    if strings.iter().any(|s| !USAGES.contains(s)) {
        return Err(CryptoError::parameter());
    }
    Ok(USAGES
        .iter()
        .filter(|u| strings.contains(u))
        .map(|u| (*u).to_owned())
        .collect())
}

fn validate_usages(usages: &[String], allowed: &[&str], allow_empty: bool) -> Result<()> {
    if (!allow_empty && usages.is_empty()) || usages.iter().any(|s| !allowed.contains(&s.as_str()))
    {
        return Err(CryptoError::syntax());
    }
    Ok(())
}

fn subset(usages: &[String], allowed: &[&str]) -> Vec<String> {
    usages
        .iter()
        .filter(|s| allowed.contains(&s.as_str()))
        .cloned()
        .collect()
}

fn rsa_algorithm(name: &str, n: &BigNumRef, e: &BigNumRef, hash: Hash) -> Value {
    json!({"name":name,"modulusLength":n.num_bits(),"publicExponent":e.to_vec(),"hash":{"name":hash.name()}})
}

fn validate_rsa_public(n: &BigNumRef, e: &BigNumRef) -> Result<()> {
    if n.num_bits() > 16384 || e.num_bits() > 16384 {
        return Err(CryptoError::limit());
    }
    if n.num_bits() < 2 || e.num_bits() < 2 || !e.is_bit_set(0) || !n.is_bit_set(0) || e >= n {
        return Err(CryptoError::data());
    }
    Ok(())
}

fn validate_rsa_components(rsa: &Rsa<Private>) -> Result<()> {
    for value in [
        Some(rsa.n()),
        Some(rsa.e()),
        Some(rsa.d()),
        rsa.p(),
        rsa.q(),
        rsa.dmp1(),
        rsa.dmq1(),
        rsa.iqmp(),
    ]
    .into_iter()
    .flatten()
    {
        if value.num_bits() > 16384 {
            return Err(CryptoError::limit());
        }
    }
    Ok(())
}

// Validate the complete DER envelope before handing the key structure to the
// backend. Web Crypto imports must not ignore bytes following the outer value.
fn validate_der_envelope(bytes: &[u8]) -> Result<()> {
    if bytes.len() < 2 || bytes[0] != 0x30 {
        return Err(CryptoError::data());
    }
    let first = bytes[1];
    let (header, content) = if first < 0x80 {
        (2usize, usize::from(first))
    } else {
        let count = usize::from(first & 0x7f);
        if count == 0 || count > std::mem::size_of::<usize>() || bytes.len() < 2 + count {
            return Err(CryptoError::data());
        }
        if bytes[2] == 0 {
            return Err(CryptoError::data());
        }
        let mut length = 0usize;
        for byte in &bytes[2..2 + count] {
            length = length
                .checked_mul(256)
                .and_then(|length| length.checked_add(usize::from(*byte)))
                .ok_or_else(CryptoError::data)?;
        }
        if length < 0x80 {
            return Err(CryptoError::data());
        }
        (2 + count, length)
    };
    if header.checked_add(content) != Some(bytes.len()) {
        return Err(CryptoError::data());
    }
    Ok(())
}

fn jwk_bytes(value: &Value, field: &str) -> Result<Vec<u8>> {
    let input = value
        .get(field)
        .and_then(Value::as_str)
        .ok_or_else(CryptoError::data)?;
    let decoded_capacity = input
        .len()
        .div_ceil(4)
        .checked_mul(3)
        .ok_or_else(CryptoError::limit)?;
    let mut bytes = Zeroizing::new(allocate(decoded_capacity)?);
    let length = general_purpose::URL_SAFE_NO_PAD
        .decode_slice(input, &mut bytes)
        .map_err(|_| CryptoError::data())?;
    use zeroize::Zeroize;
    bytes[length..].zeroize();
    bytes.truncate(length);
    Ok(std::mem::take(&mut *bytes))
}

fn jwk_bn(value: &Value, field: &str) -> Result<BigNum> {
    let bytes = Zeroizing::new(jwk_bytes(value, field)?);
    if bytes.is_empty() {
        return Err(CryptoError::data());
    }
    if bytes.len() > 2048 {
        return Err(CryptoError::limit());
    }
    BigNum::from_slice(&bytes).map_err(|_| CryptoError::data())
}

fn bn_value(value: &BigNumRef) -> Value {
    let bytes = Zeroizing::new(value.to_vec());
    Value::String(general_purpose::URL_SAFE_NO_PAD.encode(&bytes))
}

fn algorithm_name(value: &Value) -> Result<String> {
    value
        .as_str()
        .or_else(|| value.get("name").and_then(Value::as_str))
        .map(|name| {
            let upper = name.to_ascii_uppercase();
            if upper == "RSASSA-PKCS1-V1_5" {
                "RSASSA-PKCS1-v1_5".into()
            } else if upper == "ED25519" {
                "Ed25519".into()
            } else {
                upper
            }
        })
        .ok_or_else(CryptoError::parameter)
}

fn required<'a>(value: &'a Value, field: &str) -> Result<&'a Value> {
    value.get(field).ok_or_else(CryptoError::parameter)
}
fn string<'a>(value: &'a Value, field: &str) -> Result<&'a str> {
    required(value, field)?
        .as_str()
        .ok_or_else(CryptoError::parameter)
}
fn boolean(value: &Value, field: &str) -> Result<bool> {
    required(value, field)?
        .as_bool()
        .ok_or_else(CryptoError::parameter)
}
fn integer(value: &Value, field: &str) -> Result<usize> {
    required(value, field)?
        .as_u64()
        .and_then(|n| usize::try_from(n).ok())
        .ok_or_else(CryptoError::parameter)
}
fn optional_integer(value: &Value, field: &str) -> Result<Option<usize>> {
    value.get(field).map(|_| integer(value, field)).transpose()
}
fn mask_unused_key_bits(bytes: &mut [u8], bit_length: usize) {
    let used = bit_length % 8;
    if used != 0 {
        if let Some(last) = bytes.last_mut() {
            *last &= u8::MAX << (8 - used);
        }
    }
}

fn allocate(length: usize) -> Result<Vec<u8>> {
    if length > MAX_ARRAY_BUFFER_BYTES {
        return Err(CryptoError::limit());
    }
    let mut bytes = Vec::new();
    bytes
        .try_reserve_exact(length)
        .map_err(|_| CryptoError::operation())?;
    bytes.resize(length, 0);
    Ok(bytes)
}

fn copy_bytes(input: &[u8]) -> Result<Vec<u8>> {
    let mut bytes = allocate(input.len())?;
    bytes.copy_from_slice(input);
    Ok(bytes)
}

fn encode_secret_jwk(bytes: &[u8]) -> Result<String> {
    let length = base64::encoded_len(bytes.len(), false).ok_or_else(CryptoError::limit)?;
    let mut output = String::new();
    output
        .try_reserve_exact(length)
        .map_err(|_| CryptoError::operation())?;
    general_purpose::URL_SAFE_NO_PAD.encode_string(bytes, &mut output);
    Ok(output)
}
