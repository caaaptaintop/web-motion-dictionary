export function contentPrompt(c){
 const {id,scene,reduced:r}=c,k=scene?.ui,v=c.renderVariant??c.variant?.index??0;let t='';
 if(id===6){
  const kind=k||['landing','modal','tooltip','image','toast'][v];
  if(r)return ({landing:'直接显示页面标题、说明与操作按钮。',modal:'直接显示弹窗及背景遮罩，关闭时直接隐藏。',tooltip:'触发提示气泡时直接显示，离开或关闭后直接隐藏。',image:'切换图片时直接隐藏旧图并显示已就绪的新图。',toast:scene?'操作完成后直接显示可读的提示，停留后直接隐藏。':'直接显示静态提示并保持可读，不自动淡出。',menu:'打开菜单时直接显示，关闭时直接隐藏。',switch:'切换状态时直接更新状态文字，保留可用开关。'})[kind]+'减少动态时不播放装饰性淡入淡出，保留内容与必要反馈。';
  t=({landing:scene?'页面内容使用柔和的淡入（Fade in）。标题先出现，正文随后淡入，操作按钮随后显示，避免整页所有元素同时显现。':'页面内容中的目标元素使用柔和的淡入（Fade in），达到完整可见后保持。多个元素按阅读顺序启动，避免整页所有元素同时显现。',modal:'弹窗背景与内容使用柔和淡入（Fade in）；关闭时使用更快的淡出（Fade out）。',tooltip:'提示气泡触发时柔和淡入，离开或关闭后更快淡出；提示内容保持清楚可读。',image:'图片切换时先将旧图淡出（Fade out），再显示已加载完成的新图；保持图片与对应文字同步。',toast:'操作完成后让Toast轻提示淡入，停留供用户阅读后淡出。',menu:'菜单打开时柔和淡入，关闭时更快淡出；保留清楚的操作入口。',switch:'状态切换时让原状态文字淡出、新状态文字淡入，开关状态与文字保持一致。'})[kind];
 }else if(id===7){
  const subject=({carousel:'两张图片',tabs:'标签页内容','color-product':'同一产品的配色',background:'背景图片','color-bg':'背景颜色',player:'音乐封面和播放信息'})[k]||['两张图片','标签页内容','同一产品的配色','背景颜色','音乐封面和播放信息'][v];
  t=r?`切换${subject}时直接替换为目标内容，不播放交叉淡化。`:`切换${subject}时使用交叉淡化（Crossfade）：旧内容淡出的同时，新内容在相同位置淡入。`;
  t+='保持容器高度稳定，快速切换时取消上一段未完成动画，以最后选择为准。';
 }else if(id===8){
  const target=({menu:'菜单',drawer:'侧边栏',sheet:'底部面板',carousel:'轮播内容',chapter:'章节标题',steps:'当前步骤内容'})[k]||(v===4?'抽屉面板':'内容');
  const from=['下方','上方','左侧','右侧','右侧'][v];
  t=r?`${target}在触发后直接显示到目标位置，关闭或切换时直接显示对应状态，不播放装饰性滑动。`:`让${target}从${from}滑入（Slide in），到达原位后停稳。`;
  if(!r&&(['menu','drawer','sheet'].includes(k)||!scene&&v===4))t+='关闭时沿进入的原侧滑出（Slide out）。';
  if(!r&&k==='carousel')t+='切换到上一项时反转新旧内容的移动方向。';
  if(k==='chapter')t+='正文和图片保持稳定，只有章节标题参与变化。';
  t+=r?'保留清楚的内容顺序以及可用的切换或关闭入口。':'保持位移克制、方向清楚，并保留可用的切换或关闭入口。';
 }else if(id===9){
  const kind=k||['modal','button','image-modal','success','menu'][v];
  if(r)return ({modal:'弹窗打开时直接显示，关闭时直接隐藏，保留背景遮罩和必要操作。',button:'按下与松开按钮时保留必要的状态反馈和操作，不播放缩放。','image-modal':'打开图片预览时直接显示完整图片，关闭时返回原有页面。',success:'操作成功后直接显示成功图标与结果。',menu:'打开菜单时直接显示，关闭时直接收起，触发入口保持稳定。'})[kind]+'尊重减少动态偏好，保持内容清晰可用。';
  t=({modal:'弹窗使用缩放进入（Scale in）配合淡入，从较小尺寸自然回到正常大小；关闭时快速缩小并淡出。',button:`按钮按下时${scene?'立即':''}轻微缩小，松开后恢复原大小${scene?'并执行操作':''}；缩放反馈保持克制，取消按压时恢复原状态。`,'image-modal':'图片预览从缩略尺寸放大并淡入到正常尺寸，关闭时快速缩小并淡出。',success:'操作成功时让成功图标从较小尺寸放大并淡入，达到正常尺寸后保持稳定。',menu:'菜单从触发点附近缩放展开并淡入，关闭时缩小并淡出，点击区域保持清楚。'})[kind];
 }else if(id===10){
  const exiting=k==='exit'||!scene&&v===4,background=k==='background'||!scene&&v===3;
  const target=exiting?'旧页面重点内容':background?'背景':k==='gallery'?'摄影作品的重点图片':k==='product'?'产品主视觉':k==='feature'?'少量重点图片和标题':k==='image'||!scene&&v===1?'已加载的重点图片':k==='article'||!scene&&v===2?'多行标题':'主标题';
  if(r)return exiting?'页面切换时直接隐藏旧内容，不播放模糊或位移；保留必要的导航和新页面内容。':`${target}直接完整显示并保持清晰，不播放模糊、淡入或位移。正文和必要操作保持稳定。`;
  t=exiting?(scene?'页面切换时让旧内容逐渐失焦（Blur reveal）并淡出隐藏，为新内容让出注意力。':'页面切换时让旧内容逐渐失焦（Blur reveal）并降低不透明度，最终仍微弱可见，为新内容让出注意力。'):background?'背景从轻微模糊逐渐恢复清晰，前景文字和操作控件保持稳定。':`${target}使用模糊显现（Blur reveal），从轻微模糊逐渐变清晰，同时淡入并小幅上移。`;
  if(k==='image'||!scene&&v===1)t='图片实际加载完成后，'+t;
  if(k==='article'||!scene&&v===2)t+='各行按照阅读顺序依次恢复清晰。';
  t+='只处理指定重点区域，其他正文保持稳定清晰。';
 }
 return t;
}
