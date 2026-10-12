import React from 'react';

export function ValueSlider({label,value,onChange,min=0,max,step=1,unit='毫秒'}){
 return <label className="value-slider"><span>{label}<output>{value} {unit}</output></span><input type="range" aria-label={label} aria-valuetext={`${value}${unit}`} min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>
}
