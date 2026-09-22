# Staged platform modernization

Status: host access recovered; actual supported Joomla4.4.0→4.4.14→5.4.8 update and paired rollback passed on the isolated clone, with Helix2.2.10 and Akeeba Core10.4.0. No production upgrade has been released. PHP8.3 and interactive editor/save acceptance remain separate gates. Keep platform work separate from the content redesign.

## Official evidence checked2026-09-22

- [Joomla version guidance](https://docs.joomla.org/What_version_of_Joomla%21_should_you_use%3F/en): Joomla4 ordinary support has ended;4.4.14 is the legacy patch baseline before a tested5.4 transition. Recheck exact current packages/signatures at execution.
- [Joomla5.4 requirements](https://manual.joomla.org/docs/5.4/get-started/technical-requirements/): PHP8.3 recommended; MySQL8.0.13 minimum. Production8.0.46 meets the stated DB minimum, not a proof of extension compatibility.
- [PHP EOL](https://www.php.net/eol.php):8.1 ended2025-12-31. [Supported branches](https://www.php.net/supported-versions.php):8.3 security support through2027-12-31. Use a current patch release of a supported branch after extension tests.
- [Helix changelog](https://www.joomshaper.com/downloads/template/helixultimate): Joomla5 compatibility added2.0.16, after installed2.0.15. tx_valley custom template compatibility remains separate.
- [Akeeba matrix](https://www.akeeba.com/compatibility): vendor provides newer versions covering5.4/PHP8.3; installed9.8.1 cannot be presumed supported merely because backup succeeded.
- [ThemeXpert Quix documentation](https://docs.themexpert.com/en): current product has moved beyond4.4.3. No demonstrated4.4.3→5.4 compatibility; obtain a licensed supported package and test all builders/collections. Do not jump to Quix6 or Joomla6 without a proven path.

## Compatibility matrix

The full278-record matrix is`psitrends-evidence/extension-compatibility.csv`. “NOT VERIFIED” is deliberate, not a pass. Core extensions move with core; third-party versions need vendor provenance, entitlement and regression proof.

| Component | Installed | Required staging evidence |
|---|---|---|
| Joomla |4.4.0| Apply latest safe4.4 patch then5.4, DB check, URL/ACL regression |
| PHP |8.1.34 production| Supported8.3 patch; modules and configuration parity |
| Quix |4.4.3; mixed plugin versions| Load/edit/save/reopen classic/frontend pages, collections, headers/footers; license/update path |
| tx_valley |2.0| Updated compatible template or reviewed overrides; visual and responsive diff |
| Helix Ultimate |2.0.15| Vendor-supported5.4 version; style17/21 custom fields preserved |
| Akeeba |9.8.1| New backup and restore under target version |
| JCH Optimize |8.1.1| Licensed supported version, no duplicate/minification regressions |
| LiteSpeed Cache |1.5.1| Prove purpose on nginx; disable in clone and compare before removal |
| JMedia |1.4.4 package| Confirm installed manifest inconsistencies and supported replacement/path |
| ImageRecycle |2.1.2 + plugin2.0.16| Supported package/license; gallery/media integrity |
| Templates/overrides |109 records| Review50 pending override notices and active overrides individually |

## Upgrade sequence and acceptance

1. Recover host access, snapshot actual compose/images/volumes and DB, document deploy source and restore authority. Never chmod the whole document root writable.
2. Build host-parity staging with restricted access, noindex, disabled SMTP/jobs/analytics and fresh test-only users/secrets. Existing local clone proves data recovery but is not full nginx/PHP parity.
3. Verify extension update licenses and vendor manifests. Remove no extension simply because it is old. Disable unused candidates on clone and test dependency impact.
4. Patch4.4 on clone, verify all representative page types and administration, then snapshot again.
5. Update required extension/template components in supported order. TestQuix before core jump. If the editor still fails, diagnose its error output/API responses on staging; no production code injection workaround.
6. Test Joomla5.4 with backward-compatibility plugin as vendor requires. Run database consistency check. Then move to supportedPHP8.3 patch and verify required extensions.
7. Compare EN/RU home, hypnotherapy, business, studies, image galleries, articles, contact links, language switcher, module129, styleUTM, metadata/robots/canonicals/schema, cookies/consent, adminMFA/recovery, cron, backup/restore. Do not send real client messages.
8. Pass preview desktop/mobile QA and full checks; prepare focused release report with exact before/after versions, backup hash, maintenance window and rollback command/volume map.
9. Release platform batch only, verify live routes+analytics, retain pre-release DB+files together. Roll back both on schema/runtime failure. Content redesign belongs to a separate batch.

## P0 host patch prepared

`configuration.php` error reporting is now `none`; the original is privately retained. After a scoped group/mode repair, supported Global Configuration Save passed and changed no parsed values. The Quix iframe and Save control render; one MutationObserver error and a complete production save round trip remain unverified. Nginx path guards and backup-spool containment are also released. Review6400-minute administrator session lifetime and MFA without locking out recovered access.

## Actual isolated modernization evidence

The supported upload/update/finalization path reached Joomla5.4.8 (schema5.4.0-2025-08-02,107 tables) after Joomla4.4.14 and free vendor Helix2.2.10/Akeeba10.4.0 updates. Core database checker reported no issues. EN/RU, authenticated admin and Quix editor HTML returned200. All50 articles,56 modules,2 language rows and141 Quix content records were preserved; incidental hit/edit-lock fields, administrative Akeeba menus, nested-set bookkeeping and one template colorScheme parameter changed as documented.

A complete paired rollback restored Joomla4.4.0/schema4.4.0-2023-09-13/104 tables, verified17,747 files byte-for-byte and removed3,831 updater-added files. Six content-table hashes matched before smoke requests. Temporary users/upload settings were removed and repeat HTTP checks passed. These results prove a feasible core migration and rollback; they do not certify exact Quix/Valley vendor support, browser editing or PHP8.3. Those tests continue separately.

## Keep-versus-migrate decision

Recommendation now: **retain Joomla and test modernization first**. It preserves141 Quix records, bilingual routes and the existing database workflow with the smallest immediate SEO/content loss. A final comparative score is gated on the5.4 staging test; do not manufacture it.

| Criterion | Modernized Joomla | Hybrid | Full migration |
|---|---|---|---|
| SEO/content preservation | Lowest route conversion burden | Requires deliberate proxy/subdomain boundary | Highest complete-map burden |
| Editing/maintenance | Existing CMS; Quix risk unresolved | Two systems to maintain | New authoring/ownership workflow |
| Security/support | Depends on staged compatibility pass | Legacy backend still needs patching | New runtime also requires operations |
| Performance | Existing mobile lab score poor; improve assets/cache | Potential frontend benefit, unmeasured | Potential benefit, unmeasured |
| Multilingual/integrations | Existing behavior retained/tested | Cross-system routing work | Rebuild and parity test required |
| Backup/cost/effort | Existing backup now verified locally | More moving parts | Highest migration/rollback effort |

If licensed Quix/tx_valley cannot pass supported modernization, evaluate hybrid first-party acquisition with Joomla Academy preserved. Full migration is last, requiring complete redirects, metadata, content parity and a reversible cutover. Scores/costs remain unknown until actual staging evidence and hosting control exist.
