#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    print("[ERROR] PyYAML is required: python -m pip install pyyaml", file=sys.stderr)
    raise SystemExit(2)

SKILL_ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
ROOT_PATH_FIELDS = (
    "entry",
    "usage",
    "readme",
    "grader",
    "project_config",
    "rules_index",
    "references_root",
)


def load_yaml(path: Path) -> Any:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def parse_frontmatter(path: Path) -> dict[str, Any]:
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


def as_mapping(value: Any, label: str, errors: list[str]) -> dict[str, Any]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        errors.append(f"{label} must be a mapping")
        return {}
    return value


def as_reference_list(value: Any, label: str, errors: list[str]) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list) and all(isinstance(item, str) for item in value):
        return value
    errors.append(f"{label} must be a string or a list of strings")
    return []


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate .agent/skills registry and central Skill packages")
    parser.add_argument("--root", type=Path, help="framework/project root")
    args = parser.parse_args()

    root = args.root.resolve() if args.root else Path(__file__).resolve().parents[1]
    registry_path = root / ".agent/skills/registry.yaml"
    router_path = root / ".agent/router.yaml"
    errors: list[str] = []
    warnings: list[str] = []

    if not registry_path.exists():
        print("Skill validation: FAIL")
        print("- missing .agent/skills/registry.yaml")
        return 1

    try:
        registry = load_yaml(registry_path)
    except Exception as exc:
        print("Skill validation: FAIL")
        print(f"- invalid registry YAML: {exc}")
        return 1

    if not isinstance(registry, dict):
        print("Skill validation: FAIL")
        print("- registry root must be a mapping")
        return 1

    skills = as_mapping(registry.get("skills"), "skills", errors)
    default_skill = registry.get("default_skill")
    if not isinstance(default_skill, str) or not default_skill:
        errors.append("default_skill must be a non-empty string")
    elif default_skill not in skills:
        errors.append(f"default_skill is not registered: {default_skill}")

    graph_ids: set[str] = set()
    if router_path.exists():
        try:
            router = load_yaml(router_path)
            if isinstance(router, dict):
                rules = router.get("rules", [])
                if isinstance(rules, list):
                    for item in rules:
                        if isinstance(item, dict) and isinstance(item.get("graph"), str):
                            graph_ids.add(item["graph"])
        except Exception as exc:
            errors.append(f"cannot parse .agent/router.yaml: {exc}")
    else:
        errors.append("missing .agent/router.yaml")

    route_owners: dict[str, list[str]] = defaultdict(list)

    for skill_id, raw_spec in skills.items():
        label = f"skills.{skill_id}"
        if not isinstance(skill_id, str) or not SKILL_ID_RE.fullmatch(skill_id):
            errors.append(f"invalid Skill ID {skill_id!r}; use lowercase kebab-case")
            continue
        spec = as_mapping(raw_spec, label, errors)
        entry_value = spec.get("entry")
        if not isinstance(entry_value, str) or not entry_value:
            errors.append(f"{label}.entry is required")
            continue

        entry_path = root / entry_value
        expected_root = root / ".agent/skills" / skill_id
        if not entry_path.exists():
            errors.append(f"missing {label}.entry: {entry_value}")
            skill_root = expected_root
        else:
            skill_root = entry_path.parent
            try:
                entry_path.resolve().relative_to(expected_root.resolve())
            except ValueError:
                errors.append(
                    f"{label}.entry must be inside .agent/skills/{skill_id}/; got {entry_value}"
                )

            try:
                meta = parse_frontmatter(entry_path)
            except Exception as exc:
                errors.append(f"invalid frontmatter in {entry_value}: {exc}")
            else:
                if meta.get("name") != skill_id:
                    errors.append(
                        f"frontmatter name mismatch in {entry_value}: {meta.get('name')!r} != {skill_id!r}"
                    )
                description = meta.get("description")
                if not isinstance(description, str) or len(description.strip()) < 12:
                    errors.append(f"frontmatter description is missing or too vague in {entry_value}")

        for field in ROOT_PATH_FIELDS:
            value = spec.get(field)
            if value is None:
                continue
            if not isinstance(value, str) or not value:
                errors.append(f"{label}.{field} must be a non-empty project-root-relative path")
                continue
            candidate = Path(value)
            if candidate.is_absolute():
                errors.append(f"{label}.{field} must be project-root-relative: {value}")
                continue
            path = root / candidate
            try:
                path.resolve().relative_to(root.resolve())
            except ValueError:
                errors.append(f"{label}.{field} escapes the project root: {value}")
                continue
            if not path.exists():
                errors.append(f"missing {label}.{field}: {value}")

        graph_bindings = as_mapping(spec.get("graph_bindings"), f"{label}.graph_bindings", errors)
        for graph_id, raw_refs in graph_bindings.items():
            if graph_ids and graph_id not in graph_ids:
                errors.append(f"{label}.graph_bindings references unknown graph: {graph_id}")
            refs = as_reference_list(raw_refs, f"{label}.graph_bindings.{graph_id}", errors)
            for ref in refs:
                ref_candidate = Path(ref)
                if ref_candidate.is_absolute():
                    errors.append(f"reference must be Skill-root-relative for {label}.graph_bindings.{graph_id}: {ref}")
                    continue
                ref_path = skill_root / ref_candidate
                try:
                    ref_path.resolve().relative_to(skill_root.resolve())
                except ValueError:
                    errors.append(f"reference escapes Skill root for {label}.graph_bindings.{graph_id}: {ref}")
                    continue
                if not ref_path.exists():
                    errors.append(f"missing reference for {label}.graph_bindings.{graph_id}: {ref}")

        auxiliary_routes = as_mapping(spec.get("auxiliary_routes"), f"{label}.auxiliary_routes", errors)
        for route_id, raw_ref in auxiliary_routes.items():
            if not isinstance(route_id, str) or not SKILL_ID_RE.fullmatch(route_id):
                errors.append(f"invalid auxiliary route {route_id!r} in {label}; use kebab-case")
            route_owners[str(route_id)].append(skill_id)
            refs = as_reference_list(raw_ref, f"{label}.auxiliary_routes.{route_id}", errors)
            for ref in refs:
                ref_candidate = Path(ref)
                if ref_candidate.is_absolute():
                    errors.append(f"reference must be Skill-root-relative for {label}.auxiliary_routes.{route_id}: {ref}")
                    continue
                ref_path = skill_root / ref_candidate
                try:
                    ref_path.resolve().relative_to(skill_root.resolve())
                except ValueError:
                    errors.append(f"reference escapes Skill root for {label}.auxiliary_routes.{route_id}: {ref}")
                    continue
                if not ref_path.exists():
                    errors.append(f"missing reference for {label}.auxiliary_routes.{route_id}: {ref}")

        if skill_root.exists():
            expected_dir_name = skill_root.name
            if expected_dir_name != skill_id:
                errors.append(
                    f"Skill directory mismatch: registry key={skill_id}, directory={expected_dir_name}"
                )
            for markdown_path in skill_root.rglob("*.md"):
                text = markdown_path.read_text(encoding="utf-8")
                if ".codex/skills/" in text:
                    errors.append(
                        f"platform-specific central Skill path found in {markdown_path.relative_to(root)}; "
                        "use .agent/skills/ as the canonical path"
                    )

    for route_id, owners in sorted(route_owners.items()):
        if len(owners) > 1:
            errors.append(
                f"auxiliary route {route_id!r} is registered by multiple Skills: {', '.join(owners)}; "
                "route IDs must be globally unique"
            )

    if warnings:
        print("Skill validation: WARN")
        for warning in warnings:
            print(f"- {warning}")

    if errors:
        print("Skill validation: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Skill validation: PASS ({len(skills)} registered Skill(s))")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
