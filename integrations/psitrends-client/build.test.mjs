import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

test('allowlisted bilingual build is preview-safe and production metadata is explicit', () => {
  assert.ok(existsSync('scripts/build-psitrends-client.mjs'), 'builder must exist');
  const built = spawnSync(process.execPath, ['scripts/build-psitrends-client.mjs'], {encoding:'utf8'});
  assert.equal(built.status,0,built.stderr);
  const manifest=JSON.parse(readFileSync('output/psitrends-client/manifest.json'));
  assert.equal(manifest.routes.length,14);
  assert.equal(manifest.mode,'preview');
  for(const route of manifest.routes){
    const page=readFileSync(`output/psitrends-client/${route.file}`,'utf8');
    assert.match(page,/noindex, nofollow/);
    assert.match(page,/data-analytics-mode="off"/);
    assert.doesNotMatch(page,/src="https:\/\/(www.googletagmanager|static.cloudflareinsights)/);
    assert.equal((page.match(/<h1>/g)||[]).length,1);
    assert.match(page,/data-contact="whatsapp"/);
    if(route.locale==='ru')assert.match(page,/<html lang="ru"/);
  }
  const prod = spawnSync(process.execPath,['scripts/build-psitrends-client.mjs','--production'],{encoding:'utf8'});
  assert.equal(prod.status,0,prod.stderr);
  const page=readFileSync('output/psitrends-client/hypnotherapy-toronto/index.html','utf8');
  assert.match(page,/rel="canonical" href="https:\/\/psitrends.com\/hypnotherapy-toronto"/);
  assert.match(page,/hreflang="ru-RU" href="https:\/\/psitrends.com\/ru\/hypnotherapy-toronto"/);
  assert.doesNotMatch(page,/noindex/);
  // Return deployable working output to its safe default after checking opt-in.
  assert.equal(spawnSync(process.execPath,['scripts/build-psitrends-client.mjs']).status,0);
});
