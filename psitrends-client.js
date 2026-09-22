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
