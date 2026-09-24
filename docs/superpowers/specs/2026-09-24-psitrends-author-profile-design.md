# PsiTrends author-profile redesign

**Status:** approved concept; awaiting review of this specification before implementation.

## Purpose

Turn the English and Russian About experience into a warm, long-form author profile. The page must support Andy's story; it must not recast it as a SaaS landing page, a set of marketing cards, or abbreviated generic copy.

## Scope

- Preserve the shared PsiTrends header, navigation, and footer.
- Refresh the main page softly in Andy's voice, retaining its existing information architecture rather than replacing it with aggressive sales copy.
- Use the newly supplied personal library/desk photograph as the primary visual on the main page and on the About page. It must remain a large, uncropped environmental portrait, not a small headshot.
- Rebuild `/about` as a bilingual editorial profile:
  - English contains the supplied biography in full, retaining its names, chronology, repetitions, schools, and personal wording. Only clear spelling, punctuation, and minimal grammar corrections are permitted.
  - Russian contains a complete, faithful, natural translation of the same biography; it must not be shorter than the English source.
  - The English and Russian versions receive the same information and reading experience.
- Add the existing home-page testimonials below the complete About biography. Testimonials may not interrupt the biography.
- End About with restrained links to Individual Sessions, Workshops, Studies / Academy, and a contact action.

## Selected direction: Editorial profile

**Visual thesis:** A contemporary European study: walnut, warm paper, restrained ink tones, and a personal photograph that makes the reading experience feel situated and human.

**Content plan:**

1. **Hero:** new environmental portrait, “Let me introduce myself,” name/role, and opening two biography lines. No promotional promise or competing CTA.
2. **Long-form biography:** a 650–800px reading measure with generous paragraph rhythm. The only visual pauses are `Experience`, `Specializations / studies`, and `Tantric workshops`, matching the supplied source.
3. **Personal narrative:** later material on psychotherapy, Guided Affective Imagery, body psychotherapy, Bodynamic, Temple Studies, and Reiki runs as continuous prose, not as cards or accordions.
4. **Testimonials:** the home-page testimonial treatment, placed only after the full narrative.
5. **Explore my work:** four quiet links/actions: Individual Sessions, Workshops, Studies / Academy, and Contact.

**Interaction thesis:**

- A restrained hero entrance that respects `prefers-reduced-motion`.
- A subtle image/parallax or crop-depth treatment only if it stays smooth and does not obscure copy.
- Understated link/image hover feedback; no decorative animation or carousel.

## Typography and layout

- Use at most two compatible typefaces: an elegant editorial display face for major headings and a highly legible text face for body copy.
- Give the opening paragraph a slightly larger size; body copy stays comfortable for sustained reading.
- Avoid repeated bordered cards, icon grids, strong overlays, gradients, or many CTAs.
- Preserve good contrast, keyboard navigation, visible focus, semantic landmark structure, and a skip link.
- Desktop: photo occupies roughly 40–50% of the hero composition; reading column stays readable and calm.
- Mobile: photo remains prominent before the narrative, CTA targets remain tappable, and no horizontal overflow is permitted.

## Copy boundaries

- Do not invent biography, credentials, outcomes, medical claims, or promotional promises.
- Do not shorten, summarize, hide, or rearrange the supplied biography so that chronology or meaning changes.
- A home-page soft copy refresh must retain Andy's personal voice and verifiable claims.
- Do not add in-biography calls to action.

## Acceptance criteria

- A line-by-line source checklist confirms that every supplied English paragraph and idea appears in `/about`.
- Russian contains the complete faithful version, not a summary.
- The new supplied photograph appears prominently on the main page and About page; its library/desk setting is visible.
- Shared chrome remains unchanged.
- About testimonials match the home-page source and follow—not split—the biography.
- Local desktop and mobile review confirms hierarchy, readability, CTA behavior, no horizontal overflow, and accessible contrast/focus.
- Before any Production update: establish a fresh verified Joomla backup/rollback path, keep technical/template changes distinct from content changes, and verify public EN/RU pages, links, metadata, and mobile rendering after release.

## Explicitly out of scope

- Changing shared navigation/header/footer.
- CMS or extension upgrades, server configuration, analytics/billing changes, and unrelated content rewrites.
- Replacing real photography with generated imagery.
