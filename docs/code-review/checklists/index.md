# Code Review Checklists

!!! warning "These checklists are not exhaustive"
    Look, I can't document all the ways something can go wrong. Just because a PR checks all these boxes doesn't mean it should be approved.
    
    Be curious about the code you are reviewing and look for places where it might break or could be improved.

    Think about: functionality, accessibility, analytics, code quality, localization, maintainability (including tests), performance, and security.


These checklists are `bedrock` & `springfield` specific and are not intended to be through list of best practices. However, there are some generic best practices included in these checks because they have been commonly overlooked in the past. They should also mostly be checks that have to be done by a human. If we can automate it we should.

- [General](general.md) - Functionality, maintainability, and manual testing
- [Analytics](analytics.md) - Link tracking, buttons, and custom events
- [CSS](css.md) - Responsive design, best practices, and localization
- [Experiments](experiments.md) - A/B testing and Traffic Cop
- [HTML](html.md) - Best practices, links, and SEO
- [JavaScript](js.md) - Behavior, error handling, and console output
- [Localization](l10n.md) - Fluent files, string conventions, and style
- [Media](media.md) - Images, alt text, and optimization
- [Tests](tests.md) - Unit and functional tests

Automated checks will also be run by GitHub to check:

- [Pre-commit checks have been run](../../getting-started/install/#pre-commit-hooks) (fluent, ruff, stylelint, etc.)
- JS unit tests pass
- Python unit tests pass
