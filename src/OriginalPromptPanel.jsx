import React,{useLayoutEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import originals from './originalPrompts.json';
import compatibility from './promptCompatibility.json';
import {supportsIntegratedPrompt,generateIntegratedPrompt} from './integratedPrompt';

const triggerMatches={1:[0,1,2,3,4],2:[0,1,2],3:[0,1,2],4:[0,1],5:[0,2,5],6:[0,1,2,3],7:[0,1,2,3],8:[2,3,4],9:[2],10:[]};
export function originalPromptMatch(id,config){
 if(!config)return {status:'raw'};
 if(id.startsWith('B.'))return {status:'compatible'};
 if(id.startsWith('T')){
  const n=Number(id.slice(1)),v=config.variant;
  if(n===10)return {status:'conflict',reason:'原文要求切到后台暂停；当前这项检查尚未通过。'};
  if(n===5&&v===3)return {status:'conflict',reason:'原文代表例只播放一次，当前选择是重复播放。'};
  if(n===1&&config.combination!==-1)return {status:'difference',reason:'原文描述整张作品卡的完整组合，当前选择只演示其中一种视觉组合。'};
  return triggerMatches[n]?.includes(v)?{status:'compatible'}:{status:'difference',reason:({1:'原文代表例从进入卡片时触发；当前选择在接近但尚未进入时触发。',3:'原文代表例是普通按压与筛选开关；当前选择重点演示双击或长按。',4:'原文代表例是随位置移动的内部光晕；当前输入维度或视觉对象不同。',5:'原文代表例只在首次进入时播放并保留；当前触发条件或重复方式不同。',7:'原文代表例是横向拖动、吸附与快滑；当前是双指缩放或旋转。',8:'原文代表例是完整路由进入与离开；当前是加载、挂载或数据就绪触发。',9:'原文代表例是表单提交后的加载、成功与失败；当前组件状态不同。'})[n]||'当前选择与原文完整代表例的范围不同。'};
 }
 if(id==='M44'&&config.runtime?.counterDirection&&config.runtime.counterTarget!==config.values?.target)return {status:'waiting',reason:'目标数值已变化。请先点画面中的“重播计数”，再生成本次参数。'};
 if(id==='M44'&&(config.runtime?.counterDirection??((config.values?.target??1280)>([1,4].includes(config.renderVariant)?480:0)?'increase':'unchanged'))!=='increase')return {status:'difference',reason:'原文代表例要求数字增长；当前这次更新是下降或数值不变。可重播计数检查从初态开始的效果。'};
 const rule=compatibility[id];if(!rule)return {status:'pending'};
 const v=config.variant?.index;
 if(config.mode==='variants'&&rule.conflicts.includes(v))return {status:'conflict',reason:'当前变体的方向、动作或循环方式与这段原文代表例不同。'};
 if(id==='M04'&&!(config.scene?.ui==='cards'||config.mode==='variants'&&v===0))return {status:'conflict',reason:'这段原文指定六张卡片；当前对象或数量不同。'};
 const matches=config.scene?rule.scenes.includes(config.scene.ui):rule.variants.includes(v);
 return matches?{status:'compatible'}:rule.reviewed?{status:'difference',reason:rule.difference_reason||'当前选择与原文代表例的对象或动作范围不同。'}:{status:'pending',reason:'原文是该条目的代表例；当前场景或变体尚未确认与整段要求相符。'};
}
export function appendOriginalParameters(id,config,parameters=[]){
 const original=originals[id];if(!original||originalPromptMatch(id,config).status!=='compatible')return null;
 const scopes=[config.scene?`当前${config.id>=52?'观察项':'场景'}：${config.scene.label}`:null,config.selection?`${id.startsWith('B.')?'当前组合示例':'当前原文类型'}：${config.selection}`:config.variant?.original_label?`当前原文类型：${config.variant.original_label}`:null].filter(Boolean);
 const derived=!config.reduced&&parameters.some(p=>p.key==='duration')&&Number.isFinite(config.motion?.effectiveDuration)&&config.motion.effectiveDuration!==config.values?.duration;
 const lines=parameters.map(p=>`${p.key==='duration'&&derived?'基准动画时长':p.key==='distance'&&['M21','M22'].includes(id)?'位移基准':p.key==='distance'&&id==='M24'?'缩放幅度基准':p.key==='distance'&&id==='M32'?'光区半径基准':p.key==='distance'&&id==='M35'?'响应位移基准':p.label==='时长'?'动画持续时长':p.label}：${p.value}${({'ms':'毫秒','px':'像素','s':'秒'})[p.unit]??p.unit??''}`);
 if(derived)lines.push(`当前效果实际动画时长：${config.motion.effectiveDuration}毫秒`);
 if(config.staticInput||config.runtime?.pointerEnabled===false)lines.push('当前输入适配：静态／普通点击');
 if(config.reduced)lines.push('减少动态（按原文55规则）：开启');
 return original.text+'\n本次选定设置：\n'+(scopes.length?scopes.join('\n')+'\n':'')+(lines.length?lines.join('\n'):'当前没有需要追加的可调参数');
}
export function OriginalPromptPanel({id,config,parameters=config?.parameters||[]}){
 const [destination,setDestination]=useState(null);
 useLayoutEffect(()=>{setDestination(document.getElementById('prompt-sidebar'))},[]);
 const original=originals[id],integrated=supportsIntegratedPrompt(id),match=integrated?{status:'compatible'}:originalPromptMatch(id,config),key=JSON.stringify({id,config,parameters}),[snapshot,setSnapshot]=useState(null),[message,setMessage]=useState('');
 useLayoutEffect(()=>{setSnapshot(null);setMessage('')},[id]);
 if(!original)return null;
 const stale=!!snapshot&&snapshot.key!==key;
 async function copy(text,label){try{await navigator.clipboard.writeText(text);setMessage(label)}catch{setMessage('复制未完成，可选中文本手动复制')}}
 const panel=<section className="prompt-panel original-prompt-panel" aria-label="原文提示词"><details key={id}><summary>查看完整原文提示词</summary><p>原文代表例 · {original.article==='S1'?'上篇':original.article==='S2'?'中篇':'下篇'}</p><textarea aria-label="完整原文提示词" readOnly value={original.text}/></details><div className="prompt-actions"><button onClick={()=>copy(original.text,'原文已复制')}>复制完整原文</button>{match.status==='compatible'&&<button className="primary" onClick={()=>{setSnapshot({key,text:integrated?generateIntegratedPrompt(id,config,parameters):appendOriginalParameters(id,config,parameters)});setMessage('')}}>{snapshot?'重新生成':integrated?'生成完整提示词':'原文＋当前参数'}</button>}</div>{match.status!=='compatible'&&match.status!=='raw'&&<p className="prompt-match-note">{match.reason}可单独复制完整原文。</p>}{snapshot&&<><p role="status">{stale?'当前设置已变化，请重新生成':integrated?'提示词已按当前选择生成':'完整原文保留，末尾追加当前选定设置'}</p><textarea aria-label={integrated?"完整动效提示词":"原文加当前参数"} readOnly value={snapshot.text}/><button disabled={stale||match.status!=='compatible'} onClick={()=>copy(snapshot.text,'提示词已复制')}>复制生成结果</button></>}<p role="status" aria-live="polite">{message}</p></section>;
 return destination?createPortal(panel,destination):null;
}
