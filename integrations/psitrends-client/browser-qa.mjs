import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {pages} from './content.mjs';
import {routeFor,sourceName} from './template.mjs';
const baseUrl=process.env.PSITRENDS_BASE_URL??'http://127.0.0.1:8877';
// QA inventory: 12 pages, EN/RU navigation, CTA presence, FAQ disclosure,
// keyboard focus, 320/390/1440px overflow, preview denial, production consent,
// unsafe URL attribution denial, withdrawal, and no outbound messages.
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try{
 assert.equal(spawnSync(process.execPath,['scripts/build-psitrends-client.mjs']).status,0);
 const context=await browser.newContext();
 const page=await context.newPage();
 const unexpected=[];
 page.on('request',r=>{if(!r.url().startsWith(`${baseUrl}/`)&&!r.url().startsWith('data:'))unexpected.push(r.url());});
 for(const locale of (process.argv.includes('--production-only')?[]:['en','ru']))for(const key of Object.keys(pages[locale])){
  const name=sourceName(key,locale);
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:width===1440?900:844});
   await page.goto(`${baseUrl}/sales/${name}.html`);
   await page.emulateMedia({reducedMotion:'reduce'});
   if(key==='about'){
    await page.locator('.author-explore').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>[...document.images].every(image=>image.complete&&image.naturalWidth>0));
   }
   const metrics=await page.evaluate(()=>{
    const cta=document.querySelector('.hero .button');
    const profile=document.querySelector('.author-profile');
    const reviews=document.querySelector('.author-reviews');
    const reading=document.querySelector('.reading-column');
    return {overflow:document.documentElement.scrollWidth>innerWidth,heroBottom:document.querySelector('.hero').getBoundingClientRect().bottom,ctaBottom:cta?.getBoundingClientRect().bottom??null,headingCount:document.querySelectorAll('h1').length,language:document.documentElement.lang,images:[...document.images].every(x=>x.complete&&x.naturalWidth>0),authorProfile:Boolean(profile),readingWidth:reading?.getBoundingClientRect().width??0,reviewsAfterProfile:Boolean(profile&&reviews&&reviews.getBoundingClientRect().top>=profile.getBoundingClientRect().bottom)};
   });
   assert.equal(metrics.overflow,false,`${name} width${width}`); assert.equal(metrics.headingCount,1,`${name} h1 count`);assert.equal(metrics.language,locale,`${name} locale`);assert.equal(metrics.images,true,`${name} images width${width}`);
   if(key==='about'){
    assert.equal(metrics.authorProfile,true,`${name} author profile exists`);
    assert.ok(metrics.readingWidth<=800,`${name} reading measure`);
    assert.equal(metrics.reviewsAfterProfile,true,`${name} reviews follow biography`);
   }else assert.ok(metrics.ctaBottom<844,`${name} CTA must be reachable in first screen`);
   if(width===1440)assert.ok(metrics.heroBottom<=900);
   results.push({name,width,...metrics});
   if(width!==320)await page.screenshot({path:`reports/${name}-${width===1440?'desktop':`${width}-mobile`}-full.png`,fullPage:true});
  }
  await page.locator('#analytics-choice summary').click();
  await page.locator('[data-analytics="allow"]').click();
  assert.equal(await page.evaluate(()=>typeof window.gtag),'undefined');
  assert.equal(await page.evaluate(()=>localStorage.getItem('psitrends-analytics-consent')),null);
  const switchHref=await page.locator('.language').getAttribute('href');
  await page.locator('.language').click();
  assert.equal(new URL(page.url()).pathname.replace(/\/$/,''),new URL(switchHref,baseUrl).pathname.replace(/\/$/,''));
 }
 assert.deepEqual(unexpected,[],'preview must emit no external requests');
 await page.goto(`${baseUrl}/sales/psitrends-client-hypnotherapy.html`);
 await page.locator('.faq summary').first().click();
 assert.equal(await page.locator('.faq details').first().getAttribute('open'),'');
 await page.keyboard.press('Tab');
 assert.notEqual(await page.evaluate(()=>document.activeElement.tagName),'BODY');
 await context.close();
 // Intercept the production origin entirely from disk; no live production request.
 assert.equal(spawnSync(process.execPath,['scripts/build-psitrends-client.mjs','--production']).status,0);
 const prod=await browser.newContext();let vendors=0;
 await prod.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname!=='psitrends.com'){vendors++;return route.fulfill({status:200,contentType:'application/javascript',body:''});}
  const relative=u.pathname.startsWith('/psitrends-client-assets/')?u.pathname.slice(1):`${u.pathname.slice(1).replace(/\/$/,'')}/index.html`;
  const file=relative==='/index.html'?'index.html':relative;
  const contentType=file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.jpg')?'image/jpeg':'text/html';
  await route.fulfill({status:200,contentType,body:await fs.readFile(`output/psitrends-client/${file}`)});
 });
 const p=await prod.newPage();p.setDefaultTimeout(15000);console.log('Testing production consent with local interception');await p.goto('https://psitrends.com/hypnotherapy-toronto');
 assert.equal(vendors,0);await p.locator('#analytics-choice summary').click();await p.locator('[data-analytics="allow"]').click();
 await p.waitForTimeout(100);assert.equal(vendors,1);
 // Exercise the handler without navigating to a contact service or sending a message.
 await p.evaluate(()=>{const a=document.querySelector('[data-contact="whatsapp"]');a.addEventListener('click',e=>e.preventDefault());a.click();});
 const event=await p.evaluate(()=>window.dataLayer.map(x=>Array.from(x)).find(x=>x[0]==='event'));
 assert.equal(event[2].landing_page,'/hypnotherapy-toronto');assert.equal(event[2].contact_method,'whatsapp');
 await p.locator('[data-analytics="deny"]').click();await p.waitForLoadState();
 assert.equal(await p.evaluate(()=>localStorage.getItem('psitrends-analytics-consent')),'denied');
 await p.goto('https://psitrends.com/hypnotherapy-toronto?email=private');await p.locator('#analytics-choice summary').click();await p.locator('[data-analytics="allow"]').click();
 assert.equal(await p.evaluate(()=>typeof window.gtag),'undefined');
 await p.evaluate(()=>localStorage.setItem('psitrends-analytics-consent','granted'));
 await p.locator('[data-analytics="deny"]').click();
 assert.equal(await p.evaluate(()=>localStorage.getItem('psitrends-analytics-consent')),'denied','withdrawal must persist even on a URL excluded from collection');
 await prod.close();
 await fs.writeFile(process.argv.includes('--production-only')?'reports/psitrends-client-production-consent.json':'reports/psitrends-client-functional.json',JSON.stringify({ok:true,previewExternalRequests:unexpected,viewports:results,productionNetworkIntercepted:true},null,2));
 console.log(JSON.stringify({ok:true,viewportChecks:results.length,previewExternalRequests:unexpected.length}));
}finally{
 await Promise.race([browser.close(),new Promise(resolve=>setTimeout(resolve,5000))]);spawnSync(process.execPath,['scripts/build-psitrends-client.mjs']);
}
