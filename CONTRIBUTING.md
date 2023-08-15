# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners and maintainers of this repository before making a change.

**NEVER PUSH CHANGES TO MAIN. IF YOU WANT TO CHANGE CODE, PLEASE CREATE A NEW BRANCH AND A MERGE REQUEST. NEVER PUSH ANY SECRETS TO THE REPOSITORY. PLEASE SIGN YOUR COMMIT WITH A GPG KEY.**

## Dos And Don'ts

- **Do not** push changes to the main branch.
- **Do not** merge your own merge requests without approval.
- **Do** follow the conventions below.
- **Do** make each change a separate commit.

## New Change Process

1. Create a new branch (preferably from `main`)
2. Apply your changes in the newly created branch
3. Push your new branch with the committed changes to the remote repository
4. Create a merge request from your new branch to `main`
5. Once the merge request is approved, merge the branch to `main`

## New Branch Naming Convention

Please use the following naming convention for new branches:

`<type>/<description>`

Where `<type>` is one of the following:

| Type       | When to use            |
| ---------- | ---------------------- |
| `feature`  | A new feature          |
| `fix`      | A bug fix              |
| `hotfix`   | A critical bug fix     |
| `refactor` | A code refactor        |
| `docs`     | A documentation change |
| `test`     | A test change          |
| `chore`    | A chore change         |

When you need to use spaces, use `-` instead. For example, `feature/add-new-feature`.

Always use lowercase ASCII letters only!

## Commit Message Convention

When creating a commit, please, use the conventional commit message format. This will help us to generate changelogs and release notes automatically.

Use this format at all times: <https://www.conventionalcommits.org/en/v1.0.0/>

## Pre-commit scripts

To prevent unnecessary waits, resource use, and commits when interacting with this repository's CI pipeline, a set of `pre-commit` scripts are available in the `ci/pre-commit` directory. These scripts can automatically run before every commit to simulate some of the pipeline actions on your machine and report any problems.

To enable them, follow the `pre-commit` Quick Start steps from [this link](https://pre-commit.com/#quick-start).

## Give Credit

If you are working together with someone else, please give credit to them in the commit message. This will help us to keep track of who did what.

To do so, please add each contributes name and email address to the commit message:

```text
Co-authored-by: NAME <email>
```

The name and email should the the commit author's name and email address.

## Create A Merge Request

Once you have pushed your changes to the remote repository, create a merge request from your branch to `main`.

When creating a merge request, name it with the following rules:

- Use spaces instead of `-`
- Capitalize the first letter of the first word
- The tile sums up the main idea of the merge request
- The first words should indicate the type of change in present tense (Add, Fix, Refactor, etc.)
