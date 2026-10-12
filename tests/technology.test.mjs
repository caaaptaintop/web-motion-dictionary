import test from 'node:test';
import assert from 'node:assert/strict';
import {api,audit,scenes} from '../scripts/technology-audit.mjs';
const keys=config=>api.motionTechnologies({id:config.id,renderVariant:0,values:{duration:650},...config}).map(x=>x.id);
const has=(list,...expected)=>expected.forEach(x=>assert.ok(list.includes(x),`missing ${x} in ${list}`));
const lacks=(list,...forbidden)=>forbidden.forEach(x=>assert.ok(!list.includes(x),`incorrect ${x} in ${list}`));

test('every original selection and valid subject comparison resolves reviewed technology keys',()=>{
 const data=audit();
 assert.equal(data.counts.scenes,299);assert.equal(data.counts.standaloneVariants,273);assert.equal(data.counts.triggerVariants,52);assert.equal(data.counts.hoverCombinations,6);assert.equal(data.counts.originalCombinations,6);
 for(const entry of [...data.entries,...data.triggers,...data.combinations])for(const state of entry.states){
  assert.ok(state.technologies.length>0);assert.ok(state.evidence.length>0);
  assert.equal(new Set(state.technologies.map(t=>t.id)).size,state.technologies.length);
  if(entry.kind)for(const group of ['drivers','secondaryDrivers'])lacks(state[group],'react','react-state');
  for(const technology of state.technologies)if(['react','react-state'].includes(technology.id))assert.equal(technology.group,'support');
  lacks(state.technologies.map(t=>t.name),'Motion','GSAP','Lottie','Rive');
 }
});

test('spring direct positioning and press handlers report their actual input branches',()=>{
 const drag=keys({id:5,scene:{ui:'drag'}});has(drag,'dom-style','react-state','keyboard-events','pointer-events','waapi');
 lacks(keys({id:5,scene:{ui:'drag'},values:{duration:0}}),'waapi');
 has(keys({id:5,scene:{ui:'button'}}),'css-transition','pointer-events','keyboard-events');
 lacks(keys({id:5,scene:{ui:'button'},reduced:true}),'pointer-events','keyboard-events');
});

test('mask noise and text contour interpolation use distinct concrete implementations',()=>{
 const noise=keys({id:12,renderVariant:3});has(noise,'raf','svg-filter-mask');lacks(noise,'waapi','flubber');
 const text=keys({id:20,renderVariant:4});has(text,'raf','manual-path-interpolation','svg');lacks(text,'flubber');
});

test('photo frames, Three frame generation and live SVG projection remain distinct',()=>{
 const photo=keys({id:26,renderVariant:2});has(photo,'canvas-frames','webp-sequence');lacks(photo,'three','three-frames','raf');
 const product=keys({id:26,renderVariant:0});has(product,'three-frames','svg-renderer-frames','canvas-frames','webp-sequence');lacks(product,'three','raf');
 const live=keys({id:36});has(live,'three','svg-renderer','raf');lacks(live,'canvas-frames','webp-sequence','three-frames');
});

test('input reporting separates mobile preview, touch and automatic model mode',()=>{
 const preview=keys({id:35,runtime:{pointerEnabled:true,inputMode:'preview'}});has(preview,'raf','keyboard-events');lacks(preview,'pointer-events');
 has(keys({id:35,runtime:{pointerEnabled:true,inputMode:'touch'}}),'pointer-events');
 const auto=keys({id:36,environment:{narrow:true,coarsePointer:true}});has(auto,'raf','three');lacks(auto,'pointer-events');
 const parallax=keys({id:21,renderVariant:4,environment:{narrow:true,coarsePointer:true}});has(parallax,'keyboard-events');lacks(parallax,'pointer-events','scroll-events');
});

test('pointer eyes do not mislabel an unused smoothing loop and zero-duration trails are absent',()=>{
 const eyes=keys({id:33});has(eyes,'css-transition','resize-observer');lacks(eyes,'raf','timers');
 has(keys({id:33,renderVariant:3}),'timers');
 const trail=keys({id:34,renderVariant:1});has(trail,'svg','timers');
 lacks(keys({id:34,renderVariant:1,values:{duration:0}}),'svg');
 const form=keys({id:28,scene:{ui:'form'}});lacks(form,'scroll-events','resize-observer','css-scroll-snap','keyboard-events');
});

test('icon branches call Flubber only for path morphs',()=>{
 has(keys({id:48,renderVariant:0}),'flubber','raf','svg');
 const star=keys({id:48,renderVariant:3});has(star,'css-transition','svg');lacks(star,'flubber','raf');
 lacks(keys({id:48,renderVariant:0,reduced:true}),'flubber','raf');
});

