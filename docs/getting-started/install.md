There are two primary methods of setting up Bedrock and Springfield for local development: **Docker** and **pyenv (direct install)**. 

Docker is the easiest and recommended way. Installing with pyenv directly onto your machine is also possible and may be preferred, particularly if you're doing frontend work.

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

Docker is the easiest and recommended way, but installing with pyenv directly onto your machine is also possible and may be preferred, particularly if you're doing frontend work, which is currently slower when using Docker.

## Pre-commit hooks

You should also install our git pre-commit hooks. These are checks that automatically run before a git commit is allowed. You don't have to do this in order to get the site running locally, but it's recommended to do before you start making contributions.

The projects uses the [pre-commit](https://pre-commit.com/) framework that makes managing git hooks easier across all contributors by ensuring everyone has the same ones set up.

Install the framework by running `pip install pre-commit`, then - ensuring you are in your project directory -run `pre-commit install` in your terminal, followed by `pre-commit install-hooks`. This will set up the hooks that are specified in `.precommit.yaml`

After that setup, whenever you try to make a commit, the 'hooks' will check/lint your Python, JS, and CSS files beforehand and report on problems that need to be fixed before the commit can be made. This will save you time waiting for the tests to run in our CI before noticing a linting error.

## Docker Installation

!!! note
    This method assumes you have [Docker installed for your platform](https://www.docker.com/). If not please do that now or skip to the [Pyenv Installation](#pyenv-installation) section.

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

## Pyenv (Direct) Installation

This method installs Python, dependencies, and runs the application directly on your machine using [pyenv](https://github.com/pyenv/pyenv) to manage Python versions and [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv) to isolate dependencies.

These instructions assume you have pip and Node.js installed. If you don't have ``pip`` installed (you probably do) you can install it with the instructions in [the pip docs](https://pip.pypa.io/en/stable/installing/).

The following assumes you are on MacOS, using `zsh` as your shell and [Homebrew](https://brew.sh/) as your package manager. If you are not, there are installation instructions for a variety of platforms and shells in the READMEs for the two pyenv projects.

### Install Python 3.13.x with pyenv

1. Install `pyenv` itself :

    ```
    brew install pyenv
    ```

2. Configure your shell to init `pyenv` on start - this is noted in the project's [own docs](https://github.com/pyenv/pyenv), in more detail, but omits that setting ``PYENV_ROOT`` and adding it to the path is needed:

    ```
    echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
    echo 'eval "$(pyenv init -)"' >> ~/.zshrc
    ```

3. Restart your login session for the changes to profile files to take effect - if you're not using `zsh`, the `pyenv` docs have other routes :

    ```
    zsh -l
    ```

4.  Install the latest Python 3.13.x (e.g. 3.13.3), then test it's there:

    ```
    pyenv install 3.13.3
    ```

    If you'd like to make Python 3.13 your default globally, you can do so with:

    ```
    pyenv global 3.13.3
    ```

    If you only want to make Python 3.13 available in the current shell, while you set up the Python virtualenv (below), you can do so with:

    ```
    pyenv shell 3.13.3
    ```

5.  Verify that you have the correct version of Python installed:

    ```
    python --version
    Python 3.13.3
    ```

### Install pyenv and create a virtualenv

1. Install `pyenv-virtualenv` :

    ```
    brew install pyenv-virtualenv
    ```

2. Configure your shell to init `pyenv-virtualenv` on start - again, this is noted in the `pyenv-virtualenv` project's [own documentation](https://github.com/pyenv/pyenv-virtualenv), in more detail. The following will slot in a command that will work as long as you have pyenv-virtualenv installed:

    ```
    echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
    ```

3.  Restart your login session for the changes to profile files to take effect :

    ```
    zsh -l
    ```

4.  Make a virtualenv we can use - the docs assume you call it `bedrock` or `springfield` but you can call it whatever you want :

    === "Bedrock"
        ```
        pyenv virtualenv 3.13.3 bedrock
        ```
    === "Springfield"
        ```
        pyenv virtualenv 3.13.3 springfield
        ```

### Use the virtualenv

1. Switch to the virtualenv - this is the command you will use any time you need this virtualenv :

    === "Bedrock"
        ```
        pyenv activate bedrock
        ```
    === "Springfield"
        ```
        pyenv activate springfield
        ```

2. Tip! If you'd like to auto activate the virtualenv when you cd into the directory, and deactivate it when you exit the directory, you can do so with :

    === "Bedrock"
        ```
        echo 'bedrock' > .python-version
        ```
    === "Springfield"
        ```
        echo 'springfield' > .python-version
        ```

3.  Securely upgrade pip :

    ```
    pip install --upgrade pip
    ```

4.  Install / update Python dependencies :

    ```
    make install-local-python-deps
    ```

!!! bug
    If you are on OSX and some of the compiled dependencies fails to compile, try explicitly setting the arch flags and try again. The following are relevant to Intel Macs only. If you're on Apple Silicon, 3.13.3 should 'just work':

    ``` bash
    $ export ARCHFLAGS="-arch i386 -arch x86_64"
    ```

    ``` bash
    $ make install-local-python-deps
    ```

    If you are on Linux, you may need at least the following packages or their equivalent for your distro:

        python3-dev libxslt-dev

### Download data and install node dependencies

**Download a fresh copy of the sqlite database** This contains product-details, security-advisories, credits, release notes, localizations, legal-docs etc. We also download the latest translations of site content in many languages:

    bin/bootstrap.sh

**Install the node dependencies to run the site**. This will only work if you already have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed:

    npm install

!!! note
    We ue npm to ensure that Node.js packages that get installed are the exact ones we meant (similar to pip hash checking mode for python). Refer to the [npm documentation](https://docs.npmjs.com/) for adding or upgrading Node.js dependencies.

!!! note
    As a convenience, there is a `make preflight` command which calls some of the commands above to bring your installed Python and NPM dependencies up to date and also fetches the latest DB containing the latest site content. This is a good thing to run after pulling in latest changes from the `main` branch.

    IMPORTANT: if you do not want to replace your local DB with a fresher one, use `make preflight -- --retain-db` instead.

    We also have an optional git hook that will alert you if `make preflight` needs to be run. You can install that with `make install-custom-git-hooks`.

## Shortcut

A shortcut for activating virtual envs in zsh or bash is ``. venv/bin/activate``. The dot is the same as ``source``.

There's a project called [pew](https://pypi.org/project/pew/) that provides a better interface for managing/activating virtual envs, so you can use that if you want. Also if you need help managing various versions of Python on your system, the [pyenv](https://github.com/pyenv/pyenv) project can help.

## Localization

Localization (or L10n) files were fetched by the ``bootstrap.sh`` command your ran earlier and are included in the docker images. If you need to update them or switch to a different repo or branch after changing settings you can run the following command:

    ./manage.py l10n_update

You can read more details about how to localize content in the [Localization documentation](../l10n/index.md).

*[CI]: Continuous Integration