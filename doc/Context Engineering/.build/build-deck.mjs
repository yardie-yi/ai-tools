import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile, FileBlob } from '@oai/artifact-tool';

const root='C:/DATA/personal/ai-tools/doc/Context Engineering';
const build=path.join(root,'.build');
const skill='C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const python='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {finalizePresentation,applyPresentationChartFont}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
const P=Presentation.create({slideSize:{width:1280,height:720}});
const C={bg:'#081321',fg:'#EAF1F7',muted:'#A5B7C9',accent:'#52E0BB',blue:'#8DBDFF',gold:'#F8CA81',line:'#284158'};
const font='Microsoft YaHei';
const metas=[];const tableOwners=[];let uid=0;
function text(s,str,x,y,w,h,size=28,color=C.fg,bold=false){
 const q=s.shapes.add({geometry:'textbox',name:`text-${++uid}`,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none',wrap:'none',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function slide(title,subtitle,notes){
 const s=P.slides.add();s.background.fill=C.bg;
 text(s,title,64,48,1152,76,46,C.fg,true);
 if(subtitle)text(s,subtitle,66,137,1148,56,25,C.muted);
 text(s,String(P.slides.items.length).padStart(2,'0'),1168,672,50,28,17,C.muted);
 s.speakerNotes.textFrame.setText(notes||'');metas.push({title,notes});return s;
}
function rows(s,items,y=213,step=102){
 items.forEach(([h,d],i)=>{text(s,String(i+1).padStart(2,'0'),68,y+i*step,72,52,35,C.accent,true);text(s,h,161,y+i*step,1030,44,29,C.fg,true);text(s,d,162,y+44+i*step,1034,48,24,C.muted);});
}
function table(s,values,widths,{y=214,h=370,size=24}={}){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:64,top:y,width:1152,height:h,columnWidths:widths,values});
 t.styleOptions={headerRow:false,bandedRows:false};t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?'#102B35':C.bg;cell.text.style={typeface:font,fontSize:size,bold:r===0,color:r===0?C.accent:C.fg,verticalAlignment:'middle',autoFit:'none',wrap:'square',insets:{left:14,right:12,top:9,bottom:9}};
 }
 tableOwners.push(P.slides.items.length);return t;
}
function code(s,lines,{y=214,step=34,size=23}={}){
 for(let i=0;i<lines.length;i++)text(s,lines[i],68,y+i*step,1145,step,size,lines[i].trim().startsWith('#')?C.accent:C.fg);
}
function bottom(s,str,color=C.accent){text(s,str,67,611,1147,45,25,color);}

