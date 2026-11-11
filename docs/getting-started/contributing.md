# How to contribute {: #contribute }

Before diving into code it might be worth reading through the [Development](../development/index.md) documentation, which contains useful information and links to our coding guidelines for Python, Django, JavaScript and CSS.

## Before you start: find a `help wanted` issue

First of all, thank you for your interest in contributing to Bedrock and Springfield. We truly appreciate every contribution, and we love seeing people care about these projects. 😊

Our team is small and our time is limited. To make sure every contribution gets the attention it deserves, we currently accept code contributions **only for issues labelled `help wanted`** ([Bedrock](https://github.com/mozilla/bedrock/labels/help%20wanted) and [Springfield](https://github.com/mozmeao/springfield/labels/help%20wanted)). These are issues we have looked at, agreed are worth doing, and are ready for someone to pick up.

### Why we do it this way

We want to be able to review your work quickly and give it proper care. Reviewing takes real time, and a pull request for something outside our current goals is hard for us to fit in, even when the code is great. We would hate for you to spend your evenings on a change we can't merge.

### What this means in practice

* Browse the `help wanted` issues and pick one that interests you.
* Leave a comment on the issue to say you'd like to work on it, so we can avoid duplicated effort and answer any questions.
* Then follow the steps below to get your change ready.

### Have an idea or found a bug?

We'd love to hear about it! Please open an issue and describe what you found or what you have in mind. We'll take a look, and if it fits our goals we'll happily label it `help wanted` so you (or someone else) can work on it.

### What about pull requests for other things?

Pull requests that aren't linked to a `help wanted` issue may take us a lot longer to get back to, and we may not be able to get to them at all. This isn't a judgement on your work or your intentions. It simply helps us keep our focus and be fair to everyone waiting on a review. If this happens to you, please don't be discouraged. We'd be glad to see you back on one of the labelled issues.

## Git workflow

When you want to start contributing, you should create a branch from main. This allows you to work on different project at the same time:

``` bash
git switch main
```

``` bash
git switch -c topic-branch
```

To keep your branch up-to-date, assuming the mozilla repository is the remote called mozilla:

``` bash
git switch main
```

``` bash
git pull --ff-only
```

More on [Why you should use --ff-only](https://blog.sffc.xyz/post/185195398930/why-you-should-use-git-pull-ff-only-git-is-a). To make this the default update your Git config as described in the article.

``` bash
git switch topic-branch
```

``` bash
git rebase main
```

If you need more Git expertise, a good resource is the [Git book](http://git-scm.com/book).

Once you're done with your changes, you'll need to describe those changes in the commit message.

## Git commit messages

Commit messages are important when you need to understand why something was done.

- First, learn [how to write good git commit messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
- All commit messages must include a bug number. You can put the bug number on any line, not only the first one.
- If you use the syntax `bug xxx`, Github will reference the commit into Bugzilla. With `fix bug xxx`, it will even close the bug once it goes into main.

If you're asked to change your commit message, you can use these commands:

``` bash
git commit --amend
```

-f is doing a force push because you modified the history

``` bash
git push -f my-remote topic-branch
```

## Submitting your work

In general, you should submit your work with a pull request to main. If you are working with other people or you want to put your work on a demo server, then you should be working on a common topic branch.

Once your code has been positively reviewed, it will be deployed shortly after. So if you want feedback on your code but it's not ready to be deployed, you should note it in the pull request, or use a [Draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/). Also make use of an appropriate label, such as `Do Not Merge`.

## Squashing your commits

Should your pull request contain more than one commit, sometimes we may ask you to squash them into a single commit before merging. You can do this with ``git rebase``.

As an example, let's say your pull request contains two commits. To squash them into a single commit, you can follow these instructions:

    git rebase -i HEAD~2

You will then get an editor with your two commits listed. Change the second commit from ``pick`` to ``fixup``, then save and close. You should then be able to verify that you only have one commit now with ``git log``.

To push to GitHub again, because you "altered the history" of the repo by merging the two commits into one, you'll have to ``git push -f`` instead of just ``git push``.

## Deploying your code

If you have write access to the Bedrock or Springfield repos, you can push to one of our [demo servers](../operations/demos.md).

Code flows automatically to Dev, and we manually trigger deployments to Stage and to Production. See [Continuous Integration & Deployment](../operations/pipeline.md) for details, including where the Dev, Stage and Prod servers are.

After doing a push, those who are responsible for implementing changes need to update the bugs that have been pushed with a quick message stating that the code was deployed.

If you'd like to see the commits that will be deployed before the push run the following command:

``` bash
./bin/open-compare.py
```

This will discover the currently deployed git hash, and open a compare URL at github to the latest main. Look at `open-compare.py -h` for more options.

We automate pushing to production via tagged commits (see [Continuous Integration & Deployment](../operations/pipeline.md))
