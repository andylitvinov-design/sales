import test from 'node:test';
import assert from 'node:assert/strict';
import {render} from './template.mjs';
for(const locale of ['en','ru']){
 test(`${locale} presents human-labelled video reviews before photo reviews`,()=>{
  const html=render('home',locale);
  assert.match(html,/id="reviews"/);
  assert.ok(html.indexOf('class="review-video"')<html.indexOf('class="review-photo"'));
  assert.match(html,/class="video-thumbnail"/);
  assert.match(html,/psitrends-client-assets\/review-thumbnails\/.*\.webp/);
  assert.doesNotMatch(html,/i\.ytimg\.com/);
  assert.doesNotMatch(html,/Загрузить видео|Load video|Отзывы с прежней главной/);
  assert.doesNotMatch(html,/OrdMvKn2Zg8/);
  assert.equal((html.match(/<video /g)||[]).length,locale==='ru'?3:0);
  assert.doesNotMatch(html,/<details class="review-more"/);
  assert.match(html,/YGawtSaydpk/);
  assert.match(html,locale==='ru'?/photo_2023-06-04_21-44-02.jpg/:/photo_2023-05-07_00-12-29.jpg/);
  assert.match(html,/IMG_20241121_193918_816.jpg/);
  if(locale==='ru')assert.match(html,/preload="none"/);
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

test('English homepage contains only English review material',()=>{
 const html=render('home','en');
 assert.equal((html.match(/class="review-video"/g)||[]).length,21);
 assert.match(html,/Business Constellation — testimonial/);
 assert.doesNotMatch(html,/Бизнес-расстановки\. Отзыв/);
 assert.doesNotMatch(html,/photo_2023-06-04_21-44-02/);
});

test('Russian homepage shows Russian reviews before English reviews',()=>{
 const html=render('home','ru');
 assert.equal((html.match(/class="review-video"/g)||[]).length,41);
 assert.ok(html.indexOf('Бизнес-расстановки. Отзыв')<html.indexOf('Business Constellation — testimonial'));
 assert.match(html,/photo_2023-06-04_21-44-02/);
 assert.match(html,/photo_2023-05-07_00-12-29/);
});
