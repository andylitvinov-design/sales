# Review-video cards — 2026-09-24

This release replaces generic video cards with immediately visible, first-party poster images and a labelled Play control. The YouTube privacy-enhanced player is inserted only when that control is activated; Close removes the frame again. Ordinary original-video links remain available without JavaScript.

## Included material and locale rules

- RU homepage: 41 video testimonials (38 YouTube and three original site MP4 files), then 37 photo testimonials. Russian material precedes English material within both media types.
- EN homepage: 21 English-language video testimonials, then 13 English-language photo testimonials. No Russian reviews are rendered on this route.
- The 38 YouTube posters are 480px WebP derivatives of the corresponding published YouTube `hqdefault.jpg` frames, stored in the Joomla template media directory. They are not remote YouTube thumbnail requests.
- The three original MP4 cards retain their published site screenshots as posters and use native `playsinline` controls.
- `OrdMvKn2Zg8` is intentionally absent: on 2026-09-24 its oEmbed endpoint returned 403 and its thumbnail endpoint returned 404. It is not presented as a potentially broken card.
- Technical archive labels and the old loading prompt are not rendered. Cards use concise human titles and a clear RU/EN Play label instead.

## Staging evidence

Release directory: `/var/lib/psitrends-releases/review-thumbnails-local-ready-stage-20260924`.

The exact package completed `capture → apply → rollback → apply` from a clean staging baseline. The before snapshot SHA-256 was `f8fa5...` (recorded privately with the release). The re-applied poster directory was checked at mode `0755` with exactly 38 WebP files; this explicit mode matters because the guarded runner otherwise begins under a restrictive process umask.

Anonymous browser checks on staging confirmed:

- RU: 41 video cards, 37 photos, 38 immediate poster URLs, no iframe before interaction, no technical text.
- EN: 21 video cards, 13 photos, English-only content, no iframe before interaction.
- A Play activation creates a `youtube-nocookie.com/embed/...` frame; Close removes it.
- At a 390px viewport, the RU review area has `scrollWidth === innerWidth`; the first poster loads at 480px intrinsic width.

## Production application and rollback

Before production, run the established verified host backup service and record its fresh completed manifest. Copy only the reviewed immutable package and runner into a new private `0700` release directory. Execute `capture`, then `apply`, using the scoped production container command from the preceding reviews release. Run the paired `clear-client-cache.php` after apply or rollback; it invalidates only PsiTrends desktop/mobile presentation cache.

Rollback uses the same runner and release directory with `rollback`. It restores the twelve homepage article fields and existing template assets under optimistic before/after guards. If the poster directory was created by this release, rollback removes all 38 release posters and then the empty directory. Do not use a broad Redis flush, Joomla extension update, routing update, or whole-site restore for this targeted rollback.

Production acceptance is the public regression script plus anonymous RU/EN browser checks for poster delivery, locale composition, player creation/removal, source links and 390px/desktop no-overflow behavior. Add the exact backup, release and public-verification evidence here only after that application succeeds.
