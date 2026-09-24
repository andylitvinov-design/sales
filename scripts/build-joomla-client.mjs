import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pages} from '../integrations/psitrends-client/content.mjs';
import {home} from '../integrations/psitrends-client/home.mjs';
import {render,routeFor} from '../integrations/psitrends-client/template.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const owned=path.join(root,'integrations/joomla-client');
const escape=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const digest=x=>createHash('sha256').update(x).digest('hex');
export function splitPage(html){
 const bodies=[...html.matchAll(/<body\b[^>]*>([\s\S]*?)<\/body>/g)];
 if(bodies.length!==1)throw new Error('Exactly one body required');
 const body=bodies[0][1],mains=[...body.matchAll(/<main id="main">([\s\S]*?)<\/main>/g)];
 if(mains.length!==1)throw new Error('Exactly one main required');
 const main=mains[0];
 if(/<(?:script|iframe|object|embed)\b|\bon\w+\s*=/i.test(main[1]))throw new Error('Executable article markup rejected');
 return {article:main[1].trim()+'\n',before:body.slice(0,main.index).trim(),after:body.slice(main.index+main[0].length).trim()};
}
export async function build({destination=path.join(owned,'generated'),zip=true}={}){
 await fs.mkdir(destination,{recursive:true});
 const template=path.join(destination,'template');
 await fs.cp(path.join(owned,'template'),template,{recursive:true});
 await fs.mkdir(path.join(template,'media/assets'),{recursive:true});
 await fs.mkdir(path.join(destination,'articles'),{recursive:true});
 const entries={},plan={mode:'plan-only',template:'psitrends_client',defaultReleaseMode:'preview',preserveMenuIds:[101],preserveLegacyTemplates:['tx_valley'],preserveQuixRecords:true,pages:[]};
 const replaceAssets=html=>html.replace(/\/(?:psitrends-client-assets|assets)\//g,'/media/templates/site/psitrends_client/assets/');
 for(const locale of ['en','ru'])for(const name of Object.keys(pages[locale])){
  const key=`${locale}:${name}`,page=name==='home'?home[locale]:pages[locale][name],html=render(name,locale,{production:true});
  const split=splitPage(html),article=replaceAssets(split.article),route=routeFor(name,locale);
  const schema=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const bodyFile=`articles/${locale}-${name}.html`;
  // Joomla's remembered RU homepage selection otherwise redirects / back to RU.
  // Force only the language switch through /en; native routing removes the prefix.
  if(locale==='ru'){
   const original=`class="language" href="${routeFor(name,'en')}"`;
   if(!split.before.includes(original))throw new Error('Expected English language switch');
   split.before=split.before.replace(original,`class="language" href="/en${routeFor(name,'en')}"`);
  }
  await fs.writeFile(path.join(destination,bodyFile),article);
  entries[key]={locale,page:name,title:page.title,description:page.description,canonical:`https://psitrends.com${route}`,alternates:{'en-GB':`https://psitrends.com${routeFor(name,'en')}`,'ru-RU':`https://psitrends.com${routeFor(name,'ru')}`},schema:schema?JSON.parse(schema):null,before:replaceAssets(split.before),after:replaceAssets(split.after)};
  plan.pages.push({key,route,canonical:entries[key].canonical,language:locale==='en'?'en-GB':'ru-RU',article:{action:'create-unpublished',title:page.title,alias:`psitrends-client-${locale}-${name}`,state:0,access:1,bodyFile,sha256:digest(article),metadesc:page.description,catid:'REQUIRE_REVIEWED_NATIVE_CATEGORY_ID'},style:{action:'create-from-installed-template',title:`PsiTrends Client ${key}`,params:{page_key:key,release_mode:'preview'},makeDefault:false},menu:{action:name==='home'?'update-existing-after-private-snapshot':'create-after-collision-check',reuseId:name==='home'?(locale==='en'?202:204):null,type:'component',link:'index.php?option=com_content&view=article&id=NEW_ARTICLE_ID',alias:name==='home'?'PRESERVE_EXISTING':route.split('/').filter(Boolean).at(-1),menutype:'PRESERVE_HOME_LANGUAGE_MENUTYPE',parent_id:name==='home'?'PRESERVE_EXISTING':1,home:name==='home'?'PRESERVE_EXISTING':0,template_style_id:'NEW_PAGE_STYLE_ID'}});
 }
 if(plan.pages.length!==12)throw new Error('Expected exactly twelve reviewed pages');
 await fs.writeFile(path.join(template,'pages.json'),JSON.stringify(entries,null,2)+'\n');
 const options=Object.keys(entries).map(key=>`<option value="${escape(key)}">${escape(key)}</option>`).join('');
 await fs.writeFile(path.join(template,'templateDetails.xml'),`<?xml version="1.0" encoding="utf-8"?>
<extension type="template" client="site" method="upgrade">
<name>psitrends_client</name><version>1.0.0</version><creationDate>2026-09-22</creationDate><author>PsiTrends</author><description>Native client article template; assign per menu only, preview by default.</description>
<files><filename>index.php</filename><filename>legacy-route.php</filename><filename>templateDetails.xml</filename><filename>pages.json</filename><folder>html</folder></files>
<media destination="templates/site/psitrends_client" folder="media"><folder>assets</folder></media>
<config><fields name="params"><fieldset name="client" label="Client page"><field name="page_key" type="list" label="Page content key" default="" required="true"><option value="">Select reviewed page</option>${options}</field><field name="release_mode" type="list" label="Release mode" default="preview"><option value="preview">Preview: noindex, analytics off</option><option value="production">Production: verified hostname and consent required</option></field></fieldset></fields></config>
</extension>\n`);
 for(const [source,name] of [['psitrends-client.css','psitrends-client.css'],['psitrends-client.js','psitrends-client.js'],['integrations/psitrends-client/andrey.jpg','andrey.jpg'],['integrations/psitrends-client/archway.webp','archway.webp']])await fs.copyFile(path.join(root,source),path.join(template,'media/assets',name));
 await fs.writeFile(path.join(destination,'migration-plan.json'),JSON.stringify(plan,null,2)+'\n');
 if(zip){const archive=path.join(destination,'psitrends_client.zip');await fs.rm(archive,{force:true});await promisify(execFile)('/usr/bin/zip',['-q','-r',archive,'.'],{cwd:template});}
 return {pages:plan.pages.length,mode:'plan-only',package:zip?'psitrends_client.zip':'template/'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length!==2)throw new Error('No execution or production flags supported; build is local plan-only');
 console.log(JSON.stringify(await build()));
}
