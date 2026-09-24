# PsiTrends client layer specification

Prepared 2026-09-22 from local Issue #6 contract/comments, current main docs, sanitized CMS/URL inventory, and the two existing Toronto source pages. The twelve-page source implementation now exists under `integrations/psitrends-client`, with a native Joomla template adapter under `integrations/joomla-client`. All twelve static preview audits and 36 viewport checks pass. Native routing, supported saves and production release have separate acceptance gates. The route plan preserves existing content.

## Decision and remaining gap

Use **PsiTrends** as the umbrella/domain; **Holistic House · Andrey Litvinov** as the client-practice identity; **PsiTrends Academy** as the knowledge gateway; Toronto Tantra remains a separate community/events funnel with contextual connections. This is the specific recommendation already selected in merged content-map, not a new branding exercise. Do not alter GBP name/category/address or external social identities as a side effect of building pages.

PR #8 delivered inventory, audit, conservative per-URL proposals, brand/IA recommendation and useful starter copy. It did not deliver the six-page first-party client layer, its Joomla route assignments, Russian client journey, verified proof, final executed URL migration, or publication QA. The masterplan's earlier architecture-approval checkpoint is satisfied for autonomous implementation by the later owner instruction to use the masterplan as default and proceed through staging/QA; routine owner reconfirmation is unnecessary.

Build Home, Hypnotherapy, Systemic/Family Constellations, About Andrey, Contact, and Academy gateway on isolated staging. Keep Business/Decision work as a section within Constellations. There is historical content but no supplied evidence establishing sufficient demand and current service fit for an additional acquisition page. Do not create `/business-constellations-toronto`, `/individual-sessions`, `/deep-change`, `/reviews`, packages, or a scheduler merely to fill the masterplan's optional examples.

## Common shell and EN/RU navigation

Header: PsiTrends logo/home link; secondary identity “Holistic House · Andrey Litvinov”; six navigation items Home, Hypnotherapy, Constellations, About Andrey, Academy, Contact. Highlight Contact as the sole primary navigation action if a separate CTA would duplicate it. Logo goes to locale home, not the hypnotherapy page as in the current interim source. Footer explains the practice/Academy relationship, links verified privacy/consent information, contact, and Academy.

EN routes: `/`, `/hypnotherapy-toronto`, `/systemic-constellations-toronto`, `/about`, `/academy`, `/contact`.

RU planned counterparts, after collision checks: `/ru/`, `/ru/hypnotherapy-toronto`, `/ru/systemic-constellations-toronto`, `/ru/about`, `/ru/academy`, `/ru/contact`. Labels: Главная; Индивидуальная работа; Расстановки; Об Андрее; Академия; Контакты. These slugs are explicit implementation choices for a deliberate equivalent journey, not claims that routes currently exist. Translate current bounded service content accurately; do not translate all legacy material or create false service availability. RU H1s: “Индивидуальная работа и системные расстановки”; “Гипноз и индивидуальная работа”; “Системные и семейные расстановки”; “Об Андрее Литвинове”; “Связаться с Андреем”; “Академия PsiTrends”. Mention Toronto/online as formats to discuss, without inventing a physical office or schedule.

Language switch links only to a published equivalent. Until an equivalent passes QA, use an explicitly labelled language-home link rather than false page equivalence. Add reciprocal en-GB/ru-RU hreflang only for actual equivalents. Root default remains English; verify Joomla all-language home and language-filter behavior before choosing x-default. Never globally redirect the Russian library to English client pages.

Every core client page links to Contact and at least one genuinely related page. Home exposes all six destinations within one click. Academy is the route into deep content; retain existing library URLs and existing contextual links until verified replacements exist. Use breadcrumbs only when they reflect the actual content hierarchy.

## Page specifications

### Home — update existing homepage in place

H1: “Hypnotherapy and Systemic Constellations in Toronto”. Title: “Hypnotherapy & Constellations Toronto | Holistic House”. Description: “Explore individual hypnotherapy and systemic constellation sessions with Andrey Litvinov. Ask about fit, availability and meeting in Toronto or online.”

Hero supporting copy: “Explore repeating patterns, inner conflicts and important decisions with Andrey Litvinov. Individual sessions combine conversation and experiential work, with methods chosen together for your situation.” Identity line: “Holistic House · Andrey Litvinov”. CTA “Ask about a session” uses the current verified WhatsApp destination; secondary in-page anchor “How sessions work”.

Section order: (1) hero; (2) concrete situations—hesitation about goals, recurring relationship/decision patterns, conflicting priorities; (3) four-step method; (4) two primary service cards and optional Business/Decision section link; (5) expectations and voluntary participation; (6) genuine proof only when independently verified and consented; (7) short About teaser; (8) Academy gateway; (9) final enquiry CTA. A missing proof block does not block the rest of the page and must never be filled with fabricated placeholders or ratings.

