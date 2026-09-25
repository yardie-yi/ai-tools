import fs from 'node:fs/promises';
const root='C:/DATA/personal/ai-tools/doc/Graph Engineering';
const build=root+'/.build';
let code=await fs.readFile(build+'/build-deck.mjs','utf8');
code=code.replace(/\/\/ 22\n\{[\s\S]*?\n\}\n\nawait fs.writeFile/, 'await fs.writeFile');
code=code.replace("text(s,source,70,666,1000,28,16,dark?'#B3C5CA':C.sub);", "const footer = source.replace(/基于 Anatoli Kopadze 文章的中文技术分享/g,'中文技术分享').replace(/原文解读/g,'概念讲解').replace(/原文方法/g,'方法说明').replace(/原文适用性判断/g,'适用性判断').replace(/原文成本提醒/g,'成本提醒').replace(/官方文档补充/g,'产品说明').replace(/原文/g,'方法说明');\n text(s,footer,70,666,1000,28,16,dark?'#B3C5CA':C.sub);");
const oldNotes="s.speakerNotes.textFrame.setText(note+'\\n\\n来源：\\n'+refs.join('\\n')+'\\n原文日期：2026-07-24。资料核对：2026-09-07。教学示例不代表实际运行结果。');";
const newNotes="const cleanNote = note.replace(/原文第[0-9、]+节[：：]?/g,'').replace(/原文/g,'').replace(/图示取自[^。]*。/g,'').replace(/示意图取自[^。]*。/g,'').replace(/官方文档已核实dynamic workflows[：：]?/g,'Dynamic workflows：').replace(/官方当前/g,'当前').replace(/产品细节以[^。]*。/g,'').replace(/没有采用[^。]*。/g,'');\n s.speakerNotes.textFrame.setText(cleanNote+'\\n教学示例不代表实际运行结果。');";
if(!code.includes(oldNotes))throw new Error('Notes marker missing');
code=code.replace(oldNotes,newNotes);
code=code.replace('原文发表于 2026.07.24\\n工程补充以代码审查和嵌入式开发为例','以代码审查和嵌入式开发为例');
code=code.replace("alt:'Anatoli Kopadze 原文概念图'","alt:'Graph Engineering 概念图'");
code=code.replaceAll('Graph_Engineering_分享_v4.pptx','Graph_Engineering_分享_v5.pptx').replaceAll('validation-v4.json','validation-v5.json');
await fs.writeFile(build+'/build-deck.mjs',code);

const file=root+'/Graph_Engineering_详解.html';
let html=await fs.readFile(file,'utf8');
html=html.replace('12 来源与事实边界','12 使用边界');
html=html.replace(/<section id="s12">[\s\S]*?<\/section>/,`<section id="s12"><div class="section-head"><span class="num">12</span><h2>使用边界</h2></div>
<p class="lead">模拟参数与嵌入式案例用于解释工作流设计，实际效果需要在项目中验证。</p>
<div class="grid"><div class="card"><h3>示例与实测</h3><p>模拟秒数不是实际测量结果，嵌入式案例不代表已执行固件或板级测试。伪代码与 Graph Spec 需要映射到实际运行时。</p></div><div class="card"><h3>产品与环境</h3><p>产品入口可能随版本、配置与组织设置变化。运行前确认功能可用性、资源限制和验收条件。</p></div></div>
<div class="callout"><b>落地起点：</b>选一个小范围流程，写出每条边的理由、每个节点的契约、每项结论的证据，再用时间和用量测量决定是否扩大。</div>
<div class="foot">Graph Engineering 中文工程详解<br>内联 SVG / CSS / JavaScript，无网络运行依赖。可使用浏览器“打印 / 保存为 PDF”。</div></section>`);
html=html.replaceAll('<span class="tag">原文观点</span>','');
html=html.replaceAll('<span class="tag official">官方补充</span>','');
html=html.replaceAll('<span class="tag official">已核实 · 2026-09-07</span>','');
html=html.replace('原文把 Graph Engineering 描述为多个工作与检查循环的编排。','Graph Engineering 可以组织多个工作与检查循环。');
html=html.replace('原文示例采用多数投票。','多个验证者可以采用多数投票。');
html=html.replace(/<p class="subtle"><span class="tag">原文边界<\/span>[\s\S]*?<\/p>/,'');
html=html.replace('Anthropic 建议从能解决问题的最简单方案开始，再按需要增加复杂度。','从能解决问题的最简单方案开始，再按需要增加复杂度。');
html=html.replace('LangGraph 文档展示工作流、并行与 orchestrator-worker 等模式，并区分预定代码路径和 agent 动态决策。','LangGraph 支持工作流、并行与 orchestrator-worker 等模式，并区分预定代码路径和 agent 动态决策。');
html=html.replace('官方发布页日期为 2026-05-28，现已更新 GA，并介绍 <code>ultracode</code>。','也可以通过 <code>ultracode</code> 入口使用。');
html=html.replace('现行文档说明：','产品入口随版本变化：');
html=html.replace(/<a href="https?:[^\"]*">[\s\S]*?<\/a>/g,'');
await fs.writeFile(file,html);
if(/https?:\/\/|来源清单|Anatoli|FxTwitter|原文|官方文档|发布页/.test(html))throw new Error('Remaining article attribution in HTML');
console.log('Updated deck builder and HTML; removed bibliography and article references.');
