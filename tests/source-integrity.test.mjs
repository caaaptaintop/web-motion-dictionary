import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=name=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url),'utf8'));
const verified=read('tests/fixtures/source-integrity.json');
test('verified prompt and variant baselines retain complete unique identities',()=>{
 assert.equal(verified.original_prompts.length,73);assert.equal(new Set(verified.original_prompts.map(x=>x.id)).size,73);assert.equal(verified.variant_labels.length,325);assert.equal(verified.source_articles.length,3);
 for(const row of [...verified.original_prompts,...verified.variant_labels,...verified.source_articles])assert.match(row.sha256,/^[a-f0-9]{64}$/);
});
test('all original variant labels retain verified content and ordering',()=>{
 const source=read('src/source.json'),all=[...source.main_items,...source.trigger_items].flatMap(item=>item.variants);
 assert.equal(source.main_items.length,56);assert.deepEqual(source.main_items.map(item=>item.source_number),Array.from({length:56},(_,i)=>i+1));assert.equal(all.length,325);assert.deepEqual(all.map(v=>v.id),verified.variant_labels.map(v=>v.id));
 for(const [i,variant] of all.entries())assert.equal(createHash('sha256').update(variant.original_label,'utf8').digest('hex'),verified.variant_labels[i].sha256,variant.id);
});
