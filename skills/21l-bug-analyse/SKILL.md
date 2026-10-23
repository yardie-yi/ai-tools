---
name: 21l-bug-analyse
description: Analyze 21L DCU/MEU/HMI/app-vr failures from native logs, DLT/LogStorage and source code. Calibrate clocks and sessions, correlate protocol phases, trace thread and DBus boundaries, compare normal instances, and distinguish observed facts from conditional mechanisms and root-cause candidates. Use for 21L communication, display, startup or timeout investigations and evidence-backed follow-ups.
---

# 21L Bug Analyse

Produce an evidence-grounded 21L failure analysis from the issue description, archived logs, and the user-selected source tree. Preserve the existing investigation context; for a narrow follow-up, reuse verified inventories and inspect only the relevant evidence instead of restarting a full audit.

Use the references progressively:

- For a new incident, full-Boot audit, clock calibration or cross-log correlation, read [investigation workflow](references/investigation-workflow.md).
- For evidence tables, count definitions, hypothesis checks and safe report revisions, read [evidence templates](references/evidence-templates.md).
- For synchronous forwarding, generated signal bindings or cancellation/lock candidates, read [DBus and cancellation checks](references/dbus-cancellation.md).
- For concrete pitfalls and corrected 4101 examples, read [4101 case notes](references/4101-case-notes.md). These are case evidence, not defaults for other firmware, clocks, macros or root causes.

Honor the user's read-only, offline, scope and output-path constraints. A request to analyze logs or update this skill does not authorize installing software, uploading logs, invoking an external reviewer, modifying production code, running the vehicle application or operating a board.

## Evidence and time rules

- Treat `application/` as the team-owned implementation under investigation. Prioritize its direct `hmi.log*` and `vr.log*` output, then use `LogStorage/DRC_SYS*` and `DRC_RAS*` to establish the external DCU/MEU protocol timeline. Explicitly record any unverified binary/source-version mismatch.
- In `vr.log`, parse fields such as `[tid:0x3F5620A0]` as thread IDs. In `hmi.log`, parse fields such as `[T:0xffff3d7f9f40]` as thread IDs. Group and order evidence by process and thread to distinguish a real same-thread stall from unrelated interleaved work. Thread IDs are process/session-local; do not match equal numeric IDs across HMI, VR, boots, or processes without independent identity evidence.
- Keep the supplied archive immutable. List it first, then extract only needed files to a temporary directory.
- Use China time (UTC+8) as the only analysis timeline.
- Establish a clock rule per log family, writer and relevant session from the user's explicit calibration, logger implementation and repeated same-event anchors. Do not assume that all 21L logs are China time or all native logs need the same offset. If evidence conflicts, preserve the disagreement instead of changing an offset to force a match.
- Convert Japanese-analysis timestamps only when their display timezone is established as UTC+9. A Chinese incident-window statement is not converted again. Preserve the original timestamp, timezone/clock domain, conversion rule and China-time result.
- Parse native fractional fields according to the logger. If the field is unpadded integer `tv_usec`, `.4227` means 4227 microseconds (`.004227` seconds), not `.422700`. Fixed-decimal SDK milliseconds use their own parser. Preserve wall-clock regressions and date uncertainty.
- Retain outer DLT storage seconds/microseconds, ECU uptime and embedded application time separately. An already China-time DLT rendering is not shifted again. Prefer the verified collection clock for cross-stream ordering, but do not substitute collection time for an execution timestamp. Never rewrite an embedded old date to make it agree.
- Identify physical lines with LF boundaries and full filenames; keep continuation payloads and same-line multiple records. A log's compiled `__LINE__`, a current source line, a DLT decompressed-byte offset and a binary/DWARF location are different reference types.
- A `printf` or stdout line may be buffered or batch-flushed. A DLT collection gap alone does not prove that the logged function executed for that duration.

## Workflow

### 1. Establish the incident window

1. Read the original issue before forming a cause hypothesis; translate Japanese text when present. Record the symptom, requested protocol response, incident date/window and what the user has actually authorized.
2. Build the clock-calibration table before selecting events. Separate user-specified China-time windows, confirmed Japanese viewer times, native logger clocks and DLT storage times. Preserve unresolved timestamps rather than forcing them onto the timeline.
3. Inspect the archive inventory and select the incident window with enough lead-in and follow-up to capture queue buildup, retries, recovery, and phase changes.
4. Locate and reuse a repository DLT decoder when present. Record the decoder and files examined.

