import test from 'node:test';
import assert from 'node:assert/strict';
import {render} from './template.mjs';
for(const locale of ['en','ru']){
 test(`${locale} restores original reviews without eager third-party frames`,()=>{
  const html=render('home',locale);
  assert.match(html,/id="reviews"/);
  assert.equal((html.match(/class="review-video"/g)||[]).length,7);
  assert.equal((html.match(/data-video="/g)||[]).length,locale==='en'?6:7);
  assert.equal((html.match(/class="review-photo"/g)||[]).length,locale==='en'?8:5);
  assert.doesNotMatch(html,/<iframe/);
  assert.match(html,/archway.webp/);
 });
 test(`${locale} Academy exposes the original course catalog`,()=>{
  const html=render('academy',locale);
  assert.match(html,/id="programs"/);
  assert.match(html,/shkola-rejki-iggdrasil|master-taory/);
  assert.match(html,/kurs-misterii-dionisa/);
  assert.match(html,/gypno-egypt/);
  assert.match(html,/review-maat-ru/);
 });
}
