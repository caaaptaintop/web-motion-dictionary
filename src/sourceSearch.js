const compact=value=>String(value??'').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
export function matchesSourceQuery(query,text,number,namespace){
 const q=compact(query);if(!q)return true;
 const numbered=/^(触发方式|触发|动效|ux)?(\d+)$/.exec(q);
 if(numbered){const scope=numbered[1]?.replace('触发方式','触发');return number===Number(numbered[2])&&(!scope||scope===namespace);}
 return compact(text).includes(q);
}
