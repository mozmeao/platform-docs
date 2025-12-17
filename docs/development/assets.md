# Asset Management and Bundling (Webpack)

Both codebases use [Webpack](https://webpack.js.org/) to manage front-end asset processing and bundling. This includes processing and minifying JavaScript and SCSS/CSS bundles, as well as managing static assets such as images, fonts, and other common file types.

When developing you can start Webpack by running `make run` when using Docker, or `npm start` when running things locally.

Once Webpack has finished compiling, a local development server will be available at [localhost:8000](http://localhost:8000/). When Webpack detects changes to a JS/SCSS file, it will automatically recompile the bundle and then refresh any page running locally in the browser.

## Webpack Configuration

We have two main Webpack config files in the root directory:

The `webpack.static.config.js` file is responsible for copying static assets, such as images and fonts, from the `/media/` directory over to the `/assets/` directory. This is required so Django can serve them correctly.

The `webpack.config.js` file is responsible for processing JS and SCSS files in the `/media/` directory and compiling them into the `/assets/` directory. This config file also starts a local development server and watches for file changes.

We use two separate config files to keep responsibilities clearly defined, and to make the configs both shorter and easier to follow.

!!! note
    Because of the large number of files used in Bedrock and (to a lesser extent) Springfield, only JS and SCSS files managed by `webpack.config.js` are watched for changes when in development mode. This helps save on memory consumption. The implication of this is that files handled by `webpack.static.config.js` are only copied over when Webpack first runs. If you update an image for example, then you will need to stop and restart Webpack to pick up the change. This is not true for JS and SCSS files, which will be watched for change automatically.

## Asset Bundling

Asset bundles for both JS and SCSS are defined in `./media/static-bundles.json`. This is the file where you can define the bundle names that will get used in page templates. For example, a CSS bundle can be defined as:

``` json
"css": [
    {
        "files": [
            "css/firefox/new/basic/download.scss"
        ],
        "name": "firefox_new_download"
    }
]
```

Which can then be referenced in a page template using:

``` jinja
{{ css_bundle('firefox_new_download') }}
```

A JS bundle can be defied as:

``` json
"js": [
    {
        "files": [
            "protocol/js/protocol-modal.js",
            "js/firefox/new/basic/download.js"
        ],
        "name": "firefox_new_download"
    }
]
```

Which can then be referenced in a page template using:

``` jinja
{{ js_bundle('firefox_new_download') }}
```

Once you define a bundle in `static-bundles.json`, the `webpack.config.js` file will use these as entrypoints for compiling JS and CSS and watching for changes.

## Using Large Assets

We don't want to (and if large enough GitHub won't let us) commit large files to the repo. Files such as large PDFs or very-high-res JPG files (e.g. leadership team photos), or videos are not well-tracked in git and will make every checkout after they're added slower and this diffs less useful. So we have another domain at which we upload these files: assets.mozilla.net

This domain is  an AWS S3 bucket with a CloudFront CDN in front of it. It is highly available and fast. We've simplified adding files to this domain by using [git-lfs](https://git-lfs.github.com/). You install git-lfs, clone our [assets.mozilla.net repo](https://github.com/mozmeao/assets.mozilla.net), and then add and commit files under the `assets` directory there as usual. Open a pull request, and once it's merged it will be automatically uploaded to the S3 bucket and be available on the domain.

For example, if you add a file to the repo under `assets/pdf/the-dude-abides.pdf`, it will be available as <https://assets.mozilla.net/pdf/the-dude-abides.pdf>. Once that is done you can link to that URL from the codebase as you would any other URL.

*[CDN]: Content Delivery Network
