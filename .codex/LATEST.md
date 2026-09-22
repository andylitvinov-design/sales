# Latest task

2026-09-22 — [Issue6: PsiTrends stewardship](https://github.com/andylitvinov-design/sales/issues/6). IN PROGRESS.

Host access is persistently recovered. PHP error display and configuration Save are repaired. Nginx sensitive-path guards and backup-spool containment are verified live. A bounded daily private backup job completed under systemd before scheduling was enabled; its fresh104-table backup was restored against production PHP/nginx/MySQL images on an isolated SSH-only clone.

Actual isolated Joomla4.4.0→4.4.14→5.4.8 migration with Helix2.2.10/Akeeba10.4.0 and complete paired rollback passed. PHP8.3 and interactive editor acceptance continue; no production modernization is claimed.

Twelve bilingual client previews passed full audits and36 viewport checks. [Draft PR10](https://github.com/andylitvinov-design/sales/pull/10) adds the shared source, native Joomla adapter and preservation-first route map. Native install/routes/save/rollback are being tested on the host clone. No first-party client release or Cloudflare migration yet.

[Operations verification](reports/2026-09-22/psitrends-operations-verification.md), [private operations source](https://github.com/andylitvinov-design/psitrends-ops), [access](../docs/psitrends-production-access.md), [backup](../docs/psitrends-backup-restore.md), [upgrade plan](../docs/psitrends-upgrade-plan.md). PR8 audit and PR9 access recovery are merged; PR7 is superseded/closed. Keep Issue6 open until the remaining program and release verification are complete.
