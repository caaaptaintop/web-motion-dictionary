import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const original=read('./fixtures/source-integrity.json').original_prompts;
const displayed=read('../src/originalPrompts.json');
test('all 73 original prompt texts preserve exact verified content and SHA256',()=>{
 assert.equal(original.length,73);assert.equal(Object.keys(displayed).length,73);
 for(const item of original){assert.equal(createHash('sha256').update(displayed[item.id].text,'utf8').digest('hex'),item.sha256,item.id);}
});
test('original leading and trailing newlines are retained',()=>{
 for(const id of ['T04','T05']){assert.ok(displayed[id].text.startsWith('\n'));assert.ok(displayed[id].text.endsWith('\n'));}
 assert.ok(displayed['B.S3.C01'].text.includes('\n\n'));
});
test('reviewed compatible types never remain in the contradictory type set',()=>{
 const rules=read('../src/promptCompatibility.json');
 for(let id=1;id<=56;id++){
  const key=`M${String(id).padStart(2,'0')}`, rule=rules[key];
  assert.equal(rule.reviewed,true,key);
  for(const variant of rule.variants||[]) assert.ok(!(rule.conflicts||[]).includes(variant),`${key} V${variant+1}`);
 }
});
test('a prior counter direction cannot authorize a newly selected target',async()=>{
 const {build}=await import('esbuild');
 const bundled=await build({entryPoints:[new URL('../src/OriginalPromptPanel.jsx',import.meta.url).pathname],bundle:true,write:false,platform:'node',format:'esm'});
 const {originalPromptMatch,appendOriginalParameters}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
 const c={id:44,mode:'scenes',scene:{ui:'data',label:'数据概览'},renderVariant:1,values:{target:0},runtime:{counterTarget:1280,counterDirection:'increase'}};
 assert.equal(originalPromptMatch('M44',c).status,'waiting');assert.equal(appendOriginalParameters('M44',c,[]),null);
 c.runtime={counterTarget:0,counterDirection:'decrease'};assert.equal(originalPromptMatch('M44',c).status,'difference');
 c.values.target=1280;c.runtime={counterTarget:1280,counterDirection:'increase'};assert.equal(originalPromptMatch('M44',c).status,'compatible');
});
