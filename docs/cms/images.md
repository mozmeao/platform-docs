# CMS Images

## Using editor-uploaded images in templates

Images may be uploaded into Wagtail's Image library and then included in content-managed surfaces that have fields/spaces for images.

CMS-uploaded images are stored in the same media bucket that stored-in-repo/hard-coded images get put in, and coexist alongside them, being namespaced into a directory called `custom-media/`.

If a surface uses an image, images use must be made explicit via template markup --- we need to state both _where_ and _how_ an image will be used in the template, including specifying the size the image will be. This is because --- by design and by default --- Wagtail can generate any size version that the template mentions by providing a "filter spec" e.g.

``` jinja
{% set the_image=image(page.product_image, "width-1200") %}
<img class="some-class" src="{{ the_image.url }})"/>
```

(More examples are available in the [Wagtail Images docs](https://docs.wagtail.org/en/stable/topics/images.html).)

## Allowed filter specs

When including an image in a template we ONLY use pre-generated filter specs. **Using alternative ones will trigger an error in production.**

### Width-based (preserve aspect ratio)

Widths from 2400px down to 200px in 200px steps, plus 100px:

- `width-100`
- `width-200`
- `width-400`
- `width-600`
- `width-800`
- `width-1000`
- `width-1200`
- `width-1400`
- `width-1600`
- `width-1800`
- `width-2000`
- `width-2200`
- `width-2400`

### Aspect ratio crops (fill)

!!! bedrock "Bedrock Only"
    These aspect ratio renditions are only available in Bedrock. Springfield uses only the width-based renditions listed above.

For each supported aspect ratio, cropped renditions are available at 13 width steps. The format is `fill-{width}x{height}`.

| Ratio | Example specs |
|-------|---------------|
| **2:1** (wide landscape) | `fill-100x50`, `fill-200x100`, `fill-400x200`, ... `fill-2400x1200` |
| **1:1** (square) | `fill-100x100`, `fill-200x200`, `fill-400x400`, ... `fill-2400x2400` |
| **5:4** (landscape) | `fill-100x80`, `fill-200x160`, `fill-400x320`, ... `fill-2400x1920` |
| **22:9** (ultra-wide) | `fill-100x41`, `fill-200x82`, `fill-400x164`, ... `fill-2400x982` |
| **4:5** (portrait) | `fill-100x125`, `fill-200x250`, `fill-400x500`, ... `fill-2400x3000` |
| **2:3** (tall portrait) | `fill-100x150`, `fill-200x300`, `fill-400x600`, ... `fill-2400x3600` |

Each ratio has 13 width steps: 100, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400.

## Why are we limiting filter-specs to that set?

In a line: to balance infrastructure security constraints with site flexiblity, we have to pre-generate a known set of renditions.

Normally, if that `product_image` is not already available in `1024x1024`, Wagtail will resize the original image to suit, on the fly, and store this "rendition" (a resized version, basically) in the cloud bucket. It will also add a reference to the database so that Wagtail knows that the rendition already exists.

In production, the "Web" deployment has **read-only** access to the DB and to the cloud storage, so it will not be able to generate new renditions on the fly. Instead, we pre-generate those renditions when the image is saved.

This approach will not be a problem if we stick to image filter-specs from the 'approved' list. Note that extending the list of filter-specs is possible, if we need to.

## I've downloaded a fresh DB and the images are missing

That's expected: the images don't live in the DB, only references to them live there. CMS images are destined for public consumption, and Dev, Stage and Prod all store their images in a publicly-accessible cloud bucket.

We have a tool to help you sync down the images from the relevant bucket.

By default, the sqlite DB you can download to run Bedrock or Springfield locally is based on the data in Bedrock Dev or Springfield Dev. To get images from the cloud bucket for dev, run:

``` shell
./manage.py download_media_to_local
```

This will look at your local DB, find the image files that it says should be available locally, copy them down to your local machine, then trigger the versions/renditions of them that should also exist.

The command will only download images you don't already have locally. You can use the `--redownload` option to force a redownload of all images.

If you have a DB from Stage you can pass the `--environment=stage` option to get the images from the Stage bucket instead. Same goes for Production.