// 01：概念封面。正文标题和说明仍可编辑。
{
 const s=P.slides.add();s.background.fill=C.bg;
 s.images.add({blob:new Uint8Array(await fs.readFile(path.join(build,'cover.png'))),contentType:'image/png',fit:'cover',alt:'信息经过上下文窗口筛选的抽象概念插图',position:{left:430,top:110,width:830,height:554}});
 text(s,'Context',65,174,680,103,84,C.fg,true);
 text(s,'Engineering',65,278,700,98,76,C.fg,true);
 text(s,'面向 AI Agent 的上下文工程',70,420,830,65,34,C.accent,true);
 text(s,'原理、实现方法与嵌入式排障案例',72,499,750,48,26,C.muted);
 s.speakerNotes.textFrame.setText('建议分享约 30–40 分钟。先建立上下文的概念，再解释检索、预算、记忆和工具输出，最后使用 UART 排障教学案例串联。所有案例现象、预算数字与实现字段均为教学设计，未代表真实项目实测结果。');
 metas.push({title:'Context Engineering'});
}
// 02：定义。
{
 const s=slide('上下文工程的工作对象','在每次模型调用前，组织完成当前步骤所需的信息',
 '上下文是模型在某一次调用中能够处理的输入。工程实现要从大量外部材料中选择、组织和更新输入，同时保证任务约束与关键证据完整。项目目录、数据库和持久化记忆中的内容，只有在读取并加入请求后才进入本次模型输入。模型参数、应用状态、当前上下文属于不同层面。');
 text(s,'决定本轮看什么、以什么形式看、何时更新',67,212,1150,75,39,C.accent,true);
 rows(s,[['信息选择','挑选与当前任务、代码版本和阶段有关的内容。'],['信息组织','区分指令、证据、历史状态和输出要求。'],['信息维护','每轮更新进展，压缩历史，并记录尚未解决的问题。']],324,99);
}
// 03：概念边界。
{
 const s=slide('Prompt、RAG、Memory 与 Context','这些能力可以组合使用，分别解决不同的工程问题',
 'Prompt engineering 关注如何表达任务和行为要求。RAG 用检索到的材料支持生成。Memory 管理需要跨轮次或跨任务保存的信息。Context engineering 组织某次调用实际使用的全部输入。Harness 与 Loop 在本材料中用作运行环境与执行控制的工作划分，并非统一标准层级。');
 table(s,[['概念','主要职责','开发场景'],['Prompt','表达任务、约束和输出格式','要求输出排查步骤'],['RAG','检索相关资料并提供给模型','找当前版本的协议规格'],['Memory','保存并取回长期或阶段性信息','保留已排除的怀疑点'],['Context','装配和维护本次调用的输入','组合规则、规格、代码与日志'],['Harness / Loop','运行环境 / 执行与停止控制','工具权限 / 验证后决定下一轮']],[238,461,453],{h:394,size:24});
}
// 04：上下文组成。
{
 const s=slide('一次调用的上下文组成','程序掌握的所有信息，与模型当前可见的信息并不相同',
 '模型输入可以包括文本、图像等不同模态，这里用开发任务中常见的文本说明。权限凭据和数据库连接属于宿主运行环境，无需把密钥原文加入模型输入。工具定义占用的输入和协议封装开销也需计入预算，具体计量遵循所用接口。');
 table(s,[['组成','应提供的内容','常见遗漏'],['规则与任务','目标、修改边界、验收条件','只说“帮我修复”'],['事实证据','规格、相关代码、日志、测试记录','资料对应错误版本'],['工作状态','已做什么、结果如何、还缺什么','重复尝试已失败方案'],['工具与格式','可用工具说明、参数、返回结构','提供大量相似工具'],['示例与最近对话','必要示例、最新澄清和纠正','旧要求覆盖新要求']],[225,480,447],{h:390,size:24});
}
// 05：流水线。
{
 const s=slide('上下文装配流程','每个阶段输出明确结果，便于定位信息在哪一步丢失',
 '先从任务确定缺什么信息，再读取候选材料。宿主执行权限检查、版本筛选、去重和排序，然后按预算组装。最后核对必须信息和工具协议。模型调用后，工具输出与新发现进入记录，下一轮再次按目标筛选。不要在第一轮塞入所有可能资料后就停止管理上下文。');
 table(s,[['阶段','操作','本阶段产物'],['01  任务分析','确定当前目标和验收条件','待回答问题与缺口'],['02  获取材料','检索、读文件、查询工具','候选证据'],['03  筛选整理','权限、版本、去重和排序','可用证据集合'],['04  预算装配','保留必需项，按预算选取其余内容','模型输入请求'],['05  调用后更新','记录结果、变化与下一步','新的任务状态']],[240,480,432],{h:391,size:24});
}
// 06：按需加载。
{
 const s=slide('预加载与按需加载','稳定且必需的信息预加载，细节按当前问题读取',
 '预加载适合关键规则、项目概要和当前任务。按需加载可以先提供文件或数据的轻量索引，再由工具读相关片段。检索本身会增加调用与等待，因此小任务可直接读少量已知文件。选择依据是任务所需信息和检索成本，而不是固定偏好某一种架构。');
 text(s,'预加载',70,231,515,58,35,C.accent,true);
 text(s,'项目约束与任务目标\n当前版本与构建配置\n最新状态与验收条件',70,313,515,173,29);
 text(s,'按需加载',690,231,510,58,35,C.blue,true);
 text(s,'相关函数与调用位置\n失败时段的原始日志\n具体型号与版本的规格',690,313,510,173,29);
 bottom(s,'先读目录或摘要定位，再读能够回答当前问题的细节。');
}
// 07：检索。
{
 const s=slide('检索结果的筛选','相关性之外，还要检查权限、适用版本和证据完整性',
 '检索前以身份、项目和访问控制缩小候选范围。结果返回后仍需核验每条记录的权限和版本。代码检索可组合精确符号搜索、关键词和语义搜索，再补充周边函数或调用点。相似度不是事实可信度。检索不到足够证据时，应明确缺口，不将最相似的一段强行当成答案。');
 rows(s,[['限定范围','按项目、身份和代码版本筛选可访问材料。'],['组合搜索','函数名与错误码用精确搜索，概念问题可结合语义检索。'],['整理证据','去重、重排，必要时补充定义、调用点和前后日志。'],['核对覆盖','逐项检查关键问题是否有证据，缺失项继续检索或报告。']],208,102);
}
// 08：证据包。
{
 const s=slide('证据包的最小结构','事实、定位信息与不确定性一起进入上下文',
 '这是教学用的 YAML 风格结构。evidence_id 用于在输出中关联具体材料。version、path 与 observed_at 用于复核证据是否还适用。content 保存所需原文片段，claims 只表达该材料实际支持的结论。证据定位字段支持按需重读原文与检查适用范围。');
 code(s,[
 '# 教学结构：一条证据必须能够定位并复核',
 'evidence_id: E03             # 本任务内的唯一标识',
 'kind: test_report           # 区分代码、规格或测试记录',
 'version: build_A            # 对应的代码或文档版本',
 'path: runs/A/report.txt     # 原始记录位置，便于按需重读',
 'observed_at: run_timestamp  # 采集时间，用于判断时效',
 'content: relevant_excerpt  # 保留相关原文和必要上下文',
 'claims: [observed_failure]  # 只记录本证据能够支持的事实',
 'uncertainty: missing_trace  # 单独记录缺失证据与未知项',
 'trust: external_data       # 作为材料读取，不授予指令权限'
 ]);
}
// 09：预算，数据仅为教学配置。
{
 const s=slide('上下文预算示例','32,000 总窗口 − 6,000 输出预留 − 2,000 余量 = 24,000 输入',
 '本页数字为教学配置，不是任何模型规格。规则与任务 4,000、工具说明 2,000、状态 3,000、证据 15,000，合计 24,000 token。应使用对应模型的计数方式统计完整序列化请求，包括工具定义和消息封装。输出、推理等额度如何计入窗口取决于接口。余量不能替代实际计数。');
 const chart=s.charts.add('bar',{position:{left:66,top:208,width:715,height:350},categories:['规则与任务','工具说明','工作状态','事实证据'],series:[{name:'输入分配（token）',values:[4000,2000,3000,15000],fill:C.accent}],barOptions:{direction:'bar',grouping:'clustered',gapWidth:95},hasLegend:false,title:'输入分配（token）',titleTextStyle:{typeface:font,fontSize:25,fill:C.fg},chartFill:C.bg,plotAreaFill:C.bg,chartLine:{fill:'none',width:0},dataLabels:{showValue:true,position:'outEnd',textStyle:{typeface:font,fontSize:23,fill:C.fg}},xAxis:{textStyle:{typeface:font,fontSize:23,fill:C.fg}},yAxis:{textStyle:{typeface:font,fontSize:21,fill:C.muted}}});
 applyPresentationChartFont(chart,{fontFamily:font});
 text(s,'24,000',855,234,340,83,60,C.accent,true);
 text(s,'本次可用输入 token',857,321,340,45,25,C.muted);
 text(s,'先保留输出空间\n再给证据分配预算\n最后统计完整请求',857,409,345,143,25);
 bottom(s,'教学配置，非模型规格。实际计量与额度规则以所用接口为准。',C.gold);
}
// 10：预算选择。
{
 const s=slide('预算不足时的信息优先级','压缩可恢复的冗余，保留任务必需的信息',
 '必需内容应由任务契约定义，至少包括关键约束、当前目标、足以支持行动的证据以及工具消息协议。删除工具消息必须保持调用与结果的关联有效。预算放不下必需信息时，应改为分步处理、请求更小范围或返回缺口。不要静默截断整个请求末尾。');
 rows(s,[['固定保留','任务目标、修改边界、验收要求和关键证据。'],['优先精简','重复日志、已结束的工具输出、无关对话与过时内容。'],['按价值选取','优先选择能补齐问题覆盖的证据，再考虑 token 成本。'],['显式处理溢出','必需项仍超预算时分解任务或报告缺口，不静默删除。']],210,102);
}
// 11：工具返回。
{
 const s=slide('工具返回值也是上下文设计','返回足够支持判断的信息，并保留重读原文的入口',
 '工具输出先由宿主保存，再形成简明摘要送入模型。返回状态、总量、筛选条件和截断标记可避免将局部结果当作完整结果。失败需要错误类型和可重试性，不能用空结果掩盖异常。查询权限和实际写操作权限由工具侧执行。');
 table(s,[['场景','模型本轮需要','完整材料处理'],['搜索日志','匹配片段、时间范围、总匹配数','保留全文路径和分页入口'],['运行测试','通过 / 失败 / 未知，失败用例与版本','原始报告落盘，必要时重读'],['读取代码','函数定义、关联行号与代码版本','按需补充调用点及依赖'],['调用失败','错误类型、原因、是否可重试','区分无匹配、超时和权限不足']],[223,529,400],{h:344,size:24});
 bottom(s,'截断必须标明，空结果必须与执行失败区分。');
}
// 12：记忆分层。
{
 const s=slide('工作状态与持久化记忆','按有效期与用途保存信息，在调用前选择性读取',
 '短期状态跟踪本任务的进度和结果。长期记忆可保存用户偏好或已经确认的项目约定，必须带作用范围与更新机制。原始日志、代码和规格留在外部存储，需要时读取。将内容写入文件不会改变模型参数，也不意味着模型已经看到它。');
 table(s,[['层次','保存什么','更新与失效'],['当前工作状态','目标、已做步骤、结果、下一步','每轮更新，纠正后覆盖旧结论'],['项目持久化记忆','稳定约定、接口约束、确认的经验','按版本 / 范围更新，支持删除'],['外部原始材料','完整日志、规格、代码与报告','作为复核依据，保留版本'],['本次模型输入','选中的规则、状态与证据','每次调用重新装配']],[260,460,432],{h:346,size:24});
 bottom(s,'持久化保存和上下文加载是两个独立步骤。');
}
// 13：压缩。
{
 const s=slide('压缩历史时的保留规则','摘要需要延续任务状态，并保留关键不确定性',
 '摘要是有损转换，可能遗漏细节。通过结构化槽位保留目标、约束、证据定位、已排除项、未知项和下一步。新摘要生成后应核对关键字段仍在，并保持模型和工具消息协议有效。原始轨迹保留在外部，可在发现矛盾时重新读取。');
 table(s,[['历史内容','压缩后的形式'],['多个重复搜索与大段日志','本轮发现 + 关键片段 + 原始路径'],['已尝试但无效的修改','尝试内容 + 对应版本 + 检查结果'],['被证据排除的怀疑点','排除条件 + 适用范围 + 证据编号'],['待验证猜测','明确标记“假设”，附缺失检查'],['当前任务进度','已完成 / 待完成 / 下一步 / 约束']],[452,700],{h:384,size:24});
}
// 14：信任隔离。
{
 const s=slide('上下文的信任边界','外部材料的内容不能自行改变宿主授权和任务规则',
 '将指令与工具或检索数据分别传递并标注边界。外部文档中的“忽略规则”属于待分析文本。结构化包裹本身不能彻底防止提示注入，还需要工具侧访问控制、最小权限和对敏感动作的独立检查。证据矛盾应按版本、权威性和任务适用范围判断，不能简单使用最新出现的一段。');
 rows(s,[['分开传递指令与数据','检索片段和日志标记为外部数据，保留定位与版本。'],['由宿主执行权限检查','身份、访问范围和工具写权限由程序验证。'],['显式处理冲突','对冲突规格与过期记忆标明差异，核对当前适用版本。'],['控制跨任务传播','不同任务只共享必要结果，避免无关或敏感材料混入。']],212,101);
}
// 15：长任务。
{
 const s=slide('长任务中的上下文维护','阶段切换时收敛输入，恢复任务时核对外部状态',
 '检索阶段需要候选资料，实施阶段需要已经选定的方案和具体接口，验证阶段需要实际改动与验收条件。阶段交接可以只带目标、结论、证据编号、未决事项和下一步。子任务隔离能够控制细节扩散，但需要额外协调并可能丢失信息，因此只在任务可拆分且收益明确时使用。');
 rows(s,[['阶段性摘要','在检索、实施、验证之间交接目标、证据和未决事项。'],['任务恢复','重新核对代码版本、配置与测试报告是否仍然适用。'],['必要的子任务隔离','每个子任务接收明确边界，返回结果、证据和限制。']],242,124);
}
// 16：常见混淆。
{
 const s=slide('常见技术的适用范围','窗口、缓存、检索与训练各自解决不同问题',
 '较大的上下文窗口允许更多输入，但质量仍取决于模型和任务，不能保证所有信息都被正确利用。输入缓存通常减少重复输入的计算或计费，并不自动增加窗口或清除噪声，命中规则由具体服务决定。微调影响模型参数，适合调整稳定行为，不能替代读取当前任务的最新事实。');
 table(s,[['方法','能解决的问题','仍需处理'],['更大的窗口','容纳更长的输入','相关性、冲突、完整性和费用'],['输入缓存','复用符合条件的重复前缀','缓存规则、更新和输入预算'],['RAG / 按需读取','从外部材料取得所需证据','检索覆盖、权限与版本'],['微调','调整稳定任务行为与表达方式','当前代码、日志等动态事实']],[275,460,417],{h:343,size:24});
 bottom(s,'上下文质量需要通过自己的任务集验证。');
}
// 17：连续伪代码第一部分。
{
 const s=slide('伪代码：检索与必需项检查','1 / 3  先计算输入空间，再确认任务需要哪些证据',
 '三页代码为同一流程的教学伪代码，不是特定 SDK 接口。固定内容包含任务和规则、输出结构、工具定义、所需状态。must_select 根据验收要求选关键证据；required_gap 在准备调用前报告未满足的条件。真实实现还需处理读取失败、超时、权限变化以及输入来源的可信度。');
 code(s,[
 'function build_context(task, state, limits):  # 构建本轮输入',
 '    cap = limits.window - limits.output - limits.margin',
 '    fixed = required_inputs(task, state)    # 固定规则与必需状态',
 '    raw = scoped_retrieve(task)             # 在授权范围内检索',
 '    valid = check_access_and_version(raw)   # 再核对权限与版本',
 '    pool = dedupe_and_rank(valid)           # 去重并按任务重排',
 '    must = must_select(pool, task)          # 挑选关键证据',
 '    if required_gap(task, must):            # 证据不足时报告缺口',
 '        return NEED_MORE(required_gap(task, must))',
 '    request = serialize(fixed, must)        # 统计完整请求形式',
 '    if tokens(request) > cap:               # 不丢弃必需信息',
 '        return NEED_SPLIT                   # 改为分步处理'
 ],{step:33,size:23});
}
// 18：连续伪代码第二部分。
{
 const s=slide('伪代码：按预算组装请求','2 / 3  逐项试装，核对消息协议后才调用模型',
 '本页承接 build_context。optional_items 不含已选必需项。bounded_excerpt 在保留含义、版本和定位的前提下取相关片段，不可只按字符数粗暴截断。每次试装后统计完整请求，并在最终调用前再次确认预算、关键字段和工具调用结果的配对。');
 code(s,[
 '    for item in optional_items(pool, must): # 逐项补充可选证据',
 '        part = bounded_excerpt(item)       # 保留相关片段和定位',
 '        trial = append_as_data(request, part)',
 '        if tokens(trial) <= cap:           # 按完整请求判断预算',
 '            request = trial                # 放得下才接受该项',
 '    if not valid_message_contract(request): # 检查工具消息配对',
 '        return INVALID_CONTEXT             # 修复结构再调用',
 '    assert required_fields_present(request) # 必需项不能消失',
 '    assert tokens(request) <= cap           # 最终预算复核',
 '    return READY(request)                   # 交给宿主发起调用',
 '# tokens 使用目标模型的计数方式，并包含工具定义与封装开销'
 ],{step:34,size:23});
}
// 19：连续伪代码第三部分。
{
 const s=slide('伪代码：调用后更新状态','3 / 3  保存实际结果，保持事实、假设与未知项分离',
 '本页描述 build_context 成功后的宿主处理。result 包含模型返回、实际执行的工具结果和检查记录。模型计划执行某个测试不表示测试已执行。merge_hypotheses 保留尚未解决的旧假设，再合并新假设与支持或排除它们的证据。merge_evidence 保留旧证据定位并关联本轮记录，过期证据标明失效范围。压缩失败或重要字段缺失时保留原状态，报告错误。');
 code(s,[
 'function update_state(state, result):        # 每轮结束后调用',
 '    trace = save_raw_result(result)          # 原始记录先落盘',
 '    facts = verified_observations(result)    # 只取实际观察结果',
 '    next = merge_progress(state, facts)      # 更新进展与未知项',
 '    merge_hypotheses(next, result)           # 保留未决假设再合并',
 '    merge_evidence(next, trace)              # 保留旧证据并关联新记录',
 '    if summary_needed(next):                # 达到压缩触发条件',
 '        brief = summarize_with_invariants(next)',
 '        assert preserves_required(next, brief) # 核对约束与未决项',
 '        next = brief                        # 通过检查再使用摘要',
 '    atomic_save(next)                       # 完整写入后替换旧状态',
 '    return next                             # 下一轮仍需重新装配'
 ],{step:33,size:23});
}
// 20：案例边界。
{
 const s=slide('教学案例：FreeRTOS 下 UART 接收异常','教学假设：连续接收时偶发帧缺失，具体根因尚未确认',
 '这是为解释上下文选择而设计的案例，未读取真实项目代码、未采集日志、未运行主机或板端测试。不能仅凭“丢帧”推断为 DMA、队列或解析错误。第一步应确认现象边界、数据流、版本与复现条件。本案例后续只展示需要哪些材料以及如何组织，所有验证项都是待执行。');
 table(s,[['问题边界','需要补齐的内容'],['环境','芯片与板卡版本、FreeRTOS 配置、编译选项'],['输入条件','波特率、帧格式、负载、复现步骤及出现频率'],['接收链路','中断 / DMA、缓冲区、任务间交接与解析接口'],['判断依据','原始字节流、时间戳、计数器和对应代码版本'],['本次输出','候选原因、证据缺口、验证步骤及允许修改范围']],[280,872],{h:381,size:24});
}
// 21：分阶段上下文。
{
 const s=slide('案例中的分阶段上下文','当前问题变化时，输入材料也随之调整',
 '第一轮厘清复现边界，第二轮检查数据交接，第三轮检查帧解析，第四轮核对检查结果。是否进入下一阶段取决于实际发现，表格不规定固定排障路径。旧阶段的已确认结论和未决项通过状态摘要继续传递，原始大日志可按需重读。');
 table(s,[['当前问题','本轮输入','下一步依据'],['如何复现？','环境、输入条件、现象描述','可执行的复现步骤与缺口'],['字节在哪丢失？','接收链路代码、分段计数、时间线','链路各段的实际观察'],['解析是否符合规格？','协议规格、解析状态与失败输入','边界用例和解析结果'],['修改是否有效？','代码差异、验收条件、当前测试报告','通过 / 失败 / 未知']],[270,510,372],{h:347,size:24});
 bottom(s,'阶段名称描述排查目标，不能替代真实证据。',C.gold);
}
// 22：怀疑与证据。
{
 const s=slide('案例中的怀疑点与验证方法','以下均为待验证方向，不能当作已确认根因',
 '硬件和调度行为必须通过实际设备记录支持。缓冲区覆盖、任务消费不及时和解析状态错误都只是候选方向。测量可能影响时序，因此要说明采集方式并控制开销。某个用例未复现问题，不代表在全部条件下排除了该原因。');
 table(s,[['候选原因','需要的证据','待执行验证'],['缓冲区复用或覆盖','缓冲区生命周期、读写位置、时间线','记录生产与消费边界，核对所有权'],['任务处理不及时','队列状态、返回值、调度与负载记录','测量积压与处理延迟，改变负载对比'],['协议解析状态错误','协议规格、原始字节流、解析状态','主机回放分片 / 连帧 / 异常输入']],[279,442,431],{h:321,size:24});
 bottom(s,'每个怀疑点都需要可区分原因的检查，避免只凭常见经验修改。');
}
// 23：案例交付。
{
 const s=slide('排障输出中的证据与验证边界','每条结论关联材料，明确已经完成与尚未执行的检查',
 '输出建议按现象、影响范围、证据、怀疑点、验证步骤和下一步组织。主机回放可检查解析逻辑，实际中断和 DMA 时序、任务同步、硬件寄存器状态必须在目标环境检查。无板端证据时保持未知。证据 id 用于在本任务中定位支持结论的材料。');
 text(s,'主机侧检查',70,227,520,58,34,C.accent,true);
 text(s,'协议分片与连续帧\n长度、CRC 与边界输入\n解析状态与内存访问',70,310,520,178,29);
 text(s,'板端检查',688,227,520,58,34,C.gold,true);
 text(s,'接收链路与缓冲区时序\n调度负载与任务交接\n持续接收及复位恢复',688,310,520,178,29);
 bottom(s,'本案例未执行任何测试，全部验证项均为教学设计。',C.gold);
}
// 24：评估。
{
 const s=slide('上下文工程的评估指标','用固定任务集比较效果，同时统计成本与失败类型',
 '对同一批任务使用固定模型配置和一致的验收标准，对比全量输入、规则筛选、检索、压缩等策略。模型存在随机性，必要时重复运行并报告分布。标注任务需要的证据，分别测量检索是否找到了、装配是否保留了、最终输出是否正确使用了。检查越权与不可靠结论等严重失败，不能只看平均成本。');
 table(s,[['维度','建议记录','解释'],['任务结果','验收通过率、严重错误数量','是否完成真实任务'],['证据质量','必需证据覆盖、过期 / 冲突项','输入是否足以支持结论'],['资源开销','输入 / 输出 token、延迟、工具调用','效率是否达到项目目标'],['恢复能力','摘要后继续任务的成功情况','关键约束和未决项是否保留'],['稳健性','空检索、超时、冲突和注入场景','异常时是否明确报告和受控停止']],[223,516,413],{h:386,size:24});
}
// 25：诊断表。
{
 const s=slide('常见失败及排查顺序','沿数据链路定位问题，避免只调整提示词措辞',
 '若关键材料根本未进入候选池，检查索引与检索条件。若候选存在但未进入输入，检查排序和预算装配。若已进入输入却被误用，检查格式、冲突和模型任务能力。对反复出现的问题保留匿名化或受控访问的回放样本，帮助以后修改策略时回归验证。');
 table(s,[['表现','优先检查','处理方向'],['回答泛泛而谈','必需材料是否进入输入','补齐任务事实与验收要求'],['引用过期接口','检索版本与持久化记忆','按当前版本过滤并更新记忆'],['不断重复已试方法','摘要是否保留尝试结果','保存尝试、结果与适用条件'],['工具结果误判','截断、空匹配与错误状态','返回明确状态和原文入口'],['上下文突然溢出','完整请求和工具定义计数','保留余量，明确分步或缺口出口']],[296,430,426],{h:386,size:24});
}
// 26：落地。
{
 const s=slide('项目中的第一版实现','选择一个可复现任务，逐步建立可检查的输入流程',
 '可以从某个模块的故障分析或构建失败入手，列出目标、允许操作、必需材料和验收方法。实现明确的取数、筛选、预算与状态更新，先跑通一个任务，再建立小规模回放任务集。根据失败样本决定是否需要向量检索、长期记忆或子任务隔离。配套 HTML 包含更详细的图解、交互和伪代码。');
 rows(s,[['定义任务契约','写清目标、允许范围、必需证据与验收方法。'],['打通上下文流水线','完成读取、筛选、预算、调用和状态更新。'],['保留可复核的记录','记录本轮输入、证据版本、实际结果和未决事项。'],['用失败样本改进','增加回放用例，比较效果、开销与异常处理。']],212,101);
}

