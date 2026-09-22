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

Labels describe demonstrated operations, not the mere presence of a toolbar. Super Users grants broad CMS ACL but does not override filesystem ownership or container mount restrictions. Untested destructive operations remain unverified.

| Surface | Verified status | Evidence / limit |
|---|---|---|
| Joomla login | FULL | Keychain credential recovery and fresh authenticated login |
| Current ACL | FULL | Super Users; root `core.admin` group8 grant in backed-up ACL; two accounts in this group |
| Articles create/edit/publish/unpublish | READ ONLY | Article inventory and create/edit controls visible; writes not exercised |
| Menu management | READ ONLY | 216 records exported,183 site records; writes not exercised |
| Module management | WRITE | Prior module129 live; module130 unpublished/restricted edit→restore→trash test verified |
| Helix style settings | WRITE | Styles17/21 saved and live attribution verified in Issue4 |
| Quix pages | READ ONLY | 141 records exported; existing editor now renders its content iframe and Save control without the PHP warning. One MutationObserver browser error remains; page writes not proven |
| Media management | READ ONLY | Files backed up and media inventory; upload/delete not exercised |
| Extension install/update/remove | NOT VERIFIED | Inventory readable; filesystem ownership limits CMS writes; no production install/update attempted |
| User management | READ ONLY | Roles and account count verified; no accounts changed |
| Global configuration | WRITE | Supported Joomla UI Save confirmed success after scoped configuration permission repair; parsed configuration values unchanged by verification Save |
| Cache management | READ ONLY | Settings and manager available; destructive purge not needed/tested |
| Database | READ ONLY | Fresh consistent 104-table dump through the existing container credential verified privately; no production database write exercised |
| File manager | NOT VERIFIED | No working independent file manager established |
| SFTP/SSH | WRITE (SSH) | Dedicated restricted-key SSH login verified, operational UID 1001 and privileged sudo verified; SFTP not separately tested. Root SSH remains prohibited |
| Hetzner console | WRITE (PsiTrends scope) | Owner session authenticated; fresh privileged console login succeeded; scoped archive quarantine verified |
| DNS control | NOT VERIFIED | Public NS known; provider mutation credentials not verified |
| SSL control | NOT VERIFIED | Public HTTPS works; renewal/deploy control not verified |
| Scheduled tasks | READ ONLY | Joomla scheduler has0 records; root crontab has0 active entries; other host schedulers not yet audited |
| Backup | WRITE | Akeeba profile repaired, full backup12 completed and downloaded privately |
| Restore | WRITE (CMS objects/local clone) | Object rollback and full104-table local restore verified; host disaster recovery NOT VERIFIED |
| GA4 / GTM | READ ONLY | Existing property/stream and tag configuration read; prior live event readback; GTM publish not tested |
| Search Console | FULL (URL-prefix); NO ACCESS (domain) | URL-prefix ownership automatically verified via existing GTM; reports processing |
| GBP | WRITE | Prior owner changes/website verified; category untouched; performance baseline separately recorded |
| Cloudflare Pages | WRITE | Existing authenticated Direct Upload deployment verified in Issue4 |
| Cloudflare Web Analytics | READ ONLY | Existing site/receipt readback in prior report; not a CTA event warehouse |

## Hosting boundary and recovered console access

The Hetzner owner authentication gate is cleared. Privileged host credential recovery used the guest agent without reboot; a fresh root console login succeeded. The recovered credential is stored under Keychain service alias `psitrends-production-host`; see the [secret manifest](psitrends-secret-manifest.md). Do not retry the obsolete initially issued credential.

A dedicated operations key exists in protected local SSH storage, fingerprint `SHA256:Cs42O9nvE0hJJhLGq2+b3DMKYxJ69nM3hWeuDKMd+5M`. Dedicated restricted-key SSH authentication is verified with operational UID 1001 and privileged sudo capability. This is a privileged stewardship account, not a least-privilege claim. Root SSH remains prohibited. Key restrictions and SSH configuration apply to the operational account; key storage is in a root-owned directory readable for public-key authentication.

The host runs other applications. Authorization and changes are limited to PsiTrends. The PHP container's `/var/www/html` bind source is `/opt/docker/sites/psitrends/public_html` with write capability; nginx mounts it read-only. Deployment configuration lives alongside that directory; no production Git worktree was found.

After private backup and isolated testing, only `configuration.php` gained runtime-group write access: deployment owner UID 1000, group GID 33, mode 0664. PHP UID 33 still cannot write the document-root directory or core entry point. Joomla's supported `com_config` Save confirmed success, retained the permissions and changed no parsed configuration property values. Error reporting was separately changed from `maximum` to `none`; PHP syntax and EN/RU HTTP checks passed.

The existing Quix editor now displays its content iframe and Save control without the earlier PHP warning. A MutationObserver browser error remains unattributed. No production Quix page was saved during this inspection, so full editor/save compatibility remains unverified.

Two exposed old archives were moved to private host quarantine. Both sampled public paths changed from HTTP 200 to 404; English and Russian homepages remained HTTP 200. Exact archive names/paths, content and checksums remain private. Quarantine is containment, not deletion or proof that every exposure has been eliminated. Do not blindly reverse the move and re-expose the archives.

Read the [host recovery checkpoint](../.codex/reports/2026-09-22/psitrends-host-recovery.md) before continuing. SSH and a safe host inventory are now verified. Remaining work includes full Quix editor/save verification, source ownership and tested host disaster recovery, followed by the existing staged program. No platform modernization or complete program delivery is claimed. Keep the original verified local backup and restore as the baseline.

The private [psitrends-ops repository](https://github.com/andylitvinov-design/psitrends-ops) now holds sanitized infrastructure, backup tooling and release evidence. Live secrets/data remain outside Git. A fresh paired backup has been restored against the production image stack on an isolated host clone; complete host disaster recovery remains untested. The source split is deliberate: sales owns client content/integrations; psitrends-ops owns infrastructure and migration tooling.

## SSH traversal repair

The verified login failure cause was mode 0700 on filesystem root `/`, which blocked non-root path traversal. Default permissions were preserved; a named ACL grants only traversal (`--x`) on `/` to the operational account. The previous ACL was saved privately on the host. No broader filesystem permission change is implied. Fresh host inventory confirmed a shared application host; no other applications were changed.

Temporary SSH DEBUG3 diagnostics were removed. Configuration validation and reload passed, log level is INFO, root login remains disabled and fresh login through the SSH alias succeeded. Only root key entries added by this task were removed; the original root RSA key was preserved.

## Subsequent verified operations

Nginx sensitive-path guards now precede PHP/static handlers, and the Akeeba backup spool is explicitly denied. Two further spool files were quarantined intact; no ordinary content was deleted. The private scheduled backup service completed successfully before its daily timer was enabled. The restored host clone uses production PHP/nginx/MySQL images with fresh secrets, disabled production users/mail/jobs, noindex and blocked third-party requests. No Docker ports are effectively published; browser access is a scoped SSH local forward to the isolated nginx container. The operational key permits only that destination for local forwarding; agent forwarding, X11, PTY and root SSH remain restricted. Remove this forwarding exception when decommissioning the clone. See [operations verification](../.codex/reports/2026-09-22/psitrends-operations-verification.md).
