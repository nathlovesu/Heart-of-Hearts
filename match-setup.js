(function(root){
'use strict';
const config={guaranteedInstants:['Grim Reaper','Death’s Door'],bloodPact:{chance:.20,ids:['Blood Pact 1','Blood Pact 2'],released:false,effect:'bloodpact',replacementType:'instant'}};
function build(deck,cards,rng=Math.random,settings=config){
 const result={deck:[...deck],replaced:[],bloodPactsIncluded:false};
 for(const id of settings.guaranteedInstants)if(!result.deck.includes(id))throw new Error('Missing guaranteed Instant: '+id);
 const pair=settings.bloodPact;
 // Both physical copies require a defined gameplay effect before release.
 if(!pair.released||!pair.effect||pair.ids.some(id=>!cards.byId[id]))return result;
 if(pair.ids.length!==2||new Set(pair.ids).size!==2)throw new Error('Blood Pact requires two distinct copies');
 if(rng()>=pair.chance)return result;
 const eligible=result.deck.map((id,index)=>({id,index})).filter(({id})=>cards.byId[id]?.type==='instant'&&!settings.guaranteedInstants.includes(id)&&!pair.ids.includes(id));
 if(eligible.length<2)throw new Error('Not enough eligible cards for Blood Pact');
 for(const id of pair.ids){const selected=eligible.splice(Math.floor(rng()*eligible.length),1)[0];result.replaced.push(selected.id);result.deck[selected.index]=id;}
 result.bloodPactsIncluded=true;return result;
}
const api={config,build};root.HOHMatchSetup=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);

