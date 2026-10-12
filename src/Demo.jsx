import {decodeImage,nextImageSource,preferredImageSource,rememberImageSource} from './imageAssets.js';
import {StableImage} from './StableImage.jsx';
import {TravelCard as Travel} from './TravelCard';
import React,{useRef,useState,useEffect,useLayoutEffect} from 'react';
import {Play,Pause,Check,X,Plus,Minus,ArrowRight,ArrowLeft,CaretDown,List,Star,Camera,Spinner,Hand,ArrowsOut,Warning,ArrowCounterClockwise,DotsSixVertical} from '@phosphor-icons/react';
import * as THREE from 'three';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
import {BasicDemo} from './BasicDemo';
import {TextDemo} from './TextDemo';
import {TextScenes} from './TextScenes';
import {ComponentDemo} from './ComponentDemo';
import {PointerDemo} from './PointerDemo';
import {MapVisual} from './MapVisual';
import {ScrollEffects} from './ScrollEffects';
import {ReadingSnap} from './ReadingSnap';
import {PointerCore} from './PointerCore';
import {PointerLab} from './PointerLab';
import {ModelFollow} from './ModelFollow';
import {SurfaceComponents} from './SurfaceComponents';
import {ContentComponents} from './ContentComponents';
import {RuleComponents} from './RuleComponents';import {ActionComponents} from './ActionComponents';import {LayoutComponents} from './LayoutComponents';
const A='/assets/';
const d=(key,label,value,min,max,unit,step)=>({key,label,value,min,max,unit,step});
export function parameterSets(id){
const duration=d('duration','时长',id===44?1400:id===30?320:650,0,3000,'ms');
if(id===30)return[d('angle','最大倾角',12,0,30,'°'),d('perspective','透视距离',900,300,2000,'px'),{...duration,label:'回正时长'}];
if(id===27||id===28||id===55)return [];
if(id>=21&&id<=26)return[d('speed','滚动倍率',1,.1,3,'×',.1),...(id===21||id===22||id===24?[d('distance',id===24?'缩放幅度':'位移范围',120,0,400,id===24?'%':'px')]:[])];
if(id===31)return [d('size','光标尺寸',48,32,100,'px'),{...duration,label:'跟随时长',value:220}];
if(id===32)return [d('distance','光区半径设定',100,30,240,'px'),{...duration,label:'跟随时长',value:220}];
if(id===33)return [d('distance','瞳孔位移',35,0,80,'%'),{...duration,label:'跟随时长',value:220}];
if(id===34)return [d('distance','拖尾大小',10,4,30,'px'),{...duration,label:'消散时长',value:650}];
if(id===36)return [d('distance','响应幅度',50,0,100,'%'),{...duration,label:'跟随时长',value:220}];
if(id>=29&&id<=35)return [d('distance',id===29?'感应范围':'响应范围',50,5,180,'px'),{...duration,label:'跟随时长',value:220}];
if(id===51)return[{...duration,label:'转场时长'}];
if(id===52)return[{...duration,label:'处理与反馈时长'}];
if(id===53)return[{...duration,label:'反馈时长'}];
if(id===47)return[{...duration,label:'处理与反馈时长'}];
if(id===49)return[{...duration,label:'单段动效时长'}];
if(id===46)return[{...duration,label:'本地演示任务时长',value:1800}];
if(id===45)return[{...duration,label:'加载等待',value:1200}];
if(id===44)return[d('target','目标数值',1280,0,10000,''),duration];
if(id===5)return[{...duration,value:900},d('distance','移动距离',120,0,240,'px'),d('strength','回弹强度',1,.1,2,'×',.1)];
if(id===1||id===8)return [duration,d('distance','位移幅度',60,0,240,'px')];
if(id===3||id===4||id>=14&&id<=20)return[duration,d('delay','延迟',id===3?350:id===4?80:0,0,1500,'ms')];
return [duration];}
export {Travel};
export function Demo({id,variant:v,params:p,run,playRun,reduced,onRuntimeChange}){
const ref=useRef(null),[point,setPoint]=useState({x:0,y:0});useEffect(()=>setPoint({x:0,y:0}),[id,v,run]);
if(id<=13)return <BasicDemo {...{id,v,p,run,playRun,reduced,onRuntimeChange}}/>;
if(id===17&&v===0)return <TextScenes id={17} scene={{id:'M17.V01',ui:'chinese'}} variant={0} params={p} run={run} reduced={reduced}/>;
if(id<=20)return <TextDemo {...{id,v,p,run,reduced}}/>;
if(id<=26)return <ScrollEffects {...{id,v,p,reduced,run,onRuntimeChange}}/>;
if(id<=28)return <ReadingSnap {...{id,v,reduced,run}}/>;
if(id<=30)return <PointerCore {...{id,v,p,run,reduced,onRuntimeChange}}/>;
if(id<=35)return <PointerLab {...{id,v,p,run,reduced,onRuntimeChange}}/>;
if(id===36)return <ModelFollow {...{v,p,run,reduced,onRuntimeChange}}/>;
if(id<=40)return <SurfaceComponents {...{id,v,p,run,reduced}}/>;
if(id<=45)return <ContentComponents {...{id,v,p,run,reduced}}/>;
if(id<=48)return <ActionComponents {...{id,v,p,run,reduced}}/>;
if(id<=50)return <LayoutComponents {...{id,v,p,run,reduced}}/>;
if(id<=56)return <RuleComponents {...{id,v,p,run,reduced,onRuntimeChange}}/>;
return <ComponentDemo {...{id,v,p,run,reduced}}/>;
}
function makeScene(canvas,robot=false,model='camera'){const renderer=new SVGRenderer();renderer.setSize(640,480);renderer.setQuality('high');renderer.setClearColor(new THREE.Color(0xf6f7fa));const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,640/480,.1,100);cam.position.set(0,1.1,6.5);cam.lookAt(0,0,0);const group=new THREE.Group();scene.add(group);const body=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.5,.7),new THREE.MeshStandardMaterial({color:0x35404a,roughness:.55,metalness:.65}));group.add(body);const lens=new THREE.Mesh(new THREE.CylinderGeometry(.55,.65,.8,48,1,true),new THREE.MeshStandardMaterial({color:0x172331,metalness:.8,roughness:.2}));lens.rotation.x=Math.PI/2;lens.position.z=.65;group.add(lens);const glass=new THREE.Mesh(new THREE.CircleGeometry(.43,48),new THREE.MeshStandardMaterial({color:0x347388,metalness:.9,roughness:.15}));glass.position.z=1.13;group.add(glass);const button=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.15,24),new THREE.MeshStandardMaterial({color:0xc1c8cd,metalness:.8,roughness:.2}));button.position.set(.8,.82,0);group.add(button);const grip=new THREE.Mesh(new THREE.BoxGeometry(.45,1.55,.85),new THREE.MeshStandardMaterial({color:0x18212a,roughness:.85}));grip.position.x=-1.05;group.add(grip);if(robot){while(group.children.length)group.remove(group.children[0]);const shell=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),new THREE.MeshStandardMaterial({color:0xe4eee9,roughness:.3,metalness:.3}));shell.scale.set(1.1,.9,.85);group.add(shell);const visor=new THREE.Mesh(new THREE.SphereGeometry(.76,32,20),new THREE.MeshStandardMaterial({color:0x1e3446,roughness:.2,metalness:.4}));visor.scale.set(1.15,.62,.3);visor.position.z=.65;visor.userData.followSvgLayer=1;group.add(visor);for(let x of [-.36,.36]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.13,24,16),new THREE.MeshStandardMaterial({color:0xafe8db,emissive:0x448d80,roughness:.3}));eye.position.set(x,0,.88);eye.userData.followSvgLayer=2;group.add(eye)}const aerial=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.45,16),new THREE.MeshStandardMaterial({color:0x638482}));aerial.position.y=1;group.add(aerial);const top=new THREE.Mesh(new THREE.SphereGeometry(.1,20,16),new THREE.MeshStandardMaterial({color:0x7cbdaa}));top.position.y=1.25;group.add(top)}if(model!=='camera'&&model!=='robot'){while(group.children.length)group.remove(group.children[0]);populateProduct(group,model);}
scene.add(new THREE.AmbientLight(0xffffff,.8));const light=new THREE.DirectionalLight(0xffffff,1.8);light.position.set(3,4,5);scene.add(light);return {renderer,scene,cam,group,lens,glass,light,model};}
function prepareExplodedShell(w){
 const body=w.group.children[0],button=w.group.children[3],grip=w.group.children[4];body.visible=false;
 const material=body.material,shells=[-1,1].map(side=>{const shell=new THREE.Group();shell.position.x=side*.6;
 const part=(x,y,z,px,py,pz)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(x,y,z),material);mesh.position.set(px,py,pz);shell.add(mesh)};
 part(1.2,1.5,.08,0,0,.31);part(1.2,1.5,.08,0,0,-.31);part(1.2,.08,.7,0,.71,0);part(1.2,.08,.7,0,-.71,0);part(.08,1.5,.7,side*.56,0,0);w.group.add(shell);return shell});
 w.group.remove(grip);grip.position.x=-.45;shells[0].add(grip);w.group.remove(button);button.position.x=.2;shells[1].add(button);
 const internals=new THREE.Group(),board=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.1,.16),new THREE.MeshStandardMaterial({color:0x356b75,roughness:.7}));internals.add(board);
 const sensor=new THREE.Mesh(new THREE.BoxGeometry(.68,.54,.12),new THREE.MeshStandardMaterial({color:0x172331,metalness:.4,roughness:.3}));sensor.position.z=.15;internals.add(sensor);
 for(const x of [-.6,.6])for(const y of [-.32,.32]){const chip=new THREE.Mesh(new THREE.BoxGeometry(.22,.18,.12),new THREE.MeshStandardMaterial({color:0xb6b4a5,metalness:.6,roughness:.4}));chip.position.set(x,y,.15);internals.add(chip)}
 w.group.add(internals);w.shells=shells;
}
function orderSequenceSurfaces(w){
 if(w.model!=='car'&&w.model!=='phone')return;
 w.group.updateWorldMatrix(true,true);w.cam.updateWorldMatrix(true,false);
 const front=w.group.worldToLocal(w.cam.getWorldPosition(new THREE.Vector3())).z>=0;
 w.group.traverse(o=>{const layer=o.userData.followSvgLayer;if(layer==null)return;
  o.renderOrder=front?layer:w.model==='car'?(layer>0?layer-4:layer+4):layer-3;
 });
}
const sequenceCache=new Map();
async function renderSequence(w,variant,frameCount=48){const out=[],canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;const ctx=canvas.getContext('2d');for(let i=0;i<frameCount;i++){let z=i/(frameCount-1);if(variant===6){let first=Math.min(1,z*2),second=Math.max(0,z*2-1);w.lens.position.z=.65+first*1.2;w.glass.position.z=1.13+first*1.2+second*1.0}else if(variant===1){w.shells?.forEach((shell,j)=>shell.position.x=(j?1:-1)*(.6+z*.85));w.lens.position.z=.65+z*1.5;w.glass.position.z=1.13+z*1.7}else if(variant===3){w.group.rotation.y=z*Math.PI*.7;w.cam.position.set(Math.sin(z*Math.PI)*1.4,1.1,6.5-z*1.7);w.cam.lookAt(0,0,0);w.light.position.set(3-z*5,4,5)}else w.group.rotation.y=z*Math.PI*2;orderSequenceSurfaces(w);w.renderer.render(w.scene,w.cam);const xml=new XMLSerializer().serializeToString(w.renderer.domElement),url=URL.createObjectURL(new Blob([xml],{type:'image/svg+xml'}));const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url});ctx.fillStyle='#f6f7fa';ctx.fillRect(0,0,640,480);ctx.drawImage(image,0,0,640,480);out.push(canvas.toDataURL('image/webp',.78));URL.revokeObjectURL(url)}return out}
export function ThreeObject({point={x:0,y:0},variant=0,sequence=false,progress=0,duration=220,model='camera'}){
const surface=useRef(null),world=useRef(null),[frames,setFrames]=useState([]),[error,setError]=useState(false),[ready,setReady]=useState(false);
useLayoutEffect(()=>{let w,dead=false;setReady(false);setError(false);setFrames([]);try{w=makeScene(null,model==='robot'||!sequence&&variant===1&&model==='camera',model);world.current=w;if(!sequence)w.group.traverse(o=>{if(o.userData.followSvgLayer!=null)o.renderOrder=o.userData.followSvgLayer});if(sequence&&variant===1&&model==='camera')prepareExplodedShell(w);if(sequence){orderSequenceSurfaces(w);w.renderer.render(w.scene,w.cam);surface.current?.replaceChildren(w.renderer.domElement.cloneNode(true));const frameCount=matchMedia('(max-width:850px)').matches?24:48;let key=model+':'+variant+':'+frameCount;let promise=sequenceCache.get(key);if(!promise){promise=renderSequence(w,variant,frameCount);sequenceCache.set(key,promise)}promise.then(out=>{if(!dead)setFrames(out)}).catch(()=>{sequenceCache.delete(key);if(!dead)setError(true)})}else{surface.current.replaceChildren(w.renderer.domElement);w.renderer.domElement.setAttribute('aria-label','实时投影的三维物体');w.renderer.domElement.setAttribute('role','img');w.renderer.render(w.scene,w.cam)}setReady(true)}catch{setError(true)}return()=>{dead=true;world.current=null;if(!sequence)w?.scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.()});surface.current?.replaceChildren()}},[sequence,variant,model]);
useEffect(()=>{const w=world.current;if(!w||sequence)return;let start=performance.now(),raf;const from={x:w.group.rotation.x,y:w.group.rotation.y,cx:w.cam.position.x,lx:w.light.position.x,ly:w.light.position.y};function tick(t){let z=Math.min(1,(t-start)/Math.max(duration,1)),k=1-Math.pow(1-z,3);if(variant===2){w.cam.position.x=from.cx+(point.x*2-from.cx)*k;w.cam.lookAt(0,0,0)}else if(variant===3){w.light.position.set(from.lx+(point.x*8-from.lx)*k,from.ly+(2-point.y*6-from.ly)*k,5)}else{w.group.rotation.y=from.y+(point.x*1.2-from.y)*k;w.group.rotation.x=from.x+(point.y*.7-from.x)*k}w.renderer.render(w.scene,w.cam);if(z<1)raf=requestAnimationFrame(tick)}raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[point,variant,sequence,duration]);
return <div className="three-object" data-renderer="three-svg-cpu">{(!ready||error)&&<StableImage src={A+'models/'+model+'.svg'} alt="静态模型预览"/>}{error&&<p role="alert">暂时显示静态预览</p>}<div ref={surface} className="three-surface" style={{display:error||!ready||sequence&&frames.length>0?'none':'block'}}/>{sequence&&frames.length>0?<StableImage fallbackSrc={A+'models/'+model+'.svg'} src={frames[Math.round(progress/100*(frames.length-1))]} alt={({car:'汽车',phone:'手机',clothing:'服装',shoe:'鞋',robot:'角色',game:'游戏道具',camera:'相机'}[model]||'产品')+'序列第'+(Math.round(progress/100*(frames.length-1))+1)+'帧'}/>:sequence&&!error?<span className="sequence-loading">正在载入…</span>:null}</div>}
function ScrollDemo({id,v,p,reduced,run}){const [z,setZ]=useState(0),scroll=useRef(null);useEffect(()=>{setZ(0);if(scroll.current)scroll.current.scrollTop=0},[run,v]);const n=z/100,move=reduced?0:(p.distance??120)*n,narrow=typeof matchMedia!=='undefined'&&matchMedia('(max-width:850px)').matches;return <div className={'scroll-demo scroll-'+id} data-progress={z}>
 <div className="scroll-toolbar"><span>在演示区内滚动，或拖动进度</span><label><input type="range" min="0" max="100" value={z} aria-label="滚动进度" onChange={e=>setZ(+e.target.value)}/><output>{Math.round(z)}%</output></label></div>
 <div className="scroll-window" ref={scroll} tabIndex={0} onPointerMove={e=>{if(id===21&&v===4&&e.pointerType==='mouse'){let b=scroll.current.getBoundingClientRect();setZ((e.clientX-b.left)/b.width*100)}}} onWheel={e=>setZ(a=>Math.max(0,Math.min(100,a+e.deltaY*.06*(p.speed||1))))} onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();setZ(a=>Math.min(100,a+10))}if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();setZ(a=>Math.max(0,a-10))}}}>
 {id===21&&<><StableImage className="parallax-photo" src={A+'alpine-lake.png'} style={{transform:`translateY(${v===3?-move:move*.4}px) scale(1.3)`}} alt="山间湖景"/><div className="parallax-copy" style={{transform:`translateY(${-move*(v===1?1.4:1)}px)`}}><small>ALPINE ESCAPE</small><h3>在山与湖之间</h3><p>向下探索，让景物在不同速度中展开</p></div></>}
 {id===22&&<><StableImage className="parallax-photo" src={A+(v===1?'travel-camera.png':'alpine-lake.png')} alt="远景" style={{transform:`translate(${v===3?move*.2:0}px,${move*.15}px) scale(1.3)`}}/><StableImage className="parallax-robot" src={A+'friendly-robot.png'} alt="近景角色" style={{transform:`translate(${v===3?-move*.35:0}px,${-move*.7}px)`}}/><h3 className="parallax-layer-title" style={{transform:`translateY(${-move*.4}px)`}}>探索 · 自然</h3></>}
 {id===23&&<div className={"horizontal-track "+(v===4?"mobile-vertical":"")} style={{transform:v===4&&narrow?`translate(-50%,${-n*660}px)`:`translateX(${-n*660}px)`}}>{[0,1,2,3].map(i=><div key={i}><Travel camera={i%2===1}/><b>{(v===2?['09:00 出发','11:00 山谷','14:00 湖畔','17:00 归途']:v===1?['观察细节','记录画面','留住灵感','继续探索']:['山间湖畔','随行记录','远方的路','继续探索'])[i]}</b></div>)}</div>}
 {id===24&&(v===2?<MapVisual progress={n} zoom/>:<Travel camera={v===1} style={{transform:`scale(${1+(reduced?0:n*(v===1?.6:1.3))})`,transition:'transform 70ms linear'}}/>)}
 {id===25&&v===2?<MapVisual progress={n}/>:id===25&&v===4?<><StableImage className="parallax-photo" src={A+'alpine-lake.png'} alt="固定背景湖景"/><div className="parallax-copy story-chapter" key={Math.floor(n*3)}><small>0{Math.min(3,Math.floor(n*3)+1)}</small><h3>{['向山而行','停留湖畔','带回灵感'][Math.min(2,Math.floor(n*3))]}</h3></div></>:id===25&&<div className="story"><div><small>0{Math.min(3,Math.floor(n*3)+1)} / 03</small><h3>{['出发','穿过山谷','抵达湖畔'][Math.min(2,Math.floor(n*3))]}</h3><p>{['准备好随行装备','从新的角度看世界','记住这一刻的宁静'][Math.min(2,Math.floor(n*3))]}</p></div>{v===1?<ThreeObject point={{x:(n-.5)*.8,y:0}} variant={0}/>:v===3?<div className="long-photo"><StableImage src={A+'alpine-lake.png'} alt="湖景长图" style={{transform:`translateY(${-n*180}px)`}}/></div>:<Travel camera={n<.34}/>}</div>}
 {id===26&&<>{v===2||v===3?<PhotoSequence key={v} variant={v} progress={z}/>:<ThreeObject key={v} point={{x:0,y:0}} sequence variant={v} progress={z}/>}<span className="sequence-label">{Math.round(n*100)}% · 双向滚动</span></>}
 {id===27&&<div className={'snap-track '+(v===0||v===3?'vertical-snap':'')} style={{transform:`translate${v===0||v===3?'Y':'X'}(${-Math.round(n*2)*100}%)`,transitionTimingFunction:v===4?'cubic-bezier(.2,.8,.2,1)':'ease'}}>{[0,1,2].map(i=><div key={i}><Travel camera={i===1}/><b>{i+1} / 3</b></div>)}</div>}
 {id===28&&<>{v===3?<div className="reading-ring ring-progress" style={{background:`conic-gradient(#246bfe ${z}%,#e1e8f2 0)`}}><span>{Math.round(z)}%</span></div>:v===4?<div className="reading-timeline">{[0,1,2,3,4].map(i=><span className={n*5>=i?'done':''} key={i}>{i+1}</span>)}</div>:v===2?<div className="reading-nav">{['出发','山谷','湖畔','记录','归途'].map((t,i)=><span className={Math.min(4,Math.floor(n*5))===i?'active':''} key={t}>{t}</span>)}</div>:<div className="reading-progress" style={{width:z+'%'}}/>}<div className="reading-page"><span>{v===1?'章节 '+Math.min(5,Math.floor(n*5)+1)+'/5':Math.round(z)+'% 已读'}</span><h3>沿着湖岸，慢慢前行</h3><p>每一步，都能看见不同的风景。</p><Travel/></div></>}
 </div><span className="demo-hint">滚轮 / 方向键 / 进度滑块 · 向上可逆向恢复</span></div>}
