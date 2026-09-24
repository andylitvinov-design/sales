import test from 'node:test';
import assert from 'node:assert/strict';
import {render} from './template.mjs';
for(const locale of ['en','ru']){
 test(`${locale} restores original reviews without eager third-party frames`,()=>{
  const html=render('home',locale);
  assert.match(html,/id="reviews"/);
  assert.equal((html.match(/class="review-video"/g)||[]).length,42);
  assert.equal((html.match(/class="review-photo"/g)||[]).length,37);
  assert.equal((html.match(/<video /g)||[]).length,3);
  assert.doesNotMatch(html,/<details class="review-more"/);
  assert.match(html,/YGawtSaydpk/);
  assert.match(html,/photo_2023-06-04_21-44-02.jpg/);
  assert.match(html,/IMG_20241121_193918_816.jpg/);
  assert.match(html,/preload="none"/);
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
