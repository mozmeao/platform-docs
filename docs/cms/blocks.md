# CMS blocks

Most pages defined in the CMS have at least one free form section that accepts different types of content and UI elements. To understand how to build those, read Wagtail's docs on [how to use StreamField for mixed content](https://docs.wagtail.org/en/stable/topics/streamfield.html).

## Block design principles

The UI elements available for each page type are first defined by designers and implemented according to the options the team wants to give to editors to create new pages. When implementing a new block, consider the following principles:

- The basic usage of a block should be straight forward and intuitive.
- Set default values whenever possible so that editors don't have to make choices for the basic usage.
- Separate content from presentation. Optional parameters, such as layout and theme, should be grouped inside a block's "Settings"
- Protect editors from making mistakes. We trust our editors to spot when a page doesn't look good, but they shouldn't have to.
  - If a block shouldn't be placed in a certain position on the page, add a page level validation.
  - If a certain combination of settings in a block doesn't make sense, raise a validation error.
  - If a field is optional, make sure that the template doesn't render it, adding white space.
  - However blocks are combined in a page, they should always output semantic HTML. Headings hierarchy must be consistent, for example.
- Smaller UI elements (atoms and molecules) should be generic enough to be used inside other blocks with little or no extra configuration.
- We frequently need to decide if a new UI element is a variation of an existing block or whole new one. To make that decision, consider these factors:
  - The intended usage of the block. Does it make sense only in a specific page or could it be placed in any page?
  - Will the new settings addition to the existing block make it confusing for editors?
  - If implemented as a new block, will it be clear to editors which is which and why they should pick one or the other?
- Don't be afraid to refactor blocks if it means improving usability - data migrations exist for this. (See the section about [migrating blocks](#block-data-migrations) below.)

## Blocks hierarchy

Smaller UI elements are defined as blocks that are used inside other blocks. Those will rarely be used directly in pages. Some examples are:

- Various types of buttons
- Icons
- Headings
- Lists
- Images

Section-level blocks combine smaller blocks into more complex structures. They usually fill the page width. Some examples are:

- Intro
- Banner
- Media + Content
- Cards list

These are more opinionated UI pieces with responsive designs. They're usually the direct children of a page.

## Headings and buttons

Those are blocks that require some special templating logic across page and block templates.

### Headings

Editors shouldn't have to manually set heading levels. The templates should be able to infer the correct heading tag from the page's content hierarchy. We do that by incrementing a template variable every time we go down the blocks nesting.

Consider the following page:

- Notification - no heading here
- Into block
    - Heading (`<h1>`)
    - Some content
- Section
    - Section heading (`<h2>`)
    - Section content
        - Cards list
            - Card
                - Card heading (`<h3>`)
                - Card content
            - Other cards...
- Banner
    - Banner heading (`<h2>`)
    - Banner content


Each of these blocks have headings. To determine which tag to use, they need to know their position on the page. The first block on the page that has a heading needs an `h1`. Every other block in the first level needs an `h2`. The children of these blocks need to be one level lower: `h3`. If they had children, those should get an `h4`, and so on...

Here's how we implement that.

`page.html`

```html
{% block content %}
<div class="my-page-class">
  {% set ns = namespace(headings=0) %}
  {% set block_level = 1 %}
  {% for block in page.content %}
    {% set block_index = loop.index %}
    {% set block_type = block.block_type %}
    {% set block_position = "block-" ~ block_index ~ "-" ~ block_type %}

    {% if (block.value.heading and block.value.heading.heading_text) or block.value.headline %}
      {% set block_level = 1 if ns.headings == 0 else 2 %}
      {% set ns.headings = ns.headings + 1 %}
    {% endif %}

    {% include_block block %}
  {% endfor %}
</div>
{% endblock content %}
```

The page creates a `headings` variable to count the blocks that have headings. Note that we can't just use the loop index because some blocks don't have headings, such as notifications. This count is used to set the `block_level` variable. The first block gets `block_level = 1` and all the following ones get `block_level = 2`.

When the heading block template is rendered, it will use this variable to determine the heading tag.

`blocks/heading.html`

