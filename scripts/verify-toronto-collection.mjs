import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 const context = await browser.newContext();
 const page = await context.newPage();
 const receipts = [];
 page.on('response', async response => {
  const url = new URL(response.url());
  if (!url.hostname.endsWith('google-analytics.com') || !url.pathname.endsWith('/collect')) return;
  const request = response.request();
  const body = request.postData() || '';
  for (const line of body.split('\n')) {
   const params = new URLSearchParams(url.search);
   new URLSearchParams(line).forEach((v,k)=>params.set(k,v));
   receipts.push({status:response.status(),measurement:params.get('tid'),event:params.get('en'),page:params.get('dl'),referrer:params.get('dr'),landing:params.get('ep.landing_page'),method:params.get('ep.contact_method'),source:params.get('ep.acquisition_source')});
  }
 });
 await page.goto('https://sales-bwa-photo.pages.dev/hypnotherapy-toronto');
 await page.waitForTimeout(1000);
 assert.equal(receipts.length,0,'No Google collection before consent');
 await page.getByRole('button',{name:'Allow optional analytics',exact:true}).click();
 await page.waitForTimeout(5000);
 // Synthetic QA only: exercise the real listener, prevent leaving or contacting anyone.
 await page.locator('[data-contact="whatsapp"]').first().evaluate(el=>el.addEventListener('click',event=>event.preventDefault()));
 await page.locator('[data-contact="whatsapp"]').first().click();
 await page.waitForTimeout(6000);
 assert.ok(receipts.some(r=>r.event==='contact_click' && r.measurement==='G-Z4BGV9GP4N' && r.status===204));
 assert.equal(receipts.filter(r=>r.event==='contact_click').length,1);
 await page.getByRole('button',{name:'Keep analytics off',exact:true}).click();
 await page.waitForLoadState('load');
 const count=receipts.length;
 await page.waitForTimeout(1500);
 assert.equal(receipts.length,count);
 const evidence={checkedAt:new Date().toISOString(),synthetic:true,noMessageSent:true,receipts,passed:true};
 await writeFile('.codex/reports/2026-09-22/verification/ga4-receipt.json',JSON.stringify(evidence,null,2));
 console.log(JSON.stringify(evidence,null,2));
} finally { await browser.close(); }
