import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=name=>JSON.parse(readFileSync(new URL(`../src/${name}.json`,import.meta.url),'utf8'));
export const source=read('source'), scenes=read('scenes');
const bundle=await build({stdin:{contents:"export {buildEffectiveConfig,comparisonVariants} from './src/motionConfig.js'; export {motionTechnologies,motionTechnologyProfile,triggerTechnologies,combinationTechnologies} from './src/implementation.js'; export {triggerTechnologyProfile,combinationTechnologyProfile} from './src/technologyReference.js';",resolveDir:root},bundle:true,write:false,platform:'node',format:'esm'});
export const api=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));

export function selections(){
 const out=[];
 for(const item of source.main_items){
  const id=item.source_number, contexts=scenes.items.find(x=>x.source_number===id).scenes;
  contexts.forEach((scene,sceneIndex)=>{
   const input={id,mode:'scenes',sceneIndex,variant:0,sceneVariant:null};
   out.push({key:scene.id,kind:'scene',name:scene.label,input});
   for(const v of api.comparisonVariants(id,scene))out.push({key:`${scene.id}.compare.V${v+1}`,kind:'subject-comparison',name:`${scene.label} / ${item.variants[v].name||item.variants[v].summary}`,input:{...input,comparisonVariant:v}});
  });
  item.variants.forEach((variant,v)=>out.push({key:variant.id,kind:'variant',name:variant.name||variant.summary,input:{id,mode:'variants',sceneIndex:0,variant:v,sceneVariant:null}}));
 }
 return out;
}

export function audit(){
 const states=[{name:'desktop',environment:{narrow:false,coarsePointer:false}},{name:'mobile',environment:{narrow:true,coarsePointer:true}},{name:'zero-duration',params:{duration:0}},{name:'reduced',reduced:true}];
 const entries=selections().map(selection=>({key:selection.key,kind:selection.kind,name:selection.name,states:states.map(({name,...state})=>{
  const config=api.buildEffectiveConfig({...selection.input,...state});
  return {state:name,renderVariant:config.renderVariant,scene:config.scene,technologies:api.motionTechnologies(config),...api.motionTechnologyProfile(config)};
 })}));
 const triggers=source.trigger_items.flatMap(item=>item.variants.map((variant,v)=>({key:variant.id,states:states.map(({name,...state})=>{
  const config={number:item.source_number,variant:v,duration:name==='zero-duration'?0:350,reduced:!!state.reduced,staticInput:name==='mobile'&&item.source_number===4};
  return {state:name,technologies:api.triggerTechnologies(config),...api.triggerTechnologyProfile(config)};
 })})));
 const hover=source.trigger_items[0].source_combinations.map((item,index)=>({key:item.id,technologies:api.triggerTechnologies({number:1,combination:index}),...api.triggerTechnologyProfile({number:1,combination:index})}));
 const combinations=Array.from({length:6},(_,index)=>({index,states:states.map(({name,...state})=>{
  const config={index,duration:name==='zero-duration'?0:650,reduced:!!state.reduced,environment:state.environment||{}};
  return {state:name,technologies:api.combinationTechnologies(config),...api.combinationTechnologyProfile(config)};
 })}));
 const nested=[];
 for(const [ui,options] of Object.entries({parallax:['视差','滚动缩放'],trail:['拖尾','背景跟随','轻微明暗'],sequence:['图片序列','自动轮播']})){
  const list=scenes.items.find(x=>x.source_number===55).scenes,sceneIndex=list.findIndex(s=>s.ui===ui);
  for(const submode of options)for(const state of states){
   const config=api.buildEffectiveConfig({id:55,mode:'scenes',sceneIndex,variant:0,sceneVariant:null,...state,runtime:{submode}});
   nested.push({ui,submode,state:state.name,technologies:api.motionTechnologies(config),...api.motionTechnologyProfile(config)});
  }
 }
 return {sourceBaseCommit:'c1e5a31ac06b841a5097814e824c70742378d8f8',scope:'Source branch audit and configuration mapping. These counts are not animation interaction pass counts.',counts:{mainItems:56,scenes:entries.filter(x=>x.kind==='scene').length,standaloneVariants:entries.filter(x=>x.kind==='variant').length,subjectComparisons:entries.filter(x=>x.kind==='subject-comparison').length,triggerVariants:triggers.length,hoverCombinations:hover.length,originalCombinations:combinations.length,nestedStates:nested.length},entries,triggers,hover,combinations,nested};
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const result=audit();
 mkdirSync(new URL('../qa',import.meta.url),{recursive:true});
 writeFileSync(new URL('../qa/technology-audit.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result.counts));
}
