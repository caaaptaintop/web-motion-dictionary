import React, {useLayoutEffect,useState} from 'react';
import {nextImageSource,preferredImageSource,rememberImageSource} from './imageAssets.js';

// Render an actual img: geometry measurement, direct-child CSS and animation selectors stay intact.
export function StableImage({src,fallbackSrc,ref:forwardedRef,onError,onLoad,...props}) {
  const [state,setState]=useState({source:src,selected:preferredImageSource(src)});
  const selected=state.source===src?state.selected:preferredImageSource(src);
  useLayoutEffect(()=>{setState({source:src,selected:preferredImageSource(src)})},[src]);
  return <img {...props} ref={forwardedRef} src={selected} onLoad={event=>{
    rememberImageSource(src,event.currentTarget.getAttribute('src'));
    if(fallbackSrc)rememberImageSource(fallbackSrc,event.currentTarget.getAttribute('src'));
    onLoad?.(event);
  }} onError={event=>{
    const backup=nextImageSource(src,event.currentTarget.getAttribute('src'),fallbackSrc);
    if(backup&&event.currentTarget.getAttribute('src')!==backup){
      setState({source:src,selected:backup});
      return;
    }
    onError?.(event);
  }}/>;
}
