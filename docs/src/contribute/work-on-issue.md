---
title: Work on Issues
eleventyNavigation:
    key: work on issues
    parent: contribute to eslint
    title: Work on Issues
    order: 9
---

Our public [issues tracker](https://github.com/eslint/eslint/issues) lists all of the things we plan on doing as well as suggestions from the community. Before starting to work on an issue, be sure you read through the rest of this page.

## Issue Labels

We use labels to indicate the status of issues. The most complete documentation on the labels is found in the [Maintain ESLint documentation](../maintain/manage-issues#when-an-issue-or-pull-request-is-opened), but most contributors should find the information on this page sufficient. The most important questions that labels can help you, as a contributor, answer are:

1. **Is this issue ready for a pull request?** Issues that are ready for pull requests have the [`accepted`](https://github.com/eslint/eslint/labels/accepted) label, which indicates that the team has agreed to accept a pull request. Please do not send pull requests for issues that have not been marked as accepted.
2. **Is this issue right for a beginner?** If you have little or no experience contributing to ESLint, the [`good first issue`](https://github.com/eslint/eslint/labels/good%20first%20issue) label marks appropriate issues. Otherwise, the [`help wanted`](https://github.com/eslint/eslint/labels/help%20wanted) label is an invitation to work on the issue. If you have more experience, you can try working on other issues labeled [`accepted`](https://github.com/eslint/eslint/labels/accepted).
3. **What is this issue about?** Labels describing the nature of issues include `bug`, `enhancement`, `feature`, `question`, `rule`, `documentation`, `core`, `build`, `cli`, `infrastructure`, `breaking`, and `chore`. These are documented in [Maintain ESLint](../maintain/manage-issues#types-of-issues-and-pull-requests).
4. **What is the priority of this issue?** Because we have a lot of issues, we prioritize certain issues above others. The following is the list of priorities, from highest to lowest:

    1. **Bugs** - problems with the project are actively affecting users. We want to get these resolved as quickly as possible.
    1. **Documentation** - documentation issues are a type of bug in that they actively affect current users. As such, we want to address documentation issues as quickly as possible.
    1. **Features** - new functionality that will aid users in the future.
    1. **Enhancements** - requested improvements for existing functionality.
    1. **Other** - anything else.

## Starting Work

::: important
Before starting to work on an existing issue, please check if the issue has been assigned to anyone. If it has, then that person is already responsible for submitting a pull request and you should choose a different issue to work on.
:::

### Claiming an issue

If you're going to work on an issue, please _claim_ the issue by adding a comment saying you're working on it and indicating when you think you will complete it. This helps us to avoid duplication of effort. Some examples of good claim comments are:

- "I'll take a look at this over the weekend."
- "I'm going to do this, give me two weeks."
- "Working on this" (as in, I'm working on it right now)

The team will validate your claim by assigning the issue to you.

### Offering help on a claimed issue

If an issue has an assignee or has already been claimed by someone, please be respectful of that person's desire to complete the work and don't work on it unless you verify that they are no longer interested or would welcome the help. If there hasn't been activity on the issue after two weeks, you can express your interest in helping with the issue. For example:

- "Are you still working on this? If not, I'd love to work on it."
- "Do you need any help on this? I'm interested."

It is up to the assignee to decide if they're going to continue working on the issue or if they'd like your help.

If there is no response after a week, please contact a team member for help.

### Unclaiming an issue

If you claimed an issue and find you can't finish the work, then add a comment letting people know, for example:

- "Sorry, it looks like I don't have time to do this."
- "I thought I knew enough to fix this, but it turns out I don't."

No one will blame you for backing out of an issue if you are unable to complete it. We just want to keep the process moving along as efficiently as possible.
