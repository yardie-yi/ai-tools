#!/usr/bin/env python3
"""Send observed text evidence to Jev for three narrow judgments."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


REQUIRED = ("bug_description", "log_excerpt", "video_observation", "code_excerpt", "hypothesis")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--state", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path, required=True)
    args = parser.parse_args()
    key = os.environ.get("TYPESAFE_API_KEY")
    if not key:
        parser.error("TYPESAFE_API_KEY is not set")
    state = json.loads(args.state.read_text(encoding="utf-8"))
    if not isinstance(state, dict) or any(not isinstance(state.get(name), str) for name in REQUIRED):
        parser.error("state must contain text fields: " + ", ".join(REQUIRED))
    if not state["bug_description"].strip():
        parser.error("bug_description is empty")
    request_body = {
        "model": "jev-latest",
        "state": {name: state[name] for name in REQUIRED},
        "questions": {
            "log_matches": {
                "type": "noul",
                "instructions": "Does `log_excerpt` contain an observed event that materially supports the failure described in `bug_description`? Empty or unrelated logs mean no.",
            },
            "code_supports_hypothesis": {
                "type": "noul",
                "instructions": "Does the observed `code_excerpt`, considered with `bug_description` and `log_excerpt`, support the specific causal `hypothesis`? Missing code or a merely plausible story means no.",
            },
            "evidence_sufficient": {
                "type": "noul",
                "instructions": "Are the observed bug description, log excerpt, video observation, and code excerpt sufficient to give an actionable, evidence-based modification recommendation? Missing critical evidence means no.",
            },
        },
    }
    args.out_dir.mkdir(parents=True, exist_ok=True)
    (args.out_dir / "jev-request.json").write_text(json.dumps(request_body, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    endpoint = os.environ.get("TYPESAFE_ENDPOINT", "https://api.typesafe.ai/v1/systemone")
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(request_body, ensure_ascii=False).encode("utf-8"),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            result = json.load(response)
    except urllib.error.HTTPError as exc:
        print(f"Jev API returned HTTP {exc.code}", file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"Jev API unavailable: {exc}", file=sys.stderr)
        return 1
    if not isinstance(result, dict) or not all(q in result.get("answers", {}) for q in request_body["questions"]):
        print("Jev API returned an incomplete response", file=sys.stderr)
        return 1
    (args.out_dir / "jev-response.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"model": result.get("model"), "answers": result["answers"]}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
