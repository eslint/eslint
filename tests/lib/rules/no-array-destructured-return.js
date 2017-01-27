/**
 * @fileoverview Tests for no-array-destructured-return rule.
 * @author Vitor Balocco
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-array-destructured-return");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-array-destructured-return", rule, {
    valid: [
        "const [a, ...rest] = foo();",
        "const [a, ...rest] = new Foo();",
        "([ a, ...b ] = foo());",
        "([ a, ...b ] = new Foo());",
        "const { a, b } = foo();",
        "({ a, b } = foo());",
        "const [a, b] = foo;",
        "const [] = foo;"
    ],

    invalid: [
        {
            code: "const [a, b] = foo();",
            errors: [{
                message: "Array destructuring of return values is not allowed, use object destructuring instead."
            }]
        },
        {
            code: "const [a, b] = new Foo();",
            errors: [{
                message: "Array destructuring of return values is not allowed, use object destructuring instead."
            }]
        },
        {
            code: "let [a, b] = foo();",
            errors: [{
                message: "Array destructuring of return values is not allowed, use object destructuring instead."
            }]
        },
        {
            code: "let [a] = foo();",
            errors: [{
                message: "Array destructuring of return values is not allowed, use object destructuring instead."
            }]
        },
        {
            code: "const [a, b] = (() => [1, 2])();",
            errors: [{
                message: "Array destructuring of return values is not allowed, use object destructuring instead."
            }]
        },
        {
            code: "([ a, b ] = foo());",
            errors: [{
                message: "Array destructuring of return values is not allowed, use object destructuring instead."
            }]
        },
        {
            code: "([ a, b ] = new Foo());",
            errors: [{
                message: "Array destructuring of return values is not allowed, use object destructuring instead."
            }]
        }
    ]
});
