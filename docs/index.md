# Welcome to the documentation for Bedrock and Springfield

`bedrock` is the project behind [www.mozilla.org](https://www.mozilla.org).

`springfield` is the sibling project behind [www.firefox.com](https://www.firefox.com).

Both are web applications based on [Django](http://www.djangoproject.com/), a [Python](https://www.python.org) web application framework.

## Understanding the Split

Originally, all content lived in the Bedrock repository. All Firefox content was later split out into the Springfield repository, while Mozilla corporate content remained in Bedrock. 

There are many updates that will need to apply to both projects to keep them in sync.

### Bedrock ([mozilla/bedrock](https://github.com/mozilla/bedrock))

**Hosts:** www.mozilla.org

**Content:**
- Pan-Mozilla (Home, About, Manifesto, Careers)
- Mozilla Corporation (Products, Policies, Terms)
- Mozilla Foundation (Governance)
- A small amount of legacy Firefox content

### Springfield ([mozmeao/springfield](https://github.com/mozmeao/springfield))

**Hosts:** www.firefox.com

**Content:**
- Firefox product marketing pages
- Firefox download functionality and helpers
- Firefox release notes and system requirements
- The eventual plan is to move the What's New pages to springfield but 
  at the moment the migration is incomplete and non-EU and non-Release WNPs are still in bedrock

## Contributing

Patches are welcome! Feel free to fork and contribute to this project on Github:

* [Bedrock](https://github.com/mozilla/bedrock)
* [Springfield](https://github.com/mozmeao/springfield)
