import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile,FileBlob} from '@oai/artifact-tool';

const root='C:/DATA/personal/ai-tools/doc/Coding SOP';
const build=path.join(root,'.build');
const skill='C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const python='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
const P=Presentation.create({slideSize:{width:1280,height:720}});
const C={bg:'#F4F3EE',fg:'#102A32',muted:'#58686B',accent:'#007E80',gold:'#9B5C23',line:'#D4DEDA',dark:'#102A32',white:'#F4F3EE'};
const font='Microsoft YaHei';let uid=0;const metas=[],tableOwners=[];
function text(s,str,x,y,w,h,size=28,color=C.fg,bold=false){
 const q=s.shapes.add({geometry:'textbox',name:`txt-${++uid}`,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none',wrap:'none',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function slide(title,sub,notes='',dark=false){
 const s=P.slides.add();s.background.fill=dark?C.dark:C.bg;
 text(s,title,64,48,1152,78,46,dark?C.white:C.fg,true);
 if(sub)text(s,sub,67,140,1146,54,25,dark?'#AAC7C6':C.muted);
 text(s,String(P.slides.items.length).padStart(2,'0'),1166,671,52,29,18,dark?'#AAC7C6':C.muted);
 s.speakerNotes.textFrame.setText(notes);metas.push({title,notes});return s;
}
function rows(s,items,y=221,step=101){items.forEach(([h,d],i)=>{text(s,String(i+1).padStart(2,'0'),68,y+i*step,68,48,33,C.accent,true);text(s,h,156,y+i*step,1044,44,30,C.fg,true);text(s,d,157,y+46+i*step,1035,48,24,C.muted);});}
function table(s,values,widths,{y=220,h=354,size=24}={}){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:64,top:y,width:1152,height:h,columnWidths:widths,values});
 t.styleOptions={headerRow:false,bandedRows:false};t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){
 const cell=t.getCell(r,c);cell.fill=r===0?'#E0EBE6':C.bg;
 cell.text.style={typeface:font,fontSize:size,bold:r===0,color:r===0?C.accent:C.fg,verticalAlignment:'middle',autoFit:'none',wrap:'square',insets:{left:13,right:12,top:10,bottom:10}};}
 tableOwners.push(P.slides.items.length);return t;
}
function code(s,lines,{y=220,step=35,size=23}={}){lines.forEach((line,i)=>text(s,line,69,y+i*step,1140,step,size,line.trim().startsWith('#')?C.accent:C.fg));}
function bottom(s,str,color=C.accent){text(s,str,67,613,1147,48,25,color);}

