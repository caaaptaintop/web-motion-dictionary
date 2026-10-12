// Only call from an explicit user play/replay action. Keep focus on its control.
export function frameStage(node){
 if(!node)return;
 const stage=node.closest('.stage,.combination-stage')||node;
 stage.scrollIntoView({block:stage.getBoundingClientRect().height>innerHeight-24?'start':'center',behavior:'instant'});
}
