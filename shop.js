'use strict';
window.HOHTickets=(()=>{
 const packs=[{id:'tickets_5',tickets:5,price:'£1.99'},{id:'tickets_10',tickets:10,price:'£3.49'},{id:'tickets_25',tickets:25,price:'£7.49'},{id:'tickets_50',tickets:50,price:'£13.99'},{id:'tickets_100',tickets:100,price:'£24.99'}];
 let buying=false;
 function updateBalance(balance){
  if(!Number.isSafeInteger(balance)||balance<0)throw new Error('Invalid ticket balance');
  document.querySelectorAll('[data-ticket-balance]').forEach(n=>n.textContent=balance.toLocaleString());
 }
 async function refresh(){
  // The platform adapter must fetch this value from the authenticated account server.
  if(window.HOHTicketStore)updateBalance(await window.HOHTicketStore.getBalance());
 }
 function mount(root){
  const grid=root.querySelector('#ticket-packs');
  packs.forEach((pack,i)=>{
   const button=document.createElement('button');button.className='ticket-pack';button.type='button';
   button.setAttribute('aria-label',`Buy ${pack.tickets} Tickets for ${pack.price}`);
   button.innerHTML=`<span class="pack-number">0${i+1}</span><div class="ticket-stack"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgODAiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZCIgeDI9IjEiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZlNGE0Ii8+PHN0b3Agb2Zmc2V0PSIuNSIgc3RvcC1jb2xvcj0iI2U4Yjc2YSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2I4NzUzZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0xMiAxMGg5NnYxOGExMiAxMiAwIDAgMCAwIDI0djE4SDEyVjUyYTEyIDEyIDAgMCAwIDAtMjRaIiBmaWxsPSJ1cmwoI2dvbGQpIiBzdHJva2U9IiNmZmYwYmQiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0zMCAxNXY1ME05MCAxNXY1MCIgc3Ryb2tlPSIjNzE0MjMxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCIvPjxwYXRoIGQ9Ik02MCA1NVM0MiA0MyA0MiAzMmMwLTExIDEzLTEzIDE4LTMgNS0xMCAxOC04IDE4IDMgMCAxMS0xOCAyMy0xOCAyMyIgZmlsbD0iIzg2Mjk0NCIvPjxwYXRoIGQ9Ik0xNiAxNmg5TTk1IDE2aDlNMTYgNjRoOU05NSA2NGg5IiBzdHJva2U9IiNmZmYxYmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPgo=" alt=""></div><strong>${pack.tickets}</strong><span class="pack-label">TICKETS</span><span class="pack-price">${pack.price}</span>`;
   button.onclick=()=>purchase(root,pack);grid.append(button);
  });
  root.querySelector('#guaranteed-character').onclick=()=>purchase(root,{id:'character_guaranteed',name:'Guaranteed Character',price:'£14.99'});
  root.querySelector('#purchase-close').onclick=()=>root.querySelector('#ticket-purchase').close();
  refresh().catch(()=>{});
 }
 async function purchase(root,pack){
  if(buying)return;
  const dialog=root.querySelector('#ticket-purchase'),title=root.querySelector('#purchase-title'),message=root.querySelector('#purchase-message');
  title.textContent=`${pack.name||pack.tickets+' Tickets'} · ${pack.price}`;dialog.showModal();
  if(!window.HOHTicketStore||window.HOHTicketStore.isLocalPreview){message.textContent='Purchases will be available when this game is connected to your Steam, App Store or Google Play account. No payment has been taken.';return;}
  buying=true;message.textContent='Opening your platform checkout…';
  try{
   // purchase() resolves only after native checkout AND server receipt verification.
   // The server grants consumables exactly once per transaction; never increment locally.
   const result=await window.HOHTicketStore.purchase({productId:pack.id});
   if(result.status==='cancelled'){message.textContent='Purchase cancelled. No tickets added.';return;}
   if(result.status==='pending'){message.textContent='Payment is pending. Tickets will arrive after confirmation.';return;}
   if(result.status!=='verified')throw new Error('Purchase could not be confirmed');
   await refresh();message.textContent=pack.id==='character_guaranteed'?'Payment confirmed. Your character has been added to your account.':'Payment confirmed. Your account balance has been updated.';
  }catch{message.textContent='Your purchase could not be confirmed. Please check your platform purchase history before trying again.';}
  finally{buying=false;}
 }
 function openCharacterPack(root){return HOHCollectionUI.openPaid(root);}
 return {mount,refresh,packs,openCharacterPack};
})();
