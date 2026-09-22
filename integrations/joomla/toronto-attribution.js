/* sales issue #4: only approved GBP attribution; no storage or tracking. */
(() => {
const applyTorontoAttribution = () => {
  const params = new URLSearchParams(location.search);
  if (params.get('utm_source') !== 'google' || params.get('utm_medium') !== 'organic' || params.get('utm_campaign') !== 'gbp') return;
  document.querySelectorAll('#toronto-services-nav a[data-toronto-service]').forEach(link => {
    const url = new URL(link.href);
    url.search = 'utm_source=google&utm_medium=organic&utm_campaign=gbp';
    link.href = url.href;
  });
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyTorontoAttribution, { once: true });
else applyTorontoAttribution();
})();
