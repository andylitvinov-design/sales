---
name: sales-landing
description: Use for landing pages, promo pages, and small static marketing pages in `/Users/andriilitvinov/projects/MYPROJECTS/sales`. Extends the general landing-builder skill with this project's workflow: scaffold via `npm run page:new`, open pages over `http://127.0.0.1:8877/sales/...`, keep one clear CTA and one message per screen, and finish with the full local audit pipeline and reports.
---

# Sales Landing Skill

Use this skill for work inside `/Users/andriilitvinov/projects/MYPROJECTS/sales`.

The legacy compatibility path `/Users/andriilitvinov/projects/sales` may still resolve via symlink, but it should not be treated as the canonical project home.

## Purpose

Ship compact HTML/CSS marketing pages that are easy to review in browser and pass the local quality bar.

## Project Defaults

- Static pages only: plain HTML/CSS/JS unless the task clearly requires more.
- One primary CTA per page.
- One clear message per screen.
- Each section should do one job: explain, prove, deepen, or convert.
- Prefer short, direct copy over broad brand language.

## Required Workflow

1. Create a new page with `npm run page:new -- <slug> [title]` when starting from scratch.
2. Always pair this skill with: `landing-builder`, `frontend-skill`, `page-cro`, `playwright`, `playwright-interactive`, and `screenshot`.
3. Add `imagegen` whenever the landing needs a new hero image, edited bitmap visual, or stronger art direction.
4. Prefer relevant plugin capabilities from `Build Web Apps` and `Vercel` when they improve frontend quality checks, browser verification, or visual review.
5. Open and review pages through `http://127.0.0.1:8877/sales/<slug>.html`.
6. Never use `file://` or local file preview for HTML.
7. Run `npm run page:audit -- <slug>.html` before calling the page done.
8. If local images or SVG assets were added or replaced, run `npm run assets:optimize -- <file...>`.
9. Save reports in `reports/`.

## Quality Bar

- No horizontal overflow on desktop or mobile.
- Desktop hero should fit in the first viewport when possible.
- Mobile CTA must remain readable and easy to tap.
- Use versioned CSS links like `page.css?v=1` during review to avoid stale cache.

## Design Accents

- Start from structure: hero, proof, offer, CTA.
- Keep the first screen decisive, not crowded.
- Avoid adding sections that do not strengthen conversion.
- Use one visual direction per page, not mixed styles.
- Prefer evidence and concrete offer language over generic claims.

## Page Archetypes

### Service Page

Use when the page sells a service, package, or engagement.

- Hero: who it is for, what outcome they get, primary CTA
- Proof: concrete results, clients, credibility, or process signal
- Offer: what is included, how work starts, why this is the right format
- CTA: book, message, apply, or request details

### Personal/About Page

Use when the page needs to build trust in a person behind the offer.

- Hero: name, role, point of view, primary CTA
- Credibility: background, experience, selective proof
- Working Style: how the person thinks, works, or helps
- CTA: contact, book, or continue to the main offer page

### Offer Page

Use when the page pushes one focused promo, package, or conversion event.

- Hero: offer, deadline or condition if real, primary CTA
- Value: what the user gets and why it matters now
- Objection Handling: what may block action and the shortest useful answer
- CTA: same action repeated clearly without branching

## Preflight Checklist

- Is there exactly one primary CTA?
- Does the first screen explain the offer in one glance?
- Does each section have only one job?
- Is the HTML page reviewed via `http://127.0.0.1:8877/sales/...`?
- Has `npm run page:audit -- <slug>.html` been run?
- Were reports saved in `reports/`?

## Use With

- `landing-builder` for compact landing structure.
- `frontend-skill` when visual direction matters more than raw speed.
- `copywriting` when the main task is messaging quality.
- `page-cro` when improving an existing page's conversion rate.
- `playwright` and `playwright-interactive` for browser verification and flow checks.
- `screenshot` for screenshot-based visual review.
- `imagegen` for bitmap visual generation or visual iteration.
