# Full review collection — 2026-09-24

Owner follow-up: the previous restoration was incomplete. The first batch split the original home reviews by locale and collapsed all but three entries. This release combines both languages on each homepage, removes collapsed review collections, and restores the additional original public session/course collections.

## Scope and provenance

- Original home Quix 4, 18, 105 and 141: 13 unique photos and 14 YouTube sources, preserved in both locales. Older Home 13 contributes two additional videos in Sessions.
- `integrations/psitrends-client/review-archive.mjs` records additional public source page IDs and media paths: sessions/diagnostics, Reiki training, Tantra Reiki, Water and MAAT.
- Total on **each** homepage: 37 unique original photos, 39 unique YouTube sources, three first-party MP4 videos. No duplicates across groups. These totals describe the verified public archive, not a claim that all 42 videos formerly appeared together on a single homepage.
- Live source database was checked read-only, including all published Quix sections containing review markers and the dedicated review pages. Original Home 4/18/105/141 collections match the first batch's source counts; wider collections were on linked legacy pages. Demo placeholders, stock images, practitioner introductions and deleted/unpublished content are not republished as customer testimonials.
- All additional photo/MP4 URLs returned 200. All 25 added YouTube sources returned oEmbed 200 with testimonial/report titles. Existing `OrdMvKn2Zg8` remains external-only because embedding is restricted.
- Original public media stays at its original URL. No testimonial text is rewritten and no names, results or captions are invented. No private/customer-media copies are committed. Historical experience is labelled as such, with no result guarantee or medical recommendation.

## Behavior and release safety

Both locale pages show the complete collection, with category jump links and no hidden “more” lists. Images are lazy-loaded; native videos use `preload="none"`; YouTube embeds remain click-to-load. Original links work without JavaScript. The approved hero and Academy descriptions remain intact.

The focused change uses the existing guarded article/asset updater; no legacy Quix rows, routing, ACL, extensions or original media are changed. Stage capture → apply → rollback → reapply passed with snapshot SHA256 `7fc3ac8b53e5fdf05018a85234464e027f227817bae133abcbe69a888b286709` at `/var/lib/psitrends-releases/all-reviews-stage-20260924`.

Production uses `/var/lib/psitrends-releases/all-reviews-production-20260924`. Rollback: run the established `update-client.php rollback` container command with this directory mounted at `/update`, then run `clear-client-cache.php` in `psitrends_php`. Preserve the private package/snapshot and optimistic concurrent-edit guards. Never flush Redis or remove legacy media.

Regression tests require 37 photos, 42 video cards, three native videos, both languages' originals and no collapsed review sections. HTML/CSS and 11 source/build tests pass. Staging browser confirms the same totals and the restored source images.
