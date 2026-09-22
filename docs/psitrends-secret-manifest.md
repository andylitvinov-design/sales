# PsiTrends secret manifest

Verified 2026-09-22. This file contains aliases and pointers only. Never paste credentials, account usernames, cookies, recovery codes, SQL, or raw private exports into Git or issue comments.

| Alias | Service / owner | Secure location | Recovery status |
|---|---|---|---|
| `cms-administrator` | PsiTrends owner; [Joomla](https://psitrends.com/administrator/) | macOS login Keychain: service `psitrends.production.joomla`, account alias `cms-administrator`; JSON username/password | Fresh-session login verified in two browsers |
| `origin-owner` | PsiTrends owner; [Hetzner](https://console.hetzner.cloud/) | Existing authorized owner session | Owner authentication gate cleared; fresh privileged host console login verified |
| `production-host-console` | PsiTrends host console only | macOS login Keychain service alias `psitrends-production-host`; captured in-memory retrieval only | Guest-agent recovery without reboot; console login verified; root SSH remains prohibited |
| `production-host-operations-key` | Scoped PsiTrends operations | Protected local SSH key files; fingerprint `SHA256:Cs42O9nvE0hJJhLGq2+b3DMKYxJ69nM3hWeuDKMd+5M` | Restricted-key SSH verified; operational UID 1001 and privileged sudo verified; root SSH prohibited |
| `dns-owner` | PsiTrends domain owner; Ukraine.com.ua nameservers | Existing registrar/provider account, not verified | Do not infer control from DNS records |
| `measurement-owner` | Existing PsiTrends Google account | Supported authenticated Google browser session | GA4/GTM accessible in prior release; GSC URL-prefix ownership verified via existing GTM this task; no durable OAuth export created |
| `maps-owner` | Existing Holistic House Google account | Supported authenticated Google browser session | Owner controls observed; no password copied |
| `pages-operator` | Existing sales Cloudflare account | Existing Wrangler-managed OAuth store outside Git | Reuse `wrangler whoami`; interactive owner login if expired |
| `backup-baseline` | PsiTrends private full export | `~/.local/share/psitrends-ops/2026-09-22/baseline.zip`, directory0700/file0600 | ZIP CRC and SHA256 verified; contains private data |

The old `weblinks/private/psitrends.md` credential note now contains a Keychain pointer only, with0600 permissions. No secret remains in that note. Do not use unrelated EzoHata SSH keys/accounts as evidence of PsiTrends access.

## Retrieval

Use the macOS Security framework helper at `~/.local/share/psitrends-ops/tools/read-keychain.swift`. Consume its JSON directly in memory and fill supported browser login fields; never print its stdout or put values in shell arguments. The `/usr/bin/security -w` path stalled in this environment; the Swift helper succeeded. A fresh session must verify the authenticated Joomla dashboard, not just a completed click.

The helper contains no secret, but its output does. A future session can recreate it with `SecItemCopyMatching` for generic-password class, the exact service/account above and `kSecReturnData=true`. Fail closed on non-success. Never auto-create a replacement with an invented credential.

Recovery on another Mac requires the owner's securely restored/unlocked login Keychain or owner re-entry. This is recoverability on this authorized Mac, not a claim of unattended cross-device access.

## Host recovery boundary

The host console credential and verified operational SSH key are distinct access mechanisms. The operational account has privileged sudo for stewardship; key restrictions do not make it a least-privilege account. Retrieve only through the authorized unlocked Keychain or protected key storage, without emitting values or raw errors. The Joomla-specific helper above does not by itself retrieve the host credential. Keep exact key filenames and private quarantine/verification records outside Git. The host is shared with other applications; operations remain limited to PsiTrends. See the [host recovery checkpoint](../.codex/reports/2026-09-22/psitrends-host-recovery.md).

SSH cleanup verification: the task-only diagnostic override was removed, validation/reload passed, log level is INFO and a fresh operations-alias login succeeded. Root login remains disabled; task-added root key entries were removed while the original root RSA key was preserved.
