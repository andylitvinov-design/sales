# Sales AGENTS

## Scope

- Applies to `/Users/andriilitvinov/projects/MYPROJECTS/sales`.
- Legacy compatibility path `/Users/andriilitvinov/projects/sales` may still resolve via symlink, but the canonical project home is under `MYPROJECTS`.
- Use this folder for landing pages, promo pages, and small HTML/CSS marketing pages.

## Standard Workflow

For every new landing page or static web page:

1. Create files with the scaffold:
   - `npm run page:new -- <slug> [title]`
2. Always activate the landing skill stack:
   - local `sales-landing` skill from `SKILL.md`
   - `landing-builder`
   - `frontend-skill`
   - `page-cro`
   - `playwright`
   - `playwright-interactive`
   - `screenshot`
   - `imagegen` when a page needs new or improved bitmap visuals
   - relevant plugin capabilities from `Build Web Apps` and `Vercel` when browser verification, visual review, or frontend quality checks can improve the result
3. Open the page via HTTP only:
   - `http://127.0.0.1:8877/sales/<slug>.html`
4. Run the full quality audit:
   - `npm run page:audit -- <slug>.html`
5. Use asset optimization when local visuals are added or replaced:
   - `npm run assets:optimize -- <file...>`
6. Fix issues before considering the page done.

## Landing Skill Rule

For landing-page creation in `/Users/andriilitvinov/projects/MYPROJECTS/sales`, treat the skill/plugin stack above as the default required toolset, not an optional extra.

- Do not create or redesign landing pages in this folder with only one generic coding skill.
- Default flow: structure with `sales-landing` + `landing-builder`, art direction with `frontend-skill`, conversion pass with `page-cro`, browser validation with `playwright` plus `playwright-interactive`, screenshot review with `screenshot`, and image generation/editing with `imagegen` when visuals need improvement.
- Treat `Build Web Apps` and `Vercel` plugin capabilities as preferred helpers when they materially improve frontend verification or visual QA.

## Required Quality Checks

Every page should be checked with:

- `html-validate`
- `stylelint`
- `pa11y`
- `lighthouse`
- `linkinator`
- local `playwright` screenshots + viewport metrics

## Quality Goal

- One clear message per screen.
- No horizontal overflow.
- Desktop hero should fit in the viewport when possible.
- Mobile should not overflow horizontally and should keep CTAs readable.
- Reports must be saved in `reports/`.

## Commands

- Create page: `npm run page:new -- <slug> [title]`
- Audit page: `npm run page:audit -- <slug>.html`
- Audit current default page: `npm run page:audit`

## Notes

- Prefer one primary CTA per page.
- Use versioned CSS links like `page.css?v=1` to avoid stale browser cache during review.
- Keep each section focused on one job: explain, prove, deepen, or convert.
---

## Agent Command Registry

### /delivery

`/delivery` is sufficient by itself. No extra delegation language is required.

When the user invokes `/delivery`, read and follow `.claude/commands/delivery.md`.

Stop only with `STATUS: SUCCESS` or `STATUS: BLOCKED`.

**Project adapter:**

- Repository: `andylitvinov-design/sales`
- Default branch: `codex/bootstrap-sales`
- Target branch: `codex/bootstrap-sales`
- Package manager: `npm`
- Framework: static HTML landing pages
- Build: `npm run dashboard:build`
- Check: `npm run check` (html-validate + stylelint + pa11y + lighthouse + linkinator)
- CI: none confirmed
- Deployment: Cloudflare Pages Direct Upload, project `sales-bwa-photo`; deploy only `output/toronto-public` from `npm run acquisition:build`. Pages production branch is `main` (distinct from GitHub default).
- Primary live URL: `https://sales-bwa-photo.pages.dev/` (production verified 2026-09-22 UTC).

**Release verification:** Require a passing preview and repo checks before production; verify live routes and indexing before claiming release success. Never upload the repository root.


---

## PsiTrends Natural-Language Autopilot

For any user request that targets **psitrends.com**, treat the user's plain-language request as the task specification. Do not require the user to rewrite it as a technical prompt.

Before changing PsiTrends, read:
- `.codex/LATEST.md`
- GitHub Issue #6 (PsiTrends stewardship)
- `docs/psitrends-production-access.md`
- `docs/psitrends-backup-restore.md`
- the most relevant current PsiTrends issue/runbook for the requested feature

### Source and hosting boundaries

- `andylitvinov-design/sales` owns safe client-facing source, integration code, route/content definitions and task records.
- `andylitvinov-design/psitrends-ops` owns sanitized infrastructure, backup/migration tooling and production-operation evidence.
- Production is **Joomla on Hetzner**, not Vercel and not a Git-deployed copy of this repository.
- Never deploy the repository root over the Joomla document root.
- Do not use the generic `/delivery` Cloudflare Pages adapter for PsiTrends production.

### Default autonomous flow

When the user gives a PsiTrends task in ordinary language:

1. Convert the request into concrete acceptance criteria without asking the user to write a technical prompt.
2. Inspect the latest canonical source, current open PRs/issues and live EN/RU behavior relevant to the task.
3. Preserve unrelated work and use a focused `codex/` branch.
4. Before any production write, confirm the established backup/rollback path and capture the exact pre-change object/state required by the runbook.
5. Implement the smallest compatible source/integration change in the correct repository.
6. Run the available repo checks plus desktop/mobile visual QA and EN/RU counterpart checks when the task affects public pages.
7. Release only through the established Joomla/Hetzner production workflow and within the PsiTrends scope.
8. Perform live readback after release. A commit, PR, successful save or successful build is not proof of production completion.
9. Record the production result, verification, and rollback reference in the relevant issue/report.
10. Finish with either `STATUS: SUCCESS` or `STATUS: BLOCKED`, and state the exact remaining owner action only when one is genuinely unavoidable.

The intended user experience is: **plain-language request → agent plans → agent implements → agent verifies → agent reports the live result**.
