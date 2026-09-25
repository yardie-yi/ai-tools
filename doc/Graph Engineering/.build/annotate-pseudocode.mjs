import fs from 'node:fs/promises';
const file='C:/DATA/personal/ai-tools/doc/Graph Engineering/Graph_Engineering_详解.html';
let html=await fs.readFile(file,'utf8');
const replacements=[
[/<pre><code>\/\/ 教学伪代码；运行时负责计时与持久化[\s\S]*?<\/code><\/pre>/,`// 教学伪代码：描述处理顺序，不是某个 SDK 的可执行 API。
// 输入：任务结果 result、当前尝试次数 attempt、固定版本 snapshot。
// 运行时负责超时、预算扣减和持久化；超时也要生成结果记录。
max_attempts = 2  // 总尝试上限：首次执行 + 最多 1 次重试

on_result(result):  // 每次尝试结束时处理成功、失败或超时结果
  // 先保存结果、尝试次数和输入版本，方便追踪与断点恢复。
  persist(result, attempt, snapshot)

  // accepted 检查执行状态、输出结构及验收条件，不能只听模型说完成。
  if accepted(result):
    mark_succeeded()  // 标记节点成功，供下游检查启动条件

  // 可恢复的瞬态错误、剩余尝试次数和剩余预算，三个条件必须同时满足。
  else if transient(result)
       and attempt < max_attempts
       and budget_remaining:
    wait(backoff_with_jitter)  // 退避并加入随机延迟，避免集中重试
    // 同一逻辑操作复用幂等键，防止重复副作用。
    // 重试函数须增加 attempt，并在执行前再次核对预算和远端状态。
    retry_with_same_idempotency_key()

  else:
    mark_terminal_failure()       // 保存终态失败及原因，不再自动重试
    block_required_dependents()  // 阻断必须依赖该结果的下游节点
// 输出：持久化的任务状态；失败不能冒充“成功但没有发现”。`],
[/<pre><code>\/\/ 教学逻辑：先验收任务，再对“发现”去重[\s\S]*?<\/code><\/pre>/,`// 教学伪代码：先验收任务结果，再对结果中的“发现”去重。
// 输入：计划任务 ID 清单，以及各任务返回的结果信封。
expected = set(planned_node_ids)  // 本轮应该收到哪些任务的结果

// 收集成功、失败和超时结果，并保留 node_id，不过滤失败记录。
// 运行时须设置截止时间，避免一个不结束的任务阻塞整个汇合。
received = all_settled_results_with_node_ids()

// 同一 ID 重复返回不能顶替缺失任务；未知 ID 也不能混入当前运行。
// reject 表示门禁不通过：登记原因并停止生成“完整报告”。
reject duplicate_ids(received), unknown_ids(received)

// 集合差集找出缺失 ID：例如预期 {A,B,C}、收到 {A,B}，缺失为 {C}。
reject expected - set(received.ids)

// 每个必需结果都必须通过下列检查；可选节点的降级规则需另行声明。
require every required result:
  status == succeeded AND schema_valid  // 执行成功，字段和类型符合契约
  AND snapshot_id == current_snapshot   // 结果属于当前代码与配置版本
  AND coverage_complete                 // 声明的检查范围没有漏项

// 输出：允许汇合，或带具体缺口的失败状态。
// 全部通过后才归并 findings；零发现也必须保留成功信封。
// 这里的门禁检查完整性，发现是否真实仍需后续独立验证。`],
[/<pre><code>run_investigation[\s\S]*?<\/code><\/pre>/,`// 教学调用树：缩进表示包含关系，同级步骤默认依次执行。
// parallel_read_only 内的三个分支可并行，结束后才进入汇合检查。
// 输入：待调查现象、代码与配置、已有日志和冻结的验收条件。
run_investigation
  freeze_inputs  // 固定 commit、配置和日志快照，避免分支分析不同版本

  parallel_read_only  // 只读共享输入，各分支写入独立产物目录
    audit_isr_calls                 // 检查 ISR 调用边界与项目约束
    inspect_queue_and_buffer_paths  // 检查队列、缓冲区所有权和错误路径
    correlate_existing_logs         // 对齐已有日志与时序，形成待验证线索

  check_fan_in_integrity  // 核对分支 ID、状态、版本和覆盖，缺项不得放行
  independent_verify_hypotheses  // 新上下文复核假设，回查原始证据
  produce_patch_candidate       // 依据复核结果形成候选补丁，标出未验证项
  integrate_and_build           // 单一集成者合并变更，构建一致固件

  acquire_board_lock  // 独占目标板卡，避免另一任务同时烧录或复位
    flash_exact_artifact    // 烧录本次构建产物，记录二进制哈希
    run_frozen_test_plan    // 按预先确定的条件测试，不为过关放宽阈值
    save_raw_measurements  // 保存原始日志、测量值、板号与时间
  release_board_lock_in_finally  // 无论成功或异常，都在安全收束后释放锁

  write_report_with_evidence  // 输出结论、证据、覆盖情况和待验证项
  human_gate                 // 展示候选变更与风险，批准后方可合入或发布
// 前置步骤失败时，停止依赖它的后续操作，登记缺口并输出诊断报告。
// 输出：可追溯的调查报告和候选变更，不把未运行测试写成已通过。`]
];
for(const [pattern,content] of replacements){
 if(!pattern.test(html))throw new Error('Missing pseudocode block: '+pattern);
 const escaped=content.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 html=html.replace(pattern,()=>'<pre><code>'+escaped+'</code></pre>');
}
await fs.writeFile(file,html);
console.log('Added Chinese comments to 3 pseudocode blocks.');
