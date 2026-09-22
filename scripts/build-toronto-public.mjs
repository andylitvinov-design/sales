import { mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
const out = path.resolve('output/toronto-public');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const files = ['landing-services-bwa-photo.html', 'landing-services-bwa-photo.css', 'hypnotherapy-toronto.html', 'systemic-constellations-toronto.html', 'toronto-acquisition.css', 'toronto-acquisition.js', 'toronto-analytics.js'];
for (const file of files) await copyFile(file, path.join(out, file));
await copyFile('landing-services-bwa-photo.html', path.join(out, 'index.html'));
await writeFile(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://sales-bwa-photo.pages.dev/sitemap.xml\n');
await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['', 'hypnotherapy-toronto', 'systemic-constellations-toronto'].map(slug => `<url><loc>https://sales-bwa-photo.pages.dev/${slug}</loc></url>`).join('\n')}\n</urlset>\n`);
// Real 404 prevents Pages SPA fallback from returning the homepage for missing routes.
await writeFile(path.join(out, '404.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><title>Page not found | PsiTrends</title><h1>Page not found</h1><p><a href="/hypnotherapy-toronto">Explore Toronto sessions</a></p></html>');
await writeFile(path.join(out, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
console.log(`Public allowlist bundle: ${out}`);
