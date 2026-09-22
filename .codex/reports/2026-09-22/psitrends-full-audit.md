# PsiTrends stewardship audit —2026-09-22

Source: [Issue6](https://github.com/andylitvinov-design/sales/issues/6), full body and three comments, including [master execution prompt](https://github.com/andylitvinov-design/sales/issues/6#issuecomment-5776624437). Repository confirmed`andylitvinov-design/sales`; branch`codex/psitrends-stewardship`, baseline`ddc3af5`. No major redesign, platform upgrade, new landing page or GBP category change released.

## Outcome

**PARTIAL: substantial operations setup completed; host-level recovery remains owner-gated.** CMS credentials now recover from Keychain in fresh sessions; full backup is private off-server with CRC/hash verification; all104 database tables were restored locally and EN/RU pages returned200; a CMS object edit/rollback was verified; GSC first-party ownership established; one broken enquiry route fixed after staged verification. The audit, inventories, copy/IA specifications and P0–P3 roadmap are durable.

Do not close Issue6 solely on this report. Production host recovery, read-only configuration, broken Quix editor, staged upgrade compatibility and credential/claim facts still block broader release.

## Required outputs

- [Production access and permission matrix](../../../docs/psitrends-production-access.md)
- [Secret manifest](../../../docs/psitrends-secret-manifest.md)
- [Architecture](../../../docs/psitrends-architecture.md)
- [Backup/restore](../../../docs/psitrends-backup-restore.md)
- [Content map, IA, copy specifications and migration plan](../../../docs/psitrends-content-map.md)
- [Analytics and scorecard](../../../docs/psitrends-analytics.md)
- [P0–P3 roadmap](../../../docs/psitrends-development-roadmap.md)
- [Staged platform upgrade/compatibility plan](../../../docs/psitrends-upgrade-plan.md)
- Evidence directory`psitrends-evidence/`: full safe CMS/extension inventories, public crawl, URL/contentCSV, exact phrase claimsCSV,278-record compatibilityCSV, backup/restore manifests, DNS/TLS, source instrumentation, Lighthouse summary and desktop/mobile screenshots.

## A. Access / operations

Fresh Joomla login was tested after logout and from a separate Chrome session using the Keychain item, not a retained cookie alone. Original plaintext private note became a pointer. No credentials, recovery codes or rawSQL were added to Git. A Swift Security-framework helper reads the item privately; CLI`security -w` stalled and is not the reliable path here.

Super Users ACL verified from backup, with two such users. This grants CMS authority but not writable host files. Full matrix records tested operations and limits; untested destructive controls do not become FULL merely because visible.0MFA enrollments, registration disabled,6400-minute session lifetime: security follow-up required with recovery preserved.

Exact origin178.105.78.179/server label confirmed by existing server-creation account correspondence. Current SSH authentication failed; Hetzner panel has no owner session. No speculative server reset or unrelated credential reuse. DNS/SSL renewal/hostcron/container mounts remain unverified.

## B. Backup and rollback

Akeeba9.8.1 default output was unwritable and prior backups obsolete. Snapshotted profile1 privately, changed spool to`/tmp` outside webroot, archive permission0600. Backup12 completed12:31:32UTC in1m30s. Downloaded via authenticated Chrome; moved immediately to private0700/0600 storage.

Archive1,027,828,507bytes,19,028 entries; every CRC passed. SHA256`0224cd608546f8ae0e1c977a3d4b904f01d5a7910c0343d9d97ea344054fe857`. Configuration, files, media, templates, ANGIE and213 DB chunks present. No “backup ready” claim rests solely on a green CMS screen.

Local restore into isolated Docker/Colima succeeded:104tables,141Quix records,216menu records; ENhome, RUhome and English service allHTTP200. Fresh local configuration; SMTP disabled, original accounts blocked, sessions removed, no external container route, third-party browser CSP and noindex. Production PHP/nginx parity and5.4 upgrade not claimed. Optional PHP module startup warnings recorded in upgrade plan.

Module130 test: unpublished, Super Users-only, no position. SaveA→editB→save→restoreA→save→readback; then trash. No public rendering. Production full-volume restore still needs host access. Server`/tmp` copy is not durable retention; private off-server archive is the actual baseline. Scheduled offsite backup not yet established.

## C. Technical / security findings

| Priority | Finding | Evidence / practical consequence |
|---|---|---|
| P0 | Joomla4.4.0/PHP8.1.34 unsupported | Official support sources in upgrade plan; do not upgrade live without compatibility |
| P0 | Global error reporting maximum | Quix edit emits PHP deprecation and absolute path; supported save to none failed with “unable to write configuration file” |
| P0 | Editor load failure | Quix homepage builder stuck at first-load screen; content changes cannot be safely declared writable |
| P0 | No proven host recovery | CMS backup export works; full-host restore/patching depends on owner recovery |
| P0 | Admin recovery/MFA posture | Two Super Users,0MFA, long sessions; remediate without locking out owner |
| P1 | Mixed old extension versions |278 records;256enabled; Helix2.0.15 precedes vendor5 compatibility addition; Quix plugins mixed |
| P1 | Security headers incomplete | SAMEORIGIN/referrer/COOP observed; HSTS/CSP/nosniff not observed on sampled publicHTML; stage headers before enforcing |
| P1 | Error/demo routes remain | Four public500s are tour-template demo routes; investigate menu exposure and authority before unpublish |
| P1 | Cache complexity | Redis configured plus JCH/LiteSpeed/ImageRecycle; nginx origin makes LiteSpeed utility unproven |
| P1 | Mobile payload/runtime cost | Lighthouse performance28/LCP34.4s/TBT2220ms; optimize images/embeds/assets, no score-only changes |

Public HTTPS certificate validation passed; HTTP/www redirect to HTTPSapex. No mixed HTTPassets in the three source samples. Exposure checks are bounded and read-only; no exploit attempt or penetration-test assurance. Exact TLS dates/status in evidence. Known support risk does not prove compromise. No unsupported specificCVE assertion.

## D. SEO / indexing

CMS-seeded final crawl:178requestedURLs,145successfulresponses,124distinct successful final URLs,24HTTP404,5HTTP403,4HTTP500. Redirect duplicates account for response-vs-final differences. Crawl queue exhausted; query-bearing previews and inaccessible records are outside this public count. CMS inventory includes non-public/demo/unlinked content. Some403s are administrative/front-end submission routes, not ordinary broken service pages.

Among124unique successful finalURLs:67missing meta descriptions,124missing server-rendered canonicals,119without hreflang. Rendered EN/RU homepage check also found no canonical. Homepages carry true language alternates and x-default; no blanket hreflang parity is appropriate for all historic content. Duplicate generic Aboutus/Academy titles and demo content weaken intent. English title is Academy while H1 is HOLISTIC HOUSE; RU visual hero has noH1.

Root robots200, no root sitemap directive; `/sitemap.xml`404. Newly verified Search Console URL-prefix property has no submitted sitemap and reports are processing. Index coverage, excluded pages, queries, brand/nonbrand/Canada split, backlinks and fieldCWV are unavailable. Do not claim indexed totals or “no authority.” No deletion/merge decision can yet rely on those missing metrics.

Schema on sampled pages is minimal Organization(namePsitrends,url), not a full LocalBusiness/Service graph. Confirm visible facts before expansion; no fake ratings, regulated credentials or FAQ rich-result promise. Toronto module links work on both language homes. ApprovedGBP UTM copied exactly to both acquisition pages and live readback saved.

## E. Content / credibility / conversion

Strength: deep bilingual method/library content, existing practitioner history, videos and real Maps hypnotherapy acquisition signal. Main weakness: academy, health claims, diagnostics, business growth, therapy, homeopathy, mysteries and education compete as equal first steps.

Literal EN/RU claim/title inventory scans main content, with exact phrase and context; educational mentions and quoted/testimonial statements need human-context classification, not automatic deletion. Examples manually reviewed:

| URL | Current phrase/category | Assessment / replacement direction |
|---|---|---|
| `/therapy/image-psychotherapy` | “HypnoTherapy & PsychoTherapy Sessions”; “you get healed” | Verify title/scope; describe voluntary hypnosis/imagery process, remove healing promise |
| `/` | “We find cause of fears and remove them”; professional title/training list | Avoid promised removal; distinguish verified historical training from current Ontario entitlement |
| `/express` | Health/trauma-oriented free diagnostics and multiple modalities | One privacy-minimal fit enquiry; do not request sensitive details in initial generic form |
| `/ru/` | Health/phobia diagnostics; psychotherapy/homeopathy; limited places urgency | Process/fit language, verified current availability; preserve method without outcome guarantees |
| Legacy business cases | Dramatic percentage/income results | Source+consent+context required; no typical/causal growth implication |

[CRPO standards](https://crpo.ca/wp-content/uploads/2026/01/CRPO-Standards-Jan124-Revised-Dec1125.pdf) identify restricted psychotherapy titles; [Ontario Homeopathy Act](https://www.ontario.ca/laws/statute/07h10) is the cited statutory verification route. Current public entitlement was not proven; no inference of absence of registration is made. Do not publish protected-title representations until actual entitlement is verified. This is a publication gate, not a legal finding about the practitioner.

Current fees/currency/duration, testimonials permissions and active historical programs are not sufficiently verified. Do not invent them. Safe copy/wireframe specs are complete; claim rewrites remain blocked by the failed editor/config path and factual gates. No bulk content replacement was injected through JavaScript.

Conversion: repeated equal CTAs/free diagnostics, mixed audience and unclear offer hierarchy. Existing messengers remain workable; no new scheduler needed. Mobile390px EN/RU had no horizontal overflow. The RUhero is image-led and broad; Toronto navigation consumes substantial above-fold space but preserves English acquisition access. Desktop1280px EN also has no overflow. Screenshots support these observations; broad usability/accessibility conformance is not claimed.

## F. Analytics / business outcomes

Existing GA4/GTM retained; no new property. Three Joomla source samples each show one GTM loader and no inline consent command. This is not enough to claim runtime consent or no duplicate container events. Sales consent-gated collection was separately verified in Issue4. First-party consent remains P0preview work. Existing`contact_click` taxonomy preserved; no health data in analytics. No contact messages sent.

Search Console verified via existing GTM, property`https://psitrends.com/`; domainproperty still inaccessible. Data processing is not zero traffic. Actual enquiries, qualification, sessions, payments and revenue remain unknown. The analytics runbook defines real-source reconciliation and a neutral review process; no auto-outreach.

## G. Exact live change log / rollback

| Change | Before | After / verification | Rollback |
|---|---|---|---|
| Credential persistence | Plaintext private note | Keychain+fresh-login test; note pointer only | Recover via ownerKeychain, never recreate plaintext inGit |
| Akeeba profile1 | Default output unwritable; archive0666 | `/tmp` outsidewebroot,0600; backup12 complete+downloadverified | Private profile snapshot; avoid restoring known broken output casually |
| GSC ownership | No accessible PsiTrends property | URL-prefix verified automatically via existingGTM; reports open | Remove newly verified property access only if explicitly desired; no site tag changed |
| Redirect plugin177 | Disabled; default URL collection on | Enabled; collectionoff readbackverified | Disable plugin177 (baseline params privately in DB export) |
| Redirect row1 | `/express-ru`404 |301→`/ru/express-ru`200; staged and publicHTTP verified | Disable row1; no other URL rules added |
| Module130 probe | Absent | Restricted/unpublished test then trashed | No live placement; leave trashed or remove only the test object |
| Global error_reporting attempt | maximum | Save rejected, production unchanged | No applied change to roll back |

No GBP category, name/address, canonical migration, production upgrade, client messaging or broad redesign occurred. Issue4 module129/styles17/21 and both live acquisition pages remain intact.

## H. Verification and release status

- Full archive CRC/SHA256 pass; private storage permissions verified.
- Local restore104tables and representativeEN/RU/serviceHTTP200; single-redirect preview301 pass.
- CMS object rollback pass; live redirect301→200 pass.
- LiveGBP UTM exact-match readback pass; EN/RU mobile390 and ENdesktop1280 overflow checks pass.
- Lighthouse lab: performance28/accessibility98/bestpractices75/SEO92;FCP9.4s,LCP34.4s,TBT2220ms,CLS0.01. These are lab values, not fieldCoreWebVitals; INP unavailable.
- `npm run check` passed (repo script HTML validation + stylelint); Python syntax and generated-inventory checks passed; both Toronto pages passed full html-validate/stylelint/pa11y/linkinator/Lighthouse/Playwright audits (100/100/100 accessibility/best-practices/SEO). Mobile hero-height warnings remain advisory; no overflow. Documentation links and exact credential/secret-pattern scans passed. Results in `repo-checks.json`.

## Remaining owner-only step

Sign in to the existing Hetzner owner account, completing its recovery/2FA, then grant authorized console/SSH access to the identified origin. That unlocks the real mounted configuration/source, error-reporting fix, editor recovery, production rollback and supported-platform release. Do not send passwords in Git/chat. Current credentials and a browser-only session cannot bypass a read-only production mount.

Continue from the roadmap once host access is available. Keep Issue6 open and link the delivery PR; the broader staged work is not silently marked complete.