Four-step wording: Map your question (goals, context, boundaries); Explore the pattern (needs, roles, perspectives); Choose the experiential work (hypnosis, parts work, imagery or mapping when relevant); Integrate (reflect and choose a practical next step). Optional symbolic mandala/artifact work is an agreed supporting option, not a promised result or compulsory step.

### Hypnotherapy — adapt existing source, not a competing rewrite

Source: `hypnotherapy-toronto.html`, its reviewed copy/assets and consent tests. H1 “Hypnotherapy in Toronto”. Title “Hypnotherapy Toronto | Andrey Litvinov · Holistic House”. Description “Explore individual hypnotherapy sessions in Toronto or online. Learn how sessions work and ask Andrey Litvinov about suitability, availability and fees.”

Keep current non-clinical client language and factual portrait. Explain guided attention/imagery, how systemic mapping/parts work may be used, who it may fit, what happens in a session, voluntary participation and limits, practical enquiry, FAQ and final CTA. Link to Constellations for relationship/business dynamics and About for background. Do not invent a session length, fee, number of sessions, booking availability, treatment entitlement, or outcome claim. Existing reviewed passages are the baseline; retain distinctive methodology without adding clinical claims.

### Constellations — adapt existing source

Source: `systemic-constellations-toronto.html`. H1 “Systemic & family constellations in Toronto”. Title “Systemic & Family Constellations Toronto | Holistic House”. Description “Explore relationship patterns, roles and important decisions with Andrey Litvinov. Ask about an individual constellation session in Toronto or online.”

Retain explanation using positions, objects or representations; focus on the client's perceptions; observations are not proof about absent people or family history. Sections: individual systemic mapping; family/relationship themes; business/decision application; session sequence; boundaries; practical FAQ/contact. Keep group format out of offer claims unless actually verified. Business section: “Explore roles, competing priorities and possible perspectives around a decision. Use the session as reflection alongside your practical research and professional advice.” No guaranteed business growth, financial/legal advice or fabricated commercial cases.

### About — practitioner identity, separate from historical Academy About

H1 “About Andrey Litvinov”. Title “About Andrey Litvinov | Holistic House · PsiTrends”. Description “Meet Andrey Litvinov and explore his approach to individual sessions, systemic mapping and the PsiTrends knowledge library.”

Sections: current identity and method; what sessions involve; clearly separated documented education/training; scope and participation; practice/Academy relationship; contact. Reuse public portrait only after asset provenance and alt text inspection. State only verified qualifications with actual names/dates; omit unverifiable regulated titles and Canadian equivalence. “Andrey Litvinov” is sufficient public identification while specific credential facts remain unknown. Do not transfer legacy Academy institutional claims to personal practice.

### Contact — enquiry-first, practical and minimal

H1 “Ask about a session”. Title “Contact Andrey Litvinov | Holistic House · PsiTrends”. Description “Ask about an individual session with Andrey Litvinov, meeting format, availability and fees. Contact via WhatsApp or Telegram.”

Copy: “Tell us the type of session you are considering, whether you prefer Toronto or online, and a good way to reply. Please avoid sending sensitive health details in your first message.” Primary WhatsApp and fallback Telegram reuse existing source destinations; current source also exposes a telephone link, which can remain in secondary practical details if verified. Do not send test messages. Do not add a clinical intake form. Say “Confirm fit, availability and fees before booking”; omit unverified response hours, addresses, CAD prices, cancellation policy and duration rather than blocking the build. Booking software remains out of scope.

### Academy — gateway preserving the archive

H1 “PsiTrends Academy”. Title “PsiTrends Academy | Methods, Books & Learning Library”. Description “Explore the PsiTrends library of systemic work, archetypes, traditions, symbolic methods, books, videos and historical programs.”

Explain that this is a learning library and distinguish archived material from current session offers. Group existing verified links into Archetypes; Constellations; Reiki/energy traditions; Mysteries/traditions; Mandalas/artifacts; Books; Videos/meditations; Historical programs. Do not generate unsupported summaries, new courses or blank category pages. Where a destination needs claim review, retain its known status in the internal map; do not promote it as an active health service. Use one contextual current-service link where relevant. Historical Academy About URLs remain accessible and labelled by their actual institutional/history context.

## URL map and collision requirements

Machine-readable map must retain one row per meaningful legacy route, including meaningful Joomla routing queries if present. Required fields: source URL; locale; status/final; CMS menu/component/content IDs; content state; current CTA; inlinks; GSC/GA4/backlink evidence (null when unavailable); action enum; target URL; target locale; justification; evidence; operational owner; decision status; release batch; before/after checks; rollback pointer. Allowed action values: KEEP, UPDATE, MERGE, 301, ARCHIVE_INDEXED, NOINDEX, DELETE_AFTER_VERIFICATION. Unknown metrics never become zero and never justify deletion.

