import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const script = new URL('../../scripts/build-joomla-client.mjs', import.meta.url);
async function adapter() {
  assert.equal(await fs.access(script).then(()=>true,()=>false), true, 'Native adapter must exist');
  return import(script);
}
test('adapter emits fourteen native article bodies and preserves home assignments', async()=>{
  const {build}=await adapter();
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'joomla-client-test-'));
  try {
    const result=await build({destination:directory,zip:false});
    assert.equal(result.pages,14);
    const plan=JSON.parse(await fs.readFile(path.join(directory,'migration-plan.json'),'utf8'));
    assert.equal(plan.mode,'plan-only');
    assert.deepEqual(plan.preserveMenuIds,[101]);
    assert.equal(plan.pages.find(p=>p.key==='en:home').menu.reuseId,202);
    assert.equal(plan.pages.find(p=>p.key==='ru:home').menu.reuseId,204);
    assert.equal(plan.pages.filter(p=>p.menu.action==='create-after-collision-check').length,12);
    for(const page of plan.pages){
      const body=await fs.readFile(path.join(directory,page.article.bodyFile),'utf8');
      assert.match(body,/<h1>/);
      if(['en:home','ru:home','en:about','ru:about'].includes(page.key))assert.match(body,/src="\/media\/templates\/site\/psitrends_client\/assets\/andy-library-desk\.png"/);
      if(['en:about','ru:about'].includes(page.key)){
        assert.match(body,/Let me introduce myself\.|Позвольте представиться\./);
        assert.match(body,/Testimonials|Отзывы/);
      }
      assert.doesNotMatch(body,/<(?:html|head|header|footer|script)\b/i);
      assert.match(page.canonical,/^https:\/\/psitrends\.com\//);
      assert.equal(page.article.state,0);
    }
    const xml=await fs.readFile(path.join(directory,'template/templateDetails.xml'),'utf8');
    assert.match(xml,/type="template"/);
    assert.match(xml,/default="preview"/);
    const entry=await fs.readFile(path.join(directory,'template/index.php'),'utf8');
    assert.match(entry,/<jdoc:include type="component"/);
    assert.match(entry,/psitrends-client\.css\?v=7/);
    assert.match(entry,/psitrends-client\.js\?v=7/);
    assert.doesNotMatch(entry,/GTM-|googletagmanager\.com|type="scripts"|type="head"/);
    const routes=JSON.parse(await fs.readFile(path.join(directory,'template/pages.json'),'utf8'));
    assert.equal(Object.keys(routes).length,14);
    assert.match(routes['en:home'].before,/<header/);
    assert.match(routes['en:home'].after,/analytics-choice/);
    assert.match(routes['en:home'].before,/href="\/ru\/"/);
    assert.match(routes['ru:home'].before,/class="language" href="\/en\/"/);
    assert.match(routes['ru:about'].before,/class="language" href="\/en\/about"/);
    assert.match(routes['ru:events'].before,/class="language" href="\/en\/events"/);
    assert.equal(routes['en:home'].canonical,'https://psitrends.com/');
    assert.match(routes['ru:home'].before,/class="brand" href="\/ru\/"/);
    assert.doesNotMatch(routes['en:home'].before,/<main/);
    assert.match(await fs.readFile(path.join(directory,'template/media/assets/psitrends-client.js'),'utf8'),/contact_click/);
    assert.equal(await fs.access(path.join(directory,'template/media/assets/events/2014-magic-workshop/07.jpg')).then(()=>true,()=>false),true);
    const append=JSON.parse(await fs.readFile(path.join(directory,'events-append/migration-plan.json'),'utf8'));
    assert.equal(append.mode,'append-existing-template-plan-only');
    assert.deepEqual(append.pages.map(page=>page.key),['en:events','ru:events']);
    for(const page of append.pages)assert.equal(await fs.access(path.join(directory,'events-append',page.article.bodyFile)).then(()=>true,()=>false),true);
  } finally {await fs.rm(directory,{recursive:true,force:true});}
});
test('extractor rejects ambiguous or executable article markup', async()=>{
  const {splitPage}=await adapter();
  assert.throws(()=>splitPage('<body><main id="main">a</main><main id="main">b</main></body>'));
  assert.throws(()=>splitPage('<body><main id="main"><script>alert(1)</script></main></body>'));
});
