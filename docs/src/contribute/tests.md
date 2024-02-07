---
title: Run the Tests
eleventyNavigation:
    key: run tests
    parent: contribute to eslint
    title: Run the Tests
    order: 7
---

Most parts of ESLint have unit tests associated with them. Unit tests are written using [Mocha](https://mochajs.org/) and are required when making contributions to ESLint. You'll find all of the unit tests in the `tests` directory.

When you first get the source code, you need to run `npm install` once initially to set ESLint for development. Once you've done that, you can run the tests via:

```shell
npm test
```

This automatically starts Mocha and runs all tests in the `tests` directory. You need only add yours and it will automatically be picked up when running tests.

## Running Individual Tests

If you want to quickly run just one test file, you can do so by running Mocha directly and passing in the filename. For example:

```shell
npm run test:cli tests/lib/rules/no-undef.js
```

If you want to run just one or a subset of `RuleTester` test cases, add `only: true` to each test case or wrap the test case in `RuleTester.only(...)` to add it automatically:

```js
ruleTester.run("my-rule", myRule, {
    valid: [
        RuleTester.only("const valid = 42;"),
        // Other valid cases
    ],
    invalid: [
        {
            code: "const invalid = 42;",
            only: true,
        },
        // Other invalid cases
    ]
})
```

Running individual tests is useful when you're working on a specific bug and iterating on the solution. You should be sure to run `npm test` before submitting a pull request. `npm test` uses Mocha's `--forbid-only` option to prevent `only` tests from passing full test runs.

## More Control on Unit Testing

`npm run test:cli` is an alias of the Mocha cli in `./node_modules/.bin/mocha`. [Options](https://mochajs.org/#command-line-usage) are available to be provided to help to better control the test to run.

The default timeout for tests in `npm test` is 10000ms. You may change the timeout by providing `ESLINT_MOCHA_TIMEOUT` environment variable, for example:

```shell
ESLINT_MOCHA_TIMEOUT=20000 npm test
```
