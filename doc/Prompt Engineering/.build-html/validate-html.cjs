const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'C:/DATA/personal/ai-tools/doc/Prompt Engineering';
const output = path.join(base,'.build-html');
const target = path.join(base,'Prompt Engineering 详细解释.html');
fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await context.newPage();
  const errors=[];const external=[];
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
  await page.goto('file:///'+target.replace(/\\/g,'/'));
  await page.waitForLoadState('load');
  const structure=await page.evaluate(()=>({
    sections:document.querySelectorAll('main section').length,
    duplicateIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((id,index,all)=>all.indexOf(id)!==index),
    brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),
    pageWidth:document.documentElement.scrollWidth,
    viewport:innerWidth,
    scripts:document.querySelectorAll('script').length,
    sourceLinks:[...document.querySelectorAll('a')].filter(a=>/^https?:/.test(a.getAttribute('href')||'')).length,
    textLength:document.body.innerText.length
  }));
  assert.equal(structure.sections,16);assert.deepEqual(structure.duplicateIds,[]);assert.deepEqual(structure.brokenAnchors,[]);
  assert.equal(structure.sourceLinks,0);assert(structure.pageWidth<=structure.viewport);
  await page.screenshot({path:path.join(output,'desktop-top.png')});
  for(let i=0;i<6;i++){
    await page.locator('#elementTab'+i).click();
    assert.equal(await page.locator('#elementTab'+i).getAttribute('aria-selected'),'true');
    assert.equal(await page.locator('#elementPanel').getAttribute('aria-labelledby'),'elementTab'+i);
  }
  await page.locator('#elementTab5').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#elementTab0').getAttribute('aria-selected'),'true');
  await page.keyboard.press('End');assert.equal(await page.locator('#elementTab5').getAttribute('aria-selected'),'true');
  await page.keyboard.press('Home');assert.equal(await page.locator('#elementTab0').getAttribute('aria-selected'),'true');
  await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#elementTab5').getAttribute('aria-selected'),'true');
  await page.locator('#elements').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(output,'desktop-elements.png')});
  await page.locator('[data-choice="A"]').click();
  assert.equal(await page.locator('#scoreA').innerText(),'1 / 4');
  assert.equal(await page.locator('#scoreB').innerText(),'4 / 4');
  await page.locator('[data-choice="B"]').click();
  assert((await page.locator('#evalResult').innerText()).includes('候选 B 更符合'));
  for(let i=0;i<4;i++)await page.locator('[data-rule="'+i+'"]').uncheck();
  assert.equal(await page.locator('#scoreA').innerText(),'未设标准');
  await page.locator('[data-rule="2"]').check();
  assert.equal(await page.locator('#scoreA').innerText(),'1 / 1');
  await page.locator('#resetEvaluation').click();
  assert.equal(await page.locator('#scoreA').innerText(),'—');
  await page.locator('[data-choice="B"]').click();
  await page.locator('#evaluation').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(output,'desktop-evaluation.png')});
  const original=await page.locator('#inputTask').inputValue();
  await page.locator('#inputTask').fill('验证编辑同步 <img src=x onerror=alert(1)>');
  assert((await page.locator('#builderOutput').inputValue()).includes('验证编辑同步 <img src=x onerror=alert(1)>'));
  assert.equal(await page.locator('#builderPrint img').count(),0);
  await page.locator('#inputExamples').fill('');
  assert.equal(await page.locator('#fieldCount').innerText(),'已填写 5 / 6 个要素');
  assert(!(await page.locator('#builderOutput').inputValue()).includes('【示例】'));
  await page.locator('#copyBuilder').click();
  await page.waitForFunction(()=>document.getElementById('builderStatus').textContent.length>0);
  const copyResult=await page.locator('#builderStatus').innerText();
  await page.locator('#resetBuilder').click();
  assert.equal(await page.locator('#inputTask').inputValue(),original);
  assert.equal(await page.locator('#fieldCount').innerText(),'已填写 6 / 6 个要素');
  for(const id of ['casePrompt','retryCode']){
    await page.locator('[data-copy="'+id+'"]').click();
    await page.waitForFunction(()=>document.getElementById('copyAnnouncement').textContent.length>0);
    assert((await page.locator('#copyAnnouncement').innerText()).length>0);
  }
  const checkbox=page.locator('.checklist input').first();await checkbox.check();assert(await checkbox.isChecked());
  await page.evaluate(()=>{window.print=()=>{window.__printCalled=true;};});
  await page.locator('#printButton').click();assert(await page.evaluate(()=>window.__printCalled===true));
  await page.locator('#builder').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'desktop-builder.png')});
  const mobileResults=[];
  for(const width of [390,320,768]){
    await page.setViewportSize({width,height:844});
    await page.evaluate(()=>scrollTo(0,0));
    const dimensions=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,overflow:[...document.body.querySelectorAll('*')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+1 && !el.closest('pre,.table-wrap,.diagram,.nav');}).map(el=>({tag:el.tagName,id:el.id,cls:el.className,right:el.getBoundingClientRect().right})).slice(0,10)}));
    mobileResults.push(dimensions);assert(dimensions.width<=width,JSON.stringify(dimensions));
    if(width===390){await page.screenshot({path:path.join(output,'mobile-top.png')});await page.locator('#builder').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'mobile-builder.png')});}
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({media:'print'});
  const print=await page.evaluate(()=>({sixVisible:getComputedStyle(document.getElementById('sixPrint')).display,printText:document.getElementById('builderPrint').textContent.length,navHidden:getComputedStyle(document.querySelector('.sidebar')).display}));
  assert.notEqual(print.sixVisible,'none');assert.equal(print.navHidden,'none');assert(print.printText>0);
  await page.pdf({path:path.join(output,'print-preview.pdf'),printBackground:true,preferCSSPageSize:true});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  const report={structure,errors,external,copyResult,mobileResults,print,checks:['6 element tabs and arrow/home/end semantics','candidate A/B, rubric all/none/subset, reset','builder edit, empty optional example, escape display, copy, reset','case and pseudocode copy buttons','checklist checkbox','mobile 390/320/768 no page overflow','print button invokes browser print','print all 6 elements and latest prompt','no external requests or page errors']};
  fs.writeFileSync(path.join(output,'validation-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
