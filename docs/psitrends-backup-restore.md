# PsiTrends backup and restore

Verified2026-09-22. Private backup bytes stay outside every repository. This is a verified off-server backup with a local application/database restore and a CMS object rollback test; **production host disaster recovery is not yet verified**.

## Baseline manifest

- Akeeba Backup CORE9.8.1, profile1, full-site ZIP including database and ANGIE installer.
- Record12: `Issue 6 stewardship baseline 2026-09-22`, start12:31:32UTC, completed in1m30s, UI980.21MB.
- Local secure path: `~/.local/share/psitrends-ops/2026-09-22/baseline.zip`; parent0700, archive0600.
- Exact size1,027,828,507bytes; SHA256`0224cd608546f8ae0e1c977a3d4b904f01d5a7910c0343d9d97ea344054fe857`.
-19,028 archive entries; every ZIP CRC checked, no failure. Includes`configuration.php`, templates, media, extension files and213 database chunks representing104 tables.163 `.sql` filenames also include extension installer schemas and must not be mistaken for the full database count.
- Safe machine-readable manifest in `.codex/reports/2026-09-22/psitrends-evidence/backup-manifest.json`.

## Repeatable backup

Previous default output was unwritable and old backups obsolete. Before changing anything else, profile1 was privately snapshotted to`akeeba-profile1-before.json`. Output now uses`/tmp` outside document root, archive mode0600; count quota3 retained. `/tmp` is a temporary spool, not durable retention.

1. Joomla→Components→Akeeba→Backup Now, profile1/full-site. Use a dated description tied to the issue/change.
2. Wait for “Backup completed successfully”; record ID/start/duration/size.
3. Manage Backups→Download→confirm browser-download warning. Chrome download worked; the in-app download did not produce a file. Do not scrape cookies or bypass the supported browser session.
4. Immediately chmod0600 and move from Downloads to the private operations directory.
5. Validate ZIP CRC, size and SHA256, check configuration/installer/database presence. Never run SQL against production while validating.
6. Keep one baseline and one pre-release copy; remove server spool only after verified off-server retention. No automatic backup schedule is claimed: Joomla scheduler has0 tasks, host cron unknown. Establish encrypted independent storage and scheduled retention after hosting access is recovered.

## Local restore drill performed

A private Colima profile`psitrends-staging` and isolated Docker network restored the archive, with104 database tables,141 Quix records and216 menu records matching the baseline. English and Russian home routes returned200; English title matched. Original archive remains immutable.

Runtime: official Joomla4.4.0/PHP8.1 Apache image and MySQL8.0. Production uses nginx/PHP8.1.34, so this is an application/data restore test, not exact infrastructure parity. Legacy zero-date defaults required a session SQL-mode adjustment in the disposable database only. Optional PHP modules emitted startup warnings; modernization compatibility is not yet proven.

Isolation: internal Docker network, no database publication, production accounts blocked, session/key tables cleared, fresh local secrets, SMTP disabled, local configuration, CSP excluding third-party requests/forms and X-Robots-Tag noindex. No restored client data or credentials were published. Scripts and working clone are private under`~/.local/share/psitrends-ops/`; do not commit them wholesale. Docker default context restored; use explicit`--context colima-psitrends-staging`.

Installed Homebrew Lima lacked the VZ driver. An official Lima2.1.1 archive was checksum-verified and unpacked privately; Colima was started with that runtime on PATH. No system Lima replacement was made.

## Production disaster restore procedure — owner host access required

1. Recover authorized Hetzner console/SSH; inspect actual container/volume/compose layout before selecting a target. Snapshot current disk/database and record image versions and volume mounts.
2. Create an isolated staging directory/database on a protected host. Verify backup hash. Extract with supported Akeeba Kickstart/ANGIE or the verified SQL/file procedure. Never expose installer/SQL/configuration publicly.
3. Restore database to a new name and configuration to the correct credentials/paths. Keep mail, scheduled jobs, analytics and external integrations disabled during validation.
4. Test administrator login, Quix/Helix rendering and editing, EN/RU, menus, modules, media, contacts, redirect/SEO behavior and consent. Compare content counts/representative pages.
5. Only after staging passes, stop writes for the brief cutover, restore/switch volumes and DB together, verify production, then remove installer and temporary archives from web-accessible locations. Keep pre-cutover snapshot for rollback.
6. If verification fails, restore old application volume AND corresponding DB snapshot; changing only files is unsafe after a schema migration. Preserve logs privately.

Akeeba Core does not supply an integrated one-click restoration interface. Host-level writes are currently unavailable; do not call this an unattended disaster-recovery system.

## Verified object rollback

Unpublished module130, Super Users access, no position: saved note`baseline-A`, changed to`changed-B`, saved, restored`baseline-A`, saved, readback confirmed, then moved to trash. It never appeared publicly. This proves supported CMS object restoration, not a whole-site rollback.

Toronto release rollback remains: unpublish module129; restore previously empty Custom JavaScript on styles17/21; revert/redeploy sales allowlisted build if reverting analytics. Preserve approved GBP attribution until intentionally rolling back that release.

For Issue6 production changes see the dated audit's exact change log. Never restore the entire baseline merely to undo one redirect.

## Resume the stopped local drill

The private clone and database are retained; containers and VM were stopped after checks to release memory. Start only the dedicated profile with the private Lima runtime on PATH; preserve the user's default Docker context and use explicit `--context colima-psitrends-staging`. Start only `psitrends-staging-db` and `psitrends-staging-web`. The internal network deliberately does not expose a web port; the verified HTTP tests ran inside the web container. Do not attach a public network merely to obtain a convenient preview.
