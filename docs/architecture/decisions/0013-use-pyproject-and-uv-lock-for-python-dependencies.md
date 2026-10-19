# 13. Use pyproject.toml and uv.lock for Python dependencies

Date: 2026-10-19

## Status

Accepted

## Context

Since ADR 0007, Bedrock and Springfield compiled `requirements/*.in` files into hashed `requirements/*.txt` files, latterly with `uv pip compile`. `dev.in` included the compiled `prod.txt`, so the files had to be compiled in a fixed order. Our Makefile handled that, but Dependabot did not: it produced partial updates, such as a new `prod.txt` without a matching `dev.txt`, or a changed `.txt` file without its `.in` file. As a result, using Dependabot for Python dependencies was not practical.

## Decision

We declare Python dependencies in `pyproject.toml` and lock them with uv in a single `uv.lock`:

* Production dependencies live in `[project] dependencies`. Development tools live in the `dev` dependency group, and in Bedrock the docs tooling lives in the `docs` group.
* `uv.lock` resolves all groups together, records hashes for every package and works across platforms.
* The 7-day supply-chain delay moved into `[tool.uv]` as `exclude-newer`, and Dependabot's `uv` ecosystem uses a matching 7-day cooldown.
* Local setup uses a uv-managed virtual environment (`.venv` in each repo) instead of pyenv-virtualenv.

## Consequences

* Dependabot can update Python dependencies, changing `pyproject.toml` and `uv.lock` in one pull request.
* uv is required for local development, and `make install-local-python-deps` no longer falls back to pip.
* Existing pyenv-virtualenv setups need a one-time migration (see the installation docs), because uv cannot read a `.python-version` that names a virtualenv.
* Dependabot's uv support is newer than its pip support, so its first runs should be checked to make sure prod and dev updates both change `pyproject.toml` and `uv.lock`.
