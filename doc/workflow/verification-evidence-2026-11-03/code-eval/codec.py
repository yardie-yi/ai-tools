def encode(text: str) -> bytes:
    payload = text.encode('utf-8')
    if len(payload) > 65535:
        raise ValueError('payload exceeds 65535 bytes')
    return len(text).to_bytes(2, 'big') + payload
