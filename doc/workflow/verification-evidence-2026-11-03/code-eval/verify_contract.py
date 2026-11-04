"""Independent acceptance checks derived from CONTRACT.md, without changing inputs."""
import unittest
from codec import encode


class ContractAcceptanceTests(unittest.TestCase):
    def test_result_is_bytes(self):
        self.assertIsInstance(encode('中'), bytes)

    def test_payload_is_utf8(self):
        self.assertEqual(encode('A中😀')[2:], b'A\xe4\xb8\xad\xf0\x9f\x98\x80')

    def test_empty_frame(self):
        self.assertEqual(encode(''), b'\x00\x00')

    def test_unsigned_big_endian_header(self):
        self.assertEqual(encode('x' * 258)[:2], b'\x01\x02')

    def test_chinese_byte_length(self):
        self.assertEqual(encode('中'), b'\x00\x03\xe4\xb8\xad')

    def test_astral_byte_length(self):
        self.assertEqual(encode('😀'), b'\x00\x04\xf0\x9f\x98\x80')

    def test_mixed_byte_length(self):
        self.assertEqual(encode('A中😀')[:2], b'\x00\x08')

    def test_ascii_maximum(self):
        result = encode('x' * 65535)
        self.assertEqual(result[:2], b'\xff\xff')
        self.assertEqual(len(result), 65537)

    def test_unicode_maximum(self):
        result = encode('中' * 21845)
        self.assertEqual(len(result), 65537)
        self.assertEqual(result[:2], b'\xff\xff')

    def test_ascii_over_maximum(self):
        with self.assertRaises(ValueError):
            encode('x' * 65536)

    def test_unicode_over_maximum(self):
        with self.assertRaises(ValueError):
            encode('😀' * 16384)


if __name__ == '__main__':
    unittest.main(verbosity=2)
