import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile, FileBlob } from '@oai/artifact-tool';

const root = 'C:/DATA/personal/ai-tools/doc/Loop Engineering';
const build = path.join(root, '.build');
const skill = 'C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const python = 'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES = 'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { finalizePresentation } = await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
const P = Presentation.create({slideSize:{width:1280,height:720}});
const C = {bg:'#0B1424',fg:'#F2F6FC',muted:'#ADBBD0',accent:'#5ADACB',gold:'#F6BE69',line:'#2B3C52'};
const font = 'Microsoft YaHei';
const metas=[];
function text(slide,str,x,y,w,h,size=28,color=C.fg,bold=false){
  const q=slide.shapes.add({geometry:'textbox',name:`text-${slide.shapes.items?.length||0}-${str.slice(0,12)}`,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  q.text=str;
  q.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none',wrap:'none',insets:{left:0,right:0,top:0,bottom:0}};
  return q;
}
function slide(title,subtitle='',notes=''){
  const s=P.slides.add();s.background.fill=C.bg;
  text(s,title,64,48,1152,80,46,C.fg,true);
  if(subtitle)text(s,subtitle,66,135,1148,54,25,C.muted);
  text(s,String(P.slides.items.length).padStart(2,'0'),1170,670,48,30,17,C.muted);
  s.speakerNotes.textFrame.setText(notes);
  metas.push({title,notes});return s;
}
function rows(s,items,y=216,step=104){
  items.forEach(([title,desc],i)=>{
    text(s,String(i+1).padStart(2,'0'),68,y+i*step,72,55,36,C.accent,true);
    text(s,title,162,y+i*step,1000,44,29,C.fg,true);
    text(s,desc,163,y+46+i*step,1020,48,24,C.muted);
  });
}
function table(s,values,widths,{y=216,h=360,size=24}={}){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:64,top:y,width:1152,height:h,columnWidths:widths,values});
 t.styleOptions={headerRow:false,bandedRows:false};
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?'#122B39':C.bg;
  cell.text.style={typeface:font,fontSize:size,bold:r===0,color:r===0?C.accent:C.fg,verticalAlignment:'middle',autoFit:'none',wrap:'square',insets:{left:16,right:12,top:10,bottom:10}};
 }
 return t;
}
function code(s,lines,y=207){
 lines.forEach((line,i)=>text(s,line,70,y+i*34,1140,34,23,line.trim().startsWith('#')?C.accent:C.fg));
}

