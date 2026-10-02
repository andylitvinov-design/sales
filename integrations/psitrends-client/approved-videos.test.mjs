import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {APPROVED_PAGE_VIDEOS, getApprovedPageVideo, renderApprovedPageVideo} from './approved-videos.mjs';
import * as videoModule from './approved-videos.mjs';
import {render} from './template.mjs';

const expected = [
  ['home','en','ed202847a43a96b918308aa972177b34','home-en-v2.webp','8f1ae79ad0764324cbf6023db4761a8ff4e9c55c0a085259beccd671cae4da04'],
  ['home','ru','388a04b39ebf215ae656bcd22d0d0847','home-ru-v1.webp','2d17a8df9b325272d4c1049cb7757733a00fbafed652b49ffdd0bdf68bc8b794'],
  ['services','en','48105a2f2228e7cb3a67391e97acaf8b','services-en-v2.webp','eba5a152b8fba5293b6046f8569205cafb641c852709f284893308b6846fdad6'],
  ['services','ru','79c2845577865979cd95ac40a08fc01a','services-ru-v1.webp','b0c25264bd03966fea4a07e2b654a5d12dc2066dd4fe91845facc06352257819'],
  ['homeopathy','en','34df311e461509433b45929908a9097a','homeopathy-en-v2.webp','9b2386a700b110249f285ff14d01c692e315a312083b46eab59b99930b0c6261'],
  ['homeopathy','ru','0f984780d06948b1e78166e6e553e4e9','homeopathy-ru-v1.webp','9c186803e5bfed18f3eecac5c4be3cf8fb90c24a1821b1315ab6adf67f31f335'],
  ['hypnotherapy','en','8c1634ce904434a91931429b6a7eefe1','hypnotherapy-en-v1.webp','fa1ec9b1769fd460664c2172670c11e4f5628f91d16a450c64be144fae973395'],
  ['constellations','en','7c6b243f048b9c0581ae29619a4a89fc','constellations-en-v1.webp','dcc44198296eff227e16d5645d4b5c01d8217915d204515fd2f25afa9417fc21'],
];

test('approved manifest is exactly eight immutable page videos',()=>{
  const actual=[];
  for(const [kind,localized] of Object.entries(APPROVED_PAGE_VIDEOS))for(const [locale,video] of Object.entries(localized))actual.push([kind,locale,video.heygenId,video.poster]);
  assert.equal(actual.length,8);
  assert.equal(new Set(actual.map(x=>x[2])).size,8);
  for(const [kind,locale,id,poster] of expected){
    const v=getApprovedPageVideo(kind,locale);
    assert.equal(v.heygenId,id);
    assert.equal(v.poster,poster);
    assert.ok(v.transcript.length>80);
  }
  assert.throws(()=>getApprovedPageVideo('hypnotherapy','ru'));
  assert.throws(()=>getApprovedPageVideo('unknown','en'));
});

test('all eight posters are exact reviewed local WebPs',()=>{
  for(const [, , ,poster,hash] of expected){
    const bytes=readFileSync(new URL(`./approved-video-posters/${poster}`,import.meta.url));
    assert.equal(bytes.subarray(0,4).toString(),'RIFF');
    assert.equal(bytes.subarray(8,12).toString(),'WEBP');
    assert.equal(createHash('sha256').update(bytes).digest('hex'),hash,poster);
  }
});

