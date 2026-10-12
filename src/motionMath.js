export const easingCurves=['linear','ease-in','ease-out','ease-in-out','cubic-bezier(.22,.9,.36,1)'];
export const durationMultipliers=[.5,1,1.5];
export const springProfiles=[{gain:.13,time:1},{gain:.035,time:.65},{gain:.2,time:1.3},{gain:.4,time:1.4}];
export function springFrames(from,to,variant=0,strength=1){const a=(to-from)*springProfiles[variant].gain*strength;return [{transform:`translateX(${from}px)`,offset:0},{transform:`translateX(${to+a}px)`,offset:.55},{transform:`translateX(${to-a*.5}px)`,offset:.72},{transform:`translateX(${to+a/3}px)`,offset:.88},{transform:`translateX(${to}px)`,offset:1}]}