export function PhotoSequence({variant,progress,onReadiness}){
 const [frames,setFrames]=useState([]),[error,setError]=useState(false);
 useEffect(()=>{
  let cancelled=false;setFrames([]);setError(false);onReadiness?.(false,false);
  const prepare=async()=>{
   const img=new Image();img.src=A+(variant===2?'alpine-lake.png':'friendly-robot.png');await decodeImage(img);if(cancelled)return;
   const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;const ctx=canvas.getContext('2d'),out=[];
   const frameCount=matchMedia('(max-width:850px)').matches?24:48;
   for(let i=0;i<frameCount;i++){
    const n=i/(frameCount-1);ctx.clearRect(0,0,640,480);ctx.fillStyle='#f4f6f9';ctx.fillRect(0,0,640,480);ctx.save();
    if(variant===2){ctx.filter=`brightness(${1-n*.7}) saturate(${1-n*.45})`;ctx.drawImage(img,0,20,640,426);ctx.filter='none';ctx.fillStyle=`rgba(15,36,92,${n*.3})`;ctx.fillRect(0,20,640,426)}
    else{ctx.translate(320,265);ctx.rotate(Math.sin(n*Math.PI*2)*.15);ctx.translate(-320,-265-Math.sin(n*Math.PI)*35);ctx.drawImage(img,130,65,380,380)}
    ctx.restore();out.push(canvas.toDataURL('image/webp',.78));
   }
   await Promise.all(out.map(async src=>{const frame=new Image();frame.src=src;await decodeImage(frame)}));
   if(!cancelled){setFrames(out);onReadiness?.(true,false)}
  };
  prepare().catch(()=>{if(!cancelled){setError(true);onReadiness?.(true,true)}});
  return()=>{cancelled=true};
 },[variant,onReadiness]);
 return <div className="three-object">{frames.length?<StableImage fallbackSrc={A+(variant===2?'alpine-lake.png':'friendly-robot.png')} src={frames[Math.round(Math.max(0,Math.min(100,progress))/100*(frames.length-1))]} alt={variant===2?'昼夜光线变化序列':'原创角色动作序列'}/>:<><svg viewBox="0 0 640 480" style={{width:'100%',height:'100%'}} role="img" aria-label="正在准备序列帧的静态主图"><rect width="640" height="480" fill="#f4f6f9"/><image href={preferredImageSource(A+(variant===2?'alpine-lake.png':'friendly-robot.png'))} onError={e=>{const next=nextImageSource(A+(variant===2?'alpine-lake.png':'friendly-robot.png'),e.currentTarget.getAttribute('href'));if(next)e.currentTarget.setAttribute('href',next)}} onLoad={e=>rememberImageSource(A+(variant===2?'alpine-lake.png':'friendly-robot.png'),e.currentTarget.getAttribute('href'))} x={variant===2?0:130} y={variant===2?20:65} width={variant===2?640:380} height={variant===2?426:380} preserveAspectRatio="none"/></svg>{!onReadiness&&<span className="sequence-loading" role={error?'alert':'status'}>{error?'序列暂未准备好，请恢复默认后重试':'正在准备完整序列…'}</span>}</>}</div>
}

