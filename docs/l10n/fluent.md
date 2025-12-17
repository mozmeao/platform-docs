# Fluent Basics

Localization files are not shipped with the code distribution, but are available in separate GitHub repositories. The proper repos can be cloned and kept up-to-date using the `l10n_update` management command:

``` console
./manage.py l10n_update
```

If you don't already have a `data/www-l10n` directory, this command will clone the git repo containing the .ftl translation files (either the dev or prod files depending on your `DEV` setting). If the folder is already present, it will update the repository to the latest version.

## About Fluent

Bedrock and Springfield's Localization (l10n) system is based on [Project Fluent](https://projectfluent.org/). This is a departure from a standard Django project that relies on a gettext work flow of string extraction from template and code files, in that it relies on developers directly editing the default language (English in our case) Fluent files and using the string IDs created there in their templates and views.

The default files for the Fluent system live in the `l10n` directory in the root of the bedrock project. This directory houses directories for each locale the developers directly implement (mostly simplified English "en", and "en-US"). The simplified English files are the default fallback for every string ID on the site and should be strings that are plain and easy to understand English, as free from colloquialisms as possible. The translators are able to easily understand the meaning of the string, and can then add their own local flair to the ideas.

## .ftl files

When adding translatable strings to the site you start by putting them all into an .ftl file in the `l10n/en/` directory with a path that matches or is somehow meaningful for the expected location of the template or view in which they'll be used. For example, strings for the `mozorg/mission.html` template would go into the `l10n/en/mozorg/mission.ftl` file. Locales are activated for a particular .ftl *file*, not template or URL, so you should use a unique file for most URLs, unless they're meant to be translated and activated for new locales simultaneously.

You can have shared .ftl files that you can load into any template render, but only the first .ftl file in the list of the ones for a page render will determine whether the page is active for a locale.

Activation of a locale happens automatically once certain rules are met. A developer can mark some string IDs as being "Required", which means that the file won't be activated for a locale until that locale has translated all of those required strings. The other rule is a percentage completion rule: a certain percentage (configurable) of the strings IDs in the "en" file must be translated in the file for a locale before it will be marked as active. We'll get into how exactly this works in the [configuration docs](configuration.md).

### Translating with .ftl files

