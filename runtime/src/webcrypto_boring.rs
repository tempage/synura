//! BoringSSL operations not exposed by the `boring2` safe wrappers.
//!
//! Keep ownership of native contexts and transferred OAEP labels here. The
//! Web Crypto layer validates algorithm names, key usages, and extractability.

use std::marker::PhantomData;
use std::ptr::{self, NonNull};

use boring2::error::ErrorStack;
use boring2::hash::MessageDigest;
use boring2::pkey::{HasPublic, Id, PKey, PKeyRef, Private, Public};
use boring_sys as ffi;
use foreign_types::{ForeignType, ForeignTypeRef};
use zeroize::Zeroizing;

pub(super) fn raw_public_key(id: Id, bytes: &[u8]) -> Result<PKey<Public>, ErrorStack> {
    ffi::init();
    // SAFETY: BoringSSL copies the live input and returns a uniquely owned key.
    let key = unsafe {
        ffi::EVP_PKEY_new_raw_public_key(id.as_raw(), ptr::null_mut(), bytes.as_ptr(), bytes.len())
    };
    if key.is_null() {
        Err(ErrorStack::get())
    } else {
        Ok(unsafe { PKey::from_ptr(key) })
    }
}

pub(super) fn raw_private_key(id: Id, bytes: &[u8]) -> Result<PKey<Private>, ErrorStack> {
    ffi::init();
    // SAFETY: BoringSSL copies the live seed/scalar and owns its private storage.
    let key = unsafe {
        ffi::EVP_PKEY_new_raw_private_key(id.as_raw(), ptr::null_mut(), bytes.as_ptr(), bytes.len())
    };
    if key.is_null() {
        Err(ErrorStack::get())
    } else {
        Ok(unsafe { PKey::from_ptr(key) })
    }
}

pub(super) fn hmac(digest: MessageDigest, key: &[u8], data: &[u8]) -> Result<Vec<u8>, ErrorStack> {
    let mut output = Zeroizing::new([0u8; ffi::EVP_MAX_MD_SIZE as usize]);
    let mut length = 0;
    // SAFETY: The input slices remain live for this call. EVP_MAX_MD_SIZE is
    // sufficient for every digest supported by HMAC, and `length` is writable.
    let result = unsafe {
        ffi::HMAC(
            digest.as_ptr(),
            key.as_ptr().cast(),
            key.len(),
            data.as_ptr(),
            data.len(),
            output.as_mut_ptr(),
            &mut length,
        )
    };
    if result.is_null() || length as usize > output.len() {
        return Err(ErrorStack::get());
    }
    Ok(output[..length as usize].to_vec())
}

pub(super) fn encrypt_oaep(
    key: &PKeyRef<Public>,
    digest: MessageDigest,
    label: &[u8],
    data: &[u8],
) -> Result<Vec<u8>, ErrorStack> {
    oaep(key, digest, label, data, true)
}

pub(super) fn decrypt_oaep(
    key: &PKeyRef<Private>,
    digest: MessageDigest,
    label: &[u8],
    data: &[u8],
) -> Result<Vec<u8>, ErrorStack> {
    oaep(key, digest, label, data, false)
}

struct OaepContext<'key> {
    pointer: NonNull<ffi::EVP_PKEY_CTX>,
    _key: PhantomData<&'key ()>,
}

impl<'key> OaepContext<'key> {
    fn new<T: HasPublic>(key: &'key PKeyRef<T>) -> Result<Self, ErrorStack> {
        // SAFETY: `key` is a live BoringSSL key and is kept borrowed for the
        // context lifetime. The returned context is owned by this wrapper.
        let pointer = unsafe { ffi::EVP_PKEY_CTX_new(key.as_ptr(), ptr::null_mut()) };
        Ok(Self {
            pointer: NonNull::new(pointer).ok_or_else(ErrorStack::get)?,
            _key: PhantomData,
        })
    }
}

impl Drop for OaepContext<'_> {
    fn drop(&mut self) {
        // SAFETY: This wrapper uniquely owns the context. BoringSSL also frees
        // any label transferred to it by EVP_PKEY_CTX_set0_rsa_oaep_label.
        unsafe { ffi::EVP_PKEY_CTX_free(self.pointer.as_ptr()) };
    }
}

fn check(result: i32) -> Result<(), ErrorStack> {
    if result == 1 {
        Ok(())
    } else {
        Err(ErrorStack::get())
    }
}

fn oaep<T: HasPublic>(
    key: &PKeyRef<T>,
    digest: MessageDigest,
    label: &[u8],
    data: &[u8],
    encrypt: bool,
) -> Result<Vec<u8>, ErrorStack> {
    let context = OaepContext::new(key)?;
    let pointer = context.pointer.as_ptr();
    // SAFETY: `context` owns a live EVP_PKEY_CTX throughout all calls. Digest
    // pointers come from BoringSSL's static descriptors. The public entry points
    // restrict decryption to private keys and encryption to public keys.
    unsafe {
        check(if encrypt {
            ffi::EVP_PKEY_encrypt_init(pointer)
        } else {
            ffi::EVP_PKEY_decrypt_init(pointer)
        })?;
        check(ffi::EVP_PKEY_CTX_set_rsa_padding(
            pointer,
            ffi::RSA_PKCS1_OAEP_PADDING,
        ))?;
        check(ffi::EVP_PKEY_CTX_set_rsa_oaep_md(pointer, digest.as_ptr()))?;
        check(ffi::EVP_PKEY_CTX_set_rsa_mgf1_md(pointer, digest.as_ptr()))?;
        if !label.is_empty() {
            // `set0` takes ownership only on success. Allocate with BoringSSL's
            // allocator so the context can free the label using OPENSSL_free.
            let owned_label = ffi::OPENSSL_memdup(label.as_ptr().cast(), label.len());
            if owned_label.is_null() {
                return Err(ErrorStack::get());
            }
            let result =
                ffi::EVP_PKEY_CTX_set0_rsa_oaep_label(pointer, owned_label.cast(), label.len());
            if result != 1 {
                ffi::OPENSSL_free(owned_label);
                return Err(ErrorStack::get());
            }
        }
    }

    let operation = if encrypt {
        ffi::EVP_PKEY_encrypt
    } else {
        ffi::EVP_PKEY_decrypt
    };
    let mut length = 0;
    // SAFETY: A null output queries the required capacity without writing data.
    // Both the input bytes and the output length pointer are valid for the call.
    check(unsafe {
        operation(
            pointer,
            ptr::null_mut(),
            &mut length,
            data.as_ptr(),
            data.len(),
        )
    })?;
    let mut output = Zeroizing::new(Vec::new());
    output
        .try_reserve_exact(length)
        .map_err(|_| ErrorStack::get())?;
    output.resize(length, 0);
    // SAFETY: The buffer has the capacity reported by the same configured
    // context, and `length` communicates that writable capacity to BoringSSL.
    check(unsafe {
        operation(
            pointer,
            output.as_mut_ptr(),
            &mut length,
            data.as_ptr(),
            data.len(),
        )
    })?;
    if length > output.len() {
        return Err(ErrorStack::get());
    }
    // The temporary is cleared on success and on every failure, including an
    // OAEP authentication failure after the native function wrote to it.
    Ok(output[..length].to_vec())
}
