# Fluent Configuration

## Specifying Fluent files {: #specifying_fluent_files }

You have to tell the system which Fluent files to use for a particular template or view. This is done in either the `page()` helper in a `urls.py` file, or in the call to `l10n_utils.render()` in a view.

### Using the `page()` function

If you need to render a template, you will probably add a line like the following to your `urls.py` file:

``` python
urlpatterns = [
    page("about", "about.html"),
    page("about/contact", "about/contact.html"),
]
```

To tell this page to use the Fluent framework for l10n you need to tell it which file(s) to use:

``` python
urlpatterns = [
    page("about", "about.html", ftl_files="mozorg/about"),
    page(
        "about/contact",
        "about/contact.html",
        ftl_files=["mozorg/about/contact", "mozorg/about"],
    ),
]
```

The system uses the first (or only) file in the list to determine which locales are active for that URL. You can pass a string or list of strings to the `ftl_files` argument. The files you specify can include the `.ftl` extension or not, and they will be combined with the list of default files which contain strings for global elements like navigation and footer. There will also be files for reusable widgets like the newsletter form, but those should always come last in the list.

### Using the class-based view

Bedrock includes a generic class-based view (CBV) that sets up l10n for you. If you need to do anything fancier than just render the page, then you can use this:

``` python
from lib.l10n_utils import L10nTemplateView


class AboutView(L10nTemplateView):
    template_name = "about.html"
    ftl_files = "mozorg/about"
```

Using that CBV will do the right things for l10n, and then you can override other useful methods (e.g. `get_context_data`) to do what you need. Also, if you do need to do anything fancy with the context, and you find that you need to dynamically set the fluent files list, you can easily do so by setting `ftl_files` in the context instead of the class attribute.

``` python
from lib.l10n_utils import L10nTemplateView


class AboutView(L10nTemplateView):
    template_name = "about.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ftl_files = ["mozorg/about"]
        if request.GET.get("fancy"):
            ftl_files.append("fancy")

        ctx["ftl_files"] = ftl_files
        return ctx
```

