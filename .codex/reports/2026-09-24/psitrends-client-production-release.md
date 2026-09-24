# PsiTrends native client release

Released 2026-09-24 UTC after an isolated restore from the `20260924T044840Z` full files-and-database checkpoint. The first-party client layer is now live on `psitrends.com`.

## Released scope

- Twelve native Joomla EN/RU client routes: home, hypnotherapy, systemic constellations, about, Academy and contact.
- The release runner created a separate `psitrends_client` template and page-specific styles. It preserved all-language menu 101 and Quix content; only ordinary hit counters are excluded from the invariant.
- `robots.txt` now declares `https://psitrends.com/sitemap.xml`; that sitemap is a 12-route first-party client sitemap with reciprocal EN/RU hreflang entries. Legacy URLs were not deleted or redirected by this batch.
- The temporary Cloudflare service URLs, including `.html` and trailing-slash variants, now return 301 to their equivalent first-party URLs while retaining query parameters. The Cloudflare root remains unchanged.

## Recovery

The guarded release journal and its captured before-state are private on the production host. Use the runner's explicit `rollback` mode only with its matching private configuration and journal; do not delete a journal or issue direct database writes. It restores the two language homes through Joomla models and unpublishes only newly-created client records.

For the separate sitemap batch, a private pre-change `robots.txt` and manifest are retained with the deployment. Roll back by restoring that saved robots file and removing `sitemap.xml` only after its hash matches the recorded deployed sitemap. Reversing the Cloudflare consolidation requires changing the reviewed migration flag, rebuilding only `output/toronto-public`, and redeploying that bundle; it must not be used while first-party canonical pages remain live without a new canonical review.

## Verification

- Fresh isolated staging completed guarded apply, rollback and reapply with all 36 durable operations.
- Public EN/RU client routes returned HTTP 200 after production apply; the pre-release service URLs had returned 404.
- Production metadata emitted self canonicals and true EN/RU alternate links. `sitemap.xml` returned 200 with 12 entries and `robots.txt` points to it.
- Live Playwright checks found no desktop or 390px mobile overflow, a visible hero CTA, six mobile navigation links, default-off analytics consent and durable opt-out.
- A blocked vendor request confirmed GTM is requested only after explicit consent. A prevented WhatsApp click produced `contact_click` with `/hypnotherapy-toronto` and `whatsapp`; no contact message or analytics hit was sent during verification.
