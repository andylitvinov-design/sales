import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {approvedVideos,videoPlacements,renderApprovedVideo} from './approved-videos.mjs';
import {render,routeFor} from './template.mjs';
import {pages,authorProfiles} from './content.mjs';
import {splitPage} from '../../scripts/build-joomla-client.mjs';
const expected={
 en:['ed202847a43a96b918308aa972177b34','48105a2f2228e7cb3a67391e97acaf8b','34df311e461509433b45929908a9097a'],
 ru:['388a04b39ebf215ae656bcd22d0d0847','79c2845577865979cd95ac40a08fc01a','0f984780d06948b1e78166e6e553e4e9']
};
const root=new URL('../../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
test('only six approved existing renders are registered, with faithful complete transcripts',()=>{
 for(const locale of ['en','ru']){
  assert.deepEqual(Object.values(approvedVideos[locale]).map(v=>v.id),expected[locale]);
  for(const video of Object.values(approvedVideos[locale])){
   assert.equal(video.transcript.length,4);
   assert.match(video.id,/^[a-f0-9]{32}$/);
  }
 }
 assert.equal(renderApprovedVideo('home','es'), '');
 assert.equal(renderApprovedVideo('events','en'), '');
 assert.match(approvedVideos.en.homeopathy.transcript.at(-1),/does not replace medical diagnosis or treatment/);
 assert.match(approvedVideos.ru.homeopathy.transcript.at(-1),/не заменяет медицинскую диагностику или лечение/);
});
test('one appropriate same-language player on exactly ten pages, no media auto-load',()=>{
 let count=0;
 for(const locale of ['en','ru'])for(const page of Object.keys(pages[locale])){
  const html=render(page,locale),body=splitPage(html).article;
  assert.equal((body.match(/data-approved-video="/g)||[]).length,videoPlacements[page]?1:0,`${locale}:${page}`);
  if(!videoPlacements[page])continue;
  count++;
  const video=approvedVideos[locale][videoPlacements[page]];
  assert.ok(body.includes(`data-approved-video="${video.id}"`));
  assert.ok(body.includes(`data-approved-video-locale="${locale}"`));
  assert.ok(body.includes(`approved-video-posters/${video.poster}`));
  const intro=renderApprovedVideo(page,locale,{asset:p=>p});
  assert.doesNotMatch(intro,/<iframe\b|<video\b|<script\b|autoplay|download_url|drive\.google\.com/i);
  assert.ok(body.includes('target="_blank" rel="noopener noreferrer"'));
  assert.match(body,/<details><summary>[^<]+<\/summary>/);
  if(page==='about'){
   assert.ok(body.indexOf(`data-approved-video="${video.id}"`)>body.indexOf(locale==='en'?'Taoist Alchemy':'Даосская алхимия'));
   assert.match(body,new RegExp(`https://holistichouse\\.vercel\\.app/${locale}/homeopathy`));
   for(const paragraph of authorProfiles[locale].narrative)assert.ok(body.includes(paragraph.replaceAll('&','&amp;').replaceAll('"','&quot;')));
  }
  assert.ok(routeFor(page,locale).startsWith(locale==='en'?'/':'/ru/'));
 }
 assert.equal(count,10);
});
test('real local posters match the archived 1.5-second frames',()=>{
 const directory=new URL('approved-video-posters/',import.meta.url);
 const manifest=JSON.parse(fs.readFileSync(new URL('sha256.json',directory)));
 assert.equal(Object.keys(manifest).length,6);
 for(const locale of ['en','ru'])for(const video of Object.values(approvedVideos[locale])){
  const bytes=fs.readFileSync(new URL(video.poster,directory));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.ok(bytes.length<65000);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest[video.poster]);
 }
});
test('native and static builders package local posters with consistent cache versions',()=>{
 assert.match(read('scripts/build-psitrends-client.mjs'),/approved-video-posters/);
 assert.match(read('scripts/build-joomla-client.mjs'),/approved-video-posters/);
 const native=read('integrations/joomla-client/template/index.php');
 for(const type of ['css','js'])assert.ok(native.includes(`psitrends-client.${type}?v=8`));
 const updater=read('integrations/joomla-client/update-client.php');
 assert.match(updater,/approved_poster_digest/);assert.match(updater,/posterDirectoryExisted/);assert.match(updater,/rmdir\(\$posterDirectory\)/);
});
test('intro handler is separate from YouTube review playback and keeps strict source validation',()=>{
 const js=read('psitrends-client.js');
 assert.match(js,/youtube-nocookie\.com\/embed/);
 assert.match(js,/allowed\.has\(id\)/);
 assert.match(js,/link\.getAttribute\('href'\)!==`https:\/\/app\.heygen\.com\/share\/\$\{id\}`/);
 assert.match(js,/event\.metaKey\|\|event\.ctrlKey/);
 assert.match(js,/frame\.remove\(\);close\.remove\(\);link\.hidden=false;link\.focus\(\)/);
 assert.doesNotMatch(js,/api\.heygen|HEYGEN_API_KEY|create_video/);
});