test('FLIP and shared-element geometry tween are not treated as the same algorithm',()=>{
 const layout=keys({id:49});has(layout,'flip','waapi');lacks(layout,'geometry-tween');
 const shared=keys({id:50});has(shared,'geometry-tween','waapi','raf-schedule');lacks(shared,'flip','timers');
 const button=keys({id:53,renderVariant:0});has(button,'waapi','css-transition');
});

test('nested UX examples report the inner renderer and current submode',()=>{
 lacks(keys({id:52,renderVariant:0}),'svg');
 const slide=keys({id:55,renderVariant:1});has(slide,'css-transition');lacks(slide,'waapi');
 const light=keys({id:55,scene:{ui:'trail'},runtime:{submode:'轻微明暗'}});has(light,'css-keyframes');lacks(light,'waapi','raf','timers');
 const bg=keys({id:55,scene:{ui:'trail'},runtime:{submode:'背景跟随',pointerEnabled:true,inputMode:'preview'}});has(bg,'raf','timers');lacks(bg,'pointer-events');
 const sequence=keys({id:55,scene:{ui:'sequence'},runtime:{submode:'图片序列'}});has(sequence,'three-frames','webp-sequence','raf');
 const carousel=keys({id:55,scene:{ui:'sequence'},runtime:{submode:'自动轮播'}});has(carousel,'css-transition','timers');lacks(carousel,'three-frames');
 const sort=keys({id:56,renderVariant:2});has(sort,'flip','pointer-events');lacks(sort,'timers');
});

test('retained-subject comparison selects the requested renderer branch',()=>{
 const list=scenes.items.find(item=>item.source_number===34).scenes,sceneIndex=list.findIndex(x=>x.ui==='hero');
 const config=api.buildEffectiveConfig({id:34,mode:'scenes',sceneIndex,variant:0,sceneVariant:null,comparisonVariant:1});
 assert.equal(config.scene.ui,'hero');assert.equal(config.renderVariant,1);has(keys(config),'svg');
 assert.deepEqual(config.technology,api.motionTechnologies(config).map(x=>x.name));
});

test('reference triggers and product combination preserve reviewed special cases',()=>{
 const press=api.triggerTechnologies({number:3,variant:0,duration:350}).map(t=>t.id);has(press,'dom-style','waapi');lacks(press,'css-transition');
 const scroll=api.triggerTechnologies({number:6,variant:0}).map(t=>t.id);has(scroll,'image-load','css-sticky','three-frames');
 const reduced=api.combinationTechnologies({index:5,reduced:true}).map(t=>t.id);has(reduced,'waapi','css-keyframes','keyboard-events');lacks(reduced,'geometry-tween','raf-schedule');
 const zero=api.combinationTechnologies({index:5,duration:0}).map(t=>t.id);lacks(zero,'waapi','geometry-tween','css-transition');
 has(api.combinationTechnologies({index:5,duration:0,environment:{narrow:true}}).map(t=>t.id),'css-transition','pointer-events');
});

 test('fade tooltip and scale press expose real interaction support',()=>{has(keys({id:6,scene:{ui:'tooltip'}}),'pointer-focus-events');has(keys({id:9,renderVariant:1}),'pointer-events','keyboard-events');lacks(keys({id:9,renderVariant:1,values:{duration:0}}),'pointer-events','keyboard-events')});

test('reviewed text input, spotlight masks, clipboard and paused sequence follow their active branch',()=>{
 has(keys({id:20,renderVariant:3}),'mouse-events');lacks(keys({id:20,renderVariant:3,reduced:true}),'mouse-events');
 has(keys({id:32,renderVariant:2,runtime:{pointerEnabled:true,inputMode:'pointer'}}),'css-gradient-mask','css-radial-gradient');
 lacks(keys({id:32,renderVariant:2,runtime:{pointerEnabled:false}}),'css-gradient-mask');
 has(keys({id:32,renderVariant:3,reduced:true}),'css-gradient-mask');
 has(keys({id:43,scene:{ui:'copy'}}),'clipboard-api');lacks(keys({id:43,scene:{ui:'save'}}),'clipboard-api');
 lacks(keys({id:55,scene:{ui:'sequence'},runtime:{submode:'图片序列',sequencePlaying:false}}),'raf');
 has(keys({id:55,scene:{ui:'sequence'},runtime:{submode:'图片序列',sequencePlaying:true}}),'raf');
});