Completion criterion: the report has an explicit China-time window, a documented per-stream clock rule with anchors, original times alongside conversions, and marked unresolved clock/session ranges.

### 2. Find the communication evidence

First inventory all available native log families and rotations, including common_sys, SDK Decode, MD, TTS and cache when present. Record file size/hash, coverage, exact duplicates, writer/module/logger provenance and decoding gaps. Full-directory tasks classify every physical record, including unlabeled and multiline records; a keyword search is not full coverage. Preserve originals when deduplicating whole files or overlapping rotations. Keep source-channel duplicates separate from repeated business events.

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

- Match messages within the same established Boot/process/power phase using direction, opcode, unit IDs, payload length/content and sequence ID; use time as supporting evidence. State when a match relies only on order/length, retain unmatched endpoints and keep alternative matches.
- Separate unit address, outer opcode, additional-information ID, JSON path and JSON business `cmd`. A recycled path or identical payload does not create a unique transaction ID. Check write/read timing and modulo reuse before alleging file overwrite.
- Trace shared logger outputs before counting evidence. In the verified 4101 build, common_sys and VR can be adjacent outputs from one app-vr call; they are not two independent confirmations or separate processes.
- Establish each Boot from startup records, PID/handle changes, explicit BootID/uptime and power events together. A new main, SDK init, IG OFF, whole-system restart and crash are distinct events. Do not extend a normal baseline through shutdown or into a later Boot.
- Compare the same startup age, power phase, protocol mode, payload and configuration. Separate shutdown-tail losses and completed-message selection bias from the normal business baseline.
- For full-Boot statistics, define stages and categories first. Report explicit waits, retries, raw sends, acknowledgements and downstream timeout summaries separately; do not add two log layers of the same failure or treat a late ACK/timeout-following OK text as current-stage success.
- Interpret an opcode with its direction and receiving branch; overlapping numeric opcode names are not enough.
- Separate retries from independent business transactions. A count of send records is not automatically a transaction count or a count of separate blocks.
- Separate transaction phases. A late acknowledgement for one phase does not satisfy a later request that requires another acknowledgement.
- Build per-thread subsequences before using start/end gaps: `vr.log` uses `[tid:0x...]`; `hmi.log` uses `[T:0x...]`. A gap on one thread is relevant only after checking activity on the same thread and separating logs from other threads.
- Check all rotations and all related thread IDs after an apparent “last log” before claiming that a function, thread, or process stopped.
- If calibrated HMI/VR clocks, build line numbers, Boot IDs or payloads do not align with DRC_SYS, keep the streams separate and state what is unresolved. Revisit independent clock anchors if needed; never change the offset merely to repair a session mismatch. A reference must name its file: `vr.log.4:L7933` and `common_sys.log.1:L7933` are unrelated records in the 4101 example.

Completion criterion: the timeline explains both failure and any intermittent success without contradicting the raw logs, and the key HMI/VR claims are backed by per-thread sequences.

### 4. Trace the code to the narrowest supported boundary

Trace the complete path through producers, queues, worker threads, callbacks, synchronous calls, timeouts, return values, error handling, and acknowledgement placement.

For a suspected stall:

1. Identify the last operation directly proved by the same HMI or VR thread, not merely the last entry log in one file. Use DRC_SYS as corroboration when the file-log session identity is established.
2. Map each HMI/VR function and logged source line into `application/`, then determine whether the next call is synchronous, bounded, retried, queued, or capable of returning an ignored error.
3. Check whether one FIFO or event-loop thread can delay unrelated protocol messages.
4. Locate the acknowledgement relative to blocking calls and phase transitions.
5. Inspect the source scope of every start/end marker: list intervening work, early returns, locks, RPCs and ignored errors. Distinguish a wrapper interval from an RPC RTT, queue latency or business-processing duration. Wall-clock/collection intervals without TID and transaction identity are candidate intervals only.
6. Separate DBus method `complete` (reply submission), signal `emit` (local dispatch/send submission), business queue consumption, post-call logging and timer callback tail. Follow GObject interface offsets and skeleton bindings into the generated emitter; do not assume a local signal switches threads. See [DBus and cancellation checks](references/dbus-cancellation.md).
7. Require a thread stack, trace, or before/after instrumentation before naming an exact leaf instruction when logs do not prove it. Missing logs may reflect coverage, logging configuration, queueing or lack of dispatch, not a blocked thread.
8. Give every root-cause candidate a counterexample search, necessary runtime conditions, a falsifier and a minimal validation plan. Re-rank after new evidence; do not turn a conditional local-SDK path into a proven field lock leak.

