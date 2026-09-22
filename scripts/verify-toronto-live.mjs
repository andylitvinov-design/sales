import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const origin = new URL(process.argv[2]).origin;
const preview = origin !== 'https://sales-bwa-photo.pages.dev';
const results = [];
async function get(path, status = 200) {
  const response = await fetch(origin + path, { redirect: 'manual' });
  assert.equal(response.status, status, path);
  results.push({ path, status: response.status, location: response.headers.get('location'), robots: response.headers.get('x-robots-tag') });
  return { response, text: await response.text() };
}
for (const slug of ['', 'hypnotherapy-toronto', 'systemic-constellations-toronto']) {
  const { response, text } = await get('/' + slug);
  assert.ok(text.includes(`rel="canonical" href="https://sales-bwa-photo.pages.dev/${slug}"`));
  assert.ok(text.includes('name="description"'));
  assert.equal(response.headers.get('x-robots-tag')?.includes('noindex') ?? false, preview);
  assert.ok(!/name="robots"[^>]*noindex/.test(text));
  for (const match of text.matchAll(/(?:src|href)="([^"#]+\.(?:css|js)(?:\?[^" ]*)?)"/g)) {
    if (!/^https?:/.test(match[1])) await get('/' + match[1]);
  }
  if (slug) {
    const schema = text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(schema); JSON.parse(schema);
    assert.ok(text.includes('tel:+14376066502'));
    assert.ok(text.includes('https://t.me/AndyTherapist'));
    assert.ok(text.includes('https://wa.me/14376066502'));
    const { response: redirect } = await get('/' + slug + '.html?utm_source=google&utm_medium=organic&utm_campaign=gbp', 308);
    const location = new URL(redirect.headers.get('location'), origin);
    assert.equal(location.pathname, '/' + slug);
    assert.equal(location.searchParams.get('utm_campaign'), 'gbp');
  }
}
assert.ok((await get('/robots.txt')).text.includes('Sitemap: https://sales-bwa-photo.pages.dev/sitemap.xml'));
const sitemap = (await get('/sitemap.xml')).text;
assert.equal((sitemap.match(/<loc>/g) || []).length, 3);
await get('/not-a-real-acquisition-page', 404);
await get('/.codex/LATEST.md', 404);
await get('/STATE.md', 404);
const evidence = { origin, preview, checkedAt: new Date().toISOString(), checks: results, passed: true };
if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