A common case is needing to use FTL files when one template is used, but not with another. In this case you would have some logic to decide which template to use in the `get_template_names()` method. You can set the `ftl_files_map` class variable to a dict containing a map of template names to the list of FTL files for that template (or a single file name if that's all you need).

``` python
# views.py
from lib.l10n_utils import L10nTemplateView


# class-based view example
class AboutView(L10nTemplateView):
    ftl_files_map = {"about_es.html": ["about_es"], "about_new.html": ["about"]}

    def get_template_names(self):
        if self.request.locale.startswith("en"):
            template_name = "about_new.html"
        elif self.request.locale.startswith("es"):
            template_name = "about_es.html"
        else:
            # FTL system not used
            template_name = "about.html"

        return [template_name]
```

If you need for your URL to use multiple Fluent files to determine the full list of active locales, for example when you are redesigning a page and have multiple templates in use for a single URL depending on locale, you can use the ``activation_files`` parameter. This should be a list of FTL filenames that should all be used when determining the full list of translations for the URL. Bedrock will gather the full list for each file and combine them into a single list so that the footer language switcher works properly.

Another common case is that you want to keep using an old template for locales that haven't yet translated the strings for a new one. In that case you can provide an `old_template_name` to the class and include both that template and `template_name` in the `ftl_files_map`. Once you do this the view will use the template in `template_name` only for requests for an active locale for the FTL files you provided in the map.

``` python
from lib.l10n_utils import L10nTemplateView


class AboutView(L10nTemplateView):
    template_name = "about_new.html"
    old_template_name = "about.html"
    ftl_files_map = {
        "about_new.html": ["about_new", "about_shared"],
        "about.html": ["about", "about_shared"],
    }
```

In this example when the `about_new` FTL file is active for a locale, the `about_new.html` template will be rendered. Otherwise the `about.html` template would be used.

### Using in a view function

Lastly there's the good old function views. These should use `l10n_utils.render` directly to render the template with the context. You can use the `ftl_files` argument with this function as well.

``` python
from lib.l10n_utils import render


def about_view(request):
    render(request, "about.html", {"name": "Duder"}, ftl_files="mozorg/about")
```

## Pipeline Configuration

In order for a Fluent file to be extracted through automation and sent out for localization, it must first be configured to go through one or more distinct pipelines. This is controlled via a set of configuration files:

- [Vendor](https://github.com/mozilla/bedrock/blob/main/l10n/configs/vendor.toml), locales translated by an agency, and paid for by Marketing (locales covered by staff are also included in this group).
- [Pontoon](https://github.com/mozilla/bedrock/blob/main/l10n/configs/pontoon.toml), locales translated by Mozilla contributors.
- [Special templates](https://github.com/mozilla/bedrock/blob/main/l10n/configs/special-templates.toml), for locales with dedicated templates that don't go through the localization process (not currently used).

Each configuration file consists of a pre-defined set of locales for which each group is responsible for translating. The locales defined in each file should not be changed without first consulting the with L10n team, and such changes should not be a regular occurrence.

To establish a localization strategy for a Fluent file, it needs to be included as a path in one or more configuration files. For example:

``` text
[[paths]]
    reference = "en/mozorg/mission.ftl"
    l10n = "{locale}/mozorg/mission.ftl"
```

You can read more about configuration files in the [L10n Project Configuration](https://moz-l10n-config.readthedocs.io/) docs.

!!! important
    Path definitions in Fluent configuration files are not source order dependent. A broad definition using a wild card can invalidate all previous path definitions for example. Paths should be defined carefully to avoid exposing .ftl files to unintended locales.

Using a combination of vendor and pontoon configuration offers a flexible but specific set of options to choose from when it comes to defining an l10n strategy for a page. The available choices are:

1. Staff locales.
2. Staff + select vendor locales.
3. Staff + all vendor locales.
4. Staff + vendor + pontoon.
5. All pontoon locales (for non-marketing content only).

When choosing an option, it's important to consider that vendor locales have a cost associated with them, and pontoon leans on the goodwill of our volunteer community. Typically, only non-marketing content should go through Pontoon for all locales. Everything that is marketing related should feature one of the staff/vendor/pontoon configurations.

## Fluent File Activation

Fluent files are activated automatically when processed from the l10n team's repo into our own based on a couple of rules.

1. If a fluent file has a group of required strings, all of those strings must be present in the translation in order for it to be activated.
2. A translation must contain a minimum percent of the string IDs from the English file to be activated.

If both of these conditions are met the locale is activated for that particular Fluent file. Any view using that file as its primary (first in the list) file will be available in that locale.

### Deactivation

If the automated system activates a locale but we for some reason need to ensure that this page remains unavailable in that locale, we can add this locale to a list of deactivated locales in the metadata file for that FTL file. For example, say we needed to make sure that the ``mozorg/mission.ftl`` file remained inactive for German, even though the translation is already done. We would add `de` to the `inactive_locales` list in the `metadata/mozorg/mission.json` file:

``` json
{
  "active_locales": [
    "de",
    "fr",
    "en-GB",
    "en-US",
  ],
  "inactive_locales": [
    "de"
  ],
  "percent_required": 85
}
```

This would ensure that even though `de` appears in both lists, it will remain deactivated on the site. We could just remove it from the active list, but automation would keep attempting to add it back, so for now this is the best solution we have, and is an indication of the full list of locales that have satisfied the rules.

### Alternate Rules

It's also possible to change the percentage of string completion required for activation on a per-file basis. In the same metadata file as above, if a `percent_required` key exists in the JSON data (see above) it will be used as the minimum percent of string completion required for that file in order to activate new locales.

!!! note
    Once a locale is activated for a Fluent file it will **NOT** be automatically deactivated, even if the rules change. If you need to deactivate a locale you should follow the [Deactivation](#deactivation) instructions.

### Activation Status

You can determine and use the activation status of a Fluent file in a view to make some decisions; what template to render for example. The way you would do that is with the `ftl_file_is_active` function. For example:

``` python
# views.py
from lib.l10n_utils import L10nTemplateView
from lib.l10n_utils.fluent import ftl_file_is_active


# class-based view example
class AboutView(L10nTemplateView):
    ftl_files_map = {
        "about.html": ["about"],
        "about_new.html": ["about_new", "about"],
    }

    def get_template_names(self):
        if ftl_file_is_active("mozorg/about_new"):
            template_name = "about_new.html"
        else:
            template_name = "about.html"

        return [template_name]


# function view example
def about_view(request):
    if ftl_file_is_active("mozorg/about_new"):
        template = "mozorg/about_new.html"
        ftl_files = ["mozorg/about_new", "mozorg/about"]
    else:
        template = "about.html"
        ftl_files = ["mozorg/about"]

    render(request, template, ftl_files=ftl_files)
```

### Active Locales

To see which locales are active for a particular .ftl file you can either look in the metadata file for that .ftl file, which is the one with the same path but in the `metadata` folder instead of a locale folder in the www-l10n repository. Or if you'd like something a bit nicer looking and more convenient there is the `active_locales` management command:

``` bash
./manage.py l10n_update
```

``` bash
./manage.py active_locales mozorg/mission
```

``` bash
There are 91 active locales for mozorg/mission.ftl:
- af
- an
- ar
- ast
- az
- be
- bg
- bn
...
```

You get an alphabetically sorted list of all of the active locales for that .ftl file. You should run `./manage.py l10n_update` as shown above for the most accurate and up-to-date results.

## String extraction

The string extraction process for both new .ftl content and updates to existing .ftl content is handled through automation. On each commit to `main` a command is run that looks for changes to the `l10n/` directory. If a change is detected, it will copy those files into a new branch in the corresponding l10n repo and then a bot will open a pull request containing those changes. Once the pull request has been reviewed and merged by the L10n team, everything is done.

To view the state of the latest automated attempt to open an L10N PR, see:

- [bedrock L10N PR action](https://github.com/mozilla/bedrock/actions/workflows/send_mozorg_fluent_strings_to_l10n_org.yml)
- [springfield L10N PR action](https://github.com/mozmeao/springfield/actions/workflows/send_firefox_fluent_strings_to_l10n_org.yml)

(We also just try to open L10N PRs every 3 hours, to catch any failed jobs that are triggered by a commit to `main`)

## Locale-specific Templates

While the `ftl_has_messages` template function is great in small doses, it doesn't scale particularly well. A template filled with conditional copy can be difficult to comprehend, particularly when the conditional copy has associated CSS and/or JavaScript.

In instances where a large amount of a template's copy needs to be changed, or when a template has messaging targeting one particular locale, creating a locale-specific template may be a good choice.

Locale-specific templates function by naming convention. For example, to create a version of `/firefox/new.html` specifically for the `de` locale, you would create a new template named `/firefox/new.de.html`. This template can either extend `/firefox/new.html` and override only certain blocks, or be entirely unique.

When a request is made for a particular page, the rendering function automatically checks for a locale-specific template, and, if one exists, will render it instead of the originally specified (locale-agnostic) template.

!!! note
    Creating a locale-specific template for en-US was not possible when this feature was introduced, but it is now. So you can create your en-US-only template and the rest of the locales will continue to use the default.

## Specifying Active Locales in Views

Normally we rely on activation tags in our translation files (.lang files) to determine in which languages a page will be available. This will almost always be what we want for a page. But sometimes we need to explicitly state the locales available for a page. The ``impressum`` page for example is only available in German and the template itself has German hard-coded into it since we don't need it to be translated into any other languages. In cases like these we can send a list of locale codes with the template context and it will be the final list. This can be accomplished in a few ways depending on how the view is coded.

For a plain view function, you can pass a list of locale codes to ``l10n_utils.render`` in the context using the name ``active_locales``. This will be the full list of available translations. Use ``add_active_locales`` if you want to add languages to the existing list:

``` python
def french_and_german_only(request):
    return l10n_utils.render(request, "home.html", {"active_locales": ["de", "fr"]})
```

If you don't need a custom view and are just using the ``page()`` helper function in your ``urls.py`` file, then you can similarly pass in a list:

``` python
page("about", "about.html", active_locales=["en-US", "es-ES"]),
```

Or if your view is even more fancy and you're using a Class-Based-View that inherits from ``LangFilesMixin`` (which it must if you want it to be translated) then you can specify the list as part of the view Class definition:

``` python
class MyView(LangFilesMixin, View):
    active_locales = ["zh-CN", "hi-IN"]
```

Or in the ``urls.py`` when using a CBV:

``` python
url(r"about/$", MyView.as_view(active_locales=["de", "fr"])),
```

The main thing to keep in mind is that if you specify ``active_locales`` that will be the full list of localizations available for that page. If you'd like to add to the existing list of locales generated from the lang files then you can use the ``add_active_locales`` name in all of the same ways as ``active_locales`` above. It's a list of locale codes that will be added to the list already available. This is useful in situations where we would have needed the l10n team to create an empty .lang file with an active tag in it because we have a locale-specific-template with text in the language hard-coded into the template and therefore do not otherwise need a .lang file.

## About L10N integrations

Each project manages an l10n pipeline that moves the l10n data (fluent `.ftl` files) between the l10n team and the project. This section describes how that works.

1. **FILE SETUP**

The source for Fluent files currently is `./l10n/`.

Here's a summary of the files within this directory:

``` bash
./l10n/en/  # This is where source Fluent templates go
./l10n/configs/pontoon.toml  # Config if using community/Pontoon translations
./l10n/configs/vendor.toml  # Config if using a paid-for translation service such as Smartling
./l10n/configs/special-templates.toml   # Only needed to exclude certain files from all community AND vendor translation, e.g. we use staff translation only

./l10n/l10n-pontoon.toml  # Entrypoint for community localization.
./l10n/l10n-vendor.toml  # Entrypoint for vendor and staff localization

./data/l10n-team/  # populated via a git sync using data FROM the l10n team
```

The root `.toml` files point to the ones in `/configs/` and are a 'gateway' through which we specify which config files are relevant to which translation strategy (community or vendor - or neither if it's staff-only translation).

2. **REPO SETUP**

    There are two repos, to hold the translation files as part of the pipeline.

    - **A repo in where the files are sent to** for the L10N team's automation to pick up. ([bedrock](https://github.com/mozilla-l10n/www-l10n/) / [springfield](https://github.com/mozilla-l10n/www-firefox-l10n)).
    - **An optional repo where files are post-processed following translation**. ([bedrock](https:/github.com/mozmeao/www-l10n/) / [springfield](https://github.com/mozmeao/www-firefox-l10n/))

        !!! important
            **This repo is optional if not using Pontoon/community translations.** Why? If the translations are done by the community (via Pontoon), there is a possibility that not enough of the strings will be translated in order to render the content in the relevant locale. We run a CI task to determine whether a locale has enough translated strings to be considered 'active'. If we used a vendor entirely, we would expect all locales to be 100% translated.

3. **CI SETUP**

    Details of how MozMarRobot is hooked are best gleaned from looking at `https://gitlab.com/mozmeao/www-fluent-update`.

    In short, once new translations land in the string-source repo (e.g. `github.com/mozilla-l10n/www-l10n`) they are cloned over to the activation-check repo `github.com/mozmeao/www-l10n/` by a CI task and later pulled into the site from there.

4. **CONFIGURATION SETTINGS**.

    There are many settings in `settings/base.py` that help the project know what remote repos and local folders to use. Search this file for settings starting with `FLUENT_` to find them.

5. **L10N UPDATE SCRIPT**.

    **Uploading strings for translation**

    Uploading `en`-locale source strings from the repo to the l10n repo is handled by `/bin/open-ftl-pr.sh`.

    See the Github workflow in `.github/workflows/` for where this is triggered.

    **Downloading translated strings**

    The script `/lib/l10n_utils/management/commands/l10n_update.py` will pull down the appropriate translations.

    *[FTL]: Fluent Translation List
    *[CI]: Continuous Integration
