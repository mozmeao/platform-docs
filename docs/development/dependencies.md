# Managing Dependencies

## Python Dependencies

For Python we use [`uv`](https://github.com/astral-sh/uv) in `pip` mode to manage dependencies expressed in our [requirements files](https://github.com/mozilla/bedrock/tree/main/requirements). Requirements-file compilation is wrapped up in Makefile commands, to ensure we use it consistently.

If you add a new Python dependency (eg to `requirements/prod.in` or `requirements/dev.in`) you can generate a pinned and hash-marked addition to our requirements files by running:

``` shell
make compile-requirements
```

and committing any changes that are made. Please re-build your docker image and test it with `make build test` to be sure the dependency does not cause a regression.

Similarly, if you *upgrade* a pinned dependency in an `*.in` file, run `make compile-requirements` then rebuild, test and commit the results

To check for stale Python dependencies (basically `pip list -o` but in the Docker container):

``` shell
make check-requirements
```

## Node Dependencies

For Node packages we use [NPM](https://docs.npmjs.com/cli/v8/commands/npm-install), which should already be installed alongside [Node.js](https://nodejs.org/).

## Mozilla Front-end Dependencies

Our team maintains a few dependencies that we serve on Bedrock and Springfield's front-ends.

- [@mozilla-protocol/core](https://www.npmjs.com/package/@mozilla-protocol/core): Bedrock's primary design system
- [@mozmeao/cookie-helper](https://www.npmjs.com/package/@mozmeao/cookie-helper): A complete cookies reader/writer framework
- [@mozmeao/dnt-helper](https://github.com/mozmeao/dnt-helper): Do Not Track (DNT) helper
- [@mozmeao/trafficcop](https://www.npmjs.com/package/@mozmeao/trafficcop): Used for A/B testing page variants

Because they are all published on NPM, install the packages and keep up-to-date with the latest version of each dependency by running an `npm install`. For further documentation on installing NPM packages, [check out the official documentation](https://docs.npmjs.com/cli/v6/commands/npm-install).

## Third-party Front-end Dependencies

Before adding a new npm module as a front-end production dependency, verify it meets these criteria:

- **License**: Must have a compatible open source license (MPL, MIT, BSD, etc.). Check the package's `package.json` or repository documentation.
- **Dependencies**: May not have more than 1 dependency. Check by reviewing the `dependencies` field in `package.json` or running `npm list --depth=1 <package-name>`.
- **File Size**: Evaluate the minified and gzipped size to ensure it's appropriate for the functionality we're using. Use tools like [Bundlephobia](https://bundlephobia.com/) to check package size and impact on bundle performance.
