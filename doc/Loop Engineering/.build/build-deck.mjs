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
 s.images.add({blob:new Uint8Array(await fs.readFile(path.join(build,'cover.png'))),contentType:'image/png',fit:'cover',alt:'任务循环执行与验证的示意插图',position:{left:0,top:0,width:1280,height:720}});
 text(s,'Loop',70,174,680,106,88,C.fg,true);
 text(s,'Engineering',70,283,700,100,76,C.fg,true);
 text(s,'AI 任务的自动执行与验证',74,428,650,58,32,C.accent,true);
 text(s,'闭环原理与嵌入式开发示例',75,498,640,48,25,C.muted);
 s.speakerNotes.textFrame.setText('建议分享时长约 20–25 分钟。内容包括闭环的定义、执行步骤、验证方法、状态记录和停止条件，最后用 UART 协议解析案例说明如何应用。案例中的协议要求、模拟执行结果和成本数字均为教学假设，未对真实项目执行测试。');
 metas.push({title:'Loop Engineering'});
}
// 02. Definition and who chooses the next step.
{
 const s=slide('Loop Engineering：任务闭环','系统根据检查结果，决定继续修改、完成任务或转交人工',
 'Agent 指能够调用工具执行任务的 AI 程序。人先定义目标、允许的操作范围和验收标准。控制程序安排 Agent 执行任务，再读取测试或其他检查结果，决定下一步动作。多轮执行可以在一次任务内完成，不要求定时启动。重复执行不保证结果变好，每轮需要根据具体失败原因调整做法。');
 text(s,'任务目标、执行步骤、检查方法、停止条件',66,215,1150,78,40,C.accent,true);
 table(s,[['工作方式','谁决定下一步','如何结束'],['逐次交互','人阅读结果后再下指令','人判断任务已完成'],['任务闭环','控制程序根据检查结果决定','验收通过或满足停止条件']],[230,475,447],{y:328,h:222,size:25});
 text(s,'控制程序安排步骤，AI 生成方案，检查工具返回结果。',66,605,1140,48,27,C.muted);
}
// 03. Process kept native and editable.
{
 const s=slide('闭环的五个步骤','验证未通过时，记录失败原因，下一轮针对这些原因修改',
 'Discover 读取任务要求、当前代码和实际失败信息，核对历史记录是否仍然有效。Plan 确定本轮处理的一个具体问题，并说明修改范围和验证方法。Execute 修改代码或调用工具。Verify 按预先确定的验收标准检查修改结果。Iterate 保存检查结果，决定继续修改、结束任务或转交人工。一轮完整执行也称一次迭代。');
 table(s,[['步骤','执行内容','输出记录'],['01  DISCOVER','读取任务要求与失败信息','修改前的代码、输入和失败项'],['02  PLAN','确定本轮要处理的问题','修改范围与验证方法'],['03  EXECUTE','修改代码或调用工具','修改后的代码或文件'],['04  VERIFY','按验收标准检查修改结果','通过 / 失败 / 未知'],['05  ITERATE','保存结果并决定下一步','继续修改 / 完成 / 转交人工']],[270,442,440],{y:210,h:396,size:24});
}
// 04. The core control contract.
{
 const s=slide('验证、状态与停止条件','每轮检查修改结果，记录执行情况，并判断是否继续',
 'Verify 用于检查代码或文件是否满足要求。State 保存下一轮需要读取的执行记录，不会改变模型参数。Stop 定义任务完成和无法继续时的处理方式。测试未执行、设备不可用或日志缺失时，检查结果应为未知。AI 自己声称完成不能代替实际检查。');
 rows(s,[['Verify：验证','运行测试或其他检查，判断本轮修改是否满足要求。'],['State：状态','记录代码版本、失败用例、已试方法和下一轮任务。'],['Stop：停止','任务完成、资源耗尽、重复失败或依赖缺失时停止。']],225,121);
}
// 05. Suitability.
{
 const s=slide('使用条件','根据任务特点和现有工具，选择自动化范围',
 '任务重复频率用于估算搭建和维护流程是否值得，没有统一的每周次数要求。复杂的一次性任务也可以通过几轮修改和检查完成，但未必需要长期自动运行。检查依赖主观判断或所需工具不全时，可保留人工处理步骤。');
 rows(s,[['任务是否反复出现？','比较搭建、维护流程的成本与节省的人工时间。'],['检查能否发现错误输出？','构建、测试或固定规则能够报告具体失败。'],['Agent 是否具备完成任务的工具？','能够运行构建、测试，并访问任务所需接口。'],['完成标准是否足够客观？','能够提前写明验收条件，并由他人重复检查。']],205,104);
}
// 06. Nearby terms, practical independent explanatory expansion.
{
 const s=slide('Prompt、Context、Harness 与 Loop','分别说明任务指令、输入信息、运行环境和循环控制',
 'Prompt 是发给模型的任务指令。Context 是模型本次能读取的信息。Harness 是运行 Agent 的配套环境，包括工具、权限、工作区隔离和操作限制。Loop 根据检查结果安排重复执行。Graph 用图表示多个任务之间的先后依赖和分支，一个任务内部也可以使用循环修改和验证。');
 table(s,[['概念','主要问题','对应配置'],['Prompt','本次要完成什么？','任务描述与输出要求'],['Context','完成任务需要哪些信息？','规格、代码、日志与状态'],['Harness','有哪些工具，允许哪些操作？','工具、权限与运行环境'],['Loop','何时修改、重试或停止？','检查、状态保存与停止条件']],[230,500,422],{y:215,h:350,size:24});
 text(s,'Graph 表示任务之间的依赖；Loop 根据检查结果重复执行。',66,615,1140,45,25,C.muted);
}
// 07. Components.
{
 const s=slide('闭环系统的五个组成部分','分别负责启动任务、提供规则、执行操作和检查结果',
 '触发器确定任务何时启动，可以手动启动，也可以响应事件或按时执行。Skill 是保存为文件的可复用操作说明。独立审查者读取修改内容并检查问题，仍需用实际测试核实判断。连接器提供访问仓库和设备等环境的接口，每次操作还应符合授权范围。执行记录由状态文件统一保存。');
 table(s,[['组成部分','职责','在嵌入式开发中的用法'],['自动化 / 触发器','决定什么时候启动','CI 失败事件或定时检查'],['Skill / 规则','保存步骤与操作范围','构建步骤、代码规范、禁止修改区'],['执行者与检查者','分别修改和复核','生成代码修改并审查差异'],['连接器 / 工具','读取数据和执行操作','仓库、构建机、测试适配器'],['验证器','按验收标准报告结果','测试结果、静态检查、板端报告']],[280,362,510],{y:206,h:402,size:23});
}
// 08. Evidence.
{
 const s=slide('验证方法及其适用范围','在修改前确定验收标准，修改后按同一标准检查',
 'AI 自检可以提出遗漏和潜在问题，但评分不能证明代码正确。软件验证应读取实际构建、测试和静态检查的结果。测试通过只说明已覆盖条件符合要求，不能证明所有条件都不存在缺陷。执行者不得为了让检查通过而删除失败测试或降低验收标准。每份报告需要记录代码版本、验收标准版本、配置和执行时间。');
 table(s,[['检查方式','检查内容','结论的限制'],['AI 自检','提出可能的问题与修改建议','评分不能证明测试通过'],['独立审查','检查遗漏与设计问题','判断还需实际检查结果支持'],['测试工具 / 固定规则','对当前代码运行可重复检查','结果仅说明已检查的条件'],['人工与实物验证','检查实际系统和设备行为','未执行时必须记录为未知']],[284,437,431],{y:213,h:340,size:24});
 text(s,'每份报告记录代码版本、验收标准版本、测试配置和结果。',66,601,1140,45,27,C.accent,true);
}
// 09. Durable state with comments.
{
 const s=slide('状态记录与任务恢复','保存后续执行所需信息，避免每轮重复读取全部历史',
 '状态文件保存任务进度、失败原因和下一轮要做的操作。除示例字段外，可以记录已用预算、验收标准版本和环境信息。恢复任务时重新核对代码和设备状态，避免使用过期报告。保存失败时停止修改并报告错误。状态记录供后续调用读取，不会训练模型。对可能重复提交的操作，可使用唯一操作编号识别并跳过重复请求，这称为幂等处理。');
 code(s,[
 '# 状态文件示例：记录当前结果和下一轮任务',
 'task_id: uart_parser_fix       # 关联同一任务',
 'artifact_id: candidate_hash    # 本轮修改后的文件版本',
 'acceptance_id: locked_spec     # 本次使用的验收标准版本',
 'attempt: 2                    # 已执行的迭代次数',
 'failed_checks: [fragmented]    # 当前仍然失败的检查项',
 'tried: [buffer_only]           # 已尝试的方法，避免重复',
 'next_step: preserve_tail       # 下一轮具体要做的修改',
 'evidence_path: run_02/report   # 完整检查报告的保存位置',
 'status: RETRY                 # 当前任务需要继续执行'
 ],212);
 text(s,'每轮读取相关摘要，需要定位问题时再读取完整日志。',68,610,1120,43,27,C.accent);
}
// 10. Exits.
{
 const s=slide('停止条件','任务完成、达到资源上限或无法继续时，保存状态并停止',
 'SUCCESS 表示所有必需检查已执行且通过，报告对应当前代码版本。BUDGET 表示次数、总时长或费用达到上限。STALLED 表示连续多轮未解决问题，例如相同测试一直失败且没有新的可行修改方法。BLOCKED 表示缺少设备、权限或其他依赖，或无法取得完整检查结果。转交人工时列出已完成修改、剩余问题、检查报告和恢复所需条件。');
 table(s,[['状态','停止原因','保存内容'],['SUCCESS','所有必需检查已执行且通过','修改后的文件与检查报告'],['BUDGET','次数、时长或成本达到上限','已完成步骤与剩余任务'],['STALLED','连续多轮未解决问题','重复失败项与已尝试方法'],['BLOCKED','依赖缺失或检查结果未知','缺失内容与恢复所需条件']],[250,454,448],{y:217,h:340,size:25});
 text(s,'比较每轮代码修改与测试结果，判断是否真正解决了问题。',66,609,1150,45,25,C.gold);
}
// 11. Control pseudocode, first page.
{
 const s=slide('伪代码：初始化与资源检查','1 / 3  读取已保存状态，在调用前检查剩余预算',
 '这三页伪代码表达控制流程，不是可直接执行的程序。accept 保存本次使用的验收标准版本。limits 包含最大轮数、总时限和 token 或费用上限。persist_attempt 在调用前把本轮计数写入状态文件，避免进程中断后恢复时重复获得执行次数。每个工具和模型调用都要在执行前登记预留预算，并设置超时及取消机制。第三页继续说明如何处理检查结果。');
 code(s,[
 '# 读取已保存状态，核对当前代码和运行环境',
 'state = load_and_reconcile(task_id)',
 'accept = lock_acceptance(spec)  # 执行期间不得降低验收标准',
 'for attempt in state.attempt + 1..limits.max_rounds:',
 '    if not budget.can_start():  # 剩余额度不足时，不发起调用',
 '        return stop_and_save(BUDGET, state)',
 '    try:',
 '        persist_attempt(state, attempt)  # 调用前将轮次写入文件',
 '        result = controlled_cycle(state, accept, limits)',
 '    catch BudgetLimit:         # 本轮中的某次调用所需额度不足',
 '        return stop_and_save(BUDGET, state)',
 '    catch error:',
 '        return stop_and_save(BLOCKED, state, error)'
 ]);
}
// 12. Managed cycle.
{
 const s=slide('伪代码：执行与检查','2 / 3  每次工具和模型调用都检查预算，并设置超时',
 'safe_call 封装统一的调用处理：检查并预留预算、执行操作、记录实际消耗，超时后取消操作。若子进程未响应取消信号，运行环境还需要终止该进程并确认它已经停止。代码修改在独立工作区进行，保存修改前的失败信息和修改后的文件。检查工具使用预先确定的验收标准，返回通过、失败或未知，并附上检查报告。');
 code(s,[
 'function controlled_cycle(state, accept, limits):',
 '    facts = safe_call(discover, state)  # 读取实际失败信息',
 '    plan = safe_call(plan_next, facts)  # 确定本轮修改及验证方法',
 '    work = safe_call(execute, plan)    # 在独立工作区执行修改',
 '    verdict = safe_call(verify, work, accept)',
 '    # 每次 safe_call 都按以下规则执行',
 '    # 调用前保存预留额度，设置截止时间，并传递取消信号',
 '    # 调用后记录实际消耗，超时或故障时返回异常',
 '    # verify 返回通过、失败或未知，并附上检查报告',
 '    return {work, verdict}            # 返回修改内容和检查结果'
 ]);
}
// 13. Persist and decide.
{
 const s=slide('伪代码：保存状态与判断停止','3 / 3  保存检查结果，并确定继续修改还是停止',
 '此处接着第 11 页成功取得 result 后的循环体执行。accepts 检查报告是否对应当前代码和验收标准，所有必需测试是否已经执行且通过。no_progress 根据相同标准下的代码差异、失败用例和已试方法判断是否连续多轮没有解决问题。atomic_save 先完整写入临时文件，再一次性替换旧状态文件，这称为原子保存。停止时保存状态并输出报告，保存失败时报告错误并停止修改。');
 code(s,[
 '    state = merge(state, result, attempt)  # 记录检查结果与轮次',
 '    atomic_save(state)                    # 先写临时文件，再替换',
 '    if accepts(result, accept):           # 所有必需检查已经通过',
 '        return stop_and_save(SUCCESS, state)',
 '    if result.verdict == UNKNOWN:         # 未执行不能算通过',
 '        return stop_and_save(BLOCKED, state)',
 '    if no_progress(state):                # 连续多轮未解决问题',
 '        return stop_and_save(STALLED, state)',
 '    # 否则，下一轮根据失败原因确定修改内容',
 'return stop_and_save(BUDGET, state)        # 轮次耗尽也保存',
 '# stop_and_save：保存状态，报告结果和下一步建议'
 ]);
}
// 14. Embedded example contract.
{
 const s=slide('教学案例：UART 流式协议解析','目标：按既定协议正确处理分片输入和连续多帧输入',
 '本案例为教学假设，未对真实代码或硬件执行测试。分片指一帧的数据分多次到达，粘包指一次接收中含有多帧数据。协议假设包含两字节同步头、长度字段、可变载荷和两字节 CRC。实际 CRC 多项式、初值、反射设置、长度含义和最大载荷应在协议规格中确定，不能由模型猜测。中断服务程序向任务传递数据的过程，以及板端吞吐率，还需要单独测试。');
 table(s,[['项目','具体要求'],['输入格式','2 字节同步头 + 长度 + 载荷 + 2 字节 CRC'],['正常输入','未收齐的帧继续等待，连续完整帧逐个输出'],['异常输入','拒绝长度越界与 CRC 错误，按规格恢复同步'],['验收条件','既定用例与构建通过，相关回归无新增失败'],['允许修改范围','限定解析模块，保持既有协议与接口不变']],[280,872],{y:217,h:365,size:24});
 text(s,'CRC 参数、字节序和最大载荷需在协议规格中提前确定。',65,613,1148,43,24,C.gold);
}
// 15. Illustrative iterations.
{
 const s=slide('UART 示例：三轮修改过程','按失败原因逐项修改，每轮重新运行测试（教学假设）',
 '第一轮处理未收齐的帧被丢弃的问题。第二轮在读取载荷或 CRC 前检查长度和缓冲区边界。第三轮处理错误帧后无法恢复解析的问题。每轮都重新运行分片、粘包和之前已通过的回归用例，防止新修改破坏原有功能。失败用例减少时，还要确认测试没有被删除或降低要求。');
 table(s,[['轮次','本轮问题','修改内容','本轮验证内容'],['1','未收齐的帧被丢弃','保留未收齐的帧数据','分片用例'],['2','异常长度未正确拒绝','先检查长度与缓存边界','长度边界及原有用例'],['3','错误帧后无法恢复解析','跳过错误字节并恢复同步','CRC、恢复及完整回归']],[100,320,360,372],{y:234,h:312,size:24});
 text(s,'每轮记录代码修改、测试结果、剩余问题和下一轮任务。',65,602,1148,48,28,C.accent);
}
// 16. Hardware boundary.
{
 const s=slide('主机测试与板端测试','主机测试检查解析逻辑，板端测试检查实际设备行为',
 '解析逻辑可以用主机侧测试检查。中断时序、DMA 缓冲区复用、任务同步和实际吞吐率，还需要在目标板运行测试。协议字节序、CRC 和内存访问边界也要在目标编译环境核对。没有板卡或测试适配器时，应记录“软件验证通过，板端待验证”。如果任务验收包含板端测试，整项任务仍未完成。');
 text(s,'主机侧检查内容',68,224,530,50,32,C.accent,true);
 text(s,'分片、粘包与非法输入\n内存边界与协议回归\n构建与静态检查',68,304,530,190,29,C.fg);
 text(s,'板端检查内容',685,224,530,50,32,C.gold,true);
 text(s,'中断与任务之间的数据传递\nDMA / 缓冲区并发行为\n复位恢复、吞吐与时序',685,304,530,190,29,C.fg);
 text(s,'设备不可用时，保存软件测试报告，并列出待执行的板端检查。',68,598,1146,56,28,C.muted);
}
// 17. Costs without invented universal claims.
{
 const s=slide('循环执行的成本','统计模型、工具和人工费用，再计算每项完成任务的成本',
 'token 是模型处理文本的计量单位。表中数字为教学假设，未对具体工具实测。假设调用五次，不使用缓存或压缩，只比较输入 token 数量。输出 token、工具运行和人工复核需要另外统计。实际费用取决于模型价格、缓存和调用次数。是否划算还应与任务价值和原来的人工成本比较，没有统一的验收通过率阈值。');
 table(s,[['每轮输入的组织方式','第 1 至 5 次调用，千 token','累计输入'],['每轮保留全部历史','8 / 12 / 16 / 20 / 24','80 千'],['每轮使用固定长度摘要','8 / 8 / 8 / 8 / 8','40 千']],[330,562,260],{y:225,h:226,size:25});
 text(s,'教学假设：5 次调用，仅计算输入，不含缓存、输出与工具。',66,473,1146,46,23,C.gold);
 text(s,'每项完成任务的成本 =（模型 + 工具 + 人工费用）÷ 完成任务数',66,557,1148,60,29,C.accent,true);
}
// 18. Failure modes.
{
 const s=slide('常见问题与处理方法','根据具体问题，修改检查、重试或恢复方式',
 '相同失败持续出现时，需要停止重复修改，检查原因或转交人工。执行过程中修改原定验收标准，需要单独审查。恢复任务时核对报告是否对应当前文件版本。多个任务同时工作时使用独立工作区，或按顺序执行。唯一操作编号用于识别重复请求，任务锁用于防止同一任务被同时执行。具体配置应按项目要求确定。');
 table(s,[['问题','具体表现','处理方式'],['未检查就报告完成','AI 说完成，测试没有执行','必须读取实际检查结果'],['重复修改无效果','多轮修改后，相同用例仍失败','达到次数上限后转交人工'],['降低验收标准','删除用例或放宽阈值后通过','保持原标准，单独审查变更'],['使用过期报告','报告与当前代码版本不一致','记录版本，恢复时重新核对'],['重复执行操作','重复创建工单或提交相同结果','用唯一编号去重，防止并发执行']],[250,475,427],{y:215,h:390,size:23});
}
// 19. Adoption.
{
 const s=slide('闭环的搭建顺序','先手动验证完整流程，再配置循环执行与定时启动',
 '先选择修改范围小、容易验证的任务，例如修复某个模块的构建失败。手动完成一次执行、检查和错误处理，确认流程可以使用。然后把步骤写为 Skill 文件，再加入自动检查、状态保存和停止条件。多次运行可靠后，可以设置事件触发或定时启动。试运行时记录完成比例、每项完成任务的费用、人工处理次数和故障原因。');
 rows(s,[['手动完成一次任务','明确输入、操作步骤和验收方法，保存检查报告。'],['将步骤写为 Skill','保存可复用步骤、允许的操作范围和错误处理方法。'],['配置循环执行与停止条件','加入检查、状态保存、资源限制和人工处理步骤。'],['设置事件触发或定时启动','连续试运行，记录完成情况、费用和失败原因。']],211,103);
}
// 20. Takeaway.
{
 const s=slide('首次试运行的配置内容','选择一个具体任务，明确验收标准、重试方式和停止条件',
 '首次试运行需要明确验收检查、失败后的处理方法和停止条件。选择一个真实任务，写明输入、允许调用的工具、需要输出的文件和检查方法。执行结束后保存代码修改、检查报告及剩余问题。配套 HTML 包含步骤说明、模拟器、完整伪代码和配置清单。');
 text(s,'验收：运行哪些检查，怎样算通过',70,239,1130,76,41,C.accent,true);
 text(s,'重试：根据失败原因确定下一轮修改',70,344,1130,76,41,C.fg,true);
 text(s,'停止：定义次数、时间和资源上限',70,449,1130,76,41,C.gold,true);
 text(s,'执行后保存修改内容、检查报告、剩余问题和下一步操作。',71,597,1130,57,27,C.muted);
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
console.log('FINALIZED',JSON.stringify({path:out.finalPath,integrity:out.packageIntegrity.status,layoutFindings:out.presentationLayout.findingCount}));
await fs.copyFile(final,path.join(root,'Loop Engineering 分享.pptx'));
// Re-import the delivered package and render every final slide for inspection.
const F=await PresentationFile.importPptx(await FileBlob.load(final));
for(let i=0;i<F.slides.items.length;i++){
 const png=await F.export({slide:F.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,'previews',`final-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
}
console.log('DELIVERED',path.join(root,'Loop Engineering 分享.pptx'));
