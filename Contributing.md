---
title: ESLint
layout: default
---
# Contributing

One of the great things about open source projects is that anyone can contribute code. To help you in that process, there are several things that you should keep in mind.

## Use Pull Requests

If you want to submit code, please use a GitHub pull request. This is the fastest way for us to evaluate your code and to merge it into the code base. Please don't file an issue with snippets of code. Doing so means that we need to manually merge the changes in and update any appropriate tests. That decreases the likelihood that your code is going to get included in a timely manner. Please use pull requests.

## Checklist

We want to accept your contribution. Following these guidelines helps to create a patch that we want to accept:

* Make sure there is an issue for any pull request you send.
    * If an issue doesn't exist, create one *before* you submit the pull request.
    * Issues should have full descriptions explaining the bug, enhancement, or request.
* The commit message should say "(fixes #1234)" at the of the description if it closes out an existing issue (replace 1234 with the issue number).
* The change should introduce no functional regression. Be sure to run `npm test` to verify your changes before submitting a pull request.
* Make separate pull requests for unrelated changes. Large pull requests with multiple unrelated changes may be closed without merging.
* A new feature must be accompanied by tests, this includes rules.
* All changes must work on the following Node.JS versions:
    * 0.6.x
    * 0.8.x
    * 0.10.x
* Follow the [Code Conventions](Code-Conventions.html).

## New Rules

Once you've written a rule, you can decide whether the rule is generic enough to be included in ESLint or if it's specific to your own use case. If you decide to submit your rule via a pull request, there are some things to keep in mind:

1. Rules must be accompanied by unit tests.
1. In your pull request include:
    1. The use case for the rule - what is it trying to prevent or flag?
    1. Why you believe this rule is generic enough to be included in the main distribution
    1. Whether the rule should be on or off by default.
    1. Documentation for the rule (see [no-console](no-console.html) as an example). Put this documentation directly into the pull request.

Keep in mind that not all rules will be accepted for the main distribution. You may also request that your rule by on by default but we may accept it as off by default.

## Following Up

All pull requests are sent through Travis CI to verify that no tests are broken. If the Travis build fails, it will show up on the pull request. We cannot accept any code that fails in Travis, so if this happens, make fixes and update the pull request to trigger another build.
