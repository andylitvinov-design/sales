# PsiTrends secret manifest — pointers only

Checked 2026-09-22. No values, login usernames, cookies, tokens or recovery codes belong here.

| Alias | Service / destination | Storage / recovery | Verification |
|---|---|---|---|
| `cms-administrator` | [PsiTrends Joomla](https://psitrends.com/administrator/) | macOS login Keychain service `psitrends.production.joomla`; captured in-memory retrieval only | Legacy pointer confirms migration; current read waited for owner authentication; fresh login pending |
| Hosting / SSH / SFTP | PsiTrends origin | No verified durable alias yet | NOT VERIFIED |
| DNS / certificates | PsiTrends domain | No verified durable alias yet | NOT VERIFIED |
| GA4 / GTM / Search Console / GBP | Existing Google resources | Existing authorized account sessions; durable recovery not assessed | NOT VERIFIED in this run |
| Cloudflare | Existing Pages/analytics resources | Existing tooling/session; durable recovery not assessed | NOT VERIFIED in this run |

The private operations directory `~/.local/share/psitrends-ops` has mode 0700. Existing profile snapshot `2026-09-22/akeeba-profile1-before.json` has mode 0600. These are local private records, not full-site backups. Store future backup bytes outside **all** repositories, directories 0700/files 0600. Use an approved encrypted off-site destination only after its ownership/access is verified.

Gitignore protections reduce accidental adds but do not protect already tracked files or forced adds. Inspect the exact staged diff before every commit. Publish only sanitized manifests and checksums. Do not copy private bytes into ignored repository folders as routine storage.

See [access recovery](psitrends-production-access.md) and [backup procedure](psitrends-backup-restore.md). No new credentials, access grants or secret-manager account were created by this run.