// 01. Editable cover title over an embedded conceptual illustration.
{
 const s=P.slides.add();s.background.fill=C.bg;
 s.images.add({blob:new Uint8Array(await fs.readFile(path.join(build,'cover.png'))),contentType:'image/png',fit:'cover',alt:'闭环与验证关口的概念插图',position:{left:0,top:0,width:1280,height:720}});
 text(s,'Loop',70,174,680,106,88,C.fg,true);
 text(s,'Engineering',70,283,700,100,76,C.fg,true);
 text(s,'让 AI 围绕目标持续推进',74,428,650,58,32,C.accent,true);
 text(s,'工程反馈闭环与嵌入式开发实践',75,498,640,48,25,C.muted);
 s.speakerNotes.textFrame.setText('建议分享时长约 20–25 分钟。先建立闭环概念，再解释验证、状态和停止规则，最后用 UART 协议解析教学案例落地。本文中的协议约束、模拟迭代和成本数字均为教学假设，不代表真实项目测试。');
 metas.push({title:'Loop Engineering'});
}
// 02. Definition and who chooses the next step.
{
 const s=slide('Loop Engineering 的工作对象','把目标、反馈与下一步动作组织成可运行的系统',
 '这里讨论的是 AI agent 的任务闭环。人给出目标和约束，系统根据证据决定继续、结束或交还人处理。持续推进可以发生在一次任务内部，并不要求定时调度。循环执行也不保证改进，反馈必须影响下一轮决策。');
 text(s,'目标 + 执行 + 可检验反馈 + 下一步决策',66,215,1150,78,40,C.accent,true);
 table(s,[['工作方式','谁推动下一步','如何结束'],['逐次交互','人阅读结果后再下指令','人判断已经足够'],['工程闭环','控制器根据反馈选择动作','验收通过或触发退出规则']],[230,475,447],{y:328,h:222,size:25});
 text(s,'控制器负责流程，模型负责候选方案，验证器负责证据。',66,605,1140,48,27,C.muted);
}
// 03. Process kept native and editable.
{
 const s=slide('一次迭代的五个阶段','失败结果进入下一轮，形成修正动作',
 'Discover 先读取当前真实状态，避免根据过期记录工作。Plan 选择最有价值的下一步。Execute 实施有限变更。Verify 对照固定验收规则验证具体产物。Iterate 将发现的问题和已尝试的策略写回状态，再计划下一次动作。成功和阻塞都可以成为本次运行的终点。');
 table(s,[['阶段','执行内容','留下什么'],['01  DISCOVER','发现任务与当前失败','基线、输入、待办'],['02  PLAN','选择一个可验证的小步骤','方案与预期变化'],['03  EXECUTE','执行修改或调用工具','候选产物'],['04  VERIFY','对照目标检查结果','通过 / 失败 / 未知'],['05  ITERATE','记录反馈并决定下一步','继续 / 结束 / 交还人工']],[270,442,440],{y:210,h:396,size:24});
}
// 04. The core control contract.
{
 const s=slide('闭环的三个关键约束','它们决定重复运行能否形成有效进展',
 'Verify 是判断产物是否符合要求的关口。State 保存跨轮次所需的工作记忆，但不会自动训练模型参数。Stop 同时覆盖成功和无法继续的情况。工程上必须保留失败与未知，不能把测试未执行、设备不可用或模型自信当作通过。');
 rows(s,[['Verify：验证','哪些证据可以拒绝一个错误结果？'],['State：状态','已经尝试什么，失败在哪里，下一步依据是什么？'],['Stop：停止','何时成功，何时因预算、阻塞或无进展而退出？']],225,121);
}
// 05. Suitability.
{
 const s=slide('适用性判断','先回答这四个问题，再决定自动化程度',
 '重复频率用于评估投入是否值得，不是普遍适用的固定周频门槛。对于复杂但一次性的编码任务，短闭环仍可有效，是否值得搭建持续自动化需要另算。验收主观或工具不全时可以保留人工检查，先采用辅助式短闭环。');
 rows(s,[['任务是否反复出现？','有稳定需求，维护闭环的投入才可能得到回报。'],['错误输出能否被自动拒绝？','测试、构建、格式规则或业务断言能够给出失败。'],['Agent 是否具备完成任务的工具？','代码、构建环境与必要接口实际可用。'],['完成标准是否足够客观？','验收条件能够提前写清，并由他人复查。']],205,104);
}
// 06. Nearby terms, practical independent explanatory expansion.
{
 const s=slide('Prompt、Context、Harness 与 Loop','它们解决不同层次的问题，可以组合使用',
 '这是一组工程化理解方式，并非互斥产品分类。Prompt 表达一次任务，Context 提供相关信息，Harness 为一次运行提供工具、权限和环境，Loop 管理反馈如何驱动持续运行。Graph 用于表达任务依赖和分支，一张图的某个节点内部可以存在修复闭环。');
 table(s,[['层次','核心问题','工程落点'],['Prompt','本次要完成什么？','任务描述与输出要求'],['Context','完成任务需要知道什么？','规格、代码、日志与状态'],['Harness','模型能在什么环境里行动？','工具、权限、隔离与约束'],['Loop','何时继续，如何修正，何时停止？','验证、状态、预算与恢复']],[230,500,422],{y:215,h:350,size:24});
 text(s,'Graph 描述任务间的依赖，Loop 描述任务内的反馈迭代。',66,615,1140,45,25,C.muted);
}
// 07. Components.
{
 const s=slide('闭环系统的五类构件','围绕明确的验证关口连接工具与执行者',
 '触发器可以是手动、事件或计划任务。Skill 将稳定方法固化为可复用指令。独立 reviewer 可以降低同一上下文的偏见，但第二个模型仍可能出错，不能取代客观测试。连接器负责访问真实环境，它是否存在与是否被授权执行某动作是两个问题。状态存储是贯穿各构件的持久基础。');
 table(s,[['构件','职责','嵌入式开发中的落点'],['自动化 / 触发器','决定什么时候启动','CI 失败事件或定时检查'],['Skill / 规则','复用方法与边界','构建步骤、代码规范、禁止修改区'],['执行者与检查者','分开实施和复核','生成修复与审查差异'],['连接器 / 工具','读取和操作真实环境','仓库、构建机、测试适配器'],['验证器','以证据接受或拒绝','测试结果、静态检查、板端报告']],[280,362,510],{y:206,h:402,size:23});
}
// 08. Evidence.
{
 const s=slide('验证证据与自我评分','先固定验收规则，再评估具体产物',
 '模型评分适合发现表达问题、遗漏和潜在风险，属于辅助审查。对软件更可靠的证据来自实际运行的检查。测试通过只覆盖测试定义的范围，不能证明没有其他缺陷。生成代码的 agent 不得为了得到绿灯而删除失败测试或降低既定验收标准。报告还需记录版本、配置、执行时间与工具结果。');
 table(s,[['检查方式','能说明什么','使用边界'],['模型自检','给出可能的问题与改进方向','分数不能证明测试通过'],['独立审查','发现遗漏、边界和设计风险','仍需证据支持结论'],['外部测试 / 规则','对确定产物执行可复查检查','结论限于已覆盖条件'],['人工与实物验证','确认系统与现场行为','未执行时必须记录为未知']],[284,437,431],{y:213,h:340,size:24});
 text(s,'证据绑定：产物版本 + 验收版本 + 测试配置 + 运行结果',66,601,1140,45,27,C.accent,true);
}
// 09. Durable state with comments.
{
 const s=slide('持久状态与恢复','保留决策需要的证据，控制每轮上下文大小',
 '状态应小而可恢复。除示例字段外，实际项目还可以记录验收规则版本、预算消耗、环境标识和幂等键。恢复时重新核对仓库与设备状态，不应盲目信任上次日志。保存失败要停止并报告，不能继续制造无法追踪的更改。外部状态帮助模型读取过去经历，并不改变模型参数。');
 code(s,[
 '# 状态记录示意：每个字段服务于后续决策',
 'task_id: uart_parser_fix       # 关联同一任务',
 'artifact_id: candidate_hash    # 绑定候选产物版本',
 'acceptance_id: locked_spec     # 锁定本次验收规则',
 'attempt: 2                    # 已执行的迭代次数',
 'failed_checks: [fragmented]    # 仍未满足的条件',
 'tried: [buffer_only]           # 避免重复无效策略',
 'next_step: preserve_tail       # 下一轮的明确入口',
 'evidence_path: run_02/report   # 原始证据放文件',
 'status: RETRY                 # 可恢复的当前状态'
 ],212);
 text(s,'每轮只装入任务相关摘要；详细日志按需读取。',68,610,1120,43,27,C.accent);
}
// 10. Exits.
{
 const s=slide('退出条件与人工接手','停止也是闭环的正常结果',
 'SUCCESS 只在固定验收的必需项目全部通过且证据有效时使用。BUDGET 达到迭代、时间或花费上限。STALLED 是重复失败且策略或证据未发生有效变化。BLOCKED 包括设备不可用、权限不足、环境故障或检查器未知。进入人工处理时输出已完成事项、当前阻塞、最后证据和建议下一步。');
 table(s,[['状态','触发条件','交付内容'],['SUCCESS','必需验收全部通过','候选产物与复查证据'],['BUDGET','次数、时长或成本到限','停止点与剩余任务'],['STALLED','连续无新证据或有效变化','重复失败与已尝试方案'],['BLOCKED','依赖缺失或结果为未知','阻塞原因与恢复所需条件']],[250,454,448],{y:217,h:340,size:25});
 text(s,'无进展看失败特征与产物变化，不能只看模型是否说“有进展”。',66,609,1150,45,25,C.gold);
}
// 11. Control pseudocode, first page.
{
 const s=slide('伪代码：受约束的单次执行','1 / 3  初始化与调用前检查',
 '这三页伪代码是接口层设计，非某个产品的命令语法。accept 固定本次验收版本。limits 同时包含最大轮次、总时限和 token 或费用上限。persist_attempt 在外部调用前持久登记轮次，避免崩溃恢复后再次获得同一额度。controlled_cycle 在每次调用前持久预留预算，并传递超时与取消信号。结果处理延续到第三页。');
 code(s,[
 '# 先加载记录，再核对当前仓库与环境',
 'state = load_and_reconcile(task_id)',
 'accept = lock_acceptance(spec)  # 本次验收不可被执行者降低',
 'for attempt in state.attempt + 1..limits.max_rounds:',
 '    if not budget.can_start():  # 调用前检查并预留预算',
 '        return stop_and_save(BUDGET, state)',
 '    try:',
 '        persist_attempt(state, attempt)  # 调用前持久登记轮次',
 '        result = controlled_cycle(state, accept, limits)',
 '    catch BudgetLimit:         # 单次调用也可能触发预算限额',
 '        return stop_and_save(BUDGET, state)',
 '    catch error:',
 '        return stop_and_save(BLOCKED, state, error)'
 ]);
}
// 12. Managed cycle.
{
 const s=slide('伪代码：执行与外部验证','2 / 3  每一步都受预算与超时控制',
 'safe_call 是执行框架提供的受控调用：检查预算、保留额度、执行调用、记录实际消耗，并在超时后取消子进程。对拒绝取消的进程需要框架兜底终止。修改在隔离工作区产生；基线失败证据和新产物都需记录。验证器使用冻结的验收规则，输出 PASS、FAIL 或 UNKNOWN 以及实际证据。');
 code(s,[
 'function controlled_cycle(state, accept, limits):',
 '    facts = safe_call(discover, state)  # 读取真实失败',
 '    plan = safe_call(plan_next, facts)  # 选择一个小改动',
 '    work = safe_call(execute, plan)    # 在隔离区执行',
 '    verdict = safe_call(verify, work, accept)',
 '    # safe_call 对每个工具 / 模型调用执行以下约束',
 '    # 调用前持久预留预算，设置截止时间，并传递取消信号',
 '    # 调用后登记真实消耗，超时或故障返回异常',
 '    # verify 必须输出通过、失败或未知及对应证据',
 '    return {work, verdict}            # 返回可审计结果'
 ]);
}
// 13. Persist and decide.
{
 const s=slide('伪代码：状态与停止决策','3 / 3  每种结局都保留恢复入口',
 '此处延续第 11 页 try 块成功后的循环体。accepts 必须检查证据属于当前产物和验收版本、必需测试确实执行且全部通过。no_progress 按具体任务定义，可以联合失败特征、产物差异与策略变化判断。stop_and_save 在原子保存当前状态后输出报告；保存失败会显式报错并停止。');
 code(s,[
 '    state = merge(state, result, attempt)  # 登记证据与轮次',
 '    atomic_save(state)                    # 临时文件后替换',
 '    if accepts(result, accept):           # 必需验收全部通过',
 '        return stop_and_save(SUCCESS, state)',
 '    if result.verdict == UNKNOWN:         # 未执行不能算通过',
 '        return stop_and_save(BLOCKED, state)',
 '    if no_progress(state):                # 相同失败持续出现',
 '        return stop_and_save(STALLED, state)',
 '    # 否则把失败证据带入下一轮计划',
 'return stop_and_save(BUDGET, state)        # 轮次耗尽也保存',
 '# stop_and_save：原子落盘 + 结果摘要 + 下一步建议'
 ]);
}
// 14. Embedded example contract.
{
 const s=slide('教学案例：UART 流式协议解析','目标：在固定协议规则下正确处理分片与粘包',
 '本案例是原创教学假设，未对真实代码或硬件执行测试。协议假设为两字节同步头、一个长度字段、可变载荷和两字节 CRC。实际 CRC 多项式、初值、反射设置、长度含义和最大载荷必须由真实协议规格锁定，不能由模型猜测。ISR 到任务的数据搬运和板端吞吐率属于额外系统验证范围。');
 table(s,[['契约','本次约束'],['输入格式','2 字节同步头 + 长度 + 载荷 + 2 字节 CRC'],['正确行为','分片帧等待后续字节，连续完整帧逐个输出'],['异常行为','拒绝长度越界与 CRC 错误，按规格恢复同步'],['完成证据','固定用例通过，构建通过，相关回归无新增失败'],['修改边界','限定解析模块，保持既有协议与接口不变']],[280,872],{y:217,h:365,size:24});
 text(s,'教学假设：CRC 参数、字节序与最大载荷由协议规格锁定。',65,613,1148,43,24,C.gold);
}
// 15. Illustrative iterations.
{
 const s=slide('教学推演：失败如何推动下一轮','以下是预设场景，展示决策逻辑，不代表实测结果',
 '第一轮重点是保留不完整帧，不能把所有失败一起改。第二轮在读取载荷或 CRC 前检查长度和缓冲区边界。第三轮修复错误帧后的恢复同步。每轮都重跑分片、粘包和之前已通过的回归用例，防止新修复破坏旧行为。测试数减少也不必然代表进展，需要确认没有删除或弱化用例。');
 table(s,[['轮次','发现的失败','最小修正方向','下一轮证据'],['1','半帧被提前消费','保留未完成帧字节','分片用例结果'],['2','异常长度未正确拒绝','先检查长度与缓存边界','长度边界与原有回归'],['3','错误帧后无法恢复解析','按规格消费字节并重同步','CRC、恢复与完整回归']],[100,320,360,372],{y:234,h:312,size:24});
 text(s,'每轮输出：代码差异、用例结果、失败特征与下一步。',65,602,1148,48,28,C.accent);
}
// 16. Hardware boundary.
{
 const s=slide('FreeRTOS 与板端验证边界','主机验证和系统验证覆盖不同问题',
 '流式解析逻辑可用主机侧用例快速验证，但主机通过不能覆盖中断时序、DMA 缓冲复用、任务同步或实物吞吐。协议字节序、CRC 和缓冲区边界仍要在目标编译环境核对。若没有板卡或测试适配器，任务状态应说明“软件验证通过，板端待验证”，不能把整个硬件任务标记为完成。');
 text(s,'主机侧可快速闭环',68,224,530,50,32,C.accent,true);
 text(s,'分片、粘包与非法输入\n内存边界与协议回归\n构建与静态检查',68,304,530,190,29,C.fg);
 text(s,'板端需补充真实证据',685,224,530,50,32,C.gold,true);
 text(s,'中断与任务之间的交接\nDMA / 缓冲区并发行为\n复位恢复、吞吐与时序',685,304,530,190,29,C.fg);
 text(s,'设备不可用 → 保存软件证据与板端待办 → 交还人工恢复条件',68,598,1146,56,28,C.muted);
}
// 17. Costs without invented universal claims.
{
 const s=slide('成本来自重复读取与重复尝试','用每个验收通过结果的总成本评估收益',
 '表中数字是人为构造的输入 token 教学模型，不是某工具实测。假设五次调用，无缓存或压缩，且只比较输入，不包含输出 token、工具费用、验证机器和人工复核。真实成本还受模型价格、缓存命中率和实际调用次数影响。不能简单认定双 agent 的费用总会翻倍，也不存在统一的验收率盈亏门槛。');
 table(s,[['输入上下文策略','第 1 → 5 次调用，千 token','累计输入'],['逐轮保留新增历史','8 / 12 / 16 / 20 / 24','80 千'],['固定摘要预算','8 / 8 / 8 / 8 / 8','40 千']],[330,562,260],{y:225,h:226,size:25});
 text(s,'教学假设：5 次调用，仅计算输入，不含缓存、输出与工具。',66,473,1146,46,23,C.gold);
 text(s,'单位验收成本 =（模型 + 工具 + 人工复核成本）÷ 验收通过数',66,557,1148,60,29,C.accent,true);
}
// 18. Failure modes.
{
 const s=slide('常见失败模式与处理','把失败原因转成下一步动作',
 '重复运行本身没有价值。对同一失败持续做同类修改应终止或换策略。对验收规则变化需要单独审查。运行恢复时核对产物哈希避免使用过期结果。多个任务写同一个工作区时要明确串行、隔离或租约。表中是设计建议，需要按任务约束配置，并非某工具的默认行为。');
 table(s,[['失败模式','表面现象','处理方式'],['自证成功','模型说完成，测试没有执行','强制读取外部检查结果'],['假进展','反复改同一位置，失败未变化','无进展计数与人工升级'],['验收漂移','删用例、放宽阈值后变绿','固定验收版本并审查变更'],['状态过期','新产物沿用旧报告','证据绑定版本，恢复时重核对'],['重复副作用','同一任务重复创建结果','幂等标识、隔离与单任务锁']],[250,475,427],{y:215,h:390,size:23});
}
// 19. Adoption.
{
 const s=slide('落地顺序','先稳定一个小任务，再把可靠做法固化',
 '选择一个边界清楚、反馈便宜的任务，例如固定模块的构建失败分类与修复。先手工验证输入输出完整，再沉淀 Skill。封装循环时补齐验证、预算、状态和异常退出。只有重复运行稳定后才加事件或定时调度。试点指标可记录验收通过比例、每个通过结果成本、人工接手次数及故障原因。');
 rows(s,[['跑通一次人工流程','明确输入、工具、验收和输出证据。'],['固化为 Skill','保存步骤、约束和失败处理方法。'],['加入有限闭环','补上验证、状态、预算与人工接手。'],['最后接入调度','观察验收成本与失败原因，再扩大范围。']],211,103);
}
// 20. Takeaway.
{
 const s=slide('下一步：选择一个可验证的小任务','把闭环规格写清，再让 Agent 开始执行',
 '可以用三个问题结束分享：完成凭什么判断，失败之后如何变化，什么时候必须停。请听众选出一个真实候选任务，填写触发条件、输入、工具、验收和退出规则。HTML 配套文档包含分步示意、教学模拟器、完整伪代码和落地清单。不要先扩大 agent 数量或运行时长，应先让一个任务闭环可复查。');
 text(s,'完成凭什么判断？',70,239,1130,76,45,C.accent,true);
 text(s,'失败之后如何变化？',70,344,1130,76,45,C.fg,true);
 text(s,'什么时候必须停？',70,449,1130,76,45,C.gold,true);
 text(s,'交付目标：一个任务契约、一条证据链、一个可恢复的闭环。',71,597,1130,57,27,C.muted);
}

