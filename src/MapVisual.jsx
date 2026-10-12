import React from 'react';import {feature} from 'topojson-client';import {geoNaturalEarth1,geoPath} from 'd3-geo';import atlas from 'world-atlas/land-110m.json';const land=feature(atlas,atlas.objects.land);const projection=geoNaturalEarth1().fitSize([640,360],land),path=geoPath(projection);const places=[{name:'伦敦',coord:[-.1276,51.5072]},{name:'日内瓦',coord:[6.1432,46.2044]},{name:'罗马',coord:[12.4964,41.9028]}];
export function MapVisual({progress=0,zoom=false,zoomAmount=1}){
 const index=zoom?1:Math.min(2,Math.floor(progress*3)),city=places[index],point=projection(city.coord);
 const scale=zoom?1+progress*3*zoomAmount:1;
 const tx=zoom?(320-point[0])*progress+point[0]*(1-scale):0;
 const ty=zoom?(180-point[1])*progress+point[1]*(1-scale):0;
 const points=places.map(x=>projection(x.coord)),xs=points.map(q=>q[0]),ys=points.map(q=>q[1]);
 const region=[Math.min(...xs)-30,Math.min(...ys)-25,Math.max(...xs)-Math.min(...xs)+80,Math.max(...ys)-Math.min(...ys)+65];
 return <div className="map-visual"><svg viewBox={zoom?'0 0 640 360':region.join(' ')} aria-label="真实世界地理数据地图">
 <g transform={`translate(${tx} ${ty}) scale(${scale})`}><path d={path(land)} fill="#d5e0ee" stroke="#fff" strokeWidth=".7"/>
 <path d={path({type:'LineString',coordinates:places.slice(0,index+1).map(x=>x.coord)})} fill="none" stroke="#246bfe" strokeWidth={(zoom?2:1)/scale}/></g>
 {places.map((x,i)=>{const q=projection(x.coord),cx=q[0]*scale+tx,cy=q[1]*scale+ty;return <g key={x.name}><circle cx={cx} cy={cy} r={zoom?(i===index?6:3):(i===index?2.4:1.5)} fill={i===index?'#246bfe':'#7f9bc5'}/>{i===index&&<text x={cx+(zoom?10:5)} y={cy-(zoom?8:4)} fontSize={zoom?12:6} fill="#246bfe">{x.name}</text>}</g>})}
 </svg>{!zoom&&<small>{city.name}</small>}</div>
}
