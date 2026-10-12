import {rulePrompt} from './integratedMainRules';
import {actionPrompt} from './integratedMainAction';
import {feedbackPrompt} from './integratedMainFeedback';
import {surfacePrompt} from './integratedMainSurface';
import {pointerPrompt} from './integratedMainPointer';
import {interactionPrompt} from './integratedMainInteraction';
import {scrollPrompt} from './integratedMainScroll';
import {textPrompt} from './integratedMainText';
import {revealPrompt} from './integratedMainReveal';
import {contentPrompt} from './integratedMainContent';
import {easingCurves} from './motionMath';
const unit=u=>({ms:'毫秒',px:'像素','×':'倍'})[u]??u??'';
const num=x=>Number(Number(x).toFixed(3));
function parameters(c,ps){
 const v=c.renderVariant??c.variant?.index??0,k=c.scene?.ui;
 const derived=!c.reduced&&Number.isFinite(c.motion?.effectiveDuration)&&c.motion.effectiveDuration!==c.values?.duration;
 const labels={1:{duration:['spinner','marquee'].includes(c.scene?.ui)?'每轮时长':'动画时长',distance:!c.scene||c.scene?.ui==='oscillate'?'单侧移动幅度':'移动距离'},2:{duration:derived?'基准动画时长':'动画时长'},3:{duration:c.renderVariant===3?'外层转场时长':'每段动画时长',delay:!c.scene&&c.renderVariant!==3?'前段结束后的等待':c.scene?.ui==='modal'?'内容启动延迟':'相邻项目启动间隔'},4:{duration:'单项入场时长',delay:'交错间隔'},5:{duration:derived?'基准回弹时长':'回弹时长',strength:'回弹强度',distance:c.scene?'最大拖动距离':'单侧移动幅度'}};
 if(c.id>=6&&c.id<=10)labels[c.id]={duration:c.id===9&&(k==='button'||!c.scene&&v===1)?'缩放时长基准':c.id===6&&!c.scene&&v===4?'提示动画时长基准':c.id===10?'模糊变化时长':c.id===6?(k==='image'?'新图淡入时长':!c.scene&&v===3?'旧图淡出时长':k==='switch'?'状态淡化时长':'淡入时长'):c.id===7?'交叉淡化时长':'入场时长',distance:c.id===8&&v===4?'滑动距离基准':'滑动距离'};
 if([11,12,13].includes(c.id))labels[c.id]={duration:c.id===13?'完整擦除转场时长':'揭示时长'};
 if(c.id>=21&&c.id<=25)labels[c.id]={distance:c.id===24?'缩放幅度基准':c.id===21&&v===0?'层间位移差基准':'位移幅度基准'};
 if(c.id===29)labels[c.id]={duration:'跟随及回位时长',distance:'感应范围基准'};
 if(c.id===32)labels[c.id]={distance:'光区半径基准',duration:'光区跟随时长'};
 if(c.id===34)labels[c.id]={distance:'拖尾元素尺寸基准',duration:'拖尾消失时长'};
 if(c.id===35)labels[c.id]={distance:'响应位移基准',duration:'响应及恢复时长'};
 if(c.id===36)labels[c.id]={distance:'跟随幅度基准',duration:v===2?'视角跟随及恢复时长':v===3?'光照变化及恢复时长':'跟随及回正时长'};
 if(c.id===39&&v===3)labels[c.id]={duration:'弹窗时长基准'};
 if(c.id===45)labels[c.id]={duration:'内容加载等待时长'};
 if(c.id===46)labels[c.id]={duration:'本地演示任务时长'};
 if(c.id===47)labels[c.id]={duration:c.reduced?'演示处理等待':'演示处理等待及反馈时长'};
 if(c.id===49)labels[c.id]={duration:'单段布局过渡时长'};
 if(c.id===51)labels[c.id]={duration:'页面转场时长'};
 if(c.id===52)labels[c.id]={duration:c.reduced?'演示处理等待':'演示处理等待及反馈时长'};
 if(c.id===53)labels[c.id]={duration:k==='button'||!c.scene&&v===0?'松开恢复时长':k==='drag'||!c.scene&&v===2?'单段布局过渡时长':'状态反馈时长'};
 const clauses=ps.filter(p=>!(c.id===34&&c.values?.duration===0&&p.key==='distance')).map(p=>`${labels[c.id]?.[p.key]||p.label}设为${num(p.value)}${unit(p.unit)}`);
 if(derived&&ps.some(p=>p.key==='duration'))clauses.push(`${c.id===5?'实际回弹时长':c.id===9&&(k==='button'||!c.scene&&v===1)?'松开恢复时长':c.id===6&&!c.scene&&v===4?'提示全过程时长':'实际动画时长'}为${num(c.motion.effectiveDuration)}毫秒`);
 if(c.id===6&&!c.reduced&&ps.some(p=>p.key==='duration')&&(c.scene&&['image','modal','menu','tooltip','toast'].includes(k)||!c.scene&&v===2))clauses.push(`${k==='image'?'旧图淡出时长':'淡出时长'}为${num(c.values.duration*.65)}毫秒`);
 if(c.id===9&&(k==='button'||!c.scene&&v===1)&&!c.reduced&&ps.some(p=>p.key==='duration')&&!derived)clauses.push(`松开恢复时长为${num(c.values.duration*.4)}毫秒`);
 if(c.id===8&&v===4&&!c.reduced&&ps.some(p=>p.key==='distance'))clauses.push(`实际滑动距离为${num(c.values.distance*3)}像素`);
 if(c.id===39&&v===3&&!c.reduced&&ps.some(p=>p.key==='duration'))clauses.push(`实际弹窗时长为${num(c.values.duration*.35)}毫秒`);
 if(c.id===3&&c.renderVariant===3&&!c.reduced&&ps.some(p=>p.key==='duration'))clauses.push(`内部单项入场时长为${num(c.values.duration*(c.scene?.ui==='pages'?.65:1))}毫秒`);
 return clauses.join('，');
}
function weave(text,c,ps){const p=parameters(c,ps);return p?text.replace('。',`，${p}。`):text}
export function integratedMain(c,ps=c.parameters||[]){
 const id=c.id,v=c.renderVariant??c.variant?.index??0,k=c.scene?.ui,r=c.reduced,subject=c.scene?.label;let t='';
 if(id>=51&&id<=56)return weave(rulePrompt(c),c,ps);
 if(id>=46&&id<=50)return weave(actionPrompt(c),c,ps);
 if(id>=41&&id<=45)return weave(feedbackPrompt(c),c,ps.filter(p=>!(id===44&&p.key==='target')));
 if(id>=36&&id<=40)return weave(surfacePrompt(c),c,ps);
 if(id>=31&&id<=35)return weave(pointerPrompt(c),c,ps);
 if(id>=26&&id<=30)return weave(interactionPrompt(c),c,ps);
 if(id>=21&&id<=25)return weave(scrollPrompt(c),c,ps);
 if(id>=16&&id<=20)return weave(textPrompt(c),c,ps);
 if(id>=11&&id<=15)return weave(revealPrompt(c),c,ps);
 if(id>=6&&id<=10)return weave(contentPrompt(c),c,ps);
 if(id===1){
  const action=k==='progress'?'让进度条按实际任务推进':k==='spinner'?'让加载标记持续旋转':k==='marquee'?'让单行内容循环移动':k==='exit'?'让元素离开并淡出':k==='oscillate'?'让元素来回移动':k==='switch'?'让开关在两种状态之间切换':k==='menu'?'让菜单展开，关闭时恢复':k==='button'?'让按钮进入可操作状态':k==='cards'?'让页面内容自然进入':'让元素平移到目标位置';
  if(r)t=`开启减少动态时，${({progress:'进度条',spinner:'加载标记',marquee:'单行内容',button:'按钮',menu:'菜单',cards:'内容',exit:'元素',oscillate:'元素',switch:'开关'})[k]||'元素'}直接呈现对应状态，不播放缓动位移或持续旋转，保留必要内容与操作。`;
  else t=`${action}，使用${['匀速（Linear）','慢慢加速（Ease-in）','开始较快、结束时慢下来（Ease-out）','两头慢、中间快（Ease-in-out）','自定义速度曲线（Cubic-bezier）'][v]}，缓动曲线为${easingCurves[v]}。${['spinner','marquee'].includes(k)?'持续匀速运行，直到停止操作；每轮衔接保持连续。':'开始响应要及时，起止状态准确。'}持续旋转和进度动画保持匀速，不要让所有不同用途的动画使用同一种缓动。`;
 }else if(id===2){
  t=r?`开启减少动态时，${subject||['按钮或图标','卡片与菜单','主视觉'][v]}直接呈现最终状态，不播放装饰性过渡；连续操作仍可及时响应。`:`为${subject||['按钮或图标','卡片与菜单','主视觉'][v]}使用${['短促','适中','偏慢'][v]}档动画时长，保持同类操作的节奏一致。连续操作时及时响应，不要求用户等待动画结束才能继续。`;
 }else if(id===3){
  t=v===1?(r?'弹窗打开时直接显示遮罩与内容，关闭时直接恢复页面。':'弹窗背景先变暗，经过相邻阶段延迟后显示弹窗内容。'):
   v===2?(r?'先等待图片实际加载完成，再直接显示对应文字。':'先等待图片实际加载完成，再按延迟顺序显现对应文字。'):
   v===3?(r?'页面切换时直接显示新页面及其标题、说明和按钮，不增加装饰性等待。':'页面外层先完成转场，再让新页面的标题、说明和按钮按阅读顺序依次进入。'):
   r?'直接完整显示标题、说明与按钮，不增加装饰性延迟。':'按照阅读顺序进入：主标题先出现，说明文字经过相邻阶段延迟后出现，按钮最后进入。';
  t+=r?'保留实际内容加载和必要操作。':'延迟只用于建立层级，避免额外阻塞操作或增加不必要的等待。';
 }else if(id===4){
  const g=c.runtime?.granularity||'行';
  const count=k==='cards'?6:k==='gallery'?3:k==='list'?4:k==='menu'?4:k==='steps'?3:k==='data'?6:!k&&v===0?6:!k&&v===4?5:!k&&(v===1||v===2)?3:null;
  const noun=k==='gallery'?'张照片':k==='steps'?'个步骤条目':v===4?'根数据柱':v===2?'个导航菜单项':v===1?'个列表条目':'张卡片';
  if(v===3)t=r?`直接显示完整标题，保留按${g}组织的文字结构，不播放交错入场。`:`让标题按${g}交错显现（Stagger），保持原有阅读顺序和完整文意。`;
  else t=r?`直接显示${count}${noun}的最终状态，不播放交错入场或逐项增长。`:`让${count}${noun}交错${v===4?'增长':'出现'}（Stagger），${v===0?'按照从左到右、从上到下的阅读顺序':v===1?'按照从上到下的顺序':'按原有顺序'}依次${v===4?'增长到准确结果':'进入'}。`;
  t+=r?'保留所有内容与必要操作。':'相邻项目使用明确的交错间隔，整组动画连贯、轻快，不要全部同时启动。';
 }else if(id===5){
  const feel=['少量回弹','偏硬、快速响应','偏软、柔和回弹','明显的果冻式回弹'][v];
  if(r)t=k==='drag'?'拖动元素直接跟随指针，松手后立即回到原位，不播放回弹。':k==='snap'?'拖动元素直接跟随指针，松手后立即吸附到目标位置，不播放回弹。':`开启减少动态时，${subject||'元素'}直接呈现对应状态，不播放装饰性弹簧缩放或位移。`;
  else t=k==='drag'?`拖拽元素松手后使用弹簧动画（Spring）回到原位，呈现${feel}。`:k==='snap'?`拖拽元素松手后吸附到对应目标位置，使用弹簧动画（Spring）呈现${feel}。`:k==='button'?`按钮按下时立即轻微缩小，松开后使用弹簧动画（Spring）恢复，呈现${feel}。`:k==='switch'?`开关切换时使用弹簧动画（Spring），呈现${feel}，状态立即更新。`:k==='modal'?`弹窗出现时使用弹簧动画（Spring），呈现${feel}。`:`让元素移动到目标位置时使用弹簧动画（Spring），呈现${feel}。`;
  t+=r?'保留必要的操作和状态反馈。':v===3?'回弹逐渐衰减，最终准确停稳，不能持续晃动或影响操作。':'保留一点重量感和克制的回弹，随后稳定停下，不要产生夸张的果冻效果。';
 }
 if(!r&&id===4&&c.values?.delay===0){t=t.replaceAll('交错出现（Stagger）','显示（Stagger，启动间隔为零）').replaceAll('交错增长（Stagger）','增长（Stagger，启动间隔为零）').replace('不要全部同时启动','启动间隔为零时所有项目同步开始').replaceAll('依次进入','同步进入').replaceAll('依次增长到准确结果','同步增长到准确结果').replace('交错显现（Stagger）','显示（Stagger，启动间隔为零）').replace('按照从左到右、从上到下的阅读顺序同步进入','保持从左到右、从上到下的布局，所有项目同步进入').replace('按照从上到下的顺序同步进入','保持从上到下的布局，所有项目同步进入').replace('按原有顺序同步进入','保留原有排列，所有项目同步进入').replace('按原有顺序同步增长','保留原有排列，所有数据柱同步增长')}
 if(!r&&id===3&&c.scene&&c.values?.delay===0){t=v===3?'页面外层转场完成后，新页面标题、说明和按钮同步开始进入。':v===2?'图片实际加载完成后，对应文字同步开始显现。':v===1?'背景遮罩与弹窗内容同时开始显现。':'标题、说明和按钮同时开始显现。';t+='启动间隔为零，不增加额外等待；保留原有阅读顺序和可用操作。'}
 return weave(t,c,ps);
}