// 01 封面：图片只作概念插画，标题保持可编辑。
{
 const s=P.slides.add();s.background.fill=C.bg;
 s.images.add({blob:new Uint8Array(await fs.readFile(path.join(build,'cover.png'))),contentType:'image/png',fit:'contain',alt:'软件工作流与检查门控的抽象概念插画',position:{left:490,top:92,width:790,height:580}});
 text(s,'Coding',64,177,650,110,91,C.fg,true);
 text(s,'SOP',64,290,490,111,91,C.accent,true);
 text(s,'AI 协作开发的标准工作流程',69,448,950,66,36,C.fg,true);
 text(s,'需求对齐 · 任务拆分 · 验证与审查',71,535,1090,48,27,C.muted);
 s.speakerNotes.textFrame.setText('建议分享 25–35 分钟。先介绍轻量规则与关键门控，再讲完整流程，最后用 UART 接收队列案例串联。本材料的嵌入式案例、参数和任务编号均为教学设计，没有对应的真实项目测试结果。');
 metas.push({title:'Coding SOP'});
}
// 02
{
 const s=slide('Coding SOP 的工作对象','把一次开发任务组织成有输入、有产物、有通过条件的过程',
 'SOP 是标准操作流程。AI 可以执行阅读、实现、运行检查和审查等工作；开发者仍需确定系统边界和工程取舍。一个任务的完成要依据验收证据，不能只依据 Agent 声称完成。流程需要与风险匹配，简单任务减少步骤，复杂任务保留清晰的阶段边界。');
 text(s,'完成标准：实现满足已确认的验收条件',68,219,1140,71,40,C.accent,true);
 rows(s,[['定义任务','明确目标、范围、约束和不能改变的行为。'],['组织执行','按可交付切片分工，用依赖关系决定执行顺序。'],['核对结果','结合测试、差异审查与人工判断，确认交付边界。']],332,102);
}
// 03
{
 const s=slide('轻量规则与关键门控','把上下文留给任务事实，把流程约束放在关键决策点',
 '大量流程指令会占用上下文并增加维护成本，因此项目规则应简洁、明确且适用。但规则精简不意味着删除系统约束、必要验证或人工确认。工具名可以更换，需求对齐、产物可检查、验证和最终把关仍构成工作链路。这里不对工具价格或模型能力作比较。');
 text(s,'规则保持精简',71,236,520,60,35,C.accent,true);
 text(s,'只加载当前任务需要的背景\n优先复用已有接口和实现\n删除重复说明与无意义抽象',72,323,528,188,29);
 text(s,'门控保持明确',690,236,520,60,35,C.accent,true);
 text(s,'实现前核对 Spec\n实现后提供验证证据\n交付前由人审查整体改动',691,323,520,188,29);
 bottom(s,'工具按习惯选择；产物和通过条件需要在团队内保持一致。');
}
// 04
{
 const s=slide('完整 Coding SOP','每个阶段都留下可供下一阶段使用的明确产物',
 '对齐可使用 grill-me 或 grill-with-docs。to-spec 将结果形成规格，人工确认后才进入拆分。to-tickets 生成垂直切片和依赖关系。implement 可由每个 ticket 对应的执行者在隔离工作目录中完成，内部执行 TDD 和代码审查。所有切片集成后还需 PR 级审查和人工 CR。这些是工作流中的 skill 名称，不是通用 Shell 命令。');
 table(s,[['阶段','核心动作','产物 / 门控'],['需求对齐','逐问澄清边界、约束和取舍','确定的问题定义'],['Spec','固化行为与验收标准','人工确认 ①'],['Tickets','按可交付行为垂直拆分','切片 + 依赖 DAG'],['Implement','隔离实现，执行 TDD 与审查','代码 + 验证证据'],['PR 与人工 CR','集成审查，再由人判断','人工确认 ②']],[240,482,430],{h:384});
}
// 05
{
 const s=slide('轻流程与完整流程','按影响范围、边界确定性和验证成本选择',
 '单文件改动并不自动属于低风险。一个中断处理函数、内存边界或公共协议字段，即使只改一行，也可能需要完整流程。轻流程适合边界清楚、局部、验证成本低的任务。两种流程都保留实现前方案确认以及实现后的测试。实际执行遵循项目已建立的授权约定，避免对同一已确认范围反复确认。');
 table(s,[['条件','轻流程','完整流程'],['任务边界','局部、明确、依赖少','跨模块或关键行为不确定'],['执行组织','Main Agent 完成','Spec → tickets → 隔离执行'],['实现前','简短方案与确认','完整 Spec 人工确认'],['实现后','相关测试 + 差异审查','切片测试 + 集成验证 + PR 审查']],[231,421,500],{h:345});
 bottom(s,'中断、并发、内存、协议兼容等关键改动，应按实际风险升级流程。',C.gold);
}
// 06
{
 const s=slide('需求对齐：把未知变成问题','grill-me / grill-with-docs 用逐问方式补齐上下文',
 '不要把可能原因当成已知事实。先描述触发场景、期待行为、实际行为和约束，再让 Agent 列出缺失信息。grill-with-docs 可在对齐过程中记录 ADR 和术语表，避免多轮对话中术语变化或决策丢失。ADR 是架构决策记录，应包含选项、选择原因以及适用边界。');
 rows(s,[['现象与边界','什么输入触发？期望是什么？哪些场景不受影响？'],['系统约束','时序、资源、兼容性和修改范围有哪些限制？'],['工程取舍','哪些选项可接受？选定方案的代价由谁确认？'],['收敛条件','关键未知项已解决，或形成有负责人和验证方法的待办。']],219,99);
}
// 07
{
 const s=slide('Spec：第一道人工门控','to-spec 将对话结论变成可执行、可评审的约定',
 'Spec 需要既描述要做什么，也描述如何判定完成。人工评审重点是需求是否正确、限制是否合理、关键取舍是否可接受、测试是否覆盖关键失败模式。模糊的“更稳定”“性能更好”不能直接作为验收标准；若缺参数，应指定参数的确定方式，而不是让 Agent 自行编造。');
 table(s,[['必需内容','审查问题'],['目标与非目标','本次解决什么？哪些行为不在范围内？'],['行为与接口','成功、失败、边界输入分别如何处理？'],['约束与取舍','时序、内存、兼容性要求是否可实现？'],['验收与验证','哪些检查能证明满足要求？在什么环境执行？'],['风险与退出','依赖什么假设？失败后如何恢复或回退？']],[345,807],{h:381});
}
// 08
{
 const s=slide('Ticket：按行为垂直切片','每个切片交付一段可验证的能力，并声明依赖',
 '垂直切片应跨越完成某个行为所需的实现与测试，而不是把所有头文件、所有实现、所有测试分别分给三个 Agent。独立交付指切片有明确行为和验收价值；存在依赖时仍需等待上游满足。若多个 ticket 不断修改同一接口，应先稳定契约或串行执行。');
 text(s,'水平拆分',70,231,520,57,34,C.muted,true);
 text(s,'任务 A：写所有接口\n任务 B：补所有实现\n任务 C：最后写测试',71,311,530,161,29);
 text(s,'垂直切片',684,231,523,57,34,C.accent,true);
 text(s,'任务 A：溢出可检测 + 测试\n任务 B：溢出可恢复 + 测试\n任务 C：目标场景回放 + 验证',685,311,530,161,29);
 bottom(s,'一个 ticket 至少写清：行为、文件边界、依赖、验收、验证命令。');
}
// 09
{
 const s=slide('依赖关系决定并行边界','DAG 是无环依赖图；可开始的任务必须已满足全部前置条件',
 '下面是教学依赖图。A 先建立观测与计数行为，B 在其基础上处理满队列策略，C 使用可观测接口组织回放。B 和 C 可并行的前提是接口稳定且文件责任不冲突；否则继续拆分或串行。D 需要在整合版本上执行。worktree 只隔离文件与分支状态，不能消除逻辑依赖。');
 code(s,[
 '# 教学依赖图：箭头表示前置条件，不代表真实执行结果',
 'A  溢出观测与计数 + 单元测试',
 '└─ A 验收后',
 '   ├─ B  满队列策略 + 边界测试',
 '   └─ C  输入回放 + 统计核对',
 '      B、C 完成并集成后',
 '      └─ D  目标板验证 + PR 整体审查',
 '# B、C 仅在接口和文件职责可分离时并行'
 ],{step:41,size:25});
 bottom(s,'依赖未满足、共享接口变化或审查积压时，暂停派发新任务。',C.gold);
}
// 10
{
 const s=slide('隔离执行与任务交接','一个 ticket 对应一个执行上下文，用 worktree 隔离修改',
 '协调者负责派发、依赖状态和集成。执行者只领取本 ticket 必要的上下文，包括确认的 Spec、接口契约、允许修改的文件、相关代码和验收条件。worktree 不是权限沙箱；环境变量、外部服务、共享输出目录和设备仍可能发生冲突。集成必须基于明确版本重新运行检查。');
 table(s,[['交接项','必须说明'],['输入','已确认 Spec、ticket、接口和相关代码版本'],['责任','允许修改的文件、共享资源、不能修改的行为'],['执行','独立工作目录与分支，明确构建和测试环境'],['输出','提交、测试记录、审查结论、未解决事项'],['集成','按依赖顺序整合，在同一版本上重新验证']],[258,894],{h:380});
}
// 11
{
 const s=slide('Implement 内部循环','TDD：先确认测试能捕捉目标行为，再实现并整理',
 'RED 需要因缺少目标行为而失败，环境报错不算有效 RED。GREEN 用最小实现满足测试，然后在验证保护下整理代码。代码审查发现问题后，必要时增加失败用例并修复。测试是否足够需要结合变更风险判断。对无法在主机模拟的中断和 DMA 时序，必须保留目标板验证项。');
 rows(s,[['RED：定义失败证据','编写针对目标行为的测试，确认失败原因与需求对应。'],['GREEN：完成最小实现','优先复用现有能力，让目标测试通过。'],['REFACTOR：控制改动规模','清理重复与多余抽象，保持测试通过。'],['REVIEW：检查剩余风险','审查接口、边界和副作用；修复后重跑受影响检查。']],214,101);
}
// 12
{
 const s=slide('实现循环伪代码','显式区分测试失败、环境阻塞与完成；循环需要停止条件',
 '所有函数均为概念伪代码。预算可以是时间、迭代次数或连续失败上限，由项目定义。环境阻塞必须报告，不能把未执行测试当成通过。这里将本地审查通过定义为切片就绪，后续仍需集成和人工审查。');
 code(s,[
 '# 概念伪代码：budget 是项目约定的迭代预算',
 'while budget.has_remaining():',
 '    run = verify(ticket)           # 运行验收检查并保留原始结果',
 '    if run.blocked: return BLOCKED # 环境缺失时停止，不伪报通过',
 '    if run.failed: fix_minimal(run) # 只修复有失败证据支撑的问题',
 '    else:',
 '        review = inspect_diff()    # 核对边界与非预期副作用',
 '        if review.clear: return READY_FOR_INTEGRATION',
 '        fix_confirmed(review)      # 先复核意见，再做必要修改',
 '    budget.consume()               # 防止无效修复无限循环',
 'return NEEDS_DECISION               # 附失败证据与待决定的问题'
 ],{step:34,size:23});
}
// 13
{
 const s=slide('控制无意义代码','ponytail 的审查思路：新代码存在的必要性必须说得清',
 '审查新增代码时先问是否真的需要该逻辑，再检查已有实现和标准库。避免只会增加阅读负担的包装、没有实际扩展需求的接口和重复的防御逻辑。但是，对于硬件输入、协议数据、内存边界、错误返回值的必要检查不能因为追求短 diff 而删除。注释应解释意图、契约、约束和失败处理。');
 rows(s,[['确认必要性','这段逻辑对应哪个需求、失败模式或已确认约束？'],['优先复用','代码库或标准库是否已有满足条件的实现？'],['减少额外层次','接口、配置项和封装是否解决了当前存在的问题？'],['保留有用注释','解释时序、所有权、边界与失败策略，避免重复代码字面。']],214,101);
}
// 14
{
 const s=slide('多模型交叉审查','使用干净上下文审查同一版本，将意见归并后再判断',
 'Ensemble Review 指让不同模型交叉审查同一段改动。统一输入应包含当前 diff、已确认 Spec、必要周边代码和测试证据；减少实现过程中的自我辩解上下文。多个模型可能有共同盲区，意见数量不是正确性证据，也不能保证发现全部缺陷。每条意见应复核定位、触发条件、影响与可行修复。');
 text(s,'同一 Spec + 同一 diff + 相同验收要求',69,217,1144,62,36,C.accent,true);
 text(s,'独立审查 A    独立审查 B    独立审查 C',71,315,1130,61,34,C.fg,true);
 text(s,'归并重复意见 → 复核证据 → 修复 → 重新验证',71,412,1130,63,33,C.fg,true);
 text(s,'人工决定接受、驳回或补充验证',72,514,1126,59,34,C.accent,true);
 bottom(s,'“多个模型都说没问题”不能替代测试证据和人的工程判断。',C.gold);
}
// 15
{
 const s=slide('PR 级审查与人工 CR','切片通过后，仍需审查整合版本的系统行为',
 '局部 ticket 审查可能遗漏共享状态、接口语义和初始化顺序等跨切片问题。PR 级审查围绕整体 diff 与 Spec，确认集成行为和回归影响。人工 CR 是第二道门控，负责判断取舍、证据是否充分以及剩余风险是否可接受。合并、部署和发布按团队授权执行，不因本地测试通过而自动视为已发布。');
 table(s,[['层级','关注内容','通过依据'],['Ticket 审查','本切片行为、边界与改动必要性','局部测试与审查问题关闭'],['PR 整体审查','跨模块接口、共享状态和回归','整合版本的验证证据'],['人工 CR','工程取舍、证据与残余风险','明确接受、退回或补充验证'],['交付','版本、配置、构建与回退说明','可复现的交付记录']],[229,494,429],{h:330});
 bottom(s,'局部通过不等于整体通过；未执行验证应保留为“未验证”。');
}
// 16
{
 const s=slide('Review 带宽与并发控制','派发速度应匹配人的审查能力',
 '同时打开更多 Agent 会提高代码进入审查队列的速度，但不必然提高交付速度。应观察待审数量、等待时长和人工处理能力，根据队列积压调整并发。给每个交付包提供需求映射、测试结果和已归并的意见，可以减少人工阅读重复内容的时间。这里只给出定性控制原则，不提供未经测量的固定并发上限。');
 rows(s,[['限制在制任务','只派发依赖已满足、责任清楚且有审查容量的任务。'],['减少待审体积','保持小切片与短 diff，避免顺手重构扩大审查面。'],['压缩重复阅读','交付时提供需求映射、失败条件、测试摘要和未决项。'],['积压时先清队列','暂停派发，优先处理已有审查和集成问题。']],214,101);
}
// 17
{
 const s=slide('教学案例：UART 接收队列积压','目标是演示 SOP 的使用；以下现象和条件均为假设',
 '假设在持续 UART 输入和高负载任务并存时，接收队列达到容量上限。第一步仍是确认这是否为真实设备行为。本案例用来演示需求、切片和验证的组织方法，不能作为驱动根因结论。候选原因包括消费者处理不及时、输入突发或交接错误，均需用可区分原因的证据验证。');
 table(s,[['项目','本案例的教学设定'],['待确认现象','持续输入与任务高负载并存时，队列可能积压'],['待验证方向','消费不及时、输入突发、数据交接或所有权问题'],['本次目标','明确满队列行为，并让丢弃与恢复可观测'],['修改边界','不变更线上协议；保留中断执行预算约束'],['未知项','实际负载、缓存策略、资源预算和板端结果']],[269,883],{h:381});
}
// 18
{
 const s=slide('案例 Spec 与验收设计','先约定允许的行为，再决定修改方法',
 '以下验收是教学设计。满队列时采用何种策略必须由实际产品需求决定，丢新数据、丢旧数据、流控或背压并非普遍可互换。若产品要求无损，则必须重新设计吞吐与流控，不能直接选择丢弃。时间上限、压力持续时间和输入速率在板型、测量条件确认后填写。');
 table(s,[['验收项','待执行检查','运行环境'],['正常输入','输入输出对应，未出现非预期丢弃','主机 + 目标板'],['满队列','按确认策略处理，统计与实际结果一致','主机边界测试'],['恢复行为','积压解除后可继续接收，错误状态可恢复','主机 + 目标板'],['执行预算','记录中断 / 任务时间，核对项目预算','目标板测量'],['回归范围','协议、低负载路径和复位行为保持约定','集成验证']],[236,682,234],{h:382,size:23});
}
// 19
{
 const s=slide('案例伪代码：满队列处理','教学策略：保留已排队数据、丢弃新项并计数；须经需求确认',
 '这是抽象行为示例，不是可直接用于 FreeRTOS 的代码。真实实现要选择 ISR 安全的接口，正确配置中断优先级、调度通知、内存可见性以及缓冲区生命周期。统计加法的并发安全和溢出处理也需要设计。无板端测量时不能声称满足中断执行预算。');
 code(s,[
 '# 伪代码：帧或缓冲区所有权必须已定义，避免悬空引用',
 'on_rx_item(item):',
 '    result = queue.try_push(item)   # 非阻塞入队；真实接口须适配中断上下文',
 '    if result == FULL:',
 '        dropped.add(1)              # 概念计数；原子性与溢出策略需单独设计',
 '        release_if_owned(item)      # 仅在本路径持有所有权时释放',
 '        return DROPPED              # 明确丢弃，不伪报接收成功',
 '    if result != OK:',
 '        return record_error(result) # 其他错误需单独记录，不能都归为队列满',
 '    signal_consumer_if_needed()     # 按平台要求触发消费和调度',
 '    return ACCEPTED                 # 仅表示入队成功，不代表整帧业务成功'
 ],{step:34,size:23});
}
// 20
{
 const s=slide('案例交付包','把改动、验收和当前证据关联起来，便于人工 CR',
 '教学交付包可以采用如下目录职责。真实目录名称和命令依据项目决定。测试记录需要包含版本、工具链、配置、命令、结果和日志位置。主机测试通过仅说明对应逻辑在主机环境满足测试，不能覆盖实际中断、DMA 和硬件时序。没有运行过的验证一律保持未执行状态。');
 code(s,[
 '# 教学目录示意：名称可调整，产物责任应保留',
 'change/',
 '├─ spec.md             # 目标、取舍与验收条件',
 '├─ tickets/            # 各切片责任、依赖和完成状态',
 '├─ diff-summary.md     # 修改位置与需求映射',
 '├─ verification.md     # 版本、环境、命令及真实结果',
 '├─ review.md           # 归并后的意见、处置与未决项',
 '└─ recovery.md         # 回退前提与恢复步骤'
 ],{step:41,size:25});
 bottom(s,'本案例未执行实际测试；主机检查与目标板检查须分别记录。',C.gold);
}
// 21
{
 const s=slide('常见偏差与处理方式','先定位产物和通过条件的缺口，再调整执行方式',
 '可用这张表进行任务复盘。不断改错方向常对应边界不明确；多个 Agent 同时改接口说明依赖或责任未分清；测试全绿但集成失败说明验收层次不足；review 意见太多需要归并与证据复核。不能仅通过继续增加提示词和并发来处理这些问题。');
 table(s,[['表现','优先检查','处理动作'],['越改越偏','Spec 是否含边界和非目标','回到对齐，修订后确认'],['并行互相覆盖','文件责任与接口依赖','稳定契约，调整拆分'],['局部通过但集成失败','检查是否覆盖整合版本','补集成验证并重审'],['Review 意见过载','重复意见与缺证据结论','归并、复核、按风险处理'],['没有设备仍写“通过”','结果状态是否区分未知','保留未验证项并交接']],[317,436,399],{h:383,size:23});
}
// 22
{
 const s=slide('项目中的第一版 SOP','选一个边界清楚的任务，运行完整链路并保留产物',
 '建议从一个可复现的局部任务开始，定义适合团队的任务模板和验收记录。首次运行可由一个主 Agent 完成，不必为了流程形式增加并行。只有当切片独立且审查容量允许时再并行。复盘时记录返工位置、未解决风险和审查等待情况，再决定精简或增加什么约束。',true);
 text(s,'对齐需求 → 确认 Spec → 拆分与实现',70,238,1136,77,42,'#70D4C3',true);
 text(s,'验证结果 → PR 审查 → 人工把关',70,340,1136,77,42,C.white,true);
 text(s,'先保证每一步有明确产物，再扩展并行规模。',72,478,1128,63,31,'#AAC7C6');
 text(s,'配套 HTML：流程图解、可交互演示、模板与注释伪代码',72,587,1128,53,25,'#AAC7C6');
}

