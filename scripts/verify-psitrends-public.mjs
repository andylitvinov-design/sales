import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

// Public, cookie-free probes. Do not replace the real-mobile UA with viewport emulation.
const origin='https://psitrends.com';
const agents={desktop:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',mobile:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'};
const paths=['/','/hypnotherapy-toronto','/systemic-constellations-toronto','/about','/academy','/contact'];
const results=[];
for(const [platform,agent] of Object.entries(agents)){
 for(const lang of ['en','ru'])for(const path of paths){
  const route=(lang==='ru'?'/ru':'')+path;
  const response=await fetch(origin+route,{headers:{'user-agent':agent,'accept-language':lang}});
  const html=await response.text();
  assert.equal(response.status,200,route);
  assert.match(html,/psitrends-client\.css\?v=2/);
  assert.doesNotMatch(html,/templates\/tx_valley|GTM-K2KKDZD/);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);
  assert.equal((html.match(/class="menu-toggle"/g)||[]).length,1,route);
  assert.ok(html.includes(`rel="canonical" href="${origin+route}"`),`canonical ${route}`);
  assert.ok((html.match(/hreflang=/g)||[]).length>=2,`hreflang ${route}`);
  assert.doesNotMatch(html,/<meta[^>]+name="robots"[^>]+noindex/);
  if(path==='/')assert.match(html,lang==='ru'?/Алхимия души/:/Alchemy of the Soul/);
  results.push({platform,route,status:response.status,canonical:origin+route,h1:html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]});
 }
}
const redirects=[];
for(const path of paths.slice(1,3))for(const suffix of ['', '/', '.html']){
 const url='https://sales-bwa-photo.pages.dev'+path+suffix+'?utm_source=google&utm_medium=organic&utm_campaign=gbp';
 const response=await fetch(url,{redirect:'manual'});
 assert.equal(response.status,301,url);
 const target=new URL(response.headers.get('location'),url);
 assert.equal(target.origin,origin);
 assert.equal(target.pathname,path);
 assert.equal(target.search,'?utm_source=google&utm_medium=organic&utm_campaign=gbp');
 const final=await fetch(target,{headers:{'accept-language':'en'}});
 assert.equal(final.status,200);
 redirects.push({source:url,status:301,target:target.href,finalStatus:200});
}
const sitemap=await fetch(origin+'/sitemap.xml');assert.equal(sitemap.status,200);
const xml=await sitemap.text();assert.equal((xml.match(/<loc>/g)||[]).length,12);
const robots=await fetch(origin+'/robots.txt');assert.equal(robots.status,200);
assert.match(await robots.text(),/Sitemap:\s*https:\/\/psitrends.com\/sitemap.xml/i);
const report={verifiedAt:new Date().toISOString(),routes:results,redirects,sitemapUrls:12,robots:200};
await fs.mkdir('reports/psitrends-redesign',{recursive:true});
await fs.writeFile('reports/psitrends-redesign/public-regression.json',JSON.stringify(report,null,2)+'\n');
console.log(`${results.length} desktop/mobile EN/RU route checks, ${redirects.length} UTM-preserving redirects, sitemap and robots passed`);
