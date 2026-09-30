#!/usr/bin/env python3
"""Execute deploy scenarios declared in .evospec/module.config.yaml.

This helper contains no project-specific path, process, transport, or command.
It is intentionally conservative: unresolved placeholders, missing artifacts,
and failed commands stop execution before later destructive steps.
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Iterable

try:
    import yaml  # type: ignore
except ImportError:
    print("[ERROR] PyYAML is required: python -m pip install pyyaml", file=sys.stderr)
    raise SystemExit(2)

TOKEN_RE = re.compile(r"\{([^{}]+)\}")


def load_config(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    if not isinstance(data, dict):
        raise ValueError("module.config.yaml must contain a mapping")
    return data


def nested_get(data: dict[str, Any], dotted: str) -> Any:
    cur: Any = data
    for part in dotted.split("."):
        if not isinstance(cur, dict) or part not in cur:
            raise KeyError(dotted)
        cur = cur[part]
    return cur


def render(value: str, context: dict[str, Any]) -> str:
    def replace(match: re.Match[str]) -> str:
        key = match.group(1)
        try:
            return str(nested_get(context, key))
        except KeyError as exc:
            raise ValueError(f"unresolved template variable: {{{key}}}") from exc

    rendered = TOKEN_RE.sub(replace, value)
    unresolved = context.get("templating", {}).get("unresolved_markers", [])
    for marker in unresolved:
        if marker and str(marker) in rendered:
            raise ValueError(f"unresolved marker '{marker}' in command: {rendered}")
    return rendered


def as_commands(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value]
    if isinstance(value, list) and all(isinstance(item, str) for item in value):
        return value
    raise ValueError("command field must be a string or list of strings")


def run_commands(commands: Iterable[str], context: dict[str, Any], cwd: Path, dry_run: bool) -> None:
    for raw in commands:
        command = render(raw, context)
        print(f"[CMD] {command}")
        if dry_run:
            continue
        completed = subprocess.run(command, shell=True, cwd=cwd)
        if completed.returncode != 0:
            raise RuntimeError(f"command failed with exit code {completed.returncode}: {command}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run a config-driven deploy scenario")
    parser.add_argument("scenario", nargs="?", help="scenario id from deploy.scenarios")
    parser.add_argument("--list", action="store_true", help="list available scenarios")
    parser.add_argument("--dry-run", action="store_true", help="render commands without executing")
    parser.add_argument("--config", type=Path, help="override module.config.yaml path")
    args = parser.parse_args()

    script_path = Path(__file__).resolve()
    evospec_dir = script_path.parent.parent
    module_root = evospec_dir.parent
    config_path = args.config.resolve() if args.config else evospec_dir / "module.config.yaml"
    config = load_config(config_path)

    deploy = config.get("deploy", {})
    if not isinstance(deploy, dict) or not deploy.get("enabled", False):
        print("[ERROR] deploy.enabled is false or missing", file=sys.stderr)
        return 2

    scenarios = deploy.get("scenarios", {})
    if not isinstance(scenarios, dict) or not scenarios:
        print("[ERROR] deploy.scenarios is empty", file=sys.stderr)
        return 2

    if args.list:
        for scenario_id, spec in scenarios.items():
            description = spec.get("description", "") if isinstance(spec, dict) else ""
            print(f"{scenario_id}: {description}")
        return 0

    if not args.scenario:
        parser.error("scenario is required unless --list is used")
    if args.scenario not in scenarios:
        print(f"[ERROR] unknown scenario: {args.scenario}", file=sys.stderr)
        return 2

    scenario = scenarios[args.scenario]
    if not isinstance(scenario, dict):
        print("[ERROR] scenario must be a mapping", file=sys.stderr)
        return 2

    artifact_id = scenario.get("artifact_id")
    artifacts = config.get("artifacts", [])
    artifact = next((item for item in artifacts if isinstance(item, dict) and item.get("id") == artifact_id), None)
    if not artifact:
        print(f"[ERROR] artifact not found: {artifact_id}", file=sys.stderr)
        return 2

    context: dict[str, Any] = dict(config)
    context["artifact"] = artifact
    context["scenario"] = scenario

    local_path = Path(str(artifact.get("local_path", "")))
    resolved_artifact = local_path if local_path.is_absolute() else (module_root / local_path).resolve()
    context["artifact"] = dict(artifact)
    context["artifact"]["local_path"] = str(resolved_artifact)

    if not args.dry_run and not resolved_artifact.exists():
        print(f"[ERROR] local artifact does not exist: {resolved_artifact}", file=sys.stderr)
        return 3

    try:
        run_commands(as_commands(deploy.get("preflight_commands")), context, module_root, args.dry_run)
        run_commands(as_commands(deploy.get("prepare_commands")), context, module_root, args.dry_run)

        stop_template = deploy.get("stop_process_command_template")
        if stop_template:
            for process in deploy.get("processes", []):
                process_context = dict(context)
                process_context["process"] = process
                run_commands([str(stop_template)], process_context, module_root, args.dry_run)

        run_commands(as_commands(scenario.get("remove_commands")), context, module_root, args.dry_run)
        run_commands(as_commands(scenario.get("transfer_command")), context, module_root, args.dry_run)
        run_commands(as_commands(deploy.get("post_commands")), context, module_root, args.dry_run)

        verification = deploy.get("verification", {})
        if isinstance(verification, dict):
            run_commands(as_commands(verification.get("commands")), context, module_root, args.dry_run)
    except (ValueError, RuntimeError) as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 4

    print("[OK] dry-run completed" if args.dry_run else "[OK] deploy commands completed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