Specific map decisions now:

| Source | Action for client-layer batch | Target / rationale |
|---|---|---|
| `/` | UPDATE | Same URL; EN home menu202→Quix4 in saved inventory |
| `/ru/` | UPDATE | Same URL; RU home menu204→Quix141 |
| Cloudflare `/hypnotherapy-toronto` | KEEP during staging; 301 only after first-party target verified | `https://psitrends.com/hypnotherapy-toronto` |
| Cloudflare `/systemic-constellations-toronto` | KEEP during staging; then controlled301 | `https://psitrends.com/systemic-constellations-toronto` |
| `/therapy/image-psychotherapy` | UPDATE/KEEP in this batch | Candidate later MERGE into hypnotherapy only after scope/content/authority review |
| `/express` and `/ru/express-ru` | UPDATE if high-confidence stale CTA cleanup is needed | Preserve URLs; no automatic Contact merge |
| `/express-ru` | Preserve existing documented301 | `/ru/express-ru`; verify current rule before touching |
| `/studies/about-us` | KEEP/UPDATE | Historical Academy identity; do not overwrite with practitioner About |
| `/ru/cat-train-ru/about-us-ru` | KEEP/UPDATE | Same distinction in Russian |
| `/contact-us` | KEEP status pending exact historical-equivalent review | Saved404; trash menu143 points to Quix4, so restoring it could expose the homepage incorrectly |
| All other inventoried legacy routes | KEEP/UPDATE pending individual review | No broad rename, deletion, homepage redirect or noindex sweep |

Before creating any new EN or RU route, check the exact alias, parent path, language, client_id=0, published/unpublished/trashed menu records, menu aliases, Joomla articles/categories, Quix pages, language associations, redirect component and server rewrite rules. Specifically test `/hypnotherapy-toronto`, `/systemic-constellations-toronto`, `/about`, `/contact`, `/academy` and each `/ru/` counterpart; also trailing-slash, `/index.php/...`, menu Itemid/component query forms, existing canonical behavior and any case-sensitive alias conflict. Saved inventory has no exact target alias among the inspected matching records, which is not live proof of availability. Do not reuse IDs solely because a title sounds suitable. Preserve all-language home101→Quix2 until routing/template dependencies are understood.

Creating client layer needs a complete preserved-URL map, not final destructive decisions on every legacy page. For any unresolved route, KEEP with review-needed is a complete conservative batch decision. Operational implementation owner is Codex/site steward; only exact unresolvable legal/credential facts or genuinely owner-only factors return to the owner.

## Implementation and release acceptance

1. Snapshot relevant DB/menu/content/module/style records and files privately. Record exact safe rollback IDs. Do not combine client content release with platform upgrade.
2. Implement on protected staging using the supported editor/content path established by the operations work. No analytics/email/message delivery from staging. Use shared client shell and assets; avoid importing a second standalone GA4 bundle into an already instrumented Joomla template.
3. Adapt canonical, OG URL, schema URL and internal links from Cloudflare to final first-party routes. Use visible-fact Person/Service schema only; no fabricated credentials, clinic address, ratings, opening hours or price. Staging stays noindex; production artifact/config must remove the staging restriction deliberately.
4. Validate desktop/mobile, keyboard navigation, heading hierarchy, image alt, overflow, primary CTA readability, links, non-submitting contact checks, accurate EN/RU equivalents, exact route collisions, metadata/canonicals, sitemap inclusion of canonical200 pages, existing legacy route regression, absence of unsupported title/claim regressions, and consent behavior before collection.
5. Implement one clean GTM/GA4 model. Preserve `contact_click`, `service`, `landing_page`, `contact_method`, `acquisition_source` and allowlisted GBP attribution; validate definitions against current analytics runbook. Never infer enquiries/bookings/revenue from clicks.
6. Once first-party pages pass production readback, migrate the two exact interim service URLs using server301 redirects preserving approved attribution. Verify both legacy `.html` variants and root behavior separately; do not blanket-redirect all Cloudflare pages. Update Joomla module129 navigation and attribution code to first-party URLs. Inspect canonical/redirect loops, then Search Console submission/inspection. GBP destination may be evaluated separately after funnel validation; category stays unchanged.
7. Record release/rollback evidence and observed indexing state. Google processing delay does not undo a successful technical release, but cannot be called verified indexation. Keep Issue #6 open for remaining modernization/Academy/measurement obligations.

Proof and pricing are factual content gates, not reasons to hold the entire safe six-page implementation. A publishable first version can use accurate method explanation, portrait, voluntary participation, enquiry-first practical copy and genuine contact channels without unsupported testimonials, fees or titles.
