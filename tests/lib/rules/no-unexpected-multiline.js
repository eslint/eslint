/**
 * @fileoverview Tests for no-unexpected-multiline rule.
 * @author Glen Mailer
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unexpected-multiline"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("no-unexpected-multiline", rule, {
    valid: [
        "(x || y).aFunction()",
        "[a, b, c].forEach(doSomething)",
        "var a = b;\n(x || y).doSomething()",
        "var a = b\n;(x || y).doSomething()",
        "var a = b\nvoid (x || y).doSomething()",
        "var a = b;\n[1, 2, 3].forEach(console.log)",
        "var a = b\nvoid [1, 2, 3].forEach(console.log)",
        "\"abc\\\n(123)\"",
        "var a = (\n(123)\n)",
        "f(\n(x)\n)",
        "(\nfunction () {}\n)[1]",
        {
            code: "let x = function() {};\n   `hello`",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let x = function() {}\nx `hello`",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "String.raw `Hi\n${2+3}!`;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "x\n.y\nz `Valid Test Case`",
            parserOptions: { ecmaVersion: 6 }
        },
        `
            foo
            / bar /2
        `,
        `
            foo
            / bar / mgy
        `,
        `
            foo
            / bar /
            gym
        `,
        `
            foo
            / bar
            / ygm
        `,
        `
            foo
            / bar /GYM
        `,
        `
            foo
            / bar / baz
        `,
        "foo /bar/g",
        `
            foo
            /denominator/
            2
        `,
        `
            foo
            / /abc/
        `,
        `
            5 / (5
            / 5)
        `
    ],
    invalid: [
        {
            code: "var a = b\n(x || y).doSomething()",
            errors: [{
                message: "Unexpected newline between function and ( of function call.",
                line: 2,
                column: 1

            }]
        },
        {
            code: "var a = (a || b)\n(x || y).doSomething()",
            errors: [{
                line: 2,
                column: 1,
                message: "Unexpected newline between function and ( of function call."
            }]
        },
        {
            code: "var a = (a || b)\n(x).doSomething()",
            errors: [{
                line: 2,
                column: 1,
                message: "Unexpected newline between function and ( of function call."
            }]
        },
        {
            code: "var a = b\n[a, b, c].forEach(doSomething)",
            errors: [{
                line: 2,
                column: 1,
                message: "Unexpected newline between object and [ of property access."
            }]
        },
        {
            code: "var a = b\n    (x || y).doSomething()",
            errors: [{
                line: 2,
                column: 5,
                message: "Unexpected newline between function and ( of function call."
            }]
        },
        {
            code: "var a = b\n  [a, b, c].forEach(doSomething)",
            errors: [{
                line: 2,
                column: 3,
                message: "Unexpected newline between object and [ of property access."
            }]
        },
        {
            code: "let x = function() {}\n `hello`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 9,
                message: "Unexpected newline between template tag and template literal."
            }]
        },
        {
            code: "let x = function() {}\nx\n`hello`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 2,
                column: 1,
                message: "Unexpected newline between template tag and template literal."
            }]
        },
        {
            code: "x\n.y\nz\n`Invalid Test Case`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 3,
                column: 1,
                message: "Unexpected newline between template tag and template literal."
            }]
        },
        {
            code: `
                foo
                / bar /gym
            `,
            errors: [{
                line: 3,
                column: 17,
                message: "Unexpected newline between numerator and division operator."
            }]
        },
        {
            code: `
                foo
                / bar /g
            `,
            errors: [{
                line: 3,
                column: 17,
                message: "Unexpected newline between numerator and division operator."
            }]
        },
        {
            code: `
                foo
                / bar /g.test(baz)
            `,
            errors: [{
                line: 3,
                column: 17,
                message: "Unexpected newline between numerator and division operator."
            }]
        },
        {
            code: `
                foo
                /bar/gimuygimuygimuy.test(baz)
            `,
            errors: [{
                line: 3,
                column: 17,
                message: "Unexpected newline between numerator and division operator."
            }]
        }
    ]
});