```html
{% set heading_level = "h" ~ block_level if block_level else "h2" %}
<{{ heading_level }} class="my-heading">{{ value.heading_text }}</{{ heading_level }}>
```

Here we use `h2` as a safe fallback in case the variable is missing for any reason.

### Buttons

Another type of block that needs special attention is buttons. We use analytics to track user interaction with the pages. In order to properly identify which button was clicked, we use some data properties with information that distinguish the different buttons in a page.

- `data-cta-uid` - Every button block should have a unique identifier. This is the main attribute used in analytics to track the performance of an interaction. This attribute should be preserved across translations.
- `data-cta-position` - Indicates where the button is located on the page. If a page's translation changes the order in which some blocks appear, for example, the buttons will have the same UIDs, but a different positions.
- `data-cta-text` - This is the human readable attribute. It should be composed of the text of the nearest heading and the button's text. For example: "Cool new feature launched in Firefox - Learn more".

Note the `block_position` variable on the page template above. This variable should always be set at the page level and then incremented by each block down the blocks' tree.

The block position should follow this pattern:

- Levels are separated by `.`
- Loops are indicated by indexes
- Block types identify the blocks

`block-{index}-{block_type}.{child_block_type}.item-{index}-{grandchild_block_type}.button-1`

To determine the `data-cta-text`, every block that has a heading, must set the `block_text` variable.

Here's a full example for the `block_text` and `block_position` usage.

Consider this hierarchy:

- Section
    - Section heading
    - Section content
        - Cards list
            - Card
                - Card heading
                - Card content
                - Card button
            - More cards...
    - Call to action (button)

The section block's html would look like this:

`section.html`

```html
{% set block_text = value.heading.heading_text|richtext|remove_tags %}

<div class="section">
  <div class="section-heading">
    {% include_block value.heading %}
  </div>

  <div class="section-content">
    {% for block in value.content %}
      {% set block_position = block_position ~ ".item-" ~ loop.index ~ "-" ~ block.block_type %}
      {% with block_level = block_level + 1 if block_level else 2 %}
        {% include_block block %}
      {% endwith %}
    {% endfor %}
  </div>

  {% if value.cta %}
    <div class="section-cta">
      {% for button in value.cta %}
        {% set block_position = block_position ~ ".cta-" ~ loop.index %}
        {% include_block button %}
      {% endfor %}
    </div>
  {% endif %}
</div>
```

In this example, both the Call to Action and the cards's button use the a button block.

Here's what the button template looks like:

`button.html`

```html
{% set block_text = block_text ~ " - " ~ value.label %}

<button
  href="{{ value.url }}"
  data-cta-text="{{ block_text }}"
  data-cta-position="{{ block_position }}"
  data-cta-uid="{{ value.settings.analytics_id }}"
>
  {{ value.label }}
</button>
```

The section set the `block_text` variable with the content from it's heading. Note that we're using a custom `remove_tags` template tag to preserve only the text, without any HTML tags.

When the button is rendered in the CTA block, it will use the existing `block_text` template variable and append it's own label.  The `block_position` is set by the parent block. The result for the CTA button will be `data-cta-position="block-1-section.cta-1"` and `data-cta-text="Section Heading - Button label"`.

Now let's look at the cards from the example. They are in a lower level in relation to the section.

`cards-list.html`
```html
{% set block_level = block_level or 1 %}

<div class="cards-list">
  {% for card in value.cards %}
    {% set card_index = loop.index %}
    {% set block_position = block_position ~ ".card-" ~ card_index %}

    {% include_block card %}
  {% endfor %}
</div>
```

`card.html`
```html
{% set heading_level = 'h' ~ block_level if block_level else 'h3' %}
{% set block_text =  value.heading|richtext|remove_tags %}

<article class="card">
  <div class="card-heading">
    {% include_block value.heading %}
  </div>
  <div class="card-content">
    {% include_block value.content %}
  </div>
  {% if value.buttons %}
    <div class="card-buttons">
      {% for button in value.buttons %}
        {% set block_position = block_position ~ ".button-" ~ loop.index %}
        {% include_block button %}
      {% endfor %}
    </div>
  {% endif %}
</article>
```

