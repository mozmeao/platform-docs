# Databases

Pretty typically, Bedrock and Springfield use a relational database to hold the data they use to render pages. We have processes that ingest data from various sources for different pages (e.g. Legal Docs in Bedrock, Release notes in Springfield), plus CMS content from Wagtail, but all the data ends up in the DB.

For a long time, we used to use Sqlite in production, because our public-facing sites are basically read-only and sqlite is an excellent 'hot cache' of data. This sqlite database was updated every 10 mins.

However, once we moved to using a CMS in our production sides, we returned to a traditional networked-and-replicated-database approach to ensure that we could get contnet updates live as fast as possible.

We do still use sqlite where appropriate, though - read on.

## Database engine

Depending on how the project is being run, the database in question is either Postgres or Sqlite:

* In production mode (Dev, Stage and Prod), we use Postgres. We do not port data bewtween environments.
* Our demo servers use Postgres. The data is not auto-synced from any other environments. See [this note on how to reset a demo's database](demos.md#resetting-databases) if need be.
* Our integration-test environments run Sqlite (because it never needs to accept writes and it gets constantly replaced with fresh data on each test build - more on this below).
* Local builds, by default, use Sqlite, regardless of whether you're working using Docker or on 'bare metal' - this makes it possible to get a copy of Dev, Stage or Prod data to work on things locally.

## Sqlite database exports from postgres

For both Bedrock and Springfield we automatically generate a trimmed-down of the Postgres databases used by Dev, Stage and Production. The exported Sqlite database file contains all of the same content, but deliberately omits sensitive info, including user accounts and unpublished or old CMS pages.

The DB export is generated twice a day at 0100 and 1300 UTC and - because the data is all public-only anyway - it is put into the same public cloud buckets we used when the entire platform was run using sqlite.

When a Docker image is built for a new release (whether that's a merge to `main` or a prod release, etc) a copy of the sqlite DB for that environment is copied down from the bucket and embedded in the container image. This is so that it's possible to just start the site and have data present - particularly useful for integration tests and for getting community contributors rolling quickly.

### Getting hold of the databases when developing locally

Your local Bedrock or Springfield installation will just download the Bedrock Dev or Springfield Dev one as part of `make preflight`.

The DB will contain a table that knows the relative paths of the images uploaded to the CMS, but not the actual images. Those are in a cloud storage bucket. To get the images if you need them, see [this documentation](../cms/images.md#ive-downloaded-a-fresh-db-and-the-images-are-missing)

By default, `make preflight` or `./bin/run-db-download.py` will download a database file based on Bedrock Dev or Springfield Dev. If you want to download data from Stage or Prod, which are also available in sanitised form, you need to specify which environment you want by prefixing the command with `AWS_DB_S3_BUCKET=bedrock-db-stage`,  `AWS_DB_S3_BUCKET=bedrock-db-prod`.
`AWS_DB_S3_BUCKET=springfield-db-stage` or  `AWS_DB_S3_BUCKET=springfield-db-prod`.

e.g. `AWS_DB_S3_BUCKET=bedrock-db-stage make preflight python manage.py download_media_to_local --environment=stage`

## Ensuring new data gets exported to sqlite

By default, we use an allowlist pattern when selecting what to export from Postgres to Sqlite. This is to help avoid sensitive data accidentally being included in exports. The trade-off is you need to remember to expand the allowlist in the export script when you do add a new model type.

The script is `bin/export-db-to-sqlite.sh` and you need to add your new model to the list of models being exported. Search for `MAIN LIST OF MODELS BEING EXPORTED` and add your model (in the format `appname.ModelName`) there.
