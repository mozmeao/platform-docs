# Mozmeao Platform Docs

This repo holds the shared documentation for [Bedrock](https://github.com/mozilla/bedrock), which powers [www.mozilla.org](https://www.mozilla.org), and [Springfield](https://github.com/mozmeao/springfield), which powers [www.firefox.com](https://www.firefox.com).

We have shared documentation because they are deliberately similar codebases. Indeed, Springfield started out as a cut-down version of Bedrock.

The documentation is rendered using [MkDocs](https://www.mkdocs.org/), and the [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) theme.

### Local development

To run the documentation site:

First, create and activate a virtual environment (using pyenv):

```
pyenv virtualenv 3.13.3 docs
pyenv activate docs
```

Then install dependencies and run the server:

```
make install

make serve
```

To rebuild python dependencies after amending `requirements.in`:

```
make deps
```
