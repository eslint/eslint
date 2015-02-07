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
        "var arr = [, 2];",
        "var arr = [1, ];",
        "var obj = {'foo':'bar', 'baz':'qur'};",
        "var obj = {'foo':'bar', 'baz':\n'qur'};",
        "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
        "function foo(a, b){}",
        { code: "var foo = (a, b) => {}", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = a => a + 2", ecmaFeatures: { arrowFunctions: true } },
        "a, b",
        "var a = (1 + 2, 2);",
        "a(b, c)",
        "new A(b, c)",
        "foo((a), b)",
        "var b = ((1 + 2), 2);",
        "parseInt((a + b), 10)",
        "go.boom((a + b), 10)",
        "go.boom((a + b), 10, (4))",
        "var x = [ (a + c), (b + b) ]",
        "['  ,  ']",
        "foo(/,/, 'a')",
        "var x = ',,,,,';",
        "var code = 'var foo = 1, bar = 3;',",
        "['apples', \n 'oranges'];",
        "{x: 'var x,y,z'}",
        {code: "var obj = {'foo':\n'bar' ,'baz':\n'qur'};", args: [2, {before: true, after: false}]},
        {code: "var a = 1 ,b = 2;", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 ,2];", args: [2, {before: true, after: false}]},
        {code: "function foo(a ,b){}", args: [2, {before: true, after: false}]},
        {code: "var obj = {'foo':'bar' , 'baz':'qur'};", args: [2, {before: true, after: true}]},
        {code: "var a = 1 , b = 2;", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , 2];", args: [2, {before: true, after: true}]},
        {code: "a , b", args: [2, {before: true, after: true}]},
        {code: "var arr = [1,2];", args: [2, {before: false, after: false}]},
        {code: "var a = (1 + 2,2)", args: [2, {before: false, after: false}]},
        { code: "var a; console.log(`${a}`, \"a\");", ecmaFeatures: { templateStrings: true } }
    ],

    invalid: [
        {
            code: "a(b,c)",
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
            code: "new A(b,c)",
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
            code: "var a = 1 ,b = 2;",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "VariableDeclarator"
                },
                {
                    message: "A space is required after ','.",
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
            code: "var arr = [ , 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var arr = [1 , ];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 , ];",
            args: [2, { before: true, after: false }],
            errors: [
                {
                    message: "There should be no space after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 ,2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Literal"
                },
                {
                    message: "A space is required after ','.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var arr = [(1) , 2];",
            errors: [
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
                    message: "There should be no space before ','.",
                    type: "Identifier"
                },
                {
                    message: "A space is required after ','.",
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
            ecmaFeatures: { arrowFunctions: true },
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
