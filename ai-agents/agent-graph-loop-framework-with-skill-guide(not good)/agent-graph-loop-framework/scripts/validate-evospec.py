#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    print("[ERROR] PyYAML is required: python -m pip install pyyaml", file=sys.stderr)
    raise SystemExit(2)

EXPECTED_REFERENCES = {
    "debug-commands.md",
    "env-setup.md",
    "project-info.md",
    "us-board-deploy.md",
    "us-bug-fix.md",
    "us-build.md",
    "us-code-analysis.md",
    "us-feature-dev.md",
    "us-git-submit.md",
    "us-requirements.md",
    "us-rules.md",
}
EXPECTED_TOP_LEVEL = {
    "schema_version", "module", "paths", "work_item", "architecture", "build",
    "artifacts", "deploy", "debug", "git", "development", "code_analysis", "templating"
}


def load_yaml(path: Path) -> Any:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def walk(value: Any, path: str = ""):
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}" if path else str(key)
            yield from walk(child, child_path)
    elif isinstance(value, list):
        for idx, child in enumerate(value):
            yield from walk(child, f"{path}[{idx}]")
    else:
        yield path, value


def frontmatter(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError("missing YAML frontmatter")
    end = text.find("\n---\n", 4)
    if end < 0:
        raise ValueError("unterminated YAML frontmatter")
    data = yaml.safe_load(text[4:end])
    if not isinstance(data, dict):
        raise ValueError("frontmatter must be a mapping")
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate portable model-skill and .evospec configuration")
    parser.add_argument("--strict", action="store_true", help="fail when unresolved markers remain")
    parser.add_argument("--root", type=Path, help="framework/project root")
    args = parser.parse_args()

    root = args.root.resolve() if args.root else Path(__file__).resolve().parents[1]
    config_path = root / ".evospec/module.config.yaml"
    refs_dir = root / ".agent/skills/model-skill/references"
    rules_dir = root / ".evospec/rules"
    errors: list[str] = []
    warnings: list[str] = []

    if not config_path.exists():
        errors.append(f"missing config: {config_path.relative_to(root)}")
        config: dict[str, Any] = {}
    else:
        try:
            loaded = load_yaml(config_path)
            if not isinstance(loaded, dict):
                raise ValueError("root must be a mapping")
            config = loaded
        except Exception as exc:
            errors.append(f"invalid YAML {config_path.relative_to(root)}: {exc}")
            config = {}

    if config:
        if config.get("schema_version") != 2:
            errors.append(f"unsupported schema_version: {config.get('schema_version')!r}; expected 2")
        missing_sections = sorted(EXPECTED_TOP_LEVEL - set(config))
        if missing_sections:
            errors.append(f"missing config sections: {missing_sections}")
        markers = set(str(x) for x in config.get("templating", {}).get("unresolved_markers", []))
        markers.update({"REQUIRED", "PLACEHOLDER", "TODO_CONFIG"})
        unresolved = []
        for dotted, value in walk(config):
            if dotted.startswith('templating.unresolved_markers'):
                continue
            if isinstance(value, str) and any(marker and marker in value for marker in markers):
                unresolved.append(dotted)
        if unresolved:
            message = "unresolved configuration fields: " + ", ".join(unresolved)
            (errors if args.strict else warnings).append(message)

        artifacts = {
            item.get("id") for item in config.get("artifacts", [])
            if isinstance(item, dict) and item.get("id")
        }
        scenarios = config.get("deploy", {}).get("scenarios", {})
        if isinstance(scenarios, dict):
            for sid, spec in scenarios.items():
                if isinstance(spec, dict) and spec.get("artifact_id") not in artifacts:
                    errors.append(f"deploy.scenarios.{sid}.artifact_id does not match an artifact")

    if not refs_dir.exists():
        errors.append(f"missing references directory: {refs_dir.relative_to(root)}")
    else:
        actual = {p.name for p in refs_dir.glob("*.md")}
        if actual != EXPECTED_REFERENCES:
            errors.append(
                "reference set mismatch: missing=" + str(sorted(EXPECTED_REFERENCES - actual))
                + " extra=" + str(sorted(actual - EXPECTED_REFERENCES))
            )

    index_path = rules_dir / "INDEX.md"
    if not index_path.exists():
        errors.append("missing .evospec/rules/INDEX.md")
    else:
        index_text = index_path.read_text(encoding="utf-8")
        indexed: dict[str, tuple[str, str]] = {}
        for line in index_text.splitlines():
            match = re.match(r"\|\s*(R\d+)\s*\|.*?\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?\.md)\s*\|", line)
            if match:
                rid, applies, status, filename = match.groups()
                indexed[rid] = (status.strip(), filename.strip())
        for rule_path in sorted(rules_dir.glob("R*.md")):
            try:
                meta = frontmatter(rule_path)
            except Exception as exc:
                errors.append(f"invalid rule {rule_path.name}: {exc}")
                continue
            rid = str(meta.get("id", ""))
            status = str(meta.get("status", ""))
            if rid not in indexed:
                errors.append(f"rule not listed in INDEX.md: {rule_path.name}")
                continue
            index_status, index_file = indexed[rid]
            if index_file != rule_path.name:
                errors.append(f"INDEX filename mismatch for {rid}: {index_file} != {rule_path.name}")
            expected_label = "enabled" if status == "enabled" else "disabled"
            if expected_label not in index_status:
                errors.append(f"INDEX status mismatch for {rid}: frontmatter={status}, index={index_status}")

    skill_root = root / ".agent/skills/model-skill"
    for path in skill_root.rglob("*.md") if skill_root.exists() else []:
        if ".codex/skills/model-skill" in path.read_text(encoding="utf-8"):
            errors.append(f"stale source path in {path.relative_to(root)}")

    if warnings:
        print("EvoSpec validation: WARN")
        for warning in warnings:
            print(f"- {warning}")
    if errors:
        print("EvoSpec validation: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    if not warnings:
        print("EvoSpec validation: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
