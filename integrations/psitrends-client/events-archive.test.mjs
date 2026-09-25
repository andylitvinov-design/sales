import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {render, routeFor} from './template.mjs';

const eventAssetRoot = fileURLToPath(new URL('./events-assets/events/', import.meta.url));
const photoSets = {
  '2006-trainers': 3, '2007-trainers': 3, '2008-trainers': 3, '2009-trainers': 3,
  '2011-magic-workshop': 3, '2012-magic-workshop': 3, '2013-magic-workshop-crimea': 3,
  '2014-magic-workshop': 7, '2016-odessa': 3, '2016-carpathians': 3, '2017-carpathians': 3,
};

const documentedMarkers = [
  'Trainer Workshop &amp; School of Trainers',
  'Third Summer International Magic Workshop',
  'Journey through the Worlds of Yggdrasil',
  'Money Mystery — Egyptian Mysteries',
  'Aiterra Parapsychology Workshop',
  'Magic Workshop Altair',
];

test('English events archive has counterpart SEO, documented history, and no unverified Bali attribution', () => {
  assert.equal(routeFor('events', 'en'), '/events');
  assert.equal(routeFor('events', 'ru'), '/ru/events');
  const html = render('events', 'en', {production: true});
  assert.match(html, /<title>Events Archive \| Andrii Litvinov · PsiTrends<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/psitrends\.com\/events"/);
  assert.match(html, /hreflang="ru-RU" href="https:\/\/psitrends\.com\/ru\/events"/);
  assert.match(html, /class="language" href="\/ru\/events"/);
  assert.match(html, /data-analytics-event="events_archive_view"/);
  assert.match(html, /psitrends-client-assets\/events\/2013-magic-workshop-crimea\/01\.jpg/);
  for (const marker of documentedMarkers) assert.match(html, new RegExp(marker));
  assert.doesNotMatch(html, /\b(?:Bali|Tantra|Ubud)\b/i);
});

test('Russian events archive is a real counterpart with event navigation across the shared shell', () => {
  const html = render('events', 'ru', {production: true});
  assert.match(html, /<title>Архив мероприятий \| Андрей Литвинов · PsiTrends<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/psitrends\.com\/ru\/events"/);
  assert.match(html, /hreflang="en-GB" href="https:\/\/psitrends\.com\/events"/);
  assert.match(html, /class="language" href="\/events"/);
  assert.match(html, /class="nav-root" href="\/ru\/events" aria-current="page">Семинары<\/a>/);
  assert.match(html, /Архив семинаров и мероприятий/);
  assert.match(render('about', 'ru'), /Архив мастерских и групповой практики/);
  assert.match(html, /Радомышль, Украина/);
});

test('events timeline is newest-first and every published photo set exists locally', () => {
  const html = render('events', 'en', {production: true});
  const order = [
    'Magic Workshop Altair', 'Money Mystery — Egyptian Mysteries',
    'Magic Workshop</h2><p>A documented continuation of the Carpathian workshop series',
    'Journey through the Worlds of Yggdrasil', 'Third Summer International Magic Workshop',
    'Aiterra Parapsychology Workshop', 'Trainer Workshop &amp; School of Trainers',
  ];
  for (let index = 1; index < order.length; index += 1) {
    assert.ok(html.indexOf(order[index - 1]) < html.indexOf(order[index]), `${order[index - 1]} should precede ${order[index]}`);
  }
  assert.match(html, /<p class="eyebrow">2018 → 2006<\/p>/);
  let photoTotal = 0;
  for (const [folder, count] of Object.entries(photoSets)) {
    for (let index = 1; index <= count; index += 1) {
      const file = `${folder}/${String(index).padStart(2, '0')}.jpg`;
      assert.ok(existsSync(`${eventAssetRoot}${file}`), `missing archival photo ${file}`);
      assert.match(html, new RegExp(`events/${folder}/${String(index).padStart(2, '0')}\\.jpg`));
      photoTotal += 1;
    }
  }
  assert.equal(photoTotal, 37);
});

test('all client-first pages expose the locale-matched Workshops root link and archive integrations', () => {
  for (const [locale, label] of [['en', 'Workshops'], ['ru', 'Семинары']]) {
    for (const key of ['home', 'hypnotherapy', 'constellations', 'about', 'academy', 'contact', 'events']) {
      const html = render(key, locale);
      assert.match(html, new RegExp(`href="${routeFor('events', locale)}"[^>]*>${label}<\\/a>`));
    }
    const home = render('home', locale);
    const about = render('about', locale);
    assert.match(home, locale === 'en' ? /Explore past events/ : /Архив прошлых мероприятий/);
    assert.match(about, locale === 'en' ? /Explore Events Archive/ : /Смотреть архив мероприятий/);
  }
});
