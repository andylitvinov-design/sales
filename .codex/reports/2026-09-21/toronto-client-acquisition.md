> **Release update, September 22 UTC:** Auth restored; production deployed and verified; GBP P1 edits executed. Earlier no-auth/no-deploy statements below describe the initial baseline. Current state: [release-and-gbp-execution.md](release-and-gbp-execution.md).

# Toronto client acquisition — issue #2

Status: IMPLEMENTED / VERIFIED LOCALLY; external publication and GBP edits blocked by authentication. No claim of new paid clients yet.

## Request and source

Execute [sales issue #2](https://github.com/andylitvinov-design/sales/issues/2), including its complete Master Codex prompt. Read AGENTS.md, STATE.md, local landing skill and `.codex/CLOUD_TASK_REPORTING.md`. Current repo and origin confirmed. Branch `codex/toronto-local-seo-client-acquisition`, based on actual GitHub default `codex/bootstrap-sales` at 9fafc6a. No unrelated changes were present.

## Findings and implemented changes

- Public Google Maps profile positively matched by phone/address; full baseline and manual changes in [GBP sheet](gbp-change-sheet.md). Category, name and address untouched. No duplicate GBP created.
- [68 query candidates](toronto-query-research.csv), [ranked Top 16 and competitor observations](research-and-positioning.md). Direct Maps observations for hypnosis, family constellations and brand. Candidate expansions clearly separated from measured demand; no volumes invented.
- Added two distinct English landing pages: hypnotherapy with Deep Change process, and systemic/family constellations with a business section. Supporting Reiki and symbolic work stay secondary. No redundant family, Reiki or individual problem pages.
- Practitioner identity, verified phone/WhatsApp/Telegram, one primary enquiry CTA, qualification/fee/availability expectations, mobile layout, native FAQ, related-service links, canonical/OG/Service JSON-LD.
- One navigation link on existing canonical Russian landing opens Toronto acquisition flow. Existing page content is preserved.
- Lightweight privacy-safe contact event hooks and allowlisted GBP attribution; WhatsApp source prefill supports manual source recognition. No analytics collector/CRM or invented bookings/revenue.
- Explicit public build allowlist, sitemap, robots and 404. Quality runner resolves the required `/sales/` local URL from canonical MYPROJECTS path and uses installed Chrome for pa11y on macOS when no executable override exists.
- [Routing, tracking and claims review](routing-tracking-claims.md) records Joomla source boundary and exact follow-up. New content contains no protected professional titles or unsupported medical promises. Existing psitrends.com claims require a separate source-routed review.

## Before / after

Before: generic Russian service entry, several competing format/contact choices, no dedicated English Toronto entry, no Toronto canonical/schema or acquisition-event contract in this funnel. Repo index is a different experimental page; deployment builder deliberately uses the documented canonical Russian page as root.

After: two focused English service entrances, linked from canonical page, first-screen CTA at all five tested widths, 200/308 clean-route handling and real 404 in local Pages runtime. GBP remains unchanged; it has a recorded baseline and ready-to-paste descriptions rather than speculative live edits.

## Verification

See [verification summary](verification.md) and committed compact evidence under `verification/`. Raw Lighthouse output and screenshots remain in `reports/`; selected evidence is copied into this dated report for GitHub persistence. Remote deployment is not verified.

## Remaining external requirements

1. Renew Cloudflare login to enable a preview deployment; inspect preview and follow normal PR/release policy before production. Exact commands are in routing notes. Auth check reported expired token; no deployment attempted.
2. Owner GBP login: capture full categories/Performance and execute applicable rows in change sheet. Public “Education center” does not prove the complete category set. Name-policy, address eligibility, schedule and current fees require factual owner evidence.
3. Provide actual psitrends.com Joomla hosting/source mapping for any production-domain changes; sales and psitrends-work are not proven Joomla sources.
4. Connect an authorized analytics/booking source if automatic reporting is wanted. Until then use the private aggregate scorecard; click ≠ qualified lead ≠ booking ≠ paid client.

Next action: review this PR and restore Cloudflare authorization for preview publication. Do not change GBP category as part of that deployment.

GitHub delivery: [PR #3](https://github.com/andylitvinov-design/sales/pull/3), implementation commit `6c84d53`. PR is open against `codex/bootstrap-sales`; no hosted CI checks are configured/reported. No merge or production deployment performed.
