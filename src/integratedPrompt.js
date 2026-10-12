import originalPrompts from './originalPrompts.json';
import {integratedMain} from './integratedMain';
import {integratedCombination} from './integratedCombinations';
import {integratedTriggerLater} from './integratedTriggerLater';

const unitName=u=>({ms:'毫秒',px:'像素',s:'秒','×':'倍'})[u]??u??'';
const parameter=(ps,label)=>ps.find(p=>p.label===label);
function timing(ps,label,role=label){const p=parameter(ps,label);return p?`${role}设为${p.value}${unitName(p.unit)}，`:''}
export function supportsIntegratedPrompt(id){return /^M(0[1-9]|[1234][0-9]|5[0-6])$/.test(id)||/^T(0[1-9]|10)$/.test(id)||['TOOLS.REUSE','B.S1.01','B.S2.C01','B.S2.C02','B.S2.C03','B.S2.C04','B.S3.C01'].includes(id)}
export function generateIntegratedPrompt(id,c={},ps=[]){
 if(!supportsIntegratedPrompt(id))return null;
 if(id==='TOOLS.REUSE')return originalPrompts[id].text;
 if(id.startsWith('B.'))return integratedCombination(id,c,ps);
 if(id.startsWith('M'))return integratedMain(c,ps);
 const n=Number(id.slice(1)),v=c.variant??0,comb=c.combination??-1;
 if(n>=6)return integratedTriggerLater(n,c,ps);
 const feedback=timing(ps,'反馈动画时长');let text='';
 if(n===4&&(c.staticInput||c.reduced))return '关闭装饰性指针跟随，以静态方式完整显示卡片图片和文字。卡片文字与必要操作保持稳定、清晰、可用；触屏设备保持同样的静态呈现。';
 if(c.reduced&&n===1){
  const target=comb===3?'链接':comb===5?'按钮':'作品卡片';
  const when=v===3?`鼠标停留${parameter(ps,'意图等待时间')?.value??c.delay}毫秒后`:v===5?'鼠标靠近时':v===4?'父级被悬停或键盘聚焦时':'鼠标进入或键盘聚焦时';
  const result=comb<0?'封面直接显示半透明遮罩，标题和箭头一起显示':[
   '直接显示更多内容','直接增强阴影','直接显示第二张封面','直接显示链接下划线','保持卡片静止，不产生倾斜','保持按钮静止，不产生磁吸位移'
  ][comb];
  return `开启减少动态时，${target}${when}，${result}。鼠标移开后直接恢复静止初态；不播放装饰性位移、缩放或渐变动画。保留清楚的键盘焦点和触屏点击操作。`;
 }
 if(c.reduced&&n===3){const action=v===3?'双击后执行操作，单击不触发双击操作，同时保留可见的单击或轻触入口':v===4?`按住按钮${parameter(ps,'长按触发时长')?.value??c.delay}毫秒后直接展开菜单，提前松开不打开菜单，同时保留可见的菜单打开按钮`:'松开按钮后执行操作，筛选按钮再次点击恢复默认状态';return `开启减少动态时，按钮不进行按压缩放；${action}。取消按压或拖出按钮时不执行操作。触屏使用轻触，不依赖双击完成主要操作。`}

 if(n===1){
  const trigger=['鼠标进入整张作品卡片时','鼠标移开整张作品卡片时','鼠标持续悬停在整张作品卡片上时',`鼠标在整张作品卡片上停留${parameter(ps,'意图等待时间')?.value??c.delay}毫秒后`,'鼠标悬停在父级作品卡片时','鼠标靠近作品卡片但尚未进入时'][v];
  const actions=['卡片轻微抬升，并显示更多内容','卡片轻微抬升，同时增强阴影','封面在两张图片之间切换','链接下划线从一侧展开','卡片随指针位置轻微产生三维倾斜','按钮轻微靠近指针，形成磁吸反馈'];
  const selectedTrigger=comb===3?'鼠标悬停在链接时':comb===5?'指针靠近按钮时':trigger;
  text=comb<0?`${v===1?'鼠标进入作品卡片形成悬停状态':trigger}触发悬停反馈，${feedback}卡片轻微抬升，封面显示半透明遮罩，标题和箭头一起显现。`: `${selectedTrigger}，${feedback}${actions[comb]}。`;
  text+=v===1?'鼠标移开时沿原路径恢复卡片的静止状态。':'鼠标移开后沿原路径恢复。';
  text+=comb===4||comb===5?`键盘聚焦时提供清楚的可见焦点反馈；触屏设备关闭${comb===4?'倾斜':'磁吸'}，保留普通按压和点击操作。`:'键盘聚焦时提供同样反馈，触屏设备改为点击展开。';
 }else if(n===2){
  text=[
   '为所有按钮、链接和输入框补充清楚的焦点（Focus）状态，鼠标点击与键盘聚焦时都能辨认当前焦点。',
   '为所有按钮、链接和输入框补充清楚的键盘焦点（Focus-visible）状态。',
   '按钮、链接或输入框获得焦点时，高亮其父容器（Focus-within）；焦点在容器内部移动时保持高亮，离开整个容器后恢复。子控件同时保留清楚的键盘焦点。'
  ][v]+'焦点反馈与悬停状态保持同一套颜色语言，但使用可见焦点环，不能只靠轻微位移表示。';
 }else if(n===3){
  const release=timing(ps,'松开恢复时长');
  text=v<=2?`按钮被按下时立即轻微缩小，松开后执行操作并恢复原大小，${release.slice(0,-1)}。筛选按钮使用开关切换（Toggle），再次点击恢复默认状态。`:
   v===3?`双击按钮后执行操作，单击不触发双击操作；按下时立即轻微缩小，松开恢复，${release.slice(0,-1)}。保留可见的单击或轻触操作入口。`:
   `按住按钮${parameter(ps,'长按触发时长')?.value??c.delay}毫秒后展开操作菜单，提前松开不触发长按操作；按下时立即轻微缩小，松开恢复，${release.slice(0,-1)}。同时保留可见的菜单打开按钮。`;
  text+='取消按压或拖出按钮时不执行操作。触屏使用轻触（Tap），不要依赖双击完成主要操作。';
 }else if(n===4){
  text=[
   `指针移动（Pointer move）时，卡片内部光晕平滑跟随指针，${feedback}靠近中心时更明显，离开卡片后平滑回到默认位置。`,
   `根据指针位置（Pointer position）映射卡片内部光晕的位置，靠近中心时更明显；离开卡片后回到默认位置，${feedback.slice(0,-1)}。`,
   `根据指针与卡片中心的距离（Proximity）控制光晕强度，越靠近中心越明显，光晕位置保持在中心；离开后平滑恢复，${feedback.slice(0,-1)}。`,
   `根据指针进入卡片的方向（Direction），让卡片图片从对应边缘进入并停稳，${feedback.slice(0,-1)}。图片在固定窗口内移动，不能覆盖文字。`,
   `根据指针移动速度（Velocity）控制卡片图片的拉伸，移动越快拉伸越明显，停止或离开后恢复原比例，${timing(ps,'停止恢复时长').slice(0,-1)}。`
  ][v]+'限制效果范围，不能让卡片文字跟着晃动；触屏设备关闭指针跟随并完整显示静态内容。';
 }else if(n===5){
  text=[
   '当功能卡片进入视口（In view）后触发入场动画，每张卡片只播放一次。不要等到卡片完全进入屏幕才开始；用户向上滚动返回时保持最终状态，不重复闪烁。',
   '功能卡片进入视口时保持清晰；离开视口（Leave viewport）时触发离场动画并复位，重新进入时恢复清晰状态。',
   '功能卡片首次进入视口时播放入场动画，不必等到完全进入屏幕，之后保持最终状态；向上滚动返回时不重复闪烁。',
   '功能卡片每次进入视口时重新播放入场动画，离开后复位；向上滚动返回时也重新触发。',
   '根据滚动方向触发功能卡片入场：下滚时从下方进入，上滚时从上方进入；离开后复位。',
   `功能卡片的可见比例达到${parameter(ps,'进入可见比例')?.value??c.threshold}%时触发入场动画，每张卡片只播放一次；向上滚动返回时保持最终状态，不重复闪烁。`
  ][v];
  if(feedback)text=text.replace('。',`，${feedback.slice(0,-1)}。`);
 }
 if(c.reduced&&n===5){text=text.replaceAll('触发入场动画','直接显示最终状态').replaceAll('播放入场动画','显示最终状态').replaceAll('重新播放入场动画','重新显示最终状态').replace('触发离场动画并复位','直接恢复离场状态').replace('下滚时从下方进入，上滚时从上方进入','下滚或上滚到达触发位置时直接显示卡片，不产生方向位移');text='开启减少动态时，'+text+'不播放装饰性位移或淡入淡出，保留内容与滚动操作。'}
 return text.replace(/，。/g,'。').replace(/，，/g,'，');
}
