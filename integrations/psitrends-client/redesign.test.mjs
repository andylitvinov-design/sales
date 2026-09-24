import test from 'node:test';
import assert from 'node:assert/strict';
import {render} from './template.mjs';

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
   assert.match(html,/class="language"[^>]*>[ER][NU]</);
   assert.match(html,/id="primary-nav"/);
  }
 });
}

for (const locale of ['en','ru']) {
 test(`${locale} top navigation opens real sections instead of homepage-only anchors`,()=>{
  const html=render('home',locale);
  const academy=locale==='en'?'/academy':'/ru/academy';
  const events=locale==='en'?'/events':'/ru/events';
  assert.match(html,new RegExp(`class="nav-root" href="${academy.replaceAll('/','\\/')}[^"]*"`));
  assert.match(html,new RegExp(`class="nav-root" href="${events.replaceAll('/','\\/')}[^"]*"`));
  assert.match(html,/class="nav-submenu"/);
  assert.match(html,/Reiki Yggdrasil/);
  assert.match(html,locale==='en'?/Projects/:/Проекты/);
  assert.doesNotMatch(html,/class="nav-root" href="#training"/);
  assert.doesNotMatch(html,/class="nav-root" href="#workshops"/);
 });
 test(`${locale} Academy exposes courses and preserved project roots`,()=>{
  const html=render('academy',locale);
  for(const id of ['reiki','mysteries','runes','video-courses','library','projects']) assert.match(html,new RegExp(`id="${id}"`));
  assert.match(html,locale==='en'?/https:\/\/psitrends\.com\/business/:/https:\/\/psitrends\.com\/ru\/biznes/);
  assert.match(html,locale==='en'?/https:\/\/psitrends\.com\/studies/:/https:\/\/psitrends\.com\/ru\/cat-train-ru/);
 });
}
