# Localization

!!! note
    For localization of CMS-based content, see the [CMS Localization docs](../cms/l10n.md).

We use [Project Fluent](https://projectfluent.org/) to localize content that is not in the CMS.

## Documentation

- **[Fluent Basics](fluent.md)** - Writing .ftl files, string IDs, template helpers
- **[Fluent Configuration](configuration.md)** - Specifying files, pipeline setup, activation rules
- **[CSS & Fonts](css.md)** - Locale-specific styles and custom fonts

## Quick Reference

**Use a string id in a template**

``` jinja
{{ ftl('string-id') }}
```

**Check if strings ids are translated**

``` jinja
{% if ftl_has_messages('new-title-id', 'new-description-id') %}
```

``` python
if has_messages("new-title-id", "new-description-id", ftl_files="mozorg/about"):
```

**Pass a fallback string id** 

``` jinja
{{ ftl("primary-string-id", fallback="fallback-string-id") }}
```

**Reference a variable**
 
``` fluent
# Variables:
#   $attrs (string) link to https://example.com
example-read-more = Read more about the <a { $attrs }>example</a>.
```

``` jinja
{% set attrs='href="https://example.com" rel="external noopener"' %}
<p>{{ ftl('example-read-more', attrs=attrs)}}</p>
```

**Mark a string id obsolete**

``` jinja
# Obsolete string (expires: 2020-02-01)
example-old-string = Expires 2 months from now.
```
