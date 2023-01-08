---
title: Source Code
eleventyNavigation:
    key: getting the source code
    parent: extend eslint
    title: Getting the Source Code
    order: 1

---

ESLint is hosted at [GitHub](https://github.com/eslint/eslint) and uses [Git](https://git-scm.com/) for source control. In order to obtain the source code, you must first install Git on your system. Instructions for installing and setting up Git can be found at <https://help.github.com/articles/set-up-git/>.

If you simply want to create a local copy of the source to play with, you can clone the main repository using this command:

```shell
git clone git://github.com/eslint/eslint.git
```

If you're planning on contributing to ESLint, then it's a good idea to fork the repository. You can find instructions for forking a repository at <https://help.github.com/articles/fork-a-repo/>. After forking the ESLint repository, you'll want to create a local copy of your fork.

## Start Developing

Before you can get started developing, you'll need to have a couple of things installed:

* [Node.JS](https://nodejs.org)
* [npm](https://www.npmjs.com/)

Once you have a local copy and have Node.JS and npm installed, you'll need to install the ESLint dependencies:

```shell
cd eslint
npm install
```

Now when you run `eslint`, it will be running your local copy and showing your changes.

**Note:** It's a good idea to re-run `npm install` whenever you pull from the main repository to ensure you have the latest development dependencies.

## Directory structure

The ESLint directory and file structure is as follows:

* `bin` - executable files that are available when ESLint is installed
* `conf` - default configuration information
* `docs` - documentation for the project
* `lib` - contains the source code
    * `formatters` - all source files defining formatters
    * `rules` - all source files defining rules
* `tests` - the main unit test folder
    * `lib` - tests for the source code
        * `formatters` - tests for the formatters
        * `rules` - tests for the rules
