import {useInputExperience,InputExperienceControls} from './InputExperience';
import React,{useState,useRef,useLayoutEffect,useEffect} from 'react';
import {Play,Pause} from '@phosphor-icons/react';
import {ThreeObject} from './Demo';
export function ModelFollow({scene,v:independentVariant=0,variant,p:variantParams,params:sceneParams,run,reduced,onRuntimeChange}){
 const v=scene?(variant??0):independentVariant,p=variantParams||sceneParams||{},root=useRef(null),[point,setPoint]=useState({x:0,y:0}),[mobile,setMobile]=useState(()=>typeof matchMedia!=='undefined'&&matchMedia('(max-width:850px),(pointer:coarse)').matches),[paused,setPaused]=useState(false),gain=(p.distance??50)/100*.35,duration=reduced?0:(p.duration??220),model=scene?.model||(!scene&&v===1?'robot':'camera');
 useEffect(()=>{const q=matchMedia('(max-width:850px),(pointer:coarse)');const change=()=>{setMobile(q.matches);setPoint({x:0,y:0})};q.addEventListener('change',change);return()=>q.removeEventListener('change',change)},[]);
 useLayoutEffect(()=>{setPoint({x:0,y:0});setPaused(false)},[scene?.id,v,run,reduced]);
 const input=useInputExperience(`36:${scene?.id}:${v}:${run}`,reduced);
 useLayoutEffect(()=>{onRuntimeChange?.({inputMode:reduced?'static':input.touchMode?'touch':!mobile?'pointer':input.previewing?'preview':paused?'paused':'auto'})},[scene?.id,v,run,reduced,input.touchMode,input.previewing,mobile,paused,onRuntimeChange]);
 useEffect(()=>{if(!mobile||reduced||paused||input.touchMode||input.previewing)return;let frame,last=0;const start=performance.now();function tick(t){if(t-last>80){setPoint({x:Math.sin((t-start)/2600)*gain*.35,y:0});last=t}frame=requestAnimationFrame(tick)}frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[mobile,reduced,paused,gain,input.touchMode,input.previewing]);
 const reset=()=>setPoint({x:0,y:0});
 function move(e){if(!input.allows(e))return;const b=root.current.getBoundingClientRect();setPoint({x:Math.max(-1,Math.min(1,(e.clientX-b.left)/b.width*2-1))*gain,y:Math.max(-1,Math.min(1,(e.clientY-b.top)/b.height*2-1))*gain})}
 return <div ref={root} className="scenario-demo model-follow" data-scene={scene?.id||`M36.V${String(v+1).padStart(2,'0')}`} data-mobile={mobile} data-paused={paused} tabIndex={0} role="group" aria-label="三维物体预览，方向键操作，Escape回正" style={input.style} onPointerDown={e=>{if(input.begin(e))move(e)}} onPointerMove={move} onPointerUp={()=>input.end()} onPointerCancel={()=>{input.end();reset()}} onLostPointerCapture={()=>{if(input.isHolding()){input.end();reset()}}} onPointerLeave={()=>!mobile&&reset()} onKeyDown={e=>{if(e.key==='Escape')reset();if(reduced)return;if(e.key.startsWith('Arrow')){e.preventDefault();setPoint({x:e.key==='ArrowRight'?gain:e.key==='ArrowLeft'?-gain:0,y:e.key==='ArrowDown'?gain:e.key==='ArrowUp'?-gain:0})}}}>
 <ThreeObject model={model} point={reduced?{x:0,y:0}:point} variant={v===4?0:v} duration={duration}/>
 {scene&&<div className="model-copy"><h3>{({car:'城市探索座驾',shoe:'轻量徒步鞋',clothing:'随行外套',robot:'探索伙伴',phone:'口袋里的旅程',game:'湖畔能量核心',camera:'随行相机'})[model]}</h3></div>}
 <InputExperienceControls previewLabel="查看当前效果" showPreviewExit input={input} reduced={reduced} onReset={reset} onPreview={()=>setPoint({x:gain*.7,y:-gain*.3})}/><div className="model-controls"><span>{reduced?'静态预览':mobile?(input.touchMode?'手动预览':input.previewing?'定点预览':v===2?'视角缓慢移动':v===3?'光照缓慢变化':'轻缓自转'):'指针 / 方向键 · 离开回正'}</span>{mobile&&!reduced&&!input.touchMode&&!input.previewing?<button onClick={()=>setPaused(s=>!s)}>{paused?<Play/>:<Pause/>}{(paused?'继续':'暂停')+(v===2?'视角移动':v===3?'光照变化':'自转')}</button>:null}</div>
 </div>
}
