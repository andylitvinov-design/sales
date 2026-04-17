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
