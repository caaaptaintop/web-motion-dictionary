import React from 'react';
import guides from './noviceMotionGuides.json';
import source from './source.json';
export function MotionGuide({id,mode,scene,variant,comparison=false,reduced,config}){
 let guide=mode==='scenes'?guides.scenes.find(x=>x.id===id&&x.ui===scene?.ui):guides.variants.find(x=>x.id===id&&x.variant===variant);
 if(!guide)return null;
 if(comparison){
  const typeGuide=guides.variants.find(x=>x.id===id&&x.variant===variant);
  const type=source.main_items.find(x=>x.source_number===id)?.variants[variant];
  if([11,14,15,17].includes(id)&&type)guide={...guide,result:type.original_label};
  if(id===13&&type)guide={...guide,result:'色幕'+type.original_label+' 覆盖旧内容后，露出同一场景的下一段内容。'};
  if(id===17&&variant===4)guide={...guide,action:'将鼠标移入文字区域，或用 Tab 聚焦文字；也可点“播放场景”'};
  if(id===21&&typeGuide)guide={...guide,...typeGuide};
  if(id===26&&[0,4].includes(variant))guide={...guide,result:variant===0?'当前主体随滚动进度转一圈；向上滚动时沿原顺序倒放':'当前主体先随进度向前旋转；上滚按原顺序倒放，回到 0% 恢复起始画面',...(variant===4?{action:'先在画面内下滚，再向上滚；也可把进度滑块先拖向右，再拖回左侧'}:{})};
  if([30,34,36].includes(id)&&typeGuide)guide={...guide,...typeGuide,result:typeGuide.result.replaceAll('湖景卡片','当前卡片').replaceAll('立体相机','当前模型').replaceAll('相机模型','当前模型')};
  if(id===41&&typeGuide)guide={...guide,result:typeGuide.result,action:'点击画面中的不同标签，也可聚焦标签后按左右方向键；调整“内容切换时长”后再次比较，点“恢复默认”回到初始标签'};
  if(id===45&&typeGuide)guide={...guide,...typeGuide,result:typeGuide.result.replaceAll('文章图文','当前内容')};
  if(id===51&&typeGuide)guide={...guide,result:variant===2?'前进时新页从右侧进入；返回时当前页向右退出，上一页从左侧进入':variant===3?'色幕从一侧扫入，覆盖旧页面时切换内容，再从另一侧移开；返回时方向相反':typeGuide.result,action:'点“进入下一页”，停稳后点“返回上一页”；调整“转场时长”后再次比较，点“恢复默认”回到第一页'};
 }
 if(id===5&&mode==='variants'&&variant<3)guide={...guide,result:guide.result+'；这里用示意卡片观察手感，原文应用示例是弹窗'};
 if(id===55){const sub=guides.subguides?.find(x=>x.submode===config.runtime.submode);if(sub)guide={...guide,action:reduced?sub.reducedAction:sub.action,result:reduced?sub.reducedResult:sub.result}}
 if(reduced&&id===55&&config.runtime.submode==='loop')guide={...guide,action:'观察静态机器人，恢复默认后仍保持静态',result:'关闭自动浮动摇摆，不显示暂停按钮'};
 if(reduced&&id===56)guide={...guide,result:'保留鼠标、键盘和可见按钮入口，直接显示操作结果；自定义指针保持关闭'};
 if(reduced&&id===26)guide={...guide,action:'在演示窗口内正常滚动，或使用进度滑块',result:'保持静态主图，不随滚动旋转、拆开或变换光线；仍可继续阅读下一段'};
 if(reduced&&id===51)guide={...guide,result:'页面内容直接切换，保留前进与返回操作'};
 if(reduced&&id===52)guide={...guide,result:'仍执行校验和处理等待，保留成功、失败与修正入口'};
 if(reduced&&id===53)guide={...guide,result:'操作入口和结果保持可见，关闭装饰移动'};
 if(reduced&&id===54)guide={...guide,result:config.renderVariant===4?'处理等待后显示成功，并把焦点移到下一步按钮':'保持主次操作和焦点顺序，关闭装饰过渡'};
 if(id>=21&&id<=26&&!(id===21&&config.renderVariant===4)&&config.parameters.some(p=>p.key==='speed')&&!reduced)guide={...guide,result:guide.result+'；调大进度响应倍率，后半段效果会更早出现'};
 if(reduced&&id<=20)guide={...guide,action:'使用画面内的操作按钮查看结果',result:'保留当前操作结果，关闭装饰移动、回弹与逐项延迟'};
 if(reduced&&id>=46&&id<=50)guide={...guide,result:({46:'保留真实任务等待、进度、取消和结果，关闭装饰旋转',47:'仍需完成校验和处理等待，成功或错误直接显示',48:'图标直接切换，状态与键盘操作保留',49:'保留筛选、排序、删除和布局结果，关闭移动过渡',50:'直接打开详情或预览，返回后恢复原位置'})[id]};
 if(reduced&&id>=41&&id<=45)guide={...guide,result:({41:'保留标签选择，内容直接切换；加载型仍等待内容就绪',42:'保留上一张、下一张和拖动操作，关闭自动播放与位移',43:'提示直接出现和关闭，正常提示仍停留，错误保留处理入口',44:'直接显示目标数值，单位与结果仍保留',45:'仍按加载等待显示静态占位，内容就绪后替换；关闭呼吸和扫光'})[id]};
 if(reduced&&id===36)guide={...guide,action:'观察静态模型',result:'模型保持正面，关闭跟随和自动变化'};
 if(id===33&&config.renderVariant===3&&config.runtime.pointerEnabled===false&&!reduced)guide={...guide,action:'当前为静态预览；点“预览指针效果”后可点击角色眨眼，完成后点“结束预览”',result:'默认保持静态；主动预览时才演示跟随和眨眼'};
 if(reduced&&id>=31&&id<=35)guide={...guide,action:'观察静态画面，可使用普通按钮和输入框',result:({31:'使用系统指针，关闭自定义跟随',32:'保持静态光区，文字完整可见；仍可调节光区半径',33:'眼睛保持正中，不跟随移动',34:'关闭装饰拖尾，正文和操作保持可用',35:'背景保持静止，前景操作仍可用'})[id]};
 if(reduced&&[29,30].includes(id))guide={...guide,action:id===29?'点画面中的按钮或链接':'观察静止卡片',result:id===29?'保留普通点击反馈，关闭磁吸位移':'卡片保持正面静止，文字清晰可读'};
 if(reduced&&id===20&&config.renderVariant===3)guide={...guide,action:mode==='scenes'?'点“切换关键词”':'点“播放变化”',result:mode==='scenes'?'直接显示下一个词，保留手动切换，停止自动轮换':'保持文字静止，停止自动轮换'};
 if(reduced&&[47,52].includes(id))guide={...guide,action:guide.action.replaceAll('处理与反馈时长','处理等待')};
 return <div className="usage-guide"><p><b>怎么操作</b>{guide.action}</p><p><b>会看到</b>{guide.result}</p>{id===39&&config.renderVariant===3&&!reduced&&<p className="usage-mode">警告的实际动画时长：{Math.round((config.values.duration??650)*.35*10)/10} 毫秒（所选基准的35%）</p>}{id===2&&!reduced&&<p className="usage-mode">当前档位的实际动画时长：{config.motion.effectiveDuration} 毫秒</p>}</div>
}
