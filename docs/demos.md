
# Demo sites

For code to reach our Dev instances, it must be merged to `main`. However, if you need to show changes to stakeholders before that's possible, you can use a demo server.

Our demos are run on Google Cloud Platform, using Cloud Run, plus a persistent postgres DB, so that data is not lost.

You need write access to `mozilla/bedrock` or `mozmeao/springfield` to use the demo servers, because you need to force-push your changes to a specific branch.

There are nine servers available for Bedrock [www.mozilla.org](https://www.mozilla.org) and six for Springfield [www.firefox.com](https://www.firefox.com)

Here is how you push the latest commit from your WIP branch to Bedrock's "Demo 1" server, assuming your `mozilla/bedrock` remote is called `mozilla`, rather than the default `origin`:

```
git push -f mozilla HEAD:mozorg-demo-1

# Or if your remote is just called origin
git push -f origin HEAD:mozorg-demo-1

# Or to push a specific branch
git push -f mozilla my-demo-branch:mozorg-demo-2

```

## Branches and environments available

### Bedrock

- Branch `mozorg-demo-1` -> <https://www-demo1.allizom.org/>
- Branch `mozorg-demo-2` -> <https://www-demo2.allizom.org/>
- Branch `mozorg-demo-3` -> <https://www-demo3.allizom.org/>
- Branch `mozorg-demo-4` -> <https://www-demo4.allizom.org/>
- Branch `mozorg-demo-5` -> <https://www-demo5.allizom.org/>
- Branch `mozorg-demo-6` -> <https://www-demo6.allizom.org/>
- Branch `mozorg-demo-7` -> <https://www-demo7.allizom.org/>
- Branch `mozorg-demo-8` -> <https://www-demo8.allizom.org/>
- Branch `mozorg-demo-9` -> <https://www-demo9.allizom.org/>

### Springfield

- Branch `fxc-demo-1` -> <https://www-demo1.springfield.moz.works/>
- Branch `fxc-demo-2` -> <https://www-demo2.springfield.moz.works/>
- Branch `fxc-demo-3` -> <https://www-demo3.springfield.moz.works/>
- Branch `fxc-demo-4` -> <https://www-demo4.springfield.moz.works/>
- Branch `fxc-demo-5` -> <https://www-demo5.springfield.moz.works/>
- Branch `fxc-demo-6` -> <https://www-demo6.springfield.moz.works/>

### Reserving and declaring use of demo servers

!!! important
    To ensure we don't end up clobbering each other's demo deployments, we coordinate by making edits to this wiki page: <https://wiki.mozilla.org/Mozilla.org/Demo_Servers>

## Logs

Viewing logs for the deployment is done via Google Cloud Platform, which requires a @mozilla.com email identity.

If you *do* have access, the Cloud Build dashboard shows the latest builds, and Cloud Run will link off to the relevant logs.

It's recommended to install the [`gcloud` cli](https://cloud.google.com/sdk/docs/install), then you can also use ``gcloud builds list --ongoing`` to see all the in-progress builds.

## Env vars

Rather than tweak env vars via a web UI, they are set in config files. We have specific demo-use-only env var files, which are only used by our GCP demo setup. They are:

- `bedrock/gcp/bedrock-demos/cloudrun/mozorg-demo.env.yaml`

If you need to set/add/remove an env var, you can edit the relevant file on your feature branch, commit it and push it along with the rest of the code, as above. There is a small risk of clashes, but these can be best avoided if you keep up to date with `bedrock/main` and can be resolved easily.

## Secret values

*Remember that the env vars files are public because they are in the Bedrock codebase, so sensitive values should not be added there, even temporarily.*

If you need to add a secret value, this currently needs to be added at the GCP level by someone with appropriate permissions to edit and apply the Terraform configuration, and to edit the trigger YAML spec to pass through the new secret. Currently Web-SRE and the backend team have appropriate GCP access and adding a secret is relatively quick. (We can make this easier in the future if there's sufficient need, of course.)

!!! note
    **Always-on vs auto-sleep demo servers**

    The demo servers are on GCP Cloud Run, and by default they will be turned off if there is no traffic for 15 minutes. After this time, the demo app will be woken up if it receives a request.

    Normally, a 'cold start' will not be a problem, because as of September 2025 there is a persistent postgres DB associated with every Demo service.

## Resetting databases

Generally, as with code that hits `main`, there should be no issues with migration clashes or DB state when rolling out code to demos. However, it's possible that two different branches (A and B), will both have Django migrations with the same number and no merge migration, because the branches are not aware of each other. In this situation, it will not be possible to deploy Branch B to a demo where Branch A was already deployed.

We have support for a sledgehammer option to fully reset the database for the demo service that's being pushed to. To do this, the `HEAD` commit of your branch must contain the string `[reset-db]`, including the `[` `]`. When Cloud Build detects this, instead of just running migrations, it will reset the DB and refill it with the *default* data - which does not contain the previous state, nor (as of Sept 2025) any CMS data exported from Production. Use with care, when there is no alternative. The better approach is to avoid migration clashes via communication and collaboration.

## Private demos

We now support publishing demos from our [private repos](private-repos.md) for those rare occasions where we have to work in privacy. Pushes via a private repo also enable password protection via basic auth. See [Working with a private repo](private-repos.md#working-with-a-private-repo) for how to use that behaviour.

# DEPRECATED: Heroku Demo Servers

Demos are now powered by Google Cloud Platform (GCP), and no longer by Heroku.

However, the [Github Action](https://github.com/mozilla/bedrock/blob/main/.github/workflows/demo_deploy.yml) we used to push code to Heroku may still be enabled. Pushing a branch to one of the ``demo/*`` branches of the ``mozilla/bedrock`` repo will trigger this. However, note that URLs that historically used to point to Heroku will be pointed to the new GCP demos services instead, so you will have to look at Heroku's web UI to see what the URL of the relevant Heroku app is.

To push to launch a demo on Heroku:

``` bash
git push -f mozilla my-demo-branch:demo/1
