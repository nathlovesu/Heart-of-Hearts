'use strict';
// Copy this configuration for each season. Empty reward entries stay black.
window.HOHSeasonConfig={
 id:'season_01',name:'Season 1',subtitle:'Your next chapter',levels:100,
 milestones:[25,50,75,100],
 rewards:Array.from({length:20},(_,i)=>({level:(i+1)*5,tickets:1,name:((i+1)*5)%25===0?'Mystery reward':'Pack Ticket',image:null})),
};
window.HOHSeasonPass=(()=>{
 function mount(root){
  const config=HOHSeasonConfig,track=root.querySelector('#season-track');
  root.querySelector('#season-name').textContent=config.name;
  root.querySelector('#season-subtitle').textContent=config.subtitle;
  const next=document.createElement('div');next.id='season-next-reward';next.className='season-next-reward';next.setAttribute('role','status');root.querySelector('.pass-progress').after(next);
  track.replaceChildren();
  for(let level=1;level<=config.levels;level++){
   const item=document.createElement('div');item.className='pass-level';
   const reward=config.rewards.find(r=>r.level===level);
   item.dataset.level=level;
   const label=document.createElement('span');label.className='pass-level-number';label.textContent=String(level).padStart(2,'0');item.append(label);
   if(reward){
    item.classList.add(config.milestones.includes(level)?'pass-milestone':'pass-ticket-level');
    const art=document.createElement('div');art.className='pass-reward-art';
    if(reward.image){const img=document.createElement('img');img.src=reward.image;img.alt=reward.name;art.append(img);}else if(!config.milestones.includes(level)){const img=document.createElement('img');img.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgODAiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZCIgeDI9IjEiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZlNGE0Ii8+PHN0b3Agb2Zmc2V0PSIuNSIgc3RvcC1jb2xvcj0iI2U4Yjc2YSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I4NzUzZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0xMiAxMGg5NnYxOGExMiAxMiAwIDAgMCAwIDI0djE4SDEyVjUyYTEyIDEyIDAgMCAwIDAtMjRaIiBmaWxsPSJ1cmwoI2dvbGQpIiBzdHJva2U9IiNmZmYwYmQiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0zMCAxNXY1ME05MCAxNXY1MCIgc3Ryb2tlPSIjNzE0MjMxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCIvPjxwYXRoIGQ9Ik02MCA1NVM0MiA0MyA0MiAzMmMwLTExIDEzLTEzIDE4LTMgNS0xMCAxOC04IDE4IDMgMCAxMS0xOCAyMy0xOCAyMyIgZmlsbD0iIzg2Mjk0NCIvPjxwYXRoIGQ9Ik0xNiAxNmg5TTk1IDE2aDlNMTYgNjRoOU05NSA2NGg5IiBzdHJva2U9IiNmZmYxYmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPgo=';img.alt='Pack Ticket';art.append(img);}else{const icon=document.createElement('span');icon.textContent='?';art.append(icon);}
    const name=document.createElement('strong');name.textContent=reward.name;
    const tickets=document.createElement('div');tickets.className='pass-ticket-reward';tickets.innerHTML='<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgODAiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZCIgeDI9IjEiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZlNGE0Ii8+PHN0b3Agb2Zmc2V0PSIuNSIgc3RvcC1jb2xvcj0iI2U4Yjc2YSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I4NzUzZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0xMiAxMGg5NnYxOGExMiAxMiAwIDAgMCAwIDI0djE4SDEyVjUyYTEyIDEyIDAgMCAwIDAtMjRaIiBmaWxsPSJ1cmwoI2dvbGQpIiBzdHJva2U9IiNmZmYwYmQiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0zMCAxNXY1ME05MCAxNXY1MCIgc3Ryb2tlPSIjNzE0MjMxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCIvPjxwYXRoIGQ9Ik02MCA1NVM0MiA0MyA0MiAzMmMwLTExIDEzLTEzIDE4LTMgNS0xMCAxOC04IDE4IDMgMCAxMS0xOCAyMy0xOCAyMyIgZmlsbD0iIzg2Mjk0NCIvPjxwYXRoIGQ9Ik0xNiAxNmg5TTk1IDE2aDlNMTYgNjRoOU05NSA2NGg5IiBzdHJva2U9IiNmZmYxYmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPgo=" alt="">';tickets.append(document.createTextNode(reward.tickets+' TICKET'));
    const status=document.createElement('span');status.className='pass-lock';status.textContent='Locked';
    item.append(art,name,tickets,status);
   }else{const dot=document.createElement('span');dot.className='pass-step';dot.textContent='◆';item.append(dot);}
   track.append(item);
  }
  setProgress(root,0);
  root.querySelectorAll('[data-pass-jump]').forEach(button=>button.onclick=()=>{
   const level=Number(button.dataset.passJump),target=track.querySelector(`[data-level="${level}"]`);
   track.scrollTo({left:target.offsetLeft-track.offsetLeft-track.clientWidth/2+target.clientWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
   root.querySelectorAll('[data-pass-jump]').forEach(b=>b.classList.toggle('selected',b===button));
  });
 }
 // Future account service supplies progress and grants each milestone once per season.
 function setProgress(root,level){
  const current=Math.max(0,Math.min(HOHSeasonConfig.levels,Math.floor(level)));
  const reward=HOHSeasonConfig.rewards.find(r=>r.level>current);root.querySelector('#season-next-reward').textContent=reward?'NEXT REWARD · '+reward.tickets+' Ticket'+(reward.name==='Mystery reward'?' + Mystery reward':'')+' · Level '+reward.level+' · '+(reward.level-current)+' levels to go':'All season levels reached';
  root.querySelector('#pass-progress-level').textContent=current;
  root.querySelector('#pass-progress-fill').style.width=current/HOHSeasonConfig.levels*100+'%';
  root.querySelectorAll('.pass-level').forEach(item=>{const unlocked=Number(item.dataset.level)<=current;item.classList.toggle('unlocked',unlocked);const label=item.querySelector('.pass-lock');if(label)label.textContent=unlocked?'Reached':'Locked';});
 }
 return {mount,setProgress};
})();
