import fs from 'node:fs';
import * as THREE from 'three';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
// Offline SVG serialization only; the geometry functions are the same trusted source used by the app.
class SvgNode {
 constructor(tag){this.tag=tag;this.attributes={};this.childNodes=[];this.style={}}
 setAttribute(k,v){this.attributes[k]=String(v)}
 appendChild(n){this.childNodes.push(n);return n}
 removeChild(n){this.childNodes.splice(this.childNodes.indexOf(n),1)}
 serialize(){const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;');let attrs={...this.attributes};if(this.tag==='svg'){attrs.xmlns='http://www.w3.org/2000/svg';attrs.style=`background:${this.style.backgroundColor||'#f6f7fa'}`}return `<${this.tag} ${Object.entries(attrs).map(([k,v])=>`${k}="${escape(v)}"`).join(' ')}>${this.childNodes.map(x=>x.serialize()).join('')}</${this.tag}>`}
}
globalThis.document={createElementNS:(_,tag)=>new SvgNode(tag)};
const source=fs.readFileSync('src/Demo.jsx','utf8');
const geometry=source.slice(source.indexOf('function makeScene('),source.indexOf('function prepareExplodedShell('))+source.slice(source.indexOf('function populateProduct('));
const makeScene=new Function('THREE','SVGRenderer',geometry+';return makeScene;')(THREE,SVGRenderer);
fs.mkdirSync('public/assets/models',{recursive:true});
for(const model of ['camera','robot','car','phone','clothing','shoe','game']){const w=makeScene(null,model==='robot',model);w.renderer.render(w.scene,w.cam);fs.writeFileSync(`public/assets/models/${model}.svg`,w.renderer.domElement.serialize());w.scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.()})}
