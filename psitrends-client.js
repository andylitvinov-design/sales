/* One responsive menu; the navigation remains usable without JavaScript. */
(() => {
  const button=document.querySelector('.menu-toggle');
  const nav=document.getElementById('primary-nav');
  if(!button||!nav)return;
  document.documentElement.classList.add('menu-ready');
  const setOpen=open=>{
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',document.documentElement.lang==='ru'?(open?'Закрыть меню':'Открыть меню'):(open?'Close menu':'Open menu'));
    nav.classList.toggle('is-open',open);
  };
  button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){setOpen(false);button.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))setOpen(false);});
})();

/* Previously published videos: no player or third-party thumbnail before a click. */
document.querySelectorAll('[data-video]').forEach(link=>{
  link.addEventListener('click',event=>{
    const id=link.dataset.video;
    if(!/^[A-Za-z0-9_-]{11}$/.test(id)||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    const stage=link.closest('.video-stage');
    if(stage.querySelector('iframe'))return;
    const frame=document.createElement('iframe');
    frame.src=`https://www.youtube-nocookie.com/embed/${id}`;
    frame.title=link.getAttribute('aria-label')||'Video player';
    frame.allow='encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen=true;
    frame.referrerPolicy='strict-origin-when-cross-origin';
    const close=document.createElement('button');
    close.type='button';close.className='video-close';
    close.textContent=document.documentElement.lang==='ru'?'Закрыть видео':'Close video';
    close.addEventListener('click',()=>{frame.remove();close.remove();link.hidden=false;link.focus();});
    link.hidden=true;stage.append(frame,close);frame.focus();
  });
});

/* Adapted from toronto-ga4.js: one optional GA4 collector, default denied.
   Static client shell replaces template instrumentation; never embed beside GTM. */
(() => {
  const id = 'G-Z4BGV9GP4N';
  const key = 'psitrends-analytics-consent';
  const control = document.getElementById('analytics-choice');
  if (!control) return;
  const ru = document.body.dataset.locale === 'ru';
  const status = document.getElementById('analytics-status');
  const params = new URLSearchParams(location.search);
  const approved = {utm_source:'google',utm_medium:'organic',utm_campaign:'gbp'};
  const safe = document.body.dataset.analyticsMode === 'consent' && location.hostname === 'psitrends.com' && navigator.doNotTrack !== '1' &&
    [...params].every(([k,v]) => approved[k] === v) && (!location.hash || document.getElementById(location.hash.slice(1)));
  let enabled = false;
  const save = value => { try { localStorage.setItem(key,value); } catch { /* In-memory choice remains valid. */ } };
  const enable = () => {
    if (enabled || !safe) {
      if (!safe) status.textContent = ru ? 'Аналитика выключена для этого посещения.' : 'Analytics stays off for this visit.';
      return;
    }
    enabled = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',id,{page_location:document.querySelector('link[rel="canonical"]').href,page_referrer:'',allow_google_signals:false,allow_ad_personalization_signals:false,
      ...(Object.entries(approved).every(([k,v])=>params.get(k)===v)?{campaign_source:'google',campaign_medium:'organic',campaign_name:'gbp'}:{})});
    const script = document.createElement('script'); script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.append(script);
    status.textContent = ru ? 'Необязательная аналитика включена.' : 'Optional analytics is on.';
  };
  control.querySelector('[data-analytics="allow"]').addEventListener('click',()=>{ if(safe)save('granted'); enable(); });
  control.querySelector('[data-analytics="deny"]').addEventListener('click',()=>{
    if(document.body.dataset.analyticsMode!=='consent'||location.hostname!=='psitrends.com'){status.textContent=ru?'Аналитика выключена для этого посещения.':'Analytics stays off for this visit.';return;}
    save('denied'); enabled=false; window[`ga-disable-${id}`]=true;
    document.cookie.split(';').forEach(cookie=>{ const name=cookie.split('=')[0].trim(); if(!/^_ga(?:_|$)/.test(name))return;
      [location.hostname,`.${location.hostname}`,''].forEach(domain=>{document.cookie=`${name}=; Max-Age=0; path=/;${domain?` domain=${domain};`:''} SameSite=Lax; Secure`;});});
    location.reload();
  });
  const isGbp=Object.entries(approved).every(([k,v])=>params.get(k)===v);
  if(isGbp)document.querySelectorAll('a[href]').forEach(a=>{const u=new URL(a.href);if(u.origin===location.origin&&!u.hash){Object.entries(approved).forEach(([k,v])=>u.searchParams.set(k,v));a.href=u.href;}});
  document.querySelectorAll('[data-contact]').forEach(a=>a.addEventListener('click',()=>{
    if(!enabled)return;
    window.gtag('event','contact_click',{send_to:id,landing_page:new URL(document.querySelector('link[rel="canonical"]').href).pathname,service:document.body.dataset.page,contact_method:a.dataset.contact,acquisition_source:isGbp?'google_maps':'unattributed'});
  }));
  try { if (safe && localStorage.getItem(key)==='granted')enable(); } catch { /* Default off. */ }
})();
