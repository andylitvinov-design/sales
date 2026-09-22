# Autonomous release execution — 2026-09-21 Toronto / September 22 UTC

Contract: latest Autonomous completion directive on issue #2. Continuation of PR #3; research not repeated.

## Authenticated baseline and GBP changes

Existing owner Google session recovered; Cloudflare Google sign-in recovered and Wrangler OAuth refreshed with account read, user read and Pages write only. No new account, password sharing or 2FA bypass. Raw GBP baseline is private at `~/.local/share/sales-private/2026-09-21` (directory 0700, files 0600), outside Git and deploy bundle.

Before edits captured identity, only primary category Education center (Образовательный центр), no secondary categories, legacy combined service, description, HTTP website, phone, booking (unset), full weekly hours, address, service area (unset), Performance and all available query rows. Performance April–September 2026 (September partial): 863 views, 252 interactions, 232 directions, 20 website clicks, 0 recorded call clicks and 0 platform bookings. These are platform counters, not actual client/call/booking/revenue counts. Query data is censored, with 11 reported query rows each <15; absence of hypnotherapy in this short censored list does not negate the reported paying client.

| Field | Executed change | Status at last check |
|---|---|---|
| Website | HTTP www → `https://psitrends.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` | Accepted in owner editor; exact URL verified in public Maps |
| Description | Exact approved paragraph in gbp-change-sheet.md | Accepted in owner editor, pending indicator cleared; public Maps layout does not expose description |
| Services | Added Hypnotherapy, Systemic Constellation Session, Family Constellations, Business Constellations, Reiki / Energy Work with exact approved descriptions | Accepted in owner editor; review banner cleared on final re-open; public Maps layout does not expose these service details |
| Existing service | Reiki, Hypnotherapy, Energy healing, Spiritual counseling | Preserved |
| Category/name | Education center and existing full name | Unchanged |
| Phone/address/hours | Existing values | Unchanged |
| Booking | Existing field unset | Kept unset: enquiry page does not complete an appointment reservation; avoid mislabelling it as booking |
| Photos | Existing photos | Preserved; no new verified room/signage/consented client assets available |

Hours recorded: Sun/Mon/Tue 14:30–19:00; Wed/Thu/Fri 14:30–20:00; Sat 14:00–20:00. This confirms configured hours only, not actual staffing. Address shown is 10 Navy Wharf Court, Toronto ON M5V 3V2. Real-world customer-facing/signage eligibility cannot be inferred from Maps or building type. Do not invent or change these facts.

Category decision: preserve primary now. Hypnotherapy has first-party conversion evidence, but authenticated performance is censored and attribution of a category change during the P1 content/link release would be weak. Hypnotherapy service remains a future one-variable experiment after an undisturbed baseline and confirmation that it represents the core practice. No duplicate profile created.

## Review workflow ready

Exact owner-generated link: https://g.page/r/CT0jS16IuG4wEBM/review

Thank you for your session. If you would like to share your experience, you can leave an honest Google review: https://g.page/r/CT0jS16IuG4wEBM/review. In your own words, you may mention the type of session and what the experience was like. Please share only what you are comfortable making public. All feedback is welcome, and there is no obligation.

No client messages sent. Ask consistently without rewards, rating requests or keyword scripts.

## Measurement

Existing Cloudflare account initially had no Web Analytics sites. Configured free site measurement for sales-bwa-photo.pages.dev. Public beacon site ID is embedded in toronto-analytics.js; this is not an API secret. Beacon runs only on the production hostname, respects DNT, skips unexpected query keys/values and arbitrary fragments. No cookies/storage, CRM, client text or custom CTA payloads are added. Local and preview traffic excluded. Eight guard cases passed.

