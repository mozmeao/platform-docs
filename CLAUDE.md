# Platform Docs

Shared documentation for Mozilla's [Bedrock](https://github.com/mozilla/bedrock) (mozilla.org) and [Springfield](https://github.com/mozmeao/springfield) (firefox.com) projects.

## Commands

- `make serve` - Run local dev server at http://127.0.0.1:8765
- `make build` - Build the static site to `/site`
- `make install` - Install Python dependencies (uses uv)
- `make deps` - Rebuild pinned requirements

## Stack

- MkDocs with Material theme
- Python dependencies managed via `uv` and `requirements.txt`
- Custom JS/CSS in `docs/js/` and `docs/css/`

## Project Structure

```
docs/           # Markdown documentation files
  css/          # Custom stylesheets
  js/           # Custom JavaScript
  images/       # Static images
mkdocs.yml      # MkDocs configuration and navigation
```

## Writing Documentation

### Bedrock vs Springfield Content

This documentation covers two similar codebases. Use these conventions:

**Tabbed code blocks** for project-specific code:
```markdown
=== "Bedrock"
    ```python
    # Bedrock-specific code
    ```

=== "Springfield"
    ```python
    # Springfield-specific code
    ```
```

**Admonitions** for project-specific notes:
```markdown
!!! bedrock "Bedrock Only"
    Content specific to Bedrock.

!!! springfield "Springfield Only"
    Content specific to Springfield.

!!! both "Applies to Both Projects"
    Content that applies to both but example is from one.
```

Use `???` instead of `!!!` for collapsible admonitions.

### Markdown Extensions

Available via MkDocs Material (see `mkdocs.yml`):
- `pymdownx.tabbed` - Tabbed content blocks
- `pymdownx.superfences` - Fenced code blocks
- `pymdownx.highlight` - Syntax highlighting
- `admonition` - Note/warning boxes
- `attr_list` - Add attributes to elements
- `toc` - Table of contents with permalinks

### Navigation

Update `nav:` section in `mkdocs.yml` when adding new pages.
