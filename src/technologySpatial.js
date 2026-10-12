// Reviewed against the active Scroll/Pointer renderer branches.
export function technology21to36({id,scene=null,renderVariant:v=0,reduced=false,duration,runtime={}}){
 const s=!!scene, type=!s, mode=runtime.inputMode, blocked=reduced||runtime.pointerEnabled===false||mode==='static',d=duration??(id===34?650:220);
 const kinds={21:['brand','brand','brand','brand','brand'],22:['landscape','grid-product','transparent','axes'],23:['portfolio','features','timeline','gallery','gallery'],24:['photo','product','map','photo','photo'],25:['features','product','map','longform','brand'],26:['hardware','exploded','daynight','character','hardware']};
 const k=scene?.ui||(id<=26?kinds[id]?.[v]:id===27?['story','gallery','features','features','gallery'][v]:id===28?v===4?'timeline':'article':id<=30?'portfolio':'hero');
 const out={drivers:[],renderers:[],support:[],secondaryDrivers:[],evidence:[],notes:[]};
 const add=(g,...x)=>out[g].push(...x),ev=(...x)=>add('evidence',...x),note=x=>add('notes',x);
 const finish=()=>Object.fromEntries(Object.entries(out).map(([k,a])=>[k,[...new Set(a)]]));
 const scroll=()=>add('support','scroll-events','keyboard-events','resize-observer');
 const pointer=(staticMode=blocked)=>{if(!staticMode){add('support','keyboard-events');if(!mode||mode==='pointer'||mode==='desktop'||mode==='touch')add('support','pointer-events');}};
 const smooth=()=>{if(d>0)add('drivers','raf');else{add('drivers','dom-style');add('support','raf-schedule');note('Duration zero: useSmooth schedules one rAF update per target change without time interpolation.');}};
 const modelFrames=()=>{add('support','image-load');add('renderers','three-frames','svg-renderer-frames','canvas-frames','webp-sequence');ev('src/Demo.jsx:84–90 sequenceCache/renderSequence/ThreeObject');note('Preparation only: Three geometry → SVGRenderer SVG → Image.onload → offscreen Canvas2D → WebP.24 frames at width<=850, otherwise48; cached by model:variant:count. Playback changes one HTML img source; sequence=true bypasses ThreeObject rAF.');};
 if(id<21||id>36)return finish();
 if(id<=26){
  scroll();ev('src/ScrollScenes.jsx:6 effective variant;19–22 measurement/seek;46 scroll events');
  if((id===22&&(s||v!==0))||(id===24&&!['map','3d'].includes(k))||(id===25&&['case','brand','longform'].includes(k)))add('support','image-decode');
  if(id===21){
   if(v===4){
    out.support=out.support.filter(x=>x!=='scroll-events');
    if(!reduced){add('drivers','dom-style');pointer(false);}else add('drivers','react-state');
    ev('src/ScrollScenes.jsx:22–24,28,43–50 pointerMode','src/styles.css:128–129 pointer-input-window');
    note('Pointer-mode offsets use CSS transforms immediately; no rAF, transition or scroll-driven movement. Mobile unarmed mode still supports range/buttons/arrows. Reduced distance=0.');
   }else{
    add('drivers',reduced?'react-state':'dom-style');if(v!==0)add('secondaryDrivers','css-sticky');
    ev('src/ScrollScenes.jsx:27 normalParallax;28 sticky scene-parallax');
    note(v===0?'Normal flow: background and decoration translate from raw scroll z; no sticky or animation library.':'Sticky layers translate from scroll progress; no rAF or CSS interpolation transition.');
   }
  }else if(id===22){
   add('drivers',reduced?'react-state':'dom-style');add('secondaryDrivers','css-sticky');
   const layer=type?k:v===1?'grid-product':v===3?'axes':'transparent';
   if(k==='3d'){
    add('renderers','three','svg-renderer');add('support','raf-schedule');
    ev('src/ScrollScenes.jsx:32 ThreeObject model=phone point={0,0}','src/Demo.jsx:88–89 nonsequence SVG rendering');
    note('Scroll moves the wrapper with CSS; Three pose stays zero. Fresh point literals retrigger rAF repaints of the same static pose. No Canvas or generated image frames.');
   }else if(layer==='landscape'||type&&layer==='transparent'){
    add('renderers','svg');ev('src/ScrollScenes.jsx:31–33 mountains/hiker/trees');
    note(layer==='landscape'?'SVG mountain geometry and hiker/tree icon artwork move as CSS layers.':'Independent transparent-layer variant includes moving SVG tree artwork; source scenes do not mount those trees.');
   }
   ev('src/ScrollScenes.jsx:25,29–34 layerKind and subject selection');
   note('All original M22 scenes receive renderVariant2; scene.ui=3d independently selects the Three model.');
  }else if(id===23){
   const horizontal=!reduced&&runtime.horizontal!==false;
   add('drivers',horizontal?'dom-style':'react-state');if(horizontal)add('secondaryDrivers','css-sticky');
   ev('src/ScrollScenes.jsx:7–9,20,35,42 horizontalDemo','src/styles.css:122–123 vertical vs horizontal layout');
   note(horizontal?'Scroll progress translates the measured horizontal track.':'Vertical mode uses native scrolling; CSS !important removes the horizontal transform and sticky runway.');
   note('runtime.horizontal is already reported; all scenes/variants have horizontal/vertical buttons, initially vertical on width<=850 OR coarse pointer. No rAF, ScrollTrigger, scroll snap or IntersectionObserver.');
  }else if(id===24){
   add('drivers',reduced?'react-state':'dom-style');add('secondaryDrivers','css-sticky');
   if(k==='map'){
    add('renderers','svg','d3-geo','topojson');ev('src/MapVisual.jsx:1–13 projection/path and SVG transform');
    note('Map zoom is SVG transform / marker arithmetic from progress; no d3-transition or rAF. Reduced freezes map at progress0.');
   }else{
    if(!reduced)add('drivers','css-transition');
    ev('src/styles.css:21 .scene-zoom-subject 70ms linear transition');
    if(k==='3d'){
     add('renderers','three','svg-renderer');add('support','raf-schedule');
     note('Three SVG model is fixed at point0; apparent approach is CSS scale of its wrapper, not a 3D camera move. No Canvas or image sequence.');
    }else note('Photo source is transformed with CSS scale. Standalone product-approach M24.V02 does not use Three.js.');
   }
   ev('src/ScrollScenes.jsx:36 map / 3d / Photo branch');
  }else if(id===25){
   add('drivers','react-state','css-transition');add('secondaryDrivers','css-sticky');
   ev('src/ScrollScenes.jsx:37 scrollytelling panel branch','src/styles.css:21 step opacity transition');
   note('Common left-step opacity transitions last200ms (1ms under reduced CSS); chapter derives from floor(progress*3).');
   if(k==='product'){
    modelFrames();note('Inner ThreeObject sequence variant6: lens then front glass separate. Reduced still changes discrete frames at chapter*50.');
   }else if(k==='map'){
    add('renderers','svg','d3-geo','topojson');ev('src/MapVisual.jsx:3,9–12 chapter-selected route/city');
    note('Map route/city updates in3 chapter stages; reduced does not freeze this MapVisual progress.');
   }else if(k==='longform'){
    if(!reduced)add('drivers','dom-style');note('Long image uses immediate CSS translateY; reduced sets its distance0. No keyframe on this branch.');
   }else if(k==='data'){
    add('drivers','dom-style');note('Data bars are DOM div height/opacity changes; no SVG/D3 or count-up animation.');
   }else if(!['features','tutorial'].includes(k)){
    add('drivers','css-keyframes');ev('src/styles.css:41 .scene-story-detail sceneFadeIn500ms');
    note('Only the keyed case/brand detail branch runs sceneFadeIn; reduced shortens it to1ms.');
   }
  }else if(id===26){
   add('drivers','react-state');add('secondaryDrivers','css-sticky');
   if(k==='daynight'||k==='character'){
    add('renderers','canvas-frames','webp-sequence');add('support','image-decode');
    ev('src/Demo.jsx:103–124 PhotoSequence Canvas prepare/decode/img','src/ScrollScenes.jsx:38 PhotoSequence key=scene.id:run');
    note('No Three.js/SVGRenderer. Offscreen Canvas2D filters/rotates source bitmap into24/48 WebP frames. No shared cache; replay remount regenerates. Preparing SVG image wrapper is a static placeholder, not the motion renderer.');
   }else{
    modelFrames();ev('src/ScrollScenes.jsx:38 inner variant=(effect===1?1:0)');
    note('Inner Three variant1 only for exploded effect; all other model selections including reverse v4 use inner0. renderSequence variant3 is not a live M26 path.');
   }
   note(reduced?'Reduced still prepares/reuses frames but always displays frame0.':'Native scroll/range progress selects HTML img frame; no rAF playback within M26.');
  }
  return finish();
 }
 if(id===27||id===28){
  const form=id===28&&k==='form',horizontal=id===27?k==='gallery'||k==='features'&&v!==3:k==='timeline';
  add('drivers','react-state');if(!form)add('support','keyboard-events');
  ev('src/ReadingSnap.jsx:7–15 actual progress, mode and indicator;18–23 rendering');
  if(form){
   add('drivers','dom-style');
   note('Form branch has no scroll root: lifecycle returns before ResizeObserver and no wheel handler attaches. Presets/buttons change local step state and CSS bar width; no Scroll events, timers, rAF, snap or actual async task.');
  }else{
   scroll();add('drivers','dom-style');
   if(id===27)add('drivers','css-scroll-snap');
   ev('src/ReadingSnap.jsx:8–13 native scrollTo/scrollBy;20 scrollSnapType','src/styles.css:67,154–160 snap section alignment');
   note(id===27?'Native CSS snap remains active under reduced; v4 proximity, others mandatory.':'No CSS scroll snap on M28; progress is CSS width/conic-gradient or DOM text/active class.');
   note(horizontal?'Horizontal region translates wheel delta into native scrollBy.':'Vertical region uses ordinary native scroll.');
   note(reduced?'Chapter navigation uses scrollTo behavior:auto.':'Chapter buttons use browser-native smooth scrollTo; slider seeks instantly.');
   if(v===3)note('Circle indicator is CSS conic-gradient, not SVG.');
  }
  return finish();
 }
 if(id===29||id===30){
  ev('src/PointerCore.jsx:10–22 effective blocked state, event handlers, CSS transforms');
  if(!blocked){add('drivers','dom-style');if(d>0)add('drivers','css-transition');pointer();}
  add('drivers','react-state');
  note(blocked?'Custom pointer motion disabled: amount0 or transform:none, duration0. Context click actions remain local state.':'Pointer/keyboard/preview writes React target state; CSS transition interpolates transforms. No JS rAF, WAAPI, Three.js or Canvas.');
  if(id===29)note('v1 moves text only; v2 circle enlarges sensor range; v3 border-radius changes; v4 CSS cubic-bezier return. SVG arrow/star are ordinary button assets.');
  else note('CSS perspective/rotateX/rotateY, preserve-3d and v2 translateZ form the depth. Every scene has a gradient highlight; standalone only v1. This is not a Three.js 3D renderer.');
  return finish();
 }
 if(id>=31&&id<=35){
  ev('src/PointerLab.jsx:5–15 shared input and smoothing','src/InputExperience.jsx:3–17 enabled/touch/preview');
  pointer();add('drivers','react-state');
  if(id===31){
   const drag=type?v===3:k==='drag';
   if(!blocked){smooth();add('drivers','css-transition');ev('src/PointerLab.jsx:26,39–43,51 cursor coordinates','src/styles.css:70 cursor width/height/background150ms');}
   if(drag){add('drivers','dom-style');add('support','pointer-events','keyboard-events');ev('src/PointerLab.jsx:29 dragSurface handlers');note('Nested card drag works even while custom cursor is blocked/reduced; those direct transform handlers are not input-enabled gated.');}
   if(v===2)note('Play SVG is cursor artwork carried by a DOM div, not an independent SVG animation engine. Video context is a photo/button; no HTML video playback.');
   note(blocked?'Custom cursor is absent; source context remains usable.':'Big ring uses smoothed coordinates, small dot uses raw coordinates where mounted; size/color transitions use CSS.');
  }else if(id===32){
   if(!blocked)smooth();
   if(v===3||v===2&&!blocked)add('renderers','css-gradient-mask');
   if(v!==3)add('renderers','css-radial-gradient');
   ev('src/PointerLab.jsx:26,44–46 CSS light/mask center');
   note('v0/1/4 radial gradients; v2 radial reveal mask; v3 border mask. No Canvas/Three/SVG engine. Blocked centers light at50/50; v2 removes mask to keep text/image visible. Radius can still change via parameters.');
  }else if(id===33){
   add('support','resize-observer');
   if(!blocked){add('drivers','dom-style');if(d>0)add('drivers','css-transition');}
   if(type&&v===3&&!blocked){add('support','timers','keyboard-events');add('drivers','dom-style');ev('src/PointerLab.jsx:25,39,47 canBlink and170ms timer','src/styles.css:70 scaleY blink');}
   ev('src/PointerLab.jsx:6 Eye;47 raw target prop');
   note('Pupils receive raw target and CSS transition performs visible interpolation. Shared useSmooth executes rAF but its output never reaches Eye; omit rAF as eye driver.');
   note(type&&v===3?'Only this independent variant has170ms timed blink; duration0 does not disable blink.':'This selection has no blink timer; every original scene defaults to effective v0.');
  }else if(id===34){
   ev('src/PointerLab.jsx:13,18–24,49 timestamped trail');
   if(!blocked&&d>0){
    add('drivers','dom-style');add('support','timers');add('secondaryDrivers','raf');
    if(v===1||v===3)add('renderers','svg');
    note('40ms interval expires samples/repaints. Shared useSmooth rAF also causes render and hence age-based opacity/scale recalculation, but smooth coordinates do not drive trail geometry. No CSS transition or keyframe on trail children.');
    note(['DOM shrinking dots','SVG polyline points/opacity','HTML img miniatures from static WebP asset; no Canvas frames','Phosphor Camera SVG artwork in fading/scaling DOM spans','DOM particles with age-dependent spread'][v]);
   }else note('Blocked or duration0: no trail is created/displayed. The40ms cleanup interval still exists but is not a visible animation driver.');
  }else{
   if(!blocked){smooth();add('support','timers');}
   ev('src/PointerLab.jsx:16,21 idle900ms;26–27,50 responsive background');
   note('v0 CSS gradient; v1/v2 63 DOM grid/particle elements; v3 image transform; v4 distance-weighted image/orb layers. No Canvas/Three.js. Timer900ms requests power0; rAF handles return if duration>0.');
  }
  return finish();
 }
 if(id===36){
  add('renderers','three','svg-renderer');ev('src/ModelFollow.jsx:5–17 selected model/variant/input','src/Demo.jsx:63–64,88–90 ThreeObject sequence=false');
  if(reduced||mode==='static'){
   add('support','raf-schedule');note('Static Three/SVG scene still initializes; point0 and duration0 permit a single settling rAF, not continuous motion.');
  }else{
   add('drivers','raf');add('support','keyboard-events');
   if(!mode||mode==='pointer'||mode==='desktop'||mode==='touch')add('support','pointer-events');
   note(d===0?'Duration0 settles each requested pose on the next rAF; input or outer auto targets still change the 3D scene.':'rAF cubic easing changes real scene rotation, camera.x or light position, rendering SVG each frame.');
   if(mode==='auto'||mode==='automatic')note('Mobile auto branch has a second rAF loop that supplies target changes no more often than each80ms; touch/preview mode suspends that auto loop.');
  }
  note('v2 changes camera.x and lookAt; v3 DirectionalLight position; v0/v1 rotate group; v4 maps to inner v0. No Canvas/WebP sequence or WebGLRenderer.');
  note('Do not use pointerEnabled=false to classify M36 mobile default as static: it automatically moves until touch/fixed-preview mode. Report inputMode separately.');
 }
 return finish();
}
