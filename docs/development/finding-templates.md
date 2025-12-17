# Finding Templates

## General Structure

Bedrock and Springfield follow the Django app structure and most templates can be found by matching URL path segments to folders and files within the correct app.

Ignore the scheme, domain and locale (`/en-US`). The next path segment is usually the app name.

=== "Bedrock"

    - URL: `https://www.mozilla.org/en-US/privacy/`
    - Template path: `bedrock/privacy/templates/privacy/index.html`

    If you don't find it where you expect check in the `mozorg` app. The home page and child pages related to Mozilla Corporation (i.e. About, Contact, Diversity) end up in here.

    - URL: `https://www.mozilla.org/en-US/about/manifesto/`
    - Template path: `bedrock/mozorg/templates/mozorg/about/manifesto.html`

=== "Springfield"

    When Firefox content migrated to Springfield, most URLs moved up a level by removing the `/firefox/` prefix. For example, `mozilla.org/firefox/features/private-browsing/` became `firefox.com/features/private-browsing/`, but the internal template path still uses the `firefox` app structure.

    - URL: `https://www.firefox.com/en-US/features/private-browsing/`
    - Template path: `/springfield/firefox/templates/firefox/features/private-browsing.html`


## Whatsnew and Firstrun

These pages are specific to Firefox browsers, and only appear when a user updates or installs and runs a Firefox browser for the first time. The URL and template depend on what Firefox browser and version are in use.

There may be extra logic in the app's `views.py` file to change the template based on locale or geographic location as well.

!!! note
    Pages supporting the Firefox product are intended to move to springfield in the long run. That migration is only partially complete leaving things in a bit of a mess currently. (2025-12-15)

### Firefox release, 145 and up for [some common languages](https://github.com/mozilla/bedrock/blob/e91c6f28e719a16672191600a362466c1eca26b9/bedrock/firefox/redirects.py#L81).

Version number is major version only.

- Content is in the Wagtail CMS on springfield
- Whatsnew URL: <https://www.firefox.com/en-US/whatsnew/145/>
- Template path: <https://github.com/mozmeao/springfield/blob/main/springfield/cms/templates/cms/whats_new_page.html>

### Firefox release, 144 and down, or [campaigns targeted at unmigrated locales](https://github.com/mozilla/bedrock/blob/e91c6f28e719a16672191600a362466c1eca26b9/bedrock/firefox/views.py#L475)

Version number is digits only.

- Whatsnew URL: <https://www.mozilla.org/en-US/firefox/144.0/whatsnew/>
- Template path: <https://github.com/mozilla/bedrock/tree/main/bedrock/firefox/templates/firefox/whatsnew>

<!-- -->

- Firstrun URL: <https://www.mozilla.org/en-US/firefox/144.0/firstrun/>
- Template path: <https://github.com/mozilla/bedrock/blob/main/bedrock/firefox/templates/firefox/firstrun/firstrun.html>

### Firefox Nightly

Version number is digits and **a1**.

- Whatsnew URL: <https://www.mozilla.org/en-US/firefox/144.0a1/whatsnew/>
- Template path: <https://github.com/mozilla/bedrock/blob/main/bedrock/firefox/templates/firefox/nightly/whatsnew.html>

<!-- -->

- Firstrun URL: <https://www.mozilla.org/en-US/firefox/nightly/firstrun/>
- Template path: <https://github.com/mozilla/bedrock/tree/main/bedrock/firefox/templates/firefox/nightly>

### Firefox Developer

Version number is digits and **a2**.

- Whatsnew URL: <https://www.mozilla.org/en-US/firefox/144.0a2/whatsnew/>
- Template path: <https://github.com/mozilla/bedrock/blob/main/bedrock/firefox/templates/firefox/developer/whatsnew.html>

<!-- -->

- Firstrun URL: <https://www.mozilla.org/en-US/firefox/144.0a2/firstrun/>
- Template path: <https://github.com/mozilla/bedrock/blob/main/bedrock/firefox/templates/firefox/developer/firstrun.html>

