# /delivery

`/delivery` is sufficient by itself. The user does not need to add extra delegation phrases.
The command means full safe release-owner delegation:

```
task → acceptance criteria → implementation → result quality gate → local checks
→ PR → PR health → merge if permitted → deploy → live proof → final report
```

## Project Adapter

- Repository: `andylitvinov-design/sales`
- Default branch: `codex/bootstrap-sales`
- Target branch: `codex/bootstrap-sales`
- Package manager: `npm`
- Framework: static HTML landing pages
- Build command: `npm run dashboard:build` (or none for individual HTML pages)
- Check command: `npm run check` (html-validate + stylelint + pa11y + lighthouse + linkinator)
- CI: none confirmed
- Deployment: needs verification (no vercel.json found)
- Primary live URL: needs verification ← SUCCESS cannot be claimed without confirmed live URL

**Live URL blocker**: The production URL for this repo has not been confirmed.
Before any `/delivery` run can reach SUCCESS, verify the live URL:
1. Check Vercel dashboard or any hosting provider for this project.
2. Record the URL in this file and in AGENTS.md.
3. Rerun `/delivery` after the URL is confirmed.

## Safety Rules

- Do not change env vars, secrets, or hosting credentials.
- Preserve existing landing page quality (CTA, viewport, mobile layout).
- Run quality checks before declaring any page done.
- Do not merge failing html-validate, stylelint, or pa11y.

## Protocol

Act as release owner for this project.

1. Extract acceptance criteria from the original task.
2. Implement using the standard sales skill stack (see AGENTS.md).
3. Run: `npm run check` or `npm run page:audit -- <slug>.html`
4. Create a PR to `codex/bootstrap-sales`.
5. Verify deployment (when live URL is confirmed).
6. Return STATUS: SUCCESS or STATUS: BLOCKED.

Input format:

Task:
$ARGUMENTS

## Result Quality Gate

| Requirement | Status | Evidence | Verification method |
|---|---|---|---|

Allowed statuses: `PASS`, `PARTIAL`, `FAIL`, `NOT VERIFIED`.
`PARTIAL`, `FAIL`, or `NOT VERIFIED` block STATUS: SUCCESS.

## Stop States

### STATUS: SUCCESS

```txt
LIVE PROOF:
- Live URL:
- Checked route/page:
- Final deployed commit:
- Expected live behavior:
- Actual live behavior:
- Evidence:
```

### STATUS: BLOCKED

```txt
- Where the loop stopped:
- What is complete:
- What is not complete:
- Exact blocker:
- Evidence:
- Required user action:
- Next prompt to run after unblocking:
```

## Rules

- Never claim SUCCESS without confirmed live URL and live proof.
- Stop after 3 failed fix attempts — return STATUS: BLOCKED.
- Never touch env vars or secrets without explicit user approval.
