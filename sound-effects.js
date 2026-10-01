/* User-provided sound design. Instant cues are scoped to their resolution. */
window.HOHSounds=(()=>{
 const active=new Set();let instant=null,joker=null,jokerFade=null;
 function play(file,volume=.8){const a=new Audio('sound-'+file);HOHSettings.bind(a,file==='joker-song.mp3'?'music':'effects',volume);active.add(a);a.addEventListener('ended',()=>active.delete(a),{once:true});a.play().catch(()=>active.delete(a));return a;}
 function stop(a){if(!a)return;a.pause();a.currentTime=0;active.delete(a);}
 function finishInstant(id){if(!instant||(id&&instant.id!==id))return;clearTimeout(instant.timer);stop(instant.motif);stop(instant.effect);instant=null;}
 function stopJoker(){clearInterval(jokerFade);jokerFade=null;stop(joker);joker=null;}
 function startInstant(c){finishInstant();const cue={id:c.id,motif:play('instant-reveal.mp3'),effect:null,timer:null};instant=cue;const file=c.effect==='door'?'death-door.mp3':c.effect==='reaper'?'collector.mp3':null;if(file)cue.timer=setTimeout(()=>{if(instant!==cue)return;cue.effect=play(file);},2000);}
 function card(c){if(!c)return;if(c.type==='instant'){startInstant(c);return;}if(c.effect==='revive')return;if(c.type==='joker'){stopJoker();joker=play('joker-song.mp3',.65);jokerFade=setInterval(()=>{if(!joker)return;const fade=Math.max(0,(joker.currentTime-14)/3);HOHSettings.volume(joker,.65*Math.max(0,1-fade));if(fade>=1||joker.ended)stopJoker();},50);return;}play(c.type==='legendary'?'legendary-play.mp3':c.type==='heart'?'heart-play.mp3':'basic-play.mp3');}
 function stopAll(){finishInstant();stopJoker();for(const a of [...active])stop(a);}
 window.addEventListener('pagehide',stopAll);
 let context=null;
 function audioContext(){if(!context)context=new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{});return context;}
 function tone(frequency,duration=.12,delay=0){try{const ctx=audioContext(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);const level=(HOHSettings.values.master*HOHSettings.values.effects)*.07;gain.gain.setValueAtTime(level,ctx.currentTime+delay);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+delay+duration);osc.frequency.setValueAtTime(frequency,ctx.currentTime+delay);osc.start(ctx.currentTime+delay);osc.stop(ctx.currentTime+delay+duration);}catch{}}
 document.addEventListener('pointerdown',()=>{try{audioContext();}catch{}},{once:true});
 return {draw:()=>{tone(350);tone(600,.1,.08);},damage:()=>{tone(140,.22);tone(90,.22,.09);},shuffle:()=>{for(let i=0;i<6;i++)tone(240+i*45,.07,i*.1);},card,heal:n=>play(n>1?'heal-multiple.mp3':'heal.mp3'),revive:()=>play('revive.mp3'),finishInstant,stopAll};
})();
