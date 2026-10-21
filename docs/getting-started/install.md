There are two primary methods of setting up Bedrock and Springfield for local development: **Docker** and **direct install with uv**.

Docker is the easiest and recommended way. Installing directly onto your machine with [uv](https://docs.astral.sh/uv/) is also possible and may be preferred, particularly if you're doing frontend work.

Whichever you choose, you'll start by getting the source code.

## Get the source code

The codebases live at <https://github.com/mozilla/bedrock/> and <https://github.com/mozmeao/springfield/>

Only Mozilla staff have write access to that repository; community contributors do not, so should instead make a fork of the repo to work from. You will still be able to make pull requests from your fork into `mozilla/bedrock` and `mozmeao/springfield`.

Get the source code:

=== "Bedrock"
    ``` bash
    # If you're a Mozilla staff member with write access to the repo
    $ git clone https://github.com/mozilla/bedrock.git

    # Or if you lack write access to the repo
    $ git clone https://github.com/YOUR_GITHUB_USERNAME_HERE/bedrock.git
    ```

=== "Springfield"
    ``` bash
    # If you're a Mozilla staff member with write access to the repo
    $ git clone https://github.com/mozmeao/springfield.git

    # Or if you lack write access to the repo
    $ git clone https://github.com/YOUR_GITHUB_USERNAME_HERE/springfield.git
    ```

Once the codebase is cloned, switch into it:

=== "Bedrock"

    ``` bash
    cd bedrock
    ```

=== "Springfield"

    ``` bash
    cd springfield
    ```

After these basic steps you can choose your install method below.

Docker is the easiest and recommended way, but installing directly onto your machine with uv is also possible and may be preferred, particularly if you're doing frontend work, which is currently slower when using Docker.

## Pre-commit hooks

You should also install our git pre-commit hooks. These are checks that automatically run before a git commit is allowed. You don't have to do this in order to get the site running locally, but it's recommended to do before you start making contributions.

The projects uses the [pre-commit](https://pre-commit.com/) framework that makes managing git hooks easier across all contributors by ensuring everyone has the same ones set up.

Install the framework by running `uv tool install pre-commit` (or `brew install pre-commit`). If uv warns that its tool directory isn't on your `PATH`, run `uv tool update-shell` and open a new terminal. Then - ensuring you are in your project directory - run `pre-commit install` in your terminal, followed by `pre-commit install-hooks`. This will set up the hooks that are specified in `.precommit.yaml`

After that setup, whenever you try to make a commit, the 'hooks' will check/lint your Python, JS, and CSS files beforehand and report on problems that need to be fixed before the commit can be made. This will save you time waiting for the tests to run in our CI before noticing a linting error.

## Docker Installation

!!! note
    This method assumes you have [Docker installed for your platform](https://www.docker.com/). If not please do that now or skip to the [Direct Installation](#direct-installation-with-uv) section.

This is the simplest way to get started developing. If you're on Linux or Mac (and possibly Windows 10 with the Linux subsystem) you can run a script that will pull our production and development docker images and start them:

    make clean run

!!! note
    You can start the server any other time with:

        make run

You should see a number of things happening, but when it's done it will output something saying that the server is running at [localhost:8000](http://localhost:8000/). Go to that URL in a browser and you should see the mozilla.org home page. In this mode the site will refresh itself when you make changes to any template or media file. Open your editor of choice and modify things and you should see those changes reflected in your browser.

!!! note
    It's a good idea to run `make pull` from time to time. This will pull down the latest Docker images from our repository ensuring that you have the latest dependencies installed among other things. If you see any strange errors after a `git pull` then `make pull` is a good thing to try for a quick fix.

If you don't have or want to use Make you can call the docker and compose commands directly

``` bash
docker compose pull
```

``` bash
[[ ! -f .env ]] && cp .env-dist .env
```

Then starting it all is:

``` bash
docker compose up app assets
```

All of this is handled by the `Makefile` script and called by Make if you follow the above directions. You **DO NOT** need to do both.

These directions pull and use the pre-built images that our deployment process has pushed to the [Docker Hub](https://hub.docker.com/u/mozorg/). If you need to add or change any dependencies for Python or Node then you'll need to build new images for local testing. You can do this by updating the requirements files and/or package.json file then running:

    make build

!!! bug
    **For Apple Silicon / M1 users**

    If you find that when you're building you hit issues compiling assets, try unchecking `Use Rosetta for x86_64/amd64 emulation on Apple Silicon` in the Docker Desktop settings.

**Asset bundles**

If you make a change to `media/static-bundles.json`, you'll need to restart Docker.

!!! bug
    Sometimes stopping Docker doesn't actually kill the images. To be safe, after stopping docker, run `docker ps` to ensure the containers were actually stopped. If they have not been stopped, you can force them by running `docker compose kill` to stop all containers, or `docker kill <container_name>` to stop a single container, e.g. `docker kill bedrock_app_1`.

## Direct Installation (with uv)

This method installs Python and the dependencies directly on your machine. [uv](https://docs.astral.sh/uv/) installs Python 3.13 if you don't have it, and keeps the project's dependencies in a virtual environment at `.venv` in the repo.

These instructions assume you have [Node.js](https://nodejs.org/) installed. They also assume you are on macOS with [Homebrew](https://brew.sh/). For other platforms, see the [uv installation docs](https://docs.astral.sh/uv/getting-started/installation/).

If you set up Bedrock or Springfield with pyenv before, see [Migrating from a pyenv virtualenv](#migrating-from-a-pyenv-virtualenv).

### Install uv

Install uv as a standalone tool, not into a project virtual environment:

```
brew install uv
```

### Create and activate the virtual environment

From the root of your Bedrock or Springfield checkout:

```
uv venv --python 3.13
source .venv/bin/activate
```

Activate `.venv` in every new shell before working on the project. Commands such as `./manage.py`, `npm start` and `pytest` use whichever `python` comes first on your `PATH`, so they only see the project's dependencies when `.venv` is active. To do this automatically, you can use [direnv](https://direnv.net/) with an `.envrc` containing `source .venv/bin/activate`, or let your editor activate it.

### Install Python dependencies

!!! springfield "Springfield Only"
    Springfield uses the compiled version of the PostgreSQL driver (`psycopg[c]`), which is built from source during the install. That build needs PostgreSQL's client library (`libpq`) and its `pg_config` program on your `PATH`, even though the local database is SQLite. You don't need a PostgreSQL server. If `pg_config --version` already works in your terminal, you're set. Otherwise, install the client library and put it on your `PATH` (Homebrew doesn't add it automatically, because it would conflict with a PostgreSQL install):

    ```
    brew install libpq
    echo 'export PATH="$(brew --prefix libpq)/bin:$PATH"' >> ~/.zshrc
    ```

    Then open a new terminal. On Linux, install your distro's `libpq-dev` package instead.

```
make install-local-python-deps
```

This installs exactly the versions pinned in `uv.lock`, including the development tools. If no virtual environment is active, it creates and fills `.venv` and tells you to activate it.

!!! bedrock "Bedrock Only"
    This also installs the docs tooling (`mkdocs-material`) from the `docs` dependency group. To install only the docs tooling, run `make docs-setup`.

!!! bug
    If you are on Linux, you may need at least the following packages or their equivalent for your distro:

        python3-dev libxslt-dev

### Download data and install node dependencies

**Download a fresh copy of the sqlite database** This contains product-details, security-advisories, credits, release notes, localizations, legal-docs etc. We also download the latest translations of site content in many languages:

    bin/bootstrap.sh

**Install the node dependencies to run the site**. This will only work if you already have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed:

    npm install

!!! note
    We ue npm to ensure that Node.js packages that get installed are the exact ones we meant (similar to the hashes uv checks from `uv.lock` for Python). Refer to the [npm documentation](https://docs.npmjs.com/) for adding or upgrading Node.js dependencies.

!!! note
    As a convenience, there is a `make preflight` command which calls some of the commands above to bring your installed Python and NPM dependencies up to date and also fetches the latest DB containing the latest site content. This is a good thing to run after pulling in latest changes from the `main` branch.

    IMPORTANT: if you do not want to replace your local DB with a fresher one, use `make preflight -- --retain-db` instead.

    We also have an optional git hook that will alert you if `make preflight` needs to be run. You can install that with `make install-custom-git-hooks`.

### Migrating from a pyenv virtualenv

If you previously set up Bedrock or Springfield with pyenv and pyenv-virtualenv, switch to the setup above once, in each checkout:

```
pyenv deactivate                 # or open a new shell
rm .python-version               # only if it names your pyenv virtualenv, e.g. `bedrock` or `springfield`
uv venv --python 3.13
source .venv/bin/activate
make preflight -- --retain-db
```

Then:

* If you installed `uv` inside an old pyenv virtualenv, run `pip uninstall uv` in that virtualenv, then `pyenv rehash`. Otherwise pyenv's `uv` shim can take precedence over the standalone `uv` and fail outside that virtualenv.
* Point your editor's Python interpreter at `.venv/bin/python`.
* Once everything works, you can delete the old virtualenv with `pyenv virtualenv-delete bedrock` (or `springfield`).
* Optional: if you don't use pyenv for anything else, remove the lines the old setup added to your `~/.zshrc`:

    ```
    export PYENV_ROOT="$HOME/.pyenv"
    export PATH="$PYENV_ROOT/bin:$PATH"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
    ```

    Then uninstall pyenv and open a new terminal:

    ```
    brew uninstall pyenv-virtualenv pyenv
    ```

A `.python-version` that names a pyenv virtualenv breaks uv, because uv reads that file as a Python version. In these repos the name also matches the package directory (`bedrock/` or `springfield/`), so uv fails with `No interpreter found in directory`.

## Shortcut

A shortcut for activating the virtual env in zsh or bash is ``. .venv/bin/activate``. The dot is the same as ``source``.

You can also run a single command in the project's environment without activating it, by prefixing it with ``uv run``, e.g. ``uv run pytest``.

## Localization

Localization (or L10n) files were fetched by the ``bootstrap.sh`` command your ran earlier and are included in the docker images. If you need to update them or switch to a different repo or branch after changing settings you can run the following command:

    ./manage.py l10n_update

You can read more details about how to localize content in the [Localization documentation](../l10n/index.md).

*[CI]: Continuous Integration