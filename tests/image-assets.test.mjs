import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {imageBackups,nextImageSource,decodeImage,rememberImageSource,preferredImageSource} from '../src/imageAssets.js';
import worker from '../worker/index.js';

test('all literal and dynamic local image resources are included verbatim in production',async()=>{
 const sourceFiles=(await readdir(new URL('../src/',import.meta.url))).filter(x=>/\.(jsx?|css)$/.test(x));
 const sources=(await Promise.all(sourceFiles.map(x=>readFile(new URL('../src/'+x,import.meta.url),'utf8')))).join('\n');
 const references=new Set([...sources.matchAll(/\/assets\/[\w/-]+\.(?:webp|png|svg|jpe?g|gif|avif)/g)].map(x=>x[0]));
 for(const name of ['alpine-lake','travel-camera','friendly-robot','author'])references.add('/assets/'+name+'.png');
 for(const model of ['camera','car','clothing','game','phone','robot','shoe'])references.add('/assets/models/'+model+'.svg');
 for(const fallback of Object.values(imageBackups))references.add(fallback);
 references.add('/favicon.svg');
 for(const path of references){const original=await readFile(new URL('../public'+path,import.meta.url));const built=await readFile(new URL('../dist/client'+path,import.meta.url));assert.ok(original.length>0,path);assert.deepEqual(built,original,path);}
});

test('decode failure selects equivalent local backup and subsequent preparations reuse it',async()=>{
 const image={src:'/assets/alpine-lake.png',naturalWidth:0,naturalHeight:0,getAttribute(){return this.src},async decode(){if(this.src.endsWith('.png'))throw Error('simulated decode failure');this.naturalWidth=640;this.naturalHeight=480}};
 await decodeImage(image);assert.equal(image.src,'/assets/fallback/alpine-lake.jpg');
 const next={...image,src:'/assets/alpine-lake.png'};await decodeImage(next);assert.equal(next.src,'/assets/fallback/alpine-lake.jpg');
 const bad={...image,src:'/assets/unknown.webp',async decode(){throw Error('bad')}};await assert.rejects(decodeImage(bad));
});

test('image responses preserve status and carry format-specific MIME types',async()=>{
 for(const [extension,mime] of [['webp','image/webp'],['png','image/png'],['svg','image/svg+xml']]){
  const response=await worker.fetch(new Request('https://example.test/assets/photo.'+extension),{ASSETS:{fetch:async()=>new Response('pixels',{headers:{'content-type':'application/octet-stream'}})}});
  assert.equal(response.headers.get('content-type'),mime);assert.equal(await response.text(),'pixels');
 }
 const missing=await worker.fetch(new Request('https://example.test/assets/missing.webp'),{ASSETS:{fetch:async()=>new Response('missing',{status:404})}});assert.equal(missing.status,404);
});

test('successful component fallback is reused across remounts without changing subjects',()=>{
 rememberImageSource('/assets/travel-camera.png','/assets/fallback/friendly-robot.jpg');
 assert.equal(preferredImageSource('/assets/travel-camera.png'),'/assets/travel-camera.png');
 rememberImageSource('/assets/travel-camera.png','/assets/fallback/travel-camera.jpg');
 assert.equal(preferredImageSource('/assets/travel-camera.png'),'/assets/fallback/travel-camera.jpg');
});

test('production contains stable PNG primaries and same-subject JPEG backups',async()=>{
 for(const [primary,backup] of Object.entries(imageBackups)){
  assert.ok(primary.endsWith('.png'));assert.ok(backup.endsWith('.jpg'));
  assert.ok((await readFile(new URL('../dist/client'+primary,import.meta.url))).length);
  assert.ok((await readFile(new URL('../dist/client'+backup,import.meta.url))).length);
  await assert.rejects(readFile(new URL('../dist/client'+primary.replace('.png','.webp'),import.meta.url)),{code:'ENOENT'});
 }
});

test('generated frame fallback can reach the photo backup without looping',()=>{
 const frame='data:image/webp;base64,broken',photo='/assets/alpine-lake.png';
 assert.equal(nextImageSource(frame,frame,photo),photo);
 assert.equal(nextImageSource(frame,photo,photo),'/assets/fallback/alpine-lake.jpg');
 assert.equal(nextImageSource(frame,'/assets/fallback/alpine-lake.jpg',photo),null);
});
