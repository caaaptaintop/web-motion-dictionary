import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {itemPresentation} from '../src/itemPresentation.js';
const root=new URL('../',import.meta.url).pathname;
const source=JSON.parse(readFileSync(new URL('../src/source.json',import.meta.url),'utf8'));
const scenes=JSON.parse(readFileSync(new URL('../src/scenes.json',import.meta.url),'utf8'));
const bundle=await build({stdin:{contents:"export {buildEffectiveConfig} from './src/motionConfig.js'; export {generateIntegratedPrompt} from './src/integratedPrompt.js';",resolveDir:root},bundle:true,write:false,platform:'node',format:'esm'});
const {buildEffectiveConfig,generateIntegratedPrompt}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));

test('entering a UX rule from effect mode uses its observation; motion types retain both modes',()=>{
 for(const item of source.main_items){
  const expected=item.kind==='ux_rule';
  assert.equal(itemPresentation(item,'variants').rule,expected);
  assert.equal(itemPresentation(item,'variants').mode,expected?'scenes':'variants');
  assert.equal(itemPresentation(item,'scenes').mode,'scenes');
 }
});

test('one UX observation keeps original phase, subject, parameters and prompt aligned',()=>{
 const phases={52:['操作前','操作时','操作完成后','失败后'],53:['按钮','链接','可拖拽','可展开','输入框'],54:['主操作','弹窗打开','键盘焦点','关闭弹窗','下一步'],55:['视差','长距离','自动循环','拖尾','连续图片帧','加载'],56:['短提示','导航入口','卡片','跟随','左右滑动']};
 let checked=0;
 for(const item of source.main_items.filter(i=>i.kind==='ux_rule')){
  const list=scenes.items.find(i=>i.source_number===item.source_number).scenes;
  for(let sceneIndex=0;sceneIndex<list.length;sceneIndex++){
   const scene=list[sceneIndex],id=item.source_number;
   const c=buildEffectiveConfig({id,mode:itemPresentation(item,'variants').mode,sceneIndex,variant:4,params:{duration:1800},runtime:{}});
   assert.equal(c.scene.id,scene.id);assert.equal(c.scene.ui,scene.ui);assert.equal(c.mode,'scenes');
   if(id!==55)assert.equal(c.renderVariant,sceneIndex);
   else assert.equal(c.renderVariant,sceneIndex===5?0:sceneIndex);
   assert.ok(c.technology.length>0);
   if(c.parameters.some(p=>p.key==='duration'))assert.equal(c.values.duration,1800);
   const prompt=generateIntegratedPrompt(item.id,c,c.parameters);
   assert.ok(prompt.includes(phases[id][sceneIndex]),`${scene.id}: ${prompt}`);
   checked++;
  }
 }
 assert.equal(checked,25);
});
