'use strict';
// Opponent slots are ready for future artwork, but stay invisible until enabled.
window.HOHCharacters = (() => {
  const slots = [
    {visible:true, sheet:'alyazia.png'},
    {visible:false, sheet:null}, {visible:false, sheet:null}, {visible:false, sheet:null}
  ];
  const states = slots.map(() => ({pose:'idle',until:0,timer:null}));
  function node(player) {
    const slot=slots[player.id], state=states[player.id];
    const wrap=document.createElement('div');
    wrap.className='character-slot'; wrap.dataset.player=player.id;
    wrap.hidden=!slot.visible; wrap.setAttribute('aria-hidden','true');
    if(!slot.visible)return wrap;
    const pose=Date.now()<state.until?state.pose:'idle';
    wrap.classList.add('character-'+pose);
    if(!player.alive)wrap.classList.add('character-eliminated');
    const sprite=document.createElement('div');sprite.className='character-sprite';
    sprite.style.backgroundImage=`url("${slot.sheet}")`;
    const glow=document.createElement('div');glow.className='character-aura';
    wrap.append(glow,sprite);
    if(pose==='hurt') {const heart=document.createElement('span');heart.className='character-lost-heart';heart.textContent='−♥';wrap.append(heart);}
    return wrap;
  }
  function trigger(id,pose) {
    const state=states[id];if(!state||!slots[id].visible)return;
    clearTimeout(state.timer);state.pose=pose;state.until=Date.now()+(pose==='legendary'?1800:1200);
    state.timer=setTimeout(()=>{state.until=0;render();},pose==='legendary'?1800:1200);
  }
  function reset(){states.forEach(s=>{clearTimeout(s.timer);s.pose='idle';s.until=0;});}
  return {slots,node,trigger,reset};
})();
