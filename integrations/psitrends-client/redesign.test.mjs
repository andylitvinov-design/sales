import test from 'node:test';
import assert from 'node:assert/strict';
import {render,routeFor} from './template.mjs';

test('English is the canonical default homepage route',()=>{
 assert.equal(routeFor('home','en'),'/');
 assert.equal(routeFor('home','ru'),'/ru/');
});

for (const locale of ['en','ru']) {
 test(`${locale} homepage is an editorial, human-led journey without emoji arrows`,()=>{
  const html=render('home',locale);
  assert.match(html,/class="hero-visual"/);
  assert.match(html,/class="author-note\b/);
  for(const chapter of ['consultations','training','workshops']) assert.match(html,new RegExp(`path-chapter--${chapter}`));
  assert.match(html,/photo_2023-01-27_06-22-45\.jpg/);
  assert.doesNotMatch(html,/[↗↓]/);
  assert.ok((html.match(/class="link-arrow/g)||[]).length>=8);
 });
 test(`${locale} homepage presents three distinct paths`,()=>{
  const html=render('home',locale);
  for(const id of ['consultations','training','workshops']) assert.ok(html.includes(`id="${id}"`),id);
  assert.match(html,locale==='en'?/Alchemy of the Soul/:/Алхимия души/);
  assert.match(html,/Reiki Yggdrasil/);
 });
 test(`${locale} client pages have one accessible mobile menu and compact language switch`,()=>{
  for(const key of ['home','hypnotherapy','constellations','about','academy','contact']) {
   const html=render(key,locale);
   assert.equal((html.match(/class="menu-toggle"/g)||[]).length,1);
   assert.match(html,/aria-controls="primary-nav" aria-expanded="false"/);
   const controls=html.match(/<div class="header-controls">([\s\S]*?)<button class="menu-toggle"/)?.[1]||'';
   assert.ok(controls.indexOf('>RU<')<controls.indexOf('>EN<'),'language order is always RU then EN');
   if(locale==='en'){
    assert.match(controls,/<a class="language"[^>]*>RU<\/a><span class="language current-language"[^>]*aria-current="page"[^>]*>EN<\/span>/);
   }else{
    assert.match(controls,/<span class="language current-language"[^>]*aria-current="page"[^>]*>RU<\/span><a class="language"[^>]*>EN<\/a>/);
   }
   assert.match(html,/id="primary-nav"/);
  }
 });
}
