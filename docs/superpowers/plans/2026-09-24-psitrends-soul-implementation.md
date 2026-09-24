# PsiTrends Soul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline delivery execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the canonical PsiTrends homepage feel human and authored while preserving its current bilingual client and Joomla contract.

**Architecture:** Keep the existing static generator and replace only the generated homepage composition and shared styling. Extend the existing allowlisted asset-copy loops so one inspected archival image is available in preview and Joomla production packages.

**Tech Stack:** Node ESM generator, static HTML/CSS, Playwright, Joomla template packager.

---

### Task 1: Lock visual regressions before implementation

**Files:**
- Modify: `integrations/psitrends-client/redesign.test.mjs`

- [ ] Add assertions that EN and RU homepages contain an editorial hero, early author note, three distinct chapter classes, an archival study asset, and no Unicode CTA arrows.
- [ ] Run: `node --test integrations/psitrends-client/redesign.test.mjs`
- [ ] Expected before implementation: FAIL because the current repeated cards and Unicode arrows remain.

### Task 2: Implement the generated home composition and asset contract

**Files:**
- Modify: `integrations/psitrends-client/home.mjs`
- Modify: `integrations/psitrends-client/template.mjs`
- Modify: `scripts/build-psitrends-client.mjs`
- Modify: `scripts/build-joomla-client.mjs`

- [ ] Render an early portrait-plus-atmosphere hero and concise author note.
- [ ] Render consultations, training, and workshops as separate editorial chapters.
- [ ] Use the inspected existing first-party training image in production and mirror it only in preview output.
- [ ] Replace generator-emitted Unicode arrows with semantic CSS-arrow spans.

### Task 3: Implement responsive editorial styling

**Files:**
- Modify: `psitrends-client.css`

- [ ] Add restrained forest, paper, parchment, clay and old-gold hierarchy.
- [ ] Compose desktop hero and chapters asymmetrically.
- [ ] Define intentional 390px and 430px spacing, type, crop, and CTA treatments with no horizontal overflow.

### Task 4: Verify, repair, and release

**Files:**
- Modify: `integrations/psitrends-client/browser-qa.mjs`
- Generated: `reports/`

- [ ] Build preview and production outputs; run generator and functional tests.
- [ ] Run HTTP browser QA at 390x844, 430x932 and 1440x900, including language navigation and consent/contact behavior.
- [ ] Inspect screenshot artifacts, repair visible defects, then run project quality checks.
- [ ] Build the guarded Joomla package, preserve the existing backup/rollback boundary, deploy through the established release script, and verify live EN/RU mobile and desktop rendering.