In this example, the cards list block's template increments the `block_position` variable with the card's position in the loop when iterating the cards. The card template increments the variable again with the buttons' indexes when iterating the buttons. Since the card has a heading, it sets the `heading_level` variable, that will be used by the heading block's template. It also sets the `block_text` variable, that will be used by the button's template. The resulting attributes on the cards buttons would look like: `data-cta-position = "block-1-section.item-1-cards_list.card-1.button-1"` and `data-cta-text = "Card Heading - Button Label"`

## Block data migrations

Every time a new design or feature request comes in, there's a chance that a block needs to be refactored. We may realize that two blocks should actually be variations of the same one, or that a single block should be split in two different ones. We might need to change options in a block's settings or move a block's field into a nested structure. Since Wagtail's Stream Field data is stored as JSON, refactoring a block means writing data migrations to manipulate that JSON's structure.

Here's the basic algorithm of a data migration:
- Create a method to manipulate the data. That method should:
  - Walk down the field's tree, composed of lists and dictionaries
  - Whenever it finds the key corresponding to the block's type, alter the data with the new structure
- Query all the page models that use the block in their stream fields and update their data with the update method
- Query all the page's revisions and update them with the same method

Here's a full example:

```python
import json
from collections.abc import MutableSequence

from django.db import migrations

BANNER_THEME_MAP = {
    "purple": "purple-radial-gradient",
    "dark-purple": "dark-purple-gradient",
}

def update_banner_themes(data):
    """Recursively update banner block settings. Returns True if changed."""
    changed = False
    if isinstance(data, dict):
        block_type = data.get("type")
        if block_type == "banner" and "value" in data:
            settings = data["value"].get("settings")
            if isinstance(settings, dict):
                old_theme = settings.get("theme")
                new_theme = BANNER_THEME_MAP.get(old_theme)
                if new_theme:
                    settings["theme"] = new_theme
                    changed = True
        for value in data.values():
            if update_banner_themes(value):
                changed = True
    elif isinstance(data, (list, MutableSequence)):
        for item in data:
            if update_banner_themes(item):
                changed = True
    return changed

def convert_pages(apps, schema_editor):
    models_config = [
        ("PageType1", ["stream_field"]),
        ("PageType2", ["stream_field_1", "stream_field_2"]),
    ]

    for model_name, field_names in models_config:
        Model = apps.get_model("cms", model_name)
        for page in Model.objects.all():
            changed_fields = []
            for field_name in field_names:
                stream_value = getattr(page, field_name)
                if stream_value and update_banner_themes(stream_value.raw_data):
                    changed_fields.append(field_name)
            if changed_fields:
                page.save(update_fields=changed_fields)


def convert_revisions(apps, schema_editor):
    """Update Wagtail page revisions to use the new banner theme values."""
    try:
        Revision = apps.get_model("wagtailcore", "Revision")
        ContentType = apps.get_model("contenttypes", "ContentType")
    except LookupError:
        return

    models_config = [
        ("cms", "PageType1", ["stream_field"]),
        ("cms", "PageType2", ["stream_field_1", "stream_field_2"]),
    ]

    for app_label, model_name, field_names in models_config:
        try:
            content_type = ContentType.objects.get(app_label=app_label, model=model_name)
        except ContentType.DoesNotExist:
            continue

        for revision in Revision.objects.filter(base_content_type=content_type).iterator():
            modified = False
            for field_name in field_names:
                raw_json = revision.content.get(field_name)
                if not raw_json:
                    continue
                try:
                    field_data = json.loads(raw_json)
                    if update_banner_themes(field_data):
                        revision.content[field_name] = json.dumps(field_data)
                        modified = True
                except (json.JSONDecodeError, TypeError):
                    pass
            if modified:
                revision.save(update_fields=["content"])

class Migration(migrations.Migration):
    dependencies = [
        ("cms", "XXXX_previous_migration"),
    ]

    operations = [
        migrations.RunPython(convert_pages, reverse_code=migrations.RunPython.noop),
        migrations.RunPython(convert_revisions, reverse_code=migrations.RunPython.noop),
    ]
```

Note that the migration finds the block's data by the key used in the Stream Field's definition. Pages and blocks need to be consistent with the keys they use for the same blocks.
