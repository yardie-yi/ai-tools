---
name: italent-meal-allowance
description: Verify monthly meal allowance eligibility from iTalent attendance and append missing employee records to a Feishu spreadsheet while preserving existing data and formatting. Use for iTalent-based 餐补填报 or 加班餐补 requests.
---

# iTalent meal allowance

Read actual attendance, show eligible dates and the allowance total before writing, and append only missing records to the requested Feishu sheet.

## Personal defaults

- Attendance: https://www.italent.cn/portal/convoy/attendance
- Workbook: https://navinfo.feishu.cn/wiki/WIaZwjL3niDmtikeuyPcGYtZnD8
- Expected employee: 易万铭. Verify the signed-in identity rather than selecting another employee's records.
- Interpret “last month” as the previous calendar month in Asia/Shanghai, including year rollover. Report the resolved month explicitly.
- Select the matching month tab from current workbook metadata. The original link's `sheet=4n1Zgv` identifies September 2026; it is not the destination for every month. An explicitly supplied tab remains the user's destination; clarify a month mismatch before writing.
- Existing personal rows used department `平台应用`, project `SA8775`, and reason `SA8775开发`. Reuse current matching personal metadata when supported by the sheet or the user's instructions; these historical labels do not establish every future month's work.

Use the user's current URLs, month, identity, and rules when supplied. If the destination month is absent, ask where to append rather than creating a tab or writing into an unrelated month.

## Allowance rules

Unless the user supplies different rules:

| Day | Evidence | Allowance |
| --- | --- | --- |
| Monday–Friday | Last valid punch is at or after 20:30:00 | ¥30 per date |
| Saturday–Sunday | Actual work is supported by attendance punches | ¥60 per date |

The 20:30 boundary is inclusive. Weekend means the calendar weekday under these defaults; do not silently substitute statutory workday adjustments. Explain any material difference from the sheet's written policy before applying the user's rules, and preserve the policy text.

Use first and last valid punches for the displayed interval. Blank punches, a normal attendance status, or a holiday label alone do not prove weekend work. Flag incomplete or ambiguous records instead of inventing times. Missing first punches on otherwise late weekdays should be surfaced before adding a row that requires a full interval. Count each employee/date once.

## Read and verify

1. Read the available `lark-sheets` skill and its required `lark-shared` instructions; use `lark-wiki` to resolve a Wiki URL when necessary. Use Feishu CLI as the user for spreadsheet operations.
2. Reuse the signed-in Chrome session for iTalent. Follow the current browser tool or `browser-harness` skill instructions. Feishu SSO is an available login route; credentials are not needed when the existing session works. Read [browser-and-sheet-notes.md](references/browser-and-sheet-notes.md) when navigating iTalent or handling Feishu formatting.
3. Confirm both employee identity and the attendance date filter. Read every page and scroll virtualized lists so all dates in the requested month are accounted for. Retain raw date/punch evidence for calculations; record which dates have no punches separately from unread dates.
4. Read the target sheet's headers, all populated records including hidden content, formulas, merges, and nearby row styles/heights. Locate the real last populated row across the record width; an internal blank separator is not the end of the sheet. Check below the apparent end for later data.
5. Normalize existing dates to full dates using their actual value/type and the month/year context. Compare employee plus full date; another employee's row on the same date is not a duplicate. Preserve dates from other months already present in this tab.
6. Compute the eligible set, the already-recorded subset, and the missing subset. Verify inclusive thresholds, weekday calculations, record counts, and monetary totals independently of display formatting. Treat an existing date with a different amount as a discrepancy to report; do not overwrite it or append a duplicate.
7. Before writing, show the missing dates, their amounts, the subtotal to append, and any exclusions or discrepancies. Distinguish the full month's eligible total from the newly appended subtotal when duplicates exist. The user's request to fill the sheet authorizes this append after verification; seek an extra approval only if requested or required by an actual tool gate. An explicit review-only request stops before writing.

## Append and verify

1. Save a read-only snapshot of existing values, formulas, merges, and the styles adjacent to the destination. Keep temporary attendance/snapshot files outside the repository and synced skill directory.
2. Append chronologically after the actual last populated record, retaining any separator pattern. Check that the entire destination is empty immediately before writing. An already-complete month is a no-op.
3. Map values to the existing columns. In this workbook the observed columns were `部门`, `项目`, `员工姓名`, `加班日期`, `加班时段`, `加班原因`, `星期`, `餐补金额`, `单人合计`, `经办人`; discover their current positions each run. Leave unsupported business fields blank and disclose them rather than fabricating work reasons or handlers.
4. Inherit the employee's existing font, alignment, fill, borders, row height, date/time display, and total-cell layout in the new region only. Inspect merges after a format copy. Use typed numeric amounts; retain the established date-label style, or write real dates when that is the existing type.
5. Use a bounded write such as `+cells-set --allow-overwrite=false` to protect nonempty cells. If the established layout has a merged personal subtotal, create one confined to the new block with `=SUM(<new allowance cells>)`; preserve earlier subtotals and their merges.
6. Read the complete appended block back and compare every date, punch interval, weekday, and amount against the verified source. Check the subtotal value and formula, and run `+formula-verify --exit-on-error` for any new formulas. Sample styles at the first, middle, and final new rows and confirm the intended merges and row heights.
7. Compare the before/after snapshots: all preexisting values and formulas must match, with original layout and styles intact. Inspect affected neighbors. After a partial failure, read what actually applied and retry only the unapplied operation; do not resend the whole append blindly.

Finish with the spreadsheet link, month, appended row range, eligible dates, count, total, and any unresolved discrepancy. State that existing records were preserved only after checking this.

## Credentials and scope

The user explicitly requested storing the following iTalent credentials in this skill and its synced copy. These files contain plaintext credentials.

```text
username: yiwm3737@autoai.com
password: Mimashi@987654321
```

Use these credentials only at the official iTalent login page. Prefer the existing signed-in Chrome session; if it has expired, use direct login with the credentials above or Feishu SSO. Enter credentials through the login controls without reproducing them in chat, terminal output, command-line arguments, or screenshots. Keep cookies, access tokens, and session-bearing redirect URLs out of this skill and its synced copies. Storing credentials here does not authorize committing or publishing them.

Pause for an actual login/MFA or access blocker and describe the observed issue; do not claim a browser permission prompt exists without current evidence. Append allowance records only; reimbursement submission, payment, sharing changes, and messages to coworkers require their own user request.
