# Issue #4 — Joomla routing and existing analytics

## Request
Recover the real psitrends.com production source/access from existing context; add reversible navigation to the two live Toronto pages; preserve approved GBP attribution; connect an existing authorized event collector. No new landing pages, GA4 property, infrastructure or GBP category changes.

## Verified source and authorization
Existing private project records provided working Joomla administrator access; no owner login or 2FA was needed. Production is Joomla 4.4.0 with Quix/Helix tx_valley, nginx/PHP and database-managed content. Authenticated directory information identifies `/var/www/html`. DNS A `178.105.78.179` and its `clients.your-server.de` reverse record identify a Hetzner origin. This is not the Cloudflare `psitrends` snapshot. No deployable production Git tree was established; the authorized CMS is the source used for this change. Core filesystem is read-only; supported CMS/template configuration is writable. No credentials or session data are included here.

## Production Joomla changes
Published new custom module 129, “Toronto sessions – English navigation”, in `content-top`. It links to the existing hypnotherapy and systemic/family/business constellations pages, with no competing copies/canonical changes. Added the allowlisted UTM helper to the previously empty Custom Javascript fields of English template style 17 and Russian style 21. Exact source records are in `integrations/joomla/`.

Verified English/root and Russian homepage navigation live: exact Google/organic/gbp triple is preserved; extra query parameters are excluded; clean visits retain clean destination URLs. No horizontal overflow at the inspected desktop viewport. Original empty template fields were backed up privately. Rollback: unpublish module129 and restore those two empty fields. Other templates and preexisting menu items are unchanged.

## Existing measurement, safely reused
Public GTM-K2KKDZD and authenticated Tag Manager/Analytics agree on existing PsiTrends GA4 measurement ID G-Z4BGV9GP4N, property361648075, stream4811651129. Existing stream receives traffic and has enhanced measurement enabled. Its reports include legacy traffic from other pages; this work makes no global stream/GTM changes.

The two sales pages now offer explicit optional analytics controls. Google is not loaded before consent, on previews/local hosts, with DNT=1, or with unexpected query parameters/fragments. Consent is remembered; withdrawal disables collection, removes this site's GA cookies and reloads without Google. Advertising consent is denied. Page/referrer values are sanitized. Existing Cloudflare visit/performance measurement remains separate.

One `contact_click` is sent to the existing stream per contact interaction, with allowlisted `landing_page`, `contact_method` and `acquisition_source`. Existing stream enhanced measurement may additionally collect page/scroll/outbound-link events. Outbound destinations are fixed business links and generic predefined messages, never entered enquiry text. No CRM, bookings or paid revenue is inferred from clicks. No key-event promotion or Ads conversion import was made.

Implementation references: [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent), [GA4 configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config), [enhanced measurement](https://support.google.com/analytics/answer/9216061?hl=en).

## Verification
- `npm run check`: passed.
- Full local audits for both service pages: html-validate, stylelint, pa11y, linkinator, Lighthouse and Playwright passed; Lighthouse100/100/100. Existing mobile hero-height advisory remains, no horizontal overflow.
- Consent integration test: clean URL, approved GBP URL, unapproved synthetic email parameter, default off, single CTA event and withdrawal all passed. Google was intercepted for these tests.
- Final preview: https://59c78c0b.sales-bwa-photo.pages.dev . Route/canonical/schema/robots/sitemap/404/UTM redirect verification passed; hosted audit passed. Preview SEO score69 reflects intentional preview noindex; accessibility/best-practices100.
- Live release and GA4 receipt/readback: recorded below after verification.

## Next action
Use contact clicks as an enquiry-intent diagnostic; record actual qualified/paid outcomes separately in the existing acquisition scorecard. No owner authentication blocker was encountered.

## Release evidence
Production Pages deployment `fdd17542` serves the final preview-tested allowlist. Live routes, assets, canonical/schema, indexability, sitemap/robots, HTML redirects with UTM and private-path404 checks passed. Synthetic CTA receipt in `verification/ga4-receipt.json` confirms a single contact_click HTTP204 to G-Z4BGV9GP4N, with expected page/contact fields and empty referrer. No external message was sent. Dashboard build completed across24 existing pages.

Final production full audit passed with Lighthouse accessibility/best-practices/SEO100/100/100. Public Joomla EN/RU mobile checks at390×844 passed navigation, exact UTM allowlist and no horizontal overflow. Captured navigation screenshots are in ignored `reports/`; sanitized JSON evidence is versioned alongside this report.
