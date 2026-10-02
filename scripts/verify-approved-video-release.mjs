import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {pages} from '../integrations/psitrends-client/content.mjs';
import {routeFor} from '../integrations/psitrends-client/template.mjs';
import {browserApprovedPageVideoTuples} from '../integrations/psitrends-client/approved-videos.mjs';

const baselineMode=process.argv.includes('--baseline');
const baselinePath='reports/issue37-public-before.json';
const baseline=baselineMode?null:JSON.parse(await readFile(baselinePath,'utf8'));
const origin='https://psitrends.com';
const agents={desktop:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',mobile:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'};
const attributes=(html,pattern,attr)=>[...html.matchAll(pattern)].map(m=>m[0].match(new RegExp(`${attr}="([^"]*)"`))?.[1]).filter(Boolean);
const results=[];
for(const [platform,agent] of Object.entries(agents))for(const locale of ['en','ru']) {
  for(const key of Object.keys(pages[locale]))for(const temperature of ['cold','warm']) {
    const path=routeFor(key,locale);
    const response=await fetch(origin+path,{headers:{'user-agent':agent,'accept-language':locale}});
    const html=await response.text();
    const entry={platform,locale,key,path,temperature,status:response.status,
      canonical:html.match(/rel="canonical" href="([^"]+)"/)?.[1],
      hreflang:[...html.matchAll(/<link[^>]*hreflang=[^>]*>/g)].map(x=>x[0]),
      title:html.match(/<title>(.*?)<\/title>/s)?.[1],
      h1:[...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gs)].map(x=>x[1]),
      versions:[...html.matchAll(/psitrends-client\.(?:css|js)\?v=(\d+)/g)].map(x=>x[1]),
      videos:attributes(html,/<button\b[^>]*data-page-video-id="[^"]+"[^>]*>/g,'data-page-video-id'),
      reviewIds:attributes(html,/<a\b[^>]*data-video="[^"]+"[^>]*>/g,'data-video'),
      reviewPhotos:attributes(html,/<a\b[^>]*class="review-photo"[^>]*>/g,'href'),
      nav:html.match(/<nav\b[^>]*id="primary-nav"[\s\S]*?<\/nav>/)?.[0],
      headers:Object.fromEntries(['content-security-policy','content-security-policy-report-only','cache-control','age','vary','x-cache'].map(h=>[h,response.headers.get(h)])),
    };
    assert.equal(response.status,200,path);
    assert.equal(entry.canonical,origin+path,`canonical ${path}`);
    assert.equal(entry.h1.length,1,path);
    assert.ok(entry.hreflang.length>=2,path);
    assert.doesNotMatch(html,/<meta[^>]+name="robots"[^>]+noindex/);
    if(!baselineMode) {
      const prior=baseline.results.find(r=>r.platform===platform&&r.path===path&&r.temperature===temperature);
      assert.ok(prior,`baseline ${path}`);
      for(const field of ['title','canonical','hreflang','h1','reviewIds','reviewPhotos','nav'])assert.deepEqual(entry[field],prior[field],`${path} preserved ${field}`);
      assert.deepEqual(entry.versions,['9','9'],`${path} ${platform} ${temperature} v9`);
      const video=browserApprovedPageVideoTuples.find(v=>v.page===key&&v.locale===locale);
      assert.deepEqual(entry.videos,video?[video.id]:[],`${path} exact instance`);
    }
    results.push(entry);
  }
}
await mkdir('reports',{recursive:true});
const report={checkedAt:new Date().toISOString(),mode:baselineMode?'baseline':'verified',results};
await writeFile(baselineMode?baselinePath:'reports/issue37-public-after.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({ok:true,mode:report.mode,checks:results.length,paths:18,desktopAndMobile:true,coldAndWarm:true}));
