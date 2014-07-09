# Contributing

One of the great things about open source projects is that anyone can contribute in any number of meaningful ways. ESLint couldn't exist without the help of the many contributors its had since the project began, and we want you to feel like you can contribute and make a difference as well.

This guide is intended for anyone who wants to contribute to ESLint. Please read it carefully as it answers a lot of the questions many newcomers have when first working with ESLint.

## Ways to Contribute

There are many different ways you can contribute to ESLint:

* **Filing issues** - if you find a bug or want to request an enhancement, [file an issue](https://github.com/eslint/eslint/issues/new).
* **Working on issues** - if you have coding skills and want to contribute, you're welcome to pick up [any open issue](https://github.com/eslint/eslint/issues/).
* **Documentation** - if you enjoy writing and want to improve our documentation, it's all in [our repo](https://github.com/eslint/eslint/tree/master/docs) as well.
* **Graphic/web design** - if you want to help improve [eslint.org](http://eslint.org), our HTML, CSS, and JavaScript is all in a [separate repo](https://github.com/eslint/eslint.github.io)
* **Integrations** - if you'd like ESLint support in your favorite text editor, build system, or other software, we could use your help in creating plugins and addons.

For each way to contribute, there are some specific guidelines to keep in mind.

### Filing Issues

You can [file an issue](https://github.com/eslint/eslint/issues/new) directly inside of our GitHub repository. You should file an issue if you:

* Find a bug in ESLint. This means that you believe the behavior of ESLint is incorrect and needs to be fixed.
* Want to request a new feature for ESLint. This means a feature, rule, or capability is missing from ESLint that you think needs to be included.

When you file issues, please be sure to include the following information:

* Which version of ESLint you're currently using. If you installed ESLint via npm, then type `eslint -v` to get the version number. If you're using the latest code from GitHub, please say "I'm using master".
* If you have any interest in addressing the issue yourself.

For bug reports, also include:

1. The source code and configuration information (including `.eslintrc` and `.eslintignore` if applicable).
1. What you did.
1. What you expected to happen.
1. What actually happened.

For feature requests, also include:

1. The problem you want to solve.
1. Your take on the correct solution to problem.

Please include as much detail as possible to help us properly address your issue. If we need to triage issues and constantly ask people for more detail, that's time taken away from actually fixing issues. Help us be as efficient as possible by including a lot of detail in your issues.

**Note:** If you just have a question that won't necessarily result in a change to ESLint, such as asking how something works or how to contribute, please use the [mailing list](https://groups.google.com/group/eslint) instead of filing an issue.

### Working on Issues

You are welcome to work on any open issue in the [issues list](https://github.com/eslint/eslint/issues). If it's open, that means we are planning on doing it in the future, and your help is appreciated. Some thing to keep in mind:

* **Beginner issues** - if you've never contributed to ESLint before, you make want to try on of our [beginniner issues](https://github.com/eslint/eslint/issues?labels=beginner&milestone=&page=1&state=open). These are issues that tagged for beginners because they are small and self-contained.
* **Upcoming milestone issues** - if you're not sure what are the highest priority issues, then take a look at the issues assigned to the [next milestone](https://github.com/eslint/eslint/issues/milestones). The top milestone in the list is the one we're working towards, and these issues have highest priority.

If you're going to work on an issue, please add a comment to that issue saying so and indicating when you think you will complete it. It will help us to avoid duplication of effort. Some examples of good comments are:

* "I'll take a look at this over the weekend."
* "I'm going to do this, give me two weeks."
* "Working on this" (as in, I'm working on it right now)

If an issue has already been claimed by someone, please do not work on it.

If you find you can't finish the work, then simply add a comment letting people know, for example:

* "Sorry, it looks like I don't have time to do this."
* "I thought I knew enough to fix this, but it turns out I don't."

No one will blame you for backing out of an issue if you are unable to complete it. We just want to keep the process moving along as efficiently as possible.

### Documentation

We treat documentation the same as we do code, and that means you are welcome to improve upon it. The documentation is located in [our repo](https://github.com/eslint/eslint/tree/master/docs). All of this documentation gets converted into HTML and pushed to [eslint.org](http://eslint.org) with each release.

There are lots of ways to help:

* Fix typos
* Improve existing documentation
* Add new sections or pages

The ESLint project is committed to having great documentation as we believe that quality documentation is ultimately what causes projects to succeed or fail.

### Graphic/Web Design

Our site, [eslint.org](http://eslint.org) is our public face. It was started by designers and developers who donated their time and energy to getting it off the ground, and in the spirit of open source, we have shared the code in a [separate repo](https://github.com/eslint/eslint.github.io).

If you want to help, please check the [site issues]() to see where your help is most needed. In addition, we are always looking to improve our layout, design, and information architecture. Just as with the main ESLint project, you should feel free to file and work on issues.

**Important:** The documentation (everything under http://eslint.org/docs/) actually resides in the [main repo](https://github.com/eslint/eslint/tree/master/docs). Changes to that content must be made there. These pages are auto-generated on [eslint.org](http://eslint.org) with each release.

### Integrations

Part of what makes ESLint useful is the way it integrates into other systems. We have an [integrations](https://github.com/eslint/eslint/tree/master/docs/integrations) page that lists out all known integrations. If you have created an integration, please add your information to that page.

Additionally, we are always looking for official integrations to host under the ESLint organization on GitHub. Official integrations are tools that have a high-level quality and are managed by responsible maintainers who are committed to keeping the tool up-to-date and bettering the tool for the good of the ESLint community. If you think your integration qualifies, please contact the [mailing list](https://groups.google.com/group/eslint) with your information.

## Copyright and Licensing

When you submit code to the ESLint project, you agree:

1. The code you wrote is your original work (you own the copyright).
1. To allow the ESLint project to use your submitted code in any way.
1. You are capable of granting rights for the submitted code.

It is very important that you understand the implications of these conditions, as it gives ESLint the right to accept your contribution.

Since the code you wrote is your original work, you keep the copyright for it. This is why we ask you to include a copyright in the comments at the beginning of any file you submit, such as:

```js
/**
 * @fileoverview Description of the file
 * @author Your Name
 * @copyright 2014 Your Name. All rights reserved.
 */
```

The `@author` field gives you credit for having created the file. The `@copyright` field indicates that you are the copyright holder for the file.

Your submission may touch other parts of the ESLint code that you did not write. In that case, you are welcome to add a copyright notice to the top of the file if you have done any amount of significant work on the file (we leave it up to you to decide what "significant" means - if you aren't sure, just ask). You should never change the `@author` field, but you can add another `@copyright` field on top of the existing ones, such as:

```js
/**
 * @fileoverview Description of the file
 * @author Author's Name
 * @copyright 2015 Your Name. All rights reserved.
 * @copyright 2014 Author's Name. All rights reserved.
 */
```

## Pull Requests

If you want to contribute to an ESLint repo, please use a GitHub pull request. This is the fastest way for us to evaluate your code and to merge it into the code base. Please don't file an issue with snippets of code. Doing so means that we need to manually merge the changes in and update any appropriate tests. That decreases the likelihood that your code is going to get included in a timely manner. Please use pull requests.

We want to accept your contribution. Following these guidelines helps to create a patch that we want to accept:

* Make sure there is an issue for any pull request you send.
    * The only exception is for documentation changes. These don't require a pull request if they don't relate to an already-existing functionality issue.
* The pull request must have a description. The description should explain what you did and how its effects can be seen.
* The commit message should say "(fixes #1234)" at the end of the description if it closes out an existing issue (replace 1234 with the issue number).
* The change should introduce no functional regression. Be sure to run `npm test` to verify your changes before submitting a pull request.
* Make separate pull requests for unrelated changes. Large pull requests with multiple unrelated changes may be closed without merging.
* All changes must be accompanied by tests, even if the feature you're working on previously had no tests.
* All changes must work on the following Node.js versions:
    * 0.10.x
* Only *one commit* is allowed per pull request. If you have multiple commits, you'll be asked to squash them.
* Follow the [Code Conventions](code-conventions.md).

### Step 1: Create a new branch

The first step to sending a pull request is to create a new branch in your ESLint fork. Give the branch a descriptive name that describes what it is you're fixing, such as:

```
git checkout -b fix-broken-config
```

#### Step 2: Make your changes

Make the changes to the code and tests and then commit to your branch. Be sure to follow the commit message conventions.

Commit messages must follow this basic format:

```
Tag: Message (fixes #1234)
```

The `Tag` is one of the following:

* `Fix` - for a bug fix.
* `Update` - for a backwards-compatible enhancement.
* `Breaking` - for a backwards-incompatible enhancement.
* `Docs` - changes to documentation only.
* `Build` - changes to build process only.
* `New` - implemented a new feature.
* `Upgrade` - for a dependency upgrade.

The message should a one-sentence description of the change. The issue number should be mentioned at the end. If the commit doesn't completely fix the issue, then use `(refs #1234)` instead of `(fixes #1234)`.

Here are some good commit message examples:

```
Build: Update Travis to only test Node 0.10 (refs #734)
Fix: Semi rule incorrectly flagging extra semicolon (fixes #840)
Upgrade: Esprima to 1.2, switch to using Esprima comment attachment (fixes #730)
```

The commit message format is important because these messages are used to create a changelog for each release. The tag and issue number help to create more consistent and useful changelogs.

### Step 3: Rebase onto upstream

Before you send the pull request, be sure to rebase onto the upstream source. This ensures your code is running on the latest available code.

```
git fetch upstream
git rebase upstream/master
```

### Step 4: Run the tests

After rebasing, be sure to run all of the tests once again to make sure nothing broke:

```
npm test
```

### Step 5: Squash your commits

As mentioned previously, ESLint requires just one commit per pull request. If you have used multiple commits, be sure to [squash](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html) your commits.

### Step 6: Send the pull request

Now you're ready to send the pull request. Go to your ESLint fork and then follow the [GitHub documentation](https://help.github.com/articles/creating-a-pull-request) on how to send a pull request.

### Following Up

All pull requests are sent through Travis CI to verify that no tests are broken. If the Travis build fails, it will show up on the pull request. We cannot accept any code that fails in Travis, so if this happens, make fixes and update the pull request to trigger another build.

## New Rules

If you want to create a new rule, the first step is to file an issue. Make sure the issue includes the following information:

1. The use case for the rule - what is it trying to prevent or flag? Include code examples.
1. Whether the rule is trying to prevent an error or is purely stylistic.
1. Why you believe this rule is generic enough to be included.
1. Whether the rule should be on or off by default.

To simplify creation of new rules, use [ESLint Yeoman generator](https://github.com/eslint/generator-eslint). It will automatically generate rule, documentation and test files to get you started faster.

Keep in mind that not all rules will be accepted for the main distribution. You may also request that your rule by on by default but we may accept it as off by default.

