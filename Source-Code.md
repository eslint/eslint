---
title: ESLint
layout: default
---
# Source Code

ESLint is hosted at [GitHub](http://www.github.com) and uses [Git](http://git-scm.com/) for source control. In order to obtain the source code, you must first install Git on your system. Instructions for installing and setting up Git can be found at http://help.github.com/set-up-git-redirect.

If you simply want to create a local copy of the source to play with, you can clone the main repository using this command:

    git clone git://github.com/nzakas/eslint.git

If you're planning on contributing to ESLint, then it's a good idea to fork the repository. You can find instructions for forking a repository at http://help.github.com/fork-a-repo/. After forking the ESLintrepository, you'll want to create a local copy of your fork.

## Start Developing

Before you can get started developing, you'll need to have a couple of things installed:

* [Node.JS](http://nodejs.org)
* [npm](http://npmjs.org)

Once you have a local copy and have Node.JS and npm installed, you'll need to create a development link:

    cd eslint
    npm link

Now when you run `eslint`, it will be running your local copy and showing your changes.

**Note:** It's a good idea to re-rerun `npm link` whenever you pull from the main repository to ensure you have the latest development dependencies.

## Directory structure

The ESLint directory and file structure is as follows:

* `bin` - executable files that are available when ESLint is installed
* `config` - default configuration information
* `lib` - contains the source code
    * `formatters` - all source files defining formatters
    * `rules` - all source files defining rules
* `tests` - the main unit test folder
    * `lib` - tests for the source code
        * `reporters` - tests for the reporters
        * `rules` - tests for the rules
