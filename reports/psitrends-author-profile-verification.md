# PsiTrends author profile delivery — 2026-09-24

## Scope and result

- User-supplied library/desk portrait, uncropped, on Home and About in EN/RU.
- Full supplied biography retained with minor spelling/grammar corrections; complete RU translation. Reading column and restrained headings replace schematic About cards.
- About uses the same existing localized video/photo reviews as Home, after the full biography: EN 21 videos / 13 photos; RU 41 videos / 37 photos.
- Current shared navigation/footer, Academy, newest-first Events and legacy content preserved. No routing, ACL, extension, analytics or server configuration changes.

## Checks

- Node suite: 21/21 passing, including author content, native Joomla adapter, bilingual shell, reviews and Events regression tests.
- All 14 generated HTML files validate; shared CSS passes stylelint; `npm run check` passes.
- Home/About EN/RU full local audits: pa11y zero issues, linkinator zero broken links, Lighthouse accessibility/best practices 100, no horizontal overflow. Preview SEO is intentionally limited by noindex.
- Local browser QA: 56 route/viewport checks. Native staging: 16 Home/About EN/RU checks. Widths 320/390/768/1440; mobile user agent below 768.
- Live About EN and RU audits: pa11y and linkinator pass; Lighthouse accessibility/best practices/SEO 100.
- Live browser QA: 56/56 passing across all 14 routes; explicitly asserts HTML language, full biography, review ordering/counts, photo aspect ratio, navigation and no overflow. Browser locale is explicit to make Joomla's automatic homepage language selection deterministic.
- Live About EN/RU video open/close controls pass; third-party player requests intercepted during interaction testing.
- Live desktop and mobile screenshots inspected. Biography compared against the supplied source paragraph by paragraph; automated live checks assert every stored paragraph, review order/counts and original photo proportions.
- Independent code review found no remaining release blocker.

## Recovery and deployment

- Fresh scheduled full backup completed 2026-09-24 13:51 UTC: 104 tables; database and project archive SHA-256 hashes rechecked against its manifest. This is backup-integrity proof, not a full disaster-recovery restore claim.
- Private release directory: `/var/lib/psitrends-releases/author-profile-production-20260924T135128Z-v2` (outside webroot, mode 0700).
- Production snapshot SHA-256: `a40b8c63e6dc349750d0821fc703bf7dd2b97b05e5539a44d56077a87183bcf7`.
- Exact scope: four article rows (EN/RU Home/About), template index.php cache version, shared CSS and supplied PNG. Guarded journaled updater checks package hashes and concurrent edits.
- Identical package passed staging apply → exact readback → rollback → exact before-state readback → apply → exact readback.
- Production apply and exact readback passed: 4 articles / 3 files. Scoped Joomla presentation cache purge cleared 16 desktop/mobile entries; no broad cache flush.
- Rollback: run the same private updater with `PSITRENDS_UPDATE_SCOPE=production` and action `rollback`, then scoped cache helper and readback verifier with `rollback`. Do not overwrite the private snapshot or use a different package.

Public targets: https://psitrends.com/ · https://psitrends.com/ru/ · https://psitrends.com/about · https://psitrends.com/ru/about
