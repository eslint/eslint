/**
 * @fileoverview tests to validate spacing before and after comma.
 * @author Vignesh Anand.
 * @copyright 2014 Vignesh Anand. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/comma-spacing", {

    valid: [
        "var a = 1, b = 2;",
        "var arr = [1, 2];",
        "var obj = {'foo':'bar', 'baz':'qur'};",
        "var obj = {'foo':'bar', 'baz':\n'qur'};",
        "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
        {code: "var obj = {'foo':\n'bar' ,'baz':\n'qur'};", args: [2, {before: true, after: false}]},
        {code: "var a = 1 ,b = 2;", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 ,2];", args: [2, {before: true, after: false}]},
        {code: "var obj = {'foo':'bar' , 'baz':'qur'};", args: [2, {before: true, after: true}]},
        {code: "var a = 1 , b = 2;", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , 2];", args: [2, {before: true, after: true}]},
        {code: "var arr = [1,2];", args: [2, {before: false, after: false}]}
    ],

    invalid: [
        {
            code: "var a = 1 ,b = 2;",
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "VariableDeclaration"
                },
                {
                    message: "There should be no space before ','.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var arr = [1 , 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [1 ,2];",
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "ArrayExpression"
                },
                {
                    message: "There should be no space before ','.",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [1, 2];",
            args: [2, {before: true, after: false}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "ArrayExpression"
                },
                {
                    message: "There should be no space after ','.",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
            args: [2, {before: true, after: false}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "ObjectExpression"
                },
                {
                    message: "There should be no space after ','.",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var arr = [1 ,2];",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [1,2];",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "ArrayExpression"
                },
                {
                    message: "A space is required after ','.",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar','baz':\n'qur'};",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "ObjectExpression"
                },
                {
                    message: "A space is required after ','.",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var arr = [1 , 2];",
            args: [2, {before: false, after: false}],
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "ArrayExpression"
                },
                {
                    message: "There should be no space after ','.",
                    type: "ArrayExpression"
                }
            ]
        }
    ]
});
