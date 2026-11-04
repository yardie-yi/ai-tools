import unittest
from codec import encode

class CodecTests(unittest.TestCase):
    def test_ascii(self):
        self.assertEqual(encode('OK'), b'\x00\x02OK')
    def test_empty(self):
        self.assertEqual(encode(''), b'\x00\x00')
    def test_limit(self):
        self.assertEqual(len(encode('x' * 65535)), 65537)
    def test_over_limit(self):
        with self.assertRaises(ValueError):
            encode('x' * 65536)
