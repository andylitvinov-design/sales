# Original reviews and Academy restoration — 2026-09-24

Follow-up to issues #14 and #16. Keep the approved archway image and existing design; restore original media rather than recreate testimonials. Homepage review galleries are bilingual, with progressive disclosure and original-size image links. The Academy is a categorized directory into preserved original descriptions; existing course URLs and Quix content remain untouched.

## Provenance and scope

- EN homepage Quix page 4: eight original photo testimonials, seven original video links.
- RU homepage Quix page 141: five original photo testimonials, seven original video links. Two introductory videos outside its review section were not misclassified as testimonials.
- MAAT review page 34: three original course-review videos restored inside Academy.
- All 13 photo URLs return 200. YouTube oEmbed returns 200 for 16 videos; `OrdMvKn2Zg8` returns 403 and is preserved as an explicitly labelled external original, not a broken embedded player.
- 49 original published program/library URLs are cataloged under Reiki, mysteries, runes/elements, video courses, and library/history. All return 200 without the legacy “Could not load the item” error. Three empty overview routes (menu 225, 272, 277) are not promoted as descriptions; they were not deleted or redirected. Existing individual course descriptions remain linked.
- Original media is not edited, renamed, copied into Git or replaced with invented quotes/names. Individual-experience context is visible; no result guarantees or newly asserted credentials. Archive dates/prices do not represent current enrollment.
- The approved archway WebP remains in the actual homepage design unchanged.

## Privacy and accessibility

No YouTube iframe, thumbnail or request before interaction. A click creates a `youtube-nocookie.com` player; Close removes it and returns focus. Ordinary original links still work without JavaScript. One unavailable embed remains an external source link. Loading a player connects to YouTube; the UI explains this separately from optional analytics. Staging keeps its existing restrictive CSP and analytics/mail isolation; player loading/closing is tested on local HTTP and production, not by loosening staging isolation.

QA covers EN/RU gallery counts, expansion/collapse, original image links, video load/close, no eager frames, Academy source links/language labels, mobile overflow and existing client routing. Source tests: 13 pass; HTML and CSS validation pass. Full local home and Academy audits: pa11y/link checks pass; accessibility and best practices 100. Preview SEO 63 is expected for intentional noindex; production gets separate verification.

## Recovery

Fresh completed full checkpoint before this batch:
`/var/backups/psitrends/scheduled/20260924T062619Z-bb0befa2219343719f11af6479e0ab2d`.

Final stage directory `/var/lib/psitrends-releases/academy-reviews-final-stage-20260924`; before snapshot SHA256 `9208701db7552d0bf9d9860a5a7271ca1ad4cbcab735f14fa301cf5da4175040`. Exact final package completed capture → apply → rollback → reapply. Production directory `/var/lib/psitrends-releases/academy-reviews-production-20260924`; before snapshot SHA256 `e0f42df48bc1cfc4f31aea58e4547284ec98f32d9d486bd68dee26e0975fd1ff`.

Use the established guarded runner, swapping only the release-directory bind mount in [the prior recovery commands](psitrends-three-pillars-release.md). Explicit `rollback` restores this batch's previous article fields and files. The private package must remain unchanged. Run the paired `clear-client-cache.php` after every apply/rollback; it clears this site's desktop AND mobile presentation caches only. Never flush Redis sessions or other sites. No core, extension, ACL, menu or legacy-content writes.

Production acceptance is `node scripts/verify-psitrends-public.mjs` plus anonymous browser checks on the actual domain. It now asserts 8/5 photos, seven original review entries per home, 49 Academy links and three course videos, in addition to 24 desktop/mobile route and six UTM redirect checks.

## Production verification

The final staged package was applied to production on 2026-09-24. The public regression command passed all 24 EN/RU desktop/mobile route checks, all six UTM-preserving redirects, sitemap and robots checks, including the restored media/catalog assertions. A fresh full audit of `https://psitrends.com/ru/` passed pa11y, linkinator and viewport checks with no findings; Lighthouse accessibility, best practices and SEO each scored 100. Desktop and mobile hero fit checks passed with no horizontal overflow.

An actual public-browser session confirmed the RU gallery, click-to-load no-cookie video frame and removal on close, plus 49 Academy source links with no mobile overflow. These checks do not claim every third-party video remains playable: 16 source oEmbed responses passed and the known restricted video remains an external original link. Original customer-media screenshots are kept locally, not committed to Git.
