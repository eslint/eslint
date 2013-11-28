# Unit Tests

Most parts of ESLint have unit tests associated with them. Unit tests are written using [Mocha](http://visionmedia.github.io/mocha/) and are required when making contributions to ESLint. You'll find all of the unit tests in the `tests` directory.

When you first get the source code, you need to run `npm install` once initially to set ESLint for development. Once you've done that, you can run the tests via:

    npm test

This automatically starts Mocha and runs all tests in the `tests` directory. You need only add yours and it will automatically be picked up when running tests.
