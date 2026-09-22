# Latest task

2026-09-22 — Issue #4: Joomla production routing and existing analytics.

Production changes released: Joomla module129 links both language homepages to the two existing Toronto pages; styles17/21 preserve the approved GBP UTM. Working CMS access recovered from private project context; no owner login needed. Production is Joomla at `/var/www/html` on a Hetzner origin, not Cloudflare's static snapshot.

Existing PsiTrends GA4 G-Z4BGV9GP4N connected behind optional consent. Live synthetic contact_click receipt HTTP204 and authenticated GA4 realtime readback verified; no message sent. No new pages/property/infrastructure or GBP category changes. Pages production deployment `fdd17542`; branch `codex/psitrends-joomla-routing`.

[Report and rollback](reports/2026-09-22/joomla-routing-and-analytics.md). Blockers: none for this scoped release. Next: compare consented contact intent with actual qualified/paid outcomes in the existing scorecard. PR/merge and GA4 readback recorded in the report.

[PR #5](https://github.com/andylitvinov-design/sales/pull/5), implementation `195b1df`. Issue #4 acceptance passed; merge closes it.
