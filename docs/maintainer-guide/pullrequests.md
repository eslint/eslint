# Reviewing Pull Requests

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

1. Double-check that the commit message tag ("Fix:", "New:", etc.) is correct based on the issue (or, if no issue is referenced, based on the stated problem).
1. If the pull request makes a change to core, ensure that an issue exists and the pull request references the issue in the commit message.
1. Does the code follow our conventions (including header comments, JSDoc comments, etc.)? If not, please leave that feedback and reference the conventions document.
1. For code changes:
    * Are there tests that verify the change? If not, please ask for them.
    * Is documentation needed for the change? If yes, please let the submitter know.
1. Are there any automated testing errors? If yes, please ask the submitter to check on them.
1. If you've reviewed the pull request and there are no outstanding issues, leave a comment "LGTM" to indicate your approval. If you would like someone else to verify the change, comment "LGTM but would like someone else to verify."

**Note:** If you are a team member and you've left a comment on the pull request, please follow up to verify that your comments have been addressed.

## Who Can Merge a Pull Request

TSC members and committers may merge pull requests, depending on the contents of the pull request.

Committers may merge a pull request if it is a non-breaking change and is:

1. A documentation change
1. A bug fix (for either rules or core)
1. A dependency upgrade
1. Related to the build tool
1. A chore

In addition, committers may merge any non-breaking pull request if it has been approved by at least one TSC member.

TSC members may merge all pull requests, including those that committers may merge.

## When to Merge a Pull Request

We use the "Merge" button to merge requests into the repository. Before merging a pull request, verify that:

1. All comments have been addressed
1. Any team members who made comments have verified that their concerns were addressed
1. All automated tests are passing (never merge a pull request with failing tests)

Be sure to say thank you to the submitter before merging, especially if they put a lot of work into the pull request.

Team members may merge a pull request immediately if it:

1. Makes a small documentation change
1. Is a chore
1. Fixes a block of other work on the repository (build-related, test-related, dependency-related, etc.)
1. Is an important fix to get into a patch release

Otherwise, team members should observe a waiting period before merging a pull request:

* Wait **2 days** if the pull request was opened Monday through Friday.
* Wait **3 days** if the pull request was opened on Saturday or Sunday.

The waiting period ensures that other team members have a chance to review the pull request before it is merged.

If the pull request was created from a branch on the `eslint/eslint` repository (as opposed to a fork), delete the branch after merging the pull request. (GitHub will display a "Delete branch" button after the pull request is merged.)

**Note:** You should not merge your own pull request unless you're received feedback from at least one other team member.

## When to Close a Pull Request

There are several times when it's appropriate to close a pull request without merging:

1. The pull request addresses an issue that is already fixed
1. The pull request hasn't been updated in 30 days
1. The pull request submitter isn't willing to follow project guidelines.

In any of these cases, please be sure to leave a comment stating why the pull request is being closed.

### Example Closing Comments

If a pull request hasn't been updated in 30 days:

> Closing because there hasn't been activity for 30 days. If you're still interested in submitting this code, please feel free to resubmit.

If a pull request submitter isn't willing to follow project guidelines.

> Unfortunately, we can't accept pull requests that don't follow our guidelines. I'm going to close this pull request now, but if you'd like to resubmit following our guidelines, we'll be happy to review.
