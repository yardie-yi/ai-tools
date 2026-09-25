import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {finalizePresentation} from 'file:///C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations/container_tools/artifact_tool_utils.mjs';
import slides from './content-v2.mjs';
const root='C:/DATA/personal/ai-tools/doc/GPT-6Astra';
const skill='C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const p=Presentation.create({slideSize:{width:1280,height:720}});
function txt(s,text,x,y,w,h,size,color='#172C3D',bold=false){const q=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});q.text=text;q.text.style={typeface:'Microsoft YaHei',fontSize:size,color,bold,autoFit:'none'};}
for(let i=0;i<slides.length;i++){
 const [title,body,ref,notes]=slides[i],s=p.slides.add();s.background.fill=i===0?'#112A3B':'#F8FAFC';
 txt(s,title,70,i===0?110:52,1140,i===0?210:80,i===0?62:42,i===0?'#FFFFFF':'#172C3D',true);
 txt(s,body,74,i===0?380:165,1125,420,30,i===0?'#A6DBDB':'#243F50');
 txt(s,ref,74,600,1080,60,19,i===0?'#A6DBDB':'#476979');
 txt(s,String(i+1).padStart(2,'0'),1160,661,70,30,18,i===0?'#A6DBDB':'#657A88');
 s.speakerNotes.textFrame.setText(ref+'\n'+notes);
}
await fs.mkdir(root+'/.build/v2-previews',{recursive:true});
await (await PresentationFile.exportPptx(p)).save(root+'/.build/candidate-v2.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:root+'/.build/candidate-v2.pptx',finalPath:root+'/.build/final/GPT-6Astra分享-详细版.pptx',pythonExecutable:'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Microsoft YaHei']},verifyArtifactToolImport:true,receiptPath:root+'/.build/validation-v2.json'});
for(let i=0;i<p.slides.items.length;i++){const b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(root+`/.build/v2-previews/slide-${i+1}.png`,new Uint8Array(await b.arrayBuffer()));}
await fs.copyFile(root+'/.build/final/GPT-6Astra分享-详细版.pptx',root+'/GPT-6Astra分享.pptx');
console.log('Updated '+slides.length+' slides');
