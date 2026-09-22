# PsiTrends production access

Source of truth: [Issue6](https://github.com/andylitvinov-design/sales/issues/6), including its three master-plan comments. Last verified2026-09-22. `sales` holds safe operations records and the two interim acquisition pages; it is **not** the deployable Joomla source.

## Resume safely

1. Read this file, [secret manifest](psitrends-secret-manifest.md), [backup/restore](psitrends-backup-restore.md), `.codex/LATEST.md` and Issue6 comments.
2. Confirm Git remote and preserve unrelated work. Use a focused `codex/` branch.
3. Recover `cms-administrator` from Keychain directly into a supported browser. Open [administrator](https://psitrends.com/administrator/). Fresh login was verified after logout and in a separate Chrome session; cookies are not the sole recovery path.
4. Snapshot the exact object before editing; retain private bytes outside Git. Check the date and checksum of the full backup.
5. Use supported Joomla UI. Never deploy the sales repository or its static snapshot over `/var/www/html`.
6. Verify public EN/RU pages, attribution and rollback. Record exact IDs and before/after. A successful save is not sufficient production evidence.

## Permission matrix

Labels describe demonstrated operations, not the mere presence of a toolbar. Super Users grants broad CMS ACL but does not override read-only container files. Untested destructive operations remain unverified.

| Surface | Verified status | Evidence / limit |
|---|---|---|
| Joomla login | FULL | Keychain credential recovery and fresh authenticated login |
| Current ACL | FULL | Super Users; root `core.admin` group8 grant in backed-up ACL; two accounts in this group |
| Articles create/edit/publish/unpublish | READ ONLY | Article inventory and create/edit controls visible; writes not exercised |
| Menu management | READ ONLY | 216 records exported,183 site records; writes not exercised |
| Module management | WRITE | Prior module129 live; module130 unpublished/restricted edit→restore→trash test verified |
| Helix style settings | WRITE | Styles17/21 saved and live attribution verified in Issue4 |
| Quix pages | READ ONLY | 141 records exported; editor stalls with PHP deprecation output; page writes not proven |
| Media management | READ ONLY | Files backed up and media inventory; upload/delete not exercised |
| Extension install/update/remove | NOT VERIFIED | Inventory readable; core files read-only; no production install/update attempted |
| User management | READ ONLY | Roles and account count verified; no accounts changed |
| Global configuration | READ ONLY | Error-reporting save explicitly failed: unable to write configuration file |
| Cache management | READ ONLY | Settings and manager available; destructive purge not needed/tested |
| Database | READ ONLY | Full104-table export; no direct administration credential tested |
| File manager | NOT VERIFIED | No working independent file manager established |
| SFTP/SSH | NO ACCESS | Available authorized key/default connection and original issued password rejected |
| Hetzner console | NO ACCESS | Login screen; no authenticated owner session |
| DNS control | NOT VERIFIED | Public NS known; provider mutation credentials not verified |
| SSL control | NOT VERIFIED | Public HTTPS works; renewal/deploy control not verified |
| Scheduled tasks | READ ONLY | Joomla scheduler has0 records; host cron unknown |
| Backup | WRITE | Akeeba profile repaired, full backup12 completed and downloaded privately |
| Restore | WRITE (CMS objects/local clone) | Object rollback and full104-table local restore verified; host disaster recovery NOT VERIFIED |
| GA4 / GTM | READ ONLY | Existing property/stream and tag configuration read; prior live event readback; GTM publish not tested |
| Search Console | FULL (URL-prefix); NO ACCESS (domain) | URL-prefix ownership automatically verified via existing GTM; reports processing |
| GBP | WRITE | Prior owner changes/website verified; category untouched; performance baseline separately recorded |
| Cloudflare Pages | WRITE | Existing authenticated Direct Upload deployment verified in Issue4 |
| Cloudflare Web Analytics | READ ONLY | Existing site/receipt readback in prior report; not a CTA event warehouse |

## Hosting boundary and owner recovery

Origin178.105.78.179, server label`ubuntu-16gb-fsn1-1`, nginx/PHP/Joomla document root`/var/www/html`. Exact server-creation correspondence confirms origin; it does not establish present credentials. The issued initial root password no longer authenticates. Do not retry it or publish it.

Owner-only next step: sign in to the existing Hetzner account and complete its recovery/2FA, then expose the authorized server console or provision a dedicated SSH public key. Do not reset/reboot production casually. Once available: inspect container/compose mounts, locate the real source/config repository, snapshot volumes, verify cron/TLS/DNS ownership, and install a least-privilege operational key. Record only aliases/fingerprints and access method.

No verified production Git repository or server-level recovery has been invented. Keep safe records here until a private production repository is actually established; migrate with an explicit pointer rather than creating competing sources of truth.
