"use strict";

const {RuleTester} = require("eslint");
const fooBarRule = require("./foo-bar");

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variable introduced.
  parserOptions: { ecmaVersion: 2015 }
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  "foo-bar", // rule name
  fooBarRule, // rule code
  { // checks
    // 'valid' checks cases that should pass
    valid: [{
      code: "const foo = 'bar';",
    }],
    // 'invalid' checks cases that should not pass
    invalid: [{
      code:"const foo = 'baz';",
      output: 'const foo = "bar";',
      errors: 1,
    }],
  }
);

console.log("All tests passed!");