# PsiTrends operational architecture

2026-09-22. This is current evidence and its limits, not the final brand/URL architecture.

| Layer | Source of truth / evidence |
|---|---|
| Public practice / legacy site | [psitrends.com](https://psitrends.com/), Joomla database/files; authenticated administrator reachable now |
| Runtime | Live dashboard reports PHP 8.1.34 and warns Joomla 4 support ended; exact current core patch/database version still requires inspection |
| Backup | Akeeba Core 9.8.1; backup 12 shown OK, restore unverified |
| Hosting | Prior #4 report: Hetzner origin, nginx, root `/var/www/html`, Joomla 4.4.0, Quix/Helix `tx_valley`; not independently refreshed here |
| Interim acquisition | [Cloudflare Toronto site](https://sales-bwa-photo.pages.dev/); keep live until first-party replacements pass release gates |
| Git operations home | `andylitvinov-design/sales`; sanitized runbooks and static acquisition source only; not the deployed Joomla filesystem |
| Secrets / backups | Login Keychain and private local directories outside repositories; see secret manifest |
| Analytics | Prior release identifies existing GA4 `G-Z4BGV9GP4N`, GTM `GTM-K2KKDZD`; current authenticated audit pending |

Use this repository as the single sanitized operations index for now. Do not create a competing repository or copy Joomla's secret-bearing files into `sales`. Revisit a private canonical operations repository only with an explicit source-of-truth migration plan.

Final client/Academy brand hierarchy, content inventory and old→new URL mapping are pending the access/backup gates and complete crawl. Existing working names in the issue remain requirements/hypotheses, not verified business or legal facts.
