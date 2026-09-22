/* No cookies, persistent identifiers, network collector or free-text payloads. */
(() => {
  const pages = ['hypnotherapy-toronto', 'systemic-constellations-toronto'];
  const slug = location.pathname.split('/').pop().replace(/\.html$/, '');
  if (!pages.includes(slug)) return;
  const params = new URLSearchParams(location.search);
  const isGbp = params.get('utm_source') === 'google' && params.get('utm_medium') === 'organic' && params.get('utm_campaign') === 'gbp';
  const attribution = { landing_page: slug, source: isGbp ? 'google' : 'unattributed', medium: isGbp ? 'organic' : 'unattributed', campaign: isGbp ? 'gbp' : 'unattributed' };
  // Carry only the approved campaign across the two owned service pages.
  if (isGbp) document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href);
    if (url.origin === location.origin && pages.some(page => url.pathname.endsWith(`/${page}.html`) || url.pathname.endsWith(`/${page}`))) {
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => url.searchParams.set(key, params.get(key)));
      link.href = url.href;
    }
  });
  const emit = (event, fields = {}) => {
    const detail = { event, ...attribution, ...fields };
    // In-memory adapter: attaching a collector requires a separate consent review.
    window.dispatchEvent(new CustomEvent('sales:acquisition', { detail }));
  };
  emit('landing_view');
  document.querySelectorAll('[data-contact]').forEach(link => {
    if (link.dataset.contact === 'whatsapp') {
      const text = `Hi Andrey, I would like to ask about a Toronto session. Page: ${slug}.${isGbp ? ' Found through Google Maps.' : ''}`;
      link.href = `https://wa.me/14376066502?text=${encodeURIComponent(text)}`;
    }
    link.addEventListener('click', () => emit('contact_click', { contact_method: link.dataset.contact }));
  });
})();
