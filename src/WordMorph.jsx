import React,{useState,useRef,useLayoutEffect,useEffect} from 'react';
export function MorphWords({words,index,duration}){
 const current=useRef(null),previous=useRef(words[index]),[old,setOld]=useState(null),[width,setWidth]=useState(null);
 useLayoutEffect(()=>{
  if(current.current)setWidth(Math.ceil(current.current.getBoundingClientRect().width));
  if(previous.current!==words[index]){setOld(previous.current);previous.current=words[index];const timer=setTimeout(()=>setOld(null),duration);return()=>clearTimeout(timer)}
  setOld(null);
 },[index,words[index],duration]);
 useEffect(()=>{if(!current.current)return;const observer=new ResizeObserver(()=>setWidth(Math.ceil(current.current.getBoundingClientRect().width)));observer.observe(current.current);return()=>observer.disconnect()},[words[index]]);
 return <h3 className="morph-word-stack" style={{width:width===null?'max-content':width+'px',transition:`width ${duration}ms ease`}}>{old!==null&&<span className="morph-old" key={'old'+old} aria-hidden="true" style={{animation:`sceneFadeOut ${duration}ms ease both`}}>{old}</span>}<span ref={current} key={words[index]} style={{display:'inline-block',width:'max-content',animation:`morphIn ${duration}ms ease both`}}>{words[index]}</span></h3>;
}
export function WordMorphDemo({variant,params, reduced}){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[hovered,setHovered]=useState(false);
 const words=[['设计师','创造者'],['Loading','Ready'],['1,280 m','1.28 km'],['探索','发现','记录']][variant],duration=reduced?1:(params.duration??650),delay=reduced?0:(params.delay??0);
 useEffect(()=>{
  if(variant<3){if(index!==0)return;const timer=setTimeout(()=>setIndex(1),delay);return()=>clearTimeout(timer)}
  if(paused||hovered||reduced)return;
  const timer=setTimeout(()=>setIndex(i=>(i+1)%words.length),Math.max(1800,duration*3)+delay);return()=>clearTimeout(timer);
 },[variant,index,paused,hovered,reduced,duration,delay]);
 return <div className="word-morph-demo" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}><MorphWords words={words} index={index} duration={duration}/>{variant===3&&!reduced&&<button onClick={()=>setPaused(p=>!p)}>{paused?'继续轮换':'暂停轮换'}</button>}</div>;
}
