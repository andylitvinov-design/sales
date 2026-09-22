# PsiTrends production access

Verified 2026-09-22. Overall status: **PARTIAL — owner Keychain authentication blocks fresh recovery verification**. Follow [the execution contract](psitrends-execution-contract.md); a working browser session is not durable recovery.

## Recover the administrator credential

- Service: macOS login Keychain, `psitrends.production.joomla`.
- Account alias: `cms-administrator` (an alias, not the Joomla login name).
- Destination: [Joomla administrator](https://psitrends.com/administrator/).
- Ownership: existing PsiTrends administrator credential held in this Mac's login Keychain. Hosting/account billing ownership remains unverified.
- The old private note at `~/projects/weblinks/private/psitrends.md` now contains only this pointer. Do not run the obsolete `~/.local/share/psitrends-ops/import-keychain.swift`: it expects removed plaintext and fails before importing.
- Run `python3 scripts/psitrends-access-check.py` from this checkout. It reports status only, uses a bounded retrieval, and never emits the credential. Successful retrieval does not prove CMS authentication.
- If Keychain requests authentication, the owner must unlock/approve the local prompt. Do not ask for the Mac password in chat or try alternate readers to evade the prompt. Do not change Keychain access controls.
- After approval, retrieve the JSON credential through a captured process pipe in the supported browser runtime. Keep `username` and `password` in memory only; fill the observed Joomla login fields. Never print process output, raw errors, form values or authenticated URLs containing session/CSRF material. Do not put credentials in command arguments, environment variables, screenshots or files.
- Verify a fresh login: finish any open admin edits, log out using the UI, confirm the login screen, retrieve from Keychain, sign in and confirm the dashboard. Record only date, result, source alias and whether MFA intervened. Do not call a new tab with an existing session a fresh login.
- If missing or invalid, the owner restores the existing credential in Keychain or completes Joomla's account recovery. Do not create a new privileged account as a workaround.

## Permission matrix

`READ ONLY` below means only read access demonstrated in this run, not a proven ACL restriction. `NOT VERIFIED` means no inference from menus or another successful edit. Historical evidence is explicitly separated.

| Resource / operation | Current verified level | Evidence / next verification |
|---|---|---|
| Joomla administrator | READ ONLY | Authenticated dashboard opened; surviving session only |
| Current role / effective ACL | NOT VERIFIED | Dashboard access is insufficient; inspect effective permissions without exporting account data |
| Article create/edit/publish/unpublish | NOT VERIFIED | Test each relevant permission safely after recovery/backup |
| Menu management | NOT VERIFIED | Inspect authorized editor and later reversible staging test |
| Module management | NOT VERIFIED | Prior release changed module 129; not re-tested here |
| Quix/Helix pages/template styles | NOT VERIFIED | Prior release changed styles 17/21; not re-tested here |
| Media | NOT VERIFIED | Menu presence alone is insufficient |
| Extension install/update/remove | NOT VERIFIED | Do not test by altering production |
| User management | NOT VERIFIED | Do not create/change users to probe permission |
| Global configuration | NOT VERIFIED | Avoid exporting secret-bearing fields |
| Cache management | NOT VERIFIED | No cache mutation performed |
| Database tools/export | NOT VERIFIED | Akeeba full-backup label is not a DB restore test |
| Files / file manager | NOT VERIFIED | Prior core read-only observation needs refresh |
| SSH/SFTP | NOT VERIFIED | No successful transport/account established |
| Hetzner panel | NOT VERIFIED | Origin attribution is not panel access |
| DNS / SSL / certificates | NOT VERIFIED | Public site access is not control |
| Cron / scheduled tasks | NOT VERIFIED | Inspect after recovering operational access |
| Backup management | READ ONLY | Akeeba Core 9.8.1, ID 12 full backup listed OK |
| Backup download / restore | NOT VERIFIED | Browser download attempt did not yield verified local bytes; no restore run |
| GA4 / GTM | NOT VERIFIED | Prior #4 receipt/readback exists; no current authenticated inspection |
| Search Console | NOT VERIFIED | Index coverage/ownership not established |
| Google Business Profile | NOT VERIFIED | No current authenticated inspection |
| Cloudflare Pages / analytics | NOT VERIFIED | Prior deployment evidence does not establish current access |

## Resume order

1. Complete the owner unlock and fresh-login verification.
2. Verify ACL and hosting/transport access; update the matrix from evidence.
3. Complete [backup, rollback and isolated staging](psitrends-backup-restore.md).
4. Continue the contract's complete crawl, audits and implementation in order.

Never deploy this Git checkout to Joomla or upload the repository root to Cloudflare. The working production source is Joomla's database/files, not `sales`.
