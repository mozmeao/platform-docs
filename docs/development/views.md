# Adding a View

After determining what URL you want the page to display at you will need to add a line to the `urls.py` file for that app. The page helper will usually be enough for that but in some cases you will need a custom view.

## Page() helper

URL patterns should be the entire URL you desire, minus any prefixes from URLs files importing this one, and including a trailing slash. You should also give the URL a name so that other pages can reference it instead of hardcoding the URL. Example:

``` python
path("diversity/", views.DiversityView.as_view(), name="careers.diversity"),
```

If you only want to render a template and don't need to do anything else in a custom view, both projects come with a handy shortcut to automate all of this:

=== "Bedrock"

    ``` python
    from bedrock.mozorg.util import page

    page("cookie-settings/", "privacy/cookie-settings.html")
    ```

=== "Springfield"

    ``` python
    from springfield.base.util import page

    page("cookie-settings/", "privacy/cookie-settings.html")
    ```

The `page` helper is functionally identical in both projects

You don't need to create a view. It will serve up the specified template at the given URL (the first parameter. see the [Django docs](https://docs.djangoproject.com/en/3.2/ref/urls/#django.urls.path) for details). You can also pass template data as keyword arguments:

``` python
page(
    "channel/",
    "mozorg/channel.html",
    latest_version=product_details.firefox_versions["LATEST_FIREFOX_VERSION"],
)
```

The variable `latest_version` will be available in the template.


## Writing a Custom View

You should rarely need to write a view. Most pages are static and you should use the `page` function documented in [Adding Pages](adding-pages.md).

If you need to write a view and the page is translated or translatable then it should use the `l10n_utils.render()` function to render the template.

``` python
from lib import l10n_utils

from django.views.decorators.http import require_safe


@require_safe
def my_view(request):
    # do your fancy things
    ctx = {"template_variable": "awesome data"}
    return l10n_utils.render(request, "app/template.html", ctx)
```

Make sure to namespace your templates by putting them in a directory named after your app, so instead of templates/template.html they would be in templates/blog/template.html if `blog` was the name of your app.

The `require_safe` ensures that only `GET` or `HEAD` requests will make it through to your view.

If you prefer to use Django's Generic View classes we have a convenient helper for that. You can use it either to create a custom view class of your own, or use it directly in a `urls.py` file.

``` python
# app/views.py
from lib.l10n_utils import L10nTemplateView


class FirefoxRoxView(L10nTemplateView):
    template_name = "app/firefox-rox.html"


# app/urls.py
urlpatterns = [
    # from views.py
    path("firefox/rox/", FirefoxRoxView.as_view()),
    # directly
    path(
        "firefox/sox/", L10nTemplateView.as_view(template_name="app/firefox-sox.html")
    ),
]
```

The `L10nTemplateView` functionality is mostly in a template mixin called `LangFilesMixin` which you can use with other generic Django view classes if you need one other than `TemplateView`. The `L10nTemplateView` already ensures that only `GET` or `HEAD` requests will be served.

### Variation Views

We have a generic view that allows you to easily create and use a/b testing templates. If you'd like to have either separate templates or just a template context variable for switching, this will help you out. For example.

``` python
# urls.py

from django.urls import path

from bedrock.utils.views import VariationTemplateView

urlpatterns = [
    path(
        "testing/",
        VariationTemplateView.as_view(
            template_name="testing.html", template_context_variations=["a", "b"]
        ),
        name="testing",
    ),
]
```

This will give you a context variable called `variation` that will either be an empty string if no param is set, or `a` if `?v=a` is in the URL, or `b` if `?v=b` is in the URL. No other options will be valid for the `v` query parameter and `variation` will be empty if any other value is passed in for `v` via the URL. So in your template code you'd do the following:

``` jinja
{% if variation == 'b' %}<p>This is the B variation of our test. Enjoy!</p>{% endif %}
```

If you'd rather have a fully separate template for your test, you can use the `template_name_variations` argument to the view instead of `template_context_variations`.

``` python
# urls.py

from django.urls import path

from bedrock.utils.views import VariationTemplateView

urlpatterns = [
    path(
        "testing/",
        VariationTemplateView.as_view(
            template_name="testing.html", template_name_variations=["1", "2"]
        ),
        name="testing",
    ),
]
```

This will not provide any extra template context variables, but will instead look for alternate template names. If the URL is `testing/?v=1`, it will use a template named `testing-1.html`, if `v=2` it will use `testing-2.html`, and for everything else it will use the default. It puts a dash and the variation value between the template file name and file extension.

It is theoretically possible to use the template name and template context versions of this view together, but that would be an odd situation and potentially inappropriate for this utility.

You can also limit your variations to certain locales. By default the variations will work for any localization of the page, but if you supply a list of locales to the `variation_locales` argument to the view then it will only set the variation context variable or alter the template name (depending on the options explained above) when requested at one of said locales. For example, the template name example above could be modified to only work for English or German like so

``` python
# urls.py

from django.urls import path

from bedrock.utils.views import VariationTemplateView

urlpatterns = [
    path(
        "testing/",
        VariationTemplateView.as_view(
            template_name="testing.html",
            template_name_variations=["1", "2"],
            variation_locales=["en-US", "de"],
        ),
        name="testing",
    ),
]
```

Any request to the page in for example French would not use the alternate template even if a valid variation were given in the URL.

!!! note
    If you'd like to add this functionality to an existing Class-Based View, there is a mixin that implements this pattern that should work with most views: `bedrock.utils.views.VariationMixin`.

### Geo Template View {: #geo-location }

Now that we have our CDN configured properly, we can also just swap out templates per request country. This is very similar to the above, but it will use the proper template for the country from which the request originated.

``` python
from bedrock.base.views import GeoTemplateView


class CanadaIsSpecialView(GeoTemplateView):
    geo_template_names = {
        "CA": "mozorg/canada-is-special.html",
    }
    template_name = "mozorg/everywhere-else-is-also-good.html"
```

#### Testing Geo Views

For testing purposes while you're developing or on any deployment that is not accessed via the production domain ([www.mozilla.org](https://www.mozilla.org)) you can append your URL with a `geo` query param (e.g. `/firefox/?geo=DE`) and that will take precedence over the country from the request header. Remember to use a valid [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) as param value.

#### Other Geo Stuff

There are a couple of other tools at your disposal if you need to change things depending on the location of the user. You can use the `bedrock.base.geo.get_country_from_request` function in a view and it will return the country code for the request (either from the CDN or the query param, just like above).

``` python
from bedrock.base.geo import get_country_from_request


def dude_view(request):
    country = get_country_from_request(request)
    if country == "US":
        ...  # do a thing for the US
    else:
        ...  # do the default thing
```

The other convenience available is that the country code, either from the CDN or the query param, is avilable in any template in the `country_code` variable. This allows you to change anything about how the template renders based on the location of the user.

``` jinja
{% if country_code == "US" %}
    <h1>GO MURICA!</h1>
{% else %}
    <h1>Yay World!</h1>
{% endif %}
```

Reference:

- Officially assigned list of [ISO country codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements).
