/**
 * @fileoverview Disallows or enforces spaces inside of parentheses.
 * @author Jonathan Rajavuori
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
eslintTester.addRuleTest("lib/rules/space-in-parens", {

    valid: [
        { code: "foo()", args: ["2", "always"] },
        { code: "foo( bar )", args: ["2", "always"] },
        { code: "foo\n(\nbar\n)\n", args: ["2", "always"] },
        { code: "foo\n(  \nbar\n )\n", args: ["2", "always"] },
        { code: "foo\n(\n bar  \n)\n", args: ["2", "always"] },
        { code: "foo\n( \n  bar \n  )\n", args: ["2", "always"] },
        { code: "var x = ( 1 + 2 ) * 3", args: ["2", "always"] },
        { code: "var x = 'foo(bar)'", args: ["2", "always"] },

        { code: "bar()", args: ["2", "never"] },
        { code: "bar(baz)", args: ["2", "never"] },
        { code: "var x = (4 + 5) * 6", args: ["2", "never"] },
        { code: "foo\n(\nbar\n)\n", args: ["2", "never"] },
        { code: "foo\n(  \nbar\n )\n", args: ["2", "never"] },
        { code: "foo\n(\n bar  \n)\n", args: ["2", "never"] },
        { code: "foo\n( \n  bar \n  )\n", args: ["2", "never"] },
        { code: "var x = 'bar( baz )'", args: ["2", "always"] }
    ],

    invalid: [
        {
            code: "foo( bar)",
            args: ["2", "always"],
            errors: [
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "foo(bar)",
            args: ["2", "always"],
            errors: [
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                },
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "var x = ( 1 + 2) * 3",
            args: ["2", "always"],
            errors: [
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "var x = (1 + 2 ) * 3",
            args: ["2", "always"],
            errors: [
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "foo\n(bar\n)\n",
            args: ["2", "always"],
            errors: [
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "bar(baz )",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no spaces inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "bar( baz )",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no spaces inside this paren.",
                    type: "Program"
                },
                {
                    message: "There should be no spaces inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "var x = ( 4 + 5) * 6",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no spaces inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "var x = (4 + 5 ) * 6",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no spaces inside this paren.",
                    type: "Program"
                }
            ]
        },
        {
            code: "foo\n(\nbar )\n",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no spaces inside this paren.",
                    type: "Program"
                }
            ]
        }
    ]
});
