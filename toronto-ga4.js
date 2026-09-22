/* Existing PsiTrends GA4 stream. Google loads only after explicit consent. */
(() => {
  const id = 'G-Z4BGV9GP4N';
  const key = 'psitrends-analytics-consent';
  const controls = document.getElementById('analytics-choice');
  if (!controls) return;
  const status = document.getElementById('analytics-status');
  const params = new URLSearchParams(location.search);
  const approved = { utm_source: 'google', utm_medium: 'organic', utm_campaign: 'gbp' };
  const safe = location.hostname === 'sales-bwa-photo.pages.dev' && navigator.doNotTrack !== '1' &&
    [...params].every(([k, v]) => approved[k] === v) &&
    (!location.hash || document.getElementById(location.hash.slice(1)));
  let enabled = false;
  const save = value => { try { localStorage.setItem(key, value); } catch { /* Choice remains valid for this page. */ } };
  const enable = () => {
    if (enabled || !safe) return;
    enabled = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      page_location: `https://sales-bwa-photo.pages.dev/${location.pathname.split('/').pop().replace(/\.html$/, '')}`,
      page_referrer: '', allow_google_signals: false, allow_ad_personalization_signals: false,
      ...(Object.entries(approved).every(([k, v]) => params.get(k) === v) ? { campaign_source: 'google', campaign_medium: 'organic', campaign_name: 'gbp' } : {})
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.append(script);
    status.textContent = 'Optional Google Analytics is on.';
  };
  window.addEventListener('sales:acquisition', ({ detail }) => {
    if (!enabled || detail.event !== 'contact_click') return;
    if (!['hypnotherapy-toronto', 'systemic-constellations-toronto'].includes(detail.landing_page) ||
        !['whatsapp', 'telegram', 'call'].includes(detail.contact_method)) return;
    window.gtag('event', 'contact_click', {
      send_to: id, landing_page: detail.landing_page, contact_method: detail.contact_method,
      acquisition_source: detail.campaign === 'gbp' ? 'google_maps' : 'unattributed'
    });
  });
  controls.querySelector('[data-analytics="allow"]').addEventListener('click', () => {
    save('granted'); enable();
    if (!safe) status.textContent = 'Analytics stays off for this visit because of your browser or URL privacy settings.';
  });
  controls.querySelector('[data-analytics="deny"]').addEventListener('click', () => {
    save('denied');
    window[`ga-disable-${id}`] = true;
    enabled = false;
    // Remove this site's GA cookies when consent is withdrawn.
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      [location.hostname, `.${location.hostname}`, ''].forEach(domain => {
        document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax; Secure`;
      });
    });
    location.reload();
  });
  try { if (localStorage.getItem(key) === 'granted') enable(); } catch { /* Default off. */ }
})();
