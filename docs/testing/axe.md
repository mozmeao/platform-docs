# Axe (Accessibility Integration Tests)

[Axe](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md) tests are used to test for accessibility issues on key pages. These tests are not run as part of our CI deployment process as they can contain a lot of information, but instead run once per day via a GitHub action against dev.

Axe tests are run via Playwright as a subset of tests using the `@a11y` tag. Accessibility issues are reported in the GitHub action output, which can be downloaded and reviewed.

The axe spec files can be found in the `./tests/playwright/specs/a11y/` directory.

## Running Axe tests locally

To run the Axe tests locally, you can use the following command from the `./tests/playwright/` directory:

``` bash
npm run a11y-tests
```

## Test types

The Axe tests consist of two different test types:

1. **Full page scans** - Scans an entire page for accessibility issues
2. **Component scans** - Scans a specific element for issues (such as the main navigation and footer)

These tests can also be run at both desktop and mobile viewport sizes.

## Test results

Test results are output to the console, and any issues found will be created as HTML report files in the `./tests/playwright/test-results-a11y/` directory.

When run via the [GitHub action](https://github.com/mozilla/bedrock/actions/workflows/a11y_tests.yml), the reports are also output to the annotation logs for each test job.

## Axe rules

A list of all the Axe rules that are checked by the tests can be viewed in the [axe-core repo](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md).
