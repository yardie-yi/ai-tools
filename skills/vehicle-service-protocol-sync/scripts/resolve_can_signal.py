#!/usr/bin/env python3
"""将 T28 CAN 信号解析为生成器使用的零基成员序号和类型。"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


MEMBER_RE = re.compile(
    r"^\s*(u?int(?:8|16|32|64)_t|float|double|bool)\s+([A-Za-z_]\w*)\s*;",
    re.MULTILINE,
)


def parse_can_id(raw: str) -> int:
    try:
        value = int(raw, 0)
    except ValueError as exc:
        raise ValueError(f"CAN ID 格式无效：{raw!r}") from exc
    if not 0 <= value <= 0x7FF:
        raise ValueError(f"CAN ID 超出 11 位范围：{raw!r}")
    return value


def load_members(can_dir: Path, can_id: int) -> tuple[Path, list[tuple[str, str]]]:
    header = can_dir / f"CAN_T28_0x{can_id:X}.h"
    try:
        text = header.read_text(encoding="utf-8-sig")
    except OSError as exc:
        raise ValueError(f"无法读取 CAN 头文件：{header}") from exc
    body = re.search(
        rf"struct\s+CAN_T28_0x{can_id:X}\s*\{{(.*?)\}};", text, re.DOTALL | re.IGNORECASE
    )
    if body is None:
        raise ValueError(f"在 {header} 中未找到 CAN 结构体")
    members = MEMBER_RE.findall(body.group(1))
    if not members:
        raise ValueError(f"在 {header} 中未找到支持的基础类型成员")
    return header, members


def main() -> int:
    parser = argparse.ArgumentParser(
        description="从 CAN_T28_0x<ID>.h 解析信号的零基 Number 和 C++ 类型"
    )
    parser.add_argument("--can-dir", required=True, type=Path, help="包含 CAN_T28_0x*.h 的目录")
    parser.add_argument("--can-id", required=True, help="CAN ID，例如 0x430")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--signal", help="精确的信号或成员名称")
    group.add_argument("--list", action="store_true", help="按声明顺序列出所有支持的成员")
    args = parser.parse_args()

    try:
        can_id = parse_can_id(args.can_id)
        header, members = load_members(args.can_dir, can_id)
        records = [
            {
                "can_id": f"0x{can_id:X}",
                "header": header.name,
                "number": index,
                "number_hex": f"0x{index:02X}",
                "cpp_type": cpp_type,
                "signal": signal,
            }
            for index, (cpp_type, signal) in enumerate(members)
        ]
        if args.list:
            result: object = records
        else:
            exact = [record for record in records if record["signal"] == args.signal]
            if len(exact) != 1:
                candidates = [record["signal"] for record in records]
                raise ValueError(
                    f"信号 {args.signal!r} 在 {header.name} 中未唯一匹配；"
                    f"可用信号={candidates}"
                )
            result = exact[0]
    except ValueError as exc:
        print(f"错误：{exc}", file=sys.stderr)
        return 2

    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
