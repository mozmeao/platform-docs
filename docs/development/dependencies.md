# Managing Dependencies

## Python Dependencies

For Python we use [`uv`](https://docs.astral.sh/uv/). Dependencies are declared in `pyproject.toml`, and `uv.lock` pins the exact version and hashes of every package, including sub-dependencies:

- `[project] dependencies` lists the production dependencies.
- `[dependency-groups]` lists the `dev` tools.
- `[tool.uv]` sets `exclude-newer = "7 days"`, so uv won't pick packages uploaded in the last 7 days. The comment there explains how to exempt a single package for an urgent fix.

!!! bedrock "Bedrock Only"
    `[dependency-groups]` also has a `docs` group with the documentation tooling (`mkdocs-material`).

To add or upgrade a dependency, edit its pin in `pyproject.toml`, then update the lockfile:

``` shell
uv lock
```

This only re-resolves what changed. To refresh every package, including sub-dependencies, run:

``` shell
make compile-requirements
```

Commit `pyproject.toml` and `uv.lock` together. Please re-build your docker image and test it with `make build test` to be sure the change does not cause a regression.

Dependabot opens monthly pull requests that update `pyproject.toml` and `uv.lock` together.

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
