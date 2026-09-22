# PsiTrends P0–P3 development roadmap

Owner: PsiTrends business owner; implementation: authorized maintainer. Date2026-09-22. [Issue6](https://github.com/andylitvinov-design/sales/issues/6) remains the parent contract; this roadmap is an executable sequence, not evidence that deferred changes shipped.

| Priority / work | Status | Impact and evidence | Dependency / acceptance |
|---|---|---|---|
| P0 Recoverable CMS access | COMPLETED | Keychain replaces plaintext credential note; fresh-login recovery passed | Preserve unlocked owner Keychain; no secrets in Git |
| P0 Full backup + rollback | COMPLETED for off-server export/local restore; PARTIAL for host disaster recovery |1.03GB verified archive,104-table restore, EN/RU200, object rollback | Complete the host disaster-recovery drill and independent retention |
| P0 Search Console ownership | COMPLETED; metrics pending | URL-prefix ownership verified using existing GTM | Read reports after Google finishes processing; unavailable is not zero |
| P0 Broken enquiry route | COMPLETED | `/express-ru`404→301→existing Russian page200; stage tested | Redirect1/plugin177 rollback documented; collection disabled |
| P0 Hosting/operator recovery | VERIFIED | Owner console and dedicated SSH recovered; actual mounts inspected; supported CMS configuration Save passes | Preserve private key/Keychain and ACL rollback; complete host disaster-recovery drill |
| P0 Error disclosure | FIXED for observed warning | Staging A/B reproduced warning; production reporting none, syntax/EN/RU checks and config Save pass | Editor content now renders; full editor/save compatibility still requires testing |
| P0 Supported platform | DEFERRED BY RISK | Joomla4.4.0/PHP8.1.34 EOL; Helix before5 compatibility release | Follow staged upgrade plan, licensed extensions,5.4/PHP8.3 regression and rollback |
| P0 Claims/title cleanup | PARTIAL | Literal EN/RU audit and safe replacement guidance produced | Verify Ontario status/training evidence; editor renders but complete editing/saving remains unverified; apply exact source edits after testing |
| P0 First-party consent/privacy | PARTIAL | One GTM loader, no static consent call; sales consent does not prove Joomla consent | Container/runtime audit on protected staging, consent-before-collection, minimal data |
| P0 Admin hardening | PARTIAL | Two Super Users,0MFA enrollments,6400-minute session lifetime | Preserve recovery path, enroll owner-approved factor, reduce lifetime, no account deletion blindly |
| P1 First-party client layer | SPECIFIED, NOT RELEASED | Current homepage mixes practice/library; unclear CTA | IA/copy in content-map, actual fees/availability/credentials, working editor and staging |
| P1 Metadata/canonical/language | AUDITED |124 unique200 final URLs; widespread missing descriptions/canonicals | Unique intent; canonical/hreflang true equivalents; sitemap only canonical useful URLs |
| P1 Performance | AUDITED | Mobile lab performance28, LCP34.4s, TBT2220ms | Responsive images, lazy embeds, dependency/cache tests; compare representative templates |
| P1 Broken link/error cleanup | AUDITED | Remaining404/403/500 candidates in full crawl | Exact equivalent and GSC/backlinks evidence; no blanket homepage redirects |
| P1 First-party Toronto migration | DEFERRED BY RISK | Two Cloudflare acquisition pages already live and measurable | Publish verified first-party counterparts,301 old URLs,UTM/GBP update separately, GSC inspection |
| P2 Offer/contact refinement | SPECIFIED | One first-session path, optional follow-up only if real | Confirm CAD fees/duration/cancellation; test contact links without sending messages |
| P2 Proof/reviews | SPECIFIED | Existing testimonials need consent/context review | Curate3–6 process-focused examples; neutral review request, no automated outreach |
| P2 Business decision page | DEFERRED BY EVIDENCE | Business history exists; separate demand not measured | GSC/GBP/enquiry evidence + actual offer; no new page solely for keywords |
| P2 Growth scorecard | SPECIFIED | Contact-click collection exists; paid outcomes unknown | Weekly real enquiry→qualified→booked→paid reconciliation; no heavy CRM |
| P3 Academy cleanup | INVENTORIED | Deep Quix/archive asset; published demo and stale content | Classify every page, preserve useful indexed legacy, remove stale CTAs after verification |
| P3 Keep/hybrid/migrate decision | DEFERRED UNTIL UPGRADE TEST | Modernize Joomla first is current lowest-change recommendation | Score actual5.4 results/cost/editing/performance; no novelty-driven migration |

## Next release batches

1. **Host recovery + error-reporting fix**: inspect source/mounts, snapshot, fix configuration, test editor; no redesign.
2. **Supported-platform preview**: exact infrastructure clone and extension compatibility. Publish a focused change report; no live upgrade until parity/rollback passes.
3. **Claims and active-offer copy cleanup**: small EN/RU page batches from exact phrase audit; verify title entitlement and current offer facts; preserve before/after.
4. **Client acquisition preview**: six-item navigation, homepage, two service pages, About, Contact, Academy gateway; use existing Toronto copy/assets where appropriate.
5. **Controlled first-party migration**: one canonical version,301s,GBP/internal link changes, query attribution, GSC checks. Category unchanged.
6. **Academy and growth**: classify/archive/merge only with evidence; measure paid-client outcomes and test one variable at a time.

## Done gates

Each production batch requires private snapshot, exact diff, preview, mobile/desktop QA, links/forms, canonical/robots/sitemap/schema, analytics/consent, EN/RU, claims regression, live readback and rollback. No copied credential/export bytes in Git. No major content rewrite combined with platform migration.

Issue6 remains open for full editor/save compatibility, staged modernization, client-layer implementation and migration, remaining P0/SEO/analytics work, and any legally material credential facts. The owner hosting and configuration-write gates are cleared; do not request those actions again. Google report processing is an external data delay; do not fabricate its baseline. Follow-up implementation work stays linked to Issue6 and its delivery PR rather than disappearing in chat.
