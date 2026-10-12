// Frame-based text timing preserves the requested total duration, including zero.
export function startTextSequence({text,duration,delay=0,reduced=false,numeric=false,mode='type',loopTexts=null,onUpdate}){
 let frame,timer,cancelled=false,last;
 const publish=value=>{if(!cancelled&&value!==last){last=value;onUpdate(value)}};
 timer=setTimeout(()=>{
  if(reduced||duration<=0){publish(text);return}
  const start=performance.now();
  function tick(now){
   if(cancelled)return;
   const elapsed=now-start;
   if(loopTexts){
    const hold=600,blank=250,cycle=duration*2+hold+blank;
    const phrase=loopTexts[Math.floor(elapsed/cycle)%loopTexts.length],local=elapsed%cycle;
    const count=local<duration?Math.floor(local/duration*phrase.length):local<duration+hold?phrase.length:local<duration*2+hold?Math.ceil((1-(local-duration-hold)/duration)*phrase.length):0;
    publish(phrase.slice(0,Math.max(0,count)));frame=requestAnimationFrame(tick);return;
   }
   const progress=Math.min(1,elapsed/duration),count=Math.floor(progress*text.length);
   publish(progress===1?text:mode==='scramble'?text.slice(0,count)+Array.from({length:text.length-count},()=>numeric?String(Math.floor(Math.random()*10)):String.fromCharCode(65+Math.floor(Math.random()*26))).join(''):text.slice(0,count));
   if(progress<1)frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);
 },reduced?0:Math.max(0,delay));
 return()=>{cancelled=true;clearTimeout(timer);cancelAnimationFrame(frame)};
}
