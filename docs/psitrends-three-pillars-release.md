# PsiTrends three-pillar production release — 24 September 2026 UTC

Implementation: sales issue #14 (follow-up to #6), PR #15. Acceptance target is the anonymous public [PsiTrends site](https://psitrends.com/), not books/Vercel.

## Released

- Bilingual Alchemy of the Soul homepage with separate consultations, Training & Initiations, and Workshops & Seminars paths.
- Warm ivory/sand/green visual system across all 12 client routes. Single-row mobile branding/language/menu controls; one accessible hamburger, Escape/outside/link dismissal, no-JS navigation fallback.
- Preserved first-party service URLs, About, Contact and Academy gateways. No new credentials, medical promises, dates, prices or testimonials.
- Generated decorative archway photograph, optimized WebP (163,264 bytes). It depicts atmosphere, not the actual practice premises. Existing Andrey portrait retained unchanged. No external font/image requests.
- Bounded update of four content fields on 12 existing articles and five presentation files. No menu, ACL, extension, core or legacy-content mutation.

## Mobile cache incident and fix

Public release verification caught a real discrepancy: desktop rendered the new page while an iPhone user agent still received the old Quix homepage. Joomla 4.4 Redis `clean()` only matches unprefixed site-hash keys; its mobile keys begin `M-`. Stale mobile `com_menus` and `com_templates` entries retained the old routing/template assignment. The generic CLI cache command reported success without fixing this.

`integrations/joomla-client/clear-client-cache.php` scans only this site's exact secret-hash prefix, both desktop and `M-`, and only `com_content`, `page`, `com_menus`, `com_templates`. It never flushes Redis or touches sessions, other sites or unrelated cache groups. The regression self-test checks mobile patterns and exclusions. The production purge removed 15 scoped entries. The isolated stage uses the file-cache branch.

**Run the scoped purge after every apply AND rollback. Verify a genuine mobile user agent, not just a narrow desktop viewport.**

## Backup and staged recovery

Fresh full production checkpoint before apply:

`/var/backups/psitrends/scheduled/20260924T054549Z-95fd857766644da0968127ec4b49a678`

- 104 tables; database gzip SHA256 `656c4686980fa5565e4539e4cacc5c0940391365180704fe658e796655833897`.
- Files archive SHA256 `c0fc2a9aa2eaad58573e12859fd953c8dd389b5a8f5b13ffc146231b2debf7b2`.
- Fresh backup completed successfully; this particular full archive was not independently restored. The existing isolated restored stage completed this batch's apply → rollback → reapply, including exact row/file guards.
- Stage remains internal-network-only, noindex, mail off, analytics off; the local read-only preview proxy does not expose Joomla admin or accept writes.

Private paired state (outside webroot/Git):

| Scope | Release directory | Before snapshot SHA256 |
| --- | --- | --- |
| Stage | `/var/lib/psitrends-releases/redesign-stage-20260924` | `b1435e5eeb7afc17129f37270907bfcfdfb8a7759f9673e137182e2eabc1a7d5` |
| Production | `/var/lib/psitrends-releases/redesign-production-20260924` | `b9b45dfc019b35da3f7ecb9ae6b44163e62471df0bbae4ac36624a0f2b9d79e9` |

The directory contains reviewed package, update runner, cache purge, before-state and journal. Never replace the package after capture. The runner refuses concurrent edits and mismatched scope/package; investigate a failed guard instead of bypassing it.

### Production rollback

On the authorized origin host, with the exact private release directory intact:

```sh
sudo docker run --rm --network psitrends_internal \
  -e PSITRENDS_UPDATE_SCOPE=production \
  -v /opt/docker/sites/psitrends/public_html:/var/www/html \
  -v /var/lib/psitrends-releases/redesign-production-20260924:/update \
  --entrypoint php psitrends-php /update/update-client.php rollback
sudo docker cp /var/lib/psitrends-releases/redesign-production-20260924/clear-client-cache.php psitrends_php:/tmp/clear-client-cache.php
sudo docker exec psitrends_php php /tmp/clear-client-cache.php
```

Then verify public EN/RU and desktop/mobile. `apply` with the same command re-applies this exact package. Rollback restores the prior client design, not the older Quix default home. A rollback removes only the newly-added archway asset when absent in the saved before-state. The database/file operation is guarded and recoverable, not a single filesystem/database atomic transaction; inspect the private journal after interruption.

For stage substitute network `psitrends-client-releasecheck`, scope `stage`, webroot `/var/lib/psitrends-staging/client-releasecheck-20260922/public_html` and stage release directory. No production core/PHP upgrade was made; the separately isolated compatibility gate remains in force.

## Verification

- Nine source/build/migration tests pass; all 12 source HTML pages validate; shared CSS lint passes.
- Full public quality run: pa11y no issues, link check passes, Lighthouse accessibility 100 / best practices 100 / SEO 100. These are lab scores, not field Core Web Vitals.
- `node scripts/verify-psitrends-public.mjs`: 24 cookie-free desktop/mobile EN/RU route checks, 6 Cloudflare 301 variants with exact GBP UTM preservation, 12-entry sitemap, robots declaration.
- All 12 mobile browser routes: no horizontal overflow, 73px single-row header. EN→RU→EN service switching retains the service. Six linked Academy/legacy destinations return 200.
- Actual production screenshots at 390, 768 and 1440 pixels plus mobile Training/Workshops were visually inspected. The old Quix blocks/duplicate menus are absent from the active client journey.
- GA4: no vendor requests before consent; explicit consent produced `page_view` and `contact_click` HTTP204 receipts for existing measurement `G-Z4BGV9GP4N`. Contact method `whatsapp`, landing `/`, campaign `google / organic / gbp`, acquisition `google_maps`. Consent withdrawal reloads with no vendor scripts. This is synthetic contact intent, not an enquiry, booking or payment; no WhatsApp message was sent.
- Public Maps website link remains the correct first-party homepage with `utm_source=google&utm_medium=organic&utm_campaign=gbp`; no GBP edit was needed.
- Search Console existing ownership/session works. Sitemap processed successfully: 12 discovered URLs. Homepage, Hypnotherapy and Constellations live tests say URL available to Google/indexable; all three recrawl requests accepted. Service indexing remains Google's asynchronous decision, not a release success metric (the two new services were discovered, not yet indexed).

Sanitized screenshots and measurements are in `reports/psitrends-redesign/`. No cookies, tokens, raw analytics request identifiers, private backup bodies or Google account screenshots belong in Git.
