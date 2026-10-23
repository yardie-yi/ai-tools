# iTalent and Feishu operational notes

These are observed navigation and API behaviors, not fixed selectors, row numbers, or a replacement for current tool documentation.

## iTalent in Chrome

Read the available `browser-harness` skill before using that tool, and respect the active browser tool's restrictions on switching control mechanisms. Tool-switch authorization from one conversation is not a standing instruction to bypass future tool constraints.

- Inventory tabs and reuse the user's existing iTalent tab. The bare attendance URL can redirect to the home page even when login is valid.
- From the home page, open `员工自助` → `我的假勤` → `我的出勤`. Confirm the resulting page and employee name. Avoid carrying over signed redirect query strings from earlier runs.
- The attendance view displays a date filter such as `2026-09-01 ~ 2026-09-30` and columns `考勤日期`, `首打卡`, `末打卡`, `缺勤时长`, `考勤状态`, `出勤状态`, and `补签状态`.
- A September view reported 30 records across two pages at 15 records/page, but its accessibility tree initially exposed only 14 date rows on each page. Scroll the table and union rows by full date before changing pages. Verify coverage against the displayed count and requested month; missing dates must be resolved rather than treated as absence.
- Prefer accessibility nodes with role `row` and their current names for attendance extraction. Obtain fresh nodes after navigation or scrolling. The page can contain an embedded `cloud.italent.cn` frame; follow the browser tool's frame guidance if necessary.
- A failed Codex extension connection does not establish an iTalent login failure. Diagnose the selected browser, and use another available browser mechanism only when permitted. Ask the user to act on a permission dialog only if current evidence shows one.

## Feishu workbook

Read the relevant Feishu skill references before executing commands; consult `--help` for current flags. CLI file inputs/outputs are relative to its working directory. Keep temporary snapshots in a dedicated temporary directory rather than creating artifacts in the repository.

Useful operations:

| Purpose | CLI operation |
| --- | --- |
| Resolve a Wiki URL | `wiki +node-get --node-token <wiki-url> --as user` |
| List month tabs | `sheets +workbook-info` |
| Read displayed values | `sheets +csv-get` |
| Read precise values, formulas, styles | `sheets +cells-get --include value,formula,style` |
| Inspect geometry and merges | `sheets +sheet-info --include merges,row_heights,col_widths,hidden_rows,hidden_cols` |
| Inherit a template's formats | `sheets +range-copy --paste-type formats` |
| Write bounded data and formulas | `sheets +cells-set --range <new-block> --allow-overwrite=false` |
| Merge only the new subtotal cells | `sheets +cells-merge --range <new-subtotal-column-block>` |
| Check new formulas | `sheets +formula-verify --range <new-formulas> --exit-on-error` |

All sheet operations need the resolved workbook and exact sheet selectors. Parse CLI success using `ok == true`, not a top-level `code == 0`. Check read completeness flags and actual ranges. CSV row positions come from `[row=N]`; multiline punch fields are one logical record, so parse CSV rather than counting physical lines.

### Format copying can carry merges

In the observed service, copying `A98:J102` with `--paste-type formats` to `A104` also created `I104:I108`, mirroring the source merge `I98:I102`. Inspect the resulting merge metadata rather than assuming a format-only copy excludes merges.

A source such as `A102:J102` partially intersects `I98:I102` and is rejected. Preserve that original merge. Either copy a complete template block or split the source into ranges outside the merged column. If copying creates several new subtotal merges, unmerge only those confirmed new, empty destination merges and combine them within the new block. An error's suggestion to unmerge the source is not authorization to alter existing data.

Create the new block's subtotal formula at its upper-left total cell and keep all other cells in that merge empty. Format copy does not by itself prove row heights or all border attributes were preserved; read these back separately.