Cloudflare measures visits/performance, not CTA events or UTM campaigns ([official limitations](https://developers.cloudflare.com/web-analytics/faq/)). Existing `sales:acquisition` events remain an in-memory adapter, not a persisted event report. GBP UTM is propagated between landing pages and included as source context in WhatsApp enquiry text. Owner scorecard separates enquiry → qualified → booked → paid; revenue remains unavailable until actual owner entries. No existing GA4/GTM configuration was found; no invented measurement ID or click-to-revenue claim.

## Deployment evidence

Cloudflare Pages project sales-bwa-photo is Direct Upload, no Git connection. Production deployment branch is `main`; GitHub default is `codex/bootstrap-sales`. These are different controls. Previous production rollback target: 81d9e443-f9d2-446a-8c1b-32d0cc01f21d (source 0036e9d).

Initial preview from a49df5a: https://eb304768.sales-bwa-photo.pages.dev. Both new routes passed hosted accessibility, best practices and layout checks. Preview SEO 69 is the expected Cloudflare preview `X-Robots-Tag: noindex`, not a production rule. Final release adds root canonical/favicon and privacy-safe page measurement. Final preview/production evidence follows below.

Final preview: https://5d1636cc.sales-bwa-photo.pages.dev — deployment `5d1636cc-8cb4-49b5-8865-59e6e0fb92ac`, code `a08d7b908b8aaf4871322bc9e3848ad3a569eddc`.

Production: https://sales-bwa-photo.pages.dev — deployment `8b44c078-4a9e-43c4-bbca-55c653284426`, same code. Immutable release: https://8b44c078.sales-bwa-photo.pages.dev. Pages confirms environment Production, branch main. Later report-only commits do not alter the public bundle.

`verify-toronto-live.mjs` passed on final preview and production: all three HTML entries 200, assets 200, exact production canonical/metadata, parseable schema, .html→clean 308 retaining UTM, robots/sitemap 200, genuine missing-route404, STATE/.codex inaccessible404. Preview noindex is present as expected; production has no indexing block. Existing root alias consolidates via root canonical.

All three production entries (including the Russian root): Lighthouse accessibility/best-practices/SEO 100/100/100, pa11y and linkinator passed, desktop1440/mobile390 no horizontal overflow, screenshots visually reviewed. Mobile primary CTA is visible before the image. Full mobile hero height warning is advisory and documented. Three local pages passed html-validate/stylelint/pa11y/lighthouse/linkinator/Playwright. `npm run check`, `npm run dashboard:build`, `npm run acquisition:build` and `git diff --check` passed. One overlapping root audit stalled in pa11y; terminated only that job and reran sequentially successfully.

Live browser: both page CTAs have correct WhatsApp prefill, Telegram and tel destinations; cross-page navigation retained only approved GBP UTM. Runtime console had no warning/error. Beacon script200 and real Cloudflare ingestion204 were observed; dashboard then displayed 1 visit/1 page view from verification. This is test traffic, not an acquired client. Event harness checked both pages with approved/unapproved attribution: one view and one event per contact click; no free-text parameter leakage. Custom events are not stored by Cloudflare Web Analytics.

## Exact remaining boundaries

- [Issue #4](https://github.com/andylitvinov-design/sales/issues/4): owner must identify/provide authorized access to the actual Joomla hosting/source. Authenticated Pages custom-domains view proves the psitrends snapshot has no custom domain. Exact required navigation/UTM routing is recorded there. No speculative changes to that project.
- Description and five services are accepted in the owner editor. Public Maps exposes the new website but did not render description/services in the inspected layout, so public visibility of those fields is not claimed. No pending/rejected banner remained at final check.
- Configured hours/address were captured, but actual staffing, signage and customer-facing eligibility need owner knowledge. They were preserved. No new images supplied as real premises evidence.
- Reservation field remains unset because current landing is an enquiry flow, not an appointment scheduler. No fake booking link.
- Qualified clients, appointments and paid revenue require actual outcome entries; no source provides them automatically. Use acquisition-scorecard-template.csv. No unsolicited client outreach or review messages.

Final repository gates: GitHub default codex/bootstrap-sales; branch protection endpoint returned404, PR reviews0 and inline review comments0; no hosted CI checks configured. User directive authorizes merge after these local/preview/production gates.
