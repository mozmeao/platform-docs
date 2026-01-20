# Feature Switches

Switches are managed using django-waffle and are stored in the database. These switches control behavior and/or features of select pages, and their state (active or inactive) is based on an `active` boolean field in the database.

## Defining and Using Switches

The `switch()` template helper function allows you to check whether a specific switch is active. You pass a name to the function (using only letters, numbers, and dashes), which is automatically converted to uppercase and with dashes replaced by underscores for the lookup in the database. For example, `switch('the-dude')` will look for a switch named `THE_DUDE` in the database.

## Locale-Specific Switches

You can provide a list of locale codes to limit the switch's activation to specific locales. If the page is viewed in a locale not included in the list, the switch will return False. You can also use "Locale Groups," which apply to all locales with a common prefix (e.g., "en-US, en-GB" or "zh-CN, zh-TW"). To use these groups, pass the prefix. For example, `switch('the-dude', ['en', 'de'])` will activate the switch for German and any English locale supported by the site.

## Managing Switches

Switches are managed through the Django Admin interface, where you can add, edit, or remove switches from the database directly. This interface allows for management of feature toggles without modifying environment variables or code. There is also a Django management command to toggle switches from the command line, as detailed below.

## Deploy switches with code

You can deploy switches directly through code by creating a data migration. This approach ensures switches are consistently created or updated during deployment, rather than requiring manual configuration through the Django Admin interface.

To implement a switch via data migration, create an empty migration file:

``` bash
./manage.py makemigrations base --empty
```

Then add the following code to the generated migration file, which can be found in the `{project}/base/migrations` directory:

``` python
from django.db import migrations

from waffle.models import Switch

# The name of the switch must be unique.
SWITCH_NAME = "RELEASE_THE_KRAKEN"


def create_switch(apps, schema_editor):
    Switch.objects.get_or_create(
        name=SWITCH_NAME,
        defaults={"active": True},  # Set initial state, True or False.
    )


def remove_switch(apps, schema_editor):
    Switch.objects.filter(name=SWITCH_NAME).delete()


class Migration(migrations.Migration):
    dependencies = [
        (
            "base",
            "0001_initial",
        ),  # Keep whatever the makemigrations command generated here.
    ]

    operations = [
        migrations.RunPython(create_switch, remove_switch),
    ]
```

The migration will run during deployment and ensure the switch exists in the database. The `remove_switch` function allows the migration to be reversed if needed.

To test this locally, run the following command:

``` bash
./manage.py migrate base
```

Verify the switch exists in the database by running:

``` bash
./manage.py waffle_switch -l
```

You should see the switch listed in the output.

To test reversing the migration, run the following command but replace `0001` with whatever the previous migration number is:

``` bash
./manage.py migrate base 0001
```

## Example Usage in Templates

You can use the `switch()` helper function in your Jinja2 templates as follows:

``` html
{% if switch('the-dude') %}
    <!-- Feature-specific HTML goes here -->
{% endif %}
```

## Example Usage in Python

You may also use switches in Python code (though locale support is unavailable in this context):

!!! warning
    **Avoid using switch() outside the request/response cycle** (e.g., during module-level imports or in a urls.py file), as the switch's state is managed in the database and can be changed via the admin interface.

    Using it outside the request cycle would prevent the switch value from immmediately reflecting any updates to it, until the Django server is restarted. Or (more confusingly) because we actually have multiple webs servers in use and turn these on and off to suit load demands, users might get inconsistent behaviour depending on where in the world they are.

    If you need to put a page/view/URL behind a Switch, skip down to [Putting pages behind a Switch](#putting-pages-behind-a-switch).

=== "Bedrock"
    ``` python
    from bedrock.base.waffle import switch

    def home_view(request):
        title = "Staging Home" if switch("staging-site") else "Prod Home"
        ...
    ```
=== "Springfield"
    ``` python
    from springfield.base.waffle import switch

    def home_view(request):
        title = "Staging Home" if switch("staging-site") else "Prod Home"
        ...
    ```

## Putting pages behind a Switch

As noted above, we can't just wrap a route definition in a `urlpatterns` with a `switch()`, because the `URLConf` is evaluated once at startup, rather than afresh each time a HTTP request comes in. If you need to put a view behind a switch, here's what you can do:

### Switches with a Django function-based view

=== "Bedrock"
    ``` python
    from django.http import Http404
    from bedrock.base.waffle import switch

    def some_view(request):
        # Check the switch right at the start of the view function
        if not switch("some-switch-here"):
            raise Http404

        # rest of code view continues
        ...

    ```
=== "Springfield"
    ``` python
    from django.http import Http404
    from springfield.base.waffle import switch

    def some_view(request):
        # Check the switch right at the start of the view function
        if not switch("some-switch-here"):
            raise Http404

        # rest of code view continues
        ...

    ```

### Switches with a Django class-based view

=== "Bedrock"
    ``` python
    from django.http import Http404
    from bedrock.base.waffle import switch

    class SomeClassBasedView(TemplateView):

        def dispatch(self, *args, **kwargs):
            if not switch("some-switch-here"):
                raise Http404
            return super().dispatch(*args, **kwargs)

        # other view methods follow as usual
        ...
    ```
=== "Springfield"
    ``` python
    from django.http import Http404
    from springfield.base.waffle import switch

    class SomeClassBasedView(TemplateView):

        def dispatch(self, *args, **kwargs):
            if not switch("some-switch-here"):
                raise Http404
            return super().dispatch(*args, **kwargs)

        # other view methods follow as usual
        ...

    ```

### Switches for a route with our `page()` helper

The [`page()` helper](/platform-docs/development/views/#page-helper) gives us a quick way to render a HTML template at a particular route, with support for our l10n machinery. However, the helper doesn't currently allow use of switches.

You can pass a switch's name in as a parameter in order to enable the view/page if the switch is ON, else the route will 404

So if an un-switched page might normally be added with:

``` python
page(
    "some/feature/",
    "path/to/some/feature.html",
    ftl_files=["some/feature"],
),
```

A switched page would be added with:

``` python
page(
    "some/new/feature/",
    "path/to/some/new/feature.html",
    enabling_switch="new-feature",
    ftl_files=["some/new/feature"]
),
```


## Testing

If the environment variable `DEV` is set to a "true" value, then all switches will be considered active unless they are explicitly set as not active in the database. `DEV` defaults to "true" in local development and demo servers.

To test switches locally, add the switch to the database. This can be done in one of two ways.

1. Add the switch via the Django management command:

    ``` bash
    ./manage.py waffle_switch --create SWITCH_NAME on
    ```

    If the switch already exists, you can toggle it using:

    ``` bash
    ./manage.py waffle_switch SWITCH_NAME on ./manage.py waffle_switch SWITCH_NAME off
    ```

    And you can view all the switches via:

    ``` bash
    ./manage.py waffle_switch -l
    ```

    To delete a switch, run:

    ``` bash
    ./manage.py waffle_delete --switches SWITCH_NAME
    ```

2. Add the switch in the Django admin at `/django-admin/`. There you will see the "Django-Waffle" module with the "Switches" table. Click through to view the switches and add/edit/delete as needed.

## Traffic Cop

Currently, these switches are used to enable/disable [Traffic Cop](https://github.com/mozmeao/trafficcop/) experiments on many pages of the site. We only add the Traffic Cop JavaScript snippet to a page when there is an active test.

To work with/test these experiment switches locally, you must add the switches to your local database.
