# PsiTrends Author Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a warm bilingual author profile on `/about`, with the supplied library portrait on the homepage and About, the complete approved biography, existing public review media after the biography, and no shared-navigation changes.

**Architecture:** `integrations/psitrends-client/content.mjs` remains the copy source. `template.mjs` gains an About-only editorial renderer and an explicit page-level portrait selector, while `psitrends-client.css` adds the long-form reading layout. The Joomla package builder renders the reviewed source into article bodies and template media; a guarded private operations runner applies the narrow asset/template/article update only after a fresh backup and readback.

**Tech Stack:** Node.js ESM, static HTML/CSS, Node test runner, Playwright, Joomla 4 native template/article package, Akeeba/private backup and guarded Joomla native-model release runner.

---

### Task 1: Lock the user-supplied source contract with tests

**Files:**
- Modify: `integrations/psitrends-client/build.test.mjs`
- Modify: `integrations/joomla-client/build.test.mjs`

- [ ] **Step 1: Add failing output-contract tests**

```js
test('author profile keeps the supplied biography, portrait and reviews in reading order', () => {
  const english = render('about', 'en', {production:true});
  const russian = render('about', 'ru', {production:true});
  assert.match(english, /Let me introduce myself\./);
  assert.match(english, /Dreams Alive Psychotherapy/);
  assert.match(english, /Tantra Reiki School/);
  assert.match(english, /andy-library-desk\.png/);
  assert.ok(english.indexOf('TANTRIC WORKSHOPS') < english.indexOf('Testimonials'));
  assert.match(russian, /Позвольте представиться\./);
  assert.match(russian, /Школа Tantra Reiki/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test integrations/psitrends-client/build.test.mjs`

Expected: `FAIL` because the new portrait filename, full biography and testimonial section do not exist yet.

- [ ] **Step 3: Add the native-package expectation**

```js
assert.match(body, /andy-library-desk\.png/);
assert.match(body, /Let me introduce myself\./);
assert.match(body, /Testimonials/);
```

- [ ] **Step 4: Run the adapter test and verify RED**

Run: `node --test integrations/joomla-client/build.test.mjs`

Expected: `FAIL` because the package still emits the previous About body and portrait asset.

### Task 2: Add the supplied portrait as a local, optimized release asset

**Files:**
- Create: `integrations/psitrends-client/andy-library-desk.png`
- Modify: `scripts/build-psitrends-client.mjs`
- Modify: `scripts/build-joomla-client.mjs`

- [ ] **Step 1: Copy the supplied image without changing its content**

```bash
cp /var/folders/j3/pp2sf_1n4wz5y6fn7m6zcyc40000gn/T/codex-clipboard-37ac4e1e-a0ee-430e-8c07-59ec3bf2acff.png integrations/psitrends-client/andy-library-desk.png
npm run assets:optimize -- integrations/psitrends-client/andy-library-desk.png
```

- [ ] **Step 2: Use one optimized JPEG asset name in both builders**

```js
['integrations/psitrends-client/andy-library-desk.png', 'psitrends-client-assets/andy-library-desk.png']
```

Copy the same asset into the Joomla package path `template/media/assets/andy-library-desk.png`; retain `andrey.jpg` for pages outside home/About.

- [ ] **Step 3: Verify the browser-build assets exist**

Run: `node scripts/build-psitrends-client.mjs && test -f output/psitrends-client/psitrends-client-assets/andy-library-desk.png && node scripts/build-joomla-client.mjs && test -f output/psitrends-client-joomla/template/media/assets/andy-library-desk.png`

Expected: both generated artifacts contain the optimized image, with no external portrait dependency.

### Task 3: Implement the bilingual editorial narrative and minimal home refresh

**Files:**
- Modify: `integrations/psitrends-client/content.mjs`
- Modify: `integrations/psitrends-client/template.mjs`

- [ ] **Step 1: Store the complete English and Russian biography in structured source data**

```js
profile: {
  introduction: ['Let me introduce myself.', 'I’m Andy, a Jungian-oriented specialist and facilitator of archetypal practices.', 'Raised in Ukraine but living for 20 years worldwide.'],
  experience: [...],
  studies: [...],
  tantric: [...],
  narrative: [...]
}
```

Use the complete approved English text, with only spelling/punctuation/minimal grammar corrections. Add the complete faithful Russian translation in the matching `pages.ru.about.profile` object. Do not place health claims, credentials or outcomes anywhere except where the user supplied them in this biography.

- [ ] **Step 2: Add the dedicated About renderer**

```js
const authorProfile = () => `<section class="author-profile shell" id="explore">
  <article class="reading-column">${profileIntroduction()}${experience()}${studies()}${tantricNarrative()}</article>
</section>`;
```

Render paragraphs as `<p>`, Experience as one ordered reading list, Studies as four numbered entries, and later material as continuous prose. Replace the generic About sections with this renderer only when `key === 'about'`.

- [ ] **Step 3: Render shared public review media only after the profile**

```js
const profileReviews = () => `<section class="author-reviews shell" aria-labelledby="reviews-title">…</section>`;
```

