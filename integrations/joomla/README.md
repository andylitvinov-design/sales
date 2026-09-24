# PsiTrends production navigation (sales issue #4)

Production is Joomla 4.4.0 at `https://psitrends.com`, not the Cloudflare snapshot. Authorized administrator access was recovered from existing private project context and verified on 2026-09-22. DNS resolves to a Hetzner origin; the authenticated Joomla directory screen reports `/var/www/html`, nginx/PHP and database-managed content. No deployable Git source was established. Do not deploy this sales repository to that origin.

Live change: custom HTML module **129**, “Toronto sessions – English navigation”, position `content-top`, public, published. `toronto-navigation.html` records its original interim content. The template's supported Custom Javascript field contains `toronto-attribution.js` in styles **17** (English Home 2) and **21** (Russian Home 2). Original fields were empty and backed up privately. Joomla's editor strips inline scripts from modules, so the helper belongs in these template fields.

`toronto-navigation-first-party.html` is the migration candidate, changing only the two destination hosts to PsiTrends. Apply through the supported module editor after both first-party pages pass live acceptance; preserve the private complete before-record. Existing attribution code already works on either host and continues copying only the three approved GBP values. The candidate's existence is not evidence of production deployment.

Rollback: unpublish module 129, then restore the original empty Custom Javascript fields in template styles 17 and 21. No template files, hosting configuration, existing menu items, GBP categories or Joomla extensions were changed. These files are operational source records, not an automatic Joomla deployment.

The helper copies only the exact approved Google/organic/gbp campaign to the two external landing links. Unknown query parameters are never forwarded. English/root and Russian home routes were verified. Other template styles were not modified.
