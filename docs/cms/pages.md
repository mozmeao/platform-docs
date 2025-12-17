# Creating CMS Pages

This is an introduction to creating new content surfaces in the CMS. It is not a comprehensive guide, but rather a starting point to get you up and running with the basics.

## Editing current content surfaces

In terms of managing the content of an existing surface, please see the general [Wagtail Editor Guide](https://guide.wagtail.org/en-latest/) for now.

If you want to change the code-defined behaviour of an existing surface, that's similar to adding a new content surface, covered below. You may also find the [Wagtail Docs](https://docs.wagtail.org/) and [The Ultimate Wagtail Developers Course](https://learnwagtail.com/courses/the-ultimate-wagtail-developers-course/) useful if you don't have experience of building with Wagtail yet.

## Adding new content surfaces

The page types that you see in the CMS admin are defined as regular models in Django. As such, you can define new page types in the same way you would define any other Django model, using Wagtail's field types and panels to define the data that can be entered into the page.

When it comes to structuring CMS page models, there are some general guidelines to try and follow:

- Models and templates should be defined in the same Django app that corresponds to where the URL exists in each site's information architecture (IA) hierarchy, similar to what we do for regular Jinja templates already. For example, a Mozilla themed page should be defined in `/bedrock/mozorg/models.py`, and a Firefox themed page model should be in `/springfield/firefox/models.py`.
- Global `Page` models and `StreamField` blocks that are shared across many pages throughout the site should be defined in `/bedrock/cms/` or `/springfield/cms/`.

Structuring code in this way should hopefully help to keep things organized and migrations in a manageable state.

## Creating a new page model

Let's start by creating a new Wagtail page model called `TestPage` in `bedrock/mozorg/models.py`.

``` python
from django.db import models

from wagtail.admin.panels import FieldPanel
from wagtail.fields import RichTextField

from bedrock.cms.models.base import AbstractBedrockCMSPage


class TestPage(AbstractBedrockCMSPage):
    heading = models.CharField(max_length=255, blank=True)
    body = RichTextField(
        blank=True,
        features=settings.WAGTAIL_RICHTEXT_FEATURES_FULL,
    )

    content_panels = AbstractBedrockCMSPage.content_panels + [
        FieldPanel("heading"),
        FieldPanel("body"),
    ]

    template = "mozorg/test_page.html"
```

Some key things to note here:

- `TestPage` is a subclass of `AbstractBedrockCMSPage`, which is a common base class for all Wagtail pages in bedrock. Inheriting from `AbstractBedrockCMSPage` allows CMS pages to use features that exist outside of Wagtail, such as rendering Fluent strings and other L10n methods. There is, of course, an `AbstractSpringfieldCMSPage` in Springfield
- The `TestPage` model defines two database field called `heading` and `body`. The `heading` field is a `CharField` (the most simple text entry field type), and `body` is a `RichTextField`. The HTML tags and elements that a content editor can enter into a rich text field are defined in `settings.WAGTAIL_RICHTEXT_FEATURES_FULL`.
- There is also a `title` field on the page model, which from `AbstractBedrockCMSPage` (which in turn comes from `wagtail.models.Page`). This doesn't make `heading` redundant, but it's worth knowing where `title` comes from.
- Both fields are added to the CMS admin panel by adding each as a `FieldPanel` to `content_panels`. If you forget to do this, that's usually why you don't see the field in the CMS admin.
- Finally, the template used to render the page type can be found at `mozorg/test_page.html`.
- If you don't set a custom template name, Wagtail will infer it from the model's name: `<app_label>/<model_name (in snake case)>.html`
- All new models must be added to the config for the DB exporter script. If you do not, the page will not be correctly exported for local development and will break for anyone using that DB export file. See ``Add your new model to the DB export``, below.

## Django model migrations

Once you have your model defined, it's then time to run create and run migrations to set up a database table for it:

``` shell
./manage.py makemigrations
```

You can then run migrations using:

``` shell
./manage.py migrate
```

Many times when you make changes to a model, it will also mean that the structure of the database table has changed. So as a general rule it's good to form a habit of running the above steps after making changes to your model. Each migration you make will add a new migration file to the `/migrations` directory. When doing local development for a new page you might find yourself doing this several times, so to help reduce the number of migration files you create you can also squash / merge them.

- [Django migrations docs](https://docs.djangoproject.com/en/4.2/topics/migrations/).
- [Squashing migrations](https://docs.djangoproject.com/en/4.2/topics/migrations/).

## Rendering data in templates

This is a good time to test out your page model by adding data to it to see how it renders in your template.

The data can be rendered in `mozorg/test_page.html` as follows:

``` jinja
{% extends "base-protocol-mozilla.html" %}

{% block page_title %}{{ page.title }}{% endblock %}

{% block content %}
    <header>
    <h1>{{ page.heading }}</h1>
    <div class="w-rich-text">
        {{ page.body|richtext }}
    </div>
    </header>
{% endblock %}
```

Note the `|richtext` filter applied to the `page.body` field. This is a Wagtail-provided Jinja2 filter that will render the rich text field as HTML.
We use a custom `wagtailcore/shared/richtext.html` template to slot in our own Protocol CSS at the last minute.

## Previewing pages in the CMS admin

Next, restart your local server and log in to the CMS admin. Browse to a page and use the `+` icon or similar to add a new "child page". You should now see your new page type in the list of available pages. Create a new page using the `TestPage` type, give the page a title of `Test Page` and a slug of `test`, and then enter some data for the fields you defined. When you click the preview icon in the top right of the CMS page, you should hopefully see your template and data rendered successfully!

## Using advanced page models, fields, and blocks

The example above was relatively simple in terms of data, but not very flexible. Now that you have the basics covered, the next step is to start thinking about your page requirements, and how to better structure your data models.

At this point, deep diving into the [Wagtail Docs](https://docs.wagtail.org/) is very much recommended. In particular, reading up on more advanced concepts such as [Stream Fields](https://docs.wagtail.org/en/stable/topics/streamfield.html) and [Custom Block types](https://docs.wagtail.org/en/stable/advanced_topics/customisation/streamfield_blocks.html#custom-streamfield-blocks) will make it possible to make much more advanced CMS page types.

This is also a good time to start thinking about guardrails for your page and data. Some common things to consider:

- Are there rules around the type of content that should be allowed on the page, such as the minimum or maximum number of items in a block?
- Should there be a set order to content in a page, or can it be flexible?
- Are there rules that should be applied at the page level, such as where it should live in the site hierarchy?
- Should there be a limit to the number of instances of that page type? (e.g. it would be confusing to have more than one home page or contact page).

## Writing tests

When it comes to testing CMS page models, [wagtail_factories](https://github.com/wagtail/wagtail-factories) can be used to create mock data for tests to render. This can often be the trickiest part when testing more complex page models, so it takes some practice.

Factories for your page models and blocks should be defined in a `factories.py` file for your tests to import:

``` python
import factory
import wagtail_factories

from bedrock.mozorg import TestPage


class TestPageFactory(wagtail_factories.PageFactory):
    title = "Test Page"
    live = True
    slug = "test"

    heading = wagtail_factories.CharBlockFactory
    body = wagtail_factories.CharBlockFactory

    class Meta:
        model = models.TestPage
```

In your `test_models.py` file, you can then import the factory for your test and give it some data to render:

``` python
import pytest
from wagtail.rich_text import RichText

from bedrock.cms.tests.conftest import minimal_site  # noqa
from bedrock.mozorg.tests import factories

pytestmark = [
    pytest.mark.django_db,
]


@pytest.mark.parametrize("serving_method", ("serve", "serve_preview"))
def test_page(minimal_site, rf, serving_method):  # noqa
    root_page = minimal_site.root_page

    test_page = factories.TestPageFactory(
        parent=root_page,
        heading="Test Heading",
        body=RichText("Test Body"),
    )

    test_page.save()

    _relative_url = test_page.relative_url(minimal_site)
    assert _relative_url == "/en-US/test/"
    request = rf.get(_relative_url)

    resp = getattr(test_page, serving_method)(request)
    page_content = resp.text
    assert "Test Heading" in page_content
    assert "Test Body" in page_content
```

## Add your new model to the DB export

When you add a new model, you must update the script that generates the sqlite DB export of our data, so that the model is included in the export. (It's an allowlist pattern, as requested by Mozilla Security).

**If you do not, the page will not be correctly exported for local development and will break for anyone using that DB export file.**

(It's down to Wagtail's multi-table inheritance pattern: if you don't specify your new model for export, Wagtail's core metadata `Page` is exported, but not the actual new data model that holds the content that's linked to that `Page`)

The script is `bin/export-db-to-sqlite.sh` and you need to add your new model to the list of models being exported. Search for `MAIN LIST OF MODELS BEING EXPORTED` and add your model (in the format `appname.ModelName`) there.

## The `CMS_ALLOWED_PAGE_MODELS` setting

When you add a new page to the CMS, it will be available to add as a new child page immediately if `DEV=True`. This means it'll be on Dev (www-dev), but not in Staging or Prod.

So if you ship a page that needs to be used immediately in Production (which will generally be most cases), you must remember to add it to `CMS_ALLOWED_PAGE_MODELS` in `base/settings.py`. If you do not, it will not be selectable as a new Child Page in the CMS.

### Why do we have this behaviour?

Two reasons:

1. This setting allows us to complete initial/eager work to add a new page type, but stop it being used in Production until we are ready for it (e.g. a special new campaign page type that we wanted to get ready in good time). While there will be guard rails and approval workflows around publishing, without this it could still be possible for part of the org to start using a new page without us realising it was off-limits, and possibly before it is allowed to be released.
2. This approach allows us to gracefully deprecate pages: if a page is removed in `settings.CMS_ALLOWED_PAGE_MODELS`, that doesn't mean it disappears from Prod or can't be edited - it just stops a NEW one being added in Prod.

## Migrating Django pages to the CMS

!!! note
    This is initial documentation, noting relevant things that exist already, but much fuller recommendations will follow

Migrating a surface to Wagtail is very similar to adding a new one, but some extra thought needs to be given to the switchover between old hardcoded content and new CMS-backed content.

### The `@prefer_cms` decorator

If you have an existing Django-based page that you want to move to be a CMS-driven page, you are faced with a quandry.

Let's say the page exists at `/some/path/`; you can create it in the CMS with a branch of pages that mirror the same slugs (a parent page with a slug of `some` and a child page with a slug of `path`). However, in order for anyone to see the published page, you would have to remove the reference to the Django view from the URLconf, so that Wagtail would get a chance to render it (because Wagtail's page-serving logic comes last in all URLConfs). **BUT\...** how can you enter content into the CMS fast enough replace the just-removed Django page? (Note: we could use a data migraiton here, but that gets complicated when there are images involved)

Equally, you may have a situation where the content for certain paths needs to be managed in the CMS for certain locales, while other locales (with rarely changing 'evergreen' content) may only exist as Django-rendered views drawing strings from Fluent.

The answer here is to use the `prefer_cms` decorator/helper from `bedrock.cms.decorators` or `springfield.cms.decorators`

A Django view decorated with `prefer_cms` will check if a live CMS page has been added that matches the same overall, relative path as the Django view. If it finds one, it will show the user ``that`` CMS page instead. If there is no match in the CMS, then the original Django view will be used.

The result is a graceful handover flow that allows us to switch to the CMS page without needing to remove the Django view from the URLconf, or to maintain a hybrid approach to page management. It doesn't affect previews, so the review of draft pages before publishing can continue with no changes. Once the CMS is populated with a live version of the replacement page, that's when a later changeset can remove the deprecated Django view if it's no longer needed.

The `prefer_cms` decorator can be used directly on function-based views, or can wrap views in the URLconf. It should not used with `bedrock.mozorg.util.page` or `springfield.base.util.page` due to the complexity of passing through what locales are involved, but instead the relevant URL route should be refactored as a regular Django view, and then decorated with `prefer_cms`

For more details, please see the docstring on `prefer_cms`.

## Generating URLs for CMS pages in non-CMS templates

Pages in the CMS don't appear in the hard-coded URLConfs in Bedrock or Springfield. Normally, this means there's no way to use ``url()`` to generate a path to it.

However, if there's a page in the CMS you need to generate a URL for using the `url()` template tag, _and you know what its path will be_, there is a solution.

`bedrock.cms.cms_only_urls` (and `springfield.cms.cms_only_urls`) is a special URLConf that only gets loaded during the call to the `url()` helper. If you expand it with a named route definition that matches the path you know will/should exist in the CMS (and most of our CMS-backed pages ``do`` have carefully curated paths), the `url()` helper will give you a path that points to that page, even though it doesn't really exist as a static Django view.

See the example in the `bedrock.cms.cms_only_urls.py` file.

!!! note
    Moving a URL route to `cms_only_urls.py` is a natural next step after you've migrated a page to the CMS using the `@prefer_cms` decorator and now want to remove the old view without breaking all the calls to ``url('some.view')`` or ``reverse('some.view')``.
