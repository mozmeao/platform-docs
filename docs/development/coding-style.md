# Coding Style

Bedrock and Springfield use the following open source tools to follow coding styles and conventions, as well as applying automatic code formatting:

- [ruff](https://beta.ruff.rs/docs/) for Python style, code quality rules, and import ordering.
- [black](https://black.readthedocs.io/) for Python code formatting.
- [Prettier](https://prettier.io/) for JavaScript code formatting.
- [ESLint](https://eslint.org/) for JavaScript code quality rules.
- [Stylelint](https://stylelint.io/) for Sass/CSS style and code quality rules.

For front-end HTML & CSS conventions, bedrock uses Mozilla's Protocol design system for building components. You can read the [Protocol documentation site](https://protocol.mozilla.org/) for more information.

Mozilla also has some more general coding styleguides available, although some of these are now rather outdated:

- [Mozilla Python Style Guide](http://mozweb.readthedocs.org/en/latest/reference/python-style.html)
- [Mozilla HTML Style Guide](http://mozweb.readthedocs.org/en/latest/reference/html-style.html)
- [Mozilla JS Style Guide](http://mozweb.readthedocs.org/en/latest/reference/js-style.html)
- [Mozilla CSS Style Guide](http://mozweb.readthedocs.org/en/latest/reference/css-style.html)

## Test Coverage

When the Python tests are run, a coverage report is generated, showing which lines of the codebase have tests that execute them, and which do not. You can view this report in your browser at `file:///path/to/your/checkout/of/bedrock-or-springfield/python_coverage/index.html`.

When adding code, please aim to provide solid test coverage, using the coverage report as a guide. This doesn't necessarily mean every single line needs a test, and 100% coverage doesn't mean 0% defects.

## Configuring your Code Editor

The codebase includes an `.editorconfig` file in the root directory that you can use with your code editor to help maintain consistent coding styles. Please see [editorconfig.org](http://editorconfig.org/). for a list of supported editors and available plugins.
