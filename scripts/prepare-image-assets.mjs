import {existsSync,rmSync} from 'node:fs';
// The hosting static path assigns WebP application/octet-stream and ignores header
// overrides. Publish the existing lossless PNG photographs plus stable JPEG backups;
// retain the original WebP source files for provenance, outside the release artifact.
for(const name of ['alpine-lake','travel-camera','friendly-robot','author']){
 for(const path of [`../dist/client/assets/${name}.png`,`../dist/client/assets/fallback/${name}.jpg`]){
  if(!existsSync(new URL(path,import.meta.url)))throw new Error('Missing release photograph: '+path);
 }
 rmSync(new URL(`../dist/client/assets/${name}.webp`,import.meta.url),{force:true});
}
