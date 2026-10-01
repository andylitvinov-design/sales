import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';

const base=(process.env.PSITRENDS_BASE_URL||'http://127.0.0.1:8877/output/psitrends-client').replace(/\/$/,'');
const cases=[
 ['/', 'home','en','ed202847a43a96b918308aa972177b34'],
 ['/ru/', 'home','ru','388a04b39ebf215ae656bcd22d0d0847'],
 ['/consultations', 'services','en','48105a2f2228e7cb3a67391e97acaf8b'],
 ['/ru/consultations', 'services','ru','79c2845577865979cd95ac40a08fc01a'],
 ['/about', 'homeopathy','en','34df311e461509433b45929908a9097a'],
 ['/ru/about', 'homeopathy','ru','0f984780d06948b1e78166e6e553e4e9'],
 ['/hypnotherapy-toronto', 'hypnotherapy','en','8c1634ce904434a91931429b6a7eefe1'],
 ['/systemic-constellations-toronto', 'constellations','en','7c6b243f048b9c0581ae29619a4a89fc'],
];

for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await type.launch({headless:true});
 try{
  const context=await browser.newContext();
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://app.heygen.com/embeds/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>synthetic embed</title>'}));
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});
   for(const [path,kind,locale,id] of cases){
    let heygenBefore=0;
    const listener=req=>{if(req.url().startsWith('https://app.heygen.com/'))heygenBefore++;};
    page.on('request',listener);
    const response=await page.goto(base+path,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200,`${engine} ${path}`);
    const section=page.locator(`[data-page-video-kind="${kind}"][data-page-video-locale="${locale}"]`);
    await section.waitFor({state:'visible'});
    const play=section.locator('[data-page-video-id]');
    await play.waitFor({state:'visible'});
    await page.waitForFunction(el=>!el.disabled,await play.elementHandle());
    assert.equal(await section.locator('iframe').count(),0,`${path} eager iframe`);
    assert.equal(heygenBefore,0,`${path} external provider before click`);
    const poster=await play.locator('img.page-video-poster').getAttribute('src');
    assert.match(poster,/approved-video-posters\/[^/]+\.webp$/);
    const metrics=await page.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth}));
    assert.ok(metrics.sw<=metrics.w+1,`${engine} ${path} overflow ${metrics.sw}>${metrics.w}`);
    await play.click();
    const iframe=section.locator('iframe.page-video-iframe');
    await iframe.waitFor({state:'attached'});
    assert.equal(await iframe.getAttribute('src'),`https://app.heygen.com/embeds/${id}`);
    assert.equal(await section.locator('iframe').count(),1);
    await section.locator('button.page-video-close').click();
    assert.equal(await section.locator('iframe').count(),0);
    page.off('request',listener);
   }
  }
  assert.deepEqual(errors,[],`${engine} page errors`);
  await context.close();
 } finally {await browser.close();}
}
console.log(JSON.stringify({ok:true,engines:['chromium','webkit'],videos:cases.length,widths:[390,1440]}));
