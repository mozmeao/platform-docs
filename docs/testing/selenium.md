# Selenium (Legacy Integration Tests)

!!! springfield "Springfield Only"
    These tests are only for downloads in IE11, which we don't need to test in bedrock.

!!! note
    The majority of Selenium tests have now been migrated to Playwright. We still use Selenium for a small suite of IE focused smoke tests, but most new integration tests should be written using [Playwright](playwright.md).

[Selenium](http://docs.seleniumhq.org/) tests are our older, legacy integration test suite. These tests now consist only of a small set of smoke tests that are targeted at Internet Explorer 11 (via Sauce Labs) as part of our CI pipeline, and run alongside the Playwright tests.

The test specs can be found in `./tests/functional/`.

## Running Selenium tests

Before running the Selenium tests, please make sure to follow the [installation docs](../getting-started/install.md), including the database sync that is needed to pull in external data such as event/blog feeds etc. These are required for some of the tests to pass.

To run the full Selenium integration test suite against your local instance:

``` bash
pytest --base-url http://localhost:8000 --driver Firefox --html tests/functional/results.html tests/functional/
```

This will run all test suites found in the `tests/functional` directory and assumes you have the site running at `localhost` on port `8000`. Results will be reported in `tests/functional/results.html`.

!!! note
    If you omit the `--base-url` command line option then a local instance of the site will be started, however the tests are not currently able to run against it in this way.

By default, tests will run one at a time. This is the safest way to ensure predictable results, due to [bug 1230105](https://bugzilla.mozilla.org/show_bug.cgi?id=1230105). If you want to run tests in parallel (this should be safe when running against a deployed instance), you can add `-n auto` to the command line. Replace `auto` with an integer if you want to set the maximum number of concurrent processes.

!!! note
    There are some tests that do not require a browser. These can take a long time to run, especially if they're not running in parallel. To skip these tests, add `-m 'not headless'` to your command line.

To run a single test file you must tell pytest to execute a specific file e.g. `tests/functional/firefox/new/test_download.py`:

``` bash
pytest --base-url http://localhost:8000 --driver Firefox --html tests/functional/results.html tests/functional/firefox/new/test_download.py
```

To run a single test you can filter using the `-k` argument supplied with a keyword e.g. `-k test_download_button_displayed`:

``` bash
pytest --base-url http://localhost:8000 --driver Firefox --html tests/functional/results.html tests/functional/firefox/new/test_download.py -k test_download_button_displayed
```

You can also easily run the tests against any deployed environment by specifying the `--base-url` argument. For example, to run all Selenium integration tests against Springfield Dev:

``` bash
pytest --base-url https://www-dev.springfield.moz.works --driver Firefox --html tests/functional/results.html tests/functional/
```

!!! note
    For the above commands to work, Firefox needs to be installed in a predictable location for your operating system. For details on how to specify the location of Firefox, or running the tests against alternative browsers, refer to the [pytest-selenium documentation](http://pytest-selenium.readthedocs.org/en/latest/index.html).

For more information on command line options, see the [pytest documentation](http://pytest.org/latest/).

## Running tests in Sauce Labs

You can also run tests in Sauce Labs directly from the command line. This can be useful if you want to run tests against Internet Explorer when you're on Mac OSX, for instance.

1. Sign up for an account at <https://saucelabs.com/opensauce/>.
2. Log in and obtain your Remote Access Key from user settings.
3. Run a test specifying `SauceLabs` as your driver, and pass your credentials.

For example, to run the home page tests using Internet Explorer via Sauce Labs:

``` bash
SAUCELABS_USERNAME=thedude SAUCELABS_API_KEY=123456789 SAUCELABS_W3C=true SELENIUM_EXCLUDE_DEBUG=logs pytest --base-url https://www-dev.allizom.org --driver SauceLabs --capability browserName 'internet explorer' --capability platformName 'Windows 10' --html tests/functional/results.html tests/functional/test_home.py
```

## Writing Selenium tests

Tests usually consist of interactions and assertions. Selenium provides an API for opening pages, locating elements, interacting with elements, and obtaining state of pages and elements. To improve readability and maintainability of the tests, we use the [Page Object](http://martinfowler.com/bliki/PageObject.html) model, which means each page we test has an object that represents the actions and states that are needed for testing.

Well written page objects should allow your test to contain simple interactions and assertions as shown in the following example:

``` python
def test_sign_up_for_newsletter(base_url, selenium):
    page = NewsletterPage(base_url, selenium).open()
    page.type_email("noreply@mozilla.com")
    page.accept_privacy_policy()
    page.click_sign_me_up()
    assert page.sign_up_successful
```

It's important to keep assertions in your tests and not your page objects, and to limit the amount of logic in your page objects. This will ensure your tests all start with a known state, and any deviations from this expected state will be highlighted as potential regressions. Ideally, when tests break due to a codebase change, only the page objects will need updating. This can often be due to an element needing to be located in a different way.

Please take some time to read over the [Selenium documentation](http://seleniumhq.github.io/selenium/docs/api/py/api.html) for details on the Python client API.

### Destructive tests

By default all tests are assumed to be destructive, which means they will be skipped if they're run against a [sensitive environment](http://pytest-selenium.readthedocs.org/en/latest/user_guide.html#sensitive-environments). This prevents accidentally running tests that create, modify, or delete data on the application under test. If your test is nondestructive you will need to apply the `nondestructive` marker to it. A simple example is shown below, however you can also read the [pytest markers](http://pytest.org/latest/example/markers.html) documentation for more options.

``` python
import pytest


@pytest.mark.nondestructive
def test_newsletter_default_values(base_url, selenium):
    page = NewsletterPage(base_url, selenium).open()
    assert "" == page.email
    assert "United States" == page.country
    assert "English" == page.language
    assert page.html_format_selected
    assert not page.text_format_selected
    assert not page.privacy_policy_accepted
```

### Smoke tests

Smoke tests are considered to be our most critical tests that must pass in a wide range of web browsers, including Internet Explorer 11. The number of smoke tests we run should be enough to cover our most critical pages where legacy browser support is important.

``` python
import pytest


@pytest.mark.smoke
@pytest.mark.nondestructive
def test_firefox_menu_displayed(base_url, selenium):
    page = HomePage(selenium, base_url, params="").open()
    assert page.navigation.is_firefox_menu_displayed
```

You can run smoke tests only by adding `-m smoke` when running the test suite on the command line.

### Waits and Expected Conditions

Often an interaction with a page will cause a visible response. While Selenium does its best to wait for any page loads to be complete, it's never going to be as good as you at knowing when to allow the test to continue. For this reason, you will need to write explicit [waits](http://seleniumhq.github.io/selenium/docs/api/py/webdriver_support/selenium.webdriver.support.wait.html) in your page objects. These repeatedly execute code (a condition) until the condition returns true. The following example is probably the most commonly used, and will wait until an element is considered displayed:

``` python
from selenium.webdriver.support import expected_conditions as expected
from selenium.webdriver.support.ui import WebDriverWait as Wait

Wait(selenium, timeout=10).until(
    expected.visibility_of_element_located(By.ID, "my_element")
)
```

For convenience, the Selenium project offers some basic [expected conditions](http://seleniumhq.github.io/selenium/docs/api/py/webdriver_support/selenium.webdriver.support.expected_conditions.html), which can be used for the most common cases.

## Debugging Selenium

Debug information is collected on failure and added to the HTML report referenced by the `--html` argument. You can enable debug information for all tests by setting the `SELENIUM_CAPTURE_DEBUG` environment variable to `always`.

## Headless tests

There are targeted headless tests for the [download](https://github.com/mozmeao/springfield/blob/main/tests/functional/test_download.py) pages. These tests and are run as part of the pipeline to ensure that download links constructed via product details are well formed and return valid 200 responses.