await fs.mkdir(path.join(build,'previews'),{recursive:true});
await fs.mkdir(path.join(build,'final'),{recursive:true});
await fs.writeFile(path.join(build,'deck-outline.json'),JSON.stringify(metas,null,2));
const candidate=path.join(build,'candidate.pptx');
await(await PresentationFile.exportPptx(P)).save(candidate);
console.log('DRAFT_EXPORTED',P.slides.items.length);
const version=Date.now(),final=path.join(build,'final',`context-engineering-${version}.pptx`);
const out=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:python,
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
 fontPolicy:{basis:'design',families:[font]},requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,
 // 新建图表使用完整教学常量，生成对应内嵌工作簿供用户编辑。
 materializeLiteralChartWorkbooks:true,
 receiptPath:path.join(build,`validation-${version}.json`)});
console.log('FINALIZED',JSON.stringify({path:out.finalPath,integrity:out.packageIntegrity.status,layoutFindings:out.presentationLayout.findingCount}));
const F=await PresentationFile.importPptx(await FileBlob.load(final));
for(let i=0;i<F.slides.items.length;i++){
 const png=await F.export({slide:F.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,'previews',`final-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
 console.log('RENDERED',i+1);
}
await fs.copyFile(final,path.join(root,'Context Engineering 分享.pptx'));
console.log('DELIVERED',path.join(root,'Context Engineering 分享.pptx'));
