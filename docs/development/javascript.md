# Writing JavaScript

The [Webpack configuration](assets.md#webpack-configuration) supports some different options for writing JavaScript:

## Default Configuration

Write `example-script.js` using ES5 syntax and features. Webpack will bundle the JS as-is, without any additional pre-processing.

## Babel Configuration

Write `example-script.es6.js` using ES2015+ syntax. Webpack will transpile the code to ES5 using [Babel](https://babeljs.io/). This is useful when you want to write modern syntax but still support older browsers.

!!! important
    Whilst Babel will transpile most modern JS syntax to ES5 when suitable fallbacks exist, it won't automatically include custom polyfills for everything since these can start to greatly increase bundle size. If you want to use `Promise` or `async/await` functions for example, then you will need to load polyfills for those. This can be done either at the page level, or globally in `lib.js` if it's something that multiple pages would benefit from. But please pick and choose wisely, and be concious of performance.

For pages that are served to Firefox browsers only, such as `/whatsnew`, it is also possible to write native modern JS syntax and serve that directly in production. Here there is no need to include the `.es6.js` file extension. Instead, you can simply use `.js`. The rules that define which files can do this can be found in our [ESLint config](https://github.com/mozilla/bedrock/blob/main/eslint.config.js).
