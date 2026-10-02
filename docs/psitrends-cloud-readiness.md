# PsiTrends cloud readiness

The sales Codex Cloud environment may prepare PsiTrends changes from phone/web.

Current safe boundary:
- source work, checks, branches and PRs: allowed;
- public read-only checks of psitrends.com: allowed;
- live Joomla changes: not assumed ready until a dedicated cloud access path is configured and verified.

Run the read-only readiness check directly with:

`node scripts/psitrends-cloud-preflight.mjs`

A passing check does not replace the existing backup, rollback and live EN/RU verification requirements.