test('renderer is passive before JS and never emits Drive or eager iframe',()=>{
  const html=renderApprovedPageVideo('home','en',{asset:p=>`/assets/${p}`,escape:s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;')});
  assert.match(html,/data-page-video-id="ed202847a43a96b918308aa972177b34"/);
  assert.match(html,/<button[^>]*disabled[^>]*aria-busy="true"/);
  assert.match(html,/approved-video-posters\/home-en-v2\.webp/);
  assert.match(html,/app\.heygen\.com\/share\/ed202847a43a96b918308aa972177b34/);
  assert.doesNotMatch(html,/<iframe|drive\.google\.com|\.mp4/);
});

test('videos appear only on their intended EN/RU pages',()=>{
  const enHome=render('home','en'),ruHome=render('home','ru');
  const enConsult=render('consultations','en'),ruConsult=render('consultations','ru');
  const enAbout=render('about','en'),ruAbout=render('about','ru');
  const enHyp=render('hypnotherapy','en'),ruHyp=render('hypnotherapy','ru');
  const enCon=render('constellations','en'),ruCon=render('constellations','ru');
  assert.match(enHome,/ed202847a43a96b918308aa972177b34/);assert.doesNotMatch(enHome,/48105a2f2228e7cb3a67391e97acaf8b/);
  assert.match(ruHome,/388a04b39ebf215ae656bcd22d0d0847/);assert.doesNotMatch(ruHome,/79c2845577865979cd95ac40a08fc01a/);
  assert.match(enConsult,/48105a2f2228e7cb3a67391e97acaf8b/);assert.match(ruConsult,/79c2845577865979cd95ac40a08fc01a/);
  assert.match(enAbout,/34df311e461509433b45929908a9097a/);assert.match(enAbout,/holistichouse\.vercel\.app\/en\/homeopathy/);
  assert.match(ruAbout,/0f984780d06948b1e78166e6e553e4e9/);assert.match(ruAbout,/holistichouse\.vercel\.app\/ru\/homeopathy/);
  assert.match(enHyp,/8c1634ce904434a91931429b6a7eefe1/);assert.doesNotMatch(ruHyp,/8c1634ce904434a91931429b6a7eefe1/);
  assert.match(enCon,/7c6b243f048b9c0581ae29619a4a89fc/);assert.doesNotMatch(ruCon,/7c6b243f048b9c0581ae29619a4a89fc/);
  for(const [key,html] of [['academy',render('academy','en')],['events',render('events','en')],['projects',render('projects','en')],['contact',render('contact','en')]]){
    for(const [, ,id] of expected) assert.doesNotMatch(html,new RegExp(id),key);
  }
});

test('about homeopathy context occurs after Taoist Alchemy and before Tantric workshops',()=>{
  for(const locale of ['en','ru']){
    const html=render('about',locale);
    const tao=html.indexOf(locale==='en'?'Taoist Alchemy':'Даосская алхимия');
    const video=html.indexOf(locale==='en'?'Homeopathy resources at Holistic House':'Материалы по гомеопатии в Holistic House');
    const tantric=html.indexOf(locale==='en'?'Tantric workshops':'Тантрические семинары');
    assert.ok(tao>=0&&video>tao&&tantric>video,{locale,tao,video,tantric});
  }
});

test('page-video JS stays separate from legacy testimonials and uses source-derived page tuples',()=>{
  const js=readFileSync(new URL('../../psitrends-client.js',import.meta.url),'utf8');
  assert.match(js,/querySelectorAll\('\[data-video\]'\)/);
  assert.equal(videoModule.browserApprovedPageVideoTuples?.length,8);
  for(const [kind,locale,id] of expected){
    const tuple=videoModule.browserApprovedPageVideoTuples.find(v=>v.kind===kind&&v.locale===locale);
    assert.equal(tuple.id,id);
    assert.equal(tuple.page,({services:'consultations',homeopathy:'about'})[kind]||kind);
    assert.equal(tuple.embed,`https://app.heygen.com/embeds/${id}`);
  }
  assert.match(js,/PsiTrendsApprovedPageVideos/);
});

test('v3 controls have namespaced identity, passive fallback, and exact About context',()=>{
  const html=render('about','en');
  assert.match(html,/data-psitrends-page-video/);
  assert.match(html,/data-page-purpose="about"/);
  assert.match(html,/data-psitrends-page-video-play/);
  assert.match(html,/<noscript>/);
  assert.match(html,/<details[^>]*>[\s\S]*app\.heygen\.com\/share\//);
  assert.match(html,/opens in a new tab/);
  assert.match(html,/This video refers to the educational remedy library on Holistic House\./);
});
