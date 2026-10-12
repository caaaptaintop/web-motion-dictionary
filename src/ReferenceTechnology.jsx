import React,{useLayoutEffect,useState} from 'react';import {createPortal} from 'react-dom';
import {TechnologyPanel} from './TechnologyPanel';
export function ReferenceTechnology({technologies}){const [host,setHost]=useState(null);useLayoutEffect(()=>setHost(document.getElementById('reference-technology')),[]);return host?createPortal(<TechnologyPanel technologies={technologies}/>,host):null}