await fs.mkdir(path.join(build,'previews'),{recursive:true});
await fs.mkdir(path.join(build,'final'),{recursive:true});
await fs.writeFile(path.join(build,'deck-outline.json'),JSON.stringify(metas,null,2));
const candidate=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(P)).save(candidate);
console.log('DRAFT_EXPORTED',P.slides.items.length);
// Render every authored slide before validating the exported file.
for(let i=0;i<P.slides.items.length;i++){
 const png=await P.export({slide:P.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,'previews',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
 console.log('RENDERED',i+1);
}
const version=Date.now();
const final=path.join(build,'final',`loop-engineering-${version}.pptx`);
const out=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:python,
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
 fontPolicy:{basis:'design',families:[font]},
 requiredNativeTableOwnerSlides:[],
 requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,
 receiptPath:path.join(build,`validation-${version}.json`)});
console.log('FINALIZED',JSON.stringify(out));
await fs.copyFile(final,path.join(root,'Loop Engineering 分享.pptx'));
// Re-import the delivered package and render every final slide for inspection.
const F=await PresentationFile.importPptx(await FileBlob.load(final));
for(let i=0;i<F.slides.items.length;i++){
 const png=await F.export({slide:F.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,'previews',`final-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
}
console.log('DELIVERED',path.join(root,'Loop Engineering 分享.pptx'));
