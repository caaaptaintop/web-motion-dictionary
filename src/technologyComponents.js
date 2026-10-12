// Reviewed active component branches. Resumed source baseline: c1e5a31ac06b841a5097814e824c70742378d8f8.
// Input must contain buildEffectiveConfig's renderVariant, not scene.variant.
// mappedConfig is intentionally unresolved: the aggregate must resolve it recursively and merge groups.
export function technology37to56({id,scene=null,renderVariant:v=0,reduced=false,duration=650,runtime={}}) {
  const kinds={37:['faq','settings','directory','detail','symbol'],38:['account','nav','select','tooltip','actions','select'],39:['confirm','login','image','alert','mobile'],40:['cart','nav','filter','share','mobile'],41:['product','product','product','product','product'],42:['gallery','gallery','gallery','gallery','gallery'],43:['copy','save','save','save','save'],44:['achievement','achievement','achievement','achievement','achievement'],45:['text','article','feed','article','article'],46:['submit','generate','upload','ring','batch'],47:['save','save','form','form','highlight'],48:['menu','expand','play','star','arrow'],49:['filter','remove','sort','expand','grid'],50:['list','profile','music','gallery','title'],51:['portfolio','brand','app','story','portfolio'],52:['recognize','loading','complete','recover'],53:['button','link','drag','expand','input'],54:['primary','open','keyboard','close','end'],55:['parallax','slide','loop','trail','sequence'],56:['hover','expand','sort','pointer','swipe']};
  const k=scene?.ui||kinds[id]?.[v], moving=!reduced&&duration>0;
  const out={drivers:[],renderers:[],support:[],secondaryDrivers:[],evidence:[],notes:[]};
  const add=(field,...values)=>out[field].push(...values), ev=(...x)=>add('evidence',...x), note=x=>add('notes',x);
  const mapped=(nextId,ui,variant,overrides={})=>{out.mappedConfig={id:nextId,scene:ui?{id:scene?.id||`M${id}.nested`,ui}:null,renderVariant:variant,reduced,duration,runtime,...overrides};};
  const cssTransition=()=>add('drivers',reduced||duration>0?'css-transition':'css-state');
  if(id<37||id>56)return out;
  ev('src/Demo.jsx:55-60 and src/ScenarioDemo.jsx:3 route M37-56 to Surface/Content/Action/Layout/RuleComponents; legacy ComponentDemo/ComponentScenes are bypassed');
  if(id===37){
    cssTransition();ev('src/SurfaceComponents.jsx:8-13 AccordionSurface gridTemplateRows and acc-symbol','src/styles.css:72 .acc-grid and .acc-symbol:after');
    note('The vertical plus stroke uses a CSS pseudo-element, not SVG or path interpolation. No timer, observer, rAF or WAAPI.');
    if(reduced)note('Component duration is zero, but .reduce * gives the still-matched transitions 1ms.');
  }else if(id===38){
    add('drivers',moving?'css-keyframes':'css-state');add('support','timers','pointer-events','keyboard-events');
    if(k!=='tooltip')add('support','raf-schedule');
    ev('src/SurfaceComponents.jsx:15-30 AnchorSurface close/leaving/place and non-tooltip ArrowDown focus','src/styles.css:72 surfacePopupIn/surfacePopupOut');
    note('All kinds use a close timer; nav/tooltip additionally use a 120ms pointer-leave delay. place() reads rectangles on resize/scroll, without ResizeObserver.');
    if(k!=='tooltip')note('The single requestAnimationFrame after ArrowDown only focuses newly mounted popup controls; it does not interpolate the popup.');
    if(reduced)note('The popup portal is attached to document.body, outside .app.reduce; --surface-duration=0 gives direct appearance/disappearance.');
  }else if(id===39||id===40){
    add('drivers',reduced||duration>0?'css-keyframes':'css-state');add('support','html-dialog','timers','keyboard-events');
    ev('src/SurfaceComponents.jsx:32-49 OverlaySurface open/close/side and native dialog','src/styles.css:72 surfaceModal/surfacePanel/surfaceBackdrop keyframes');
    if(id===40){
      const bottom=v===3||v===4||(v!==1&&runtime.narrow===true);
      if(bottom)add('support','pointer-events');
      if(bottom&&(!reduced||duration>0))add('secondaryDrivers','css-transition');
      note('Drawer side is left for v1, bottom for v3/v4, otherwise bottom at <=850px and right on wider screens. Bottom handle directly writes dragY; release uses a 150ms CSS transform return. No ResizeObserver.');
      if(v!==1&&v!==3&&v!==4&&typeof runtime.narrow!=='boolean')note('runtime.narrow is unknown: conditional bottom-sheet Pointer Events are not asserted. Supply the <=850px media-query result to describe the currently rendered side exactly.');
    }else if(v===1||v===2)note('Trigger/thumb geometry only sets CSS transform-origin frames. No WAAPI, inverse-layout algorithm or shared-element clone.');
    note('setTimeout coordinates opening -> open and closing -> dialog.close, including reduced zero-delay lifecycle. M39 warning v3 uses 0.35 * duration.');
    if(reduced)note('Local duration is zero; matching descendants retain global 1ms CSS motion. Backdrop pseudo-element uses the local zero duration. This is not the combined-example reducedFade branch.');
  }else if(id===41){
    add('drivers',reduced||duration>0?'css-transition':'css-state');if(reduced||duration>0)add('drivers','css-keyframes');add('support','resize-observer','timers','keyboard-events');
    if(v===4&&!reduced&&duration===0)add('secondaryDrivers','css-keyframes');
    ev('src/ContentComponents.jsx:7-14 Swap and TabsContent choose/indicator measurement','src/styles.css:76-79 indicator, contentIn/contentOut/contentSlide');
    note('Two ResizeObservers measure tab indicator and content height. Timers commit selected content and remove the old layer. v3 slides; other content variants fade; v1 uses a pill indicator.');
    if(v===4)note('The asynchronous variant waits at least 250ms and CSS-rotates an SVG Spinner while waiting. The icon is auxiliary feedback, not SVG geometry interpolation.');
    if(reduced)note('Indicator/Swap CSS remains at global 1ms; v4 loading-spinner animation is explicitly disabled. Timers remain, with v4 still waiting >=250ms.');
  }else if(id===42){
    add('drivers','css-transition');if(reduced||duration>0)add('drivers','css-keyframes');add('support','resize-observer','timers','pointer-events','keyboard-events');
    if(k!=='steps')add('support','image-decode');
    ev('src/ContentComponents.jsx:7 Swap, :16-24 CarouselContent move/autoplay/pointer handlers','src/styles.css:77-80 Swap and carousel-drag-layer');
    note('All variants use a cleanup timer plus Swap ResizeObserver. v1 fades; others slide. v2 side cards are statically scaled; v3 changes the swipe threshold. CSS returns a short drag to its resting position.');
    note((scene?k==='case':v===4)?'Autoplay can use a 4000ms timeout, unless paused, hovered, dragging, preparing or reduced.':'No autoplay control or active autoplay default in this selection; the existing timer is outgoing-layer cleanup.');
    if(reduced)note('Autoplay stops. Manual drag and content changes remain; still-matched CSS transitions/keyframes are reduced to 1ms.');
  }else if(id===43){
    add('drivers',reduced||duration>0?'css-keyframes':'css-state');add('support','timers');
    ev('src/ContentComponents.jsx:26-32 ToastContent show/dismiss/act','src/styles.css:81 toastContent and corner contentIn/contentOut');
    if(k==='copy'){add('support','clipboard-api');note('Copy additionally calls navigator.clipboard.writeText; only this kind uses Clipboard API.');}
    note('Timers preserve readable dwell (duration+2800ms) and closing cleanup; persistent/error messages wait for explicit dismissal. Static Check/Warning/Copy glyphs are not SVG animation.');
    if(reduced)note('Toast keyframes still match at global 1ms; semantic dwell timers are retained.');
  }else if(id===44){
    add('drivers',moving?'raf':'react-state');add('support','intersection-observer');
    if(v===2&&moving)add('secondaryDrivers','css-transition');
    const money=k==='sales'||!scene&&v===4;
    if(money&&!reduced)add('secondaryDrivers','css-keyframes');
    ev('src/ContentComponents.jsx:34-38 CounterContent start/IntersectionObserver and digit transform','src/styles.css:82,93 counter digits and counterDeltaOut');
    note('IntersectionObserver applies to every variant. Normal start() interpolates the displayed number by rAF. v2 adds a 90ms linear CSS digit-strip transition; v3 uses native HTML progress, not SVG.');
    if(money)note('Sales/money displays an additional 4s CSS delta fade. Non-money branches leave this span empty, so its declaration is not counted as visible feedback.');
    if(!moving)note('start() writes the final number directly; no interpolation rAF. Reduced disables digit-strip transition and delta animation.');
  }else if(id===45){
    add('drivers',reduced?'react-state':'css-transition');add('support','timers');
    if(!reduced&&duration>=180&&(v===3||v===4))add('drivers','css-keyframes');
    ev('src/ContentComponents.jsx:40-43 SkeletonContent load and layout','src/styles.css:83,85 skeleton fades/breathe/sweep and reduced overrides');
    note('Load wait is a timer. Normal replacement uses a fixed 180ms opacity transition and cleanup timer. Only v3 breathes and v4 sweeps, visible when the wait is >=180ms; v0/1/2 placeholders have no looping animation.');
    if(reduced)note('Load completes directly to ready; no reveal timer, CSS placeholder animation or CSS fade.');
  }else if(id===46){
    add('drivers','react-state');
    if(duration>0){add('support','timers','raf-schedule');if(v<2&&!reduced)add('drivers','css-keyframes');}
    ev('src/ActionComponents.jsx:6-11 TaskIndicator start/next/cancel','src/styles.css:96,343 taskDot and CSS border spinner');
    note('Timers perform task increments. v0 has a CSS border spinner; v1 has CSS bouncing dots; v2/v4 use native HTML progress; v3 is a CSS conic-gradient ring, not SVG.');
    if(duration>0)note('Cancel can schedule one rAF to restore focus after the cancel button disappears. This is scheduling support, not animation interpolation.');
    if(reduced)note('Task timers/progress still operate; spinner/dots are static.');
    if(duration===0)note('start() completes synchronously; no timer, busy decoration or cancellable busy phase.');
  }else if(id===47){
    add('drivers','css-transition');if(duration>0)add('support','timers');
    if(!reduced&&duration>0)add('drivers','css-keyframes');
    if(v===0&&!reduced&&duration>0)add('renderers','svg');
    ev('src/ActionComponents.jsx:13-16 ResultFeedback submit, shaking/highlight/draw predicates','src/styles.css:97,102,111,163,165 feedback CSS');
    note('Only resolved v0 draws the SVG check path. Other Check/Warning glyphs are static. v2 can shake; every scene also enables relevant invalid-field shaking. v4 highlights saved content. Nonzero processing wait uses a timer; zero wait completes synchronously.');
    note('Hover/press CSS transition is a fixed 150ms, independent of the selected processing wait; reduced limits it to 1ms.');
    if(reduced)note('Spinner class is absent and check drawing, field/confirm/file shaking and highlight animations are explicitly disabled. Processing wait and outcomes remain.');
  }else if(id===48){
    add('renderers','svg');
    if(v<=2){add('drivers',moving?'raf':'react-state');if(moving)add('drivers','flubber');}
    else cssTransition();
    ev('src/ActionComponents.jsx:18-22 StateIcon path interpolation and star/arrow branches','src/styles.css:98 state-icon layout only');
    note(v<=2?'v0 menu, v1 plus/minus and v2 play/pause call Flubber only after the duration/reduced early return; rAF publishes the path.':'v3 crossfades the star fill; v4 rotates the SVG arrow via CSS. Neither branch calls Flubber or rAF.');
    if(!moving&&v<=2)note('Final SVG path is assigned directly. SVG remains the numbered state-icon subject, but Flubber/rAF are bypassed.');
  }else if(id===49){
    add('drivers',moving?'waapi':'react-state');if(moving)add('drivers','flip');
    if(k==='filter'||k==='remove')add('support','timers');
    if(k==='sort')add('support','pointer-events');
    ev('src/LayoutComponents.jsx:4-13 LayoutList snapshot/useLayoutEffect/replace/reorder','src/styles.css:99 layout-card-grid and drag ghost');
    note('Local FLIP algorithm measures old/new rectangles, applies inverse translate/scale, then WAAPI animates to none. Container-height and insertion/removal WAAPI are separate parts of the same flow; no imported FLIP library.');
    note(k==='filter'||k==='remove'?'replace() fades removed items and uses a timer before committing the list; even the reduced path schedules a zero-delay state commit.':'This kind never calls replace(); sort/expand/grid have no active setTimeout.');
    if(!moving)note('Reduced or zero duration skips every WAAPI layout animation; state change/drag remains.');
  }else if(id===50){
    add('drivers',moving?'waapi':'react-state');if(moving)add('drivers','geometry-tween');
    add('support','html-dialog','raf-schedule','keyboard-events');
    if(scene||v!==4)add('support','image-decode');
    if(v!==3&&!reduced)add('secondaryDrivers','css-transition');
    ev('src/LayoutComponents.jsx:15-28 SharedView rect/begin/finish','src/styles.css:100,102,107 shared-details/player and fullscreen exclusion');
    note('SharedView directly interpolates clone left/top/width/height/borderRadius/fontSize between measured rectangles. It does not invert the post-layout transform: classify geometry-tween, not FLIP.');
    note('One rAF waits for shared-flight nodes to mount; WAAPI finished promises finish the transition. No timer. Non-fullscreen details use CSS opacity, music also CSS player progress.');
    if(!moving)note('Default reduced/zero-duration path still measures and schedules one rAF, then finishes without WAAPI. Reduced removes detail/player CSS transitions. The combined reducedFade=true path is different; see artifact addendum.');
  }else if(id===51){
    add('drivers',moving?'css-keyframes':'react-state');if(moving)add('support','timers');
    ev('src/RuleComponents.jsx:5-9 PageMotion go and page layer rendering','src/styles.css:109-110 routeFade/routeSlide/routeWipe/routeZoom');
    note('v0 fades; v1/v2 slide; v3 wipes and changes content at the halfway timer; v4 zooms. Normal route loading/completion use timers; the short loading Spinner is CSS-rotated, with no SVG geometry animation.');
    if(!moving)note('go() assigns the new page immediately; animation layers/loading spinner/timers are not entered.');
  }else if(id===52){
    mapped(47,'form',1);add('support','raf-schedule');if(!reduced)add('secondaryDrivers','css-keyframes');
    ev('src/RuleComponents.jsx:4 M52 ActionComponents id47 showNext without a variant prop','src/ActionComponents.jsx:16 showNext next-operation focus','src/styles.css:117 .feedback-rule .feedback-submit:disabled rulePress');
    note('All four outer kinds use the same inner form v1; only recover starts empty. Never infer an SVG check from outer v0. Next operation schedules rAF focus; normal disabled-button feedback adds CSS rulePress.');
  }else if(id===53){
    if(k==='drag'){mapped(49,'sort',2);note('Inner sort v2 avoids the filter/remove timer path.');}
    else if(k==='expand')mapped(37,'detail',3);
    else if(k==='button'){
      add('drivers',moving?'waapi':'css-state');if(reduced||duration>0)add('secondaryDrivers','css-transition');add('support','pointer-events','keyboard-events');
      note('toggleButton calls Element.animate(scale .96 -> 1) for release only when duration>0. CSS :active gives immediate press; CSS transition-property is restricted to background-color by the final stylesheet rule.');
    }else{cssTransition();if(reduced||duration>0)add('secondaryDrivers','css-keyframes');note(k==='link'?'Link color is CSS transition; revealed detail is contentIn keyframe.':'Input border/box-shadow uses CSS transition; the saved message uses contentIn keyframe.');}
    ev('src/RuleComponents.jsx:11-12 Affordance kind branches and toggleButton','src/styles.css:111,360-364 affordance transitions and WAAPI release separation');
  }else if(id===54){
    if(['open','keyboard','close'].includes(k)){mapped(39,'confirm',0);note('Native modal lifecycle includes CSS keyframes and opening/closing timers.');}
    else if(k==='end'){
      add('drivers','react-state');add('support','timers');if(!reduced)add('secondaryDrivers','css-keyframes');
      note('Save retains the processing timer even when reduced. Normal busy indicator is a CSS border spinner. useLayoutEffect directly focuses the next button; no rAF.');
    }else{add('drivers',reduced||duration>0?'css-keyframes':'css-state');note('Primary/secondary action changes show a CSS contentIn status. No timer, WAAPI or dialog in primary.');}
    ev('src/RuleComponents.jsx:14-16 FocusRule modal dispatch/save/focus','src/styles.css:111 .focus-result');
  }else if(id===55){
    const options=k==='parallax'?['视差','滚动缩放']:k==='trail'?['拖尾','背景跟随','轻微明暗']:k==='sequence'?['图片序列','自动轮播']:[];
    const submode=options.includes(runtime.submode)?runtime.submode:options[0]||k;
    ev('src/RuleComponents.jsx:18-26 ReducedRule submode selection and actual nested props');
    if(k==='feedback')mapped(46,'submit',0,{duration:1600});
    else if(k==='parallax')mapped(submode==='滚动缩放'?24:21,'brand',0,{duration:650});
    else if(k==='trail'&&submode!=='轻微明暗')mapped(submode==='背景跟随'?35:34,'hero',submode==='背景跟随'?1:0,{duration:650});
    else if(k==='sequence'&&submode==='自动轮播')mapped(42,null,4,{duration:500});
    else if(k==='sequence'){
      add('drivers',reduced||runtime.sequencePlaying===false?'react-state':'raf');add('renderers','three-frames','svg-renderer-frames','canvas-frames','webp-sequence');add('support','image-load');
      ev('src/RuleComponents.jsx:26 ReducedSequence outer progress loop','src/Demo.jsx:84-90 sequenceCache/renderSequence/ThreeObject sequence early return');
      note('ThreeObject sequence=true variant0 builds Three -> SVGRenderer -> Canvas2D -> WebP frames on cache miss (24 at <=850px, otherwise 48). Playback selects one img from external progress; it is not live Three repainting. Cache-hit mounts reuse frames.');
      note('Only ReducedSequence owns the playback rAF; ThreeObject explicitly skips its nonsequence rAF. Reduced fixes frame0 and stops this loop while preparation/cache remains. Pause and return-to-first-frame report sequencePlaying=false and remove the playback RAF driver.');
    }else if(k==='slide'){
      add('drivers','css-transition');ev('src/styles.css:112,203 reduced-slide-object and quiet override');
      note(reduced?'Reduced slide preserves a deliberate 150ms opacity transition and removes translation.':'Local transition is fixed 700ms for translation and opacity. No WAAPI, timer, Flubber or rAF.');
    }else{
      add('drivers',reduced?'css-state':'css-keyframes');ev('src/styles.css:112,115 gentleOrbit/gentleBrightness');
      note(k==='loop'?'Robot loop uses gentleOrbit CSS transform keyframes.':'Light submode uses gentleBrightness CSS filter keyframes on a DOM gradient.');
      note('Pause only changes CSS animation-play-state. Reduced sets inline animation:none. These pure CSS branches must not inherit M53 button WAAPI.');
    }
    note(`Resolved UX55 submode: ${submode}. Initial state must use this kind's first option until runtime reports. Pointer submodes need runtime.pointerEnabled/inputMode from their actual nested renderer.`);
  }else if(id===56){
    if(k==='hover')mapped(38,'tooltip',3);
    else if(k==='expand')mapped(38,'nav',1);
    else if(k==='sort')mapped(49,'sort',2);
    else if(k==='pointer')mapped(31,'hint',1);
    else mapped(42,'product',0);
    ev('src/RuleComponents.jsx:28 InputRule nested props and reportInputRuntime');
    note('Outer UX56 variant is not passed to the inner component. Tooltip has no ArrowDown rAF; nav does. Sort has no replace timer; pointer is inner v1; swipe is product v0 with no autoplay.');
  }
  for(const field of ['drivers','renderers','support','secondaryDrivers','evidence','notes'])out[field]=[...new Set(out[field])];
  return out;
}
