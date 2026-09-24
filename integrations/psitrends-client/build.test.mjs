import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import {render} from './template.mjs';

test('allowlisted bilingual build is preview-safe and production metadata is explicit', () => {
  assert.ok(existsSync('scripts/build-psitrends-client.mjs'), 'builder must exist');
  const built = spawnSync(process.execPath, ['scripts/build-psitrends-client.mjs'], {encoding:'utf8'});
  assert.equal(built.status,0,built.stderr);
  const manifest=JSON.parse(readFileSync('output/psitrends-client/manifest.json'));
  assert.equal(manifest.routes.length,12);
  assert.equal(manifest.mode,'preview');
  for(const route of manifest.routes){
    const page=readFileSync(`output/psitrends-client/${route.file}`,'utf8');
    assert.match(page,/noindex, nofollow/);
    assert.match(page,/data-analytics-mode="off"/);
    assert.doesNotMatch(page,/src="https:\/\/(www.googletagmanager|static.cloudflareinsights)/);
    assert.equal((page.match(/<h1>/g)||[]).length,1);
    assert.match(page,/data-contact="whatsapp"/);
    if(route.locale==='ru')assert.match(page,/<html lang="ru"/);
  }
  const prod = spawnSync(process.execPath,['scripts/build-psitrends-client.mjs','--production'],{encoding:'utf8'});
  assert.equal(prod.status,0,prod.stderr);
  const page=readFileSync('output/psitrends-client/hypnotherapy-toronto/index.html','utf8');
  assert.match(page,/rel="canonical" href="https:\/\/psitrends.com\/hypnotherapy-toronto"/);
  assert.match(page,/hreflang="ru-RU" href="https:\/\/psitrends.com\/ru\/hypnotherapy-toronto"/);
  assert.doesNotMatch(page,/noindex/);
  // Return deployable working output to its safe default after checking opt-in.
  assert.equal(spawnSync(process.execPath,['scripts/build-psitrends-client.mjs']).status,0);
});

test('author profile keeps the supplied biography, portrait and reviews in reading order', () => {
  const english=render('about','en',{production:true});
  const russian=render('about','ru',{production:true});
  const home=render('home','en',{production:true});
  for(const fragment of [
    'Let me introduce myself.', 'I’m Andy, a Jungian-oriented specialist and facilitator of archetypal practices.', 'Raised in Ukraine but living for 20 years worldwide.', '24 years of facilitating group and personal growth programs',
    '22 years of experience facilitating transpersonal temple-based practices', '15 years of experience facilitating Family and Business Constellations',
    'Dreams Alive Psychotherapy', 'Healing tensions, Inner child traumas through unconscious imagery.', 'Body-oriented Psychotherapy', 'Healing early Inner child traumas through conscious touch.', 'Temple Therapy', 'Taoist Alchemy',
    'I did tantric workshops since 2004', 'Though my primary interest is psychotherapy.', 'My principal education in this field lies in Guided Affective Imagery (Hanscarl Leuner).', 'The method that creates a bridge between Jungian depth psychology and Freudian psychoanalysis.',
    'As for the bodywork, my education was based in', 'European School of Body psychotherapy', 'Bodynamic Analysis approach', 'These schools beautifully connect the traumas of childhood with the body areas.',
    'Temple Studies. Initiations into the Greek Temple Mysteries. Mysteries of Dionysus, Demeter, etc. Egyptian Temple magic and mysteries.', 'That is the experience that not only gives you the knowledge, but the sense of the field, archetypes, transpersonal flow.', 'That I was studying and teaching worldwide for 20 years.', 'Tantra Reiki School, that is said to be coming from the Osho’s Tradition.'
  ])assert.ok(english.includes(fragment),`missing English biography fragment: ${fragment}`);
  assert.match(english,/andy-library-desk\.png/);
  assert.match(home,/andy-library-desk\.png/);
  const tantricIndex=english.indexOf('Tantric workshops');
  const testimonialsIndex=english.indexOf('Testimonials');
  assert.notEqual(tantricIndex,-1,'Tantric workshops heading must be present');
  assert.ok(testimonialsIndex>tantricIndex,'reviews must appear after the full biography');
  for(const fragment of ['Позвольте представиться.', '24 года веду групповые', 'Психотерапия Dreams Alive', 'Телесно-ориентированная психотерапия', 'Храмовая терапия', 'Даосская алхимия', 'Тантрические семинары', 'Guided Affective Imagery', 'Bodynamic Analysis', 'Temple Studies', 'Tantra Reiki School'])assert.ok(russian.includes(fragment),`missing Russian biography fragment: ${fragment}`);
});
