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

## Pyenv

If you followed the pyenv installation instructions, make sure your virtualenv is activated. Then run the tests with:

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
