// Actual TriggerSource/TriggerLater/SourceCombinations branches, including the
// CSS rules that survive the responsive and reduced-motion overrides.
const profile = (drivers=[], renderers=[], support=[], evidence=[]) => ({drivers,renderers,support,secondaryDrivers:[],evidence,notes:[]});
const sequenceGraphics = ['three-frames','svg-renderer-frames','canvas-frames','webp-sequence'];

export function triggerTechnologyProfile({number:n,variant:v=0,combination:c=-1,duration=350,reduced=false,staticInput=false}) {
  const active = !reduced && duration > 0;
  const evidence = [`src/TriggerSource.jsx: TriggerFirst n=${n}, v=${v}, combination=${c}`, 'src/styles.css: source-trigger selectors'];
  if (n === 1) return profile(reduced && c >= 4 ? ['css-state'] : ['css-transition'], [], ['pointer-focus-events',...(v===3?['timers']:[])], evidence);
  if (n === 2) return profile(['css-state',...(v===2?['css-transition']:[])], [], [], evidence);
  if (n === 3) return profile(['react-state',...(active?['dom-style','waapi']:[])], [], ['pointer-events','keyboard-events',...(v===4?['timers']:[])], [...evidence,'src/TriggerSource.jsx: SourcePressButton press/release']);
  if (n === 4) return profile(staticInput || reduced ? ['css-state'] : [...(v===3?[]:['dom-style']),'css-transition',...(v===3?['css-keyframes']:[])], [], ['pointer-events',...(v===4&&!staticInput&&!reduced?['timers']:[])], evidence);
  if (n === 5) return profile(['css-transition',...(v===4&&!reduced?['css-keyframes']:[])], [], ['intersection-observer',...(v===4?['scroll-events']:[])], evidence);
  if (n === 6) return profile(reduced?['react-state']:['webp-sequence',...(v===1&&active?['raf']:[])], sequenceGraphics, ['scroll-events','image-load','css-sticky'], ['src/TriggerLater.jsx: ScrollTrigger','src/Demo.jsx: ThreeObject sequence=true / renderSequence / sequenceCache']);
  if (n === 7) return profile(['dom-style','css-transition'], [], ['pointer-events','keyboard-events','resize-observer'], ['src/TriggerLater.jsx: GestureTrigger']);
  if (n === 8) return profile(['css-keyframes'], [], [...(v===5?['image-load']:['timers']),...(v===1?['raf-schedule']:[])], ['src/TriggerLater.jsx: LoadTrigger','src/styles.css: load-trigger / phase-*']);
  if (n === 9) return profile([v===0||v===1||v===3?'css-transition':'css-keyframes'], [], v===2?['timers']:[], ['src/TriggerLater.jsx: StateTrigger','src/styles.css: state-disclosure / source-switch / state-message']);
  if (n === 10) return profile(reduced?['react-state']:['css-keyframes'], [], [...(!reduced?['timers']:[]),'page-events','pointer-events','keyboard-events'], ['src/TriggerLater.jsx: TimerTrigger','src/styles.css: sourceTimer']);
  throw new Error(`Unreviewed trigger: ${n}`);
}

export function combinationTechnologyProfile({index,reduced=false,duration=650,environment={}}) {
  const evidence = ['src/SourceCombinations.jsx: selected original combination'];
  if (index === 0) return profile(['css-keyframes'], [], [], [...evidence,'IntroCombo / comboLine / sourceLoadContent']);
  if (index === 1) return profile(reduced?['react-state']:['dom-style'], [], ['scroll-events','css-sticky'], [...evidence,'ParallaxCombo inline transform']);
  if (index === 2) return profile(['css-keyframes',...(!reduced&&!environment.narrow&&!environment.coarsePointer&&!environment.noHover?['css-transition']:[])], [], ['intersection-observer',...(!reduced&&!environment.narrow&&!environment.coarsePointer&&!environment.noHover?['pointer-events']:[])], [...evidence,'RevealTiltCombo / responsive transform overrides']);
  if (index === 3) return profile(reduced||environment.coarsePointer||environment.noHover?['css-state']:['css-transition'], [], ['pointer-events'], [...evidence,'MagneticCombo / coarse-pointer :active fallback']);
  if (index === 4) return profile(reduced?['react-state']:['webp-sequence'], sequenceGraphics, ['scroll-events','image-load','css-sticky'], [...evidence,'ScrollTrigger v=0 sequenceVariant=0']);
  if (index === 5) return profile([...(reduced||duration>0?['waapi']:[]),...(!reduced&&(duration>0||environment.narrow)?['css-transition']:[]),'css-keyframes',...(!reduced&&duration>0?['geometry-tween']:[])], [], ['html-dialog','timers','image-decode','keyboard-events',...(environment.narrow?['pointer-events']:[]),...(!reduced?['raf-schedule']:[])], [...evidence,'ProductCombo / SharedView reducedFade=true / OverlaySurface reducedFade=true']);
  throw new Error(`Unreviewed combination: ${index}`);
}
