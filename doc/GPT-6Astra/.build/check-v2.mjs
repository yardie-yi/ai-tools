import fs from 'node:fs/promises';
import vm from 'node:vm';
const root='C:/DATA/personal/ai-tools/doc/GPT-6Astra';
const html=await fs.readFile(root+'/show-me-astra.html','utf8');
const md=await fs.readFile(root+'/指南.md','utf8');
for(const text of [html,md]){
 if(text.includes('2095144419393683791'))throw Error('Obsolete reference remains');
 for(const token of ['2096902575035683147','P1','P8','S1','S7','Initiative and follow-through','Instruction following'])if(!text.includes(token))throw Error('Missing '+token);
}
for(const s of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
if(new Set(ids).size!==ids.length)throw Error('Duplicate IDs');
for(const l of html.matchAll(/href="#([^"]+)"/g))if(!ids.includes(l[1]))throw Error('Missing anchor '+l[1]);
console.log('Source references, P/S mappings, script syntax and internal links checked');
