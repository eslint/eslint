# Unit Tests

Most parts of ESLint have unit tests associated with them. Unit tests are written using [Mocha](https://mochajs.org/) and are required when making contributions to ESLint. You'll find all of the unit tests in the `tests` directory.

When you first get the source code, you need to run `npm install` once initially to set ESLint for development. Once you've done that, you can run the tests via:

    npm test

This automatically starts Mocha and runs all tests in the `tests` directory. You need only add yours and it will automatically be picked up when running tests.

## Running Individual Tests

If you want to quickly run just one test, you can do so by running Mocha directly and passing in the filename. For example:

    ./node_modules/.bin/mocha tests/lib/rules/no-wrap-func.js

Running individual tests is useful when you're working on a specific bug and iterating on the solution. You should be sure to run `npm test` before submitting a pull request.
