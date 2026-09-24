import fs from 'node:fs/promises';
import {courseGroups} from '../integrations/psitrends-client/academy.mjs';
const inventory=JSON.parse(await fs.readFile('.codex/reports/2026-09-22/psitrends-evidence/cms-inventory.json','utf8')).inventory.menu;
const ids=courseGroups.flatMap(g=>g.ids);
const catalog=ids.map(id=>{
 const m=inventory.find(m=>Number(m.id)===id);
 if(!m||m.published!=='1'||!m.path)throw new Error(`Missing published source ${id}`);
 const language=m.language==='ru-RU'||id===260?'ru':'en';
 return {id,title:m.title,language,url:`https://psitrends.com/${m.language==='ru-RU'?'ru/':''}${m.path}`,source:m.link};
});
for(let start=0;start<catalog.length;start+=4){
 await Promise.all(catalog.slice(start,start+4).map(async p=>{
  const r=await fetch(p.url);const html=await r.text();
  if(r.status!==200||html.includes('Could not load the item'))throw new Error(`Source unavailable ${p.id}: ${r.status}`);
  console.log(p.id,r.status,p.url);
 }));
}
await fs.writeFile('integrations/psitrends-client/academy-catalog.json',JSON.stringify(catalog,null,2)+'\n');
console.log(`Preserved ${catalog.length} original program/library URLs`);
