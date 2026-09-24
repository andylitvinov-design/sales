import test from 'node:test';
import assert from 'node:assert/strict';
import {render, routeFor} from './template.mjs';

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
  assert.match(html, />События<\/a>/);
  assert.match(render('about', 'ru'), /Архив мастерских и групповой практики/);
  assert.match(html, /Радомышль, Украина/);
});

test('all client-first pages expose the locale-matched Events link and archive integrations', () => {
  for (const [locale, label] of [['en', 'Events'], ['ru', 'События']]) {
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
