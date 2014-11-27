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
        "function foo(a, b){}",
        { code: "var foo = (a, b) => {}", settings: { ecmascript: 6 } },
        { code: "var foo = a => a + 2", settings: { ecmascript: 6 } },
        "a, b",
        "var a = (1 + 2, 2);",
        {code: "var obj = {'foo':\n'bar' ,'baz':\n'qur'};", args: [2, {before: true, after: false}]},
        {code: "var a = 1 ,b = 2;", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 ,2];", args: [2, {before: true, after: false}]},
        {code: "function foo(a ,b){}", args: [2, {before: true, after: false}]},
        {code: "var obj = {'foo':'bar' , 'baz':'qur'};", args: [2, {before: true, after: true}]},
        {code: "var a = 1 , b = 2;", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , 2];", args: [2, {before: true, after: true}]},
        {code: "a , b", args: [2, {before: true, after: true}]},
        {code: "var arr = [1,2];", args: [2, {before: false, after: false}]},
        {code: "var a = (1 + 2,2)", args: [2, {before: false, after: false}]}
    ],

    invalid: [
        {
            code: "var a = 1 ,b = 2;",
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "VariableDeclarator"
                },
                {
                    message: "There should be no space before ','.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var arr = [1 , 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var arr = [1 ,2];",
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Literal"
                },
                {
                    message: "There should be no space before ','.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var arr = [1, 2];",
            args: [2, {before: true, after: false}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Literal"
                },
                {
                    message: "There should be no space after ','.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
            args: [2, {before: true, after: false}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Property"
                },
                {
                    message: "There should be no space after ','.",
                    type: "Property"
                }
            ]
        },
        {
            code: "var arr = [1 ,2];",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var arr = [1,2];",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Literal"
                },
                {
                    message: "A space is required after ','.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar','baz':\n'qur'};",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Property"
                },
                {
                    message: "A space is required after ','.",
                    type: "Property"
                }
            ]
        },
        {
            code: "var arr = [1 , 2];",
            args: [2, {before: false, after: false}],
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Literal"
                },
                {
                    message: "There should be no space after ','.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "a ,b",
            args: [2, {before: false, after: true}],
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Identifier"
                },
                {
                    message: "There should be no space before ','.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "function foo(a,b){}",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Identifier"
                },
                {
                    message: "A space is required after ','.",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = (a,b) => {}",
            settings: { ecmascript: 6 },
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Identifier"
                },
                {
                    message: "A space is required after ','.",
                    type: "Identifier"
                }
            ]
        }
    ]
});
