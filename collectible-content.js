'use strict';
(function(root){
 const cards=root.HOHCards,launch=['Joker mimic','Joker wildcard','Joker nullifier','Whirlwind','Joker calling','Joker encore'];
 const rarity=c=>c.id==='Sun'?'sun':c.type==='joker'?'joker':c.classification==='relic'?'relic':({J:'jack',Q:'queen',K:'king',A:'ace'}[c.rank]||'common');
 const items=Object.values(cards.byId).filter(c=>!['Moon 2','Moon 3','Blood Pact 2'].includes(c.id)).map(c=>({
  id:c.id==='Moon 1'?'Full Moon':c.id,gameplayId:c.id,kind:'gameplay',name:c.name,
  released:cards.cards.some(x=>x.id===c.id)&&(c.type!=='joker'||launch.includes(c.id)),rarity:rarity(c),
 }));
 items.push({id:'character_01',kind:'character',name:'Alyazia',released:true,rarity:'character',image:'alyazia.png',free:true});
 // Add real variant, tape and card-back definitions here when their release is decided.
 const locked={'Full Moon':1000,'Cursed Moon':200,Deadlock:200,'Fleeting Illusion':200,Sun:100};
 launch.forEach(id=>locked[id]=500);
 const gameplay=items.filter(i=>i.kind==='gameplay'&&i.released);
 const pack={id:'character_pack_1',name:'Character Pack 1',released:true,ticketCost:1,reveals:5,
  wrapper:null,gameplayPool:gameplay.map(i=>i.id),
  entries:gameplay.map(i=>({id:i.id,units:locked[i.id]??null})),
  groups:[{id:'characters',kind:'character',units:1000,pool:['character_01'],distribution:null},
   {id:'variants',kind:'variant',units:500,pool:[],distribution:null},
   {id:'tapes',kind:'tape',units:2000,pool:[],distribution:null},
   {id:'backs',kind:'back',units:3000,pool:[],distribution:null}],
 };
 // New slot structure supersedes the former shared per-reveal table.
 pack.previousHeadlineOdds={entries:locked,groups:{characters:1000,variants:500,tapes:2000,backs:3000}};
 const numberedWeights=[
  [8000,7000,6000,5000],[4100,3900,3700,3500],[3500,3400,3300,3200],
  [3100,3000,2900,2800],[2700,2600,2500,2400],[2300,2200,2100,2000],
  [1900,1800,1700,1600],[1500,1400,1300,1200],[750,650,550,450]
 ];
 const numbered=numberedWeights.flatMap((weights,index)=>['♣','♦','♥','♠'].map((suit,s)=>({id:(index+2)+suit,units:weights[s]})));
 pack.slotLayout=['numbered','numbered','numbered','numbered','rare'];
 pack.slotPools={
  numbered:{entries:numbered,groups:[],gameplayPool:numbered.map(e=>e.id)},
  rare:{entries:pack.entries.filter(e=>!numbered.some(n=>n.id===e.id)).map(e=>({id:e.id,units:null})),
   groups:pack.groups.map(g=>({...g,units:null})),gameplayPool:gameplay.filter(i=>!numbered.some(n=>n.id===i.id)).map(i=>i.id)}
 };
 delete pack.entries;delete pack.groups;
 // Six roster slots per pack; actual names/art are supplied separately.
 const characterPool=Array.from({length:6},(_,i)=>'character_'+String(i+1).padStart(2,'0'));
 const variantPool=Array.from({length:6},(_,i)=>'variant_'+String(i+1).padStart(2,'0'));
 const tapePool=Array.from({length:6},(_,i)=>'tape_'+String(i+1).padStart(2,'0'));
 characterPool.slice(1).forEach((id,i)=>items.push({id,kind:'character',name:'Character '+(i+2)+' · design TBD',released:true,rarity:'character',image:null,placeholder:true}));
 variantPool.forEach((id,i)=>items.push({id,kind:'variant',name:'Alt Variant '+(i+1)+' · design TBD',released:true,rarity:'variant',image:null,placeholder:true}));
 tapePool.forEach((id,i)=>items.push({id,kind:'tape',name:'Cassette Tape '+(i+1)+' · content TBD',released:true,rarity:'tape',image:null,placeholder:true}));
 items.push({id:'card_back_01',kind:'back',name:'Card Back · design TBD',released:true,rarity:'back',image:null,placeholder:true});
 // Assign each cosmetic its own reveal track when supplied; never substitute another reward's music.
 items.filter(item=>item.kind!=='gameplay').forEach(item=>{item.revealAudio ??= null;});
 const rankWeights={J:[3000,2900,2800,2700],Q:[2000,1900,1800,1700],K:[1500,1400,1300,1200],A:[1300,1200,1100,1000]};
 const rareEntries=Object.entries(rankWeights).flatMap(([rank,weights])=>['♣','♦','♥','♠'].map((suit,i)=>({id:rank+suit,units:weights[i]})));
 for(const [pool,units] of [[characterPool,1000],[variantPool,500],[tapePool,2000]])rareEntries.push(...pool.map(id=>({id,units})));
 rareEntries.push({id:'card_back_01',units:3000},{id:'Cursed Moon',units:500},{id:'Deadlock',units:500},{id:'Fleeting Illusion',units:500},...launch.map(id=>({id,units:750})),{id:'Full Moon',units:250},{id:'Sun',units:100},{id:'Dud',units:40850});
 pack.characterPool=characterPool;pack.variantPool=variantPool;pack.tapePool=tapePool;pack.backPool=['card_back_01'];
 pack.slotPools.rare={entries:rareEntries,groups:[],gameplayPool:rareEntries.filter(e=>items.find(i=>i.id===e.id)?.kind==='gameplay').map(e=>e.id)};
 pack.gameplayPool=[...pack.slotPools.numbered.gameplayPool,...pack.slotPools.rare.gameplayPool];
 pack.excludedGameplay=gameplay.filter(i=>!pack.gameplayPool.includes(i.id)).map(i=>i.id);
 const api={items,byId:Object.fromEntries(items.map(i=>[i.id,i])),packs:[pack],launchJokers:launch,unitsPerPercent:1000,totalUnits:100000};
 root.HOHCollectibleContent=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
