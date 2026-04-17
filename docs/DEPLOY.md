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
