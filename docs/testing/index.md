# Testing

Bedrock and Springfield run several different types of tests to ensure quality.

## Test Frameworks

| Framework | Purpose | When Run |
|-----------|---------|----------|
| **[Pytest](pytest.md)** | Python unit tests and redirects | PRs and commits to main |
| **[Jasmine](jasmine.md)** | JavaScript unit tests | PRs and commits to main |
| **[Playwright](playwright.md)** | Integration tests | CI deployment to dev/stage/prod |
| **[Axe](axe.md)** | Accessibility integration tests | Daily against dev |
| **[Selenium](selenium.md)** | Legacy IE11 smoke tests | CI pipeline |

## Browser Automation

Jasmine, Playwright and Selenium all require a browser to run. To automate browsers such as Firefox and Chrome, you may need to have the appropriate drivers installed.

### geckodriver (Firefox)

Download [geckodriver](https://github.com/mozilla/geckodriver/releases/latest) and add it to your system path:

``` bash
mv geckodriver /usr/local/bin/
```

Or on macOS with Homebrew:

``` bash
brew install geckodriver
```

### chromedriver (Chrome)

Download [chromedriver](https://chromedriver.chromium.org/downloads) and add it to your system path:

``` bash
mv chromedriver /usr/local/bin/
```

Or on macOS with Homebrew:

``` bash
brew install chromedriver
```

## Where to Find Test Files

- `./bedrock/*/tests/` or `./springfield/*/tests/` - Pytest (Python unit tests)
- `./tests/redirects/` - Pytest (redirect tests)
- `./tests/unit/` - Jasmine tests
- `./tests/playwright/` - Playwright tests
- `./tests/playwright/specs/a11y/` - Axe tests
- `./tests/functional/` - Selenium tests

!!! note
    New integration tests should be written using Playwright.
