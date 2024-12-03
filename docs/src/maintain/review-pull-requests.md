---
title: Review Pull Requests
eleventyNavigation:
    key: review pull requests
    parent: maintain eslint
    title: Review Pull Requests
    order: 3

---

Pull requests are submitted frequently and represent our best opportunity to interact with the community. As such, it's important that pull requests are well-reviewed before being merged and that interactions on pull requests are positive.

## Who Can Review Pull Requests?

Anyone, both team members and the public, may leave comments on pull requests.

## Reviewing a Pull Request

When a pull request is opened, the bot will check the following:

1. Has the submitter signed a CLA?
1. Is the commit message summary in the correct format?
1. Is the commit summary too long?

The bot will add a comment specifying the problems that it finds. You do not need to look at the pull request any further until those problems have been addressed (there's no need to comment on the pull request to ask the submitter to do what the bot asked - that's why we have the bot!).

Once the bot checks have been satisfied, you check the following:

1. Double-check that the pull request title is correct based on the issue (or, if no issue is referenced, based on the stated problem).
1. If the pull request makes a change to core, ensure that an issue exists and the pull request references the issue in the commit message.
1. Does the code follow our conventions (including header comments, JSDoc comments, etc.)? If not, please leave that feedback and reference the [Code Conventions](../contribute/code-conventions) documentation.
1. For code changes:
    * Are there tests that verify the change? If not, please ask for them.
    * Is documentation needed for the change? If yes, please ask the submitter to add the necessary documentation.
1. Are there any automated testing errors? If yes, please ask the submitter to check on them.
1. If you've reviewed the pull request and there are no outstanding issues, leave a comment "LGTM" to indicate your approval. If you would like someone else to verify the change, comment "LGTM but would like someone else to verify."

**Note:** If you are a team member and you've left a comment on the pull request, please follow up to verify that your comments have been addressed.

## Required Approvals for Pull Requests

Any committer, reviewer, or TSC member may approve a pull request, but the approvals required for merging differ based on the type of pull request.

One committer approval is required to merge a non-breaking change that is:

1. A documentation change
1. A bug fix (for either rules or core)
1. A dependency upgrade
1. Related to the build
1. A chore

For a non-breaking feature, pull requests require approval from one reviewer or TSC member, plus one additional approval from any other team member.

For a breaking change, pull requests require an approval from two TSC members.

::: important
If you approve a pull request and don't merge it, please leave a comment explaining why you didn't merge it. You might say something like, "LGTM. Waiting three days before merging." or "LGTM. Requires TSC member approval before merging." or "LGTM. Would like another review before merging.".
:::

## Moving a Pull Request Through the Triage Board

When a pull request is created, whether by a team member or an outside contributor, it is placed in the "Needs Triage" column of the Triage board automatically. The pull request should remain in that column until a team member begins reviewing it.

If the pull request does not have a related issue, then it should be moved through the normal [triage process for issues](./manage-issues) to be marked as accepted. Once accepted, move the pull request to the "Implementing" column.

If the pull request does have a related issue, then:

* If the issue is accepted, move the pull request to the "Implementing" column.
* If the issue is not accepted, move the pull request to the "Evaluating" column until the issue is marked as accepted, at which point move the pull request to "Implementing".

Once the pull request has one approval, one of three things can happen:

1. The pull request has the required approvals and the waiting period (see below) has passed so it can be merged.
1. The pull request has the required approvals and the waiting period has not passed, so it should be moved to the "Merge Candidates" column.
1. The pull request requires another approval before it can be merged, so it should be moved to the "Second Review Needed" column.

When the pull request has a second approval, it should either be merged (if 100% ready) or moved to the "Merge Candidates" column if there are any outstanding concerns that should be reviewed before the next release.

## Who Can Merge a Pull Request

TSC members, reviewers, committers, and website team members may merge pull requests, depending on the contents of the pull request, once it has received the required approvals.

Website Team Members may merge a pull request in the `eslint.org` repository if it is:

1. A documentation change
1. A dependency upgrade
1. A chore

## When to Merge a Pull Request

We use the "Merge" button to merge requests into the repository. Before merging a pull request, verify that:

1. All comments have been addressed.
1. Any team members who made comments have verified that their concerns were addressed.
1. All automated tests are passing (never merge a pull request with failing tests).

Be sure to say thank you to the submitter before merging, especially if they put a lot of work into the pull request.

Team members may merge a pull request immediately if it:

1. Makes a small documentation change.
1. Is a chore.
1. Fixes a block of other work on the repository (build-related, test-related, dependency-related, etc.).
1. Is an important fix to get into a patch release.

Otherwise, team members should observe a waiting period before merging a pull request:

* Wait **2 days** if the pull request was opened Monday through Friday.
* Wait **3 days** if the pull request was opened on Saturday or Sunday.

The waiting period ensures that other team members have a chance to review the pull request before it is merged.

**Note:** You should not merge your pull request unless you receive the required approvals.

## When to Close a Pull Request

There are several times when it's appropriate to close a pull request without merging:

1. The pull request addresses an issue that is already fixed.
1. The pull request hasn't been updated in 17 days.
1. The pull request submitter isn't willing to follow project guidelines.

In any of these cases, please be sure to leave a comment stating why the pull request is being closed.

### Example Closing Comments

If a pull request hasn't been updated in 17 days:

> Closing because there hasn't been activity for 17 days. If you're still interested in submitting this code, please feel free to resubmit.

If a pull request submitter isn't willing to follow project guidelines.

> Unfortunately, we can't accept pull requests that don't follow our guidelines. I'm going to close this pull request now, but if you'd like to resubmit following our guidelines, we'll be happy to review.
