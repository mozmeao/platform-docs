# Jasmine (Javascript Unit Tests)

[Jasmine](https://jasmine.github.io/index.html) unit/behavioral tests are used to test JavaScript code that runs in the browser. These tests are run against both Firefox and Chrome browsers via a GitHub action, which is triggered against all pull requests and commits to the main branch.

The test specs can be found in `./tests/unit/`.

## Running Jasmine tests

Jasmine and its dependencies are installed via npm and are included when you run `make preflight` to install the main dependencies.

``` bash
make preflight
```

Next, make sure you activate your virtual env.

=== "Bedrock"

    ``` bash
    pyenv activate bedrock
    ```

=== "Springfield"

    ``` bash
    pyenv activate springfield
    ```


You can then run the full suite of Jasmine tests with the following command:

``` bash
npm run test
```

This will also run all our front-end linters and formatting checks before running the Jasmine test suite. If you only want to run the tests themselves, you can run:

``` bash
npm run jasmine
```

## Writing Jasmine tests

See the [Jasmine](https://jasmine.github.io/index.html) documentation for tips on how to write JS behavioral or unit tests. We also use [Sinon](http://sinonjs.org/) for creating test spies, stubs and mocks.

## Debugging Jasmine tests

If you need to debug Jasmine tests, you can also run them interactively in the browser using the following command:

``` bash
npm run jasmine-serve
```
