# Playwright (Integration Tests)

[Playwright](https://playwright.dev) integration tests are used to run end-to-end tests in a real browser environment. These tests are run automatically as part of our CI deployment process against dev, stage, and prod. Playwright tests are run against Firefox, Chromium, and Webkit headless browsers for cross-engine coverage.

The test specs can be found in `./tests/playwright/`.

!!! note
    New integration tests should be written using Playwright. The Selenium Internet Explorer tests continue to run for the time being, but can be retired in the future when the time is right.

## Installing Playwright

Playwright test dependencies are installed via NPM but are not included in the `make preflight` command along with the core dependencies. This is because the dependencies are not required to run the site, and also include several large binary files for each headless browser engine.

To install the Playwright dependencies, run the following command:

``` bash
cd tests/playwright && npm install && npm run install-deps
```

## Running the test suite

To run the full suite of tests (from the `/tests/playwright/` directory):

``` bash
npm run integration-tests
```

This will run all tests against three different headless browser engines (Firefox, Chromium, WebKit).

### Running specific tests

Tests are grouped using tags, such as `@mozorg`, `@firefox`, `@vpn`. To run only one group of tests, instead of the whole suite, you can use `--grep`:

``` bash
npx playwright test --grep @firefox
```

To run only a specific test file, such as `firefox-new.spec.js`, you can pass the filename:

``` bash
npx playwright test firefox-new
```

See the [Playwright CLI docs](https://playwright.dev/docs/test-cli) for more options when running and debugging tests.

### Specifying an environment

By default Playwright tests will run against `http://localhost:8000/`. Remember to have your development server running before starting the test suite locally.

You can also set `PLAYWRIGHT_BASE_URL` in your `.env` to point to a different environment, such as dev or stage. For example:

``` bash
PLAYWRIGHT_BASE_URL=https://dev.bedrock.nonprod.webservices.mozgcp.net
# or
PLAYWRIGHT_BASE_URL=https://dev.springfield.nonprod.webservices.mozgcp.net
```

## Writing tests

Playwright test spec files are found in the `./tests/playwright/specs/` directory.

See the Playwright docs for more examples on [how to write tests](https://playwright.dev/docs/writing-tests).

### Guidelines for writing integration tests

- Try and keep tests focused on user journeys and key functionality. For example, a test for the download page should focus on the download button, and not the footer or header.
- Test expected functionality from a **user perspective**. For example, if a user clicks a button, the test should check that the expected action occurs. Try to avoid testing implementation details, as these are both invisible to the user and likely to change more frequently.
- Keep tests organized and cleanly separated. Each page should have its own test spec file, and each test should be responsible for a specific purpose, or component of a page.
- Try and use `data-testid` attributes for a [locator strategy](https://playwright.dev/docs/locators#locate-by-test-id), as these are less likely to change than other attributes.
- Avoid string checking as tests may break if strings are updated, or could change depending on the page locale.
- When writing tests, push them to the `run-integration-tests` branch to run them against the deployed environment prior to merging to `main`. This will allow you to catch any issues that may not be present in local testing. It's also worth running tests a few times to identify any potential intermittent failures.

### User Agent string overrides

Playwright tests use User Agent string overrides to mock different browser and operating systems combinations. By default, tests run with User Agent strings configured for Firefox and Chrome running on Windows, and Safari running on macOS. This is accomplished using an `OpenPage()` helper that can be imported in each test file:

``` javascript
const openPage = require('../scripts/open-page');
const url = '/en-US/products/vpn/';

test.beforeEach(async ({ page, browserName }) => {
    await openPage(url, page, browserName);
});
```

To mock a different browser or operating system combination, tests can manually load a different override instead of using `openPage`:

``` javascript
test.beforeEach(async ({ page, browserName }) => {
    if (browserName === 'webkit') {
        // Set macOS 10.14 UA strings.
        await page.addInitScript({
            path: `./scripts/useragent/mac-old/${browserName}.js`
        });
    } else {
        // Set Windows 8.1 UA strings (64-bit).
        await page.addInitScript({
            path: `./scripts/useragent/win-old/${browserName}.js`
        });
    }

    await page.goto(url + '?automation=true');
});
```

## Testing Basket email forms

When writing integration tests for front-end email newsletter forms that submit to [Basket](https://github.com/mozilla/basket), we have some special case email addresses that can be used just for testing:

1. Any newsletter subscription request using the email address "<success@example.com>" will always return success from the basket client.
2. Any newsletter subscription request using the email address "<failure@example.com>" will always raise an exception from the basket client.

Using the above email addresses enables newsletter form testing without actually hitting the Basket instance, which reduces automated newsletter spam and improves test reliability due to any potential network flakiness.
