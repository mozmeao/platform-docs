# Running Locally

This guide covers how to run a local development server after you've completed [installation](install.md).

## Start the server

!!! info
    Regardless of whether you run the site via Docker or directly on your machine with pyenv, the URL of the site is `http://localhost:8000` - ``not`` `8080`

### Docker

You can run the `make run` script mentioned in the installation docs, or use docker compose directly:

    docker compose up app assets

### Pyenv

To make the server run, make sure your virtualenv is activated, and then run the server:

    npm start

Wait for the server to start up and then browse to <http://localhost:8000>

Congratulations, you should now have your own copy running locally!

## Dev Mode

The above instructions will get you a server running locally in dev mode (`DEV=True` and `DEBUG=True`). This configures the site for local development with several differences from production.

- **[Feature switches](../development/feature-switches.md)** are toggled on by default.
- **[All locales are active](../l10n/configuration.md#fluent-file-activation)**, including languages not yet ready for production.
- **Draft content is visible** for [Wagtail CMS](../cms/index.md) and release notes.
- **[Unoptimized static files](../development/assets.md)** - CSS and JS are served without hashing or minification for easier debugging.
- **Error pages** display diagnostic information.
- [Legal docs](../integrations/legal-docs.md) pull from `main` instead of `prod`.
- Insecure HTTP requests are allowed (production forces HTTPS).
- Connect to staging versions of [external services](../integrations/index.md) rather than production:

    | Service | Dev Mode Endpoint |
    |---------|-------------------|
    | Mozilla accounts | `accounts.stage.mozaws.net` |
    | Mozilla VPN | `stage.guardian.nonprod.cloudops.mozgcp.net` |
    | Firefox Relay | `stage.fxprivaterelay.nonprod.cloudops.mozgcp.net` |

    This allows testing account flows and subscriptions without affecting production systems.

!!! info
    The `DEV` and `DEBUG` settings control different behaviors. `DEBUG=True` enables Django's debug mode (detailed error pages, console email, unoptimized static files). `DEV=True` enables development-like deployment behaviors (staging endpoints, all locales, draft content visible). For local development, both are typically set to `True`.

## Prod Mode

To run the site in production mode, edit your `.env` file to set `DEBUG=False` and/or `DEV=False`, then follow the commands below for your installation method.

Running in prod mode is useful to test:

- **Static assets** - verifies files are referenced correctly with hashed filenames and CDN paths.
- **Error pages** - custom 404/500 pages only render when `DEBUG=False`.
- **Content Security Policy** - production enforces stricter CSP headers.
- **Feature switches** - verify there are not regressions with switches disabled.
- **Production services** - connects to live Mozilla accounts, VPN, and Relay endpoints.

!!! tip
    Set `DEV=True` with `DEBUG=False` if you want production-like static asset handling but still want all feature switches enabled and all locales active (similar to www-dev.allizom.org).

### Docker

``` bash
make run-prod
```

This will run the latest image using your local files and templates, but not your local static assets. If you need an updated image, run `make pull`.

If you need to include the changes you've made to your local static files (images, css, js, etc.) then you have to build the image first:

``` bash
make build-prod run-prod
```

### Pyenv

If you have `DEBUG=False` you will have to run `./manage.py collectstatic --noinput` any time you make changes to any local static files (images, css, js, etc.). That includes the first time you start the server. This will  compile static files and bring the server up:

```bash
npm run build && ./manage.py collectstatic --noinput && ./manage.py runserver
```

You can rebuild the static files at any time with:

```bash
./manage.py collectstatic --noinput
```