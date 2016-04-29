# Managing Issues

New issues are filed frequently, and how we respond to those issues directly affects the success of the project. Being part of the project team means helping to triage and address issues as they come in so the project can continue to run smoothly.

## Things to Keep in Mind

1. **Be nice.** Even if the people are being rude or aggressive on an issue, as a project team member you must be the mature one in the conversation. Do your best to work with everyone no matter their style. Remember, poor wording choice can also be a sign of someone who doesn't know English very well, so be sure to consider that when trying to determine the tone of someone's message. Being rude, even when someone is being rude to you, reflects poorly on the team and the project as a whole.
1. **Be inquisitive.** Ask questions on the issue whenever something isn't clear. Don't assume you understand what's being reported if there are details missing. Whenever you are unsure, it's best to ask for more information.
1. **Not all requests are equal.** It's unlikely we'll be able to accommodate every request, so don't be afraid to say that something doesn't fit into the scope of the project or isn't practical. It's better to give such feedback if that's the case.
1. **Close when appropriate.** Don't be afraid to close issues that you don't think will be done, or when it's become clear from the conversation that there's no further work to do. Issues can always be reopened if they are closed incorrectly, so feel free to close issues when appropriate. Just be sure to leave a comment explaining why the issue is being closed (if not closed by a commit).

## Types of Issues

There are four primary issue categories:

1. **Bug** - something isn't working the way it's expected to work.
1. **Enhancement** - a change to something that already exists. For instance, adding a new option to an existing rule.
1. **Feature** - adding something that doesn't already exist. For example, adding a new rule, new formatter, or new command line flag.
1. **Question** - an inquiry about how something works that won't result in a code change. We'd prefer if people use the mailing list or chatroom for questions, but sometimes they'll open an issue.

The first goal when evaluating an issue is to determine which category the issue falls into.

## When an Issue is Opened

When an issue is opened, the bot will automatically apply the "triage" label. Issues labeled with "triage" are the ones that need to be looked at by team members to determine what to do next.

The steps for triaging an issue are:

1. Is it clear what is being requested?
    * No: add the "needs info" label to the issue. The bot will add a comment asking for more information. You don't need to comment any further until the person who opened the issue responds with the information requested from the bot.
    * Yes:
        * Remove the "triage" label
        * Label questions with the "question" label
        * Label bug reports with the "bug" label (also use the "accepted" label if you can reproduce and verify the bug, otherwise add the "evaluating" label to indicate someone needs to verify)
        * Label requests for changes to existing features (new rule options, new configuration options, etc.) with the "enhancement" and "evaluating" labels
        * Label requests for completely new features (new rules, supporting a new file format, etc.) with the "feature" and "evaluating" labels
        * Use an appropriate label for the part of the project the issue refers to:
            * "build" - related to commands run during a build (testing, linting, release scripts, etc.)
            * "cli" - related to command line input or output, or to `CLIEngine`
            * "core" - related to internal APIs
            * "documentation" - related to content on eslint.org
            * "infrastructure" - related to resources needed for builds or deployment (VMs, CI tools, bots, etc.)
1. Once it's clear what type of issue it is, make sure all of the relevant information is provided:
    * **Bugs**: See [bug reporting guidelines](/docs/developer-guide/contributing/reporting-bugs)
    * **New Rules:** See [rule proposal guidelines](/docs/developer-guide/contributing/new-rules)
    * **Rule Changes:** See [rule change proposal guidelines](/docs/developer-guide/contributing/rule-changes)
    * **Other Changes:** See [change proposal guidelines](http://eslint.org/docs/developer-guide/contributing/changes)
1. Next steps:
    * **Questions:** answer the question and close the issue when the conversation is over.
    * **Bugs:** if you can verify the bug, add the "accepted" label and ask if they would like to submit a pull request.
    * **New Rules:** if you are willing to champion the rule (meaning you believe it should be included in ESLint core and you will take ownership of the process for including it), then add a comment saying you will champion the issue. As the champion, it's your job to gain consensus from the ESLint team on inclusion, guide the rule creation process until it's complete, so only champion a rule that you have time to implement or help another contributor implement. Once consensus has been reached on inclusion, add the "accepted" and "help wanted" labels.
    * **Rule Changes:** if you are willing to champion the change, and the change would not be breaking (requiring a major version increment), then add a comment saying that you will champion the issue. As with new rules, the champion is expected to gain consensus from the ESLint team on inclusion and to guide the change through to completion. Once consensus has been reached on inclusion, add the "accepted" and "help wanted" labels.
    * **Breaking Changes:** if you suspect or can verify that a change would be breaking, label it as "Breaking".
    * **Duplicates:** if you can verify the issue is a duplicate, add a comment mentioning the duplicate issue (such as, "Duplicate of #1234") and close the issue.
1. Regardless of the above, always leave a comment. Don't just add labels, engage with the person who opened the issue by asking a question (request more information if necessary) or stating your opinion of the issue. If it's a verified bug, ask if the user would like to submit a pull request.

**Note:** Don't add an "accepted" label to an issue unless it's a bug that you've been able to reproduce and verify (you're sure it's a bug), a new rule that you're championing, or a rule change that you're championing. The "accepted" label will be added to other issues by a project lead if it's appropriate for the roadmap.

## Evaluating Core Features and Enhancements (Project Leads Only)

If you're a project lead, then you'll need to evaluate incoming requests for inclusion in the formal roadmap. You should label an issue as "accepted" when all of the following are true:

1. The feature or enhancement is in scope for the project and should be added to the roadmap
1. You are committed to including the change within the next year
1. You are reasonably certain of who will do the work

When a suggestion is too ambitious or would take too much time to complete, it's better not to accept the proposal. Stick to small, incremental changes and lay out a roadmap of where you'd like the project to go eventually. Don't let the project get bogged down in big features that will take a long time to complete.

**Help Wanted:** If there's an issue you'd like to see completed, but don't believe it's something the project team should address, add the "help wanted" label. The "help wanted" label indicates that while the project team won't be implementing the suggestion, a pull request will be accepted.

**Breaking Changes:** Be on the lookout for changes that would be breaking. Issues that represent breaking changes should be labeled as "breaking".

## When to Close an Issue

Any team member may close an issue if any of the following is true:

1. The issue is a duplicate of an existing issue
1. The issue is just a question and has been answered
1. The issue has been open for a year or more with no sign of progress
1. No one has committed to working on the issue for the roadmap within 30 days of being labeled "accepted"
1. The request is outside the scope of the project

In general, it's better to close issues sooner rather than later. It gives people better feedback about the issue affects the project roadmap.

## Consensus

Consensus is reached on issues when there are at least three team members who believe the change is a good idea and no one who believes the change is a bad idea. If consensus cannot be reached, then a consensus among reviewers must be achieved where no one believes it is a bad idea. If consensus among reviewers cannot be achieved, the reviewers will vote and majority wins.
