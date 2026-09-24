import {chromium,devices} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {authorProfiles,pages} from './content.mjs';
import {routeFor} from './template.mjs';
const live=process.argv.includes('--live');
const stage=process.argv.includes('--stage');
const mode=live?'live':stage?'stage':'local';
const base=live?'https://psitrends.com':stage?'http://127.0.0.1:8881':'http://127.0.0.1:8879/sales';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({...width<768?devices['iPhone 13']:{},locale:'en-US',viewport:{width,height:1000},reducedMotion:'reduce'});
  await context.route(/googletagmanager|google-analytics|youtube-nocookie/,r=>r.abort());
  for(const locale of ['en','ru'])for(const key of (stage?['home','about']:Object.keys(pages[locale]))){
   const page=await context.newPage();
   const url=live||stage?base+routeFor(key,locale):`${base}/psitrends-client-${key}${locale==='ru'?'-ru':''}.html`;
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.locator('h1').waitFor();
   assert.equal(await page.locator('html').getAttribute('lang'),locale,`${locale}:${key} language`);
   const m=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,nav:document.querySelectorAll('#primary-nav a').length}));
   assert.equal(m.overflow,false,`${locale}:${key}:${width} overflow`);assert.equal(m.h1,1);assert.equal(m.nav,6);
   if(width<768){await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');}
   if(key==='about'){
    const profile=authorProfiles[locale];
    for(const text of [...profile.hero.intro,...profile.experience,...profile.studies.flat(),profile.tantricIntro,...profile.psychotherapy,profile.bodywork.intro,...profile.bodywork.schools,...profile.narrative])assert.ok((await page.locator('main').innerText()).includes(text),`${locale} biography: ${text}`);
    const order=await page.evaluate(()=>document.querySelector('#reviews').getBoundingClientRect().top>=document.querySelector('.author-profile').getBoundingClientRect().bottom);
    assert.ok(order);assert.equal(await page.locator('.review-video').count(),locale==='en'?21:41);assert.equal(await page.locator('.review-photo').count(),locale==='en'?13:37);
   }
   if(['about','home'].includes(key)){
    const photo=page.locator(key==='about'?'.portrait img':'.hero-portrait img');
    await photo.evaluate(img=>img.decode());
    const p=await photo.evaluate(img=>({url:img.src,w:img.clientWidth,h:img.clientHeight,nw:img.naturalWidth,nh:img.naturalHeight}));
    assert.ok(p.url.includes('andy-library-desk.png'));assert.ok(Math.abs(p.w/p.h-p.nw/p.nh)<0.01,`${key} photo aspect`);
    if([390,1440].includes(width))await page.screenshot({path:`reports/author-${mode}-${locale}-${key}-${width}.png`});
   }
   results.push({locale,key,width,...m});await page.close();
  }
  await context.close();
 }
 await fs.writeFile(`reports/author-profile-${mode}.json`,JSON.stringify({ok:true,checks:results.length,results},null,2));
 console.log(JSON.stringify({ok:true,checks:results.length,live}));
}finally{await browser.close();}
