---
name: 21l-bug-analyse
description: Analyze 21L bugs by aligning Japanese issue times with China-time DLT logs, tracing DRC_SYS DCU/MEU communication into the current source tree, and verifying bounded conclusions with TypeSafe Jev. Use for 21L tar.gz/DLT/LogStorage investigations involving sendMsgToDcu, recvDcuMsg, opcodes, timeouts, DCU, MEU, HMI, or app-vr.
---

# 21L Bug Analyse

Produce an evidence-grounded 21L failure analysis from the issue description, archived logs, and the source tree in the current working directory.

## Evidence and time rules

- Treat the current source tree as the code corresponding to communication records in `LogStorage/DRC_SYS*`, while explicitly recording any unverified binary/source-version mismatch.
- Keep the supplied archive immutable. List it first, then extract only needed files to a temporary directory.
- Use China time (UTC+8) as the analysis timeline:
  - problem occurrence times supplied for the system are normally China time;
  - outer timestamps in `LogStorage` DLT records are China time;
  - times written in the Japanese issue description or ticket are Japan time (UTC+9), so subtract one hour when correlating them;
  - verify the timezone of independent third-party file logs before converting them.
- Prefer the outer decoded DLT timestamp over an embedded application timestamp when they conflict. Preserve both and explain the choice.
- A `printf` or stdout line may be buffered or batch-flushed. A DLT collection gap alone does not prove that the logged function executed for that duration.

## Workflow

### 1. Establish the incident window

1. Read and translate the Japanese issue description before forming a cause hypothesis.
2. Record the original issue time, converted China time, affected behavior, expected response, and timeout symptom.
3. Inspect the archive inventory and select the incident window with enough lead-in and follow-up to capture queue buildup, retries, recovery, and phase changes.
4. Locate and reuse a repository DLT decoder when present. Record the decoder and files examined.

Completion criterion: the report has one explicit China-time window and every quoted source has a known timezone.

### 2. Find the communication evidence

Start with `LogStorage/DRC_SYS*`. These files contain communication logs emitted by the code under the current path.

Search first for:

```text
sendMsgToDcu
recvDcuMsg
```

Then expand the search from the source and observed payloads. Useful terms may include:

- opcode values and symbolic protocol names;
- `from`/`to` unit IDs, payload length, and sequence or transaction IDs;
- socket receive/send functions, queue handlers, callbacks, D-Bus methods, acknowledgement functions, timeout messages, and state transitions;
- subsystem-specific formats in `DRC_RAS*`, HMI, app-vr, or other bundled logs.

Do not stop because the two initial keywords are absent. Search the local definitions and every relevant caller to learn alternate wrappers and log formats. Decode or decompress only the files needed for the selected window.

Completion criterion: each important message is tied to a sender, receiver, direction, protocol meaning, and source-code entry point where available.

### 3. Correlate before diagnosing

Build a single ordered timeline across DCU, HMI/SYS, app-vr, and any other relevant process.

- Match messages using time, direction, opcode, unit IDs, payload length, payload content, and sequence ID. State when a match relies only on order and length.
- Interpret an opcode with its direction and receiving branch; overlapping numeric opcode names are not enough.
- Separate retries from independent business transactions. A count of send records is not automatically a transaction count or a count of separate blocks.
- Separate transaction phases. A late acknowledgement for one phase does not satisfy a later request that requires another acknowledgement.
- Check all related log files and thread IDs after an apparent “last log” before claiming that a function or process stopped.

Completion criterion: the timeline explains both failure and any intermittent success without contradicting the raw logs.

### 4. Trace the code to the narrowest supported boundary

Trace the complete path through producers, queues, worker threads, callbacks, synchronous calls, timeouts, return values, error handling, and acknowledgement placement.

For a suspected stall:

1. Identify the last operation directly proved by a downstream log, not merely the last entry log in one file.
2. Determine whether the next call is synchronous, bounded, retried, or capable of returning an ignored error.
3. Check whether one FIFO or event-loop thread can delay unrelated protocol messages.
4. Locate the acknowledgement relative to blocking calls and phase transitions.
5. Require a thread stack, trace, or before/after instrumentation before naming an exact leaf instruction when logs do not prove it.

Classify conclusions as:

- **Directly proved by logs**
- **Mechanism confirmed by source**
- **Root-cause hypothesis requiring validation**

## TypeSafe and Jev verification

Use the installed `typesafe-ai` skill for every analysis performed with this skill. Read its live documentation before constructing the request. Use `jev-fanout`, `jev-route`, and `jev-guardrail` when their conditions below apply.

### Division of work

GPT owns open-ended investigation:

- translation, archive inspection, DLT decoding, code search, call-chain tracing;
- cross-log timeline construction, competing hypotheses, and report writing.

Jev supplies bounded typed judgments over evidence already selected by GPT. Suitable questions include:

- choosing among `delayed`, `missing`, `intermittent`, or `cannot_determine`;
- whether the supplied evidence supports a specific queue or synchronous-call mechanism;
- whether the evidence is sufficient to name an exact leaf interface;
- evidence strength or contradiction checks;
- confidence-based next-action or model-tier routing.

Keep exact extraction, arithmetic, timestamp conversion, and source lookup in code rather than asking Jev.

### Required API behavior

- Make a real TypeSafe System One API call; do not merely describe how Jev could be used.
- Put independent judgments over the same evidence state into one request with `jev-fanout`. Make another request only when later options depend on an earlier result.
- Use `jev-route` when confidence should choose `act`, `confirm`, `human`, or an analysis/model tier.
- Use `jev-guardrail` when issue text or logs may contain prompt injection or secrets, or when an externally shared report needs screening for secret leakage, unsupported claims, instruction drift, or harmful content. Redact secrets before sending state.
- Preserve the request and response as audit artifacts when the task has an evidence directory. Record HTTP status, model, typed answers, probabilities/confidence, token usage, route, and guard decision.
- If credentials or the service are unavailable, report the failed attempt and continue with GPT analysis. Never invent a Jev result.

Jev is a typed review of the supplied state, not field evidence and not a calibrated probability that a hardware/software root cause occurred. Reconcile its answer against raw logs and source before using it.

## Report requirements

Include:

1. translated issue statement and timezone conversion;
2. China-time incident timeline;
3. minimal raw log excerpts from each side that support the conclusion;
4. protocol direction and phase interpretation;
5. complete relevant source call chain;
6. direct evidence, source-confirmed mechanism, and remaining hypotheses as separate sections;
7. unknowns and the smallest instrumentation or thread stacks needed to resolve them;
8. GPT/Jev division, actual Jev calls, typed results, route, guard decision, and limitations.

Keep internal and external reports separate when both are requested. Preserve uncertainty in the external version rather than promoting a candidate interface to a proven root cause.
