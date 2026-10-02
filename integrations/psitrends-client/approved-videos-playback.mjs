import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium,webkit,devices} from 'playwright';

const base=process.env.PSITRENDS_BASE_URL||'https://psitrends.com';
const report=process.env.PSITRENDS_PLAYBACK_REPORT||'reports/approved-videos-playback.json';
const cases=[
  ['/', 'ed202847a43a96b918308aa972177b34'],
  ['/ru/', '388a04b39ebf215ae656bcd22d0d0847'],
  ['/consultations', '48105a2f2228e7cb3a67391e97acaf8b'],
  ['/ru/consultations', '79c2845577865979cd95ac40a08fc01a'],
  ['/about', '34df311e461509433b45929908a9097a'],
  ['/ru/about', '0f984780d06948b1e78166e6e553e4e9'],
];
const selected=(process.env.PSITRENDS_PLAYBACK_ENGINES||'chromium,webkit').split(',');
const results=[];
await mkdir('reports',{recursive:true});
for(const [name,type] of [['chromium',chromium],['webkit',webkit]]) {
  if(!selected.includes(name))continue;
  const browser=await type.launch({headless:true,...name==='chromium'&&process.env.PSITRENDS_BROWSER_CHANNEL?{channel:process.env.PSITRENDS_BROWSER_CHANNEL}:{}});
  try {
    for(const [path,id] of cases) {
      const locale=path.startsWith('/ru')?'ru-RU':'en-CA';
      const context=await browser.newContext(name==='webkit'?{...devices['iPhone 13'],locale}:{viewport:{width:1440,height:1000},locale});
      const page=await context.newPage();
      const result={engine:name,path,id,checkedAt:new Date().toISOString(),status:'unverified'};
      try {
        let beforeClick=true,earlyProvider=0;
        page.on('request',r=>{if(beforeClick&&/heygen\.(com|ai)/.test(new URL(r.url()).hostname))earlyProvider++;});
        await context.route(/googletagmanager|google-analytics/,route=>route.abort());
        await context.route('**/*',route=>['POST','PUT','PATCH','DELETE'].includes(route.request().method())&&new URL(route.request().url()).origin===new URL(base).origin?route.abort():route.continue());
        assert.equal((await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:45000})).status(),200);
        const block=page.locator('figure[data-psitrends-page-video]');
        assert.equal(await block.count(),1);
        const play=block.locator('[data-page-video-id]');
        await play.scrollIntoViewIfNeeded();
        await page.waitForFunction(el=>!el.disabled,await play.elementHandle());
        assert.equal(await block.locator('iframe').count(),0);
        assert.equal(earlyProvider,0);
        beforeClick=false;
        await play.click();
        const frameElement=block.locator('iframe');
        assert.equal(await frameElement.getAttribute('src'),`https://app.heygen.com/embeds/${id}`);
        const frame=await (await frameElement.elementHandle()).contentFrame();
        await frame.waitForSelector('video',{timeout:45000});
        const video=frame.locator('video').first();
        const read=()=>video.evaluate(v=>({currentTime:v.currentTime,duration:v.duration,width:v.videoWidth,height:v.videoHeight,paused:v.paused,ended:v.ended,error:v.error?.code??null,decodedFrames:v.getVideoPlaybackQuality?.().totalVideoFrames??null}));
        result.initial=await read();
        await frame.waitForFunction(()=>{const v=document.querySelector('video');return v&&v.readyState>=1&&Number.isFinite(v.duration);},null,{timeout:45000});
        result.ready=await read();
        if(result.ready.paused) {
          const providerPlay=frame.getByRole('button',{name:/^(Play|Играть)$/i}).first();
          await providerPlay.click();
          result.providerGesture=true;
        } else result.providerGesture=false;
        await frame.waitForFunction(()=>{const v=document.querySelector('video');return v&&v.currentTime>1&&v.videoWidth>0;},null,{timeout:30000});
        result.started=await read();
        await page.waitForTimeout(2500);
        result.advancing=await read();
        assert.ok(result.advancing.currentTime>result.started.currentTime);
        assert.ok(result.advancing.duration>=28&&result.advancing.duration<=35);
        await frame.waitForFunction(()=>document.querySelector('video')?.ended,null,{timeout:55000});
        result.completion=await read();
        assert.equal(result.completion.error,null);
        assert.ok(result.completion.width>0&&result.completion.height>0);
        result.status='verified-natural-completion';
      } catch(error) {
        result.failure=String(error.message).replace(/https?:\/\/\S+/g,'[URL omitted]');
      } finally {
        results.push(result);
        await writeFile(report,JSON.stringify({base,results},null,2));
        console.log(JSON.stringify(result));
        await context.close();
      }
    }
  } finally {await browser.close();}
}
assert.equal(results.filter(r=>r.status==='verified-natural-completion').length,cases.length*selected.length,'Every exact page and engine must complete real playback');
