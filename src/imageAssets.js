// Backups are alternative encodings of the same source photograph, never placeholders.
export const imageBackups = Object.fromEntries(['alpine-lake','travel-camera','friendly-robot','author'].map(name=>[`/assets/${name}.png`,`/assets/fallback/${name}.jpg`]));
const resolved = new Map();
export function backupImageSource(source) {
  try { return imageBackups[new URL(source, 'https://assets.invalid').pathname] || null; } catch { return null; }
}
export const preferredImageSource = source => resolved.get(source) || source;
export function rememberImageSource(source, selected) {
  if (backupImageSource(source) === selected) resolved.set(source, selected);
}
export async function decodeImage(image) {
  const original = image.getAttribute?.('src') || image.src;
  const preferred = preferredImageSource(original);
  if (preferred !== original) image.src = preferred;
  try { await image.decode(); }
  catch (error) {
    const backup = backupImageSource(original);
    if (!backup || image.getAttribute?.('src') === backup) throw error;
    image.src = backup;
    await image.decode();
    resolved.set(original, backup);
  }
  if (!image.naturalWidth || !image.naturalHeight) throw new Error('Decoded image has no pixels');
  return image;
}

export function nextImageSource(source,current,explicitFallback) {
 const candidates=[...new Set([explicitFallback,backupImageSource(explicitFallback),backupImageSource(source)].filter(Boolean))];
 const index=candidates.indexOf(current);
 return candidates[index+1]||null;
}
