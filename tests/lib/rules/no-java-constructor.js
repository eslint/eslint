/**
 * @fileoverview Tests for no-java-constructor rule.
 * @author Michael Bolin
 */

"use strict";

const rule = require("../../../lib/rules/no-java-constructor");
const RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-java-constructor", rule, {
    valid: [
        {
            code: `
class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
}
`
        },
        {
            code: `
(class {
  foo() {
  }
})
`
        }
    ],
    invalid: [
        {
            code: `
class Point {
  Point(x, y) {
    this._x = x;
    this._y = y;
  }
}
`,
            output: `
class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
}
`,
            errors: [
                {
                    message: "Method name should not match class name. Did you mean to use `constructor`?",
                    line: 3,
                    column: 3
                }
            ]
        }
    ]
});
