// @ts-nocheck
// The ES2018 build uses the host BigInt constructor without BigInt literals.
// RSAES-PKCS1-v1_5 public encryption for protocols that require this encoding.
// Uses standard JavaScript BigInt and crypto.getRandomValues; no BigInt literals.
// Modulus: 512..16384 bits. Exponent: odd, 3..2^32-1. Inputs are hexadecimal
// integers without a 0x prefix. Only public-key operations are implemented.
function rsaPkcs1Encrypt(plaintext, modulusHex, exponentHex) {
  if (typeof BigInt !== 'function') throw new Error('BigInt is required');
  if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
    throw new Error('crypto.getRandomValues is required');
  }
  function normalizedHex(value, label) {
    if (typeof value !== 'string' || value.length > 8192 || !/^[0-9a-f]+$/i.test(value)) {
      throw new TypeError('Invalid RSA ' + label + ' hexadecimal integer');
    }
    const normalized = value.replace(/^0+/, '');
    if (!normalized) throw new RangeError('RSA ' + label + ' must be positive');
    return normalized;
  }
  const modulus = normalizedHex(modulusHex, 'modulus');
  const exponent = normalizedHex(exponentHex, 'exponent');
  const firstDigit = parseInt(modulus.charAt(0), 16);
  const modulusBits = (modulus.length - 1) * 4 + (32 - Math.clz32(firstDigit));
  if (modulusBits < 512 || modulusBits > 16384) {
    throw new RangeError('RSA modulus must contain 512 through 16384 bits');
  }
  if (exponent.length > 8) throw new RangeError('RSA exponent exceeds 32 bits');
  const zero = BigInt(0), one = BigInt(1), two = BigInt(2), byteMask = BigInt(255);
  const n = BigInt('0x' + modulus), e = BigInt('0x' + exponent);
  if ((n & one) !== one || e < BigInt(3) || (e & one) !== one || e >= n) {
    throw new RangeError('Invalid RSA modulus or exponent');
  }

  let bytes;
  if (plaintext instanceof ArrayBuffer) bytes = new Uint8Array(plaintext);
  else if (ArrayBuffer.isView(plaintext)) {
    bytes = new Uint8Array(plaintext.buffer, plaintext.byteOffset, plaintext.byteLength);
  } else throw new TypeError('RSA plaintext must be a BufferSource');
  const size = Math.ceil(modulusBits / 8);
  if (bytes.byteLength > size - 11) throw new RangeError('RSA plaintext is too long');
  const paddingLength = size - bytes.byteLength - 3;
  if (paddingLength < 8) throw new RangeError('RSA padding must contain at least eight bytes');
  const encoded = new Uint8Array(size);
  const random = new Uint8Array(Math.min(paddingLength, 256));
  try {
    encoded[1] = 2;
    let written = 0, rounds = 0;
    const maxRounds = Math.ceil(paddingLength / random.length) * 4 + 8;
    while (written < paddingLength) {
      if (++rounds > maxRounds) throw new Error('Random source did not provide nonzero padding');
      globalThis.crypto.getRandomValues(random);
      for (let i = 0; i < random.length && written < paddingLength; i++) {
        if (random[i] !== 0) encoded[2 + written++] = random[i];
      }
    }
    // The separator stays zero; copy only the requested BufferSource subview.
    encoded.set(bytes, paddingLength + 3);
    let message = zero;
    for (let i = 0; i < encoded.length; i++) message = (message << BigInt(8)) | BigInt(encoded[i]);
    if (message >= n) throw new RangeError('Encoded RSA plaintext exceeds the modulus');
    let result = one, base = message, power = e;
    while (power > zero) {
      if ((power & one) === one) result = (result * base) % n;
      power /= two;
      if (power > zero) base = (base * base) % n;
    }
    const ciphertext = new Uint8Array(size);
    for (let i = size - 1; i >= 0; i--) {
      ciphertext[i] = Number(result & byteMask);
      result >>= BigInt(8);
    }
    return ciphertext;
  } finally {
    encoded.fill(0);
    random.fill(0);
  }
}
