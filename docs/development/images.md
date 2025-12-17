# Working with Images

## Optimizing Images

Images can take a long time to load and eat up a lot of bandwidth. Always take care to optimize images before uploading them to the site. There are a number of great online resources available to help with this:

- <https://tinypng.com/>
- <https://jakearchibald.github.io/svgomg/>
- <https://squoosh.app/>

We also bundle the [svgo package](https://www.npmjs.com/package/svgo) as a dev dependency, which can optimize SVGs on the command line.

## Embedding Images

Images should be included on pages using one of the following helper functions.

### Primary image helpers

The following image helpers support the most common features and use cases you may encounter when coding pages:

#### static()

For a simple image, the `static()` function is used to generate the image URL. For example:

``` html
<img src="{{ static('img/firefox/new/firefox-wordmark-logo.svg') }}" alt="Firefox">
```

will output an image:

``` html
<img src="/media/img/firefox/new/firefox-wordmark-logo.svg" alt="Firefox">
```

#### resp_img()

For [responsive images](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images), where we want to specify multiple different image sizes and let the browser select which is best to use.

The example below shows how to serve an appropriately sized, responsive red panda image:

``` python
resp_img(
    url="img/panda-500.png",
    srcset={
        "img/panda-500.png": "500w",
        "img/panda-750.png": "750w",
        "img/panda-1000.png": "1000w",
    },
    sizes={
        "(min-width: 1000px)": "calc(50vw - 200px)",
        "default": "calc(100vw - 50px)",
    },
)
```

This would output:

``` html
<img src="/media/img/panda-500.png"
     srcset="/media/img/panda-500.png 500w,/media/img/panda-750.png 750w,/media/img/panda-1000.png 1000w"
     sizes="(min-width: 1000px) calc(50vw - 200px),calc(100vw - 50px)" alt="">'
```

In the above example we specified the available image sources using the `srcset` parameter. We then used `sizes` to say:

- When the viewport is greater than `1000px` wide, the panda image will take up roughly half of the page width.
- When the viewport is less than `1000px` wide, the panda image will take up roughly full page width.

The default image `src` is what we specified using the `url` param. This is also what older browsers will fall back to using. Modern browsers will instead pick the best source option from `srcset` (based on both the estimated image size and screen resolution) to satisfy the condition met in `sizes`.

!!! note
    The value `default` in the second `sizes` entry above should be used when you want to omit a media query. This makes it possible to provide a fallback size when no other media queries match.

Another example might be to serve a high resolution alternative for a fixed size image:

``` python
resp_img(url="img/panda.png", srcset={"img/panda-high-res.png": "2x"})
```

This would output:

``` html
<img src="/media/img/panda.png" srcset="/media/img/panda-high-res.png 2x" alt="">
```

Here we don't need a `sizes` attribute, since the panda image is fixed in size and small enough that it won't need to resize along with the browser window. Instead the `srcset` image includes an alternate high resolution source URL, along with a pixel density descriptor. This can then be used to say:

- When a browser specifies a device pixel ratio of `2x` or greater, use `panda-high-res.png`.
- When a browser specifies a device pixel ration of less than `2x`, use `panda.png`.

The `resp_img()` helper also supports localized images by setting the `'l10n'` parameter to `True``:

``` python
resp_img(
    url="img/panda-500.png",
    srcset={
        "img/panda-500.png": "500w",
        "img/panda-750.png": "750w",
        "img/panda-1000.png": "1000w",
    },
    sizes={
        "(min-width: 1000px)": "calc(50vw - 200px)",
        "default": "calc(100vw - 50px)",
    },
    optional_attributes={"l10n": True},
)
```

This would output (assuming `de` was your locale):

``` html
<img src="/media/img/l10n/de/panda-500.png"
     srcset="/media/img/l10n/de/panda-500.png 500w,/media/img/l10n/de/panda-750.png 750w,/media/img/l10n/de/panda-1000.png 1000w"
     sizes="(min-width: 1000px) calc(50vw - 200px),calc(100vw - 50px)" alt="">'
```

Finally, you can also specify any other additional attributes you might need using `optional_attributes`:

``` python
resp_img(
    url="img/panda-500.png",
    srcset={
        "img/panda-500.png": "500w",
        "img/panda-750.png": "750w",
        "img/panda-1000.png": "1000w",
    },
    sizes={
        "(min-width: 1000px)": "calc(50vw - 200px)",
        "default": "calc(100vw - 50px)",
    },
    optional_attributes={
        "alt": "Red Panda",
        "class": "panda-hero",
        "height": "500",
        "l10n": True,
        "loading": "lazy",
        "width": "500",
    },
)
```

#### picture()

For [responsive images](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images), where we want to serve different images, or image types, to suit different display sizes.

The example below shows how to serve a different image for desktop and mobile sizes screens:

``` python
picture(
    url="img/panda-mobile.png",
    sources=[
        {"media": "(max-width: 799px)", "srcset": {"img/panda-mobile.png": "default", 'width' : '160', 'height' : '320'}},
        {"media": "(min-width: 800px)", "srcset": {"img/panda-desktop.png": "default", 'width' : '640', 'height' : '1280'}},
    ],
)
```

This would output:

``` html
<picture>
    <source media="(max-width: 799px)" srcset="/media/img/panda-mobile.png" width="160" height="320">
    <source media="(min-width: 800px)" srcset="/media/img/panda-desktop.png" width="640" height="1280">
    <img src="/media/img/panda-mobile.png" alt="">
</picture>
```

In the above example, the default image `src` is what we specified using the `url` param. This is also what older browsers will fall back to using. We then used the `sources` parameter to specify one or more alternate image `<source>` elements, which modern browsers can take advantage of. For each `<source>`, `media` lets us specify a media query as a condition for when to load an image, and `srcset` lets us specify one or more sizes for each image. Each `srcset` also takes optional parameters for `height` and `width`. Defining height and width helps the Browser reserve space for the image and avoid content shifting around on the page. If the image will not change dimensions, these can be defined in the `optional_attributes` for the entire element instead of separately like this.

!!! note
    The value `default` in the `srcset` entry above should be used when you want to omit a descriptor. In this example we only have one entry in `srcset` (meaning it will be chosen immediately should the media query be satisfied), hence we omit a descriptor value.

A more complex example might be when we want to load responsively sized, animated gifs, but also offer still images for users who set `(prefers-reduced-motion: reduce)`:

``` python
picture(
    url="img/dancing-panda-500.gif",
    sources=[
        {
            "media": "(prefers-reduced-motion: reduce)",
            "srcset": {
                "img/sleeping-panda-500.png": "500w",
                "img/sleepinng-panda-750.png": "750w",
                "img/sleeping-panda-1000.png": "1000w",
            },
            "sizes": {
                "(min-width: 1000px)": "calc(50vw - 200px)",
                "default": "calc(100vw - 50px)",
            },
        },
        {
            "media": "(prefers-reduced-motion: no-preference)",
            "srcset": {
                "img/dancing-panda-500.gif": "500w",
                "img/dancing-panda-750.gif": "750w",
                "img/dancing-panda-1000.gif": "1000w",
            },
            "sizes": {
                "(min-width: 1000px)": "calc(50vw - 200px)",
                "default": "calc(100vw - 50px)",
            },
        },
    ],
)
```

This would output:

``` html
<picture>
    <source media="(prefers-reduced-motion: reduce)"
            srcset="/media/img/sleeping-panda-500.png 500w,/media/img/sleeping-panda-750.png 750w,/media/img/sleeping-panda-1000.png 1000w"
            sizes="(min-width: 1000px) calc(50vw - 200px),calc(100vw - 50px)">
    <source media="(prefers-reduced-motion: no-preference)"
            srcset="/media/img/dancing-panda-500.gif 500w,/media/img/dancing-panda-750.gif 750w,/media/img/dancing-panda-1000.gif 1000w"
            sizes="(min-width: 1000px) calc(50vw - 200px),calc(100vw - 50px)">
    <img src="/media/img/dancing-panda-500.gif" alt="">
</picture>
```

In the above example we would default to loading animated gifs, but if a user agent specified `(prefers-reduced-motion: reduce)` then the browser would load static png files instead. Multiple image sizes are also supported for each `<source>` using `srcset` and `sizes`.

Another type of use case might be to serve different image formats, so capable browsers can take advantage of more efficient encoding:

``` python
picture(
    url="img/red-panda.png",
    sources=[{"type": "image/webp", "srcset": {"img/red-panda.webp": "default"}}],
)
```

This would output:

``` html
<picture>
    <source type="image/webp" srcset="/media/img/red-panda.webp">
    <img src="/media/img/red-panda.png" alt="">
</picture>
```

In the above example we use `sources` to specify an alternate image with a `type` attribute of `image/webp`. This lets browsers that support WebP to download `red-panda.webp`, whilst older browsers would download `red-panda.png`.

Like `resp_img()`, the `picture()` helper also supports L10n images and other useful attributes via the `optional_attributes` parameter:

``` python
picture(
    url="img/panda-mobile.png",
    sources=[
        {"media": "(max-width: 799px)", "srcset": {"img/panda-mobile.png": "default"}},
        {"media": "(min-width: 800px)", "srcset": {"img/panda-desktop.png": "default"}},
    ],
    optional_attributes={
        "alt": "Red Panda",
        "class": "panda-hero",
        "l10n": True,
        "loading": "lazy",
    },
)
```

### Which image helper should you use?

This is a good question. The answer depends entirely on the image in question. A good rule of thumb is as follows:

- Is the image a vector format (e.g. `.svg`)?

     -  If yes, then for most cases you can simply use `static()`.

- Is the image a raster format (e.g. `.png` or `.jpg`)?

    - Is the same image displayed on both large and small viewports?
    - Does the image need to scale as the browser resizes?
    - If yes to both, then use `resp_img()` with both `srcset` and `sizes`.

-   Is the image fixed in size (non-responsive)? Do you need to serve a high resolution version? If yes to both, then use `resp_img()` with just `srcset`.

- Does the source image need to change depending on a media query (e.g serve a different image on both desktop and mobile)? If yes, then use `picture()` with `media` and `srcset`.

- Is the image format only supported in certain browsers? Do you need to provide a fallback? If yes to both, then use `picture()` with `type` and `srcset`.

### Secondary image helpers

The following image helpers are less commonly used, but exist to support more specific use cases. Some are also encapsulated as features inside inside of primary helpers, such as `l1n_img()`.

#### l10n_img()

Images that have translatable text can be handled with `l10n_img()`:

``` html
<img src="{{ l10n_img('firefox/os/have-it-all/messages.jpg') }}">
```

The images referenced by `l10n_img()` must exist in `media/img/l10n/`, so for above example, the images could include `media/img/l10n/en-US/firefox/os/have-it-all/messages.jpg` and `media/img/l10n/es-ES/firefox/os/have-it-all/messages.jpg`.

#### qrcode()

This is a helper function that will output SVG data for a QR Code at the spot in the template where it is called. It caches the results to the `data/qrcode_cache` directory, so it only generates the SVG data one time per data and box_size combination.

``` python
qrcode("https://accounts.firefox.com", 30)
```

The first argument is the data you'd like to encode in the QR Code (usually a URL), and the second is the "box size". It's a parameter that tells the generator how large to set the height and width parameters on the XML SVG tag, the units of which are "mm". This can be overriden with CSS so you may not need to use it at all. The `box_size` parameter is optional.
