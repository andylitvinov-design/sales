// Local static preview only. External traffic is intercepted; no production writes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,webkit} from 'playwright';
import {approvedVideos,videoPlacements} from './approved-videos.mjs';
import {routeFor} from './template.mjs';
const origin=process.env.VIDEO_QA_ORIGIN||'http://127.0.0.1:8877';
if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(origin))throw new Error('Use an isolated localhost preview');
const evidence='reports/approved-videos';await fs.mkdir(evidence,{recursive:true});
const results=[];
for(const engine of [chromium,webkit]){
 const browser=await engine.launch({headless:true});
 try{
 for(const width of [390,1365])for(const locale of ['en','ru'])for(const pageKey of Object.keys(videoPlacements)){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
  const heygen=[],external=[];
  await context.route('**/*',async route=>{
   const url=route.request().url();
   if(url.startsWith(origin+'/'))return route.continue();
   if(url.startsWith('https://app.heygen.com/embeds/')){heygen.push(url);return route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="en"><title>Isolated player endpoint fixture</title><body>Player endpoint verified</body></html>'});}
   external.push(url);return route.abort();
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(origin+routeFor(pageKey,locale),{waitUntil:'networkidle'});assert.equal(response.status(),200);
  const video=approvedVideos[locale][videoPlacements[pageKey]],block=page.locator(`[data-approved-video="${video.id}"]`);
  assert.equal(await page.locator('[data-approved-video]').count(),1);
  await block.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.querySelectorAll('.approved-video img')].every(i=>i.complete&&i.naturalWidth>0));
  assert.deepEqual(heygen,[]);assert.equal(await block.locator('iframe').count(),0);
  assert.equal(await block.locator('details').getAttribute('open'),null);
  const size=await block.locator('.approved-video-frame').boundingBox();assert.ok(Math.abs(size.width/size.height-16/9)<0.03);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  // Avoid full-page screenshots of long review archives; inspect the actual new module in context.
  if(engine.name()==='chromium')await page.screenshot({path:`${evidence}/${pageKey}-${locale}-${width}.png`});
  await block.locator('[data-approved-play]').focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.approved-video-frame iframe'));
  assert.equal(await block.locator('iframe').getAttribute('src'),`https://app.heygen.com/embeds/${video.id}`);
  assert.equal(await block.locator('iframe').getAttribute('allow'),'encrypted-media; picture-in-picture; fullscreen');
  await block.locator('.approved-video-close').click();assert.equal(await block.locator('iframe').count(),0);
  assert.equal(await block.locator('[data-approved-play]').evaluate(el=>el===document.activeElement),true);
  await block.locator('summary').click();assert.ok((await block.locator('.approved-video-transcript').innerText()).includes(video.transcript.at(-1)));
  assert.deepEqual(errors,[]);
  results.push({browser:engine.name(),width,locale,page:pageKey,route:routeFor(pageKey,locale),videoId:video.id,iframeRequests:heygen.length,checks:'poster, language, no eager iframe, keyboard first click, exact source, close/focus, transcript, no overflow, no page errors',externalRequestsBlocked:external.length});
  await context.close();
 }
 // No-JS path remains a usable, safe link, rather than an inert fake button.
 const context=await browser.newContext({javaScriptEnabled:false});
 await context.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
 const page=await context.newPage();await page.goto(origin+'/');
 assert.equal(await page.locator('[data-approved-play]').getAttribute('href'),`https://app.heygen.com/share/${approvedVideos.en.home.id}`);
 assert.equal(await page.locator('.approved-video-frame iframe').count(),0);await context.close();
 }finally{await browser.close();}
}
await fs.writeFile(`${evidence}/browser-results.json`,JSON.stringify({mode:'local preview, external embed fixture; not native production',cases:results,passed:results.length,noJsFallback:true},null,2));
console.log(`PASS ${results.length} browser/viewport/language/route combinations and no-JS fallbacks`);
