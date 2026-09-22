# Native client layer acceptance

2026-09-22. Isolated host clone only; client production release remains pending.

Twelve EN/RU pages render through native Joomla articles and per-menu template styles. Supported Article-model edit, rendered synthetic-marker readback, exact restore, restricted-viewlevel anonymous403 with article body absent, and Public restore200 all passed. Full migration rollback and reapply passed. Original all-language home menu101 and Quix content were preserved; normal hit counters were excluded from content invariants.

Browser checks confirmed readable desktop/mobile layout, no horizontal overflow, correct Russian-to-English navigation with Joomla language-cookie handling, and preview analytics remaining off after the explicit Allow control. Only the local client script was present; no external analytics loader was added. Contact destinations were inspected without sending messages.

The expanded inventory contains263 meaningful Joomla query URLs in addition to178 existing crawl URLs. The unified447-row map also includes six exact Cloudflare service variants. It preserves every legacy URL, identifies the seven malformed article records and their11 failing query variants, and gates six first-party service redirects on verified production targets. Missing search/booking metrics remain unavailable, never zero.

An outstanding routing regression was identified during legacy repair testing: bare legacy article queries inherited the new client homepage template and returned404. This must be resolved and the full query inventory retested before production promotion. Passing twelve new routes alone is insufficient.

## Search Console ownership release prerequisite — completed

The old homepage GTM loader was the original verification method. A standalone Google HTML verification file was added without overwriting an existing differing file; its public response was HTTP200 with the exact verification body. The authenticated Search Console ownership screen then reported HTML-file verification successful alongside GTM. Preserve the existing verification file during future deploys and backup restores. Its exact filename/token is kept in private operational evidence, not Git. Search performance/indexing reports still state that data is processing.

## Evidence and remaining release checks

Private supported-save/ACL, rollback, reapply and language evidence are retained by the site steward. Public static page audits and functional checks are committed with PR10. The guarded production installer, complete legacy routing regression, first-party indexability, live analytics/consent, sitemap submission and Cloudflare redirect release are separate gates. No production client release or platform modernization is claimed by this report.
