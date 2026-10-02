import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium,webkit} from 'playwright';

const base=(process.env.PSITRENDS_BASE_URL||'http://127.0.0.1:8878').replace(/\/$/,'');
const engines=(process.env.PSITRENDS_QA_ENGINES||'chromium,webkit').split(',');
const liveRuntime=process.env.PSITRENDS_LIVE_RUNTIME==='1';
const runtime=readFileSync(new URL('../../psitrends-client.js',import.meta.url),'utf8');
const initializer=runtime.slice(runtime.indexOf('/* Approved page videos'),runtime.indexOf('\n})();',runtime.indexOf('/* Approved page videos'))+6);
const fixture=readFileSync(new URL('./fixtures/approved-method-v8.html',import.meta.url),'utf8');
for(const engine of engines){
  assert.ok(['chromium','webkit'].includes(engine));
  const browser=await ({chromium,webkit}[engine]).launch({headless:true,...(engine==='chromium'&&process.env.PSITRENDS_CHROME_CHANNEL?{channel:process.env.PSITRENDS_CHROME_CHANNEL}:{})});
  try{
    const context=await browser.newContext({locale:'en-US',viewport:{width:390,height:900}});
    await context.route('**/approved-video-posters/**',route=>route.abort());
    await context.route('https://app.heygen.com/embeds/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Synthetic legacy player</title>'}));
    const page=await context.newPage();
    await page.goto(base+'/hypnotherapy-toronto');
    const posterSrc=await page.locator('.page-video-poster').getAttribute('src');
    assert.match(posterSrc,/\/approved-video-posters\/hypnotherapy-en-v1\.webp$/);
    if(!liveRuntime){
      const resolved=fixture.replace('src="/psitrends-client-assets/approved-video-posters/hypnotherapy-en-v1.webp"',`src="${posterSrc}"`);
      await page.locator('[data-page-video-kind]').evaluate((section,html)=>{section.outerHTML=html;},resolved);
      await page.evaluate(code=>Function(code)(),initializer);
    }
    const play=page.locator('[data-page-video-id]');await play.scrollIntoViewIfNeeded();
    const placeholder=page.locator('.page-video-placeholder');await placeholder.waitFor({state:'visible'});
    assert.equal(await placeholder.innerText(),'How I Work with Hypnotherapy');
    assert.equal(await placeholder.locator('img,iframe').count(),0);
    assert.equal(await play.isEnabled(),true);
    // An ordinary pointer click must reach the legacy button despite the failed poster.
    await play.click({timeout:2500});
    assert.equal(await page.locator('.page-video iframe').count(),1);
    assert.equal(await page.locator('.page-video iframe').getAttribute('src'),'https://app.heygen.com/embeds/8c1634ce904434a91931429b6a7eefe1');
    await page.locator('.page-video-close').click();
    assert.equal(await page.locator('.page-video iframe').count(),0);
    assert.equal(await play.evaluate(el=>document.activeElement===el),true);
    assert.equal(await placeholder.isVisible(),true);
    console.log(JSON.stringify({engine,scenario:'legacy-poster-failure',runtime:liveRuntime?'actual served markup/runtime; no injection':'baseline fixture plus source initializer',status:'pass',placeholder:'local text',play:'ordinary pointer click',provider:'synthetic exact iframe',close:'removed and focus restored'}));
    await context.close();
  }finally{await browser.close();}
}
