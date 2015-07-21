/**
 * @fileoverview tests to validate spacing before and after comma.
 * @author Vignesh Anand.
 * @copyright 2014 Vignesh Anand. All rights reserved.
 * @copyright 2015 Evan Simmons. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/comma-spacing", {

    valid: [
        "myfunc(404, true/* bla bla bla */, 'hello');",
        "myfunc(404, true/* bla bla bla *//* hi */, 'hello');",
        "var a = 1, b = 2;",
        "var arr = [, ];",
        "var arr = [1, ];",
        "var arr = [, 2];",
        "var arr = [1, 2];",
        "var arr = [, , ];",
        "var arr = [1, , ];",
        "var arr = [, 2, ];",
        "var arr = [, , 3];",
        "var arr = [1, 2, ];",
        "var arr = [, 2, 3];",
        "var arr = [1, , 3];",
        "var arr = [1, 2, 3];",
        "var obj = {'foo':'bar', 'baz':'qur'};",
        "var obj = {'foo':'bar', 'baz':\n'qur'};",
        "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
        "function foo(a, b){}",
        {code: "function foo(a, b = 1){}", ecmaFeatures: {defaultParams: true}},
        {code: "function foo(a = 1, b, c){}", ecmaFeatures: {defaultParams: true}},
        { code: "var foo = (a, b) => {}", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = (a=1, b) => {}", ecmaFeatures: {
            arrowFunctions: true, defaultParams: true
        } },
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
        {code: "[`  ,  `]", ecmaFeatures: {templateStrings: true}},
        {code: "`${[1, 2]}`", ecmaFeatures: {templateStrings: true}},
        "foo(/,/, 'a')",
        "var x = ',,,,,';",
        "var code = 'var foo = 1, bar = 3;',",
        "['apples', \n 'oranges'];",
        "{x: 'var x,y,z'}",
        {code: "var obj = {'foo':\n'bar' ,'baz':\n'qur'};", args: [2, {before: true, after: false}]},
        {code: "var a = 1 ,b = 2;", args: [2, {before: true, after: false}]},
        {code: "function foo(a ,b){}", args: [2, {before: true, after: false}]},
        {code: "var arr = [ ,];", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 ,];", args: [2, {before: true, after: false}]},
        {code: "var arr = [ ,2];", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 ,2];", args: [2, {before: true, after: false}]},
        {code: "var arr = [ , ,];", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 , ,];", args: [2, {before: true, after: false}]},
        {code: "var arr = [ ,2 ,];", args: [2, {before: true, after: false}]},
        {code: "var arr = [ , ,3];", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 ,2 ,];", args: [2, {before: true, after: false}]},
        {code: "var arr = [ ,2 ,3];", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 , ,3];", args: [2, {before: true, after: false}]},
        {code: "var arr = [1 ,2 ,3];", args: [2, {before: true, after: false}]},
        {code: "var obj = {'foo':'bar' , 'baz':'qur'};", args: [2, {before: true, after: true}]},
        {code: "var a = 1 , b = 2;", args: [2, {before: true, after: true}]},
        {code: "var arr = [ , ];", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , ];", args: [2, {before: true, after: true}]},
        {code: "var arr = [ , 2];", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , 2];", args: [2, {before: true, after: true}]},
        {code: "var arr = [ , , ];", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , , ];", args: [2, {before: true, after: true}]},
        {code: "var arr = [ , 2 , ];", args: [2, {before: true, after: true}]},
        {code: "var arr = [ , , 3];", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , 2 , ];", args: [2, {before: true, after: true}]},
        {code: "var arr = [ , 2 , 3];", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , , 3];", args: [2, {before: true, after: true}]},
        {code: "var arr = [1 , 2 , 3];", args: [2, {before: true, after: true}]},
        {code: "a , b", args: [2, {before: true, after: true}]},
        {code: "var arr = [,];", args: [2, {before: false, after: false}]},
        {code: "var arr = [1,];", args: [2, {before: false, after: false}]},
        {code: "var arr = [,2];", args: [2, {before: false, after: false}]},
        {code: "var arr = [1,2];", args: [2, {before: false, after: false}]},
        {code: "var arr = [,,];", args: [2, {before: false, after: false}]},
        {code: "var arr = [1,,];", args: [2, {before: false, after: false}]},
        {code: "var arr = [,2,];", args: [2, {before: false, after: false}]},
        {code: "var arr = [,,3];", args: [2, {before: false, after: false}]},
        {code: "var arr = [1,2,];", args: [2, {before: false, after: false}]},
        {code: "var arr = [,2,3];", args: [2, {before: false, after: false}]},
        {code: "var arr = [1,,3];", args: [2, {before: false, after: false}]},
        {code: "var arr = [1,2,3];", args: [2, {before: false, after: false}]},
        {code: "var a = (1 + 2,2)", args: [2, {before: false, after: false}]},
        { code: "var a; console.log(`${a}`, \"a\");", ecmaFeatures: { templateStrings: true } },
        { code: "var [a, b] = [1, 2];", ecmaFeatures: { destructuring: true } },
        { code: "var [a, b, ] = [1, 2];", ecmaFeatures: { destructuring: true } },
        { code: "var [a, , b] = [1, 2, 3];", ecmaFeatures: { destructuring: true } },
        { code: "<a>,</a>", ecmaFeatures: { jsx: true } },
        { code: "<a>  ,  </a>", ecmaFeatures: { jsx: true } },
        { code: "<a>Hello, world</a>", args: [2, { before: true, after: false }], ecmaFeatures: { jsx: true } }
    ],

    invalid: [
        {
            code: "a(b,c)",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "new A(b,c)",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var a = 1 ,b = 2;",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 , 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [ , 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
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
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [(1) , 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1, 2];",
            args: [2, {before: true, after: false}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                },
                {
                    message: "There should be no space after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1\n  , 2];",
            args: [2, {before: false, after: false}],
            errors: [
                {
                    message: "There should be no space after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1,\n  2];",
            args: [2, {before: true, after: false}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
            args: [2, {before: true, after: false}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                },
                {
                    message: "There should be no space after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {a: 1\n  ,b: 2};",
            args: [2, {before: false, after: true}],
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {a: 1 ,\n  b: 2};",
            args: [2, {before: false, after: false}],
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 ,2];",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1,2];",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar','baz':\n'qur'};",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 , 2];",
            args: [2, {before: false, after: false}],
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    message: "There should be no space after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "a ,b",
            args: [2, {before: false, after: true}],
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "function foo(a,b){}",
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
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
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var foo = (a = 1,b) => {}",
            ecmaFeatures: { arrowFunctions: true, defaultParams: true },
            args: [2, {before: true, after: true}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "function foo(a = 1 ,b = 2) {}",
            ecmaFeatures: { defaultParams: true },
            args: [2, {before: false, after: true}],
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "<a>{foo(1 ,2)}</a>",
            ecmaFeatures: { jsx: true },
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "myfunc(404, true/* bla bla bla */ , 'hello');",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "myfunc(404, true/* bla bla bla */ /* hi */, 'hello');",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        }
    ]
});
