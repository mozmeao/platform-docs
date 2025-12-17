# Locale-specific CSS & Fonts

!!! warning "Out of date"
    This section needs updating to reflect our current font usage. But the techniques remain valid.


If a localized page needs some locale-specific style tweaks, you can add the style rules to the page's stylesheet like this:

``` css
html[lang="it"] #features li {
  font-size: 20px;
}

html[dir="rtl"] #features {
  float: right;
}
```

If a locale needs site-wide style tweaks, font settings in particular, you can add the rules to `/media/css/l10n/{{LANG}}/intl.css`. Pages on Bedrock automatically includes the CSS in the base templates with the ``l10n_css`` helper function. The CSS may also be loaded directly from other Mozilla sites with such a URL: `//mozorg.cdn.mozilla.net/media/css/l10n/{{LANG}}/intl.css`.

## Custom Fonts

_Open Sans_, the default font on mozilla.org, doesn't offer non-Latin glyphs. `intl.css` can have `@font-face` rules to define locale-specific fonts using custom font families as below:

- _X-LocaleSpecific-Light_: Used in combination with _Open Sans Light_. The font can come in 2 weights: normal and optionally bold
- _X-LocaleSpecific_: Used in combination with _Open Sans Regular_. The font can come in 2 weights: normal and optionally bold
- _X-LocaleSpecific-Extrabold_: Used in combination with _Open Sans Extrabold_. The font weight is 800 only

Here's an example of `intl.css`:

``` css
@font-face {
  font-family: X-LocaleSpecific-Light;
  font-weight: normal;
  font-display: swap;
  src: local(mplus-2p-light), local(Meiryo);
}

@font-face {
  font-family: X-LocaleSpecific-Light;
  font-weight: bold;
  font-display: swap;
  src: local(mplus-2p-medium), local(Meiryo-Bold);
}

@font-face {
  font-family: X-LocaleSpecific;
  font-weight: normal;
  font-display: swap;
  src: local(mplus-2p-regular), local(Meiryo);
}

@font-face {
  font-family: X-LocaleSpecific;
  font-weight: bold;
  font-display: swap;
  src: local(mplus-2p-bold), local(Meiryo-Bold);
}

@font-face {
  font-family: X-LocaleSpecific-Extrabold;
  font-weight: 800;
  font-display: swap;
  src: local(mplus-2p-black), local(Meiryo-Bold);
}
```

## Specifying Fonts

Localizers can specify locale-specific fonts in one of the following ways:

- Choose best-looking fonts widely used on major platforms, and specify those with the `src: local(name)` syntax
- Find a best-looking free Web font, add the font files to `/media/fonts/`, and specify those with the `src: url(path)` syntax
- Create a custom Web font to complement missing glyphs in _Open Sans_, add the font files to `/media/fonts/l10n/`, and specify those with the `src: url(path)` syntax. [M+ 2c](http://mplus-fonts.osdn.jp/about-en.html) offers various international glyphs and looks similar to Open Sans, while [Noto Sans](https://www.google.com/get/noto/) is good for the bold and italic variants. You can create subsets of these alternative fonts in the WOFF and WOFF2 formats using a tool found on the Web. See [Bug 1360812](https://bugzilla.mozilla.org/show_bug.cgi?id=1360812) for the Fulah (ff) locale's example

## Using the Font Mixins

Developers should use the `.open-sans` mixin instead of `font-family: 'Open Sans'` to specify the default font family in CSS. This mixin has both _Open Sans_ and _X-LocaleSpecific_ so locale-specific fonts, if defined, will be applied to localized pages. The variant mixins, `.open-sans-light` and `.open-sans-extrabold`, are also available.
