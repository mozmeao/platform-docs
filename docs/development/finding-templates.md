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
    Pages supporting the Firefox product are intended to move to springfield in the long run. That migration is only partially complete leaving in–product pages currently served from both projects, partly redirecting selectively (2025-12-15), followed with URL pattern changes landed in–tree (2026-05-18).

### Firefox release, 145 and up for [some common languages](https://github.com/mozilla/bedrock/blob/e91c6f28e/bedrock/firefox/redirects.py#L81), 152 and up for all

Version number is major version only.

Wagtail CMS on springfield is used for two sets of locales, one with current version pages and one with evergeen content:
- Whatsnew URL: <https://www.firefox.com/en-US/whatsnew/155/>
- General URL: <https://www.firefox.com/en-US/whatsnew/general/>
- Template path: <https://github.com/mozmeao/springfield/blob/main/springfield/cms/templates/cms/whats_new_page2026.html>

Static evergreen template on springfield is used for the rest of locales:
- Whatsnew URL: <https://www.firefox.com/fy-NL/whatsnew/155/>
- Template path: <https://github.com/mozmeao/springfield/blob/main/springfield/firefox/templates/firefox/whatsnew/evergreen.html>

### Firefox release, 144 and down, or [campaigns targeted at unmigrated locales](https://github.com/mozilla/bedrock/blob/e91c6f28e/bedrock/firefox/views.py#L475)

Version number is digits+dots only.

- Whatsnew URL: <https://www.mozilla.org/en-US/firefox/144.0/whatsnew/>
- Template path: <https://github.com/mozilla/bedrock/tree/main/bedrock/firefox/templates/firefox/whatsnew>

Currently unused: (only redirected)

- Firstrun URL: <https://www.mozilla.org/en-US/firefox/144.0/firstrun/>
- Template path: <https://github.com/mozilla/bedrock/blob/main/bedrock/firefox/templates/firefox/firstrun/firstrun.html>

### Firefox Nightly, 152 and up for all locales

Version number is digits+dots and **a1**.

- Whatsnew URL: <https://www.firefox.com/en-US/whatsnew/155.0a1/>
- Template path: <https://github.com/mozmeao/springfield/blob/main/springfield/firefox/templates/firefox/whatsnew/nightly/evergreen.html>

Firstrun pages served from the same location as older builds below:

### Firefox Nightly, 151 and older

Version number is digits+dots and **a1**.

- Whatsnew URL: <https://www.mozilla.org/en-US/firefox/148.0a1/whatsnew/>
- Template path: <https://github.com/mozilla/bedrock/blob/main/bedrock/firefox/templates/firefox/nightly/whatsnew.html>

Currently served for all version from bedrock:

- Firstrun URL: <https://www.mozilla.org/en-US/firefox/nightly/firstrun/>
- Template path: <https://github.com/mozilla/bedrock/tree/main/bedrock/firefox/templates/firefox/nightly>

### Firefox Developer, 152 and up for all locales

Version number is digits+dots and **a2**.

- Whatsnew URL: <https://www.firefox.com/en-US/whatsnew/155.0a2/>
- Template path: <https://github.com/mozmeao/springfield/blob/main/springfield/firefox/templates/firefox/whatsnew/developer/evergreen.html>

Firstrun pages served from the same location as older builds below:

### Firefox Developer, 151 and older

Version number is digits+dots and **a2**.

- Whatsnew URL: <https://www.mozilla.org/en-US/firefox/144.0a2/whatsnew/>
- Template path: <https://github.com/mozilla/bedrock/blob/main/bedrock/firefox/templates/firefox/developer/whatsnew.html>

Currently served for all version from bedrock:

- Firstrun URL: <https://www.mozilla.org/en-US/firefox/144.0a2/firstrun/>
- Template path: <https://github.com/mozilla/bedrock/blob/main/bedrock/firefox/templates/firefox/developer/firstrun.html>

### Firefox Beta, for explicitly triggered rollouts

Version number is digits+dots and **beta**.

- Whatsnew URL: <https://www.mozilla.org/en-US/firefox/142.0beta/whatsnew/>
- Template path: see <https://github.com/mozilla/bedrock/blob/0a470f2/bedrock/firefox/views.py#L666>
