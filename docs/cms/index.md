# Wagtail CMS

Bedrock and Springfield use [Wagtail CMS](https://wagtail.org/) for content management.

## Documentation

- **[Local Setup](setup.md)** - SSO and non-SSO authentication, fetching CMS data
- **[Creating Pages](pages.md)** - Page models, migrations, templates, testing
- **[Images](images.md)** - Working with CMS-uploaded images
- **[Localization](l10n.md)** - Translating CMS content via Smartling/Pontoon

## Quick Start

1. Set up authentication (SSO or local) per the [setup guide](setup.md)
2. Run `make preflight` to get the latest DB
3. Start the server and go to `http://localhost:8000/cms-admin/`

## Resources

- [Wagtail Editor Guide](https://guide.wagtail.org/en-latest/)
- [Wagtail Docs](https://docs.wagtail.org/)
- [The Ultimate Wagtail Developers Course](https://learnwagtail.com/courses/the-ultimate-wagtail-developers-course/)


*[CMS]: (Content Management System)