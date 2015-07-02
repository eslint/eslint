/**
 * @fileoverview Disallow trailing spaces at the end of lines.
 * @author Nodeca Team <https://github.com/nodeca>
 * @copyright 2015 Patrick McElhaney
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-trailing-spaces", {

    valid: [
        {
            code: "var a = 5;",
            options: [{}]
        },
        {
            code: "var a = 5,\n    b = 3;",
            options: [{}]
        },
        {
            code: "var a = 5;"
        },
        {
            code: "var a = 5,\n    b = 3;"
        },
        {
            code: "var a = 5,\n    b = 3;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "     ",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "\t",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "     \n    var c = 1;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "\t\n\tvar c = 2;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "\n   var c = 3;",
            options: [{ skipBlankLines: true }]
        },
        {
            code: "\n\tvar c = 4;",
            options: [{ skipBlankLines: true }]
        }
    ],

    invalid: [
        {
            code: "var a = 5;      \n",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5; \n b = 3; ",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }, {
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5;\t\n  b = 3;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "     \n    var c = 1;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "\t\n\tvar c = 2;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }]
        },
        {
            code: "var a = 5;      \n",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }],
            options: [{}]
        },
        {
            code: "var a = 5; \n b = 3; ",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }, {
                message: "Trailing spaces not allowed.",
                type: "Program"
            }],
            options: [{}]
        },
        {
            code: "var a = 5;\t\n  b = 3;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }],
            options: [{}]
        },
        {
            code: "     \n    var c = 1;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }],
            options: [{}]
        },
        {
            code: "\t\n\tvar c = 2;",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program"
            }],
            options: [{}]
        },
        {
            code: "var a = 'bar';  \n \n\t",
            errors: [{
                message: "Trailing spaces not allowed.",
                type: "Program",
                line: 1,
                column: 17 // there are invalid spaces in columns 15 and 16
            }],
            options: [{
                skipBlankLines: true
            }]
        }
    ]

});
