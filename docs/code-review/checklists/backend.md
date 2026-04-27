# Backend Checklist

A non-exhaustive list of things to watch out for when reviewing.

## Database Schema Changes

- [ ] Column renames, drops, and table removals follow the [multi-release process](../../operations/migrations.md)
- [ ] No migration drops a column or table that is still referenced in code
- [ ] Data migrations handle both forward and reverse (or explicitly use `RunPython.noop` with a comment explaining why)
- [ ] StreamField data migrations also update Revision objects, not just live pages

## Caching

- [ ] `SimpleDictCache` stores object references, not copies - mutating an object retrieved from this cache also mutates the cached value. Confirm this is not a risk, or that the risk is handled.

## Code Style

- [ ] Inline imports include a comment explaining which circular import they avoid

## Feature Switches

- [ ] New waffle switches exist in the database - undefined switches default to ON in dev but OFF in production.

## Middleware

- [ ] New middleware is placed at the correct position in `MIDDLEWARE` - the list is order-sensitive, some entries are conditionally inserted at a specific index (not appended), and `WAGTAIL_ENABLE_ADMIN` inserts auth/session middleware at position 3
- [ ] Middleware that should only be active under certain conditions uses the `MiddlewareNotUsed` pattern in `__init__` to self-disable, rather than conditional logic in `__call__`

## Migrations

- [ ] Ensure that `RunPython` data migrations use `apps.get_model()` rather than importing the model class directly - direct imports reflect the current model definition, not the historical state at the point the migration runs, which can cause failures after subsequent model changes

- [ ] StreamField block restructures use Wagtail's `MigrateStreamData` utility and `BaseBlockOperation` subclasses rather than hand-rolling JSON manipulation - the built-in utilities handle nested structures and edge cases correctly

## Performance and Queries

- [ ] New views and querysets are checked for N+1 queries - Wagtail page trees, StreamField content, and snippet references are common sources

## Settings and Environment

- [ ] `DEV=True` is not the same as `DEBUG=True` - `DEV` refers to a mode of operation of the websites, usually governing what cut of data gets pulled in to be shown. `DEV=True` setting covers Dev and Demos. Test, Staging and Prod run `DEV=False`. In rare cases, gate production-only behaviour by using `PROD=True`
- [ ] Remember that the Web deployment only has readonly access to the DB. The CMS deployment has read-write access.
- [ ] `request.session` is not available by default - session middleware is only added when `WAGTAIL_ENABLE_ADMIN=True`

## URLs and Views

- [ ] Views being migrated to the CMS use `prefer_cms` on a `TemplateView`, not on a `page()` helper (which is unsupported by `prefer_cms`)
- [ ] Views being migrated to the CMS may need to be added to `cms_only_urls.py` in order to avoid breaking pages that look them up via `reverse()` or `url()`
- [ ] New non-locale URL path prefixes are added to `SUPPORTED_NONLOCALES` in settings - omitting them causes the path to be inadvertently locale-prefixed and then 404 in production

## Wagtail CMS

- [ ] New page models are added to `CMS_ALLOWED_PAGE_MODELS` in settings - dev uses `["__all__"]` so omissions are invisible locally but will break in production
- [ ] New page models are added to `./bin/export-db-to-sqlite.sh` - failing to do so will create an incomplete export of Page models but no corresponding custom page class
- [ ] `ftl_files` attribute is set on new page models - missing references don't error, strings just appear untranslated
- [ ] `on_delete` is intentional on ForeignKeys - `PROTECT` for things that must not be deletable while in use, `SET_NULL` for optional references
- [ ] ForeignKeys to images and snippets set `related_name="+"` where the reverse relation isn't needed - without it, Django auto-generates a reverse accessor that clutters the ORM and can shadow other relations
- [ ] Image renditions used in templates are within the pre-generated size range - production has read-only storage and cannot generate renditions on the fly
- [ ] All StreamFields have `use_json_field=True` - required since Wagtail v5, omitting it will cause errors on future upgrades
- [ ] Leaf page models must set `subpage_types = []`; models with page-type heirarchy constraints should just set `parent_page_types`
- [ ] Singleton page models have `max_count = 1` to prevent duplicate creation in the CMS
- [ ] New page models set an explicit `template` attribute - without one, Wagtail auto-generates a path that may not match the project's template directory layout

## Wagtail Localize

- [ ] New snippet models intended for translation include `TranslatableMixin` (and `DraftStateMixin`/`RevisionMixin` if they need draft support) - omitting these means the content can't be translated via Wagtail Localize
- [ ] Snippet querysets used in front-end views call `.live()` - without it, draft content can be surfaced to users
- [ ] Translatable page and snippet models mark `slug` (and any other fields that must stay in sync across locales) as `SynchronizedField` - without this, slugs get sent for translation and break URL routing


## Wagtail Internals

- [ ] Any PR that bumps the Wagtail version must check over the monkey-patches in `cms/apps.py` `ready()` - these patch Wagtail internals that could be moved, renamed, or fixed upstream without warning
- [ ] New CMS admin URL paths (e.g. `_documents`; paths to JS endpoints) are added to `SUPPORTED_NONLOCALES` conditionally alongside the existing `WAGTAIL_ENABLE_ADMIN` block - this is to avoid admin paths becoming incorrectly and inviably prefixed


