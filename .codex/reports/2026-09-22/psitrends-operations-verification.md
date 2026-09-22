# Recovery and security verification

Verified 2026-09-22 after the host access recovery recorded in sales PR9.

## Production releases

- [Operations PR1](https://github.com/andylitvinov-design/psitrends-ops/pull/1) moved nginx sensitive-path guards before PHP/static regular-expression
  handlers. Seven synthetic requests passed against the exact production image.
  Live EN/RU/admin and CSS returned200; configuration/environment/runtime-PHP
  probes returned404; all tested responses included nosniff.
- [Operations PR3](https://github.com/andylitvinov-design/psitrends-ops/pull/3) blocks Akeeba's component backup directory. Two historical spool files
  (one empty, one 1,010,566,773 bytes) were privately quarantined intact after
  size/SHA verification. Both changed from anonymous200 to404. Exact filenames
  and URLs remain in the private incident evidence. The directory guard also
  denied a synthetic archive in an isolated container. EN/RU/admin remained200.
- No ordinary content was deleted; no core/PHP upgrade was released.

Each nginx release retained its exact before-file privately, validated syntax
before reload and verified public routes afterward. Single-file Docker mounts
require preserving the existing file inode when changing the mounted source.
An atomic host-path rename alone does not update an already mounted inode.

## Backup job

[Operations PR2](https://github.com/andylitvinov-design/psitrends-ops/pull/2) has22 synthetic tests and independent review passed. The initial 5 GiB
capacity dry run refused the conservative estimate without creating a dump.
The explicit host budget is8 GiB, with10 GiB reserve and1 GiB raw SQL cap.

A direct run completed, followed by a successful actual systemd service run
with its filesystem restrictions and nonblocking lock. The service exited0;
the daily timer was then enabled. First observed due time:2026-09-23 06:20UTC,
including jitter. Future successful runs have not yet been observed.

The service run completed2026-09-22 18:43:01UTC with104 database tables:

| File | Bytes | SHA256 |
|---|---:|---|
| database.sql.gz |13254854|ac3ae01fa3edae8fcef3abeaebb301a6bd887b1435c9bcf713f8314f92378684|
| project.tar.gz |593542815|0df5bf9c2ddf27280ad63262d7d3d65c49d73e1375cf681e046bb069b24b67ed|

No retention deletion is enabled. Review completed/partial manifests and capacity
weekly; failed service or a completed backup older than36 hours needs attention.
No external notification channel or independent encrypted cloud copy is claimed.

## Fresh restore against production images

The above paired bundle was checksum-verified and restored into a separate host
directory and internal Docker network. It uses the exact production PHP8.1.34,
nginx1.29.8 and MySQL8.0.46 image identities. The shared production containers,
volumes and databases remain separate.

Isolation: all restored production accounts blocked; sessions/remember keys/MFA
state cleared; fresh database/application secrets; mail and scheduler disabled;
no Traefik exposure; no effective Docker published ports; noindex response header
and CSP blocking third-party requests/forms. Local browser access uses an SSH
forward restricted to the isolated nginx destination. Application cache uses files
and sessions use the isolated database, so Redis parity is not claimed.

All104 tables restored. Anonymous English, Russian and administrator routes
returned200 through the local tunnel, with noindex+CSP and no fatal diagnostics.
This verifies a fresh files/database restore against the production image stack.
It does not constitute complete host disaster recovery or final application QA.
Native client template/menu/article integration proceeds in this clone separately.

Two restore-tool corrections were verified: wait for an authenticated SQL query
rather than mysqladmin ping (which can succeed before initialization credentials
are ready); normalize traversal on cloned web directories after safe tar extraction.
The private outer staging directory remains0700 and configuration is0640.

## Recovery pointers

Private source backups, manifests and clone credentials remain outside Git under
the host's PsiTrends backup/staging directories. The daily backup tool and units
are versioned here. The full original off-server Akeeba baseline remains retained
on the owner workstation with its verified restore evidence in sales documentation.
Disable the timer to stop scheduling; never remove backup data as part of rollback.
Do not restore quarantined archives to a public web directory.
