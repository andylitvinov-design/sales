# Production P0: session lifetime and seven legacy renderer fields

2026-09-22. Separate from the pending client redesign and platform upgrade.

## Session lifetime — released and verified

Production configured6400 minutes of inactivity (over four days). Changed only session lifetime to60 minutes through Joomla Global Configuration. On the isolated host clone, supported UI Save changed60→30, readback confirmed30, and supported Save restored60. All parsed configuration properties exactly matched the original after rollback.

Before production Save, the complete configuration was copied privately outside webroot. Joomla displayed successful Save; PHP syntax passed; comparison of all parsed properties confirmed only `lifetime` changed6400→60. Cache lifetime, session handler, HTTPS enforcement and every other configuration property were unchanged. EN/RU home and administrator returned200. This is an inactivity timeout, not a forced maximum session age or MFA implementation. Owner credentials and recovery remain intact.

Rollback: authenticated Global Configuration → System → Session Lifetime; restore the prior value only if justified. The exact private before-file is `/var/backups/psitrends/configuration.before-session-lifetime.php`; do not copy credentials from it into reports. Prefer restoring the one property through Joomla rather than overwriting subsequent configuration changes.

## Legacy renderer data repair

[Private operations PR5](https://github.com/andylitvinov-design/psitrends-ops/pull/5) pins seven collection hashes and exact editor mappings. The only semantic change is an empty-string background field becoming null, matching the installed renderer's nullable-array contract. Article text, URLs, menu structure and vendor code remain unchanged. JSON object/array types are preserved.

Isolated apply→exact rollback→cold-cache render→reapply proved the cause: all seven articles failed with the original values and rendered200 with corrected values. Native client records were unchanged. Parent reran the synthetic guard tests independently. A fresh full scheduled backup completed before production apply; seven full-row snapshots were also saved privately before transactional, optimistic writes.

Production read-only preflight matched all seven original hashes. Apply completed for exactly seven collections; private snapshots were copied out of the container. Only those seven generated editor cache directories were eligible for private quarantine; none existed, so none moved. All11 previously failing query variants now return HTTP200 with no renderer or fatal-error text. No content was deleted. The client template and Joomla/PHP platform remain separate pending releases.

Rollback uses the guarded normalizer's `--rollback` mode with the exact private apply snapshot and the production configuration path, requiring matching database identity and unchanged corrected-data hashes. Keep rollback evidence outside webroot under `/var/backups/psitrends/legacy-background-release`. Restoring malformed data intentionally reintroduces the known errors; use only for an independently established regression. Full backup immediately before this batch is the completed scheduled bundle with timestamp `20260922T192925Z`; its restore procedure is unchanged from the verified host recovery rehearsal.
