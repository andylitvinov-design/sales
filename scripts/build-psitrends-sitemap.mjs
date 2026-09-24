// Publish only after all reviewed first-party client routes pass live acceptance.
// This intentionally does not submit unreviewed legacy/claim-risk query pages.
import {mkdir, writeFile} from 'node:fs/promises';
import {pages} from '../integrations/psitrends-client/content.mjs';
import {routeFor} from '../integrations/psitrends-client/template.mjs';
const origin = 'https://psitrends.com';
const entries = [];
for (const locale of ['en', 'ru']) {
  for (const name of Object.keys(pages[locale])) {
    const alternatives = [['en-GB', 'en'], ['ru-RU', 'ru']].map(([lang, code]) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${origin}${routeFor(name, code)}"/>`);
    entries.push(`  <url>\n    <loc>${origin}${routeFor(name, locale)}</loc>\n${alternatives.join('\n')}\n  </url>`);
  }
}
if (entries.length !== 14 || new Set(entries).size !== 14) throw new Error('Unexpected sitemap routes');
await mkdir('output/psitrends-seo', {recursive: true});
await writeFile('output/psitrends-seo/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`);
console.log('Built fourteen canonical client URLs; production publication remains gated on live acceptance.');