The [Fluent file syntax](https://projectfluent.org/fluent/guide/) is well documented on the Fluent Project's site. We use "double hash" or "group" comments to indicate strings required for activation. A group comment only ends when another group comment starts however, so you should either group your required strings at the bottom of a file, or also have a "not required" group comment. Here's an example:

Any group comment (a comment that starts with "##") that starts with "Required" (case does not matter) will start a required strings block, and any other group comment will end it.

``` fluent
### File for example.html

## Required
example-page-title = The Page Title
# this is a note the applies only to example-page-desc
example-page-desc = This page is a test.

##
example-footer = This string isn't as important
```

Once you have your strings in your .ftl file you can place them in your template. We'll use the above .ftl file for a simple Jinja template example:

``` jinja
<!doctype html>
<html>
<head>
    <title>{{ ftl('example-page-title') }}</title>
</head>
<body>
    <h1>{{ ftl('example-page-title') }}</h1>
    <p>{{ ftl('example-page-desc') }}</p>
    <footer>
        <p>{{ ftl('example-footer') }}</p>
    </footer>
</body>
</html>
```

### FTL String IDs

Our convention for string ID creation is the following:

1. String IDs should be all lower-case alphanumeric characters.
2. Words should be separated with hyphens.
3. IDs should be prefixed with the name of the template file (e.g. `firefox-new-*` for `firefox-new.html`)
4. If you need to create a new string for the same place on a page and to transition to it as it is translated, you can add a version suffix to the string ID: e.g. `firefox-new-page-title-v2`.
5. The ID should be as descriptive as possible to make sense to the developer, but could be anything as long as it adheres to the rules above.

### Using brand names

Common Mozilla brand names are stored in a global brands.ftl (/l10n/en/brands.ftl) file, in the form of [terms](https://projectfluent.org/fluent/guide/terms.html). Terms are useful for keeping brand names separated from the rest of the translations, so that they can be managed in a consistent way across all translated files, and also updated easily in a global context. In general the brand names in this file remain in English and should not be translated, however locales still have the choice and control to make adjustments should it suit their particular language.

Only our own brands should be managed this way, brands from other companies should not. If you are concerned that the brand is a common word and may be translated, leave a comment for the translators.

!!! note
    We are trying to phase out use of `{ -brand-name-firefox-browser }` please use `{ -brand-name-firefox } browser`.

``` fluent
-brand-name = Firefox

example-about = About { -brand-name }.
example-update-successful = { -brand-name } has been updated.
# "Safari" here refers to the competing web browser
example-compare = How does { -brand-name } compare to Safari?
```

!!! important
    When adding a new term to `brands.ftl`, the new term should also be manually added to the [mozilla-l10n/www-l10n](https://github.com/mozilla-l10n/www-l10n) repo for _all locales_. The reason for this is that if a term does not exist for a particular locale, then it does not fall back to English like a regular string does. Instead, the term variable name is displayed on the page.

### Variables

Single hash comments are applied only to the string immediately following them. They should be used to provide additional context for the translators including:

1. What the values of variables are.
2. Context about where string appears on the page if it is not visible or references other elements on the page.
3. Explanations of English idioms and jargon that may be confusing to non-native speakers.

``` fluent
# Variables:
#   $savings (string) - the percentage saved from the regular price, not including the % Examples: 50, 70
example-bundle-savings = Buy now for { $savings }% off.

# Context: Used as an accessible text alternative for an image
example-bookmark-manager-alt = The bookmark manager window in { -brand-name-firefox }.
# Context: This lists the various websites and magazines who have mentioned Firefox Relay.
# Example: "As seen in: FORBES magazine and LifeHacker"
example-social-proof = As seen in:

example-privacy-on-every = Want privacy on every device?
# "You got it" here is a casual answer to the previous question, "Want privacy on every device?"
example-you-got-it = You got it. Get { -brand-name-firefox } for mobile.
```

#### HTML with attributes

When passing HTML tags with attributes into strings for translation, remove as much room for error as possible by putting all the attributes and their values in a single variable. (This is most common with links and their href attributes but we do occasionally pass classes with other tags.)

``` fluent
# Variables:
#   $attrs (attrs) - link to https://www.mozilla.org/about/
example-created = { -brand-name-firefox } was created by <a {$attrs}>{ -brand-name-mozilla }</a>.

# Variables:
#   $class (string) - CSS class used to replace brand name with wordmark logo
example-firefox-relay = Add <span { $class }">{ -brand-name-firefox-relay }</span>
```

``` jinja
{% set created_attrs = 'href="%s" data-cta-text="created by Mozilla"'|safe|format(url('mozorg.about.index')) %}
<p>{{ ftl('example-created', attrs=created_attrs) }}</p>

{{ ftl('example-firefox-relay', class_name='class="mzp-c-wordmark mzp-t-wordmark-md mzp-t-product-relay"') }}
```

### Obsolete strings

When new strings are added to a page sometimes they update or replace old strings. Obsolete strings & IDs should be removed from ftl files immediately if they are not being used as a fallback. If they are being kept as a fallback they should be removed after 2 months.

When you add a comment marking a string as obsolete, add the date when it can be removed to the comment.

``` fluent
# Obsolete string (expires: 2024-03-18)
example-old-string = Fifty thousand years old.
```

#### Fallback

If you need to create a new string for the same place on a page and would like to keep the old one as a fallback, you can add a version suffix to the new string ID: e.g. `firefox-new-skyline-main-page-title-v2`.

``` fluent
example-block-title-v2 = Security, reliability and speed — on every device, anywhere you go.
# Obsolete string (expires: 2024-03-18)
example-block-title = Security, reliability and speed — from a name you can trust.
```

The `ftl` helper function has the ability to accept a fallback string ID and is described in the next section.

#### Remove

If the new string is fundamentally different a new string ID should be created and the old one deleted.

For example, if the page is going from talking about the Google Translate extension to promoting our own Firefox Translate feature the old strings are not appropriate fall backs.

The old strings and IDs should be deleted:

``` fluent
example-translate-title = The To Google Translate extension makes translating the page you're on easier than ever.
example-translate-content = Google Translate, with over 100 languages* at the ready, is used by millions of people around the world.
```

The new strings should have different IDs and not be versioned:

``` fluent
example-translate-integrated-title = { -brand-name-firefox } now comes with an integrated translation tool.
example-translate-integrated-content =  Unlike some cloud-based alternatives, { -brand-name-firefox } translates text locally, so the content you're translating doesn't leave your machine.
```

The `ftl_has_messages` jinja helper would be useful here and is described in the next section.

## Template Helper Functions

### The `ftl` helper function

The `ftl()` function takes a string ID and returns the string in the current language, or simplified English if the string isn't translated. If you'd like to use a different string ID in the case that the primary one isn't translated you can specify that like this:

``` python
ftl("primary-string-id", fallback="fallback-string-id")
```

When a fallback is specified it will be used only if the primary isn't translated in the current locale. English locales (e.g. en-US, en-GB) will never use the fallback and will print the simplified english version of the primary string if not overridden in the more specific locale.

You can also pass in replacement variables into the `ftl()` function for use with [fluent variables](https://projectfluent.org/fluent/guide/variables.html). If you had a variable in your fluent file like this:

``` fluent
welcome = Welcome, { $user }!
```

You could use that in a template like this:

``` jinja
<h2>{{ ftl('welcome', user='Dude') }}<h2>
```

For our purposes these are mostly useful for things that can change, but which shouldn't involve retranslation of a string (e.g. URLs or email addresses).

You may also request any other translation of the string (or the original English string of course) regardless of the current locale.

``` jinja
<h2>{{ ftl('welcome', locale='en', user='Dude') }}<h2>
```

This helper is available in Jinja templates and Python code in views. For use in a view you should always call it in the view itself:

``` python
# views.py
from lib.l10n_utils import render
from lib.l10n_utils.fluent import ftl


def about_view(request):
    ftl_files = "mozorg/about"
    hello_string = ftl("about-hello", ftl_files=ftl_files)
    render(request, "about.html", {"hello": hello_string}, ftl_files=ftl_files)
```

If you need to use this string in a view, but define it outside of the view itself, you can use the `ftl_lazy` variant which will delay evaluation until render time. This is mostly useful for defining messages shared among several views in constants in a `views.py` or `models.py` file.

Whether you use this function in a Python view or a Jinja template it will always use the default list of Fluent files defined in the `FLUENT_DEFAULT_FILES` setting. If you don't specify any additional Fluent files via the `fluent_files` keyword argument, then only those default files will be used.

### The `ftl_has_messages` helper function

Another useful template tool is the `ftl_has_messages()` function. You pass it any number of string IDs and it will return `True` only if all of those message IDs exist in the current translation. This is useful when you want to add a new block of HTML to a page that is already translated, but don't want it to appear untranslated on any page.

``` jinja
{% if ftl_has_messages('new-title', 'new-description') %}
  <h3>{{ ftl('new-title') }}</h3>
  <p>{{ ftl('new-description') }}</p>
{% else %}
  <h3>{{ ftl('title') }}</h3>
  <p>{{ ftl('description') }}</p>
{% endif %}
```

If you'd like to have it return true when any of the given message IDs exist in the translation instead of requiring all of them, you can pass the optional `require_all=False` parameter and it will do just that.

There is a version of this function for use in views called `has_messages`. It works exactly the same way but is meant to be used in the view Python code.

``` python
# views.py
from lib.l10n_utils import render
from lib.l10n_utils.fluent import ftl, has_messages


def about_view(request):
    ftl_files = "mozorg/about"
    if has_messages("about-hello-v2", "about-title-v2", ftl_files=ftl_files):
        hello_string = ftl("about-hello-v2", ftl_files=ftl_files)
        title_string = ftl("about-title-v2", ftl_files=ftl_files)
    else:
        hello_string = ftl("about-hello", ftl_files=ftl_files)
        title_string = ftl("about-title", ftl_files=ftl_files)

    render(
        request,
        "about.html",
        {"hello": hello_string, "title": title_string},
        ftl_files=ftl_files,
    )
```

*[FTL]: Fluent Translation List
