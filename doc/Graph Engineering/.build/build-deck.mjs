import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const ROOT = 'C:/DATA/personal/ai-tools/doc/Graph Engineering';
const BUILD = path.join(ROOT, '.build');
const SKILL = 'C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.903.11416/skills/presentations';
const PYTHON = 'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const {finalizePresentation} = await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')));
const p = Presentation.create({slideSize:{width:1280,height:720}});
const C = {bg:'#F7F5EF', ink:'#162C39', sub:'#52646D', orange:'#C85922', dark:'#102A38', light:'#F7F5EF', mint:'#97D7CD'};
const FONT = 'Microsoft YaHei';
const S = {
 original:'https://x.com/AnatoliKopadze/status/2080668775796314331',
 agents:'https://www.anthropic.com/engineering/building-effective-agents',
 research:'https://www.anthropic.com/engineering/multi-agent-research-system',
 langgraph:'https://docs.langchain.com/oss/python/langgraph/workflows-agents',
 workflows:'https://code.claude.com/docs/en/workflows',
 intro:'https://claude.com/blog/introducing-dynamic-workflows-in-claude-code'
};
const records=[];
function text(s,str,x,y,w,h,size=28,color=C.ink,bold=false){
 const t=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 t.text=str;t.text.style={typeface:FONT,fontSize:size,color,bold,autoFit:'none',wrap:'word',insets:{left:0,right:0,top:0,bottom:0}};return t;
}
function slide(title, note, {dark=false,source='原文解读',refs=[S.original]}={}){
 const s=p.slides.add();s.background.fill=dark?C.dark:C.bg;
 text(s,title,68,49,1144,80,44,dark?C.light:C.ink,true);
 const footer = source.replace(/基于 Anatoli Kopadze 文章的中文技术分享/g,'中文技术分享').replace(/原文解读/g,'概念讲解').replace(/原文方法/g,'方法说明').replace(/原文适用性判断/g,'适用性判断').replace(/原文成本提醒/g,'成本提醒').replace(/官方文档补充/g,'产品说明').replace(/原文/g,'方法说明');
 text(s,footer,70,666,1000,28,16,dark?'#B3C5CA':C.sub);
 text(s,String(p.slides.items.length).padStart(2,'0'),1160,662,60,32,18,dark?C.mint:C.orange,true);
 const cleanNote = note.replace(/原文第[0-9、]+节[：：]?/g,'').replace(/原文/g,'').replace(/图示取自[^。]*。/g,'').replace(/示意图取自[^。]*。/g,'').replace(/官方文档已核实dynamic workflows[：：]?/g,'Dynamic workflows：').replace(/官方当前/g,'当前').replace(/产品细节以[^。]*。/g,'').replace(/没有采用[^。]*。/g,'');
 s.speakerNotes.textFrame.setText(cleanNote+'\n教学示例不代表实际运行结果。');
 records.push({title,note,refs});return s;
}
function rows(s,items,{y=185,gap=112,dark=false}={}){
 items.forEach((a,i)=>{text(s,a[0],70,y+i*gap,310,58,30,dark?C.mint:C.orange,true);text(s,a[1],410,y+i*gap,795,86,28,dark?C.light:C.ink);});
}
async function picture(s,n,x,y,w,h){s.images.add({blob:new Uint8Array(await fs.readFile(path.join(BUILD,`source-${n}.jpg`))),contentType:'image/jpeg',alt:'Graph Engineering 概念图',fit:'contain',position:{left:x,top:y,width:w,height:h}});}
function table(s,values,widths,top=190,height=370,size=26){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:70,top,width:1140,height,columnWidths:widths,values});
 t.borders.assign({fill:'#D9DFDC',width:1,style:'solid'});
 for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.dark:(r%2===1?'#FFFFFF':C.bg);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?C.light:C.ink,bold:r===0,autoFit:'none'};
 }
 return t;
}

