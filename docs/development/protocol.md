# Working with Protocol Design System

!!! bedrock "Bedrock Only"
    Springfield will move to the Flare design system with the release of the new Firefox Brand. It is documented in the [springfield pattern library](https://github.com/mozmeao/springfield/tree/97cd5371754e32081e5bdc50a4bb0a437a222870/springfield/cms/templates/pattern-library/docs).

Bedrock and Springfield use the [Protocol Design System](https://protocol.mozilla.org/) to quickly produce consistent, stable components. There are different methods -- depending on the component -- to import a Protocol component into our codebase.

One method involves two steps:

1. Adding the [correct markup](#styles-and-components) or importing the [appropriate macro](#macros) to the page's HTML file.
2. Importing the necessary Protocol styles to a page's SCSS file.

The other method is to [import CSS bundles](#import-css-bundles) onto the HTML file. However, this only works for certain components, which are listed below in the respective section.

## Styles and Components

The base templates have global styles from Protocol that apply to every page. When we need to extend these styles on a page-specific basis, we set up Protocol in a page-specific SCSS file.

For example, on a Firefox product page, we might want to use Firefox logos or wordmarks that do not exist on every page.

To do this, we add Protocol `mzp-` classes to the HTML:

``` html
// bedrock/bedrock/firefox/templates/firefox/{specific-page}.html

<div class="mzp-c-wordmark mzp-t-wordmark-md mzp-t-product-firefox">
    Firefox Browser
</div>
```

Then we need to include those Protocol styles in the page's SCSS file:

``` css
/* bedrock/media/css/firefox/{specific-page}.scss */

/* if we need to use protocol images, we need to set the $image-path variable */
$image-path: '/media/protocol/img';
/* mozilla is the default theme, so if we want a different one, we need to set the $brand-theme variable */
$brand-theme: 'firefox';

/* the lib import is always essential: it provides access to tokens, functions, mixins, and theming */
@import '~@mozilla-protocol/core/protocol/css/includes/lib';
/* then you add whatever specific protocol styling you need */
@import '~@mozilla-protocol/core/protocol/css/components/logos/wordmark';
@import '~@mozilla-protocol/core/protocol/css/components/logos/wordmark-product-firefox';
```

!!! note
    If you create a new SCSS file for a page, you will have to include it in that page's CSS bundle by updating [static-bundles.json](assets.md#asset-bundling) file.

## Macros

The team has created several [Jinja macros](https://jinja.palletsprojects.com/en/3.1.x/templates/?=macros#macros) out of Protocol components to simplify the usage of components housing larger blocks of code (i.e. Billboard). The code housing the custom macros can be found in our [protocol macros file](https://github.com/mozilla/bedrock/blob/main/bedrock/base/templates/macros-protocol.html). These Jinja macros include parameters that are simple to define and customize based on how the component should look like on a given page.

To use these macros in files, we import a macro to the page's HTML code and call it with the desired arguments, instead of manually adding Protocol markup. We can import multiple macros in a comma-separated fashion, ending the import with `with context`:

``` html
// bedrock/bedrock/firefox/templates/firefox/{specific-page}.html

{% from "macros-protocol.html" import billboard with context %}

{{ billboard(
    title='This is Firefox.',
    ga_title='This is Firefox',
    desc='Firefox is an awesome web browser.',
    link_cta='Click here to install',
    link_url=url('firefox.new')
  )}}
```

Because not all component styles are global, we still have to import the page-specific Protocol styles in SCSS:

``` css
/* bedrock/media/css/firefox/{specific-page}.scss */

$brand-theme: 'firefox';

@import '~@mozilla-protocol/core/protocol/css/includes/lib';
@import '~@mozilla-protocol/core/protocol/css/components/billboard';
```

## Import CSS Bundles

We created pre-built CSS bundles to be used for some components due to their frequency of use. This method only requires an import into the HTML template. Since it's a separate CSS bundle, we don't need to import that component in the respective page CSS. The CSS bundle import only works for the following components:

- Split
- Card
- Picto
- Callout
- Article
- Newsletter form
- Emphasis box

Include a CSS bundle in the template's `page_css` block along with any other page-specific bundles, like so:

``` html
{% block page_css %}
    {{ css_bundle('protocol-split') }}
    {{ css_bundle('protocol-card') }}
    {{ css_bundle('page-specific-bundle') }}
{% endblock %}
```
