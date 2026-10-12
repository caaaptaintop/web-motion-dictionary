import React from 'react';
import {ScrollScenes} from './ScrollScenes';
const groups={
21:[['brand','慢背景配普通正文'],['brand','快前景慢背景'],['brand','图片框内局部景物移动'],['brand','层反向移动'],['brand','鼠标驱动小范围视差']],
22:[['landscape','天空山体人物植物'],['grid-product','网格产品文字'],['transparent','透明图叠加'],['axes','横纵同时位移']],
23:[['portfolio','作品卡片横移'],['features','功能横向章节'],['timeline','横向时间轴'],['gallery','单行画廊'],['gallery','桌面横向手机纵向']],
24:[['photo','小卡片扩大至全屏'],['product','产品靠近镜头'],['map','地图定位城市'],['photo','放大照片进入新内容'],['photo','上滚原路缩小']],
26:[['hardware','产品转一圈'],['exploded','设备外壳拆开'],['daynight','照片昼夜变化'],['character','插画角色动作'],['hardware','上滚反向']],
25:[['features','左步骤右界面'],['product','中心产品逐个零件'],['map','固定地图换路线地点'],['longform','长图旁解释'],['brand','固定背景叠加章节']]
};
export function ScrollEffects({id,v,p,run,reduced,onRuntimeChange}){const [ui,label]=groups[id][v];return <ScrollScenes onRuntimeChange={onRuntimeChange} variant={v} id={id} scene={{id:`M${id}.V${String(v+1).padStart(2,'0')}`,ui,label,effect:v,isType:true}} params={p} run={run} reduced={reduced}/>}
