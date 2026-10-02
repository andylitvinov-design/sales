import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium,webkit} from 'playwright';

const base=(process.env.PSITRENDS_BASE_URL||'http://127.0.0.1:8878').replace(/\/$/,'');
const output=path.resolve(process.env.PSITRENDS_QA_OUTPUT||'reports/issue37-player-acceptance');
const engines=(process.env.PSITRENDS_QA_ENGINES||'chromium,webkit').split(',');
const cases=[['/','home','en'],['/ru/','home','ru'],['/consultations','services','en'],['/ru/consultations','services','ru'],['/about','homeopathy','en'],['/ru/about','homeopathy','ru']];
const results=[];
await fs.mkdir(output,{recursive:true});
const record=(engine,scenario,route,detail={})=>results.push({engine,scenario,route,status:'pass',...detail});
const countFrame=page=>page.locator('.page-video iframe').count();
const waitReady=page=>page.waitForFunction(()=>document.querySelector('[data-page-video-id]')?.disabled===false);
const geometry=page=>page.evaluate(()=>{
  const button=document.querySelector('[data-page-video-id]').getBoundingClientRect();
  const frame=document.querySelector('.page-video-frame').getBoundingClientRect();
  return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,buttonWidth:button.width,buttonHeight:button.height,frameWidth:frame.width,frameHeight:frame.height};
});
try {
  for(const engine of engines){
    assert.ok(['chromium','webkit'].includes(engine));
    const browser=await ({chromium,webkit}[engine]).launch({headless:true,...(engine==='chromium'&&process.env.PSITRENDS_CHROME_CHANNEL?{channel:process.env.PSITRENDS_CHROME_CHANNEL}:{})});
    try {
      const context=await browser.newContext();
      await context.route('https://app.heygen.com/embeds/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Synthetic player for control tests</title>'}));
      const page=await context.newPage();
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      let providerRequests=0;
      page.on('request',request=>{if(request.url().startsWith('https://app.heygen.com/'))providerRequests++;});
      for(const width of [320,430,768,1024])for(const [route] of cases){
        await page.setViewportSize({width,height:900});
        providerRequests=0;
        assert.equal((await page.goto(base+route)).status(),200);
        await waitReady(page);
        const sizes=await geometry(page);
        assert.ok(sizes.scroll<=sizes.viewport+1,`${engine} ${route} ${width} overflow`);
        assert.ok(sizes.buttonWidth>=44&&sizes.buttonHeight>=44);
        assert.ok(Math.abs(sizes.frameWidth/sizes.frameHeight-16/9)<0.04);
        assert.equal(await countFrame(page),0);
        assert.equal(providerRequests,0);
        record(engine,'layout-poster-only',route,{width,...sizes});
      }
      for(const [route,kind,locale] of cases){
        await page.setViewportSize({width:1024,height:900});
        await page.goto(base+route);await waitReady(page);
        const play=page.locator('[data-page-video-id]');
        const id=await play.getAttribute('data-page-video-id');
        for(const key of ['Enter','Space']){
          await play.focus();await page.keyboard.press(key);
          await page.locator('.page-video iframe').waitFor();
          assert.equal(await countFrame(page),1);
          assert.equal(await page.locator('.page-video iframe').getAttribute('src'),`https://app.heygen.com/embeds/${id}`);
          const close=page.locator('.page-video-close');await close.focus();await page.keyboard.press('Enter');
          assert.equal(await countFrame(page),0);
          assert.equal(await play.evaluate(el=>document.activeElement===el),true);
          record(engine,'keyboard-play-close',route,{key});
        }
        const summary=page.locator('.page-video-transcript summary');
        await summary.focus();await page.keyboard.press('Enter');
        assert.equal(await page.locator('.page-video-transcript').evaluate(el=>el.open),true);
        assert.equal(await page.locator('.page-video-transcript-copy').isVisible(),true);
        record(engine,'keyboard-transcript',route);
        const zoomContext=await browser.newContext({viewport:{width:512,height:450},deviceScaleFactor:2});
        try{
          const zoomPage=await zoomContext.newPage();
          await zoomPage.goto(base+route);await waitReady(zoomPage);
          const zoomSizes=await geometry(zoomPage);
          assert.ok(zoomSizes.scroll<=zoomSizes.viewport+1,`${engine} ${route} 200% equivalent reflow overflow`);
          await zoomPage.locator('.page-video-transcript summary').press('Enter');
          assert.equal(await zoomPage.locator('.page-video-transcript-copy').isVisible(),true);
          assert.equal(await zoomPage.locator('[data-page-video-id]').isVisible(),true);
          record(engine,'zoom-equivalent-reflow',route,{method:'1024x900 physical / 512x450 CSS viewport, deviceScaleFactor 2; not browser UI zoom',...zoomSizes});
        }finally{await zoomContext.close();}
        await summary.press('Enter');
        for(const width of [390,1440]){
          await page.setViewportSize({width,height:900});
          await page.locator('.page-video-section').scrollIntoViewIfNeeded();
          await page.locator('.page-video-poster').evaluate(async img=>{if(!img.complete)await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});});});
          const filename=`${engine}-${kind}-${locale}-${width}.png`;
          await page.screenshot({path:path.join(output,filename)});
          record(engine,'screenshot',route,{width,file:filename});
        }
      }
      assert.deepEqual(errors,[]);
      await context.close();
      for(const [route] of cases){
        const delayed=await browser.newContext({viewport:{width:390,height:900}});
        let release;
        const gate=new Promise(resolve=>{release=resolve;});
        await delayed.route('**/psitrends-client.js*',async request=>{await gate;await request.continue();});
        await delayed.route('https://app.heygen.com/embeds/**',request=>request.fulfill({contentType:'text/html',body:'<!doctype html><title>Synthetic delayed player</title>'}));
        const cold=await delayed.newPage();
        try{
          await cold.goto(base+route,{waitUntil:'commit'});
          const play=cold.locator('[data-page-video-id]');await play.waitFor();
          assert.equal(await play.isDisabled(),true);
          assert.equal(await play.getAttribute('aria-busy'),'true');
          await cold.locator('.page-video-transcript summary').click();
          assert.equal(await cold.locator('.page-video-transcript a').isVisible(),true);
          assert.equal(await countFrame(cold),0);
          release();await waitReady(cold);
          await play.click();await cold.locator('.page-video iframe').waitFor();
          assert.equal(await countFrame(cold),1);
          record(engine,'cold-delayed-js-first-click',route);
        } finally {release();await delayed.close();}
        const blocked=await browser.newContext();
        await blocked.route('https://app.heygen.com/embeds/**',request=>request.abort());
        // Share navigation is intercepted: this verifies fallback behavior, not provider availability.
        await blocked.route('https://app.heygen.com/share/**',request=>request.fulfill({contentType:'text/html',body:'<!doctype html><title>Share navigation destination test</title>'}));
        const fallback=await blocked.newPage();
        try{
          await fallback.goto(base+route);await waitReady(fallback);
          await fallback.locator('[data-page-video-id]').click();
          const link=fallback.locator('.page-video-caption > a.page-video-fallback');
          const href=await link.getAttribute('href');
          const popupPromise=fallback.waitForEvent('popup');await link.click();
          const popup=await popupPromise;await popup.waitForURL(href,{waitUntil:'domcontentloaded'});
          assert.equal(popup.url(),href);
          record(engine,'blocked-embed-share-navigation',route,{providerAvailability:'not tested; share destination intercepted'});
        } finally {await blocked.close();}
      }
    } finally {await browser.close();}
  }
} catch(error){
  results.push({status:'fail',error:error.message});
  process.exitCode=1;
} finally {
  const report={generatedAt:new Date().toISOString(),scope:'Static candidate UI acceptance only; synthetic embeds; no provider playback or submissions',engines,passed:results.filter(row=>row.status==='pass').length,failed:results.filter(row=>row.status==='fail').length,results};
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,passed:report.passed,failed:report.failed,last:results.at(-1)}));
}
