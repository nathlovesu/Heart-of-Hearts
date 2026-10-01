'use strict';
// Development-only account. Never installed on a published host or over a real bridge.
if(['127.0.0.1','localhost',''].includes(location.hostname)&&!window.HOHTicketStore){
 window.HOHTicketStore=(()=>{
  const key='hoh_preview_account_v1';
  function read(){const saved=localStorage.getItem(key);return saved?JSON.parse(saved):{tickets:0,collection:{},receipts:{},grants:{}};}
  function save(account){localStorage.setItem(key,JSON.stringify(account));}
  // User-authorized one-time grant, preserved across reloads and future spending.
  const account=read();if(!account.grants['requested_100_tickets']){account.tickets+=100;account.grants['requested_100_tickets']=true;save(account);}
  function random(){return crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;}
  return {isLocalPreview:true,
   async getBalance(){return read().tickets;},async getCollection(){return read().collection;},
   async purchase(){return {status:'unavailable'};},
   async openCharacterPacks({packId,quantity,idempotencyKey}){
    if(![1,10].includes(quantity))throw new Error('Invalid pack quantity');
    const transact=()=>{
     const state=read();if(state.receipts[idempotencyKey])return state.receipts[idempotencyKey];
     const pack=HOHCollectibleContent.packs.find(p=>p.id===packId&&p.released);if(!pack)throw new Error('Unknown pack');
     if(state.tickets<pack.ticketCost*quantity)return {status:'insufficient_tickets'};
     const packs=Array.from({length:quantity},()=>HOHCollectibleCore.roll(pack,HOHCollectibleContent,random));
     state.tickets-=pack.ticketCost*quantity;packs.flat().forEach(id=>state.collection[id]=(state.collection[id]||0)+1);
     const result={status:'verified',packs};state.receipts[idempotencyKey]=result;save(state);return result;
    };
    return navigator.locks?navigator.locks.request('hoh-preview-account',transact):transact();
   },
   async openCharacterPack({packId,idempotencyKey}){
    // Serial browser Web Lock also prevents two preview tabs spending simultaneously.
    const transact=()=>{
     const state=read();if(state.receipts[idempotencyKey])return state.receipts[idempotencyKey];
     const pack=HOHCollectibleContent.packs.find(p=>p.id===packId&&p.released);if(!pack)throw new Error('Unknown pack');
     if(state.tickets<pack.ticketCost)return {status:'insufficient_tickets'};
     const rewards=HOHCollectibleCore.roll(pack,HOHCollectibleContent,random);
     state.tickets-=pack.ticketCost;rewards.forEach(id=>state.collection[id]=(state.collection[id]||0)+1);
     const result={status:'verified',rewards};state.receipts[idempotencyKey]=result;save(state);return result;
    };
    return navigator.locks?navigator.locks.request('hoh-preview-account',transact):transact();
   }
  };
 })();
}
