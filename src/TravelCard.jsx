import {StableImage} from './StableImage.jsx';
import React from 'react';

// One record and one card anatomy for comparisons of the same visual subject.
export function TravelCard({camera=false,style={},className='',onClick,...props}) {
  return <div className={'travel '+className} data-subject={camera?'travel-camera':'alpine-lake'} style={style} onClick={onClick} {...props}>
    <StableImage src={'/assets/'+(camera?'travel-camera.png':'alpine-lake.png')} alt={camera?'旅行相机':'阿尔卑斯山间湖泊'} draggable="false"/>
    <div className="travel-caption"><b>{camera?'随行记录':'山间湖畔'}</b><small>{camera?'TAKE THE SCENIC ROUTE':'ALPINE ESCAPE'}</small></div>
  </div>;
}
