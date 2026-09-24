import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pages} from '../integrations/psitrends-client/content.mjs';
import {render,routeFor,sourceName} from '../integrations/psitrends-client/template.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const production=process.argv.includes('--production');
if(process.argv.slice(2).some(a=>a!=='--production'))throw new Error('Only --production is supported');
const output=path.join(root,'output/psitrends-client');
// This fixed output directory contains only this generator's artifacts.
await fs.rm(output,{recursive:true,force:true});
await fs.mkdir(path.join(output,'psitrends-client-assets'),{recursive:true});
const manifest={mode:production?'production':'preview',analytics:production?'consent-required; no template GTM permitted':'disabled',routes:[]};
for(const locale of ['en','ru'])for(const key of Object.keys(pages[locale])){
 const name=sourceName(key,locale);
 await fs.writeFile(path.join(root,`${name}.html`),render(key,locale,{source:true}));
 await fs.writeFile(path.join(root,`${name}.css`),'@import url("psitrends-client.css?v=1");\n');
 const route=routeFor(key,locale),file=route==='/'?'index.html':`${route.replace(/^\//,'').replace(/\/$/,'')}/index.html`;
 await fs.mkdir(path.dirname(path.join(output,file)),{recursive:true});
 await fs.writeFile(path.join(output,file),render(key,locale,{production}));
 manifest.routes.push({route,file,locale,source:`${name}.html`});
}
for(const [from,to] of [['psitrends-client.css','psitrends-client-assets/psitrends-client.css'],['psitrends-client.js','psitrends-client-assets/psitrends-client.js'],['integrations/psitrends-client/andrey.jpg','psitrends-client-assets/andrey.jpg'],['integrations/psitrends-client/andy-library-desk.png','psitrends-client-assets/andy-library-desk.png']])await fs.copyFile(path.join(root,from),path.join(output,to));
await fs.cp(path.join(root,'integrations/psitrends-client/reviews'),path.join(output,'psitrends-client-assets/reviews'),{recursive:true});
await fs.writeFile(path.join(output,'robots.txt'),production?'User-agent: *\nAllow: /\nSitemap: https://psitrends.com/sitemap.xml\n':'User-agent: *\nDisallow: /\n');
await fs.writeFile(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production?manifest.routes.map(x=>`<url><loc>https://psitrends.com${x.route}</loc></url>`).join(''):''}</urlset>\n`);
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({output,mode:manifest.mode,pages:manifest.routes.length}));
