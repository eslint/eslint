/**
 * @fileoverview disallow unncessary concatenation of literals or template literals
 * @author Henry Zhu
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-concat"),

    RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-useless-concat", rule, {

    valid: [
        "var a = 1 + 1;",
        "var a = 1 * '2';",
        "var a = 1 - 2;",
        "var a = foo + bar;",
        "var a = 'foo' + bar;",
        "var foo = 'foo' +\n 'bar';",

        // https://github.com/eslint/eslint/issues/3575
        "var string = (number + 1) + 'px';",
        "'a' + 1",
        "1 + '1'",
        { code: "1 + `1`", parserOptions: { ecmaVersion: 6 } },
        { code: "`1` + 1", parserOptions: { ecmaVersion: 6 } },
        { code: "(1 + +2) + `b`", parserOptions: { ecmaVersion: 6 } }
    ],

    invalid: [
        {
            code: "'a' + 'b'",
            errors: [
                { message: "Unexpected string concatenation of literals." }
            ]
        },
        {
            code: "foo + 'a' + 'b'",
            errors: [
                { message: "Unexpected string concatenation of literals." }
            ]
        },
        {
            code: "'a' + 'b' + 'c'",
            errors: [
                {
                    message: "Unexpected string concatenation of literals.",
                    line: 1,
                    column: 5
                },
                {
                    message: "Unexpected string concatenation of literals.",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "(foo + 'a') + ('b' + 'c')",
            errors: [
                { column: 13, message: "Unexpected string concatenation of literals." },
                { column: 20, message: "Unexpected string concatenation of literals." }
            ]
        },
        {
            code: "`a` + 'b'",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Unexpected string concatenation of literals." }
            ]
        },
        {
            code: "`a` + `b`",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Unexpected string concatenation of literals." }
            ]
        },
        {
            code: "foo + `a` + `b`",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Unexpected string concatenation of literals." }
            ]
        }
    ]
});
