---
title: Manage Issues
eleventyNavigation:
    key: manage issues
    parent: maintain eslint
    title: Manage Issues
    order: 1

---

New issues are filed frequently, and how we respond to those issues directly affects the success of the project. Being part of the project team means helping to triage and address issues as they come in so the project can continue to run smoothly.

## Things to Keep in Mind

1. **Be nice.** Even if the people are being rude or aggressive on an issue, as a project team member you must be the mature one in the conversation. Do your best to work with everyone no matter their style. Remember, poor wording choice can also be a sign of someone who doesn't know English very well, so be sure to consider that when trying to determine the tone of someone's message. Being rude, even when someone is being rude to you, reflects poorly on the team and the project as a whole.
1. **Be inquisitive.** Ask questions on the issue whenever something isn't clear. Don't assume you understand what's being reported if there are details missing. Whenever you are unsure, it's best to ask for more information.
1. **Not all requests are equal.** It's unlikely we'll be able to accommodate every request, so don't be afraid to say that something doesn't fit into the scope of the project or isn't practical. It's better to give such feedback if that's the case.
1. **Close when appropriate.** Don't be afraid to close issues that you don't think will be done, or when it's become clear from the conversation that there's no further work to do. Issues can always be reopened if they are closed incorrectly, so feel free to close issues when appropriate. Just be sure to leave a comment explaining why the issue is being closed (if not closed by a commit).

## Types of Issues

There are four primary issue categories:

1. **Bug** - something isn't working the way it's expected to work.
1. **Enhancement** - a change to something that already exists. For instance, adding a new option to an existing rule or a bug in a rule where fixing it will result in the rule reporting more problems (in this case, use both "Bug" and "Enhancement").
1. **Feature** - adding something that doesn't already exist. For example, adding a new rule, new formatter, or new command line flag.
1. **Question** - an inquiry about how something works that won't result in a code change. We'd prefer if people use the mailing list or chatroom for questions, but sometimes they'll open an issue.

The first goal when evaluating an issue is to determine which category the issue falls into.

## Triaging Process

All of ESLint's issues, across all GitHub repositories, are managed on our [Triage Project](https://github.com/orgs/eslint/projects/2). Please use the Triage project instead of the issues list when reviewing issues to determine what to work on. The Triage project has several columns:

* **Needs Triage** - issues that have not yet been reviewed by anyone
* **Triaging** - issues that someone has reviewed but has not been able to fully triage yet
* **Ready for Dev Team** - issues that have been triaged and have all of the information necessary for the dev team to take a look
* **Evaluating** - the dev team is evaluating these issues to determine whether to move forward or not
* **Feedback Needed** - a team member is requesting more input from the rest of the team before proceeding
* **Waiting for RFC** - the next step in the process is for an RFC to be written
* **RFC Opened** - an RFC is opened to address these issues
* **Blocked** - the issue can't move forward due to some dependency
* **Ready to Implement** - these issues have all of the details necessary to start implementation
* **PR Opened** - there is an open pull request for each of these issues
* **Completed** - the issue has been closed (either via pull request merge or by the team manually closing the issue)

We make every attempt to automate movement between as many columns as we can, but sometimes moving issues needs to be done manually.

### When an Issue is Opened

When an issue is opened, it is automatically added to the "Needs Triage" column in the Triage project. These issues need to be evaluated to determine next steps. Anyone on the support team or dev team can follow these steps to properly triage issues.

**Note:** If an issue is in the "Triaging" column, that means someone is already triaging it and you should let them finish. There's no need to comment on issues in the "Triaging" column unless someone asks for help.

The steps for triaging an issue are:

