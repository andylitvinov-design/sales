# PsiTrends client layer

Twelve source previews and an allowlisted static artifact, generated from `content.mjs` and `template.mjs`. EN/RU copy follows Issue #6 masterplan and `docs/psitrends-content-map.md`; the two existing Toronto pages provide service-copy and consent-model baselines. No pricing, credentials, testimonials or business results are invented.

## Build and review

- `node scripts/build-psitrends-client.mjs`: regenerate all sources and safe preview in `output/psitrends-client` (noindex, analytics off).
- `node scripts/build-psitrends-client.mjs --production`: explicit first-party canonical/hreflang/schema and consent-gated GA4 mode. This builds only; it never deploys.
- Open sources over `http://127.0.0.1:8877/sales/psitrends-client-home.html`; source navigation uses sibling `.html` files. Sources remain preview-safe even when building production output.
- `node --test integrations/psitrends-client/build.test.mjs`: preview defaults and explicit production metadata.
- `node integrations/psitrends-client/browser-qa.mjs`: all 12 pages at 320/390/1440 pixels, language links, FAQ, keyboard, no preview external requests; production consent/withdrawal/unsafe-query checks with all production traffic intercepted locally. No contact messages sent.
- `npm run page:audit -- <source.html>`: required HTML, CSS, accessibility, links, Lighthouse and screenshots. Run for all 12 sources after a shared-template change. Separately lint shared `psitrends-client.css`.

The builder owns and clears its fixed output directory. The source HTML/CSS are generated review artifacts, not separate edit locations. Shared CSS/JS and `integrations/psitrends-client/andrey.jpg` are copied to `/psitrends-client-assets/` in the build; no whole-repository upload is permitted.

## Integration boundaries

The generated pages contain their own header/main/footer. The footer carries consent controls. `body` data attributes provide page, locale and analytics mode. A Joomla adapter must preserve these attributes and exclude inherited GTM/GA4/template analytics on these 12 pages. Do not duplicate instrumentation; leave existing legacy-page instrumentation intact.

Preview output never enables analytics, even after clicking Allow, and does not persist a choice. Production collection requires exact psitrends.com hostname, an explicit consent-enabled build, opt-in, no DNT and only approved GBP query values. URLs with other parameters stay untracked; no query/referrer/free-text data is sent. Contact clicks remain intent only. Do not claim enquiries, bookings or revenue.

The artifact's sitemap contains only its 12 client routes. It is an input to a combined first-party sitemap, not a replacement for the legacy sitemap. Preserve existing legacy robots/routing and content. Academy links point to the existing knowledge library. No redirects or legacy deletion are implemented here.

Portrait: exact public source already used by the approved Toronto pages, `https://psitrends.com/images/photo_2024-08-04_22-52-52.jpg`; reused from existing local copy and processed by the project asset optimizer. No generated portrait or invented visual evidence.

No dependency install or image generation is needed. Browser QA uses installed Chrome; js_repl is unavailable in this session, so equivalent reusable Playwright contexts and the repository audit were used.
