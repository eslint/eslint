# Development Environment

ESLint has a very lightweight development environment that makes updating code fast and easy. This is a step-by-step guide to setting up a local development environment that will let you contribute back to the project.

## Step 1: Install Node.js

Go to <http://nodejs.org/> to download and install the latest stable version for your operating system.

Most of the installers come with [npm](http://npmjs.org/) already installed, but if for some reason it doesn't work on your system, you can install it manually using the instructions on the website.

## Step 2: Fork and checkout your own ESLint repository

Go to <https://github.com/eslint/eslint> and click the "Fork" button. Follow the [GitHub documentation](https://help.github.com/articles/fork-a-repo) for forking and cloning.

Once you've cloned the repository, run `npm install` to get all the necessary dependencies:

```
$ cd eslint
$ npm install
```

You must be connected to the Internet for this step to work. You'll see a lot of utilities being downloaded.

## Step 3: Add the upstream source

The *upstream source* is the main ESLint repository that active development happens on. While you won't have push access to upstream, you will have pull access, allowing you to pull in the latest code whenever you want.

To add the upstream source for ESLint, run the following in your repository:

```
git remote add upstream git@github.com:eslint/eslint.git
```

Now, the remote `upstream` points to the upstream source.

## Step 4: Install the Yeoman Generator

[Yeoman](http://yeoman.io) is a scaffold generator that ESLint uses to help streamline development of new rules. If you don't already have Yeoman installed, you can install it via npm:

    npm install -g yo

Then, you can install the ESLint Yeoman generator:

    npm install -g generator-eslint

Please see the [generator documentation](https://github.com/eslint/generator-eslint) for instructions on how to use it.

## Step 5: Run the tests

Running the tests is the best way to ensure you have correctly set up your development environment. Make sure you're in the the `eslint` directory and run:

```
npm test
```

The testing takes a few seconds to complete. If any tests fail, that likely means one or more parts of the environment setup didn't complete correctly. The upstream tests always pass.



## Build Scripts

ESLint has several build scripts that help with various parts of development.

### npm test

The primary script to use is `npm test`, which does several things:

1. Lints all JavaScript (including tests) and JSON
1. Runs all tests on Node.js
1. Checks code coverage targets
1. Generates `build/eslint.js` for use in a browser
1. Runs a subset of tests in PhantomJS

Be sure to run this after making changes and before sending a pull request with your changes.

**Note:** The full code coverage report is output into `/coverage`.

### npm run lint

Runs just the JavaScript and JSON linting on the repository

### npm run browserify

Generates `build/eslint.js`, a version of ESLint for use in the browser

### npm run docs

Generates JSDoc documentation and places it into `/jsdoc`.

### npm run profile

This command is used for intensive profiling of ESLint using Chrome Developer Tools. It starts a development server that runs through three profiles:

* Large - Runs ESLint on JSHint
* Medium - Runs ESLint on jQuery
* Small - Runs ESLint on KnockoutJS

Your browser should automatically open to the page in question. When that happens:

1. Open up developer tools
1. Click on Profiles

You should start to see profiles for each run show up on the left side. If not, reload the page in the browser. Once all three profiles have completed, they will be available for inspection.

## Workflow

Whenever you make changes to the ESLint source files, you'll need to run `npm test` to rerun the tests. The workflow is:

1. Make changes
2. Run `npm test` to run tests on the command line

You'll have to do this each time you make a change. The tests are run automatically whenever a pull request is received, so make sure to verify your changes work before submitting them.
