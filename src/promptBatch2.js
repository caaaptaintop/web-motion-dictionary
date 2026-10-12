// Effective motion descriptions for the second reviewed group. Values mirror the renderers.
export function describeSecondBatch(c){
 const {id,scene,variant,values:p}=c,k=scene?.ui,v=c.renderVariant??variant?.index??0,D=p.duration??650,L=p.distance??60;
 const photo='固定的阿尔卑斯湖景照片和随行相机照片；同一显示框与裁切基线';
 let m={baseDuration:D,effectiveDuration:D,curve:'ease-out',subject:photo,trigger:scene?'通过场景中可见按钮触发；键盘Enter/Space等效':'使用画面内的播放变化按钮预览',flow:'',formula:'',assetInstruction:'使用上述主体的同一份图片。精确匹配时请附相同图片；未附时只能近似替代，不承诺像素一致。不要加入私有素材地址或凭据。'};
 if(id===6){
  if(!scene){m.subject=['同一湖景照片卡片','带暗色遮罩的白色模拟确认弹窗、标题和说明','一个说明气泡与显隐按钮','上层湖景与下层相机图片，固定同一显示框','勾选标记与“旅程已保存”轻提示'][v];m.flow=v===3?'初态上层湖景不透明，淡出至opacity=0后露出一直可见的相机图。':v===2?'气泡从opacity=0淡入至1；隐藏按钮将其从1淡至0，显示按钮重新淡入。':v===4?'轻提示从透明淡入，保持，再淡出至透明，最终保留透明DOM。':'主体整体opacity=0→1；模拟弹窗类型的遮罩与框作为同一个透明度层。';m.formula=v===4?`总时长T=设定时长+1800=${D+1800}ms；关键帧offset0/.2/.8/1对应opacity0/1/1/0；整体应用ease-out后再映射关键帧进度，因此offset比例不等于线性墙钟时间比例。`:v===2?`淡入${D}ms ease-out；隐藏${D*.65}ms linear。`:`透明度变化${D}ms ease-out。`;if(v===4)m.effectiveDuration=D+1800;}
  else if(k==='landing'){m.subject='品牌首屏标题、说明、CTA三个元素；顶部品牌小字固定，无无关图片';m.flow='三个元素按标题→说明→CTA淡入，opacity0→1，不位移。';m.formula=`第i项起点i×90ms，i=0/1/2；每项${D}ms；最后结束于${D+180}ms。`;}
  else if(k==='modal'){m.subject='白色确认弹窗内部的勾选、标题、说明、确认和取消；背景湖景固定';m.flow='点击保存旅程打开原生dialog；内部作为一组opacity0→1。确认更新本地收藏，确认/取消/逃逸键均关闭；关闭内部1→0后卸载。白色外壳不另做位移或缩放。';m.formula=`内部进入${D}ms ease-out，退出${D*.65}ms ease-out；背景遮罩CSS ease，进入前25%（${D*.25}ms）完成淡入；退出总时长${D*.65}ms，前75%保持、最后25%淡出。`;}
  else if(k==='menu'){m.subject='背景湖景、右侧导航面板和四个菜单项';m.flow='点击打开导航，整面板作为一个透明度层0→1，菜单项不叠加交错。点击栏目更新状态；关闭/遮罩点击使整面板1→0并移除。此场景为导航淡入特化，不附加滑移。';m.formula=`进入${D}ms，退出${D*.65}ms；遮罩固定，不随面板移动。`;}
  else if(k==='image'){m.flow='点击切换照片：先将旧照片opacity1→0，淡出完成后替换为另一张，再把新照片0→1。湖景与相机两状态来回切换；标题随选择更新。这是顺序淡出/淡入。';m.formula=`旧图淡出${D*.65}ms，新图淡入${D}ms，合计${D*1.65}ms；快速重新切换取消旧切换计时器。`;}
  else if(k==='tooltip'){m.subject='湖景照片下方“拍摄信息”按钮与说明气泡';m.trigger='悬停、键盘聚焦或点击/轻触信息按钮显示；指针离开或焦点离开隐藏';m.flow='气泡opacity0→1，隐藏时1→0再卸载；再次显示取消旧关闭计时器。照片与信息按钮不动。';m.formula=`显示${D}ms，隐藏${D*.65}ms，ease-out。`;}
  else if(k==='switch'){m.subject='偏好设置开关与“自动整理已关闭/已开启”两个同位状态文字';m.flow='点击立即切换状态；旧状态文字1→0、新文字0→1。拇指在0与23px间滑动，轨道与正文位置固定。';m.formula=`文字透明度${D}ms ease；拇指${D}ms ease-in-out，固定23px。`;m.curve='文字ease；拇指ease-in-out';}
  else{m.subject='固定相机产品卡片与单独的已加入购物袋Toast';m.flow='点击加入购物袋先更新本地状态，仅Toast淡入0→1；完整入场后保持1800ms，再淡出1→0并卸载；关闭按钮提前退出。产品主体不重播。';m.formula=`显示调度约20ms后进入${D}ms；从show开始${20+D+1800}ms启动退出；退出${D*.65}ms，总存在时间约${20+D*1.65+1800}ms。`;}
 }
 if(id===7){
  m.flow='旧层与新层在同一位置同时存在，旧opacity1→0，新0→1，容器尺寸保持稳定；完成后新内容可交互，旧层不接收交互。再次操作以最新选择为准。';m.formula=scene?`新层${D}ms ease-out；旧层${D}ms ease。`:`新旧两层均${D}ms ease-out。`;
  if(!scene){m.subject=['两张同框湖景/相机照片','同一版式的两组标题与说明文字','同一相机图片的两种配色','同一文字内容的两种底色','封面、曲名和播放符号组成的两张音乐信息卡'][v];m.flow+=v===2?'配色从原图切至sepia(.7) saturate(.6)，不是换产品。':v===3?'底色#d6e8f7与#d3e9db。':v===4?'封面与曲名整卡同步交叉；没有实际音频播放。':'重播重复这两层的交叉过程。';}
  else if(k==='tabs'){m.subject='路线文章、相机产品、拍摄建议列表三组内容和三个标签';m.flow+='选择对应标签更新面板，标准初态为路线文章。内容区固定290px，高内容可滚动；旧层按钮隐藏。';}
  else if(k==='color-product'){m.subject='同一随行相机照片与雾蓝/松绿/暖沙三个选择按钮';m.flow+='三种滤镜依次为none、sepia(.8) saturate(.45) hue-rotate(65deg)、sepia(.6)，主体和裁切不变。';}
  else if(k==='color-bg'){m.subject='固定标题与雾蓝/松绿/暖沙三种背景层';m.flow+='三色为#d6e8f7、#d3e9db、#efdfc6。';}
  else if(k==='player'){m.subject='湖景/相机封面、山间回声/出发的心情曲名与3:42/4:08时长';m.flow+='下一张/上一张切换两组封面及信息，文字同步交叉；播放按钮仅展示本地播放状态，不调用音频服务。';}
  else m.flow+='上一张/下一张在湖景与相机两张照片间循环；不要虚构第三张。';
 }
 if(id===8){const axis=v<=1?'Y':'X',sign=v===1||v===2?-1:1,mult=v===4?3:1,from=sign*L*mult;m.flow=`从${axis}=${from}px、opacity0进入${axis}=0、opacity1；只一个变换控制者，不叠加CSS整屏滑动。`;m.formula=`位移=设定距离×${sign*mult}=${from}px；进入${D}ms ease-out。`;
  if(!scene){m.subject=v===4?'右侧模拟抽屉，目录标题与三个导航按钮':'同一湖景照片卡片';m.flow+='播放变化重复入场，末态停留在正常位置。';}
  else if(['menu','drawer','sheet'].includes(k)){m.subject=k==='sheet'?'贴底的导航面板、菜单项、固定遮罩与背景湖景':`${v===2?'左':'右'}侧贴边导航面板、菜单项、固定遮罩与背景湖景`;m.flow+='点击打开导航显示；栏目选择更新本地状态；关闭或点击遮罩反向回到相同来源侧并淡出后卸载。';m.formula+=`关闭${D*.65}ms ease-out；面板实际贴${k==='sheet'?'底部（Y轴）':v===2?'左侧':'右侧'}。`;}
  else if(k==='carousel'){m.subject=photo;m.flow=`下一张的新照片从X=${from}px到0并淡入；旧照片从0到X=${-from}px并淡出。上一张将两个方向同时反转。仅湖景/相机两张，同框同步，不改变裁切。`;m.formula=`新层${D}ms ease-out；旧层${D}ms ease；正向偏移=${from}px，反向取负。`;}
  else if(k==='chapter'){m.subject='章节标题、正文与湖景照片固定';m.flow+='只有文章h3移动，正文与图片不动；播放场景可重放。';}
  else{m.subject='步骤一、步骤二、步骤三标签与当前步骤的中性内容';m.flow+='点击下一步依次切换三个步骤，只有当前步骤内容移动，其他内容不重复叠加位移。';}
 }
 if(id===9){
  if(!scene){m.subject=['白色模拟保存弹窗及暗色遮罩','带加号的按压反馈按钮','同一湖景照片','72px勾选与已保存文案','三个导航按钮组成的菜单'][v];m.flow=v===1?'按住pointer/Space/Enter缩至.96，松开恢复1；失焦/离开/取消清按压。播放变化只是1→.96→1的独立演示。':`主体从scale(${v===2?.3:v===0?.9:.65})、opacity0进入scale1、opacity1并停留。`;m.formula=v===1?`按下70ms，释放${D*.4}ms ease-out；播放变化共${D}ms，关键帧offset .5到.96，整体ease-out映射进度。`:`进入${D}ms ease-out${v===4?'；变换原点top right':''}。`;if(v===0){m.flow+='关闭从scale1缩回.9并淡出，关闭后可重新打开；再次选择已选效果支持从关闭态打开和中断关闭。';m.formula+=`关闭${D*.65}ms linear。`;}}
  else if(k==='button'){m.subject='湖景照片下方带星标的收藏按钮，照片固定';m.flow='真实按下按钮缩至.94；松开恢复1并更新收藏文案/星标，不能由click动画覆盖释放过程；失焦、取消、离开和重置清按压。';m.effectiveDuration=D*.65;m.curve='释放cubic-bezier(.3,1,.5,1)';m.formula=`按下70ms，释放${D*.65}ms；固定scale .94↔1。`;}
  else{m.subject=k==='image-modal'?'湖景缩略图与同一图片弹窗':k==='modal'?'白色确认弹窗内部的勾选、说明与确认/取消按钮':k==='success'?'54px勾选、已加入收藏标题和说明':'右侧导航菜单与固定背景湖景';m.flow=`主体从scale(${k==='image-modal'?.3:.9})、opacity0到scale1、opacity1。`;m.formula=`进入${D}ms ease-out；${k==='menu'?'原点top right，去掉侧滑':''}`;if(k==='modal'||k==='image-modal'){m.flow+='点击保存/查看照片打开原生dialog；确认、取消、Escape反向缩小淡出后关闭。外壳不另叠位移/缩放；图片不是精确FLIP位置飞行。';m.formula+=`退出${D*.65}ms ease-out；遮罩CSS ease在进入前25%完成、退出最后25%淡出。`;}else if(k==='menu'){m.flow+='关闭返回相同scale初态并淡出后卸载。';m.formula+=`退出${D*.65}ms。`;}else m.flow+='完成收藏后保持可见，按钮可重新播放。';}
 }
 if(id===10){
  if(!scene){m.subject=v===0?'一行标题“探索每一种可能”':v===2?'山与湖之间/让思绪自由/向新的风景出发三行标题':'同一湖景照片卡片';m.flow=v===4?'从blur0/opacity1过渡至blur8px/opacity.4，末态仍半透明可见。':'从blur8px/opacity.1到blur0/opacity1，无附加位移。';m.formula=`单项${D}ms ease-out${v===2?'；三行起点0/170/340ms':''}。`;if(v===1)m.flow='图片成功加载后才执行：'+m.flow;}
  else{m.subject=k==='hero'?'品牌首屏标题；说明与按钮保持固定':k==='article'?'三行旅行标题；段落和湖景照片固定':k==='gallery'?'3张湖景/相机图片卡，只动画图片，卡片文字固定':k==='product'?'同一相机图片与标题，正文和按钮固定':k==='feature'?'湖景图片与标题，正文和按钮固定':k==='background'?'通过前后按钮选择的同框湖景/相机背景照片':k==='exit'?'可移除的同一湖景照片卡':'湖景图片与标题';m.flow=k==='exit'?'从blur0/opacity1/Y0到blur8px/opacity0/Y12px，最后视觉隐藏但保留DOM，再触发从可见初态重播。':'只对上述指定元素从blur8px/opacity0/Y12px到blur0/opacity1/Y0；其余正文与按钮不动。';m.formula=`单项${D}ms ease-out；固定模糊8px、位移12px${k==='article'?'；三行标题分别从0/150/300ms开始':''}。`;if(k==='image')m.flow='等待图片成功加载，再执行：'+m.flow;if(k==='background')m.flow+='这里只揭示选中的新照片，不声明双层交叉淡化。';}
  if(k==='image'||!scene&&v===1)m.flow+='加载失败显示错误提示，不把complete但naturalWidth=0的破图当作成功；重试/重播重新检查。';
 }
 if(!/照片|图片|湖景|相机|封面/.test(m.subject))m.assetInstruction='主体为上述文字、控件或图标，无需增加无关照片。图标保持同一尺寸和线条风格；不要加入私有地址或凭据。';
 return m;
}
