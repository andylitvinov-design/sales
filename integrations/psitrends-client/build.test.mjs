import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import {render} from './template.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {APPROVED_PAGE_VIDEOS} from './approved-videos.mjs';

test('allowlisted bilingual build is preview-safe and production metadata is explicit', () => {
  assert.ok(existsSync('scripts/build-psitrends-client.mjs'), 'builder must exist');
  const built = spawnSync(process.execPath, ['scripts/build-psitrends-client.mjs'], {encoding:'utf8'});
  assert.equal(built.status,0,built.stderr);
  const manifest=JSON.parse(readFileSync('output/psitrends-client/manifest.json'));
  assert.equal(manifest.routes.length,18);
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
  for(const poster of ['home-en-v2.webp','home-ru-v1.webp','services-en-v2.webp','services-ru-v1.webp','homeopathy-en-v2.webp','homeopathy-ru-v1.webp','hypnotherapy-en-v1.webp','constellations-en-v1.webp']) {
    assert.ok(existsSync(`output/psitrends-client/psitrends-client-assets/approved-video-posters/${poster}`), poster);
  }
  assert.equal(spawnSync(process.execPath,['scripts/build-psitrends-client.mjs']).status,0);
});

test('both builders publish only manifest posters when an unrelated source file is present', async () => {
  const unexpected=new URL(`./approved-video-posters/unexpected-public-artifact-${process.pid}.txt`,import.meta.url);
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'psitrends-poster-allowlist-'));
  const expected=Object.values(APPROVED_PAGE_VIDEOS).flatMap(localized=>Object.values(localized).map(video=>video.poster)).sort();
  try {
    await fs.writeFile(unexpected,'This non-manifest file must never be published.',{flag:'wx'});
    const staticBuild=spawnSync(process.execPath,['scripts/build-psitrends-client.mjs'],{encoding:'utf8'});
    assert.equal(staticBuild.status,0,staticBuild.stderr);
    const {build}=await import('../../scripts/build-joomla-client.mjs');
    await build({destination:directory,zip:false});
    const staticPosters=await fs.readdir('output/psitrends-client/psitrends-client-assets/approved-video-posters');
    const nativePosters=await fs.readdir(path.join(directory,'template/media/assets/approved-video-posters'));
    assert.deepEqual({static:staticPosters.sort(),native:nativePosters.sort()},{static:expected,native:expected});
  } finally {
    await fs.unlink(unexpected);
    await fs.rm(directory,{recursive:true,force:true});
  }
});

test('author profile keeps the supplied biography, portrait and reviews in reading order', () => {
  const english=render('about','en',{production:true});
  const russian=render('about','ru',{production:true});
  const home=render('home','en',{production:true});
  for(const fragment of [
    'Let me introduce myself.', 'I’m Andy, a Jungian-oriented specialist and facilitator of archetypal practices.', 'Raised in Ukraine but living for 20 years worldwide.', '24 years of facilitating group and personal growth programs',
    '22 years of experience facilitating transpersonal temple-based practices', '15 years of experience facilitating Family and Business Constellations',
    'Dreams Alive / Guided Imagery Work', 'Exploring tensions and Inner Child experiences through imagery and unconscious material.', 'Body-oriented Work', 'Exploring early developmental and Inner Child patterns through body awareness and conscious, consent-based touch.', 'Archetypal Temple Work', 'Taoist Alchemy',
    'I did tantric workshops since 2004', 'Though my primary interest is depth-oriented personal work.', 'A central part of my studies has been Guided Affective Imagery (Hanscarl Leuner).', 'This approach creates a bridge between Jungian depth traditions and Freudian psychoanalytic approaches.',
    'As for bodywork, my studies were influenced by', 'European body-oriented approaches', 'the Bodynamic Analysis approach', 'These approaches explore connections between early developmental experiences and patterns held in the body.',
    'Temple Studies. Initiations into the Greek Temple Mysteries. Mysteries of Dionysus, Demeter, etc. Egyptian Temple magic and mysteries.', 'That is the experience that not only gives you the knowledge, but the sense of the field, archetypes, transpersonal flow.', 'That I was studying and teaching worldwide for 20 years.', 'Tantra Reiki, a lineage described within its tradition as connected to Osho-inspired teachings.'
  ])assert.ok(english.includes(fragment),`missing English biography fragment: ${fragment}`);
  assert.match(english,/andy-library-desk\.png/);
  assert.match(home,/andy-library-desk\.png/);
  const tantricIndex=english.indexOf('Tantric workshops');
  const testimonialsIndex=english.indexOf('Testimonials');
  assert.notEqual(tantricIndex,-1,'Tantric workshops heading must be present');
  assert.ok(testimonialsIndex>tantricIndex,'reviews must appear after the full biography');
  for(const fragment of ['Позвольте представиться.', '24 года веду групповые', 'Dreams Alive / работа с направленными образами', 'Телесно-ориентированная работа', 'Архетипическая храмовая работа', 'Даосская алхимия', 'Тантрические семинары', 'Guided Affective Imagery', 'Bodynamic Analysis', 'Temple Studies', 'Tantra Reiki'])assert.ok(russian.includes(fragment),`missing Russian biography fragment: ${fragment}`);
});