Use the existing public homepage review-image URLs, neutral labels, and their original destinations. Place `profileReviews()` after `authorProfile()` and before `exploreMyWork()`; do not add claims or quote text.

- [ ] **Step 4: Implement the quiet final navigation**

```js
const exploreMyWork = () => `<nav class="author-explore" aria-label="Explore my work">
  <a href="${link('hypnotherapy')}">Individual Sessions</a>
  <a href="#contact">Workshops</a>
  <a href="${link('academy')}">Studies / Academy</a>
  ${cta()}
</nav>`;
```

The Russian version uses equivalent labels. “Workshops” routes to the existing contact action until a verified workshops route exists.

- [ ] **Step 5: Select the new portrait only on home and About**

```js
const portraitName = ['home', 'about'].includes(key) ? 'andy-library-desk.png' : 'andrey.jpg';
```

Preserve the header, navigation, footer, analytics behavior, canonical/hreflang construction and all non-home/About copy. Refresh only the home heading and lead in a restrained personal voice.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run: `node --test integrations/psitrends-client/build.test.mjs integrations/joomla-client/build.test.mjs`

Expected: all generator and package assertions pass.

### Task 4: Add the reading-first visual system and responsive behavior

**Files:**
- Modify: `psitrends-client.css`
- Modify: `integrations/psitrends-client/browser-qa.mjs`

- [ ] **Step 1: Add failing viewport assertions for the About reading layout**

```js
assert.equal(await page.locator('.author-profile').count(), 1);
assert.equal(await page.locator('.reading-column').evaluate(element => Math.round(element.getBoundingClientRect().width) <= 800), true);
assert.equal(await page.locator('.author-reviews').evaluate(element => element.getBoundingClientRect().top > document.querySelector('.author-profile').getBoundingClientRect().bottom), true);
```

- [ ] **Step 2: Run browser QA and verify RED**

Run: `node integrations/psitrends-client/browser-qa.mjs`

Expected: `FAIL` because the editorial selectors do not exist yet.

- [ ] **Step 3: Add restrained author-profile CSS**

```css
.reading-column { max-width: 48rem; margin-inline: auto; }
.author-profile p { margin-block: 0 1.5rem; font-size: clamp(1.05rem, 1.3vw, 1.2rem); line-height: 1.8; }
.author-profile .profile-introduction { font-size: clamp(1.25rem, 2vw, 1.55rem); }
```

Style the supplied image as a large editorial portrait with a visible desk/library context. Add responsive grid rules, no horizontal overflow, keyboard-visible links, `prefers-reduced-motion` protection, and no card-grid treatment for biography paragraphs.

- [ ] **Step 4: Run browser QA and inspect screenshots**

Run: `node integrations/psitrends-client/browser-qa.mjs && npm run page:audit -- psitrends-client-home.html && npm run page:audit -- psitrends-client-about.html && npm run page:audit -- psitrends-client-about-ru.html`

Expected: desktop/mobile checks pass, reports are saved, body text remains comfortable, and the image retains its environmental context.

### Task 5: Build, release, and prove the narrow Joomla update

**Files:**
- Modify: `integrations/psitrends-client/README.md`
- Create: `reports/psitrends-author-profile-verification.md`

- [ ] **Step 1: Build the preview and Joomla installer artifacts**

Run: `node scripts/build-psitrends-client.mjs && node scripts/build-joomla-client.mjs && node --test integrations/psitrends-client/build.test.mjs integrations/joomla-client/build.test.mjs`

Expected: twelve preview pages and the installer package are produced; only home/About article bodies and the added asset differ in the release inventory.

- [ ] **Step 2: Create a fresh verified private backup and transaction snapshots**

Use the existing `psitrends-production` alias and guarded private operations runner. Verify current backup freshness, hash and off-server retention; snapshot the exact home/About articles, their template styles, existing public review references, assets and menu assignments. Do not print or commit secrets, database output or backups.

- [ ] **Step 3: Rehearse native install/asset/article save/readback on the isolated clone**

Run the private runner’s preview/rehearsal/rollback/reapply sequence. Validate both home articles, both About articles, original home menu invariants, legacy routes, no duplicate analytics, shared chrome and the new asset URL before production.

- [ ] **Step 4: Apply the smallest production batch and verify public routes**

Apply only the reviewed asset/template refresh and the EN/RU Home/About article bodies through supported Joomla APIs/administrator operations. Verify `https://psitrends.com/`, `/ru/`, `/about`, `/ru/about`, CSS/image URLs, language switching, desktop/mobile layout, title/description/canonical/hreflang and contact links. Do not send contact messages.

- [ ] **Step 5: Record proof and commit**

```bash
git add integrations/psitrends-client integrations/joomla-client scripts/build-psitrends-client.mjs scripts/build-joomla-client.mjs psitrends-client.css docs/superpowers reports
git commit -m "feat(psitrends): publish author profile"
git push -u origin codex/psitrends-author-profile
```

Open and merge a PR into `codex/bootstrap-sales` only if all local, rehearsal and live acceptance checks pass. Record the exact release identifiers and rollback snapshot identifier privately; the public report contains only sanitized evidence.
