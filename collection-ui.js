'use strict';
window.HOHCollectionUI=(()=>{
 const content=HOHCollectibleContent,core=HOHCollectibleCore;
 let counts={},active=false,position=-1,rewards=[],preview=false,busy=false,newRewards=[],beforeCounts={};
 const reduced=()=>HOHSettings.low()||matchMedia('(prefers-reduced-motion: reduce)').matches;
 let root,go,selectedPack=content.packs.find(p=>p.released);
 let packQueue=[],queuedActive=false,revealMusic=null;
 function stopRevealMusic(){if(revealMusic){revealMusic.pause();revealMusic=null;window.dispatchEvent(new CustomEvent('hoh-reveal-music',{detail:{playing:false}}));}}
 function playRevealMusic(item){stopRevealMusic();if(!item.revealAudio)return;revealMusic=new Audio(item.revealAudio);HOHSettings.bind(revealMusic,'music',.8);revealMusic.onended=stopRevealMusic;revealMusic.play().then(()=>window.dispatchEvent(new CustomEvent('hoh-reveal-music',{detail:{playing:true}}))).catch(stopRevealMusic);}
 function cosmeticReveal(item){
  root.querySelector('#opening-stack').hidden=true;
  const scene=root.querySelector('#cosmetic-reveal');scene.hidden=false;scene.dataset.kind=item.kind;scene.replaceChildren();
  const wrapper=document.createElement('div');wrapper.className='cosmetic-reward-wrapper';
  const imprint=document.createElement('div');imprint.className='cosmetic-pack-imprint';imprint.append(cosmeticArt(item));
  const brand=document.createElement('span');brand.textContent=selectedPack.name;wrapper.append(imprint,brand);
  const pop=document.createElement('button');pop.className='cosmetic-popout';pop.setAttribute('aria-label','Finish '+item.name+' reveal');pop.append(cosmeticArt(item));pop.onclick=next;
  const name=document.createElement('h2');name.textContent=item.name;
  const type=document.createElement('p');type.textContent=item.kind==='tape'?'CASSETTE TAPE':item.kind==='back'?'CARD BACK':item.kind==='variant'?'CHARACTER ALT VARIANT':'CHARACTER';
  scene.append(wrapper,pop,name,type);playRevealMusic(item);sound(item.rarity);
  root.querySelector('#opening-hint').textContent='Tap your reward to finish the pack.';
 }
 function cosmeticArt(item){const art=document.createElement('div');art.className='cosmetic-reward-art';if(item.image){art.style.backgroundImage=`url("${item.image}")`;if(item.kind==='character'||item.kind==='variant')art.classList.add('character-sheet');}else{art.classList.add('reward-placeholder');art.textContent=item.kind==='tape'?'▣':item.kind==='back'?'♥':'♟';}return art;}

 function saveQueue(){sessionStorage.setItem('hoh_pack_queue',JSON.stringify(packQueue));}
 function queueButtons(){
  root.querySelector('#summary-open-one').hidden=!!packQueue.length;
  root.querySelector('#summary-open-ten').hidden=!!packQueue.length;
 }
 async function nextQueued(){if(busy||!packQueue.length)return;const next=packQueue[0];selectPack(next.packId);queuedActive=true;await start(next.rewards,false,next.beforeCounts);}
 function packBack(item){const back=document.createElement('span');const kind=item.kind==='gameplay'?HOHCards.byId[item.gameplayId].back:'purple';back.className='reveal-back back '+(kind==='purple'?'purple':'standard');back.innerHTML='<span>✦</span><b>H♥H</b><span>✦</span>';return back;}
 function paintStackBacks(){const remaining=rewards.slice(Math.max(0,position+1)).filter(item=>item.kind==='gameplay');root.querySelectorAll('.stack-back').forEach((node,index)=>{const item=remaining[index+(position<0?1:0)];node.hidden=!item;node.classList.add('back');node.classList.toggle('purple',!!item&&HOHCards.byId[item.gameplayId].back==='purple');node.classList.toggle('standard',!!item&&HOHCards.byId[item.gameplayId].back!=='purple');});}
 function face(item){
  const n=document.createElement('div');n.className='collectible-face rarity-'+item.rarity;
  if(item.kind==='gameplay'){
   // Reuse existing artwork only; collectible ownership never changes the match deck.
   // Render through the exact in-game card renderer and existing card CSS.
   const gameCard=cardNode(item.gameplayId);gameCard.querySelectorAll('button').forEach(b=>b.remove());
   gameCard.removeAttribute('tabindex');gameCard.removeAttribute('role');
   n.classList.add('shared-gameplay-face');n.append(gameCard);
  }else{
   const art=document.createElement('div');art.className='collectible-character';if(!item.image){art.textContent='♥';art.style.cssText='display:grid;place-items:center;font-size:65px;color:#7f567a';}if(item.image)art.style.backgroundImage=`url("${item.image}")`;if(!['character','variant'].includes(item.kind))art.style.backgroundSize='contain';
   const title=document.createElement('h3');title.textContent=item.name;n.append(art,title);
  }
  if(item.kind!=='gameplay'){const type=document.createElement('span');type.className='collectible-kind';type.textContent=item.kind;n.append(type);}return n;
 }
 function book(){
  const status=core.progress(content,counts);root.querySelector('#book-progress').textContent=`${status.owned} / ${status.total} Cards Collected · ${status.percent}% Complete`;
  const grid=root.querySelector('#book-grid');grid.replaceChildren();
  const filter='gameplay';
  const category=item=>{const c=HOHCards.byId[item.gameplayId];return c.type==='joker'?'Jokers':c.type==='instant'?'Instants':c.classification==='relic'?'Relics':c.type==='legendary'?'Legendaries':c.type==='dud'?'Dud':'Numbered cards';};
  const sections=['Numbered cards','Legendaries','Jokers','Instants','Dud','Relics'];
  const visibleItems=content.items.filter(i=>i.released&&i.kind==='gameplay').sort((a,b)=>sections.indexOf(category(a))-sections.indexOf(category(b)));let currentCategory;
  for(const item of visibleItems){
   const group=category(item);if(group!==currentCategory){currentCategory=group;const heading=document.createElement('h2');heading.className='book-section-heading';heading.textContent=group;grid.append(heading);}
   const tile=document.createElement('article');tile.className='book-tile';const count=counts[item.id]||0;
   if(count){tile.append(face(item));const copies=document.createElement('span');copies.className='book-copies';copies.textContent='Collected';tile.append(copies);}
   else{const back=document.createElement('div');back.className='book-locked';back.innerHTML='<span>♥</span><b>UNCOLLECTED</b>';const label=document.createElement('p');label.textContent=item.kind==='gameplay'?(HOHCards.byId[item.gameplayId].rank+HOHCards.byId[item.gameplayId].suit+' · '+item.name).replace(/^ · /,''):item.name;back.append(label);tile.append(back);}
   tile.tabIndex=0;tile.setAttribute('role','button');tile.setAttribute('aria-label','View '+item.name);
   tile.onclick=()=>inspectCollectible(item,tile);tile.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();inspectCollectible(item,tile);}};
   grid.append(tile);
  }
 }
 function inspectCollectible(item,tile){
  const dialog=root.querySelector('#collection-inspect'),art=dialog.querySelector('.collection-inspect-art');art.replaceChildren((counts[item.id]||0)>0?face(item):tile.querySelector('.book-locked').cloneNode(true));
  dialog.querySelector('h2').textContent=item.name;const card=item.kind==='gameplay'?HOHCards.byId[item.gameplayId]:null;
  dialog.querySelector('.collection-inspect-description').textContent=card?(card.rulesText||card.text||''):item.kind==='variant'?'Character alt variant':item.kind==='tape'?'Cassette tape':item.kind==='back'?'Card back':'Character';
  dialog.showModal();
 }
 async function refresh(){if(window.HOHTicketStore?.getCollection){counts=await window.HOHTicketStore.getCollection();book();}}
 function odds(){
  const pack=selectedPack,status=core.validate(pack,content);
  root.querySelector('#pack-table-status').textContent='Cards 1–4: numbered pool, 100.000% each. Card 5: separate rare/special pool, 100.000%. Six characters, six alts and six tapes per pack roster. Cosmetic designs are still being supplied.';
  const list=root.querySelector('#pack-odds-list');list.replaceChildren();
  for(const [id,table] of Object.entries(pack.slotPools)){
   const heading=document.createElement('h3');heading.textContent=id==='numbered'?'Cards 1–4 · each slot rolls independently':'Card 5 · Rare / Special rewards';list.append(heading);
   for(const entry of [...table.entries,...table.groups]){
    const row=document.createElement('div');row.className='odds-row';const label=document.createElement('span');label.textContent=content.byId[entry.id]?entry.id+' · '+content.byId[entry.id].name:entry.id;
    const chance=document.createElement('b');chance.textContent=entry.units===null?'TBD':(entry.units/1000).toFixed(3)+'%';row.append(label,chance);list.append(row);
   }
  }
 }
 async function start(ids,isPreview,previousCounts=counts){
  if(ids.length!==5||ids.some(id=>!content.byId[id]?.released))throw new Error('Invalid five-card reward set');
  stopRevealMusic();root.querySelector('#skip-to-last').hidden=true;root.querySelector('#cosmetic-reveal').hidden=true;
  rewards=ids.map(id=>content.byId[id]);preview=isPreview;beforeCounts={...previousCounts};
  newRewards=[...new Set(ids)].filter(id=>!(beforeCounts[id]>0)).map(id=>content.byId[id]);
  position=-1;active=true;busy=false;delete root.querySelector('.opening-stage').dataset.reveal;root.querySelector('.opening-stage').hidden=false;
  root.querySelector('#book-insertion').hidden=true;
  paintStackBacks();
  root.querySelector('#opening-tag').textContent=preview?'ANIMATION PREVIEW · NO TICKETS SPENT · NO REWARDS GRANTED':(window.HOHTicketStore?.isLocalPreview?'LOCAL PREVIEW ACCOUNT · ':'')+selectedPack.name.toUpperCase();
  root.querySelector('#opening-wrapper').hidden=false;root.querySelector('#opening-stack').hidden=true;root.querySelector('#opening-summary').hidden=true;
  root.querySelector('#opening-wrapper').classList.remove('torn');root.querySelector('#opening-hint').textContent='Tap the wrapper to tear it open.';
  await go('opening');
 }
 async function tear(){
  if(busy||!active)return;busy=true;
  root.querySelector('#opening-wrapper').classList.add('torn');sound('common');
  await new Promise(r=>setTimeout(r,reduced()?0:750));root.querySelector('#opening-wrapper').hidden=true;root.querySelector('#opening-stack').hidden=false;
  const stage=root.querySelector('#opening-card');stage.replaceChildren();stage.className='opening-card unrevealed';stage.setAttribute('aria-label','Reveal card 1 of 5');
  stage.append(packBack(rewards[position<0?0:position]));
  root.querySelector('#skip-to-last').hidden=false;
  root.querySelector('#opening-hint').textContent='Tap the front card to reveal it.';root.querySelector('#opening-count').textContent='0 / 5 revealed';busy=false;
 }
 function sound(rarity){try{
  const ctx=soundContext(),base={common:320,jack:400,queen:480,king:560,ace:640,joker:700,relic:720,character:800,sun:960}[rarity]||500;
  const notes=rarity==='common'?2:rarity==='sun'?12:rarity==='joker'?7:rarity==='relic'?8:5;
  for(let i=0;i<notes;i++){const osc=ctx.createOscillator(),gain=ctx.createGain(),time=ctx.currentTime+i*.07;osc.type=rarity==='joker'?'triangle':'sine';const intervals=rarity==='sun'?[0,4,7,12,16,19]:rarity==='relic'?[0,7,12,19]:rarity==='joker'?[0,3,6,9]:[0,2,4,7,9];osc.frequency.value=base*Math.pow(2,intervals[i%intervals.length]/12);gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.04,time+.015);gain.gain.exponentialRampToValueAtTime(.001,time+.28);osc.connect(gain);gain.connect(soundBus(ctx));osc.start(time);osc.stop(time+.3);}
 }catch{}}
 async function next(){
  if(busy||!active)return;busy=true;
  const stage=root.querySelector('#opening-card');
  if(position>=0&&rewards[position].kind==='gameplay'){stage.classList.add('to-back');await new Promise(r=>setTimeout(r,reduced()?0:400));}
  if(position===4){
   stopRevealMusic();root.querySelector('#cosmetic-reveal').hidden=true;
   await insertIntoBook();
   if(queuedActive){packQueue.shift();saveQueue();queuedActive=false;}
   busy=false;
   if(packQueue.length&&!preview){await nextQueued();await tear();return;}
   summary();return;
  }
  position++;
  if(position===4)root.querySelector('#skip-to-last').hidden=true;
  // Clear the old front; the next reward's identity enters the DOM only at reveal time.
  stage.replaceChildren();stage.className='opening-card unrevealed';stage.append(packBack(rewards[position<0?0:position]));stage.classList.add('flip-reveal');
  await new Promise(r=>setTimeout(r,reduced()?0:240));
  const item=rewards[position];
  if(item.kind!=='gameplay'){cosmeticReveal(item);busy=false;return;}
  stage.replaceChildren(face(item));stage.className='opening-card revealed rarity-'+item.rarity;root.querySelector('.opening-stage').dataset.reveal=item.rarity;
  stage.setAttribute('aria-label',position===4?'Show summary of all five rewards':'Move card to back and reveal next card');
  root.querySelector('#opening-stack').dataset.rarity=item.rarity;sound(item.rarity);
  paintStackBacks();
  root.querySelector('#opening-count').textContent=(position+1)+' / 5 revealed';root.querySelector('#opening-hint').textContent=position===4?'Tap to finish your pack.':'Tap to set this card aside and reveal the next.';
  busy=false;
 }
 async function insertIntoBook(){
  root.querySelector('.opening-stage').hidden=true;root.querySelector('#opening-stack').hidden=true;
  if(!newRewards.length)return;
  const scene=root.querySelector('#book-insertion'),card=root.querySelector('#book-insertion-card');scene.hidden=false;
  root.querySelector('#opening-hint').textContent=preview?'Preview · cards entering the book.':'Your new collectibles are going into the book.';
  for(let index=0;index<newRewards.length;index++){
   const item=newRewards[index];card.replaceChildren(face(item));
   root.querySelector('#book-insertion-label').textContent=(preview?'PREVIEW · ':'NEW · ')+item.name+' · '+(index+1)+' / '+newRewards.length;
   card.classList.remove('into-book');void card.offsetWidth;card.classList.add('into-book');
   root.querySelector('.insertion-book').classList.remove('book-receives');void scene.offsetWidth;root.querySelector('.insertion-book').classList.add('book-receives');
   sound(item.rarity);await new Promise(resolve=>setTimeout(resolve,reduced()?120:1150));
  }
  scene.hidden=true;book();
 }
 function summary(){root.querySelector('.opening-stage').hidden=true;
  root.querySelector('#opening-stack').hidden=true;root.querySelector('#opening-summary').hidden=false;root.querySelector('#opening-hint').textContent=preview?'Preview complete. Your collection and tickets have not changed.':'All five rewards are saved to your collection.';
  const grid=root.querySelector('#opening-summary-grid');grid.replaceChildren();const seen={};
  rewards.forEach(item=>{const tile=document.createElement('article');tile.append(face(item));const label=document.createElement('span');label.className='summary-copy';label.textContent=preview?'Preview':((beforeCounts[item.id]||0)+(seen[item.id]||0)>0?'Duplicate':'New · added to book');seen[item.id]=(seen[item.id]||0)+1;tile.append(label);grid.append(tile);});active=false;
  queueButtons();
 }
 async function openPaid(rootNode,quantity=1){
  const pack=selectedPack,status=core.validate(pack,content),message=root.querySelector(root.querySelector('#opening-summary').hidden?'#character-pack-status':'#summary-purchase-status');
  if(!status.ready){message.textContent='The pack configuration is incomplete. No tickets are spent.';return;}
  if(!window.HOHTicketStore?.openCharacterPack){message.textContent='Connect your account to open packs. No tickets spent.';return;}
  if(busy)return;busy=true;
  if(packQueue.length){busy=false;await nextQueued();return;}
  try{
   const key=sessionStorage.getItem('hoh_pending_pack_'+quantity)||crypto.randomUUID();sessionStorage.setItem('hoh_pending_pack_'+quantity,key);
   if(quantity===10&&!window.HOHTicketStore.openCharacterPacks){message.textContent='Multi-pack redemption is not connected yet.';busy=false;return;}
   const result=quantity===10?await window.HOHTicketStore.openCharacterPacks({packId:pack.id,quantity,idempotencyKey:key}):await window.HOHTicketStore.openCharacterPack({packId:pack.id,idempotencyKey:key});
   const allowed=new Set(Object.values(pack.slotPools).flatMap(t=>[...t.entries.map(e=>e.id),...t.groups.flatMap(g=>g.pool)]));
   if(result.status==='insufficient_tickets'){message.textContent='Not enough tickets to open this pack.';busy=false;sessionStorage.removeItem('hoh_pending_pack_'+quantity);return;}
   const sets=quantity===10?result.packs:[result.rewards];
   if(result.status!=='verified'||!Array.isArray(sets)||sets.length!==quantity||sets.some(ids=>!Array.isArray(ids)||ids.length!==5||ids.some(id=>!content.byId[id]?.released||!allowed.has(id))))throw new Error('Invalid pack receipt');
   const prior={...counts};packQueue=sets.map(ids=>{const entry={packId:pack.id,rewards:ids,beforeCounts:{...prior}};ids.forEach(id=>prior[id]=(prior[id]||0)+1);return entry;});saveQueue();
   await refresh();await HOHTickets.refresh();sessionStorage.removeItem('hoh_pending_pack_'+quantity);busy=false;queueButtons();await nextQueued();
  }catch{message.textContent='Pack result could not be confirmed. Check your collection before retrying.';busy=false;}
 }
 function selectPack(id){
  const pack=content.packs.find(p=>p.id===id&&p.released);if(!pack)throw new Error('Pack is not released');selectedPack=pack;
  root.querySelector('.character-pack-info h2').textContent=pack.name;
  root.querySelector('#opening-wrapper strong').textContent=pack.name.toUpperCase();
  root.querySelector('#opening-wrapper').setAttribute('aria-label','Tear open '+pack.name);
  if(pack.wrapper)root.querySelector('#opening-wrapper').style.backgroundImage=`url("${pack.wrapper}")`;
  else root.querySelector('#opening-wrapper').style.removeProperty('background-image');
  const buy=root.querySelector('#buy-character-pack');buy.lastChild.textContent='Open pack · '+pack.ticketCost+' Ticket';odds();
 }
 function mount(r,navigate){root=r;go=navigate;
  const inspect=document.createElement('dialog');inspect.id='collection-inspect';inspect.className='collection-inspect';inspect.innerHTML='<button class="collection-inspect-close" aria-label="Close card details">×</button><div class="collection-inspect-art"></div><h2></h2><p class="collection-inspect-description"></p>';root.append(inspect);inspect.querySelector('button').onclick=()=>inspect.close();let pressedOutside=false;const outside=e=>{const r=inspect.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;};inspect.onpointerdown=e=>{pressedOutside=outside(e);};inspect.onclick=e=>{if(pressedOutside&&outside(e))inspect.close();pressedOutside=false;};

  const skip=document.createElement('button');skip.id='skip-to-last';skip.className='pack-preview-button';skip.textContent='⏭';skip.setAttribute('aria-label','Skip to last card');skip.title='Skip to last card';skip.hidden=true;
  skip.onclick=()=>{
   if(busy||!active||position>=4)return;
   position=3;skip.hidden=true;
   root.querySelectorAll('.stack-back').forEach(n=>n.hidden=true);
   const stage=root.querySelector('#opening-card');stage.replaceChildren();stage.className='opening-card unrevealed';stage.setAttribute('aria-label','Reveal last card');
   stage.append(packBack(rewards[4]));
   root.querySelector('#opening-count').textContent='Final reveal · 5 / 5';root.querySelector('#opening-hint').textContent='Tap to reveal your final reward.';
  };
  root.querySelector('#opening-stack').append(skip);

  const cosmetic=document.createElement('section');cosmetic.id='cosmetic-reveal';cosmetic.hidden=true;cosmetic.className='cosmetic-reveal';root.querySelector('.opening-stage').append(cosmetic);
  const actions=document.createElement('div');actions.className='summary-pack-actions';actions.innerHTML='<button id="summary-open-one">Open another · 1 Ticket</button><button id="summary-open-ten">Open 10 packs · 10 Tickets</button><button id="summary-to-book">Collection Book</button><p id="summary-purchase-status" role="status"></p>';root.querySelector('#opening-summary').append(actions);
  const multi=document.createElement('button');multi.id='open-ten-packs';multi.className='pack-preview-button';multi.textContent='Open 10 packs · 10 Tickets';multi.onclick=()=>openPaid(root,10);root.querySelector('#buy-character-pack').after(multi);
  try{packQueue=JSON.parse(sessionStorage.getItem('hoh_pack_queue')||'[]');if(!Array.isArray(packQueue))packQueue=[];}catch{packQueue=[];}queueButtons();
  root.querySelector('#summary-open-one').onclick=()=>openPaid(root,1);
  root.querySelector('#summary-open-ten').onclick=()=>openPaid(root,10);
  root.querySelector('#summary-to-book').onclick=()=>{book();go('collection');};
  const insertion=document.createElement('section');insertion.id='book-insertion';insertion.hidden=true;
  insertion.innerHTML='<h2>Collection Book</h2><p id="book-insertion-label" role="status"></p><div class="book-insertion-stage"><div class="insertion-book"><div class="book-page book-left"><span>♥</span></div><div class="book-page book-right"><div class="book-card-pocket">♥</div></div></div><div id="book-insertion-card"></div></div>';
  root.querySelector('#opening-summary').before(insertion);
  const selector=document.createElement('select');selector.setAttribute('aria-label','Choose character pack');selector.className='pack-selector';
  content.packs.filter(p=>p.released).forEach(p=>{const option=document.createElement('option');option.value=p.id;option.textContent=p.name;selector.append(option);});
  selector.hidden=selector.options.length<2;selector.onchange=()=>selectPack(selector.value);root.querySelector('.character-pack').before(selector);
  root.querySelector('#opening-wrapper').onclick=tear;root.querySelector('#opening-card').onclick=next;
  root.querySelector('#opening-exit').onclick=()=>{if(busy)return;stopRevealMusic();active=false;queuedActive=false;go('packs');};
  book();selectPack(selectedPack.id);refresh().catch(()=>{});
 }
 return {mount,book,openPaid,refresh,selectPack};
})();