function populateProduct(group,model){
 const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.45,metalness:.3});
 const add=(geo,c,x=0,y=0,z=0)=>{const mesh=new THREE.Mesh(geo,mat(c));mesh.position.set(x,y,z);group.add(mesh);return mesh};
 if(model==='phone'){add(new THREE.BoxGeometry(1.2,2.3,.18),0x253648);add(new THREE.BoxGeometry(1.09,2.13,.025),0x7fa9bf,0,0,.11);add(new THREE.BoxGeometry(.35,.05,.035),0x182532,0,.92,.14);for(let i=0;i<3;i++)add(new THREE.CircleGeometry(.115,24),0x263847,-.33+i*.32,.55,.14);add(new THREE.BoxGeometry(.6,.7,.03),0xcbdedb,0,-.15,.14);add(new THREE.BoxGeometry(.45,.06,.03),0x607d95,0,-.65,.14);group.children.slice(1).forEach((mesh,i)=>mesh.userData.followSvgLayer=i===0?1:2);}
 if(model==='car'){add(new THREE.BoxGeometry(2.8,.6,1.25),0x7799b0,0,-.3);const cabin=add(new THREE.BoxGeometry(1.6,.65,1.13),0x334a61,.1,.25);add(new THREE.BoxGeometry(1.35,.045,1.06),0x9cc0d2,.1,.6);for(let x of [-.9,.9])for(let z of [-.67,.67]){const tire=add(new THREE.CylinderGeometry(.34,.34,.22,28,1,true),0x202935,x,-.5,z);tire.rotation.x=Math.PI/2;const disk=add(new THREE.CircleGeometry(.34,28),0x202935,x,-.5,z+(z>0?.14:-.14));const hub=add(new THREE.CircleGeometry(.18,24),0xabb6c3,x,-.5,z+(z>0?.17:-.17));tire.userData.followSvgLayer=z>0?1:-3;disk.userData.followSvgLayer=z>0?2:-2;hub.userData.followSvgLayer=z>0?3:-1;if(z<0){hub.rotation.y=Math.PI;disk.rotation.y=Math.PI;}}for(let z of [-.4,.4])add(new THREE.BoxGeometry(.04,.18,.24),0xf3eecb,1.42,-.2,z);}
 if(model==='clothing'){add(new THREE.BoxGeometry(1.2,1.55,.25),0x91a8a1,0,-.05);const a=add(new THREE.BoxGeometry(.55,.75,.25),0x91a8a1,-.8,.42);a.rotation.z=-.55;const b=add(new THREE.BoxGeometry(.55,.75,.25),0x91a8a1,.8,.42);b.rotation.z=.55;const neck=add(new THREE.TorusGeometry(.21,.06,12,30,Math.PI),0x617e79,0,.72,.15);neck.rotation.z=Math.PI;add(new THREE.BoxGeometry(.22,.29,.03),0x688b87,.28,.22,.16);}
 if(model==='shoe'){const sole=add(new THREE.BoxGeometry(2.4,.23,1),0xd8e1df,0,-.6);const toe=add(new THREE.SphereGeometry(.62,28,20),0x91a8a1,.57,-.22);toe.scale.set(1.2,.55,.8);add(new THREE.BoxGeometry(1.15,.7,.88),0x617d82,-.45,-.18);for(let i=0;i<4;i++)add(new THREE.BoxGeometry(.06,.045,.62),0xdfe7e4,-.1-i*.16,.19);}
 if(model==='game'){add(new THREE.OctahedronGeometry(.85),0x6f9bd4,0,.1);const rim=add(new THREE.TorusGeometry(1.15,.035,8,48),0xb2cbe6,0,.1);rim.rotation.x=.65;add(new THREE.CylinderGeometry(.7,.85,.12,48),0x293c59,0,-1.05);}
}
