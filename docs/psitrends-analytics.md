# PsiTrends measurement

Updated 2026-09-24. Keep acquisition intent separate from actual business outcomes. No new GA4 property, ad account, CRM or paid measurement infrastructure was created.

## Current first-party release

The 12 native EN/RU client routes now use a single consent-gated GA4 loader, not the legacy GTM container. Public production verification on September 24 observed zero vendor requests before consent; explicit consent produced HTTP204 `page_view` and `contact_click` receipts for `G-Z4BGV9GP4N`. The contact event carried landing `/`, method `whatsapp`, source `google_maps`, and campaign `google / organic / gbp`. Consent withdrawal reloaded with no vendor scripts. Synthetic test traffic is not an enquiry or booking. Legacy pages retain their historical instrumentation; the client-template conclusion does not certify the entire archive.

The first-party sitemap now returns 200 with 12 canonical EN/RU URLs, is declared in robots.txt, and was submitted through the existing Search Console property on September 24. Google reports successful sitemap processing with 12 discovered URLs. Homepage, Hypnotherapy and Constellations live inspections passed crawlability/indexability; all three recrawl requests were accepted. The two new services are discovered but not yet indexed: actual indexing is asynchronous. Public Maps still exposes the exact first-party homepage GBP UTM link, so no destination edit was required.

See [release and rollback evidence](psitrends-three-pillars-release.md). The September 22 findings below are a historical baseline, superseded for these released client routes.

## Existing stack

| Surface | Existing resource | Evidence |
|---|---|---|
| GA4 | Measurement`G-Z4BGV9GP4N`; property361648075; stream4811651129 | Issue4 live204 receipt and authenticated realtime2 synthetic`contact_click` events |
| GTM | `GTM-K2KKDZD`, account6080518439/container106700013/workspace6 | Existing GA4 configuration tag and Telegram/WhatsApp click tags inspected; no publish this task |
| Cloudflare | Existing sales Pages/Web Analytics | Page/performance collection; not durable custom CTA event storage |
| Search Console | [https://psitrends.com/ URL-prefix](https://search.google.com/search-console?resource_id=https%3A%2F%2Fpsitrends.com%2F) | Ownership verified automatically through existing GTM2026-09-22; reports processing, no submitted sitemap |
| Domain GSC property | `sc-domain:psitrends.com` | Not accessible; URL-prefix property is verified and usable without DNS access |
| GBP | Existing Holistic House profile | Owner controls previously verified; primary category remains Education center |

Search Console ownership is now independently verified by a static Google HTML file on the production origin (2026-09-22). The exact body returned HTTP200 and Search Console explicitly reported successful HTML-file verification, alongside the existing GTM method. Preserve that existing `google*.html` file through deployments and restores; its exact token stays outside Git. The new client template may therefore omit the old GTM loader without depending on consent to retain ownership. Future Google authentication can require owner2FA; no Google cookies/passwords were exported.

## September 22 instrumentation baseline (historical)

The two Cloudflare Toronto pages use the existing consent-gated`toronto-ga4.js`. Analytics defaults off; ads denied; DNT and unexpected query-string guards retained. Existing attribution helper passes only`utm_source=google&utm_medium=organic&utm_campaign=gbp` through Joomla navigation. Keep the exact convention.

Public source sampled on EN home/RU home/English hypnotherapy shows one GTM loader each, no separate inline GA4 identifier and no inline consent command. This excludes an obvious duplicate static loader; it does **not** prove container runtime has no duplicate events or compliant first-party consent. First-party Joomla consent is a P0 staging task. Do not copy the sales consent conclusion onto Joomla. Review GTM consent settings and all embeds before expanding tracking.

Use`contact_click` with the existing payload implementation; dimensions`landing_page`, `contact_method`, `acquisition_source` only when non-sensitive and validated. Do not rename fields without migrating reporting. No health history, names, free text, email, phone or arbitrary URL query parameters in analytics.

## September 22 baseline limits (historical)

Search Console newly verified URL-prefix reports show “data processing; try again in approximately one day.” Clicks, impressions, indexing totals, query split, backlinks and field CWV are **unavailable**, not zero. No sitemap currently submitted; root`/sitemap.xml`404. Do not submit a nonexistent sitemap or blanket request indexing of legacy claim-risk pages.

The prior two synthetic GA4 events prove collection only. Qualified enquiry, booking, paid client and revenue are unknown until reconciled to actual owner records. Audit visits and test events may affect raw traffic; annotate2026-09-22.

## Weekly scorecard

Use [the existing scorecard](../.codex/reports/2026-09-21/acquisition-scorecard-template.csv); one row per week with period/timezone/source/export date. Record:

| Stage | Source | Rule |
|---|---|---|
| GBP search/views/clicks/calls/directions | GBP Performance | Preserve platform definitions; unavailable is blank with reason |
| Organic clicks/impressions/query/page | Search Console | Segment brand/non-brand and Toronto intent after data populates |
| Relevant acquisition sessions | GA4 | Consent-limited; do not combine with CF visits as one denominator |
| Contact intent by method/source | GA4`contact_click` | Deduplicate sessions where useful; not a lead count |
| Actual enquiry | Owner's existing enquiry record | Real message/phone enquiry only |
| Qualified enquiry | Owner fit assessment | Explicit fit, location/format and willingness to pay |
| Booked session | Actual appointment record | Not merely messenger click |
| Paid client/revenue | Actual payment record | No inferred revenue or fabricated missing values |

North star: qualified paid clients / relevant acquisition visits, with consent and attribution limitations disclosed. Small samples do not support aggressive A/B testing.

## Reviews and privacy

Use only the previously verified GBP review link from the acquisition report. Neutral owner message: “Thank you for your visit. If you would like to share your experience, you can leave an honest Google review here: [leave a Google review](https://g.page/r/CT0jS16IuG4wEBM/review). There is no obligation.” The owner-generated link was verified in the2026-09-21 release report. No client outreach is authorized by this audit.

Respond briefly and generally; never confirm a reviewer's client status, modality, health concern, attendance or private results. Use testimonials only with documented consent and context. Extraordinary outcomes are not typical-result promises.
