import {technology01to20} from './technologyBasic.js';
import {technology21to36} from './technologySpatial.js';
import {technology37to56} from './technologyComponents.js';
import {triggerTechnologyProfile,combinationTechnologyProfile} from './technologyReference.js';
import {presentTechnology} from './technologyCatalog.js';

const fields = ['drivers','renderers','support','secondaryDrivers','evidence','notes'];

export function motionTechnologyProfile(config, depth=0) {
  if (depth>4 || config.id<1 || config.id>56) throw new Error('Unreviewed motion technology route');
  const environment = config.environment || {};
  const runtime = {narrow:!!environment.narrow,...config.runtime};
  if (runtime.inputMode===undefined && (config.id===21 || config.id===36)) runtime.inputMode = config.reduced ? 'static' : environment.narrow || environment.coarsePointer ? config.id===36 ? 'auto' : 'controls' : 'pointer';
  if (config.id>=29 && config.id<=35 && runtime.pointerEnabled===undefined) runtime.pointerEnabled = !(environment.narrow || environment.coarsePointer || config.reduced);
  if (config.id===23 && runtime.horizontal===undefined) runtime.horizontal = !(environment.narrow || environment.coarsePointer || config.reduced);
  const selected = {
    id:config.id,
    scene:config.scene || null,
    renderVariant:config.renderVariant ?? config.variant?.index ?? 0,
    reduced:!!config.reduced,
    duration:config.duration ?? config.values?.duration,
    runtime,
  };
  const resolve = selected.id<=20 ? technology01to20 : selected.id<=36 ? technology21to36 : technology37to56;
  const profile = resolve(selected);
  if (profile.mappedConfig) {
    const inner = motionTechnologyProfile({...config,...profile.mappedConfig,environment},depth+1);
    for (const field of fields) profile[field] = [...(profile[field]||[]),...(inner[field]||[])];
  }
  const isReact = id => id === 'react' || id === 'react-state';
  profile.support = [...(profile.support||[]), ...(profile.drivers||[]).filter(isReact), ...(profile.secondaryDrivers||[]).filter(isReact)];
  profile.drivers = (profile.drivers||[]).filter(id=>!isReact(id));
  profile.secondaryDrivers = (profile.secondaryDrivers||[]).filter(id=>!isReact(id));
  return Object.fromEntries(fields.map(field => [field,[...new Set(profile[field]||[])]]));
}

export const motionTechnologies = config => presentTechnology(motionTechnologyProfile(config));
export const triggerTechnologies = config => presentTechnology(triggerTechnologyProfile(config));
export const combinationTechnologies = config => presentTechnology(combinationTechnologyProfile(config));
