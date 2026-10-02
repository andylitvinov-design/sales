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
