# PsiTrends backup, rollback and staging

2026-09-22 status: **PARTIAL; restore readiness NOT VERIFIED**. No major production changes or upgrades are authorized past this gate until evidence below passes.

## Observed backup

Authenticated Joomla → Components → Akeeba Backup → Manage Backups:

| Field | Observation |
|---|---|
| Component | Akeeba Backup Core 9.8.1 |
| Record | 12 |
| Description | Issue 6 stewardship baseline 2026-09-22 |
| Start displayed | 2026-09-22 12:31 UTC |
| Duration | 00:01:30 |
| Type / profile | Full site backup / Default Backup Profile 1 |
| Size displayed | 980.21 MB (UI rounded; exact bytes unknown) |
| UI status | OK |
| Local archive / checksum | Not verified |
| Restore test / staging | Not performed |

This record existed before the current run. Do not claim this run created it. Other listed old records were obsolete or failed. A browser download was attempted via the supported UI, but no local archive was confirmed; waiting for its download event timed out. Do not repeat large downloads blindly or label them complete from a click.

## Finish backup verification

1. Recover credential access and verify an authorized file-transfer or supported download path. Prefer SFTP when available; Akeeba warns browser transfer can corrupt archives.
2. Review profile exclusions/output protection, archive information and logs without emitting secrets. Verify files, configuration and all required database tables are included. Record all multipart filenames privately.
3. Download **every** part to `~/.local/share/psitrends-ops/<date>/backups/`, with private permissions, outside Git and public document roots. Do not publish download URLs.
4. Check free disk space before extraction; this Mac reported about 10 GiB available, not sufficient evidence of capacity for multiple full clones/images. Record exact byte count and SHA-256 for every part and compare to origin checksums when transport permits.
5. Extract and restore to the isolated environment below. Archive readability or a success label alone is insufficient.
6. Keep the existing origin archive until an independent complete copy and restoration are verified. Evaluate archive exposure and secure retention; do not delete the only recoverable copy.

## Isolated restore plan — not yet executed

- Separate private document root and separate database/user, never a production database or a subdirectory of the live root. Prefer loopback-only local service for initial restoration, or authenticated staging if already provisioned.
- Match source PHP/database versions for the baseline restore before testing modernization. Dashboard currently reports PHP 8.1.34; database engine/version remain unverified. Production Joomla 4.4.0 is earlier evidence, not re-confirmed by this run.
- Disable outbound mail, scheduled tasks, analytics/GTM, payments and live integrations before first execution. Prevent outbound production DB connections. Private backup contents may include user records; do not expose them through an unprotected preview.
- Use vendor-supported extraction/restoration tooling from the official Akeeba site. Core's UI identifies Kickstart as its restore route; do not install it in the production web root to experiment.
- Configure clone-only DB credentials, paths and base URL; inspect configuration before execution to prevent a clone writing to production. Authentication/network isolation is required; robots/noindex is supplementary.
- Validate admin sign-in, Quix/Helix rendering, menus/modules/articles, EN/RU routes, assets, synthetic contact behavior, canonical rules and disabled external effects. Record failures, exact versions and checksums.
- Make one synthetic reversible change in staging, restore the baseline there and demonstrate that change is undone while content/routes still work. This establishes a non-destructive restore test.
- Retain logs privately; commit only a sanitized restore result with date, environment identity, archive checksums and verified steps.

Docker CLI is installed on this Mac but its daemon was unavailable (`/var/run/docker.sock` missing); PHP CLI was not found on PATH. This is a local runtime setup task, not evidence that staging is impossible and not a reason to upgrade production.

## Production rollback gate

Before each release, take a new verified snapshot, capture the exact CMS/config diff and choose the matching rollback. For small CMS edits, retain the previous field values privately and rehearse the change on staging. For platform changes, require full files/database restoration plus hosting/filesystem access that still works if Joomla fails. CMS-only access cannot establish disaster recovery for a broken CMS.

Historical narrow rollback for Issue #4: unpublish module 129 and restore the previous empty custom-JavaScript fields of template styles 17/21. Private before-values exist under `~/.local/share/sales-private/2026-09-22/`. This is **not** a full-site rollback test, and must not be executed merely to probe access.

The planned sequence follows [Akeeba's restoration guidance](https://www.akeeba.com/documentation/akeeba-backup-joomla/restoring-backups.html), checked 2026-09-22. Vendor instructions support the procedure; they do not prove this archive restores.
