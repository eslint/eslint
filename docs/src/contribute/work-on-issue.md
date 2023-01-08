---
title: Work on Issues
eleventyNavigation:
    key: work on issues
    parent: contribute to eslint
    title: Work on Issues
    order: 8
---

Our public [issues tracker](https://github.com/eslint/eslint/issues) lists all of the things we plan on doing as well as suggestions from the community. Before starting to work on an issue, be sure you read through the rest of this page.

## Issue Labels

We use labels to indicate the status of issues. The most complete documentation on the labels is found in the [Maintainer Guide](../maintain/manage-issues#when-an-issue-is-opened), but most contributors should find the information on this page sufficient. The most important questions that labels can help you, as a contributor, answer are:

1. Is this issue available for me to work on? If you have little or no experience contributing to ESLint, the [`good first issue`](https://github.com/eslint/eslint/labels/good%20first%20issue) label marks appropriate issues. Otherwise, the [`help wanted`](https://github.com/eslint/eslint/labels/help%20wanted) label is an invitation to work on the issue. If you have more experience, you can try working on other issues labeled [`accepted`](https://github.com/eslint/eslint/labels/accepted). Conversely, issues not yet ready to work on are labeled `triage`, `evaluating`, and/or `needs bikeshedding`, and issues that cannot currently be worked on because of something else, such as a bug in a dependency, are labeled `blocked`.
1. What is this issue about? Labels describing the nature of issues include `bug`, `enhancement`, `feature`, `question`, `rule`, `documentation`, `core`, `build`, `cli`, `infrastructure`, `breaking`, and `chore`. These are documented in the [Maintainer Guide](../maintain/manage-issues#types-of-issues).
1. What is the priority of this issue? Because we have a lot of issues, we prioritize certain issues above others. The following is the list of priorities, from highest to lowest:

    1. **Bugs** - problems with the project are actively affecting users. We want to get these resolved as quickly as possible.
    1. **Documentation** - documentation issues are a type of bug in that they actively affect current users. As such, we want to address documentation issues as quickly as possible.
    1. **Features** - new functionality that will aid users in the future.
    1. **Enhancements** - requested improvements for existing functionality.
    1. **Other** - anything else.

    Some issues have had monetary rewards attached to them. Those are labeled `bounty`. Bounties are assigned via [BountySource](https://www.bountysource.com/teams/eslint/issues).

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
