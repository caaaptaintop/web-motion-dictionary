// Reviewed against the active Basic/Text renderer branches.
export function technology01to20({id,scene=null,renderVariant:v=0,reduced=false,duration=650}){
 const k=scene?.ui, s=!!scene, out={drivers:[],renderers:[],support:[],secondaryDrivers:[],evidence:[],notes:[]};
 const add=(group,...values)=>{out[group].push(...values)};
 const ev=(...x)=>add('evidence',...x), note=x=>add('notes',x);
 if(id<=13){
  ev(s?'src/BasicScenes.jsx:14 animate() selector and reduced branch':'src/BasicDemo.jsx:13 play() and Element.animate loop');
  if(s&&k==='switch'){
   add('drivers','css-transition');ev('src/BasicScenes.jsx:55 inline thumb transform transition');
   if(id===6)ev('src/styles.css:49 .scene-fade-status span opacity transition');
   note('No data-motion descendant: generic animate() scheduled by shared lifecycle matches no element; do not count WAAPI or startup timer as an effect technology.');
  }else if(s&&[5,9].includes(id)&&k==='button'){
   add('drivers',reduced?'waapi':'css-transition');ev('src/BasicScenes.jsx:69 data-pressing pointer/key handlers','src/styles.css:45 .spring-press');
   if(!reduced&&duration>0)add('support','pointer-events','keyboard-events');
   if(reduced){add('support','timers');note('Reduced branch executes before per-id early return: one-millisecond opacity WAAPI remains; press handlers do not apply data-pressing.');}
   else note('Normal animate() branch returns for this button; only CSS transform transition performs press/release. Shared startup timeout produces no animation here.');
  }else if(s&&id===5&&['drag','snap','weight'].includes(k)){
   add('drivers','dom-style');add('support','react-state','keyboard-events');if(!reduced&&duration>0||reduced)add('drivers','waapi');
   if(!reduced)add('support','pointer-events');if(['drag','snap'].includes(k))add('support','resize-observer');
   ev('src/BasicScenes.jsx:33 settleDrag()','src/BasicScenes.jsx:42 guarded ResizeObserver','src/BasicScenes.jsx:57 direct pointer/key transform state');
   note(reduced?'Pointer dragging is disabled; button/key direct positioning still uses React state; settling is immediate. Shared reduced animate() still creates a 1ms opacity animation.':'Pointer move updates transform synchronously via React state; release calls springFrames + Element.animate only when duration > 0. No requestAnimationFrame spring integration.');
   if(reduced)add('support','timers');
  }else if(id===12){
   ev('src/revealMath.js:3 applyMaskReveal()');
   if(!reduced){if(v===3){add('drivers','raf');add('renderers','svg-filter-mask');ev('src/RevealPrimitives.jsx:2 NoiseMask');note('Per-frame feFuncA.intercept; no Element.animate in v3.');}else{add('drivers','waapi');add('renderers',v===2?'svg-brush-css-mask':'css-gradient-mask');if(v===2)ev('public/assets/brush-mask.svg');}}
   else note('applyMaskReveal cancels old animations and clears mask styles; reduced continue bypasses both WAAPI and RAF. NoiseMask may remain mounted for v3 but is not driving or masking the output.');
   add('support','timers');if(s&&k!=='brand')add('support','image-decode');
  }else if(id===13){
   if(!reduced&&duration>0){add('drivers','waapi');add('renderers','css-clip-path');add('support','timers');}
   add('support','image-decode');ev(s?'src/BasicScenes.jsx:36 transition() and :65 WipeCurtain mount':'src/BasicDemo.jsx:29 wipe()', 'src/RevealPrimitives.jsx:3 WipeCurtain inline animation:none','src/revealMath.js:2 wipeFrames()');
   note('Normal uses WAAPI clip-path plus half-duration content-swap/full-duration cleanup timers. WipeCurtain overrides .scene-wipe CSS animation with inline animation:none. Reduced or duration 0 switches content directly and does not mount/run curtain.');
   if(!s)add('support','timers');
  }else{
   add('drivers','waapi');if(!(s&&id===4&&k==='hero'))add('support','timers');
   if(id===11&&!reduced){add('renderers','css-clip-path');ev('src/revealMath.js:1 clipFrames()');}
   if(s&&id===4&&k==='hero'||!s&&id===4&&v===3){ev('src/StaggerHeading.jsx:4 guarded unit Element.animate');note('StaggerHeading controls line/word/character units through WAAPI; no timer-based stagger. Parent startup animation selector is empty.');if(!s)note('BasicDemo play() startup timeout updates tick, retriggering StaggerHeading through playKey; this is real scheduling support.');}
   if(!s&&id===9&&v===1&&!reduced){add('drivers','css-transition');if(duration>0)add('support','pointer-events','keyboard-events');ev('src/styles.css:49 .scale-press');note('Autoplay/replay uses WAAPI; pointer/key press cancels it and uses CSS transform transition.');}
  }
  if(!s&&[1,5].includes(id)){add('support','resize-observer');ev('src/BasicDemo.jsx:10 card travel boundary observer');}
  if(s&&id===6&&k==='tooltip')add('support','pointer-focus-events');
  if(s&&id===1&&k==='oscillate'){add('support','resize-observer');ev('src/BasicScenes.jsx:41 oscillation boundary observer');}
  if(s&&id===8&&k==='chapter'){add('support','resize-observer');ev('src/BasicScenes.jsx:40 heading-height observer');}
  if(s&&['modal','image-modal'].includes(k)){
   add('drivers','css-keyframes');add('support','html-dialog','timers');ev('src/BasicScenes.jsx:31 show(), :32 hide(), :48 dialog','src/styles.css:35 backdrop in/out','src/styles.css:126-128 and :141 suppress outer-dialog animation');
   note('CSS keyframes remain on ::backdrop; content is WAAPI. Outer dialog animation is disabled by later specific selectors.');
  }
  if(s&&['menu','drawer','sheet'].includes(k)){
   add('drivers','css-keyframes');add('support','timers');ev('src/styles.css:35 overlay scrim keyframes','src/styles.css:128 and :139 panel overrides');
   note([4,6,8,9].includes(id)?'Panel CSS animation is disabled; scrim CSS animation is still active alongside WAAPI content.':'Panel and scrim CSS animations are declared; WAAPI also drives the selected panel.');
  }
  if(s&&(id===7||id===8&&k==='carousel')){add('drivers','css-keyframes');ev('src/styles.css:26,28,49 old layer/tab/color/player fade or slide');note('Incoming content uses WAAPI; outgoing retained layer uses CSS keyframes.');}
  if(s&&['cards','gallery','portfolio'].includes(k)&&!(id===1&&k==='cards')&&id!==13){add('secondaryDrivers','css-transition');ev('src/styles.css:18 .scene-card chosen box-shadow transition');note('Card selection highlight is secondary UI feedback, separate from the numbered entrance/reveal effect.');}
  if(!s&&id===8&&v<4||!s&&id===9&&v===2||s&&id===8&&k==='carousel'||s&&id===6&&k==='image'){add('support','image-decode');}
  if(!s&&id===3&&v===2||!s&&id===10&&v===1||s&&id===3&&k==='image-caption'){add('support','image-load');}
  if(s&&id===10&&k!=='hero')add('support','image-decode');
  if(reduced&&id<=11)note('Reduced mode generally keeps a 1ms WAAPI final-state write; CSS .reduce forces durations to 1ms and iterations to 1, rather than removing every animation API call.');
 }else if(id<=17){
  add('drivers','waapi');ev(s||id===17&&v===0?'src/TextScenes.jsx:17 reveal effect':'src/TextDemo.jsx:6 reveal()', 'src/textRevealMath.js textRevealSettings/unitRevealSettings');
  if(id===14&&[0,3].includes(v)||id===15&&v===1){add('renderers','css-overflow-clip');ev('src/styles.css:146 configured-reveal clip-on','src/textRevealMath.js:5 mask=false, clip predicate');}
  if(id===17&&v===4){add('support','pointer-focus-events');note('Waits for pointer/focus/play on first entry; WAAPI remains the character motion driver.');}
  if(id===17&&!s&&v===0)note('Demo.jsx:49 routes this independent type to synthetic TextScenes Chinese scene, not TextDemo.');
  note(reduced?'Reduced branch still calls Element.animate with a final-state keyframe and duration 1ms.':'Per-unit delay is a WAAPI timing option, not a setTimeout stagger.');
 }else if(id===18||id===19){
  add('support','timers');if(!reduced&&duration>0)add('drivers','raf');else add('drivers','react-state');
  ev('src/textTiming.js:2 startTextSequence, timeout then requestAnimationFrame','src/TextScenes.jsx:19 / src/TextDemo.jsx:7');
  if(id===18&&!reduced&&(!s||['chat','ai','short'].includes(k))){add('drivers','css-keyframes');ev('src/styles.css:1 .type-cursor blink');}
  if(id===18&&s&&['terminal','search'].includes(k))note('No active CSS cursor animation: terminal renders empty unclassed i and has no matching blink declaration; search renders no cursor.');
  if(id===19&&(s&&k==='easter'||!s&&v===2)){add('support','pointer-focus-events');}
  note(reduced||duration<=0?'startTextSequence timeout publishes the final text directly; no RAF tick is requested. Reduced CSS explicitly disables .type-cursor blink.':'Timer supplies startup delay. RAF calculates elapsed-time character prefix/scramble; React publishes text, no WAAPI.');
 }else if(id===20&&v===4){
  add('drivers','raf');add('renderers','svg','manual-path-interpolation');ev('src/TextDemo.jsx:7 RAF morph loop, :8 contour interpolation, :10 svg path','src/glyph-morph.json');
  note('No Flubber; handcrafted corresponding contour coordinates are linearly interpolated. Delay is polled by RAF, not a timer. Reduced still requests RAF with duration 1ms (no reduced guard).');
 }else if(id===20){
  add('drivers','css-transition','css-keyframes');add('support','resize-observer');
  if(v===3&&!reduced)add('support','mouse-events');
  if(s||!reduced||v<3)add('support','timers');
  ev('src/WordMorph.jsx:4-10 MorphWords measurement, old-word cleanup, inline width transition and morphIn/sceneFadeOut','src/WordMorph.jsx:15-18 WordMorphDemo scheduling','src/TextScenes.jsx:18,20 advanceWord and optional loop');
  note('MorphWords is DOM text crossfade/blur/translation plus container width transition, not SVG or path morph.');
  if(reduced)note('CSS still executes at 1ms; ResizeObserver remains. Auto-loop v3 stops; scene manual switching still uses a zero-delay timeout and old-word cleanup. Independent v3 has no active timer when reduced.');
 }
 for(const key of ['drivers','renderers','support','secondaryDrivers','evidence','notes'])out[key]=[...new Set(out[key])];
 return out;
}
