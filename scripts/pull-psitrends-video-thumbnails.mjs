import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {reviews} from '../integrations/psitrends-client/reviews.mjs';
import {reviewArchive} from '../integrations/psitrends-client/review-archive.mjs';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output=path.join(root,'integrations/psitrends-client/review-thumbnails');
const ids=[...new Set([...reviews.ru.videos,...reviews.en.videos,...reviewArchive.flatMap(group=>group.videos)].filter(id=>id!=='OrdMvKn2Zg8'))];
if(ids.length!==38)throw new Error(`Expected 38 reviewed YouTube thumbnails, got ${ids.length}`);
await fs.mkdir(output,{recursive:true});
for(const id of ids){
 const response=await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
 if(!response.ok)throw new Error(`Thumbnail unavailable: ${id} (${response.status})`);
 await sharp(await response.arrayBuffer()).resize({width:480,withoutEnlargement:true}).webp({quality:82}).toFile(path.join(output,`${id}.webp`));
}
console.log(JSON.stringify({output,thumbnails:ids.length}));
