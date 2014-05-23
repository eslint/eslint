# Development Environment

ESLint has a very lightweight development environment that makes updating code fast and easy. If you've checked out the code already, then the next step is to make sure you have all of the required utilities. Node.js and npm are the two things you'll need.

## Install Node.js

Go to http://nodejs.org/ to download and install the latest stable version for your operating system.

Most of the installers come with [npm](http://npmjs.org/) already installed, but if for some reason it doesn't work on your system, you can install it manually using the instructions on the website.

## Development Mode

To run ESLint is dev mode you will need to first uninstall the real ESLint utility (if you had previously installed it from npm):

    npm remove -g eslint

Next, go to the directory in which you've checked out the ESLint source code and run:

    npm link

The global `eslint` will now point to the files in your development repository instead of a globally-installed version from npm. You can now use `eslint` directly to test your changes.

If you ever update from the central repository and there are errors, it might be because you are missing some dependencies. If that happens, just run `npm link` again to get the latest dependencies.

## Install the Yeoman Generator

[Yeoman](http://yeoman.io) is a scaffold generator that ESLint uses to help streamline development of new rules. If you don't already have Yeoman installed, you can install it via npm:

    npm install -g yo

Then, you can install the ESLint Yeoman generator:

    npm install -g generator-eslint

Please see the [generator documentation](https://github.com/eslint/generator-eslint) for instructions on how to use it.

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
