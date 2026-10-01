'use strict';
(()=>{
 const page=document.createElement('section');page.className='guest-entry';page.setAttribute('aria-label','Player sign in');
 page.innerHTML='<form><span class="guest-heart" aria-hidden="true">♥</span><small>HEART OF HEARTS</small><h1>Your seat awaits.</h1><p>Choose the name other players will see.</p><label for="guest-name">Player name</label><input id="guest-name" maxlength="24" autocomplete="nickname" placeholder="Your name" required><p id="guest-error" role="status"></p><button type="submit">Enter game →</button><span class="guest-note">Play as a guest</span></form>';document.body.append(page);
 const input=page.querySelector('input');try{input.value=localStorage.getItem('hoh_online_name')||'';}catch{}
 const background=[...document.body.children].filter(n=>n!==page&&!['SCRIPT','STYLE'].includes(n.tagName)).map(n=>({node:n,inert:n.inert}));background.forEach(item=>item.node.inert=true);input.focus();
 page.querySelector('form').onsubmit=e=>{e.preventDefault();const name=input.value.trim(),folded=name.normalize('NFKD').toLowerCase().replace(/[01349@]/g,c=>({'0':'o','1':'i','3':'e','4':'a','9':'g','@':'a'}[c])).replace(/[^a-z]/g,'');if(!name||/n+i+g{2,}(?:e+r+|a+)/.test(folded)){page.querySelector('#guest-error').textContent='Choose a different player name.';return;}try{localStorage.setItem('hoh_online_name',name);}catch{}const label=document.getElementById('menu-player-label');if(label)label.textContent=name;page.remove();background.forEach(item=>item.node.inert=item.inert);document.getElementById('continue-menu')?.focus();};
})();
