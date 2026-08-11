# OneSQL 语法速查

OneSQL 是 ONES 的简化 SQL 方言，只支持对 `issue` 表的 SELECT 查询。

## 基本结构

```sql
SELECT <字段列表>
FROM issue
WHERE <条件>
  AND v$cursor > ""      -- 必须：分页游标，第一页用空字符串
LIMIT 1000, 50           -- 必须：最大1000条，每页50条
```

## 常用字段

| 字段 | 说明 | 备注 |
|------|------|------|
| `uuid` | Issue ID | |
| `summary` | 标题 | |
| `assign` | 负责人 ID | WHERE/SELECT 均可用 |
| `status_uuid` | 状态 ID | WHERE 用此名，不是 `status` |
| `issue_type_uuid` | 类型 ID | WHERE 用此名，不是 `issue_type` |
| `project_uuid` | 项目 ID | WHERE 用此名，不是 `project` |
| `update_time` | 更新时间（datetime） | SELECT 需用 `TODATE(update_time)` |

> **重要**：WHERE 条件中字段名须加 `_uuid` 后缀（`project_uuid`、`issue_type_uuid`、`status_uuid`），`status.name`/`project` 等写法会报 InvalidFieldUUID。
> **不支持 NOT IN**：状态过滤须在查询后于代码层面过滤，不能在 WHERE 里用 `NOT IN`。

## WHERE 条件规则

- 字段值用 **ID**，不用名称（状态、类型、优先级等）
- 字符串用双引号
- 日期字段用字符串：`create_time > "2025-01-01"`
- 特殊运算符：`~`（包含）、`!~`（不包含）、`EMPTY`（为空）

## 分页

```sql
-- 第一页
AND v$cursor > ""

-- 下一页（用上次结果的 end_cursor）
AND v$cursor > "上次的end_cursor值"
```

`has_next_page: true` 时说明还有更多数据。

## 典型查询

```sql
-- 项目下所有 Bug，按更新时间倒序
SELECT uuid, summary, status.name, assign.name, TODATE(update_time)
FROM issue
WHERE project = "Ld6hAnDVBnwS4BR6"
  AND issue_type = "<bug_type_id>"
  AND v$cursor > ""
ORDER BY update_time DESC
LIMIT 1000, 50

-- 我负责的未关闭 Bug
SELECT uuid, summary, status.name, priority.name
FROM issue
WHERE project = "Ld6hAnDVBnwS4BR6"
  AND assign = "<my_user_id>"
  AND status != "<closed_status_id>"
  AND v$cursor > ""
LIMIT 1000, 50

-- 关键词模糊搜索标题
SELECT uuid, summary, status.name
FROM issue
WHERE project = "Ld6hAnDVBnwS4BR6"
  AND summary ~ "蓝牙"
  AND v$cursor > ""
LIMIT 1000, 50
```

## 注意事项

- 不支持 `SELECT *`、JOIN、子查询
- `ORDER BY` 只支持 uuid 字段
- `GROUP BY` 支持有限字段
- 日期字段 SELECT 时必须用 `TODATE(field)` 包裹
