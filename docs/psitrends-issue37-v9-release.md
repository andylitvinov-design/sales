# Issue 37 v9 release record — 2026-10-02

This records the tested six-video delta, not a replacement Joomla installation. The two previously published English method videos remain intact. Final production acceptance is recorded in [Issue 37](https://github.com/andylitvinov-design/sales/issues/37).

## Frozen release boundary

- Canonical base: `80578c95ec1b26626b15ae893410b9186a856285`.
- Player runtime through `7d6a07c`; guarded updater through `27c1fbe`; acceptance scripts through `c1719d1`.
- Article IDs changed: Home EN/RU `51/57`, Consultations EN/RU `65/67`, About EN/RU `54/60`. Only `introtext` gains the approved insertion; all existing bytes are preserved when that section is removed.
- Other twelve complete client records are byte-exact no-ops. Existing Hypnotherapy `52` and Constellations `53` retain their accepted markup, masters and posters. No testimonial, biography, navigation, ACL, metadata, sitemap or menu writes.
- All eighteen source/live body differences before insertion were whitespace-only. The package preserves the actual live whitespace rather than replacing whole articles.
- Six new local WebPs; shared native index, built CSS and built JS change coherently from v8 to v9. No MP4 enters Git or Joomla.
- Built JS SHA-256: `6000baba759e6baad4b974a5712e799e93a0cfdef668392f329c8b32028bc313`.
- CSS SHA-256: `ba9c1f79fc18526889c25fbc006a378fe8d0d5d8d2e29cd3ca875c7ebcc1cafd`.
- Native index SHA-256: `4523109f1d2aebf93b5fea604aa7076f3c0f854e9941a832613d091239a07442`.
- Runner SHA-256: `7ef30f9a76d394db1aff1ded7bd322deec2431f535ebab458c77d9bc29696463`.
- Production package manifest: `292669ad70dc918e7048d618b0825bbd5a50077defbf1d384b28e192446a86b3`.
- Stage package manifest: `7935c9fb40f6d92bd4f306c34a7ab7765ddb12fe3adcb3aaa5ef2a4befde74fc`. The fifteen payload files are identical to production; only captured stage category guards differ. Payload proof digest: `a6a7ae794956dda2ad21a1500dcf524eb50f564a78f5b939ceed111f65a58c6e`.

## Prerequisite and recovery

The four Issue 34 hubs already return the correct pages. Their article→menu→style relationships are `65→364→37`, `66→365→38`, `67→366→39`, `68→367→40`. Menu 101 and paired home menus 202/204 remain unchanged. The hub menu-association table entries are absent in the inherited installation; bilingual switching uses the existing explicit template route map, including `/en/` language clearing. This release does not invent new associations.

The isolated navigation stage was brought to the existing production two-method baseline using its previously accepted bounded runner before capturing the new video B1. It retains noindex, mail-off and outbound restrictions. Native failure tests after the first file, before DB commit and after DB commit each restored all eighteen rows and guarded files through rollback. See the [delta runner contract](../integrations/joomla-client/six-approved-video-delta.md).

Private package, snapshots and journals remain under `/var/lib/psitrends-releases/`, outside the public webroot and Git. Never restore the full historical site merely to undo this delta. The new updater locks and byte-compares all eighteen rows, coordinates through the private cross-release lock, and rejects concurrent content or file-permission changes.

## Verification

- 37 source/native-build tests; 20 production-PHP 8.1 synthetic recovery/guard tests.
- Native stage: three actual MySQL failure/recovery boundaries, plus Chromium/WebKit controls on all eight placements at 390/1440.
- Static Chromium/WebKit: 32 full control cases, no-JS and failed poster cases; 72 additional acceptance checks per engine including delayed JS, keyboard controls, blocked-player fallback and responsive layouts. Zoom is explicitly a 200% equivalent reflow simulation, not a claim of native browser UI zoom.
- Existing functional suite: 72 viewports and intercepted consent/withdrawal checks; no real contact submission or analytics event sent.
- Six affected source pages pass HTML validation and pa11y; shared CSS passes stylelint.
- Lighthouse preview accessibility is 100 on all six pages. Preview SEO is intentionally reduced by noindex and absent production canonical metadata. Native-only archive images are absent in the static export; local link failures point to those existing images, not new video links. Live pre-release EN/RU About link checks pass with no broken links.
- Twelve actual HeyGen preview playbacks (six × Chromium/WebKit) reached natural completion with decoded 1280×720 frames and no media error. Tests wait for hydrated, localized provider Play controls; no autoplay query, programmatic play or seeking is used. All six public share fallbacks were separately checked anonymously.
- Seventy-two pre-release public checks freeze eighteen routes across desktop/mobile user agents and cold/warm requests. Post-release comparison asserts exact preserved title, canonical/hreflang, H1, navigation and review ID/photo order, plus v9 and exact video instances.

## Additive YouTube distribution

The owner separately authorized both languages on `@shamanic_academy`. All six were published through Metricool using checksum-identical original streams, then verified anonymously through natural playback. This does not change PsiTrends' required HeyGen embeds. [Books PR 77](https://github.com/andylitvinov-design/books/pull/77) contains the merged reusable bilingual operator policy and publication ledger; [Brain runtime record](https://github.com/andylitvinov-design/ai-projects-brain/issues/219#issuecomment-5957059531) lists exact reusable YouTube IDs.

For this task: **0 generation calls / 0 new renders / 0 task render credits / 0 duplicate Drive masters**.

## Production checkpoint

Source PR #42 merged as `fd723c68fb4de328c19eb9317d2c00d67dc743b1`; its runtime tree matches the stage-tested package. The later stage evidence commit changes only the report.

Fresh paired backup `20261002T170436Z-cf05305c2c254a7ea89fddcff51946cf` completed at `2026-10-02T17:05:18Z`, with 104 database tables. Both SHA-256 values and gzip integrity were independently checked; private directory/files are 0700/0600. This fresh bundle was integrity-checked, not fully restored anew.

- `database.sql.gz`: 13,173,296 bytes; `f59cc9c1a017fb2bb085f0c7ec0ed4f339e619d5ca56d63227b636d59ba3f422`.
- `project.tar.gz`: 596,421,368 bytes; `db715e45d2b399d9831b93543e632830a00431da773025c39518cef0fc7b9ea9`.
- Private release/checkpoint: `/var/lib/psitrends-releases/six-approved-videos-v9-production-20261002T164340Z`.
- B1 snapshot SHA-256: `0881bb5f48851cd22a380063645fe97d0ae05e250cf5087a931538be1e7968eb`.
- Apply completed at `2026-10-02T17:12:20Z`; complete/apply journal SHA-256: `59a05382df83e74f00a2eeb7401412c5614919b1e3042727bdb2a64d9737e937`.
- Guarded preflight, capture and apply returned success: six article bodies and nine files; metadata/routing unchanged.
- Scoped purge removed 44 desktop/mobile presentation-cache entries. Strict after-state verified 18 rows, nine mutable files and two invariant method posters.
- Public post-release comparison passed all 72 checks (18 routes × desktop/mobile × cold/warm), including v9, exact eight placements and preserved title/canonical/hreflang/H1/navigation/review ordering.
- Separate live Chrome desktop/iPhone-emulation regression confirmed native language clearing/switches, direct EN routes after RU, Projects links and unchanged testimonial iframe/close/focus behavior. Analytics/contact writes were blocked during QA.

Recovery uses the same frozen private package and `update-six-approved-videos.php rollback` with `PSITRENDS_UPDATE_SCOPE=production`, the established Joomla webroot and shared `/release-lock` mount, followed by the scoped cache runner. Never use a full-site restore for this insertion-only rollback or bypass a before/after conflict.

### Immutable production mapping

Poster paths below are relative to `/media/templates/site/psitrends_client/assets/approved-video-posters/`. Transcripts remain the approved manifest text.

| Live page | Exact HeyGen ID | Local poster | Poster SHA-256 |
| --- | --- | --- | --- |
| https://psitrends.com/ | `ed202847a43a96b918308aa972177b34` | `home-en-v2.webp` | `8f1ae79ad0764324cbf6023db4761a8ff4e9c55c0a085259beccd671cae4da04` |
| https://psitrends.com/ru/ | `388a04b39ebf215ae656bcd22d0d0847` | `home-ru-v1.webp` | `2d17a8df9b325272d4c1049cb7757733a00fbafed652b49ffdd0bdf68bc8b794` |
| https://psitrends.com/consultations | `48105a2f2228e7cb3a67391e97acaf8b` | `services-en-v2.webp` | `eba5a152b8fba5293b6046f8569205cafb641c852709f284893308b6846fdad6` |
| https://psitrends.com/ru/consultations | `79c2845577865979cd95ac40a08fc01a` | `services-ru-v1.webp` | `b0c25264bd03966fea4a07e2b654a5d12dc2066dd4fe91845facc06352257819` |
| https://psitrends.com/about | `34df311e461509433b45929908a9097a` | `homeopathy-en-v2.webp` | `9b2386a700b110249f285ff14d01c692e315a312083b46eab59b99930b0c6261` |
| https://psitrends.com/ru/about | `0f984780d06948b1e78166e6e553e4e9` | `homeopathy-ru-v1.webp` | `9c186803e5bfed18f3eecac5c4be3cf8fb90c24a1821b1315ab6adf67f31f335` |

## v10 follow-up: failed legacy poster

The first v9 production candidate passed all twelve real HeyGen playbacks, all six live poster hashes, 72 public comparisons, and six native accessibility/link/Lighthouse audits. A further synthetic legacy-fixture test exposed a separate failure path: a missing old-method poster caused its dynamically appended placeholder to cover the full-frame Play button. Both actual method posters were healthy; this was a reproducible fallback regression, not provider failure.

Commit `9767c2e7e23bbcbb75de70f553c280daaa14adf5` changes only placeholder insertion order (`play.before(placeholder)`), plus coherent v10 cache references and regression tests. The old fixture test now resolves its native poster path instead of using a static-only root. A dedicated failed-poster test was red before the one-line fix and green afterward. Its `PSITRENDS_LIVE_RUNTIME=1` mode checks served markup/runtime without injecting the local initializer. Independent review approved the change.

v10 built JS: `0ece7049496e24cf71d14cef3ae08352107304a50518979825ed19d886481c30`; native index: `f7466f4ffd6593400a8bffe804b93378dfdf83ce9ff64186b5ec75cca70bec9a`; CSS bytes remain `ba9c1f79fc18526889c25fbc006a378fe8d0d5d8d2e29cd3ca875c7ebcc1cafd`. All article insertions, media IDs, transcripts and posters remain identical.

The existing runner deliberately requires new poster paths at capture. It is not weakened for this follow-up: use its guarded v9 rollback to the exact v8 B1, then capture/apply a new immutable v10 package. Rehearse v10 apply → rollback → reapply on native stage before repeating that bounded transition on production. Preserve both release packages and checkpoints.


## v10 final production acceptance — 2026-10-02

**STATUS: SUCCESS.** PR #43 merged as `140535d91e54fb484fcdd9e6fbe2da4ef69ab554`; tested/merged tree `df97362fd117e68331170983d65621d4cc4cbfbc`. Runtime media, transcripts, article insertions and posters are unchanged from the approved six-video release; v10 changes the failed-poster paint order and cache references only.

- Final native stage release: `/var/lib/psitrends-releases/six-approved-videos-v10-final-stage-20261002T2132Z`.
- Stage package `8396e3d3df4fb40bed33f678dae745041a257e2f12769d82e0e02034a82c0e10`; B1 `c803f1171b642a647ef6b68fdf98e8f8d0857904e8a1d723914cafe154a5d8f0`; final journal `8d6c36c1b713d5c4a82d0d812352ee409b4ed1c8e62084b9a111c27f68b4f8c2`.
- Stage completed v10 apply → scoped purge → exact after verification → rollback → scoped purge → exact B1 verification → reapply → exact after verification. Eighteen rows, nine mutable files and two invariant method posters passed.
- Fresh production backup: `20261002T214135Z-86d732b7a7e4436e8e24409ae64c3e65`, completed 21:42:17Z, 104 tables; manifest SHA-256 `43ab6687539b761f0f2748a1436a47ccc47b9e5450d09a3511c7d1939a84fb97`.
- Backup DB `6c9e5e5a67a689441e794aef8e1a077e5740f69912148858580ea5ad850e6d33`; files `d282711e610ffef2fc90c6989cd8bc0940b0268e5a2b9a0e47ea56c28791c9e8`; gzip and tar integrity passed.
- Production v9 rollback journal was already complete at B1; a scoped purge removed 34 desktop/mobile entries and exact B1 verification passed before v10 capture.
- Final production release: `/var/lib/psitrends-releases/six-approved-videos-v10-final-production-20261002T2132Z`.
- Production package `59887575ebe20a22652bf8e55da95f4d24d076cf5229fdd11e6d51fbb0f147e2`; B1 `0421a9b75c2c42f74d987905bf60c00e0903e0b9bcd94337feeac4514bda8cb5`; final journal `ce857486e2914de5f7678d6721bc37521ac7a479b66b8987cfc488621b77f7fc`.
- Production preflight/capture/apply passed; exact after verification confirmed all eighteen guarded rows, nine mutable files and two invariant posters. The post-apply scoped purge ran and had no remaining matching cache entries.
- All six exact pages return HTTP 200 with `psitrends-client.css?v=10` / `psitrends-client.js?v=10`; live JS SHA-256 `0ece7049496e24cf71d14cef3ae08352107304a50518979825ed19d886481c30`, CSS `ba9c1f79fc18526889c25fbc006a378fe8d0d5d8d2e29cd3ca875c7ebcc1cafd`.
- All eight local poster files (six release + two retained method posters) were fetched anonymously and matched exact expected SHA-256 values. Both EN/RU About bridge links are present.
- Public baseline comparison passed 72/72 checks: 18 routes × desktop/mobile × cold/warm, preserving title, canonical/hreflang, H1, navigation, testimonial video IDs and testimonial photo order.
- Live control acceptance passed 144/144 checks in Chromium/WebKit. Actual served-runtime failed-poster pointer click/close/focus regression passed in both engines.
- Real HeyGen playback passed 12/12: six pages × Chromium/WebKit, decoded 1280×720, advancing currentTime, expected ~29–34s duration, natural completion and no media errors. Provider Play required one explicit in-frame gesture.
- WebKit playback QA now sets explicit EN/RU locale because an unqualified iPhone context inherited the operator Mac's Russian system locale and legitimately redirected `/` to `/ru/`; this was a test-environment issue, not a site defect.
- Sanitized playback evidence: `reports/issue37-production-v10-real-playback.json`.
- Rollback remains the same guarded B1 contract in the final production release directory, followed by the scoped cache runner; no full-site restore is required.

For the v10 completion: **0 HeyGen generation calls / 0 new renders / 0 render credits / 0 Drive writes / 0 duplicate masters**.
