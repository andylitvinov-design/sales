> **Release update, September 22 UTC:** Auth restored; production deployed and verified; GBP P1 edits executed. Earlier no-auth/no-deploy statements below describe the initial baseline. Current state: [release-and-gbp-execution.md](release-and-gbp-execution.md).

# Routing, measurement and claims

## Production source boundary

- Selected repository: andylitvinov-design/sales. Canonical path `/Users/andriilitvinov/projects/MYPROJECTS/sales`; legacy path is a symlink. Initial local branch main at 4d4763a was four commits behind the actual default `codex/bootstrap-sales`. Work branches from fetched 9fafc6a.
- README and docs/DEPLOY identify Cloudflare Pages project `sales-bwa-photo`, public root https://sales-bwa-photo.pages.dev/. Public root fetched successfully. No GitHub Actions runs returned. No automatic branch-to-production deploy was established.
- Live psitrends.com returned HTTP 200, Joomla markup, template `tx_valley`, nginx/1.29.8 and PHP/8.1.34. This is not evidence that the similarly named Cloudflare inventory project serves Joomla. Provider/origin, source repository, branch and deployed commit remain unverified.
- `psitrends-work` GitHub AGENTS/catalog explicitly describes an ops/editorial repository, not the Joomla source. Local catalog checkout was absent. No proven runnable Joomla source was found in this scope. Do not change guessed repositories.
- Exact Joomla follow-up: owner must supply the hosting/source mapping for psitrends.com and authorized Joomla editorial/deployment access. Route the work to that actual source (or authenticated Joomla editor if production is CMS-managed). Add a Toronto-services menu link to the verified sales hypnosis URL after it is live. If hosting the content on Joomla instead, implement aliases `/hypnotherapy-toronto` and `/systemic-constellations-toronto`, regenerate canonicals and sitemap for psitrends.com, and 301 the corresponding sales routes. Do not publish duplicate canonical copies. Review existing protected-title/clinical copy separately in that source.

## Publication package

`node scripts/build-toronto-public.mjs` builds only an explicit allowlist into ignored `output/toronto-public`. It preserves the existing Russian root, adds the two English pages and navigation, writes a sitemap, allows crawling, and provides a real 404. Cloudflare Pages uses extensionless HTML URLs; links with `.html` are valid entry points and redirect on Pages. Canonicals target the documented sales host, not psitrends.com. Unknown street/office eligibility means Service + Person schema, without invented address, opening hours, credentials or reviews.

Cloudflare read-only auth check: `npx --yes wrangler whoami` failed because the saved authentication expired and refresh was unavailable. No publish attempted. Owner next step is renew Cloudflare authentication, then:

1. `node scripts/build-toronto-public.mjs`
2. `npx wrangler pages deploy output/toronto-public --project-name sales-bwa-photo --branch codex/toronto-local-seo-client-acquisition` (preview)
3. Verify actual preview's two routes, stylesheet/script, image, contact links, 404 and redirects. Preview must stay noindex through Cloudflare's preview policy; confirm response headers.
4. After normal PR review and release policy, deploy the same allowlist to the project's verified production branch. Discover that branch in Pages settings first; do not infer it from GitHub.
5. Confirm live 200, `.html` redirect, canonical, sitemap, robots and contact flow before changing GBP booking/website destination. Do not deploy the repository root: it includes internal docs and experimental pages.

## Tracking contract

Campaign convention: `utm_source=google&utm_medium=organic&utm_campaign=gbp`. Only this exact triple is recognized and propagated between owned pages. Unknown/free-text parameters, referrers, identifiers and messages are excluded. No cookies, persistent visitor storage or network analytics collector is installed.

Implemented `sales:acquisition` CustomEvent payloads: `landing_view` and `contact_click`, with allowlisted landing slug, source/medium/campaign and contact_method (`whatsapp`, `call`, `telegram`). These are in-memory integration hooks, NOT stored analytics and NOT paid conversion evidence. Attach listeners before deferred script execution. A future collector requires a real property ID and consent/privacy review; no invented GA4/GTM ID.

WhatsApp prefill carries service-page slug and “Found through Google Maps” for the exact GBP campaign. The visitor chooses whether to send. This makes source visible in the real enquiry without automatic transmission to an analytics vendor. Static no-JS links still reach the verified number. Call and Telegram cannot carry confirmed booking attribution with the current setup.

There is no form, calendar or payment endpoint to observe. Never fire generate_lead, booking, purchase or revenue from a click. Owner can record aggregate weekly counts privately: period, source, landing, enquiries, qualified enquiries (service fit + Toronto/format fit + willingness to consider fee), consultations booked, paid clients, revenue/currency. Deduplicate returning clients in the existing private workflow; never commit client rows. Blank means unavailable, not zero. Use actual confirmed booking/payment records for downstream status.

## Regulatory review

- [Ontario Homeopathy Act](https://www.ontario.ca/laws/statute/07h10): restricted title and representations require membership; registration was not verified. No homeopathy funnel or protected title added.
- [CRPO jurisprudence manual](https://crpo.ca/wp-content/uploads/2024/09/Professional-Practice-and-Jurisprudence-JRP-Manual-Apr2525.pdf): controlled-act/title obligations must be assessed against actual service, not a marketing label. Ontario Psychotherapy Act direct fetch returned 403, so no claim of exhaustive legal verification.
- New copy avoids diagnosis, cures, trauma treatment, serious-disorder claims, regulated designations and guaranteed results. Hypnosis is framed around goals/reflection; constellations cannot prove family facts or predict business results. No accreditation is invented. This is a conservative content review, not a determination of professional authorization.
- [Google representation rules](https://support.google.com/business/answer/3038177?hl=en): real-world identity, accurate location, limited categories and one profile per real business. No duplicate profile, name stuffing or fabricated office.
- [Local ranking guidance](https://support.google.com/business/answer/7091?hl=en): relevance, distance and prominence; no promise of rankings.
- [Service-area guidance](https://support.google.com/business/answer/9157481?hl=en): confirm actual operations before hiding/showing address.
- [Google contribution policy](https://support.google.com/contributionpolicy/answer/7400114?hl=en): review request is neutral, without incentives or gating.

## QA inventory

Check both pages' HTTP loads, English headings, unique metadata, JSON-LD parse, consistent phone, owned internal links, FAQ open/close, first-screen CTA, 375/390/430/768/1440 widths, focus and overflow. Test exact GBP attribution through internal navigation, malformed/unapproved UTMs, click-event semantics, JavaScript-disabled CTA fallback and unknown routes in deploy package. Inspect real screenshots. Report runner fixes separately from page failures. No claim of live deployment or paid-client improvement until measured.

Local publication verification used `wrangler pages dev` without account authentication: both clean service URLs 200; `.html` entry 308 to clean URL; sitemap and robots 200; unknown route 404. This validates the bundle locally, not a remote deployment. `https://psitrends.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` returned 200 and retained the query in the effective URL during read-only HTTP verification.
