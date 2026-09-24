# PsiTrends client layer

Fourteen source previews and an allowlisted static artifact, generated from `content.mjs` and `template.mjs`. EN/RU copy follows Issue #6 masterplan and `docs/psitrends-content-map.md`; the two existing Toronto pages provide service-copy and consent-model baselines. No pricing, credentials, testimonials or business results are invented.

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

Portrait: the user-supplied library/desk photograph is stored as `andy-library-desk.png`, processed by the project asset optimizer, and used only on Home and About. The previous local portrait remains on the other client pages. No generated portrait or invented visual evidence is used.

Reviews: About uses the same complete localized photo/video review renderer as Home, after the complete author biography. EN contains 21 video and 13 photo reviews; RU contains 41 video and 37 photo reviews. No testimonials are invented.

Author-profile verification: `node integrations/psitrends-client/author-profile-qa.mjs` checks all 14 local pages at four widths. `--stage` checks Home/About in native staging Joomla; `--live` checks all 14 public routes. It verifies full biography text, review order/counts, portrait proportions, navigation and overflow.

No dependency install or image generation is needed. Browser QA uses installed Chrome; js_repl is unavailable in this session, so equivalent reusable Playwright contexts and the repository audit were used.
