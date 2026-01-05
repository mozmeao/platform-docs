# Analytics Checklist

See [Website Analytics](../../measurement/analytics.md) for full documentation.

## Links `<a href="">`

- [ ] Has a [`data-cta-text` OR `data-link-text`](../../measurement/analytics.md#data-attributes)
    - [ ] If it has class `mzp-c-button` it is a CTA
    - [ ] If it has class `mzp-c-cta-link` it is a CTA
    - [ ] If there are two CTAs with the same value for `data-cta-text` include `data-cta-position`
    - [ ] Has ONLY ONE of `data-cta-text` or `data-link-text`
- [ ] If linking to another Mozilla property include `utm` params
    - [ ] `utm_source` is `www.firefox.com` or `www.mozilla.org`
    - [ ] `utm_medium` is `referral`
    - [ ] If the query string is in a variable it is called `params` and the string includes the `?`
- Download button:
    - [ ] Use the [appropriate helper](../../firefox-downloads/download-buttons.md#which-helper-should-i-use), don't hardcode these (`download_firefox_thanks`, `google_play_button`, `apple_app_store_button`)
    - [ ] Include a `download_location` if there are multiple buttons on the page

## Buttons `<button type="button">`

- Download button:
    - [ ] Download buttons are links for analytics purposes (not buttons)
- Not a download button:
    - [ ] [`widget_action` reporting in the dataLayer](../../measurement/analytics.md#widget-action)

## QR Codes

- [ ] Use the [`qrcode` helper](../../development/images.md#qrcode)
- [ ] Use the app store redirects if applicable and include a product and campaign

## Other

- [ ] New custom events configured in GTM
- If any of the following are used, check that their custom events will be triggered:
    - [ ] [Download](../../measurement/analytics.md#product-downloads)
    - [ ] Mozilla Accounts form
    - [ ] [Newsletter subscribe](../../measurement/analytics.md#newsletter-subscribe)
    - [ ] Self-hosted videos
    - [ ] [Send to Device](../../measurement/analytics.md#send-to-device)
    - [ ] [Social Share](../../measurement/analytics.md#social-share)
    - [ ] [VPN subscribe button](../../measurement/analytics.md#begin-checkout)
    - [ ] [Widget Action](../../measurement/analytics.md#widget-action)
