import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('thumbnail release runner creates and restores its nested asset directory',async()=>{
 const runner=await fs.readFile(new URL('./update-client.php',import.meta.url),'utf8');
 assert.match(runner,/thumbnailDirectoryExisted/);
 assert.match(runner,/thumbnail_directory/);
 assert.match(runner,/chmod\(\$thumbnailDirectory,0755\)/);
 assert.match(runner,/rmdir\(\$thumbnailDirectory\)/);
});


test('approved page-video poster release runner creates and restores its bounded asset directory',async()=>{
 const runner=await fs.readFile(new URL('./update-client.php',import.meta.url),'utf8');
 assert.match(runner,/pageVideoPosterDirectoryExisted/);
 assert.match(runner,/page_video_poster_count/);
 assert.match(runner,/count\(\$pageVideoPosters\)===8/);
 assert.match(runner,/approved-video-posters/);
 assert.match(runner,/chmod\(\$pageVideoPosterDirectory,0755\)/);
 assert.match(runner,/rmdir\(\$pageVideoPosterDirectory\)/);
});
