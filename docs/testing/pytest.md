# Pytest (Python Unit Tests)

Pytest runs Python unit tests for Django views, helpers, models, middleware, and more. It also runs redirect validation tests.

## Docker

We manage our local docker environment with docker compose and Make. All you need to do here is run:

    make test

If you don't have Make you can run `docker compose run test`.

If you'd like to run only a subset of the tests or only one of the test commands you can accomplish that with a command like the following:

    docker compose run test pytest bedrock/legal

This example will run only the unit tests for the `legal` app in bedrock. You can substitute `pytest bedrock/legal` with most any shell command you'd like and it will run in the Docker container and show you the output. You can also run `bash` to get an interactive shell in the container which you can then use to run any commands you'd like and inspect the file system:

    docker compose run test bash

## Direct (uv)

If you followed the direct installation instructions, make sure the project's virtualenv is activated (`source .venv/bin/activate`). Then run the tests with:

=== "Bedrock"
    ```
    pytest lib bedrock
    ```
=== "Springfield"
    ```
    pytest lib springfield
    ```

To test a single app, specify the app by name in the command above. e.g.:

=== "Bedrock"
    ```
    pytest bedrock/legal
    ```
=== "Springfield"
    ```
    pytest springfield/firefox
    ```

## PostgreSQL in CI

!!! bedrock "Bedrock Only"
    Bedrock's `Unit tests` workflow runs the Python unit tests against SQLite and, when enabled, PostgreSQL.

PostgreSQL runs automatically on `main` and in the merge queue. On a pull request it is opt-in: add `[ci:postgres]` to the pull request description and the PostgreSQL suite runs as well. Without the marker the PostgreSQL step is skipped and only the SQLite suite runs.

| Event | PostgreSQL suite |
|-------|------------------|
| Push to `main` | Runs |
| Merge queue (`merge_group`) | Runs |
| Pull request with `[ci:postgres]` in the description | Runs |
| Pull request without the marker | Skipped (SQLite still runs) |

Each run prints the database backend it is actually using before migrating, and fails if it does not match:

    Database backend check: expected=postgresql actual=postgresql host=db port=5432 name=postgres
    Database backend check: OK

Adding the marker to an existing description does not by itself start a new workflow run. The workflow uses the default `pull_request` activity types (`opened`, `synchronize`, `reopened`), and editing a description fires `edited`, which is not one of them. Push a commit after adding `[ci:postgres]` so the condition is evaluated again.

This PostgreSQL CI setup was introduced in Bedrock [#17384](https://github.com/mozilla/bedrock/pull/17384).
