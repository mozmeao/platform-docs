# CMS Local Setup

Bedrock and Springfield's CMSes are powered by [Wagtail CMS](https://wagtail.org/).

If you are new to Wagtail, it is recommended that you read the official docs and/or complete an online course to get a better understanding of how Wagtail works.

Useful resources:

- [Wagtail Editor Guide](https://guide.wagtail.org/en-latest/).
- [Wagtail Docs](https://docs.wagtail.org/).
- [The Ultimate Wagtail Developers Course](https://learnwagtail.com/courses/the-ultimate-wagtail-developers-course/).

## High-level summary

Wagtail CMS will be used to make either entire pages or portions of pages (let's call them 'surfaces') content-editable on [www.mozilla.org](https://www.mozilla.org). It is not a free-for-all add-any-page-you-like approach, but rather a careful rollout of surfaces with appropriate guard rails that helps ensure the integrity, quality and security of [www.mozilla.org](https://www.mozilla.org).

Surfaces will be authored via a closed 'Editing' deployment and when those changes are published they will become visible on the main [www.mozilla.org](https://www.mozilla.org) 'Web' deployment.

## SSO authentication setup

1. Become a member of `bedrock_cms_local_dev-access` or `springfield_cms_local_dev-access` on people.mozilla.org. Make sure you remember to accept the email invitation.
2. Extend your `.env` file with the development OIDC credentials that have been supplied to you. (make sure your `.env` file is based on a recent copy of `.env-dist` as several new variables exist).
3. In your `.env` file set the following variables:
    - `USE_SSO_AUTH=True`
    - `WAGTAIL_ENABLE_ADMIN=TRUE`
    - `WAGTAIL_ADMIN_EMAIL=YOUR_MOZILLA_LDAP_EMAIL@mozilla.com`
4. Run `make preflight` to pull down the latest DB export. As part of this step, the make file will also create a local admin user for you, using the Mozilla LDAP email address you added in the previous step. **If you do not want to overwrite your local database, run** `make preflight -- --retain-db` **instead.**
5. Start the app running via `npm start` (for local dev) or `make build run` (for Docker).
6. Go to `http://localhost:8000/cms-admin/` and you should see a button to login with SSO. Click it and you should go through the OAuth flow and end up in the Wagtail admin.

## Non-SSO authentication

1. In your `.env` file set `USE_SSO_AUTH=False`, and `WAGTAIL_ENABLE_ADMIN=TRUE`.
2. Run `make preflight` to pull down the latest DB version. **If you do not want to overwrite your local database, run** `make preflight -- --retain-db` **instead.**
3. Create a local admin user with `./manage.py createsuperuser`, setting both the username, email and password to whatever you choose (note: these details will only be stored locally on your device).
4. Alternatively, if you define `WAGTAIL_ADMIN_EMAIL=YOUR_MOZILLA_LDAP_EMAIL@mozilla.com` and `WAGTAIL_ADMIN_PASSWORD=somepassword` in your `.env.` file, `make preflight` will automatically create a non-SSO superuser for you
5. Start the app running via `npm start` (for local dev) or `make build run` (for Docker).
6. Go to `http://localhost:8000/cms-admin/` and you should see a form for logging in with a username and password. Use the details you created in the previous step.

## Fetching the latest CMS data for local work

!!! note
    **TL;DR version:**

    1. Get the DB with `make preflight`
    2. If you need the images that the DB expects to exist, use `python manage.py download_media_to_local`

The CMS content exists in hosted cloud database and a trimmed-down version of this data is exported to a sqlite DB for use in local development and other processes. The exported database contains all the same content, but deliberately omits sensitive info like user accounts, unpublished drafts and outmoded versions of pages.

The DB export is generated twice a day and is put into the same public cloud buckets we've used for years. Your local Bedrock or Springfield installation will just download the `bedrock-dev` or `springfield-dev` one as part of `make preflight`.

The DB will contain a table that knows the relative paths of the images uploaded to the CMS, but not the actual images. Those are in a cloud storage bucket, and if you want your local machine to have them available after you download the DB that expects them to be present, you can run `python manage.py download_media_to_local` which will sync down any images you don't already have.

By default, `make preflight` and `./bin/run-db-download.py` will download a database file based on `bedrock-dev` or `springfield-dev`. If you want to download from stage or prod, which are also available in sanitised form, you need to specify which environment you want by prefixing the command with `AWS_DB_S3_BUCKET=bedrock-db-stage` or `AWS_DB_S3_BUCKET=bedrock-db-prod` for Bedrock, and `AWS_DB_S3_BUCKET=springfield-db-stage` or  `AWS_DB_S3_BUCKET=springfield-db-prod` for Springfield, e.g.:

```
AWS_DB_S3_BUCKET=bedrock-db-stage make preflight
python manage.py download_media_to_local --environment=stage
```

## Infrastructure notes

### SSO authentication setup (deployed sites)

When the env vars `OIDC_RP_CLIENT_ID` and `OIDC_RP_CLIENT_SECRET` are present and `USE_SSO_AUTH` is set to True in settings, Bedrock and Springfield will use Mozilla SSO instead of Django's default username + password approach to sign in. The deployed sites will have these set, but we also have credentials available for using SSO locally if you need to develop something that needs it - see our password vault.

Note that Bedrock or Springfield in SSO mode will ``not`` support 'drive by' user creation even if they have an `@mozilla.com` identity. Only users who already exist in the Wagtail admin as a User will be allowed to log in. You can create new users using Django's [createsuperuser](https://docs.djangoproject.com/en/5.0/ref/django-admin/#createsuperuser) command, setting both the username and email to be your `flast@mozilla.com` LDAP address

### Non-SSO authentication for local builds

If you just want to use a username and password locally, you can - ensure those env vars above are not set, and use Django's [createsuperuser](https://docs.djangoproject.com/en/5.0/ref/django-admin/#createsuperuser) command to make an admin user in your local build.
