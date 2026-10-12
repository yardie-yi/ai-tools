---
name: 21l-bug-analyse
description: Analyze 21L bugs by converting timestamps in Japanese-written issue analysis back to China time, prioritizing hmi.log and vr.log from the team-owned application code, correlating them with China-time DLT communication, tracing per-thread call paths, and verifying bounded conclusions with TypeSafe Jev. Use for 21L tar.gz/DLT/LogStorage investigations involving sendMsgToDcu, recvDcuMsg, opcodes, timeouts, DCU, MEU, HMI, or app-vr.
---

# 21L Bug Analyse

Produce an evidence-grounded 21L failure analysis from the issue description, archived logs, and the source tree in the current working directory.

## Evidence and time rules

- Treat `application/` as the team-owned implementation under investigation. Prioritize its direct `hmi.log*` and `vr.log*` output, then use `LogStorage/DRC_SYS*` and `DRC_RAS*` to establish the external DCU/MEU protocol timeline. Explicitly record any unverified binary/source-version mismatch.
- In `vr.log`, parse fields such as `[tid:0x3F5620A0]` as thread IDs. In `hmi.log`, parse fields such as `[T:0xffff3d7f9f40]` as thread IDs. Group and order evidence by process and thread to distinguish a real same-thread stall from unrelated interleaved work. Thread IDs are process/session-local; do not match equal numeric IDs across HMI, VR, boots, or processes without independent identity evidence.
- Keep the supplied archive immutable. List it first, then extract only needed files to a temporary directory.
- Use China time (UTC+8) as the only analysis timeline.
- Treat timestamps in all supplied logs as China time, including `LogStorage` DLT records and independent HMI, app-vr, or other file logs. Do not apply a timezone conversion to log timestamps.
- Japanese engineers view the same DLT data with a tool configured for Japan time (UTC+9). Therefore, subtract one hour from every timestamp written in the Japanese-language issue analysis before correlating it with logs. Preserve both the Japanese-analysis time and the converted China time in the report.
- Prefer the outer decoded DLT timestamp over an embedded application timestamp when their clock values conflict. Both are still China-time log timestamps; treat the discrepancy as a clock, date, session, or collection issue rather than a timezone difference. Preserve both and explain the choice.
- A `printf` or stdout line may be buffered or batch-flushed. A DLT collection gap alone does not prove that the logged function executed for that duration.

## Workflow

### 1. Establish the incident window

1. Read and translate the Japanese issue description before forming a cause hypothesis. Identify every timestamp stated by the Japanese analysis and convert it from Japan time to China time by subtracting one hour.
2. Record each original Japanese-analysis time beside its converted China time, then use only the converted China time to select and correlate log events. Also record the affected behavior, expected response, and timeout symptom.
3. Inspect the archive inventory and select the incident window with enough lead-in and follow-up to capture queue buildup, retries, recovery, and phase changes.
4. Locate and reuse a repository DLT decoder when present. Record the decoder and files examined.

Completion criterion: the report has one explicit China-time window, every Japanese-analysis timestamp used for correlation shows the one-hour conversion, and no log timestamp has been timezone-converted.

### 2. Find the communication evidence

Start with `hmi.log*` and `vr.log*`, because they are the direct logs of the team-owned `application/` code. Locate their full rotation ranges, process/session identity, thread IDs, and the incident window before drawing a cause conclusion. In parallel, use `LogStorage/DRC_SYS*` for the MEU communication view and `DRC_RAS*` for the DCU-side request, retry, timeout, recovery, and user-visible impact.

Search HMI first for:

```text
sendMsgToDcu
recvDcuMsg
distribution_data
[T:0x...]
```

Search VR first for:

```text
app_vr_dten_msg_forward_push
app_vr_dten_msg_forward_send
app_vr_dten_msg_push
[tid:0x...]
```

Then correlate those records with the same opcode, direction, unit IDs, payload shape, and phase in DRC_SYS/DRC_RAS.

Then expand the search from the source and observed payloads. Useful terms may include:

- opcode values and symbolic protocol names;
- `from`/`to` unit IDs, payload length, and sequence or transaction IDs;
- socket receive/send functions, queue handlers, callbacks, D-Bus methods, acknowledgement functions, timeout messages, and state transitions;
- subsystem-specific formats in `DRC_RAS*`, HMI, app-vr, or other bundled logs.

Do not stop because the two initial keywords are absent. Search the local definitions and every relevant caller to learn alternate wrappers and log formats. Decode or decompress only the files needed for the selected window.

Completion criterion: each important message is tied to a sender, receiver, direction, protocol meaning, HMI/VR process and thread ID, and source-code entry point where available. Any missing or mismatched hmi.log/vr.log record is reported explicitly rather than silently replaced by DRC_SYS inference.

### 3. Correlate before diagnosing

Build a single ordered timeline across DCU, HMI/SYS, app-vr, and any other relevant process.

- Match messages using time, direction, opcode, unit IDs, payload length, payload content, and sequence ID. State when a match relies only on order and length.
- Interpret an opcode with its direction and receiving branch; overlapping numeric opcode names are not enough.
- Separate retries from independent business transactions. A count of send records is not automatically a transaction count or a count of separate blocks.
- Separate transaction phases. A late acknowledgement for one phase does not satisfy a later request that requires another acknowledgement.
- Build per-thread subsequences before using start/end gaps: `vr.log` uses `[tid:0x...]`; `hmi.log` uses `[T:0x...]`. A gap on one thread is relevant only after checking activity on the same thread and separating logs from other threads.
- Check all rotations and all related thread IDs after an apparent “last log” before claiming that a function, thread, or process stopped.
- If HMI/VR file clocks, build line numbers, boot IDs, or payloads do not align with DRC_SYS, keep the streams separate and state that session identity is unresolved. All remain China-time logs; do not repair a session mismatch with a timezone conversion.

Completion criterion: the timeline explains both failure and any intermittent success without contradicting the raw logs, and the key HMI/VR claims are backed by per-thread sequences.

### 4. Trace the code to the narrowest supported boundary

Trace the complete path through producers, queues, worker threads, callbacks, synchronous calls, timeouts, return values, error handling, and acknowledgement placement.

For a suspected stall:

1. Identify the last operation directly proved by the same HMI or VR thread, not merely the last entry log in one file. Use DRC_SYS as corroboration when the file-log session identity is established.
2. Map each HMI/VR function and logged source line into `application/`, then determine whether the next call is synchronous, bounded, retried, queued, or capable of returning an ignored error.
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

1. translated issue statement, original Japan-time timestamps from the Japanese analysis, and their converted China-time values;
2. China-time incident timeline;
3. minimal raw log excerpts from DCU, HMI, and VR that support the conclusion, preserving HMI `[T:...]` and VR `[tid:...]` thread IDs;
4. a per-thread HMI/VR sequence for the suspected stall, plus any session or build mismatch that prevents correlation;
5. protocol direction and phase interpretation;
6. complete relevant `application/` source call chain;
7. direct evidence, source-confirmed mechanism, and remaining hypotheses as separate sections;
8. unknowns and the smallest instrumentation or same-thread stacks needed to resolve them;
9. GPT/Jev division, actual Jev calls, typed results, route, guard decision, and limitations.

Keep internal and external reports separate when both are requested. Preserve uncertainty in the external version rather than promoting a candidate interface to a proven root cause.
