'use strict';
(function(root){
 function validate(pack,content){
  if(pack.slotPools){
   const pools=Object.fromEntries(Object.entries(pack.slotPools).map(([id,table])=>[id,validate({...table,reveals:5},content)]));
   const errors=Object.entries(pools).flatMap(([id,status])=>status.errors.map(e=>id+': '+e));
   if(pack.slotLayout?.length!==5||pack.slotLayout.some(id=>!pack.slotPools[id]))errors.push('Invalid five-slot layout');
   return {ready:errors.length===0,pools,errors};
  }
  const errors=[],rows=[...pack.entries,...pack.groups],seen=new Set();let total=0;
  for(const row of rows){
   if(seen.has(row.id))errors.push('Duplicate outcome '+row.id);seen.add(row.id);
   if(!Number.isSafeInteger(row.units)||row.units<0)errors.push('TBD probability: '+row.id);else total+=row.units;
   if(row.pool){
    if(!row.pool.length)errors.push('Missing released pool: '+row.id);
    const dist=row.distribution;
    if(!dist||dist.length!==row.pool.length||dist.some(x=>!Number.isSafeInteger(x)||x<0)||dist.reduce((a,b)=>a+b,0)!==content.totalUnits)errors.push('TBD pool distribution: '+row.id);
    for(const id of row.pool){if(seen.has(id))errors.push('Double-counted collectible '+id);seen.add(id);if(!content.byId[id]?.released)errors.push('Unreleased collectible '+id);if(content.byId[id]?.kind!==row.kind)errors.push('Wrong pool category '+id);}
   }else if(!content.byId[row.id]?.released)errors.push('Unreleased collectible '+row.id);
  }
  for(const id of pack.gameplayPool||[])if(!pack.entries.some(e=>e.id===id))errors.push('Missing gameplay outcome '+id);
  if(total!==content.totalUnits)errors.push('Total is '+(total/1000).toFixed(3)+'%, must be 100.000%');
  if(pack.reveals!==5)errors.push('Character packs require exactly five reveals');
  return {ready:errors.length===0,totalUnits:total,errors};
 }
 function pick(rows,weights,random){
  const total=weights.reduce((a,b)=>a+b,0),r=random();if(!Number.isFinite(r)||r<0||r>=1)throw new Error('Invalid RNG');
  let threshold=r*total;for(let i=0;i<rows.length;i++){threshold-=weights[i];if(threshold<0)return rows[i];}throw new Error('Invalid weighted table');
 }
 function roll(pack,content,random){
  const status=validate(pack,content);if(!status.ready)throw new Error(status.errors.join('; '));
  // Server implementation uses independent secure RNG and each slot's own table.
  return Array.from({length:pack.reveals},(_,index)=>{const table=pack.slotPools?pack.slotPools[pack.slotLayout[index]]:pack;const rows=[...table.entries,...table.groups];const row=pick(rows,rows.map(x=>x.units),random);return row.pool?pick(row.pool,row.distribution,random):row.id;});
 }
 function progress(content,counts){const released=content.items.filter(i=>i.released&&i.kind==='gameplay'),owned=released.filter(i=>(counts[i.id]||0)>0).length;return {owned,total:released.length,percent:released.length?Math.round(owned/released.length*100):0};}
 const api={validate,roll,progress};root.HOHCollectibleCore=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