await fs.mkdir(path.join(build,'previews'),{recursive:true});
await fs.mkdir(path.join(build,'final'),{recursive:true});
await fs.writeFile(path.join(build,'deck-outline.json'),JSON.stringify(metas,null,2));
const candidate=path.join(build,'candidate.pptx');
await(await PresentationFile.exportPptx(P)).save(candidate);
console.log('DRAFT_EXPORTED',P.slides.items.length);
const version=Date.now(),final=path.join(build,'final',`coding-sop-${version}.pptx`);
const out=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:python,
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit',...tableOwners.flatMap(n=>['--require-native-table-slide',String(n)])],
 fontPolicy:{basis:'design',families:[font]},requiredNativeTableOwnerSlides:tableOwners,verifyArtifactToolImport:true,
 receiptPath:path.join(build,`validation-${version}.json`)});
console.log('FINALIZED',JSON.stringify({path:out.finalPath,integrity:out.packageIntegrity.status,layoutFindings:out.presentationLayout.findingCount}));
const F=await PresentationFile.importPptx(await FileBlob.load(final));
for(let i=0;i<F.slides.items.length;i++){
 const png=await F.export({slide:F.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,'previews',`final-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
 console.log('RENDERED',i+1);
}
await fs.copyFile(final,path.join(root,'Coding SOP 分享.pptx'));
console.log('DELIVERED',path.join(root,'Coding SOP 分享.pptx'));