// 01
{
 const s=slide('Graph Engineering','开场：今天的主题是如何组织AI工作的依赖关系。听众应能画出自己的工作流，区分可并行任务和必须等待的步骤，并为汇总结果定义验收条件。约25分钟分享，可在第6页切到配套HTML演示延迟，在第11页演示静默失败。',{dark:true,source:'基于 Anatoli Kopadze 文章的中文技术分享'});
 text(s,'AI Agent 工作流的依赖、并行与验证',72,204,1090,140,52,C.light,true);
 text(s,'让任务按真实依赖执行，让结论经得起外部检验。',74,393,1100,100,30,C.mint);
 text(s,'以代码审查和嵌入式开发为例',74,558,1080,76,23,'#B3C5CA');
}
// 02
{
 const s=slide('单次调用、循环与图','原文第1节将loop扩展为graph of loops。单次调用、串行链和循环都可以包含在执行图里。这里按工程复杂度解释，不是彼此取代的时代划分。图不一定是DAG，如果有反馈边就有环。用于耗时估计和调度时可以将局部循环限定次数或封装为有界节点。本文的Graph Engineering是工作流设计方法，并不要求图数据库。',{source:'原文解读 + 概念补充'});
 rows(s,[['单次调用','一个请求得到一个结果，适合边界清楚的小任务。'],['循环 Loop','产出、检查、修正，直到满足标准或触及上限。'],['依赖图 Graph','明确多个任务的依赖，安排分支、汇合和反馈。'],['图中的循环','各分支可以独立迭代，汇合后仍需检查全局一致性。']],{y:172,gap:112});
}
// 03
{
 const s=slide('节点与边','原文第2节将节点描述为一个任务，将边描述为上游输出进入下游输入。工程补充：节点也可以是确定性代码、工具调用或人工检查，并非每个节点都需要模型。此处是执行依赖图；知识图谱的节点通常是实体、边是事实关系。两者可以结合，但解决的问题不同。');
 await picture(s,3,450,167,760,430);
 text(s,'节点 Node',70,193,350,54,32,C.orange,true);
 text(s,'一个职责明确的任务\n可以由模型或代码执行',70,255,350,106,27);
 text(s,'边 Edge',70,390,350,52,32,C.orange,true);
 text(s,'传递结果或约束顺序\n下游满足条件后启动',70,454,350,106,27);
 text(s,'本次讨论执行依赖图。知识图谱描述实体与事实关系。',70,607,1140,40,24,C.sub);
}
// 04
{
 const s=slide('节点契约','原文第2节：一个节点必须有受约束的任务、明确输入和固定输出形状。以下是工程教学示例。输入以不可变commit固定代码版本。输出将finding与执行status分开，无发现不等于没运行。生产中还需校验字段、枚举、来源存在性，失败时有限重试。schema正确只是结构正确，不保证结论真实。',{source:'原文方法 + 教学示例'});
 rows(s,[['职责','审查一个源文件的错误处理，只提交发现与证据。'],['输入','job_id、commit、file、审查规则和只读权限。'],['输出','status、findings[]、evidence、error、attempt。']],{y:170,gap:102});
 text(s,'{ job_id: "J07", status: "ok", findings: [] }',72,510,1140,55,29,C.orange,true);
 text(s,'空 findings 表示检查后无发现。没有返回结果需要单独报错。',72,581,1140,50,25,C.sub);
}
// 05
{
 const s=slide('虚假依赖测试','原文第3、4节提出：后一个任务是否真正需要前一个任务的结果？例子是分别审查文件A和B。这里的关键补充是共用文件、API配额、硬件等资源也会形成约束。没有数据依赖只说明有并行的可能，还不能直接证明运行时无冲突。');
 await picture(s,5,440,154,770,433);
 text(s,'B 要消费\nA 的结果吗？',70,201,346,110,34,C.orange,true);
 text(s,'需要：保留先后顺序。\n\n不需要：再检查共享资源，\n确认后才并行。',70,341,348,198,27);
 text(s,'边的存在应当有理由：数据、控制条件或资源约束。',70,608,1140,40,25,C.sub);
}
// 06
{
 const s=slide('并行收益取决于关键路径','工程推导，不是原文性能实测。假设先做准备5秒，再执行三个互相独立的任务，耗时分别为20、30、40秒，最后汇总10秒。资源足够且无额外调度开销时，串行105秒，并行55秒，约1.91倍。若并行新增协调开销15秒，则70秒，约1.50倍。一般DAG的无资源争用下界是关键路径长度，有限并发还受总工作量/并发数约束。循环需先设定展开范围。',{source:'工程推导 · 理想化教学数值'});
 text(s,'准备 5s    独立任务 20s / 30s / 40s    汇总 10s',70,177,1140,60,29);
 text(s,'105s', seventy(),277,480,118,88,C.ink,true);
 text(s,'串行：5 + 20 + 30 + 40 + 10', seventy(),420,530,60,26,C.sub);
 text(s,'55s',720,277,490,118,88,C.orange,true);
 text(s,'理想并行：5 + max(20, 30, 40) + 10',650,420,565,70,26,C.sub);
 text(s,'加入 15s 额外协调开销后为 70s。并发上限和资源争用还会增加耗时。',70,554,1140,77,27);
}
function seventy(){return 70;}
// 07
{
 const s=slide('菱形工作流','原文第5节的核心模式是fan out、reduce、synthesize，并在汇总前加入验证。拆分任务后，不同worker处理互补角度。普通代码完成去重和结构化整理。独立验证者核查证据。最后汇总通过检查的结果，但报告仍须披露失败任务和未验证结论。示意图取自原文，不表示只有五个worker才成立。');
 await picture(s,2,395,157,815,460);
 text(s,'分发 Fan-out\n让独立任务同时进行',70,186,300,103,29,C.orange,true);
 text(s,'归并 Reduce\n用代码整理和去重',70,335,300,103,29);
 text(s,'综合 Synthesize\n基于证据形成报告',70,483,300,107,29);
}
// 08
{
 const s=slide('汇总前的数据整理','原文第5、7节建议用普通代码reduce，并在大规模输出时分层fan-in。补充：按来源去重会误删同一来源的不同结论，应采用任务ID、文件位置、规则等适当的业务键。分批摘要也可能丢掉少数异常，因此保留证据引用和原始产物。简单本地代码不消耗模型推理token，但系统存储和后续读取仍有成本。',{source:'原文方法 + 工程补充'});
 rows(s,[['先校验','job_id 是否匹配？格式和状态是否合法？'],['再去重','按文件位置与问题规则等业务键合并重复发现。'],['再压缩','结果过多时分组摘要，保留证据 ID 和异常项。'],['最后综合','只把必要证据交给汇总节点，注明覆盖范围。']],{y:173,gap:110});
}
// 09
{
 const s=slide('独立验证节点','原文第6节强调验证者使用独立上下文，避免继承生产者的自我解释。独立不等于没有必要材料：验证者仍需任务要求、待审结论、代码版本、源文件和验收标准。原文给出正确性、时效性、来源真实性三个视角。工程补充：多数票不能代替测试，多个模型可能有相关性偏差。结论失败后可拒收或有限返工。',{refs:[S.original,S.agents]});
 rows(s,[['给它什么','待验证结论、原始证据、验收标准。'],['避免什么','把生产者整段对话当成既定事实传下去。'],['怎样检查','尝试反驳结论，检查来源，执行可复现验证。'],['怎样裁决','通过、拒绝或证据不足，并记录理由。']],{y:174,gap:110});
}
// 10
{
 const s=slide('三类容易被掩盖的故障','原文第7节列出三类问题：输出集中导致上下文溢出、共享资源导致伪独立、worker失败而最终报告看似完整。此表将原文对策转为工程动作。分层摘要仍需要追溯原始证据。独立worktree防止覆盖，但不保证合并没有语义冲突。完整性检查不能只数返回条数，还应验证job_id集合。');
 table(s,[['故障','表面现象','工程处理'],['上下文过载','最终节点接不住所有输出','分层汇总，保留来源索引'],['隐藏资源依赖','并行任务覆盖文件或抢设备','隔离工作区，限定资源并发'],['静默节点失败','少了输入却生成完整报告','核对任务 ID，明确失败和缺项']],[255,380,505],190,355,26);
 text(s,'并行扩大了吞吐量，也扩大了对完整性和可观测性的要求。',70,581,1140,65,27,C.orange,true);
}
// 11
{
 const s=slide('任务完成与结果完整性','工程补充。每个job用固定ID，完成指进入success、failed、cancelled等终态，不代表全部成功。明确区分成功且无发现、超时、schema失败、验证不通过。重复回包不能弥补缺失ID。尝试次数、截止时间、预算都要有上限。被判定为代码缺陷是发现，不应自动触发worker重试。使用配套HTML切换失败演示。',{source:'工程补充 · 运行状态与 fan-in 检查'});
 text(s,'任务集：A、B、C',70,180,470,58,36,C.orange,true);
 text(s,'收到：A 成功、B 无发现、C 超时',70,264,1130,65,36);
 text(s,'结论：2 / 3 完成有效检查，C 待补查',70,367,1130,75,40,C.orange,true);
 text(s,'先核对 ID 集合和状态，再决定重试、输出部分报告或停止。\n有限重试只针对可恢复错误。所有报告都应披露未覆盖范围。',70,499,1130,116,29);
}
// 12
{
 const s=slide('Anchors：连接外部证据','原文第9节强调拓扑结构不自动带来真实可靠的结论。节点互相看同一套报告，可能只是自洽。工程中的锚点可以是实际运行的测试、原始日志和固定验收规则。以下嵌入式例子是假设场景，不是项目实际记录。测试通过也只证明被测条件下的结果，需要考虑覆盖范围。');
 await picture(s,1,449,173,755,426);
 text(s,'真实运行',70,190,340,48,31,C.orange,true);
 text(s,'构建退出码、测试产物\n原始日志、板上测量',70,249,340,100,27);
 text(s,'固定标准',70,389,340,48,31,C.orange,true);
 text(s,'固件版本、测试条件\n不可由优化器自行放宽',70,450,340,100,27);
 text(s,'验证的是外部事实，而非多个节点对同一份报告的赞同。',70,610,1140,39,24,C.sub);
}
// 13
{
 const s=slide('适用边界','原文第8节：图适合有宽度的工作，小任务、真正串行的任务以及仍在探索的任务可能更适合单Agent或简单循环。图本身可以包含串行结构，所以这里讨论是否值得增加并行编排。补充：流程中设置少量必要人工关卡是合理的，不等于必须每一步审批。',{source:'原文适用性判断'});
 table(s,[['任务特征','更合适的起点'],['多个独立模块，验收规则相同','有限并行的审查工作流'],['一个缺陷，尚未明确复现条件','单 Agent 对话式排查'],['编译后才能烧录，烧录后才能测量','保留真实顺序的流程'],['多个方案，可在固定标准下比较','并行探索，再独立评估']],[620,520],179,405,26);
 text(s,'判断依据是依赖关系和收益，不是 Agent 数量。',70,612,1140,41,26,C.orange,true);
}
// 14
{
 const s=slide('嵌入式案例：驱动审查','教学案例，未运行用户工程。目标是对同一提交的驱动文件做只读错误处理审查。可以对UART、SPI、I2C文件分别分发任务，输出统一finding契约。为了避免跨文件知识缺失，各worker应获得相关头文件和接口定义。归并处理重复问题，独立验证检查完整调用链或最小复现。最后输出带覆盖率的清单，需改代码时再进入修复、构建和测试阶段。',{source:'教学案例 · 无实际项目测试结果'});
 rows(s,[['输入范围','固定 commit，选定 UART / SPI / I2C 驱动文件。'],['并行工作','各自审查返回值、超时路径和资源释放，记录证据。'],['归并与验证','去重后检查调用链，复核问题是否可触发。'],['输出报告','问题、证据、影响范围、未检查文件和下一步验证。']],{y:178,gap:110});
}
// 15
{
 const s=slide('FreeRTOS 场景里的真实依赖','教学案例，不描述任何实际板卡故障。对固定快照进行不同主题的只读检查通常可以并行，但跨模块约束必须进入上下文。并发烧录同一板卡、写同一构建目录会冲突。测试日志若来自旧固件，也不是当前补丁的证据。图只安排工作，无法消除物理资源排他性。',{source:'教学案例 · 资源和版本约束'});
 table(s,[['候选任务','并行条件或必须等待的原因'],['查队列调用与查超时处理','只读同一快照，提供相关接口上下文'],['两个模块同时生成补丁','独立工作区，合并后统一回归'],['两项测试使用同一块板卡','独占租约或排队，避免互相改状态'],['补丁、编译、烧录、板上测试','后一步依赖前一步产物，保留顺序']],[490,650],181,414,26);
 text(s,'代码版本、固件哈希和日志来源必须匹配。',70,612,1140,36,26,C.orange,true);
}
// 16
{
 const s=slide('一份最小 Graph Spec','这是框架无关的自然语言任务规格，不是可直接执行的SDK代码。限制参数是教学起点，不是通用最佳值。范围、并发、超时、失败策略、验收标准、输出目录都应具体。试点先只读，避免将发现问题和自动修复混在一次尚未验证的流程里。HTML中提供可复制的完整版本。',{source:'工程补充 · 可迁移的任务规格'});
 rows(s,[['目标与范围','审查指定 commit 下最多 12 个驱动文件，只读。'],['任务与预算','每文件一个任务，并发不超过 3，每任务最多 2 次尝试。'],['验证与失败','每个发现独立复核。超时和漏项必须出现在报告中。'],['验收与交付','逐项标注证据与覆盖状态，输出报告后结束。']],{y:172,gap:112});
}
// 17
{
 const s=slide('编排层的职责','工程伪代码，仅描述顺序。parallelBounded需要实际实现并发上限、超时及取消，runChecked需要执行schema校验与有限重试，auditCoverage核验ID集合，verifyFresh需要独立上下文和证据访问。不要把函数名误读成某个框架的真实API。对有副作用的节点，重试前必须设计幂等键或状态检测。',{source:'工程补充 · 伪代码，非特定 SDK API'});
 text(s,'jobs = plan(scope, fixed_commit)\nresults = parallelBounded(jobs, limit=3, runChecked)\ncoverage = auditCoverage(jobs, results)\nfindings = dedupe(validResults(results))\nverified = verifyFresh(findings, acceptance_rules)\nreport(verified, coverage, failed_jobs)',74,183,1120,340,29,C.ink);
 text(s,'普通代码负责状态、格式与完整性。模型负责需要判断的任务。',74,567,1120,64,29,C.orange,true);
}
// 18
{
 const s=slide('Claude Code 的产品入口','原文第10、11节提出workflow用法。官方文档已核实dynamic workflows：Claude编写JavaScript编排脚本，runtime执行subagents，任务中间结果可保存在脚本变量中。官方当前支持明确请求创建workflow，也说明ultracode入口。功能可用性受套餐、配置和管理员设置影响。这里不实际启动workflow或改变配置。产品细节以2026-09-07查阅的官方文档为准。',{source:'官方文档补充 · 核实于 2026.09.07',refs:[S.original,S.workflows,S.intro]});
 text(s,'“请创建一个 workflow，按以下范围审查代码……”',70,180,1140,99,37,C.orange,true);
 rows(s,[['执行方式','Claude 编写编排脚本，运行时调度多个 subagent。'],['需要确认','查看计划中的范围、预算、权限和失败策略。'],['复用方式','保存适用的工作流，后续通过参数调整范围。']],{y:311,gap:105});
}
// 19
{
 const s=slide('速度与成本是两笔账','原文第12节指出多Agent的总token花费会变大，调度方便并不意味着工作免费。工程补充建议按有效结果衡量收益：成功完成相同验收目标所用时间、总token、工具调用和人工复核投入。要同时控制并发峰值与总工作量。重试可能有新模型输入费用，重复派发不一定改善独立证据。没有采用原文Bun的费用与规模数字作为预算依据。',{source:'原文成本提醒 + 试点评估建议',refs:[S.original,S.workflows]});
 table(s,[['关注项','观察什么','控制方式'],['墙钟时间','关键路径、排队与重试时间','删掉虚假依赖，限制资源冲突'],['总使用量','各节点输入输出与验证开销','限制任务数、迭代数和总预算'],['有效质量','漏项、误报、证据可复现性','固定验收集，统计人工复核'],['运维负担','异常恢复与结果追踪成本','保存 job_id、版本和任务状态']],[230,475,435],183,405,24);
 text(s,'更多并行可以缩短等待，但不会自动减少总工作量。',70,612,1140,38,26,C.orange,true);
}
// 20
{
 const s=slide('试点与验收','工程落地建议。选择已知代码版本和固定问题集，先获得单Agent基线，再只增加一个并行维度，避免模型、范围、提示词同时变化导致无法归因。预先定义成功标准，不在结果不好时放宽规则。报告须包含未覆盖任务和成本。只有质量不下降且节省的等待值得新增成本，才扩大范围。',{source:'工程补充 · 小范围试点'});
 rows(s,[['建立基线','固定代码、规则和验收集，记录串行耗时与结果。'],['只改一个维度','先试 3 个并行任务，保留同一验证方式。'],['比较结果','完整性、误报、漏报、时间和成本一起看。'],['决定是否扩展','收益明确才加宽。失败先查契约、证据与资源冲突。']],{y:175,gap:112});
}
// 21
{
 const s=slide('讨论：你会删掉哪一条边？','互动题，教学答案在讲者备注中。A和B同读固定代码快照，在资源允许下可并行；C必须读取A和B的发现；D必须等待补丁；E读取D的固件产物并占用独立板卡。不要删掉C到D或D到E的真依赖。讨论额外问题：B超时是否输出部分报告，是否需要人工继续确认？由Graph Spec的失败政策决定。',{dark:true,source:'现场练习 · 建议 2 分钟'});
 text(s,'A 审查 UART 驱动       B 审查 SPI 驱动\nC 综合发现并生成补丁\nD 编译修复后的固件\nE 烧录同一块板卡并做回归',72,183,1120,270,35,C.light);
 text(s,'哪些任务可以并行？\n如果 B 没有返回，最终报告应该怎样写？',72,502,1120,113,34,C.mint,true);
}
await fs.writeFile(path.join(BUILD,'slide-content.json'),JSON.stringify(records,null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
await (await PresentationFile.exportPptx(p)).save(path.join(BUILD,'candidate.pptx'));
console.log('Draft exported: '+p.slides.items.length+' slides');
const result = await finalizePresentation({workspaceDir:ROOT,candidatePath:path.join(BUILD,'candidate.pptx'),finalPath:path.join(ROOT,'.delivery','Graph_Engineering_分享_v5.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit', ...[10,13,15,19].flatMap(n=>['--require-native-table-slide',String(n)])],requiredNativeTableOwnerSlides:[10,13,15,19],fontPolicy:{basis:'design',families:[FONT]},verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-v5.json')});
console.log(JSON.stringify(result)); await fs.copyFile(path.join(ROOT,'.delivery','Graph_Engineering_分享_v5.pptx'),path.join(ROOT,'Graph_Engineering_分享.pptx'));
await fs.mkdir(path.join(BUILD,'render'),{recursive:true});
for(let i=0;i<p.slides.items.length;i++){
 const blob=await p.export({slide:p.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(BUILD,'render',`${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
 console.log('Rendered '+(i+1));
}





