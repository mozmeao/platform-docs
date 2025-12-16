# How to contribute {: #contribute }

Before diving into code it might be worth reading through the [Developing on Bedrock or Springfield](/platform-docs/coding/) documentation, which contains useful information and links to our coding guidelines for Python, Django, JavaScript and CSS.

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

If you have write access to the Bedrock or Springfield repos, you can push to one of our [demo servers](demos.md).

Code flows automatically to Dev, and we manually trigger deployments to Stage and to Production. See [Continuous Integration & Deployment](pipeline.md) for details, including where the Dev, Stage and Prod servers are.

After doing a push, those who are responsible for implementing changes need to update the bugs that have been pushed with a quick message stating that the code was deployed.

If you'd like to see the commits that will be deployed before the push run the following command:

``` bash
./bin/open-compare.py
```

This will discover the currently deployed git hash, and open a compare URL at github to the latest main. Look at `open-compare.py -h` for more options.

We automate pushing to production via tagged commits (see [Continuous Integration & Deployment](pipeline.md))
