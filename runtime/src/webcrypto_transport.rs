//! Owned native transport. Binary inputs never become Base64 strings.
use super::{CryptoError, Result};
use serde_json::Value;
use zeroize::{Zeroize, Zeroizing};

// Native allocations are outside the JS heap; bound individual crypto buffers.
pub(super) const MAX_ARRAY_BUFFER_BYTES: usize = 16 * 1024 * 1024;

pub(super) fn wipe_json(value: &mut Value) {
    match value {
        Value::String(text) => text.zeroize(),
        Value::Array(values) => values.iter_mut().for_each(wipe_json),
        Value::Object(values) => {
            for (mut name, mut value) in std::mem::take(values) {
                name.zeroize();
                wipe_json(&mut value);
            }
        }
        _ => {}
    }
}

pub(super) struct SensitiveJson(pub(super) Value);
impl Drop for SensitiveJson {
    fn drop(&mut self) {
        wipe_json(&mut self.0);
    }
}
impl std::ops::Deref for SensitiveJson {
    type Target = Value;
    fn deref(&self) -> &Value {
        &self.0
    }
}
impl std::ops::DerefMut for SensitiveJson {
    fn deref_mut(&mut self) -> &mut Value {
        &mut self.0
    }
}

pub(super) struct CryptoRequest {
    pub(super) params: Value,
    pub(super) buffers: Vec<Zeroizing<Vec<u8>>>,
}
impl Drop for CryptoRequest {
    fn drop(&mut self) {
        wipe_json(&mut self.params);
    }
}
impl CryptoRequest {
    pub(super) fn bytes<'a>(&'a self, value: &Value) -> Result<&'a [u8]> {
        let index = value
            .get("$buffer")
            .and_then(Value::as_u64)
            .and_then(|v| usize::try_from(v).ok())
            .ok_or_else(CryptoError::parameter)?;
        self.buffers
            .get(index)
            .map(|v| v.as_slice())
            .ok_or_else(CryptoError::parameter)
    }
    pub(super) fn binary<'a>(&'a self, value: &Value, field: &str) -> Result<&'a [u8]> {
        self.bytes(super::required(value, field)?)
    }
    pub(super) fn optional_binary<'a>(&'a self, value: &Value, field: &str) -> Result<&'a [u8]> {
        value.get(field).map(|v| self.bytes(v)).unwrap_or(Ok(&[]))
    }
}

pub(super) struct CryptoOutput {
    pub(super) value: Value,
    pub(super) bytes: Option<Zeroizing<Vec<u8>>>,
}
impl Drop for CryptoOutput {
    fn drop(&mut self) {
        wipe_json(&mut self.value);
    }
}
impl CryptoOutput {
    pub(super) fn json(value: Value) -> Self {
        Self { value, bytes: None }
    }
    pub(super) fn bytes(bytes: Vec<u8>) -> Self {
        Self {
            value: Value::Null,
            bytes: Some(Zeroizing::new(bytes)),
        }
    }
    pub(super) fn secret(bytes: Zeroizing<Vec<u8>>) -> Self {
        Self {
            value: Value::Null,
            bytes: Some(bytes),
        }
    }
}

// Guard completed sub-values while serde is still parsing later fields. On a
// malformed JWK every already-decoded key string is erased along the error path.
impl<'de> serde::Deserialize<'de> for SensitiveJson {
    fn deserialize<D: serde::Deserializer<'de>>(
        deserializer: D,
    ) -> std::result::Result<Self, D::Error> {
        struct Visitor;
        impl<'de> serde::de::Visitor<'de> for Visitor {
            type Value = SensitiveJson;
            fn expecting(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                f.write_str("JSON value")
            }
            fn visit_unit<E: serde::de::Error>(self) -> std::result::Result<Self::Value, E> {
                Ok(SensitiveJson(Value::Null))
            }
            fn visit_none<E: serde::de::Error>(self) -> std::result::Result<Self::Value, E> {
                self.visit_unit()
            }
            fn visit_bool<E: serde::de::Error>(
                self,
                v: bool,
            ) -> std::result::Result<Self::Value, E> {
                Ok(SensitiveJson(Value::Bool(v)))
            }
            fn visit_i64<E: serde::de::Error>(self, v: i64) -> std::result::Result<Self::Value, E> {
                Ok(SensitiveJson(v.into()))
            }
            fn visit_u64<E: serde::de::Error>(self, v: u64) -> std::result::Result<Self::Value, E> {
                Ok(SensitiveJson(v.into()))
            }
            fn visit_f64<E: serde::de::Error>(self, v: f64) -> std::result::Result<Self::Value, E> {
                Ok(SensitiveJson(v.into()))
            }
            fn visit_str<E: serde::de::Error>(
                self,
                v: &str,
            ) -> std::result::Result<Self::Value, E> {
                Ok(SensitiveJson(Value::String(v.into())))
            }
            fn visit_string<E: serde::de::Error>(
                self,
                v: String,
            ) -> std::result::Result<Self::Value, E> {
                Ok(SensitiveJson(Value::String(v)))
            }
            fn visit_seq<A: serde::de::SeqAccess<'de>>(
                self,
                mut access: A,
            ) -> std::result::Result<Self::Value, A::Error> {
                let mut output = SensitiveJson(Value::Array(Vec::new()));
                while let Some(mut value) = access.next_element::<SensitiveJson>()? {
                    let values = output.0.as_array_mut().unwrap();
                    values.try_reserve(1).map_err(serde::de::Error::custom)?;
                    values.push(std::mem::take(&mut value.0));
                }
                Ok(output)
            }
            fn visit_map<A: serde::de::MapAccess<'de>>(
                self,
                mut access: A,
            ) -> std::result::Result<Self::Value, A::Error> {
                let mut output = SensitiveJson(Value::Object(serde_json::Map::new()));
                while let Some(mut name) = access.next_key::<SensitiveJson>()? {
                    let Value::String(ref mut field) = name.0 else {
                        return Err(serde::de::Error::custom("Expected an object member name"));
                    };
                    let mut value = access.next_value::<SensitiveJson>()?;
                    if let Some(mut previous) = output
                        .0
                        .as_object_mut()
                        .unwrap()
                        .insert(std::mem::take(field), std::mem::take(&mut value.0))
                    {
                        wipe_json(&mut previous);
                    }
                }
                Ok(output)
            }
        }
        deserializer.deserialize_any(Visitor)
    }
}
