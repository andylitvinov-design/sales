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
- delivery state: local implementation; Cloudflare saved auth expired; no live publication or GBP edits
- report: `.codex/reports/2026-09-21/toronto-client-acquisition.md`
- next: review PR, renew Cloudflare login, verify preview; follow GBP manual sheet only after owner baseline
- psitrends.com boundary: live Joomla/PHP; real production source/branch not established; see routing report
