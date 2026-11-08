"""Offline RSA compatibility tests using newly generated synthetic keys only.

Run: python3 -m unittest discover -s testdata/community_common -p 'test_crypto_compat.py'
Requires Node, tsc, and a built synurart (or SYNURART_BIN). No external crypto
Python package, account, production extension, saved key, or network is used.
"""
import base64
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
RUNTIME = Path(os.environ.get('SYNURART_BIN', ROOT / 'target/debug/synurart')).resolve()


def node_json(source, value=None):
    completed = subprocess.run(
        ['node', '-e', source], input=json.dumps(value), capture_output=True,
        text=True, check=True, timeout=30,
    )
    return json.loads(completed.stdout)


class RsaPkcs1CompatibilityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.compilation = tempfile.TemporaryDirectory(prefix='synura-rsa-compile-')
        cls.addClassCleanup(cls.compilation.cleanup)
        bundle = Path(cls.compilation.name) / 'rsa.js'
        subprocess.run([
            'tsc', '--target', 'ES2018', '--module', 'none', '--lib', 'ES2018,DOM',
            '--skipLibCheck', '--noEmitOnError', '--outFile', str(bundle),
            str(ROOT / 'extensions/lib/rsa_pkcs1.ts'),
        ], check=True, capture_output=True, text=True, timeout=30)
        cls.bundle = bundle.read_text()
        cls.keys = node_json(r'''
const crypto = require('crypto');
const keys = [{modulusLength:1024,publicExponent:3},
              {modulusLength:2048,publicExponent:65537}].map(options => {
    const pair = crypto.generateKeyPairSync('rsa', options);
    const jwk = pair.publicKey.export({format:'jwk'});
    return {
        modulus:Buffer.from(jwk.n,'base64url').toString('hex'),
        exponent:Buffer.from(jwk.e,'base64url').toString('hex'),
        privateKey:pair.privateKey.export({format:'pem',type:'pkcs8'}),
        bytes:options.modulusLength / 8
    };
});
process.stdout.write(JSON.stringify(keys));
''')

    def evaluate(self, body, key=None):
        key = key or self.keys[1]
        source = self.bundle + '\nvar SYNURA={name:"rsa_compat_test",domain:"example.test",main:{}};\n'
        source += 'fetch=function(){throw new Error("Unexpected network request");};\n'
        source += 'var __cryptoResult=(function(){\n'
        source += 'const modulus=' + json.dumps(key['modulus']) + ';\n'
        source += 'const exponent=' + json.dumps(key['exponent']) + ';\n'
        source += 'const hex=bytes=>Array.from(bytes,n=>n.toString(16).padStart(2,"0")).join("");\n'
        source += 'const rejected=call=>{try{call();return "accepted";}catch(error){return error.name;}};\n'
        source += body + '\n})();\n'
        with tempfile.TemporaryDirectory(prefix='synura-rsa-case-') as directory:
            script = Path(directory) / 'case.js'
            script.write_text(source)
            completed = subprocess.run(
                [str(RUNTIME), '-json', '-no-home', '-proxy', 'http://127.0.0.1:9', '-ext', str(script)],
                input='eval JSON.stringify(__cryptoResult)\nquit\n', cwd=directory,
                capture_output=True, text=True, check=True, timeout=30,
            )
        events = [json.loads(line) for line in completed.stdout.splitlines() if line.startswith('{')]
        self.assertFalse([event for event in events if event.get('type') == 'error'], completed.stderr)
        values = [event['result'] for event in events if event.get('type') == 'eval']
        self.assertEqual(len(values), 1, completed.stdout + completed.stderr)
        return json.loads(values[0])

    def decode_with_node(self, ciphertexts, key=None):
        key = key or self.keys[1]
        # Raw private RSA is available even when OpenSSL disables PKCS#1 v1.5
        # privateDecrypt. Validate the RFC 8017 encoded block independently.
        return node_json(r'''
const fs=require('fs'), crypto=require('crypto');
const input=JSON.parse(fs.readFileSync(0,'utf8'));
const output=input.ciphertexts.map(hex => {
    const ciphertext=Buffer.from(hex,'hex');
    const block=crypto.privateDecrypt({key:input.privateKey,padding:crypto.constants.RSA_NO_PADDING},ciphertext);
    const separator=block.indexOf(0,2);
    return {
        ciphertextBytes:ciphertext.length,
        blockBytes:block.length,
        prefix:Array.from(block.subarray(0,2)),
        paddingBytes:separator-2,
        nonzeroPadding:separator>=10 && block.subarray(2,separator).every(byte=>byte!==0),
        message:block.subarray(separator+1).toString('base64')
    };
});
process.stdout.write(JSON.stringify(output));
''', {'privateKey': key['privateKey'], 'ciphertexts': ciphertexts})

    def assert_encoded_message(self, decoded, message, key=None):
        key = key or self.keys[1]
        self.assertEqual(decoded['ciphertextBytes'], key['bytes'])
        self.assertEqual(decoded['blockBytes'], key['bytes'])
        self.assertEqual(decoded['prefix'], [0, 2])
        self.assertGreaterEqual(decoded['paddingBytes'], 8)
        self.assertTrue(decoded['nonzeroPadding'])
        self.assertEqual(base64.b64decode(decoded['message']), message)

    def test_quickjs_ciphertexts_are_valid_for_independent_private_rsa(self):
        for key in self.keys:
            with self.subTest(bits=key['bytes'] * 8, exponent=key['exponent']):
                ciphertexts = self.evaluate('''
const bytes=new Uint8Array([0,1,127,128,255,0,42]);
const result=rsaPkcs1Encrypt(bytes.buffer,modulus,exponent);
return {typed:result instanceof Uint8Array,hex:hex(result)};
''', key)
                self.assertTrue(ciphertexts['typed'])
                decoded = self.decode_with_node([ciphertexts['hex']], key)[0]
                self.assert_encoded_message(decoded, bytes([0, 1, 127, 128, 255, 0, 42]), key)

    def test_typed_array_and_dataview_subviews_preserve_byte_ranges(self):
        ciphertexts = self.evaluate('''
const backing=new Uint8Array([99,10,0,20,255,88]);
const typed=backing.subarray(1,5);
const view=new DataView(backing.buffer,2,3);
return [hex(rsaPkcs1Encrypt(typed,modulus,exponent)),
        hex(rsaPkcs1Encrypt(view,modulus,exponent))];
''')
        decoded = self.decode_with_node(ciphertexts)
        self.assert_encoded_message(decoded[0], bytes([10, 0, 20, 255]))
        self.assert_encoded_message(decoded[1], bytes([0, 20, 255]))

    def test_empty_and_maximum_messages_and_oversize_rejection(self):
        maximum = self.keys[1]['bytes'] - 11
        actual = self.evaluate('''
const maximum=modulus.length/2-11;
const bytes=Uint8Array.from({length:maximum},(_,index)=>index%256);
return {empty:hex(rsaPkcs1Encrypt(new Uint8Array(),modulus,exponent)),
        full:hex(rsaPkcs1Encrypt(bytes,modulus,exponent)),
        oversized:rejected(()=>rsaPkcs1Encrypt(new Uint8Array(maximum+1),modulus,exponent))};
''')
        self.assertEqual(actual['oversized'], 'RangeError')
        decoded = self.decode_with_node([actual['empty'], actual['full']])
        self.assert_encoded_message(decoded[0], b'')
        self.assert_encoded_message(decoded[1], bytes(index % 256 for index in range(maximum)))
        self.assertEqual(decoded[1]['paddingBytes'], 8)

    def test_random_padding_produces_distinct_valid_ciphertexts(self):
        ciphertexts = self.evaluate('''
const input=new TextEncoder().encode('synthetic public encryption');
return Array.from({length:4},()=>hex(rsaPkcs1Encrypt(input,modulus,exponent)));
''')
        self.assertEqual(len(set(ciphertexts)), len(ciphertexts))
        for decoded in self.decode_with_node(ciphertexts):
            self.assert_encoded_message(decoded, b'synthetic public encryption')

    def test_invalid_keys_and_plaintexts_fail_before_encryption(self):
        actual = self.evaluate('''
const bytes=new Uint8Array([1]);
return {
    stringInput:rejected(()=>rsaPkcs1Encrypt('text',modulus,exponent)),
    nullInput:rejected(()=>rsaPkcs1Encrypt(null,modulus,exponent)),
    invalidHex:rejected(()=>rsaPkcs1Encrypt(bytes,'not-hex',exponent)),
    prefixedHex:rejected(()=>rsaPkcs1Encrypt(bytes,'0x'+modulus,exponent)),
    emptyModulus:rejected(()=>rsaPkcs1Encrypt(bytes,'',exponent)),
    zeroModulus:rejected(()=>rsaPkcs1Encrypt(bytes,'00',exponent)),
    smallModulus:rejected(()=>rsaPkcs1Encrypt(bytes,'ff',exponent)),
    largeModulus:rejected(()=>rsaPkcs1Encrypt(bytes,'f'.repeat(4097),exponent)),
    evenModulus:rejected(()=>rsaPkcs1Encrypt(bytes,modulus.slice(0,-1)+'0',exponent)),
    zeroExponent:rejected(()=>rsaPkcs1Encrypt(bytes,modulus,'00')),
    oneExponent:rejected(()=>rsaPkcs1Encrypt(bytes,modulus,'01')),
    evenExponent:rejected(()=>rsaPkcs1Encrypt(bytes,modulus,'02')),
    largeExponent:rejected(()=>rsaPkcs1Encrypt(bytes,modulus,'100000001')),
    malformedExponent:rejected(()=>rsaPkcs1Encrypt(bytes,modulus,'xyz'))
};
''')
        for name, error in actual.items():
            with self.subTest(case=name):
                expected = 'TypeError' if name in {
                    'stringInput', 'nullInput', 'invalidHex', 'prefixedHex',
                    'emptyModulus', 'malformedExponent',
                } else 'RangeError'
                self.assertEqual(error, expected)

    def test_zero_random_source_fails_with_a_bounded_number_of_calls(self):
        actual = self.evaluate('''
const original=crypto.getRandomValues;
let calls=0;
try {
    crypto.getRandomValues=array=>{calls++;array.fill(0);return array;};
    return {error:rejected(()=>rsaPkcs1Encrypt(new Uint8Array([1]),modulus,exponent)),calls};
} finally {crypto.getRandomValues=original;}
''')
        self.assertEqual(actual['error'], 'Error')
        self.assertGreater(actual['calls'], 0)
        self.assertLess(actual['calls'], 32)


if __name__ == '__main__':
    unittest.main()
