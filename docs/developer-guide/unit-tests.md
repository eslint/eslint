# Unit Tests

Most parts of ESLint have unit tests associated with them. Unit tests are written using [Vows](http://vowsjs.org) and are required when making contributions to ESLint. You'll find all of the unit tests in the `tests` directory.

When you first get the source code, you need to run `npm link` once initially to set ESLint for development. Once you've done that, you can run the tests via:

    npm test

This automatically starts Vows and runs all tests in the `tests` directory. You need only add yours and it will automatically be picked up when running tests.

## Multiline Tests

Tests should be discrete and test one thing and one thing only whenever possible. Most tests should be kept short enough that they fit on one line. However, if your test case is long, you can use the following format for the `topic`:

    topic: [
        "// my line comment",
        "var a = 42;",
        "/* my block comment */"
    ].join("\n"),
    
This example can be found in `tests/lib/rules/no-unused-vars.js`
