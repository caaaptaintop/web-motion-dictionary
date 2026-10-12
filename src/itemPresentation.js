// UX checklists and their application examples share one observation selector.
// Keep the original rule records intact; they are not independent effect types.
export function itemPresentation(item, selectedMode){
 const rule=item.kind==='ux_rule';
 return {rule,mode:rule?'scenes':selectedMode};
}
