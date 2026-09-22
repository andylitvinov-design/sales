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
- next: Google services moderation/publication check; Joomla production routing in issue #4; record actual qualified/paid outcomes in scorecard
- psitrends.com boundary: live Joomla/PHP; real production source/branch not established; see routing report

- release evidence: `.codex/reports/2026-09-21/release-and-gbp-execution.md`
- measurement: Cloudflare page visits/performance active and receipt/readback verified; CTA adapter is in-memory, not a persisted conversion report
