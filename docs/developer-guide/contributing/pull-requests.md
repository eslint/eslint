# Pull Requests

If you want to contribute to an ESLint repo, please use a GitHub pull request. This is the fastest way for us to evaluate your code and to merge it into the code base. Please don't file an issue with snippets of code. Doing so means that we need to manually merge the changes in and update any appropriate tests. That decreases the likelihood that your code is going to get included in a timely manner. Please use pull requests.

## Getting Started

If you'd like to work on a pull request and you've never submitted code before, follow these steps:

1. Sign our [Contributor License Agreement](https://cla.js.foundation/eslint/eslint).
1. Set up a [development environment](../development-environment.md).
1. If you want to implement a breaking change or a change to the core, ensure there's an issue that describes what you're doing and the issue has been accepted. You can create a new issue or just indicate you're [working on an existing issue](working-on-issues.md). Bug fixes, documentation changes, and other pull requests do not require an issue.

After that, you're ready to start working on code.

## Working with Code

The process of submitting a pull request is fairly straightforward and generally follows the same pattern each time:

1. [Create a new branch](#step1)
2. [Make your changes](#step2)
3. [Rebase onto upstream](#step3)
4. [Run the tests](#step4)
5. [Double check your submission](#step5)
6. [Push your changes](#step6)
7. [Submit the pull request](#step7)

Details about each step are found below.

### Step 1: Create a new branch<a name="step1"></a>

The first step to sending a pull request is to create a new branch in your ESLint fork. Give the branch a descriptive name that describes what it is you're fixing, such as:

```
$ git checkout -b issue1234
```

You should do all of your development for the issue in this branch.

**Note:** Do not combine fixes for multiple issues into one branch. Use a separate branch for each issue you're working on.

### Step 2: Make your changes<a name="step2"></a>

Make the changes to the code and tests, following the [code conventions](../code-conventions.md) as you go. Once you have finished, commit the changes to your branch:

```
$ git add -A
$ git commit
```

Our commit message format is as follows:

```
Tag: Short description (fixes #1234)

Longer description here if necessary
```

The first line of the commit message (the summary) must have a specific format. This format is checked by our build tools.

The `Tag` is one of the following:

* `Fix` - for a bug fix.
* `Update` - either for a backwards-compatible enhancement or for a rule change that adds reported problems.
* `New` - implemented a new feature.
* `Breaking` - for a backwards-incompatible enhancement or feature.
* `Docs` - changes to documentation only.
* `Build` - changes to build process only.
* `Upgrade` - for a dependency upgrade.
* `Chore` - for refactoring, adding tests, etc. (anything that isn't user-facing).

Use the [labels of the issue you are working on](working-on-issues.md#issue-labels) to determine the best tag.

The message summary should be a one-sentence description of the change, and it must be 72 characters in length or shorter. If the pull request addresses an issue, then the issue number should be mentioned at the end. If the commit doesn't completely fix the issue, then use `(refs #1234)` instead of `(fixes #1234)`.

Here are some good commit message summary examples:

```
Build: Update Travis to only test Node 0.10 (refs #734)
Fix: Semi rule incorrectly flagging extra semicolon (fixes #840)
Upgrade: Esprima to 1.2, switch to using comment attachment (fixes #730)
```

The commit message format is important because these messages are used to create a changelog for each release. The tag and issue number help to create more consistent and useful changelogs.

### Step 3: Rebase onto upstream<a name="step3"></a>

Before you send the pull request, be sure to rebase onto the upstream source. This ensures your code is running on the latest available code.

```
git fetch upstream
git rebase upstream/master
```

### Step 4: Run the tests<a name="step4"></a>

After rebasing, be sure to run all of the tests once again to make sure nothing broke:

```
npm test
```

If there are any failing tests, update your code until all tests pass.

### Step 5: Double check your submission<a name="step5"></a>

With your code ready to go, this is a good time to double-check your submission to make sure it follows our conventions. Here are the things to check:

* Make sure your commit is formatted correctly.
* The pull request must have a description. The description should explain what you did and how its effects can be seen.
* The commit message is properly formatted.
* The change introduces no functional regression. Be sure to run `npm test` to verify your changes before submitting a pull request.
* Make separate pull requests for unrelated changes. Large pull requests with multiple unrelated changes may be closed without merging.
* All changes must be accompanied by tests, even if the feature you're working on previously had no tests.
* All user-facing changes must be accompanied by appropriate documentation.
* Follow the [Code Conventions](../code-conventions.html).

### Step 6: Push your changes<a name="step6"></a>

Next, push your changes to your clone:

```
git push origin issue1234
```

If you are unable to push because some references are old, do a forced push instead:

```
git push -f origin issue1234
```

### Step 7: Send the pull request<a name="step7"></a>

Now you're ready to send the pull request. Go to your ESLint fork and then follow the [GitHub documentation](https://help.github.com/articles/creating-a-pull-request) on how to send a pull request.

## Following Up

Once your pull request is sent, it's time for the team to review it. As such, please make sure to:

1. Monitor the status of the Travis CI build for your pull request. If it fails, please investigate why. We cannot merge pull requests that fail Travis for any reason.
1. Respond to comments left on the pull request from team members. Remember, we want to help you land your code, so please be receptive to our feedback.
1. We may ask you to make changes, rebase, or squash your commits.

### Updating the Commit Message

If your commit message is in the incorrect format, you'll be asked to update it. You can do so via:

```
$ git commit --amend
```

This will open up your editor so you can make changes. After that, you'll need to do a forced push to your branch:

```
$ git push origin issue1234 -f
```

### Updating the Code

If we ask you to make code changes, there's no need to close the pull request and create a new one. Just go back to the branch on your fork and make your changes. Then, when you're ready, you can add your changes into the branch:

```
$ git add -A
$ git commit
$ git push origin issue1234
```

When updating the code, it's usually better to add additional commits to your branch rather than amending the original commit, because reviewers can easily tell which changes were made in response to a particular review. When we merge pull requests, we will squash all the commits from your branch into a single commit on the `master` branch.

### Rebasing

If your code is out-of-date, we might ask you to rebase. That means we want you to apply your changes on top of the latest upstream code. Make sure you have set up a [development environment](../development-environment.md) and then you can rebase using these commands:

```
$ git fetch upstream
$ git rebase upstream/master
```

You might find that there are merge conflicts when you attempt to rebase. Please [resolve the conflicts](https://help.github.com/articles/resolving-merge-conflicts-after-a-git-rebase/) and then do a forced push to your branch:

```
$ git push origin issue1234 -f
```
