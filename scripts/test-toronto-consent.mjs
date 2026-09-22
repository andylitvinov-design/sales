import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser = await chromium.launch({headless:true,channel:"chrome"});
try {
for (const query of ['', '?utm_source=google&utm_medium=organic&utm_campaign=gbp', '?email=private@example.test']) {
 const context = await browser.newContext();
 const page = await context.newPage();
 const google = [];
 await page.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.hostname === 'sales-bwa-photo.pages.dev') {
   const file = url.pathname.endsWith('.js') ? url.pathname.slice(1) : 'hypnotherapy-toronto.html';
   await route.fulfill({contentType:file.endsWith('.js')?'text/javascript':'text/html',body:await readFile(file,'utf8')});
  } else { if (url.hostname.includes('googletagmanager')) google.push(url.href); await route.abort(); }
 });
 await page.goto(`https://sales-bwa-photo.pages.dev/hypnotherapy-toronto${query}`);
 assert.equal(google.length,0,'Google must remain unloaded before consent');
 await page.getByRole('button',{name:'Allow optional analytics',exact:true}).click();
 const isSafe = !query.includes('email');
 await page.waitForTimeout(100);
 assert.equal(google.length,isSafe?1:0);
 if (isSafe) {
  await page.locator('[data-contact="whatsapp"]').first().evaluate(el=>el.addEventListener('click',e=>e.preventDefault()));
  await page.locator('[data-contact="whatsapp"]').first().click();
  const events = await page.evaluate(()=>window.dataLayer.map(x=>Array.from(x)).filter(x=>x[0]==='event'));
  assert.equal(events.length,1);
  assert.equal(events[0][1],'contact_click');
  assert.equal(events[0][2].contact_method,'whatsapp');
  assert.equal(events[0][2].send_to,'G-Z4BGV9GP4N');
  assert.ok(!JSON.stringify(events).includes('text='));
  await page.getByRole('button',{name:'Keep analytics off',exact:true}).click();
  await page.waitForLoadState('load');
  assert.equal(await page.evaluate(()=>localStorage.getItem('psitrends-analytics-consent')),'denied');
  assert.equal(google.length,1,'Revocation reload must not reload Google');
 }
 await context.close();
 console.log(`PASS consent, privacy and CTA: ${query || 'clean URL'}`);
}
} finally { await browser.close(); }
