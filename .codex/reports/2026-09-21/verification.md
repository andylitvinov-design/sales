# Verification — 2026-09-21 Toronto / 2026-09-22 UTC

| Target | html-validate, stylelint, pa11y, linkinator, Lighthouse, Playwright | Lighthouse accessibility / best practices / SEO |
|---|---|---|
| hypnotherapy-toronto | PASS | 1 / 1 / 1 |
| systemic-constellations-toronto | PASS | 1 / 1 / 1 |
| landing-services-bwa-photo | PASS | 1 / 0.96 / 1 |

Commands: `npm run check`; `npm run page:audit -- hypnotherapy-toronto.html`; `npm run page:audit -- systemic-constellations-toronto.html`; `npm run page:audit -- landing-services-bwa-photo.html`; `npm run acquisition:build`; `node --check toronto-acquisition.js`; `git diff --check` — pass. No typecheck or application test script exists. The unrelated dashboard generator was not required for this static page change.

Initial lint errors were corrected. pa11y initially could not locate its bundled Chromium; the audit now falls back to installed macOS Chrome, matching its existing Playwright channel, unless an executable override is supplied. Both new pages now score 100/100/100 in the configured Lighthouse categories. This does not measure field Core Web Vitals or claim a performance score. The legacy page retains a 96 best-practices score from its favicon 404; its modified navigation and all required checks pass.

Playwright: 375x667, 390x844, 430x932, 768x1024, 1440x900 — no horizontal overflow and primary CTA fully within the initial viewport on both new pages. Desktop hero fits. Mobile full hero includes the portrait below the fold, producing an advisory taller-than-viewport warning; CTA remains visible. Visually reviewed desktop screenshots and small-phone CTA screenshot. Existing public portrait reused; no new bitmap or image editing, so asset optimization is not applicable. A less theatrical authentic portrait may improve audience fit later, but no new likeness was fabricated.

Functional checks: exact GBP UTM triple propagated through internal navigation, including Cloudflare extensionless redirect; unknown query fields not propagated; unknown source labelled unattributed; in-memory payloads contain only approved fields; no cookies created; contact clicks produce contact_click, never booking/purchase; WhatsApp prefill includes source only for valid GBP triple; native FAQ opens; focusable links present; JavaScript-disabled CTA still points to correct WhatsApp number. Click navigation was intercepted in QA to avoid messaging or initiating calls. No client message was sent.

Local `wrangler pages dev` bundle: clean routes 200; `.html` 308; sitemap/robots 200; unknown route 404. Verified source phone against live site and Maps. HTTPS website UTM destination retained its query and returned 200. Cloudflare remote preview is blocked by expired authentication. No live post-deployment test claimed.

Raw outputs remain in repository `reports/` (gitignored). Compact JSON and selected screenshots are committed here. Interactive tools briefly lost a browser target under concurrent Chrome activity; a fresh persistent session completed the stated checks and was closed afterwards.
