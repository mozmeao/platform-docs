# Writing Migrations

Bedrock and Springfield use Django's built-in Migrations framework for its database migrations, and have no custom database routing, etc. So, no big surprises here -- write things as you regularly would.

*However*, as with any complex system, care needs to be taken with schema changes that drop or rename database columns. Due to the way the rollout process works (ask for details directly from the team), an absent column can cause some of the rollout to enter a crashloop.

To avoid this, split your changes across releases, such as below.

## Column Renames

- Release 1: Add your new column
- Release 2: Amend the codebase to use it instead of the old column
- Release 3: Clean up - drop the old, deprecated column, which should not be referenced in code at this point.

## Column Drops

- Release 1: Update all code that uses the relevant column, so that nothing interacts with it any more.
- Release 2: Clean up - drop the old, deprecated column.

With both paths, check for any custom schema or data migrations that might reference the deprecated column.
