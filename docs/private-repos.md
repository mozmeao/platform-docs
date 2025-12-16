The vast majority of the time, all the work done on Bedrock and Springfield is in the open, in our public repos at [https://github.com/mozilla/bedrock/](https://github.com/mozilla/bedrock/) and [https://github.com/mozmeao/springfield/](https://github.com/mozmeao/springfield/).

However, there are occasions where we have to work on something sensitive (e.g. content pending legal approval, or some other work that's under embargo) for a short period of time. To achieve this, we have "sibling" repos that are private.

* [https://github.com/mozilla/bedrock-private/](https://github.com/mozilla/bedrock-private/)
* [https://github.com/mozmeao/springfield-private/](https://github.com/mozmeao/springfield-private/)

To work on these repos you have to be either a staff member or have signed an NDA, so you will need to be granted specific access by an Admin - ask your manager.

The repos are not forks, they are distinct repos which are manually synced with the public repos via a force push before work starts on the private repo.

## Working with a private repo

1. Add the private repo as its own git remote with a name that makes it clear that it's the private repo - for example:

    ```bash
    git remote add bedrock-private-repo git@github.com:mozilla/bedrock-private.git
    ```

2. Start a new branch (again ideally with a name that reminds everyone it's private work). Eg for issue #12345

    ```bash
    git switch -c 12345--PRIVATE--slug-like-title
    ```

3. Once the work is done, push it up to the PRIVATE repo's remote if you want to PR it

    ```bash
    git push bedrock-private-repo
    ```

4. You may want to push the code to a [demo server](demos.md) in order to get signoff. We now support automatic password protection on our demos, IF if they are triggered via the `bedrock-private` or `springfield-private` remote repos. As an example, to push to `www-demo8.allizom.org` with password protection on, ensure you've got everything committed locally you want to deploy and that you're on the relevant branch, then:

    ```bash
    git push -f bedrock-private-repo HEAD:mozorg-demo8
    ```

    (That this is the standard pattern for pushing to demo servers, except it specifies a different remote from the default one.)

    Once the site has deployed, when you first visit it, you'll be challenged for a basic-auth username and password. You can find these in our password vault (search for 'private demo server') or ask a colleague to send it to you in a secure manner.

5. When the PR is approved, DO NOT merge it to `main` on the private repo. Instead, wait for the work to be approved and cleared for public consumption. Then, push it as branch to the _public_ repo as you would normally do, make a PR and reference the one in the private repo and get it merged and released as usual.
