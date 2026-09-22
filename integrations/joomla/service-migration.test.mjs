import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

test('migration candidate replaces only service documents with exact permanent redirects', () => {
  try {
    execFileSync(process.execPath, ['scripts/build-toronto-public.mjs', '--migration-preview']);
    const out = 'output/toronto-public/';
    const redirects = readFileSync(out + '_redirects', 'utf8').trim().split('\n');
    assert.equal(redirects.length, 6);
    for (const slug of ['hypnotherapy-toronto', 'systemic-constellations-toronto']) {
      assert.equal(existsSync(out + slug + '.html'), false);
      for (const suffix of ['', '.html', '/']) {
        assert.ok(redirects.includes(`/${slug}${suffix} https://psitrends.com/${slug} 301`));
      }
      assert.equal(readFileSync(out + 'sitemap.xml', 'utf8').includes(slug), false);
    }
    assert.equal(readFileSync(out + 'index.html', 'utf8'), readFileSync('landing-services-bwa-photo.html', 'utf8'));
    assert.ok(existsSync(out + '404.html'));
    assert.equal(redirects.some(line => line.includes('*')), false);
  } finally {
    // Restore the source-controlled release state; the candidate flag never persists.
    execFileSync(process.execPath, ['scripts/build-toronto-public.mjs']);
  }
});