1. Move the issue from "Needs Triage" to "Triaging" in the Triage project
1. Check: Has all of the information in the issue template been provided?
    * **No:** If information is missing from the issue template, or you can't tell what is being requested, please ask the author to provide the missing information:
        * Add the "needs info" label to the issue so we know that this issue is stalled due to lack of information.
        * Don't move on to other steps until the necessary information has been provided.
        * If the issue author hasn't provided the necessary information after 7 days, please close the issue. The bot will add a comment stating that the issue was closed because there was information missing.
    * **Yes:**
        * If the issue is actually a question (rather than something the dev team needs to change), please [convert it to a discussion](https://docs.github.com/en/free-pro-team@latest/discussions/managing-discussions-for-your-community/moderating-discussions#converting-an-issue-to-a-discussion). You can continue the conversation as a discussion.
        * If the issue is reporting a bug, try to reproduce the issue following the instructions in the issue. If you can reproduce the bug, please add the "repro:yes" label. (The bot will automatically remove the "repro:needed" label.) If you can't reproduce the bug, ask the author for more information about their environment or to clarify reproduction steps.
        * If the issue is reporting something that works as intended, please add the "works as intended" label and close the issue.
        * For all issues, please add labels describing the part of ESLint affected:
            * "3rd party plugin" - related to third-party functionality (plugins, parsers, rules, etc.)
            * "build" - related to commands run during a build (testing, linting, release scripts, etc.)
            * "cli" - related to command line input or output, or to `CLIEngine`
            * "core" - related to internal APIs
            * "documentation" - related to content on eslint.org
            * "infrastructure" - related to resources needed for builds or deployment (VMs, CI tools, bots, etc.)
            * "rule" - related to core rules
        * If you can't properly triage the issue, move the issue back to the "Needs Triage" column in the Triage project so someone else can triage it
        * If you have triaged the issue, move the issue to the "Ready for Dev Team" column in the Triage project

## Evaluation Process

When an issue has been moved to the "Ready for Dev Team" column, any dev team member can pick up the issue to start evaluating it.

1. Move the issue into the "Evaluating" column.
1. Next steps:
    * **Bugs:** if you can verify the bug, add the "accepted" label and ask if they would like to submit a pull request.
    * **New Rules:** if you are willing to champion the rule (meaning you believe it should be included in ESLint core and you will take ownership of the process for including it), add a comment saying you will champion the issue, assign the issue to yourself, and follow the [guidelines](#championing-issues) below.
    * **Rule Changes:** if you are willing to champion the change and it would not be a breaking change (requiring a major version increment), add a comment saying that you will champion the issue, assign the issue to yourself, and follow the [guidelines](#championing-issues) below.
    * **Breaking Changes:** if you suspect or can verify that a change would be breaking, label it as "Breaking".
    * **Duplicates:** if you can verify the issue is a duplicate, add a comment mentioning the duplicate issue (such as, "Duplicate of #1234") and close the issue.
1. Regardless of the above, always leave a comment. Don't just add labels, engage with the person who opened the issue by asking a question (request more information if necessary) or stating your opinion of the issue. If it's a verified bug, ask if the user would like to submit a pull request.
1. If the issue can't be implemented because it needs an external dependency to be updated or needs to wait for another issue to be resolved, move the issue to the "Blocked" column.
1. If the issue has been accepted and an RFC is required as the next step, move the issue to the "Waiting for RFC" column and comment on the issue that an RFC is needed.

**Note:** "Good first issue" issues are intended to help new contributors feel welcome and empowered to make a contribution to ESLint. To ensure that new contributors are given a chance to work on these issues, issues labeled "good first issue" must be open for 30 days *from the day the issue was labeled* before a team member is permitted to work on them.

## Accepting Issues

Issues may be labeled as "accepted" when the issue is:

* A bug that you've been able to reproduce and verify (i.e. you're sure it's a bug)
* A new rule or rule change that you're championing and [consensus](#consensus) has been reached for its inclusion in the project

The "accepted" label will be added to other issues by a TSC member if it's appropriate for the roadmap.

When an issue is accepted and implementation can begin, it should be moved to the "Ready to Implement" column.

## Championing Issues

New rules and rule changes require a champion. As champion, it's your job to:

* Gain [consensus](#consensus) from the ESLint team on inclusion
* Guide the rule creation process until it's complete (so only champion a rule that you have time to implement or help another contributor implement)

Once consensus has been reached on inclusion, add the "accepted" and, optionally, "help wanted" and "good first issue" labels, as necessary.

## Consensus

Consensus is reached on issues when there are at least three team members who believe the change is a good idea and no one who believes the change is a bad idea. In order to indicate your support for an issue, leave a +1 reaction (thumbs up) on the original issue description in addition to any comments you might have.

## When to Send to TSC

If consensus cannot be reached on an issue, or an issue's progress has been stalled and it's not clear if the issue should be closed, then you can refer the issue to the TSC for resolution. To do so, add the "tsc agenda" label to the issue and add a comment including the following information:

1. A one-paragraph summary of the discussion to this point.
2. The question you would like the TSC to answer.

The issue will be discussed at the next TSC meeting and the resolution will be posted back to the issue.

## Evaluating Core Features and Enhancements (TSC members only)

In addition to the above, changes to the core (including CLI changes) that would result in a minor or major version release must be approved by the TSC by standard TSC motion. Add the label "tsc agenda" to the issue and it will be discussed at the next TSC meeting. In general, requests should meet the following criteria to be considered:

1. The feature or enhancement is in scope for the project and should be added to the roadmap
1. Someone is committed to including the change within the next year
1. There is reasonable certainty about who will do the work

When a suggestion is too ambitious or would take too much time to complete, it's better not to accept the proposal. Stick to small, incremental changes and lay out a roadmap of where you'd like the project to go eventually. Don't let the project get bogged down in big features that will take a long time to complete.

**Breaking Changes:** Be on the lookout for changes that would be breaking. Issues that represent breaking changes should be labeled as "breaking".

## When to Close an Issue

All team members are allowed to close issues depending on how the issue has been resolved.

Team members may close an issue **immediately** if:

1. The issue is a duplicate of an existing issue.
1. The issue is just a question and has been answered.

Team members may close an issue where the consensus is to not accept the issue after a waiting period (to ensure that other team members have a chance to review the issue before it is closed):

* Wait **2 days** if the issue was opened Monday through Friday.
* Wait **3 days** if the issue was opened on Saturday or Sunday.

In an effort to keep the issues backlog manageable, team members may also close an issue if the following conditions are met:

* **Unaccepted**: Close after it has been open for 21 days, as these issues do not have enough support to move forward.
* **Accepted**: Close after 90 days if no one from the team or the community is willing to step forward and own the work to complete to it.
* **Help wanted:** Close after 90 days if it has not been completed.
