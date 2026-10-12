import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {api,source,scenes} from '../scripts/technology-audit.mjs';
const bundled=await build({entryPoints:[new URL('../src/integratedPrompt.js',import.meta.url).pathname],bundle:true,write:false,platform:'node',format:'esm'});
const {generateIntegratedPrompt:generate}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
test('all636 original selection contexts generate complete prompt text',()=>{
 const results=[];
 function check(key,prompt){assert.ok(typeof prompt==='string'&&prompt.length>30,key);assert.doesNotMatch(prompt,/undefined|NaN|本次选定设置/,key);results.push(key);}
 for(const item of source.main_items){
  const contexts=scenes.items.find(x=>x.source_number===item.source_number).scenes;
  for(let i=0;i<contexts.length;i++){
   const c=api.buildEffectiveConfig({id:item.source_number,mode:'scenes',sceneIndex:i,variant:0,params:{}});
   check(contexts[i].id,generate(item.id,c,c.parameters));
  }
  for(let i=0;i<item.variants.length;i++){
   const c=api.buildEffectiveConfig({id:item.source_number,mode:'variants',variant:i,params:{}});
   check(item.variants[i].id,generate(item.id,c,c.parameters));
  }
 }
 for(const item of source.trigger_items)for(let i=0;i<item.variants.length;i++){
  const n=item.source_number,parameters=[{label:n<6?'反馈动画时长':({6:'跟随滞后时长',7:'吸附与反馈时长',8:i===3?'入场时长':'每段入场时长',9:'状态过渡时长',10:'单次动画时长'})[n],value:350,unit:'ms'}];
  if(n===10)parameters.push({label:['启动延迟','播放间隔','定时间隔','空闲等待时间','循环间隔'][i],value:1200,unit:'ms'});
  check(item.variants[i].id,generate(item.id,{variant:i,combination:-1,delay:450,threshold:20,duration:350},parameters));
 }
 for(let i=0;i<6;i++)check('hover-combination-'+i,generate('T01',{variant:0,combination:i,delay:450},[{label:'反馈动画时长',value:350,unit:'ms'}]));
 for(const [i,id] of ['B.S1.01','B.S2.C01','B.S2.C02','B.S2.C03','B.S2.C04','B.S3.C01'].entries()){
  const parameters=[];
  if([0,2,3,5].includes(i))parameters.push({label:i===3?'跟随与回位时长':i===5?'共享元素与面板过渡时长':i===2?'卡片入场时长':'每项入场时长',value:i===3?220:650,unit:'ms'});
  if([0,2].includes(i))parameters.push({label:'交错间隔',value:120,unit:'ms'});
  check(id,generate(id,{},parameters));
 }
 assert.equal(results.length,636);assert.equal(new Set(results).size,636);
});
