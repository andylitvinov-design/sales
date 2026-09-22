# Native Joomla client adapter

Local package preparation only. No installer, clone or production mutation is performed by the build. Uses the reviewed twelve-page generator in `integrations/psitrends-client`; leaves its files/output untouched.

```sh
node --test integrations/joomla-client/build.test.mjs
node scripts/build-joomla-client.mjs
```

Artifacts under ignored `integrations/joomla-client/generated/`:

- `psitrends_client.zip`: native site-template installer package; `template/` is equivalent install-from-folder source.
- `articles/*.html`: twelve editable article bodies with hashes in `migration-plan.json`.
- `migration-plan.json`: dry-run-only native article/style/menu field plan, with unresolved category/article/style IDs explicit.

## Architecture and ownership

Install a separate `psitrends_client` template; never replace `tx_valley`, Helix, Quix or Joomla core. Create twelve page-specific styles from the new template, each with its `page_key` and preview release mode. Assign each style to exactly its native menu item; never make this template globally default. Twelve styles avoid undocumented menu-param edits and expose the page selection through Joomla's supported style UI.

Native `com_content` stores the editable article body; template shell supplies header/footer, language links, metadata and assets. Article ACL is checked explicitly, and article alias must match the style page key. Native administrator editing is supported; frontend edit layouts deliberately fail closed because this minimal template does not include the editor's JavaScript dependencies. Use an editor/source mode and existing trusted-author permissions that preserve reviewed HTML, then verify a save/readback; do not globally weaken text filtering.

Source of truth is the generator's reviewed copy plus article body/hash plan. A native article edit must be exported/reconciled into that source before a rebuild: a template reinstall updates shell/meta/assets, but this builder never overwrites database article bodies. Title/description in the template manifest are build-owned; changing only the native article metadata will not update this template's head.

Asset destination is `/media/templates/site/psitrends_client/assets/`. Deployment assumes Joomla at the domain root, matching the existing site. Preview is the default style mode, noindex and analytics off. Production requires both the explicit style mode and HTTPS `psitrends.com`; reciprocal en-GB/ru-RU canonical metadata is then emitted. Do not change the existing locale convention during this rollout. Native RU→EN language switches deliberately use `/en/` or `/en/<slug>` so Joomla clears a remembered Russian choice, then redirects to the unchanged canonical English route. This affects only the language switch; static-generation links and canonical URLs remain unchanged.

Only the generator's consent adapter loads analytics. No Helix custom code, module positions or Joomla head-script queues are included. **Global system plugins can still inject into the response:** inspect them and exclude any duplicate GTM/GA4 injection from these assignments before production mode. Do not disable legacy measurement globally. Content-plugin wrappers are intentionally omitted; test that no required client-page feature depends on them. The full Joomla HTML response and network activity—not template source alone—must prove consent behavior.

## Private before-state and collision gates

Before any staged mutation, retain a protected full backup and exact private snapshots of menus 202, 204 and 101, including link/type, component ID, params, template style, language, menutype, parent/home/published/access and associations; relevant template styles; any matching aliases/routes; and the original Quix home records. Record newly allocated article/style/menu IDs in a private transaction ledger. Preserve all-language home 101 byte-for-byte. Never copy SQL/user/session records into this package.

Resolve all twelve intended public routes against current menus/content before adding entries. A collision is a decision gate: no overwrite, deletion, redirect or alias reuse is implied. Preserve all legacy URLs. Reuse EN home menu 202 and RU home 204 only after verifying those are still the language-home assignments; retain their IDs, alias, language, menutype, parent and home flag. Only their component target and page style change. Original homepage Quix records remain intact.

## Supported staged operations

1. Joomla administrator **System → Install → Extensions → Upload Package File**: install `psitrends_client.zip`, or use Install from Folder with the unpacked `template/`. Installation must remain staging-only initially. Do not make the installed style the default.
2. **Content → Articles → New**: for each plan entry create an unpublished native article in a reviewed public native category. Set exact title, alias, language, access Public, metadata description and full source HTML from `article.bodyFile` as introtext (no read-more split). Record allocated ID. Do not reuse a legacy article or Quix record.
3. **System → Site Template Styles**: duplicate the new template style for every plan entry; set Page content key and `release_mode=preview`, with no global default. Record each style ID. Do not change existing tx_valley styles 17/21.
4. **Menus**: create the ten non-home Single Article items only after route collision checks, in the corresponding home language's existing menutype, root parent, language and alias specified by the plan, selecting the new article/style. On the isolated clone, update existing home items 202/204 to Single Article and their corresponding new article/style. Keep all-language home101 untouched. Pair true EN/RU equivalents using Joomla's Associations tab without changing legacy associations.
5. Publish only these articles/menu items on the isolated clone for guest route QA. Confirm actual route paths equal the plan, including language-home selection. Joomla must route them normally; no nginx interception, blanket rewrite or `.htaccess` replacement belongs to this adapter.

If the parent implements an authenticated Joomla API/model runner, the equivalent supported entry points are `Joomla\CMS\Installer\Installer::getInstance()->install($unpackedTemplatePath)` and `$app->bootComponent('com_content')->getMVCFactory()->createModel('Article', 'Administrator', ['ignore_request' => true])->save($articleData)`. Menus use the `com_menus` Administrator `Item` model's `save($menuData)`; styles use `com_templates` Administrator `Style` model's `save($styleData)`. Bootstrap the correct administrator application/authorized identity first, inspect each result/error, retain original values and verify IDs. These calls are implementation guidance, not a tested CLI migration or promise that wrapping them in a database transaction atomically rolls back filesystem/plugin side effects. The package builder provides no direct-SQL or automatic apply mode. A separate private operations runner implements guarded native-model execution; its clone rehearsal and release-candidate gates are recorded in that repository.

## Acceptance and rollback

Parent must perform PHP lint with the actual Joomla/PHP runtime, installer/style/article save-readback, all twelve native routes, menu101 invariance, retained Quix records and sampled legacy routes. Verify desktop/mobile, native guest ACL, one H1, exact assets/nav/language switching, noindex in preview, production canonical/hreflang, actual consent/network behavior, contact intent without sending messages and existing GBP attribution. Test saved article editing and the original home restoration on staging.

Rollback each home by restoring its exact private menu/style before-state through supported Joomla operations, preserving original Quix records. Unpublish only the new non-home menus/articles and restore any new associations; uninstall the client template only after nothing references its styles. No legacy content deletion, automatic migration, production acceptance or Joomla upgrade is claimed.

References: [Joomla template manifest](https://manual.joomla.org/docs/next/building-extensions/templates/template-details-file/), [template overrides](https://guide.joomla.org/user-manual/templates/templates-template-overrides), [Joomla 4.4 article access gate](https://github.com/joomla/joomla-cms/blob/4.4.0/components/com_content/tmpl/article/default.php).

## Legacy query routing acceptance

When a bare legacy article query inherits the new language-home style, the client override sends a local302 to the same query with existing all-language `Itemid=101`. It retains article ID and attribution, strips template override parameters to prevent loops, and lets Joomla apply the legacy template and normal ACL. Non-GET/HEAD mismatches remain404; no arbitrary external redirect is accepted. This also covers unrelated component requests reaching the new shell. The original article URL continues to resolve; it is not deleted or rewritten in the database.

On the isolated clone, all seven bare article queries38–44 returned302→200 with legacy rendering after the separately reviewed background-data repair. Template-only native Installer refresh preserved exact menu/content/Quix snapshots. Twelve new native pages remain preview assignments. `fallback.test.php` checks query retention, all seven IDs, local destination and removal of template overrides.
