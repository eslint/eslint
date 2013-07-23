---
title: ESLint
layout: default
---
# Development Environment

ESLint has a very lightweight development environment that makes updating code fast and easy. If you've checked out the code already, then the next step is to make sure you have all of the required utilities. Node.js and npm are the two things you'll need.

## Install Node.js

Go to http://nodejs.org to download and install the latest stable version for your operating system.

Most of the installers come with [npm](http://npmjs.org) already installed, but if for some reason it doesn't work on your system, you can install it manually using the instructions on the website.

## Development Mode

To run ESLint is dev mode you will need to first uninstall the real ESLint utility (if you had previously installed it from npm):

    npm remove -g eslint

Next, go to the directory in which you've checked out the ESLint source code and run:

    npm link

The global `eslint` will now point to the files in your development repository instead of a globally-installed version from npm. You can now use `eslint` directly to test your changes.

If you ever update from the central repository and there are errors, it might be because you are missing some dependencies. If that happens, just run `npm link` again to get the latest dependencies.

## Build Scripts

ESLint has only one real build script you need to know about: `npm test`. By running `npm test`, you are verifying that all JSON files are free of syntax errors, running all tests, and checking the code coverage on those tests.

Be sure to run `npm test` whenever you make changes to ensure that you've not broken anything that was previously working.

## Workflow

Whenever you make changes to the ESLint source files, you'll need to run `npm test` to rerun the tests. The workflow is:

1. Make changes
1. Run `npm test` to run tests on the command line

You'll have to do this each time you make a change.  The tests are run automatically whenever a pull request is received, so make sure to verify your changes work before submitting them.
