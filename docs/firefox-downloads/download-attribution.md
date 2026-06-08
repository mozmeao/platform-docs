# Download Attribution

Download links can include attribution parameters that pass information to the Firefox download installer.

Historically, this data was analytics-based (i.e. GA4 client id, UTM parameters). Now, we have more cases where this data is essential, and should be passed with or without analytics data.

!!! note
    You will see legacy references to `stub attribution` in website code and documentation. This is planned to be renamed to `download attribution` once the [refactor](https://github.com/mozmeao/springfield/pull/1296) is active in production.

## Triggers

To clarify the separate types of data, we have two triggers to initialize download attribution.

### 1.  Essential

Essential data is information required for a user-facing feature to function (i.e. return to AMO, set as default, enable smart window).

Essential data is created when the user:

- arrives on a special landing page dedicated to a download feature
- interacts with a checkbox related to a download feature

Essential data operates on a "last touch" principle:

- new data overrides old
- data does not persist across pages

#### Download Features

##### Return to AMO (RTAMO)

[Return to AMO](https://wiki.mozilla.org/Add-ons/QA/Testplan/Return_to_AMO) (RTAMO) initializes a first-time installation onboarding flow that redirects a user to install the extension they have chosen whilst browsing [AMO](https://addons.mozilla.org/firefox/) using a different browser. 

Specifically, the RTAMO feature looks for a `utm_content` parameter that starts with `rta:`, followed by an ID specific to an extension. For example: `utm_content=rta:dUJsb2NrMEByYXltb25kaGlsbC5uZXQ`. Springfield also checks the referrer before passing this on, to make sure the links originate from AMO. If RTAMO data comes from a domain other than AMO, then the attribution data is dropped.

RTAMO initially worked for only a limited subset of addons recommended by Mozilla. This functionality was expanded by the AMO team to cover all publically listed addons, under a project called ``Extended RTAMO (ERTAMO)``.

##### Download as Default

The `SET_DEFAULT_BROWSER` campaign communicates to the installer that the browser should be set as default when downloaded. This campaign is based on a checkbox setting next to the download button.

At the moment (2026-06-08) if the switch `download_as_default` is enabled, the checkbox should appear for users who match the following criteria:

- their device supports download attribution
- their device supports Firefox
- their device is running a version of Windows higher than 8.1

##### Enable Smart Window

The `smart_window` campaign initializes a first-time installation onboarding flow customized to Smart Window features. This campaign is based on a user deciding to **download** from the [Smart Window landing page](https://www.firefox.com/en-US/smart-window/?view=download).

At the moment (2026-06-08), this feature is geo-restricted. Users who are not in an eligible geo will see the **waitlist** version of the page. 

Users who are already on Firefox will see an **enable** version of the page that leverages UI Tour to enable Smart Window.

### 2.  Analytics

Analytics data is information that enables Mozilla to better understand how changes to our website and different marketing campaigns can affect installation rates, as well as overall product retention. The data also gives us an insight into how many installations originate from `www.firefox.com`, as opposed to elsewhere on the internet.

**Analytics data is only passed to the installer if our [analytics consent logic](https://github.com/mozmeao/springfield/blob/main/media/js/base/consent/utils.es6.js#L46) allows it.** It is created if consent is granted and removed if consent is denied.

Analytics data operates on a "first touch" principle:

- new data does NOT override old
- data persists across pages

#### How do visitors opt-out?

To opt-out, visitors can activate the [Global Privacy Control (GPC) setting](https://support.mozilla.org/en-US/kb/global-privacy-control) or [deny analytics cookies](https://www.firefox.com/en-US/privacy/websites/cookie-settings/). Do Not Track (DNT) signals are also respected.

## Combining the Data

We store a snapshot of each type of data in a cookie:

- `moz-download-attribution-essential-raw`
- `moz-download-attribution-analytics-raw`

These are not the cookies we use to pass information to the download installer. We use these cookies internally to create requests to the [stub attribution service](https://github.com/mozilla-services/stubattribution/tree/master). 

!!! note
    Because we have separate triggers for different types of download attribution data, we need to manage conflicting requests. 
    
    For example, if a request with combined essential and analytics data is in progress, but then analytics consent is denied, we want that second request (with essential data only) to be applied, regardless of whether the request's response was received first or second. 
    
    To do this, we track in-flight requests and run `inFlightXHR.abort()` on prior requests to ensure to most up-to-date request always wins.

The stub attribution service is separately maintained, and it expects specific keys. The default value for all keys is `(not set)`.

Below is a breakdown of the data type contained in each key. 

### Download Attribution Data Keys

| Key | Data type | Description | Example |
| ----| --------- | ----------- | ------- | 
| `campaign` | Essential or Analytics | Essential: user-facing download feature <br>Analytics: specific marketing campaign | Essential: `SET_DEFAULT_BROWSER` <br>Analytics: `fast`
| `source` | Analytics | referring site which sent the visitor | `google`
| `medium` | Analytics | type of link, such as referral, cost per click, or email | `cpc`
| `content` | Essential or Analytics | Essential: validation for RTAMO feature <br>Analytics: specific element that was clicked | Essential: `rta:dUJsb2NrMEByYXltb25kaGlsbC5uZXQ` <br>Analytics: `getfirefox`
| `experiment` | Analytics | an experiment name that visitor was a cohort of | `taskbar`
| `variation` | Analytics | the experiment variation that was seen by the visitor | `treatment`
| `ua` | Analytics | simplified browser name parsed from the visitor's User Agent string | `chrome`
| `session_id` | Analytics | random 10 digit string identifier used to associate attribution data with GA session | `9770365798`
| `client_id_ga4` | Analytics | Google Analytics 4 Client ID | `1715265578.1681917481`
| `dlsource` | Essential | A hard-coded string ID used to distinguish downloads from archive downloads | `fxdotcom`

!!! note
    There is a proposal to update the stub attribution service in future to provide essential-specific keys (i.e. `product_context` and `install_options`). But for now, we have to share the existing `campaign` and `content` keys. **When there is a conflict between an essential value and an analytics value, the essential value wins.**

The stub attribution service returns two base64-encoded values which we store in cookies:

- `moz-download-attribution-sig`: a signed, encrypted signature to prove that the data came from `www.firefox.com`
- `moz-download-attribution-code`: authenticated, validated data

These are the cookies we use to pass information to the download installer.

## Applying to Downloads

By default, if download attribution cookies exist, the encoded data is appended to any Firefox download links on the page. 

The query parameters are labelled `attribution_code` and `attribution_sig`.

### Auto-download JS bundle

On some pages, such as `/thanks`, we want to automatically start a Firefox download.

In the case of [RTAMO](#return-to-amo-rtamo), we also want to apply essential data to the download link before starting the download. 

The auto-download JS bundle overrides default "append to links" download attribution behaviour to ensure the correct order of events:

1. If there is essential data to include in the download (i.e. RTAMO), make request to stub attribution service:
    1. On success, append data to links and start download
    2. On timeout, do not re-try, start download without data
2. If there is no essential data (i.e. `/thanks`), start download immediately 

## Details of Flow

1.  A user visits a page on www.firefox.com:
    1. Essential trigger fires based on page or checkbox.
    2. Analytics trigger fires according to GTM consent status.
2.  [Attribution data](#download-attribution-data-keys) is validated:
    1. Essential campaigns are checked against whitelist.
    2. Analytics generates an attribution session ID. This ID is also sent to Google Analytics as a non-interaction event.
3. If attribution data passes client-side validation, the data is stored as a `-raw` cookie in the user's web browser. These cookies have a 24 hour expiry.
4.  Next we use these raw cookies to send attribution data to an authentication service that is part of springfield's back-end server. The data is validated again, then base64 encoded and returned to the client together with an signed, encrypted signature to prove that the data came from www.firefox.com.
5.  The encoded attribution data and signature are then stored as cookies in the user's web browser. The cookies have the IDs `moz-download-attribution-code` (the attribution code) and `moz-download-attribution-sig` (the encrypted signature). Both cookies have a 24 hour expiry.
6.  On all pages, Springfield checks if both `moz-download-attribution-code` and `moz-download-attribution-sig` cookies exist. If so, we append the authenticated data to any Firefox direct download links on the page. The query parameters are labelled `attribution_code` and `attribution_sig`.
7.  When the user clicks the Firefox download link, another attribution service hosted at `download.mozilla.org` then decrypts and validates the attribution signature. If the secret matches, a unique download token is generated. The service then stores both the attribution data* and the download token in Mozilla's private server logs.
    1. *If analytics data was granted, this would include the Google Analytics client ID.
8.  The service then passes the download token and attribution data* into the installer being served to the user.
    1. *Even if analytics data was granted, this would <em>not</em> include the GA client ID.
9.  Once the user installs Firefox, the data that was passed to the installer is then stored in the users' Telemetry profile.
    1. If analytics data was granted, during analysis, the download token can be used to join Telemetry data with the corresponding GA data in the server logs.
    2. If analytics data was denied, all non-Essential fields are `(not set)`. There is no session ID and no GA data.

!!! note
    The download attribution script uses the attribute `data-download-version` to identify what links are download links.

## Local testing

For download attribution to work locally or on a demo instance, a value for the HMAC key that is used to sign the attribution code must be set via an environment variable e.g.

``` html
STUB_ATTRIBUTION_HMAC_KEY=thedude
```

!!! note
    This value can be anything if all you need to do is test the springfield functionality. It only needs to match the value used to verify data passed to the stub installer for full end-to-end testing via Telemetry.


## Manual testing for code reviews

You might not need to test all these depending on what is changing this is an exhaustive testing guide. This guide assumes demo1, make sure you're testing on the right URL.

1.  Use Chrome on Windows or MacOS with DNT and adblocking disabled.

2.  Open <https://www-demo1.springfield.moz.works/en-US/?utm_source=ham&utm_campaign=pineapple>

3.  Using Dev Tools, open the Application tab and inspect cookies.

4.  Look for a cookie called ``moz-download-attribution-code`` and copy the value (it should be a base64 encoded string).

5. Decode the base64 string (e.g. using <https://base64decode.org>) and check that:

    -   ``dlsource`` parameter value is fxdotcom
    -   ``client_id_ga4`` and ``session_id`` parameters exist
    -   ``client_id_ga4`` should look something like 0700077325.1656063224 (the numbers will differ but the format with the middle period should look the same).
    -   ``source`` and ``campaign`` have the values ham and pineapple, respectively.
    -   The ua value should be chrome (assuming you tested in Chrome).
    -   Everything else should be (not set).

6.  Inspect the "Download Firefox" button in the top right and verify the download URL contains ``attribution_code`` and ``attribution_sig`` params.

7.  Click "Download Firefox".

8.  Inspect the "Try downloading again" link and check for the ``attribution_code`` and ``attribution_sig`` params.
    -   decode the value of ``attribution_code`` to check it has the expected values

Other places on the site you may want to check:

-   [firefox/all](https://www-demo1.springfield.moz.works/en-US/firefox/all/) (inspect the network request to check that the attribution params were added on click)
-   [firefox/enterprise](https://www-demo1.springfield.moz.works/en-US/firefox/enterprise/)
