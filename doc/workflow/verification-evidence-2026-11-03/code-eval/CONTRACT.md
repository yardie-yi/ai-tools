# 消息编码契约

目标运行时 Python 3.11+。encode(text: str) 返回 bytes。
帧格式：2 字节 unsigned big-endian 载荷长度，后跟 text 的 UTF-8 字节。
长度字段表示字节数量。空字符串有效；载荷最大 65535 字节，超过时抛 ValueError。
当前只要求主机验收；目标板未连接，本轮不要求上板。
