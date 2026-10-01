# Reuse approved Holistic House videos on PsiTrends — 2026-10-01

User-approved intent: add the existing videos to corresponding PsiTrends pages/sections, EN to EN and RU to RU. This release does not generate, re-voice, upload, or duplicate any video master. Canonical media and voice/version identifiers remain in ai-projects-brain #219.

## Exact mapping (six existing assets, eight placements)

| Page | English | Russian | Existing asset |
|---|---|---|---|
| Home | `/` | `/ru/` | Home EN Final v2 / RU Final v1 |
| Individual work / Hypnotherapy, How sessions work | `/hypnotherapy-toronto#process` | `/ru/hypnotherapy-toronto#process` | Services EN Final v2 / RU Final v1 |
| Constellations, How sessions work | `/systemic-constellations-toronto#process` | `/ru/systemic-constellations-toronto#process` | Same Services assets (no second render) |
| About, Taoist Alchemy specialization | `/about#explore` | `/ru/about#explore` | Homeopathy EN Final v2 / RU Final v1 |

The Home introduction explicitly says Holistic House. The existing PsiTrends branding and footer already identify Holistic House as its individual practice; the approved spoken content is not changed. The Homeopathy video refers to a remedy library: a visible localized link explains that it is on Holistic House, not a new PsiTrends directory. Services is a general method-selection explanation, placed in the shared process section, not presented as a dedicated hypnosis/constellation demonstration.

No new intros on Academy, Events, Contact or unrelated legacy routes. Existing biography, testimonials, review player, navigation, contact/consent/analytics logic and medical caveats are retained. No private cabinet or client records are involved.

## Player

Real 1.5-second frames copied byte-for-byte from the archived MP4 preparation artifacts. Each of six posters is tied to its exact render with SHA-256 in `approved-video-posters/sha256.json`. Local 1280×720 WebP files, small lower-left Play, one duration label, collapsed original transcript and small AI-avatar disclosure. No iframe, HeyGen request or external thumbnail before an explicit click. JavaScript-disabled/modified clicks retain the stable HeyGen share link. Close removes the iframe and returns focus. Only the six approved IDs can instantiate a HeyGen iframe. No signed CDN URL or Drive playback URL enters the public player.

Both static and native assets are versioned `v=8`; source CSS wrappers also reference v8. The native updater accepts exactly six named posters with digest checks and records/restores the new directory state. It remains CLI-only and has the existing private snapshot, exact DB-target, concurrency, backup and rollback requirements.

## Verification commands

```sh
node scripts/build-psitrends-client.mjs
node scripts/build-joomla-client.mjs
node --test integrations/psitrends-client/*.test.mjs integrations/joomla-client/*.test.mjs
php -l integrations/joomla-client/update-client.php
php -l integrations/joomla-client/template/index.php
python3 -m http.server 8877 --bind 127.0.0.1 --directory output/psitrends-client
# Separate process:
node integrations/psitrends-client/approved-videos-browser.mjs
```

The isolated browser suite uses blocked third-party traffic and a fixture for the iframe endpoint. It proves poster/interaction/language/layout behavior, NOT actual Joomla production playback. Test native staging and production separately. The stored source package can be rebuilt without fetching media or running HeyGen.

## Native release gate — not a Vercel/GitHub auto-deploy

PsiTrends is hosted as native Joomla on the existing Hetzner origin. A GitHub merge or static package is not live publication. The current chat runtime has no configured operations SSH alias/key or macOS Keychain access. Do not invent credentials, copy another application's secrets, introduce an unapproved cloud host, or claim production success.

Use the existing authorized workstation/Codex environment. Follow `docs/psitrends-production-access.md`, `docs/psitrends-secret-manifest.md` and `docs/psitrends-three-pillars-release.md`. Re-read the newest sales source and server article state before release. Reconcile any source/live differences; the release must not overwrite unrelated editorial changes.

1. Fresh paired private before-state/backup. Confirm original scope, native template assignment, all 14 existing modern articles and old cached assets. No root SSH.
2. Rebuild the immutable native package. Place it with the reviewed `update-client.php` in a new private release directory (0700). Use an entirely fresh before.json: this release adds a poster-directory snapshot field.
3. On the isolated native Joomla clone, perform capture → apply → verify → rollback → verify before-state → apply. Verify all eight video placements, all 14 existing routes, language associations, menus and older media/consent behavior. Full decode/playback of the six existing videos remains an external-player test, not just checking iframe src.
4. Only after staging passes, run the existing production guarded release; clear only the scoped client cache including M-* entries. Do not replace `/var/www/html` with this repository or change DNS/Cloudflare/other applications.
5. Read actual live EN/RU pages, small poster responses, first-click behavior, video language, complete streaming, mobile/desktop and language round trips. Verify no duplicate intro and no public Drive/master links.
6. Record exact commit, release snapshot, route-level evidence and rollback; update #219 with actual publication state. Until then report **source/previews ready; live release pending**.

Production apply/rollback and native staging cannot be claimed from local/static tests. Reuse current masters; HeyGen generation cost for this task is zero.
