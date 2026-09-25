"""Build a self-contained HTML companion. Requires the Python markdown package."""
from pathlib import Path
import ast
import re

ROOT = Path(__file__).resolve().parent
import markdown

source = (ROOT / 'jev-guide.md').read_text(encoding='utf-8')
for block in re.findall(r'```python\n(.*?)\n```', source, re.S):
    ast.parse(block)

md = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc'],
                       extension_configs={'toc': {'toc_depth': '2-2'}})
body = md.convert(source)
css = '''
:root{--bg:#f5f5f1;--ink:#182525;--muted:#536562;--accent:#007a68;--line:#d7dfda;--card:#fff;--pink:#b63184}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:25px}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.85 system-ui,-apple-system,"Microsoft YaHei",sans-serif}
a{color:var(--accent);text-underline-offset:4px;overflow-wrap:anywhere}a:hover{color:var(--pink)}button,input,select{font:inherit}button{cursor:pointer;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:8px;padding:7px 15px}button:hover{border-color:var(--accent)}:focus-visible{outline:3px solid var(--pink);outline-offset:3px}
.hero{background:#113c35;color:#fff;padding:52px max(24px,calc((100vw - 1240px)/2)) 44px}.eyebrow{font-size:12px;letter-spacing:2px;color:#a5ded0}.hero h1{font-size:clamp(32px,5vw,58px);line-height:1.2;margin:15px 0}.hero p{max-width:740px;color:#d6e9e2}.hero a{color:#b3f5db}.actions{display:flex;gap:15px;align-items:center;flex-wrap:wrap}.layout{max-width:1300px;margin:auto;display:grid;grid-template-columns:235px minmax(0,1fr);gap:42px;padding:36px 24px}aside{position:sticky;top:20px;align-self:start;max-height:95vh;overflow:auto;font-size:13px}aside ul{padding:0;list-style:none}aside li{margin:10px 0}aside a{text-decoration:none}main{min-width:0}article>h1{font-size:30px}h2{font-size:27px;margin:58px 0 20px;padding-top:15px;border-top:1px solid var(--line);line-height:1.5}h3{font-size:20px;margin-top:30px}p{margin:16px 0}blockquote{border-left:4px solid var(--accent);background:#e8efea;padding:12px 20px;margin:24px 0;color:var(--muted)}blockquote p{margin:0}pre{background:#122a29;color:#dceddf;border-radius:12px;padding:22px;overflow:auto;font:13px/1.75 Consolas,monospace;tab-size:4}code{font:0.88em Consolas,monospace;background:#e5ebe5;padding:2px 5px;border-radius:4px;overflow-wrap:anywhere}pre code{background:none;padding:0;font-size:inherit;overflow-wrap:normal}table{border-collapse:collapse;width:100%;font-size:14px;margin:20px 0}td,th{border:1px solid var(--line);padding:12px;text-align:left;vertical-align:top}th{background:#e6eee7}tr:nth-child(even){background:#f9faf7}.table-wrap{overflow:auto}li{margin:8px 0}.lab{background:var(--card);padding:26px;border:1px solid var(--line);border-radius:16px;margin:24px 0}.lab h2{border:0;margin:0;padding:0;font-size:25px}.tag{display:inline-block;font-size:12px;background:#f6e7c4;color:#795a18;padding:2px 10px;border-radius:20px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0}.card{border:1px solid var(--line);border-radius:12px;padding:18px}.card strong{display:block;font-size:20px;color:var(--accent)}.flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:12px;align-items:center;margin:24px 0}.flow>div{background:#e8f2ec;border:1px solid #c9ddd1;border-radius:12px;padding:18px;text-align:center}.flow small{display:block}.note{color:var(--muted);font-size:13px}.control{display:grid;grid-template-columns:150px 1fr 65px;gap:12px;align-items:center;margin:17px 0}input[type=range]{width:100%;accent-color:var(--accent);min-height:32px}.meter{display:flex;height:34px;border-radius:7px;overflow:hidden;margin:18px 0}.meter span{display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;min-width:0;color:white;transition:width .15s}.meter span:nth-child(1){background:#007a68}.meter span:nth-child(2){background:#5669ab}.meter span:nth-child(3){background:#ad5b27}.result{padding:16px 18px;background:#eaf2ec;border-radius:10px;margin:15px 0;font-weight:600}.muted{color:var(--muted)}.buttons{display:flex;gap:8px;flex-wrap:wrap}footer{padding:25px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
@media(max-width:900px){.layout{grid-template-columns:1fr;gap:10px}aside{position:static;max-height:none}aside .toc ul{columns:2}.cards{grid-template-columns:1fr}.control{grid-template-columns:110px 1fr 50px}.hero{padding:32px 22px}.flow{grid-template-columns:1fr}.flow>b{text-align:center;transform:rotate(90deg)}.lab{padding:20px}td,th{min-width:115px}}
@media print{aside,.actions,.interactive{display:none}.hero{background:white;color:black;padding:10px}.hero p{color:#333}.layout{display:block;padding:0}body{font-size:11pt;background:white}pre{white-space:pre-wrap;background:#eee;color:black}h2{break-after:avoid}a{color:black}.lab{break-inside:avoid}}
'''
lab = '''
<section class="lab" aria-labelledby="overview"><span class="tag">概念图解</span><h2 id="overview">程序负责流程，Jev 提供语义判断</h2>
<div class="flow"><div><b>准备 state</b><small>日志 · 工单 · 候选值</small></div><b aria-hidden="true">→</b><div><b>Jev 并行回答</b><small>Choice · Noul · Score</small></div><b aria-hidden="true">→</b><div><b>代码组合结果</b><small>分流 · 排序 · 复核</small></div></div>
<div class="cards"><div class="card"><strong>Choice</strong>从给定候选中选一个<br><small>“首先交给哪个队列？”</small></div><div class="card"><strong>Noul</strong>返回 yes 的概率<br><small>“报告是否描述测试中断？”</small></div><div class="card"><strong>Score</strong>沿有序等级评分<br><small>“复现材料有多完整？”</small></div></div></section>
<section class="lab interactive" aria-labelledby="choice-lab"><span class="tag">离线教学 · 不调用 Jev</span><h2 id="choice-lab">选项赢了，程序就应该采用吗？</h2>
<p>改变三个候选的权重，观察归一化概率与路由结果。这里故意使用 <code>p_max</code> 作为自定义门槛，<b>没有模拟 API 的 confidence</b>。</p>
<label class="control">驱动权重<input id="driver" type="range" min="0" max="100" value="85"><output id="driver-val"></output></label>
<label class="control">构建权重<input id="build" type="range" min="0" max="100" value="5"><output id="build-val"></output></label>
<label class="control">未知权重<input id="unknown" type="range" min="0" max="100" value="10"><output id="unknown-val"></output></label>
<label class="control">采用门槛<input id="threshold" type="range" min="34" max="100" value="80"><output id="threshold-val"></output></label>
<div class="meter" id="prob-bars" role="img" aria-label="候选概率"><span></span><span></span><span></span></div><div class="result" id="choice-result" role="status" aria-live="polite"></div>
<div class="buttons"><button type="button" data-values="85,5,10">明显倾向</button><button type="button" data-values="45,40,15">两个候选接近</button><button type="button" data-values="10,10,80">材料不足</button></div>
<p class="note">三权重全为 0 时按均匀分布演示；并列第一或 unknown 第一均进入复核。阈值仅用于讲解，不代表经过真实数据验证。</p></section>
<section class="lab interactive" aria-labelledby="score-lab"><h2 id="score-lab">Noul 与 Score：0.5 到底意味着什么？</h2>
<label class="control">P(测试中断)<input id="noul" type="range" min="0" max="100" value="50"><output id="noul-val"></output></label><div class="result" id="noul-result" role="status" aria-live="polite"></div>
<p>下面两种 Score 分布的平均值都为 1，但反映不同情况：</p>
<div class="cards"><div class="card"><strong>0 / 100 / 0%</strong>全部概率落在等级 1<br><small>score = 1</small></div><div class="card"><strong>50 / 0 / 50%</strong>概率落在两端等级<br><small>score = 1</small></div><div class="card"><strong>分布仍然重要</strong>相同均值不等于相同把握<br><small>结合 probabilities 与 confidence</small></div></div>
<p class="note">Noul 表示条件为真的概率；Score 表示在已定义等级上的位置。本区所有数值均由页面构造。</p></section>
'''
js = '''
const ids=['driver','build','unknown'];
const labels=['驱动','构建','未知'];
function evaluate(weights,threshold){
 const sum=weights.reduce((a,b)=>a+b,0);
 const p=sum?weights.map(x=>x/sum):weights.map(()=>1/3);
 const peak=Math.max(...p), winner=p.indexOf(peak);
 const tied=p.filter(x=>Math.abs(x-peak)<1e-9).length>1;
 return {p,peak,winner,review:tied||winner===2||peak<threshold};
}
function render(){
 const weights=ids.map(id=>Number(document.getElementById(id).value));
 const threshold=Number(document.getElementById('threshold').value)/100;
 const result=evaluate(weights,threshold);
 ids.forEach((id,i)=>document.getElementById(id+'-val').textContent=weights[i]);
 document.getElementById('threshold-val').textContent=(threshold*100).toFixed(0)+'%';
 document.querySelectorAll('#prob-bars span').forEach((bar,i)=>{
   bar.style.width=(result.p[i]*100)+'%';
   bar.textContent=result.p[i]>=.1?labels[i]+' '+(result.p[i]*100).toFixed(0)+'%':'';
 });
 document.getElementById('prob-bars').setAttribute('aria-label',result.p.map((p,i)=>labels[i]+(p*100).toFixed(1)+'%').join('，'));
 document.getElementById('choice-result').textContent=(result.review?'进入人工复核':'建议分流至：'+labels[result.winner])+' · 最大选项概率 '+(result.peak*100).toFixed(1)+'%';
 const noul=Number(document.getElementById('noul').value)/100;
 document.getElementById('noul-val').textContent=noul.toFixed(2);
 document.getElementById('noul-result').textContent=noul>=.8?'倾向 yes：报告描述测试中断':noul<=.2?'倾向 no：没有明确描述测试中断':'待核实：不是“中等严重”，而是 yes/no 不够明确';
}
document.querySelectorAll('input').forEach(input=>input.addEventListener('input',render));
document.querySelectorAll('[data-values]').forEach(button=>button.addEventListener('click',()=>{button.dataset.values.split(',').forEach((value,i)=>document.getElementById(ids[i]).value=value);render()}));
document.getElementById('print').addEventListener('click',()=>window.print());
render();
'''
body = re.sub(r'<table>(.*?)</table>', r'<div class="table-wrap"><table>\1</table></div>', body, flags=re.S)
html = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jev：把语义判断接入程序</title><style>{css}</style></head>
<body><header class="hero"><div class="eyebrow">TYPESAFE AI / JEV / ENGINEERING GUIDE</div><h1>把语义判断<br>接入你熟悉的程序</h1><p>从 Choice、Noul、Score，到 FreeRTOS 故障分流与 Agent 路由。用类型化结果连接模型理解与确定性代码。</p><div class="actions"><a href="jev-guide.md">阅读 Markdown 源文档</a><button id="print" type="button">打印 / 保存 PDF</button><span>资料核对：2026-09-20</span></div></header>
<div class="layout"><aside aria-label="章节目录"><b>阅读导航</b><p><a href="#overview">图解与交互演示</a></p>{md.toc}</aside><main>{lab}<article>{body}</article></main></div><footer>本文件可离线阅读，无远程脚本、字体或模型调用。官方来源与验证边界见正文第 13 节。</footer><script>{js}</script></body></html>'''
(ROOT / 'jev-guide.html').write_text(html, encoding='utf-8')
print(f'Built {ROOT / "jev-guide.html"}; Python examples parsed successfully.')
