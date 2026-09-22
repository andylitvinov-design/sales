# Deploy

Updated: 2026-04-12

Project-local supplement for `sales`.

Canonical Cloudflare deploy reference now lives at:

- [Cloudflare inventory](/Users/andriilitvinov/projects/weblinks/apps/cloudflare/inventory.md)

`sales` keeps only the project-specific reminder:

- known public deploy: `landing-services-bwa-photo.html`
- Pages project: `sales-bwa-photo`
- public URL: `https://sales-bwa-photo.pages.dev/`

Minimal pre-deploy check for this repo:

- local page opens via `http://127.0.0.1:8877/sales/<page>.html`
- page assets resolve locally
- deploy bundle contains only required public assets
- no secret file is copied into the bundle

## Toronto acquisition package

For the issue #2 branch, use `npm run acquisition:build`. Publish only `output/toronto-public`, never the repository root. This allowlist retains the canonical Russian root and adds `/hypnotherapy-toronto` and `/systemic-constellations-toronto`, sitemap, robots and 404 handling.

Local Pages verification: `npx wrangler pages dev output/toronto-public --port 8878`.

2026-09-21: saved Cloudflare authentication was expired; no remote deployment was made. Renew login, deploy a branch preview, verify routes and then follow normal PR/production release policy. See [.codex routing report](../.codex/reports/2026-09-21/routing-tracking-claims.md) for exact commands and psitrends.com source boundary.
