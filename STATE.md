# STATE

- current goal: использовать `sales` как простой cloud-ready набор лендингов с одной понятной публичной точкой входа
- current task: зафиксировать канонический deploy и сократить хаос между вариантами страниц
- repo role: runtime-витрина продающих страниц; здесь лежат конкретные HTML/CSS лендинги, CTA, секции, deploy и quality-check
- architecture boundary: `andrey-system` хранит бизнес-упаковку и офферы; `alchemy-method` хранит метод; `sales` публикует это как продающие страницы
- working rule: не создавать новую страницу, если можно улучшить текущий канонический лендинг
- canonical landing: `landing-services-bwa-photo.html`
- canonical deploy: `https://sales-bwa-photo.pages.dev/`
- next step: выбрать основной лендинг, подключить GitHub browser editing и продолжать работу от него, а не от всех вариантов сразу

## Toronto acquisition — 2026-09-21

- issue: https://github.com/andylitvinov-design/sales/issues/2
- branch: `codex/toronto-local-seo-client-acquisition`
- added English entry: `hypnotherapy-toronto.html`; related `systemic-constellations-toronto.html` includes family/business intent
- canonical Russian root preserved; new Toronto link added
- public package: `npm run acquisition:build` → `output/toronto-public` (allowlist only)
- delivery state: production live on Cloudflare Pages; deployment `8b44c078`, code `a08d7b9`; owner GBP P1 changes submitted, website publicly verified
- report: `.codex/reports/2026-09-21/toronto-client-acquisition.md`
- next: Google services moderation/publication check; record actual qualified/paid outcomes in scorecard
- psitrends.com boundary: authorized Joomla CMS established at /var/www/html on a Hetzner origin; module129 and template17/21 changes connect both existing Toronto pages; no deployable Git source found

- release evidence: `.codex/reports/2026-09-21/release-and-gbp-execution.md`
- measurement: Cloudflare page visits/performance active and receipt/readback verified; existing PsiTrends GA4 G-Z4BGV9GP4N now receives consented contact_click events; clicks are intent proxies, not qualified leads or payments

## Joomla and analytics — 2026-09-22

- branch: `codex/psitrends-joomla-routing`
- deployment: Cloudflare Pages `fdd17542`; production route checks passed
- report: `.codex/reports/2026-09-22/joomla-routing-and-analytics.md`
- rollback: unpublish Joomla module129; restore empty Custom Javascript in styles17/21; revert sales changes and redeploy the allowlist

## PsiTrends stewardship —2026-09-22

- issue: https://github.com/andylitvinov-design/sales/issues/6
- branch: `codex/psitrends-stewardship`
- access: Joomla credential in macOS Keychain; fresh-session recovery verified; no secrets inGit
- backup: private full Akeeba ZIP, CRC/SHA256 verified;104-table isolated local restore and EN/RU/serviceHTTP200; production host restore unverified
- shipped safe change: redirect1 `/express-ru`→`/ru/express-ru`,301; plugin177 enabled with URL collection disabled
- Search Console: URL-prefix ownership verified via existingGTM; reports processing; domainproperty not accessible
- report: `.codex/reports/2026-09-22/psitrends-full-audit.md`; durable runbooks `docs/psitrends-*.md`
- gate: Hetzner owner recovery/2FA and authorized host access; configuration read-only, Quix editor fails; no production upgrade/redesign
- preserve: module129/styles17/21, exactGBP UTM, both existingToronto acquisition pages, unchangedGBP primary category
