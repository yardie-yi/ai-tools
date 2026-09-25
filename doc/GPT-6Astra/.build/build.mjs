import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {finalizePresentation} from 'file:///C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root='C:/DATA/personal/ai-tools/doc/GPT-6Astra';
const skill='C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const source='https://developers.openai.com/api/docs/guides/latest-model';
const slides=[
['GPT-6 Astra\nPrompt 与 Skill 编写','面向嵌入式开发的技术分享\n2026.09.09','把任务目标、授权范围和验收证据写清楚。约 20 分钟。'],
['Astra 的提示词调整重点','更容易澄清：说明哪些缺口可以合理假设\n更敏感地遵循文件：审计 Skill 与 AGENTS.md\n输出较详细：指定长度、结构和读者\n委派与验证：明确何时使用、何时结束','官方指南描述以上行为趋势，具体效果需在自己的任务集上验证。来源：'+source],
['Prompt、项目规则与 Skill','Prompt：本次目标、输入、交付物与验收\nAGENTS.md：项目长期约定与构建入口\nSkill：某类任务可复用的操作流程\n工具：实际读取、修改、构建和验证能力','工程实践建议。Skill 是宿主加载的工作流资料，不会因为切换模型自动安装，也不能创造不存在的工具权限。'],
['一个 Prompt 的六个要素','目标：要完成什么\n证据：日志、代码路径、环境与复现条件\n边界：允许改动的位置和操作\n自主性：哪些情况继续，哪些需要询问\n验收：成功条件、验证方法与停止条件\n输出：交付物、语言、长度和格式','六要素是本分享的工程整理，不是官方固定语法。普通中文、小标题或标签均可。'],
['示例：串口丢包排查','弱描述：帮我看看串口为什么丢包\n\n改写：依据给定日志和接收路径定位偶发丢包。\n先标出事实与假设，为每个假设给出验证动作。\n可读取代码并准备最小补丁，修改范围限接收模块。\n缺少硬件条件时提交验证步骤，不宣称板端通过。','教学场景，不代表已经观察到实际丢包或执行硬件测试。完整可复制版本见配套指南。'],
['授权范围与提问条件','可自行决定：命名、局部实现、只读检索\n需要询问：目标有歧义，且不同答案改变结果\n先完成：已授权、可独立推进的准备工作\n到边界暂停：未经授权的发布、刷机或删除\n最终报告：完成项、证据、尚缺的验证','工程建议：权限要按项目写实。Prompt 不会绕过系统、开发者指令或工具权限。'],
['Skill 的职责边界','description：说明什么任务会触发\n输入：需要什么资料，缺失如何处理\n步骤：可执行动作与判断分支\n产出：固定交付格式与证据要求\n退出：完成条件、阻塞条件与交接内容','工程设计建议。保持主文件聚焦，长参考资料与脚本分开存放，并仅在需要时读取。'],
['SKILL.md 教学骨架','---\nname: embedded-triage\ndescription: 用于嵌入式日志与代码排障。\n---\n读取现象、版本、复现条件和相关代码。\n把事实与假设分开，为假设安排验证动作。\n输出根因证据、最小修复建议和回归清单。','这是教学模板节选。需补充项目实际命令、权限边界和停止条件再投入使用。文件样式说明参见 https://developers.openai.com/codex/skills'],
['容易让任务停住的规则','“所有操作都先确认”\n改为：明确需要确认的具体操作与边界。\n\n“每次修改都跑全部测试”\n改为：按影响范围选测试，通过后按条件结束。\n\n“始终使用某工具”\n改为：工具存在且适用时使用，失败时报告替代路径。','基于工程经验构造的反例。Astra 对上下文指令敏感，因此值得检查旧模板中的绝对化规定。'],
['带注释的排障伪代码','收集(现象, 版本, 日志)   // 固定复现边界\n核对(代码与日志对应关系) // 避免分析错误版本\n若缺少关键证据:          // 不用猜测补齐事实\n    输出(缺口, 最小采集步骤)\n否则:\n    排序(候选假设)        // 按证据与验证成本排序\n    验证(优先假设)        // 结果必须可以反驳假设\n    汇报(结论, 证据, 未验证项)','概念伪代码，不能直接编译或操作硬件。每个动作均说明目的。'],
['按风险安排验证','文档调整：检查内容、链接和排版\n局部逻辑：相关单测与构建\n驱动或协议：异常路径与相关集成回归\n时序或中断：需要对应板卡与测量证据\n停止条件：必需检查通过，且无未处理风险','工程建议，不是一套通用的固定测试命令。没有板卡时标注未执行板端验证，保留可复现操作步骤。'],
['多任务与中途补充要求','并行条件：任务独立、工具可用、合并有收益\n分工信息：职责、输入、产出、禁止覆盖的文件\n中途纠正：说明新增条件及其影响范围\n保留状态：已完成工作、当前证据、剩余事项','前两项是工程建议。官方介绍 Astra 的异步工具调用和中途 steering，但应用仍负责工具执行和状态管理。不能仅靠提示词实现。来源：'+source],
['接入 API 时的核对项','模型标识：gpt-6-astra\n工具调用：使用 Responses API\n推理强度：不支持 none，迁移时按指南核对\n移除不支持的 temperature、top_p、top_logprobs\n模型参数与提示词分别管理、分别验证','官方 API 信息截至 2026-09-09。Chat Completions 还需移除 logprobs；Responses 的 include 不应请求 message.output_text.logprobs。来源：'+source],
['用小型任务集验证写法','正常输入：能否完成指定交付物\n缺失日志：能否准确指出缺口\n冲突规则：能否说明冲突来源\n工具失败：能否保留成果并报告阻塞\n越界要求：能否识别授权边界\n记录：完成率、误报、耗时、人工介入次数','建议使用同一批任务对照旧版与新版，固定工具与环境。没有实测数据时，不承诺减少多少 token 或提升多少效率。'],
['参考资料与使用方式','官方模型指南：本分享的模型行为依据\nCodex Skills：文件结构的参考入口\nX 帖子：当前读取失败，未引用其观点\n\n先复制 Prompt 完成一次任务，再把稳定步骤沉淀为 Skill。','来源：'+source+'\nhttps://developers.openai.com/codex/skills\n用户参考链接（未核实正文）：https://x.com/LanLance24/status/2095144419393683791\n配套 HTML 可离线浏览。指南含完整模板。']
];
const p=Presentation.create({slideSize:{width:1280,height:720}});
function txt(s,text,x,y,w,h,size,color='#172C3D',bold=false){const q=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});q.text=text;q.text.style={typeface:'Microsoft YaHei',fontSize:size,color,bold,autoFit:'none'};}
for(let i=0;i<slides.length;i++){
 const [title,body,notes]=slides[i],s=p.slides.add();s.background.fill=i===0?'#112A3B':'#F8FAFC';
 txt(s,title,70,i===0?130:55,1140,i===0?200:80,i===0?64:44,i===0?'#FFFFFF':'#172C3D',true);
 txt(s,body,74,i===0?390:165,1125,460,i===0?30:30,i===0?'#A6DBDB':'#243F50');
 txt(s,String(i+1).padStart(2,'0'),1160,660,70,30,18,i===0?'#A6DBDB':'#657A88');
 s.speakerNotes.textFrame.setText(notes);
}
await (await PresentationFile.exportPptx(p)).save(root+'/.build/candidate.pptx');
for(let i=0;i<p.slides.items.length;i++){const b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(root+`/.build/slide-${i+1}.png`,new Uint8Array(await b.arrayBuffer()));}
await finalizePresentation({workspaceDir:root,candidatePath:root+'/.build/candidate.pptx',finalPath:root+'/.build/final/GPT-6Astra分享.pptx',pythonExecutable:'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Microsoft YaHei']},verifyArtifactToolImport:true,receiptPath:root+'/.build/validation.json'});
await fs.writeFile(root+'/.build/content.json',JSON.stringify(slides));
console.log('Created '+slides.length+' slides');


