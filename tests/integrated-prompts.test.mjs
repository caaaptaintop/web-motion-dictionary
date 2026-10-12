import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundled=await build({entryPoints:[new URL('../src/integratedPrompt.js',import.meta.url).pathname],bundle:true,write:false,platform:'node',format:'esm'});
const {generateIntegratedPrompt:generate,supportsIntegratedPrompt:supports}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const duration={label:'反馈动画时长',value:1250,unit:'ms'};
test('trigger1–5 and six Hover combinations produce coherent selected-only text',()=>{
 for(const [n,size] of [[1,6],[2,3],[3,5],[4,5],[5,6]])for(let variant=0;variant<size;variant++){
  const p=generate(`T0${n}`,{variant,combination:-1,delay:450,threshold:20},n===2?[]:[duration]);
  assert.ok(p.length>45);assert.doesNotMatch(p,/undefined|NaN|本次选定|当前设置|当前参数|原文代表例/);
 }
 for(let combination=0;combination<6;combination++){
  const p=generate('T01',{variant:0,combination},[duration]);assert.ok(p.includes('1250毫秒'));assert.ok(p.includes('键盘'));
 }
});
test('repeat and leave replace the once-only representative requirement',()=>{
 const replay=generate('T05',{variant:3},[duration]);assert.match(replay,/每次进入/);assert.doesNotMatch(replay,/只播放一次|不重复闪烁/);
 const leave=generate('T05',{variant:1},[duration]);assert.match(leave,/离开视口.*离场/);assert.doesNotMatch(leave,/只播放一次/);
 const threshold=generate('T05',{variant:5,threshold:20},[{label:'进入可见比例',value:35,unit:'%'}]);assert.match(threshold,/35%/);assert.doesNotMatch(threshold,/20%|毫秒/);
});
test('long press uses actual wait and release values, speed keeps stable text',()=>{
 const p=generate('T03',{variant:4,delay:450},[{label:'长按触发时长',value:800,unit:'ms'},{label:'松开恢复时长',value:1250,unit:'ms'}]);assert.match(p,/按住按钮800毫秒/);assert.match(p,/松开恢复时长设为1250毫秒/);assert.doesNotMatch(p,/450毫秒/);
 const speed=generate('T04',{variant:4},[{label:'停止恢复时长',value:1800,unit:'ms'}]);assert.match(speed,/速度.*拉伸/);assert.match(speed,/停止恢复时长设为1800毫秒/);assert.match(speed,/文字跟着晃动/);assert.doesNotMatch(speed,/光晕/);
});
test('trigger6–10 preserve selected trigger scope and effective values',()=>{
 for(const [n,size] of [[6,4],[7,6],[8,6],[9,6],[10,5]])for(let v=0;v<size;v++){
  const ps=n===10?[{label:['启动延迟','播放间隔','定时间隔','空闲等待时间','循环间隔'][v],value:1700,unit:'ms'},{label:'单次动画时长',value:600,unit:'ms'}]:n===8?[{label:v===3?'入场时长':'每段入场时长',value:1000,unit:'ms'}]:[];
  const text=generate(`T${String(n).padStart(2,'0')}`,{variant:v},ps);assert.ok(text.length>40);assert.doesNotMatch(text,/undefined|NaN|本次选定|当前参数|已验证/);
 }
 const data=generate('T08',{variant:5},[{label:'每段入场时长',value:1000,unit:'ms'}]);assert.match(data,/实际内容加载完成/);assert.match(data,/1000毫秒/);assert.doesNotMatch(data,/离场时长/);
 const route=generate('T08',{variant:3},[{label:'入场时长',value:1000,unit:'ms'}]);assert.match(route,/离场时长设为550毫秒/);
 const toggle=generate('T09',{variant:1},[{label:'状态过渡时长',value:900,unit:'ms'}]);assert.match(toggle,/取消选择/);assert.doesNotMatch(toggle,/提交表单|加载时按钮/);
 const idle=generate('T10',{variant:3},[{label:'空闲等待时间',value:1700,unit:'ms'},{label:'单次动画时长',value:600,unit:'ms'}]);assert.match(idle,/最后一次操作后连续空闲1700毫秒/);assert.match(idle,/其他标签页时暂停/);
});
test('reduced state exports no ineffective duration or normal-motion command',()=>{
 for(const id of ['T01','T03','T04','T06','T07','T08','T09','T10']){
  const t=generate(id,{variant:0,reduced:true,combination:-1},[]);assert.doesNotMatch(t,/undefined|NaN|时长设为/);
 }
 assert.doesNotMatch(generate('T04',{variant:4,staticInput:true},[]),/移动越快|停止恢复时长/);
 assert.match(generate('T07',{variant:0,reduced:true},[]),/立即吸附/);
});
test('first five original combinations integrate only their actual controls',()=>{
 const intro=generate('B.S1.01',{reduced:false},[{label:'每项入场时长',value:900,unit:'ms'},{label:'交错间隔',value:180,unit:'ms'}]);assert.match(intro,/三张卡片/);assert.match(intro,/900毫秒/);assert.match(intro,/180毫秒/);assert.match(intro,/正文不要逐字/);assert.doesNotMatch(intro,/本次|当前参数/);
 const scroll=generate('B.S2.C04',{},[]);assert.match(scroll,/连续帧/);assert.doesNotMatch(scroll,/毫秒|undefined/);
 const reduced=generate('B.S2.C02',{reduced:true},[]);assert.match(reduced,/直接显示最终状态/);assert.doesNotMatch(reduced,/时长|间隔设为/);
});
test('full product combination preserves necessary operations and selected transition',()=>{
 const text=generate('B.S3.C01',{},[{label:'共享元素与面板过渡时长',value:1800,unit:'ms'}]);for(const required of ['1800毫秒','成功对勾','已加入购物车','锁定背景滚动','键盘焦点','按原路径恢复','现有的动画工具'])assert.ok(text.includes(required));assert.doesNotMatch(text,/本次选定|当前参数|相机|湖泊/);
 const reduced=generate('B.S3.C01',{reduced:true},[]);assert.match(reduced,/短促淡入淡出/);assert.doesNotMatch(reduced,/连续放大到详情页|毫秒/);
});
test('main1–5 replace representative count, spring prohibition and effective timing',()=>{
 const text=c=>generate('M'+String(c.id).padStart(2,'0'),{values:{},runtime:{},...c},c.parameters||[]);
 const steps=text({id:4,renderVariant:1,scene:{ui:'steps',label:'步骤流程'},parameters:[{key:'delay',label:'交错间隔',value:140,unit:'ms'}]});assert.match(steps,/3个步骤条目/);assert.match(steps,/140毫秒/);assert.doesNotMatch(steps,/六张|6张卡片/);
 const words=text({id:4,renderVariant:3,runtime:{granularity:'词'}});assert.match(words,/按词交错/);assert.doesNotMatch(words,/按行/);
 const jelly=text({id:5,renderVariant:3,values:{duration:1000},motion:{effectiveDuration:1400},parameters:[{key:'duration',label:'时长',value:1000,unit:'ms'}]});assert.match(jelly,/果冻式回弹/);assert.match(jelly,/实际回弹时长为1400毫秒/);assert.doesNotMatch(jelly,/不要产生夸张的果冻/);
 const reduced=text({id:5,renderVariant:2,reduced:true,scene:{ui:'drag'},parameters:[{key:'distance',label:'拖动距离',value:57,unit:'px'}]});assert.match(reduced,/57像素/);assert.match(reduced,/立即回到原位/);assert.doesNotMatch(reduced,/毫秒/);
});
test('zero stagger interval does not also prohibit simultaneous starts',()=>{
 const c={id:4,renderVariant:0,scene:{ui:'cards'},values:{delay:0},runtime:{},parameters:[{key:'delay',label:'交错间隔',value:0,unit:'ms'}]};const t=generate('M04',c,c.parameters);assert.match(t,/同步进入/);assert.doesNotMatch(t,/不要全部同时启动/);
});
test('fade and crossfade keep distinct ordering and correct image scope',()=>{
 const c={id:6,renderVariant:3,scene:{ui:'image'},values:{duration:1000},motion:{effectiveDuration:1000},parameters:[{key:'duration',label:'时长',value:1000,unit:'ms'}]};const t=generate('M06',c,c.parameters);assert.match(t,/先将旧图淡出/);assert.match(t,/旧图淡出时长为650毫秒/);assert.match(t,/新图淡入时长设为1000毫秒/);
 const cross=generate('M07',{...c,id:7,renderVariant:0,scene:{ui:'carousel'}},c.parameters);assert.match(cross,/旧内容淡出的同时/);assert.match(cross,/取消上一段未完成/);
});
test('reveal variants replace representative geometry without dropping invariants',()=>{
 const gen=(id,v,scene)=>generate('M'+id,{id,renderVariant:v,scene,values:{},parameters:[]},[]);
 const round=gen(11,3);assert.match(round,/圆形/);assert.doesNotMatch(round,/从左向右/);assert.match(round,/不叠加旋转/);
 const light=gen(12,1);assert.match(light,/重点文字/);assert.doesNotMatch(light,/主视觉图片/);
 const wipe=gen(13,2);assert.match(wipe,/两侧向中央/);assert.match(wipe,/完全覆盖旧内容后才替换/);assert.match(wipe,/允许跳过/);
 const masked=gen(14,3);assert.match(masked,/裁剪窗口/);assert.match(masked,/正文只使用普通淡入/);assert.doesNotMatch(masked,/渐变蒙版/);
 const blur=gen(14,4);assert.match(blur,/模糊逐渐变清晰/);assert.doesNotMatch(blur,/裁剪窗口/);
 for(let v=0;v<4;v++)assert.match(gen(15,v),/不要拆成单个字符/);
});
test('typewriter loop replaces no-loop representative and search scene adds no caret',()=>{
 const c={id:18,renderVariant:3,values:{duration:900},parameters:[]};const loop=generate('M18',c,[]);assert.match(loop,/逐字删除/);assert.doesNotMatch(loop,/不循环删除/);
 const staticText=generate('M18',{...c,values:{duration:0}},[]);assert.match(staticText,/不进行逐字输入、删除或自动循环/);
 const search=generate('M18',{...c,renderVariant:2,scene:{ui:'search'}},[]);assert.doesNotMatch(search,/光标/);
});
test('text morph differs for manual states, cyclic keywords and SVG geometry',()=>{
 const c={id:20,renderVariant:1,scene:{ui:'status'},values:{duration:700}};const state=generate('M20',c,[]);assert.match(state,/Loading.*Ready/);assert.match(state,/单次更新/);assert.doesNotMatch(state,/三个短词|暂停循环/);
 const svg=generate('M20',{...c,renderVariant:4,scene:null},[]);assert.match(svg,/轮廓连续变化/);assert.doesNotMatch(svg,/交叉淡化|容器宽度/);
 const loop=generate('M20',{...c,renderVariant:3,scene:{ui:'keywords'}},[]);assert.match(loop,/三个短词/);assert.match(loop,/暂停循环/);
});
test('scroll prompts preserve selected layers, direction, map and vertical adaptation',()=>{
 const c=(id,v,extra={})=>({id,renderVariant:v,values:{distance:120,speed:1},runtime:{},...extra});
 assert.match(generate('M21',c(21,4),[]),/不依赖页面滚动/);
 assert.match(generate('M21',c(21,0),[]),/标题与正文保持正常滚动/);
 assert.match(generate('M22',c(22,0),[]),/天空、山体、人物与前景植物/);
 assert.doesNotMatch(generate('M22',c(22,0),[]),/三层/);
 const vertical=generate('M23',c(23,0,{runtime:{horizontal:false}}),[]);assert.match(vertical,/普通纵向列表/);assert.doesNotMatch(vertical,/从右向左/);
 const map=generate('M24',c(24,2),[]);assert.match(map,/全局逐渐缩放到城市/);assert.match(map,/地名和标记保持清晰/);assert.doesNotMatch(map,/产品图片/);
 const story=generate('M25',c(25,2),[]);assert.match(story,/地图的取景与比例保持固定/);assert.match(story,/路线持续更新/);assert.doesNotMatch(story,/右侧只更新对应区域/);
 const base=generate('M21',c(21,0),[{key:'distance',label:'层间位移差',value:180,unit:'px'}]);assert.match(base,/层间位移差基准设为180像素/);
});
test('sequence, snap, indicator, magnetic and tilt choices replace representative actions',()=>{
 const c=(id,v,extra={})=>({id,renderVariant:v,values:{},runtime:{},...extra});
 const shell=generate('M26',c(26,1),[]);assert.match(shell,/外壳.*拆开/);assert.doesNotMatch(shell,/一圈/);assert.match(shell,/静态主图/);
 assert.match(generate('M27',c(27,4),[]),/只在靠近目标/);
 const ring=generate('M28',c(28,3),[]);assert.match(ring,/圆环/);assert.doesNotMatch(ring,/顶部细进度条/);
 const text=generate('M29',c(29,1),[{key:'distance',label:'感应范围',value:180,unit:'px'}]);assert.match(text,/外框和图标保持不动/);assert.match(text,/感应范围基准设为180像素/);
 const staticTilt=generate('M30',c(30,2,{runtime:{pointerEnabled:false}}),[]);assert.match(staticTilt,/保持正面静止/);assert.doesNotMatch(staticTilt,/随光标.*旋转/);
});
test('pointer prompts preserve only chosen feedback and static effective parameters',()=>{
 const c=(id,v,extra={})=>({id,renderVariant:v,runtime:{},values:{},...extra});
 const video=generate('M31',c(31,2),[]);assert.match(video,/播放图标/);assert.doesNotMatch(video,/显示“查看”/);assert.match(video,/输入框和手机端使用系统默认/);
 const hidden=generate('M32',c(32,2),[]);assert.match(hidden,/隐藏文字/);assert.match(hidden,/不改变正文亮度/);
 const blink=generate('M33',c(33,3),[]);assert.match(blink,/点击角色时短暂眨眼/);assert.match(blink,/不能越过眼睛边缘/);
 const photo=generate('M34',c(34,2),[]);assert.match(photo,/小图片/);assert.doesNotMatch(photo,/留下少量圆点/);assert.match(photo,/正文、按钮和输入框/);
 const layers=generate('M35',c(35,4),[]);assert.match(layers,/各自与光标的距离/);assert.doesNotMatch(layers,/网格.*弯曲/);
 const staticLight=generate('M32',c(32,0,{runtime:{pointerEnabled:false}}),[{key:'distance',value:100,unit:'px'}]);assert.match(staticLight,/固定的静态/);assert.match(staticLight,/100像素/);
});
test('surface prompts retain focus, locking, side, and light-versus-model distinctions',()=>{
 const c=(id,v,extra={})=>({id,renderVariant:v,runtime:{},values:{duration:1000},...extra});
 const light=generate('M36',c(36,3),[]);assert.match(light,/灯光方向/);assert.match(light,/几何姿态保持不变/);assert.doesNotMatch(light,/手机端改为轻微自动旋转/);
 const settings=generate('M37',c(37,1),[]);assert.match(settings,/设置选项/);assert.match(settings,/加号同步变成减号/);
 const tooltip=generate('M38',c(38,3),[]);assert.match(tooltip,/提示中不放/);assert.match(tooltip,/键盘聚焦/);
 const warning=generate('M39',c(39,3),[{key:'duration',label:'基准时长',value:1000,unit:'ms'}]);assert.match(warning,/实际弹窗时长为350毫秒/);assert.match(warning,/锁定背景滚动/);
 const nav=generate('M40',c(40,1),[]);assert.match(nav,/从左侧滑入/);assert.match(nav,/向左侧退回/);assert.doesNotMatch(nav,/购物车/);
});
test('content feedback prompts specialize Toast semantics, exact counter target and skeleton style',()=>{
 const c=(id,v,extra={})=>({id,renderVariant:v,runtime:{},values:{duration:1000,target:0},...extra});
 const stack=generate('M43',c(43,2),[]);assert.match(stack,/最多保留三条/);assert.doesNotMatch(stack,/更新同一条/);
 const save=generate('M43',c(43,0,{scene:{ui:'save',label:'保存'}}),[]);assert.match(save,/保存成功/);assert.doesNotMatch(save,/已复制/);
 const error=generate('M43',c(43,4),[]);assert.match(error,/持续保留/);assert.doesNotMatch(error,/再退出/);
 const counter=generate('M44',c(44,1,{runtime:{counterTarget:1280,counterDirection:'increase'}}),[]);assert.match(counter,/更新到准确目标0/);assert.doesNotMatch(counter,/增长到.*0|480/);
 const staticSkeleton=generate('M45',c(45,0),[]);assert.match(staticSkeleton,/灰色条/);assert.doesNotMatch(staticSkeleton,/使用轻微.*呼吸/);
 const shine=generate('M45',c(45,4),[{key:'duration',label:'加载等待',value:1500,unit:'ms'}]);assert.match(shine,/内容加载等待时长设为1500毫秒/);assert.match(shine,/柔和高光/);
});
test('task, result, icon, layout and shared-element outputs keep actual selected identities',()=>{
 const c=(id,v,extra={})=>({id,renderVariant:v,values:{duration:1200},runtime:{},...extra});
 const dots=generate('M46',c(46,1),[]);assert.match(dots,/三个依次跳动的圆点/);assert.doesNotMatch(dots,/显示小型旋转图标/);
 const reduce=generate('M47',c(47,0,{reduced:true}),[{key:'duration',label:'处理等待',value:1200,unit:'ms'}]);assert.match(reduce,/演示处理等待设为1200毫秒/);assert.doesNotMatch(reduce,/沿路径绘制出来/);
 const star=generate('M48',c(48,3),[]);assert.match(star,/空心.*实心/);assert.match(star,/外轮廓稳定/);assert.doesNotMatch(star,/三条横线|叉号/);
 const sort=generate('M49',c(49,2),[]);assert.match(sort,/上下移动按钮/);assert.doesNotMatch(sort,/筛选后/);
 const avatar=generate('M50',c(50,1),[]);assert.match(avatar,/头像连续移动到个人主页顶部/);assert.doesNotMatch(avatar,/标题跟随/);
 const title=generate('M50',c(50,4),[]);assert.match(title,/列表标题/);assert.doesNotMatch(title,/图片准备好/);
});
test('UX rule prompts preserve selected observation and reduced nested mode',()=>{
 const c=(id,v,extra={})=>({id,renderVariant:v,runtime:{},values:{duration:650},...extra});
 const wipe=generate('M51',c(51,3),[]);assert.match(wipe,/色幕/);assert.doesNotMatch(wipe,/从右侧轻微滑入/);
 const retry=generate('M52',c(52,3),[]);assert.match(retry,/失败后明确说明怎样修正/);assert.match(retry,/下一步入口/);
 const input=generate('M53',c(53,4),[]);assert.match(input,/预设内容选择/);assert.doesNotMatch(input,/按下时立即轻微缩小/);
 const end=generate('M54',c(54,4),[]);assert.match(end,/焦点移到明确可用的下一步/);
 const carousel=generate('M55',c(55,4,{reduced:true,runtime:{submode:'自动轮播'}}),[]);assert.match(carousel,/停止自动轮播/);assert.match(carousel,/手动浏览/);assert.doesNotMatch(carousel,/静态首帧/);
 const trail=generate('M55',c(55,3,{runtime:{submode:'背景跟随'}}),[]);assert.match(trail,/背景在指针附近轻微响应/);assert.doesNotMatch(trail,/留下少量/);
});
test('input rules specialize alternatives and tool reuse stays complete without settings',()=>{
 const c=(v,extra={})=>({id:56,renderVariant:v,runtime:{},values:{duration:650},...extra});
 const sort=generate('M56',c(2),[]);assert.match(sort,/上移和下移按钮/);assert.doesNotMatch(sort,/下一项按钮/);
 const swipe=generate('M56',c(4),[]);assert.match(swipe,/上一项和下一项/);
 const pointer=generate('M56',c(3,{runtime:{pointerEnabled:false}}),[]);assert.match(pointer,/系统默认光标和静态内容/);assert.doesNotMatch(pointer,/外环稍延迟/);
 const tools=generate('TOOLS.REUSE',{},[]);assert.match(tools,/优先复用已有方案/);assert.doesNotMatch(tools,/本次选定|当前设置|追加/);
});

test('all73 original prompt IDs use continuous generation',async()=>{
 const fs=await import('node:fs');const originals=JSON.parse(fs.readFileSync(new URL('../src/originalPrompts.json',import.meta.url),'utf8'));
 assert.equal(Object.keys(originals).length,73);for(const id of Object.keys(originals))assert.equal(supports(id),true,id);
});