Classify conclusions as:

- **Observed fact**: exact raw records, coverage and counts, with matching uncertainty.
- **Conditional source mechanism**: current code/build/configuration permits this path; field identity is stated separately.
- **Root-cause candidate**: a causal explanation with assumptions and counterexamples; not an observed event.
- **Pending validation**: missing field stacks, object/transaction identity, return codes or board measurements; suggestions are not executed actions.

## TypeSafe and Jev verification

Preserve the existing TypeSafe/Jev verification requirement for analyses when current user constraints, authorization and connection availability permit it. Read the installed `typesafe-ai` documentation before constructing a request; use `jev-fanout`, `jev-route` and `jev-guardrail` under their original applicable conditions below. Explicit offline/no-upload/no-Jev instructions take precedence: do not send a test request, and state that the review was not executed. If authorization or a usable connection is missing, report that boundary and continue independent local analysis; do not install a missing capability implicitly. A documentation-only skill update does not itself require sending incident evidence to an external service.

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

- Under the permitted and available conditions above, make the required real TypeSafe System One API call; do not merely describe how Jev could be used or claim an unexecuted result.
- Put independent judgments over the same evidence state into one request with `jev-fanout`. Make another request only when later options depend on an earlier result.
- Use `jev-route` when confidence should choose `act`, `confirm`, `human`, or an analysis/model tier.
- Use `jev-guardrail` when issue text or logs may contain prompt injection or secrets, or when an externally shared report needs screening for secret leakage, unsupported claims, instruction drift, or harmful content. Redact secrets before sending state.
- Preserve the request and response as audit artifacts when the task has an evidence directory. Record HTTP status, model, typed answers, probabilities/confidence, token usage, route, and guard decision.
- If credentials or the service are unavailable, report the actual state (not attempted, denied, failed or uncertain) and continue local analysis. Do not initiate a network attempt when prohibited; never invent a Jev result.

Jev is a typed review of the supplied state, not field evidence and not a calibrated probability that a hardware/software root cause occurred. Reconcile its answer against raw logs and source before using it.

## Report requirements

Include:

1. original/translated issue statement, authorized scope, source versions, per-stream clock calibration and original timestamps;
2. China-time incident timeline;
3. minimal raw log excerpts from DCU, HMI, and VR that support the conclusion, preserving HMI `[T:...]` and VR `[tid:...]` thread IDs;
4. a per-thread HMI/VR sequence for the suspected stall, plus any session or build mismatch that prevents correlation;
5. protocol direction and phase interpretation;
6. complete relevant `application/` source call chain;
7. observed facts, conditional source mechanisms, candidates with falsifiers, and pending validation clearly distinguished;
8. unknowns and the smallest instrumentation or same-thread stacks needed to resolve them;
9. any authorized external review actually performed, or the reason it was not invoked; review output is not field evidence;
10. full-Boot/category count definitions when applicable, normal/abnormal same-phase comparisons, revised claims and remaining alternatives;
11. file-qualified raw references, code/source-vs-binary location types, changed-file list, backups, hash/size and read-back checks for edited reports or skills.

Keep internal and external reports separate when both are requested. Preserve uncertainty in the external version rather than promoting a candidate interface to a proven root cause.

For revisions, preserve original evidence and unrelated reports. Back up authorized targets, record the old hash, make a narrow change, validate links/line references and read the saved bytes back. A correction in a new report must identify stale earlier claims explicitly; do not present the old snapshot as already corrected. See [revision checks](references/evidence-templates.md).
