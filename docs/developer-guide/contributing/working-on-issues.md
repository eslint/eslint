# Working on Issues

Our public [issues tracker](https://github.com/eslint/eslint/issues) lists all of the things we plan on doing as well as suggestions from the community. Before starting to work on an issue, be sure you read through the rest of this page.

## Issue Labels

We use labels to indicate the status of issues. The most important labels are:

1. [`triage`](https://github.com/eslint/eslint/issues?labels=triage&milestone=&page=1&state=open) - When an issue is first submitted, it is labeled as `triage`, which means the ESLint team needs to investigate and determine if the request is a bug report, a feature request, or something else. It's best not to work on tickets marked as `triage`, because we're not yet sure if we will accept the issue to work on.
1. [`accepted`](https://github.com/eslint/eslint/issues?labels=accepted&milestone=&page=1&state=open) - Once an issue has been properly triaged and the team decides it must be addressed, someone will assign the `accepted` label to an issue. When an issue is accepted, anyone is free to work on it.
1. [`bug`](https://github.com/eslint/eslint/issues?labels=bug&milestone=&page=1&state=open) - Indicates that the issue is reporting a problem. When submitting a pull request to work on this type of issue, be sure to prefix the commit message with "Fix:".
1. [`feature`](https://github.com/eslint/eslint/issues?labels=feature&milestone=&page=1&state=open) - Indicates that the issue is requesting a new feature. Features are functionality that doesn't already exist in the project. When submitting a pull request to work on this type of issue, be sure to prefix the commit message with "New:".
1. [`enhancement`](https://github.com/eslint/eslint/issues?labels=enhancement&milestone=&page=1&state=open) - Indicates that the issue is requesting a change to existing functionality. When submitting a pull request to work on this type of issue, be sure to prefix the commit message with "Update:".
1. [`beginner`](https://github.com/eslint/eslint/issues?labels=beginner&milestone=&page=1&state=open) - Indicates that the issue is simple enough that it would be a good first contribution for a new contributor. If you're looking to get started helping out with ESLint, take a look at the beginner issues.
1. [`help wanted`](https://github.com/eslint/eslint/issues?labels=help%20wanted&milestone=&page=1&state=open) - Indicates that the core team won't be working on this issue, however, we will accept pull requests from contributors. This basically means the issue isn't on the formal roadmap but it will be accepted if a contributor wants to implement it.

## Bounty Issues

We accept and assign issue bounties using [BountySource](https://www.bountysource.com/teams/eslint/issues).

## Issue Priority

Because we have a lot of issues, we prioritize certain issues above others. The following is the list of priorities, from highest to lowest:

1. **Bugs** - problems with the project are actively affecting users. We want to get these resolved as quickly as possible.
1. **Documentation** - documentation issues are a type of bug in that they actively affect current users. As such, we want to address documentation issues as quickly as possible.
1. **Features** - new functionality that will aid users in the future.
1. **Enhancements** - requested improvements for existing functionality.
1. **Other** - anything else.

## Starting Work

If you're going to work on an issue, please add a comment to that issue saying so and indicating when you think you will complete it. It will help us to avoid duplication of effort. Some examples of good comments are:

* "I'll take a look at this over the weekend."
* "I'm going to do this, give me two weeks."
* "Working on this" (as in, I'm working on it right now)

If an issue has already been claimed by someone, please be respectful of that person's desire to complete the work and don't work on it unless you verify that they are no longer interested.

If you find you can't finish the work, then simply add a comment letting people know, for example:

* "Sorry, it looks like I don't have time to do this."
* "I thought I knew enough to fix this, but it turns out I don't."

No one will blame you for backing out of an issue if you are unable to complete it. We just want to keep the process moving along as efficiently as possible.
