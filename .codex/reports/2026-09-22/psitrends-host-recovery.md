# PsiTrends host recovery and archive containment

2026-09-22. **PARTIAL — owner console and dedicated SSH access recovered; two known archive exposures contained; production diagnostics suppressed and supported configuration writes restored; full Quix editing and the broader program remain incomplete.** This checkpoint supplements the [merged stewardship audit](psitrends-full-audit.md) and [Issue #6](https://github.com/andylitvinov-design/sales/issues/6). It does not replace their prior backup, local restore or audit evidence.

## Verified actions and limits

| Area | Result |
|---|---|
| Hetzner owner authentication | Authenticated owner session established; the earlier owner-login gate is cleared |
| Host credential recovery | Guest-agent recovery completed without reboot; credential retained in macOS Keychain service alias `psitrends-production-host`, never in Git |
| Console authentication | Fresh privileged console login succeeded |
| Dedicated operations key | Protected local SSH key files exist; public fingerprint `SHA256:Cs42O9nvE0hJJhLGq2+b3DMKYxJ69nM3hWeuDKMd+5M` |
| SSH | Dedicated restricted-key login verified with operational UID 1001; privileged sudo returned UID 0. Root SSH remains prohibited |
| Filesystem boundary | PHP bind writable and nginx mount read-only; configuration repaired to owner UID 1000, group GID 33, mode 0664; runtime can write configuration but not the document-root directory or core entry point |
| Exposed old archives | Two files moved out of public serving scope into private host quarantine; content and checksums retained |
| Public verification | Both known archive paths returned 200 before containment and 404 afterward; English and Russian homepages returned 200 afterward |
| Local backup | Original canonical baseline archive retained; one redundant duplicate removed only after SHA equality was verified |

The host runs other applications. This work is scoped to PsiTrends only. Actual PHP bind source is `/opt/docker/sites/psitrends/public_html`, serving `/var/www/html` in the container. A writable mount alone does not override ownership; the scoped repair and supported UI Save below separately establish working configuration writes.

## Security evidence and rollback boundary

Exact archive paths, filenames, bytes and checksums remain in private operational evidence outside Git. Do not publish retrieval URLs. The refreshed private `quarantine-verification.json` records final HTTP 404 for both identified archive paths and HTTP 200 for the English and Russian homepages.

Retain quarantined contents and checksums for investigation and recovery. Do not blindly move archives back into the public document root as rollback. Any necessary restoration must use a protected location and preserve denial of public access. This bounded verification covers the two identified paths, not every possible archive or site exposure.

## Preserve the existing baseline

The merged audit already establishes the original private backup and local application/database restore. The duplicate baseline12 restore was stopped and its task-created container, database/user and files removed after verifying the original104-table clone remained intact. About826MiB was recovered. The canonical baseline archive, original restore tree and original database remain intact. A fresh104-table production SQL dump and private host configuration export are recorded in the [backup runbook](../../../docs/psitrends-backup-restore.md).

## Bounded Quix staging check

The original isolated clone was tested in an authenticated context through error-reporting settings `none → maximum → none`. Each editor-route HTTP response was 200. A `base64_decode(null)` deprecation warning at `components/com_quix/models/form.php:54` appeared only with `maximum`; returning to `none` removed that warning. The generic JSON endpoint returned HTTP 200 with valid JSON in all three modes. Evidence is retained privately in `quix-deprecation-evidence.json`.

This demonstrates warning suppression in the original isolated clone, not successful full JavaScript editor initialization or saving. At this staging-check point no production configuration change had been made; the subsequent bounded production change is recorded below. These checks do not establish a supported-version upgrade or new staging acceptance.

## Verified SSH repair and production configuration change

The exact SSH blocker was filesystem root `/` mode 0700 preventing non-root path traversal. The previous ACL was saved privately. Default permissions were preserved while a named ACL granted traversal only (`--x`) on `/` to the operational account. SSH subsequently authenticated with the dedicated restricted key; UID 1001 and sudo UID 0 were verified. The public-key directory is root-owned and publicly readable for authentication, with SSH configuration scoped by Match User. This account has privileged sudo for stewardship and is not described as least privilege. Root SSH remains prohibited. Fresh safe inventory confirmed the shared application host; no other applications were mutated.

After the isolated staging A/B check and a private configuration backup, production `error_reporting` changed from `maximum` to `none`. PHP syntax passed; English and Russian pages returned HTTP 200 without displayed diagnostics. Warning suppression does not prove full Quix JavaScript editor or save functionality. Retain the private before-state for precise rollback; restoring diagnostic display publicly should not be an automatic rollback action.

A separate configuration-write repair passed on the isolated staging clone: deployment owner UID 1000, runtime group GID 33 and mode 0664 allowed supported `com_config` POST saves `none → default → none` under PHP UID 33. Parent directory and core files remained unwritable. The same scoped repair is now applied in production after a private configuration backup: owner UID 1000, group GID 33, mode 0664. Docker execution as UID 33 confirmed configuration writable while `index.php` and the document-root directory remained unwritable.

The live Joomla `com_config` Save displayed “Настройки успешно сохранены.” PHP syntax passed. Parsing all public JConfig property values before and after this verification Save returned an empty changed-name list; `error_reporting` remained `none` and mode 0664 persisted. Global configuration **WRITE** is therefore verified through the supported UI. This does not establish full Quix editor/save operation.

The existing Quix editor for representative page130 subsequently rendered its content iframe and Save control without the earlier PHP warning. A MutationObserver browser error remains unattributed. The editor was closed without saving production page content; the page listing showed no checked-out indicator. Complete editing/saving still requires isolated testing.

The temporary SSH DEBUG3 override was removed; SSH configuration validation and reload passed. Log level is INFO and root login remains disabled. A fresh login through the operations SSH alias succeeded. Only root key entries added by this task were removed; the original root RSA key was preserved.

EN/RU browser rendering was inspected at1440×900 and390×844. Document width matched each viewport, the existing acquisition links retained their destinations, and no PHP diagnostic was displayed. These inspections used the authenticated CMS browser (edit controls visible); anonymous HTTP checks separately passed. No contact message or lead was submitted. Existing missing metadata, legacy claims and consent gaps remain in the broader audit; this configuration-only batch does not claim to resolve them.

Documentation relative links and `git diff --check` passed. Independent review found two stale roadmap blockers, which were corrected. No static landing source changed, so an unchanged Cloudflare build/deployment was not repeated.

## Continue from here

1. Preserve the verified restricted-key SSH path, private ACL before-state and root SSH prohibition; keep all subsequent operations scoped to PsiTrends.
2. Retain the refreshed private quarantine verification and content/checksum evidence without publishing archive locations.
3. Verify the complete Quix editor/save flow and host recovery path, preserving the now-verified scoped configuration permissions and private before-state.
4. Continue the existing ordered implementation program with explicit evidence for each gate.

Production Joomla configuration work consists of error-reporting suppression and the scoped permission repair, followed by a supported UI Save that preserved every parsed public configuration value. No platform modernization, full editor recovery, first-party migration or program completion is claimed. Archive quarantine and SSH repair are separate production host security/access actions. Issue #6 remains open.
