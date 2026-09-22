/* Public Cloudflare site identifier, not an API credential. No custom events. */
(() => {
  // Keep local QA and deployment previews out of production measurements.
  if (location.hostname !== 'sales-bwa-photo.pages.dev' || navigator.doNotTrack === '1') return;
  const allowed = new Set(['utm_source', 'utm_medium', 'utm_campaign']);
  const params = new URLSearchParams(location.search);
  if ([...params.keys()].some(key => !allowed.has(key))) return;
  const values = { utm_source: 'google', utm_medium: 'organic', utm_campaign: 'gbp' };
  if ([...params].some(([key, value]) => values[key] !== value)) return;
  // Do not load a vendor beacon on arbitrary fragments containing user input.
  if (location.hash && !document.getElementById(location.hash.slice(1))) return;
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.dataset.cfBeacon = JSON.stringify({ token: '38d32eb3d9a34c59b2e2a4b63b8bccb1' });
  document.head.append(script);
})();
