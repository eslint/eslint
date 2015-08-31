/**
 * @fileoverview disallow unncessary concatenation of literals or template literals
 * @author Henry Zhu
 * @copyright 2015 Henry Zhu. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-useless-concat"),

    RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-useless-concat", rule, {

    valid: [
        { code: "var a = 1 + 1;" },
        { code: "var a = 1 * '2';" },
        { code: "var a = 1 - 2;" },
        { code: "var a = foo + bar;" },
        { code: "var a = 'foo' + bar;" },
        { code: "var foo = 'foo' +\n 'bar';" },

        // https://github.com/eslint/eslint/issues/3575
        { code: "var string = (number + 1) + 'px';" },
        { code: "'a' + 1" },
        { code: "1 + '1'" },
        { code: "1 + `1`", ecmaFeatures: {templateStrings: true} },
        { code: "`1` + 1", ecmaFeatures: {templateStrings: true} },
        { code: "(1 + +2) + `b`", ecmaFeatures: {templateStrings: true} }
    ],

    invalid: [
        {
            code: "'a' + 'b'",
            errors: [
                { message: "Unexpected string concatenation of literals."}
            ]
        },
        {
            code: "foo + 'a' + 'b'",
            errors: [
                { message: "Unexpected string concatenation of literals."}
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
                { column: 13, message: "Unexpected string concatenation of literals."},
                { column: 20, message: "Unexpected string concatenation of literals."}
            ]
        },
        {
            code: "`a` + 'b'",
            ecmaFeatures: {templateStrings: true},
            errors: [
                { message: "Unexpected string concatenation of literals."}
            ]
        },
        {
            code: "`a` + `b`",
            ecmaFeatures: {templateStrings: true},
            errors: [
                { message: "Unexpected string concatenation of literals."}
            ]
        },
        {
            code: "foo + `a` + `b`",
            ecmaFeatures: {templateStrings: true},
            errors: [
                { message: "Unexpected string concatenation of literals."}
            ]
        }
    ]
});
