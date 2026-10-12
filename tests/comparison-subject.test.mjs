import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const scenes = JSON.parse(readFileSync(new URL('../src/scenes.json', import.meta.url), 'utf8'));
const bundle = await build({
  stdin: {contents: "export {buildEffectiveConfig,compatibleVariants,comparisonVariants} from './src/motionConfig.js'; export {generateIntegratedPrompt} from './src/integratedPrompt.js';", resolveDir: root},
  bundle: true, write: false, platform: 'node', format: 'esm',
});
const {buildEffectiveConfig,compatibleVariants,comparisonVariants,generateIntegratedPrompt} = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const sceneFor = (id, pattern) => scenes.items.find(item => item.source_number === id).scenes.find(scene => pattern.test(scene.label));
const configFor = (id, scene, variant) => buildEffectiveConfig({id,mode:'scenes',sceneIndex:scenes.items.find(item => item.source_number === id).scenes.indexOf(scene),variant,sceneVariant:null,comparisonVariant:variant,params:{duration:1800}});

test('subject comparison leaves original scene/type pairings unchanged', () => {
  for (const [id, pattern] of [[17,/英文/],[41,/价格/],[51,/作品/]]) {
    const scene = sceneFor(id,pattern);
    assert.ok(scene);
    assert.deepEqual(compatibleVariants(id,scene),[]);
    assert.ok(comparisonVariants(id,scene).length > 1);
  }
  assert.deepEqual(compatibleVariants(11,sceneFor(11,/产品/)),[0]);
});

test('comparison keeps source subject, selected type and generated instructions aligned', () => {
  for (const [id,pattern,variants,required,forbidden] of [
    [17,/英文/,[1,2,3,4],/英文/,/八个字|四个关键词/],
    [36,/汽车/,[2,3],/汽车/,/相机模型|立体相机/],
    [41,/价格/,[0,1,2,3,4],/价格|月付|年付/,/产品概览|规格参数|使用建议/],
    [51,/作品/,[0,1,2,3,4],/作品/,/工作台|设置页/],
  ]) {
    const scene = sceneFor(id,pattern);
    for (const variant of variants) {
      const config = configFor(id,scene,variant);
      assert.equal(config.scene.id,scene.id);
      assert.equal(config.variant.index,variant);
      assert.equal(config.renderVariant,variant);
      const prompt = generateIntegratedPrompt(`M${String(id).padStart(2,'0')}`,config,config.parameters);
      assert.match(prompt,required);
      assert.doesNotMatch(prompt,forbidden);
      assert.doesNotMatch(prompt,/undefined|NaN/);
    }
  }
});

test('semantic exceptions do not reuse an incompatible subject or autoplay context', () => {
  assert.ok(!comparisonVariants(36,sceneFor(36,/汽车/)).includes(1));
  assert.deepEqual(comparisonVariants(26,sceneFor(26,/汽车/)),[0,4]);
  assert.deepEqual(comparisonVariants(42,sceneFor(42,/商品/)),[]);
  const feedback = scenes.items.find(item => item.source_number === 55).scenes.find(scene => scene.ui === 'feedback');
  assert.deepEqual(comparisonVariants(55,feedback),[]);
});
