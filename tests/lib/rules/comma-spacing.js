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

var rule = require("../../../lib/rules/comma-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("comma-spacing", rule, {
    valid: [
        "myfunc(404, true/* bla bla bla */, 'hello');",
        "myfunc(404, true /* bla bla bla */, 'hello');",
        "myfunc(404, true/* bla bla bla *//* hi */, 'hello');",
        "myfunc(404, true/* bla bla bla */ /* hi */, 'hello');",
        "myfunc(404, true, /* bla bla bla */ 'hello');",
        "myfunc(404, // comment\n true, /* bla bla bla */ 'hello');",
        {code: "myfunc(404, // comment\n true,/* bla bla bla */ 'hello');", options: [{before: false, after: false}]},
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
        {code: "var obj = {'foo':\n'bar' ,'baz':\n'qur'};", options: [{before: true, after: false}]},
        {code: "var a = 1 ,b = 2;", options: [{before: true, after: false}]},
        {code: "function foo(a ,b){}", options: [{before: true, after: false}]},
        {code: "var arr = [,];", options: [{before: true, after: false}]},
        {code: "var arr = [1 ,];", options: [{before: true, after: false}]},
        {code: "var arr = [ ,2];", options: [{before: true, after: false}]},
        {code: "var arr = [1 ,2];", options: [{before: true, after: false}]},
        {code: "var arr = [,,];", options: [{before: true, after: false}]},
        {code: "var arr = [1 , ,];", options: [{before: true, after: false}]},
        {code: "var arr = [ ,2 ,];", options: [{before: true, after: false}]},
        {code: "var arr = [ , ,3];", options: [{before: true, after: false}]},
        {code: "var arr = [1 ,2 ,];", options: [{before: true, after: false}]},
        {code: "var arr = [ ,2 ,3];", options: [{before: true, after: false}]},
        {code: "var arr = [1 , ,3];", options: [{before: true, after: false}]},
        {code: "var arr = [1 ,2 ,3];", options: [{before: true, after: false}]},
        {code: "var obj = {'foo':'bar' , 'baz':'qur'};", options: [{before: true, after: true}]},
        {code: "var a = 1 , b = 2;", options: [{before: true, after: true}]},
        {code: "var arr = [, ];", options: [{before: true, after: true}]},
        {code: "var arr = [1 , ];", options: [{before: true, after: true}]},
        {code: "var arr = [ , 2];", options: [{before: true, after: true}]},
        {code: "var arr = [1 , 2];", options: [{before: true, after: true}]},
        {code: "var arr = [, , ];", options: [{before: true, after: true}]},
        {code: "var arr = [1 , , ];", options: [{before: true, after: true}]},
        {code: "var arr = [ , 2 , ];", options: [{before: true, after: true}]},
        {code: "var arr = [ , , 3];", options: [{before: true, after: true}]},
        {code: "var arr = [1 , 2 , ];", options: [{before: true, after: true}]},
        {code: "var arr = [, 2 , 3];", options: [{before: true, after: true}]},
        {code: "var arr = [1 , , 3];", options: [{before: true, after: true}]},
        {code: "var arr = [1 , 2 , 3];", options: [{before: true, after: true}]},
        {code: "a , b", options: [{before: true, after: true}]},
        {code: "var arr = [,];", options: [{before: false, after: false}]},
        {code: "var arr = [ ,];", options: [{before: false, after: false}]},
        {code: "var arr = [1,];", options: [{before: false, after: false}]},
        {code: "var arr = [,2];", options: [{before: false, after: false}]},
        {code: "var arr = [ ,2];", options: [{before: false, after: false}]},
        {code: "var arr = [1,2];", options: [{before: false, after: false}]},
        {code: "var arr = [,,];", options: [{before: false, after: false}]},
        {code: "var arr = [ ,,];", options: [{before: false, after: false}]},
        {code: "var arr = [1,,];", options: [{before: false, after: false}]},
        {code: "var arr = [,2,];", options: [{before: false, after: false}]},
        {code: "var arr = [ ,2,];", options: [{before: false, after: false}]},
        {code: "var arr = [,,3];", options: [{before: false, after: false}]},
        {code: "var arr = [1,2,];", options: [{before: false, after: false}]},
        {code: "var arr = [,2,3];", options: [{before: false, after: false}]},
        {code: "var arr = [1,,3];", options: [{before: false, after: false}]},
        {code: "var arr = [1,2,3];", options: [{before: false, after: false}]},
        {code: "var a = (1 + 2,2)", options: [{before: false, after: false}]},
        { code: "var a; console.log(`${a}`, \"a\");", ecmaFeatures: { templateStrings: true } },
        { code: "var [a, b] = [1, 2];", ecmaFeatures: { destructuring: true } },
        { code: "var [a, b, ] = [1, 2];", ecmaFeatures: { destructuring: true } },
        { code: "var [a, , b] = [1, 2, 3];", ecmaFeatures: { destructuring: true } },
        { code: "var [ , b] = a;", ecmaFeatures: { destructuring: true } },
        { code: "var [, b] = a;", ecmaFeatures: { destructuring: true } },
        { code: "<a>,</a>", ecmaFeatures: { jsx: true } },
        { code: "<a>  ,  </a>", ecmaFeatures: { jsx: true } },
        { code: "<a>Hello, world</a>", options: [{ before: true, after: false }], ecmaFeatures: { jsx: true } }
    ],

    invalid: [
        {
            code: "a(b,c)",
            output: "a(b , c)",
            options: [{before: true, after: true}],
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
            output: "new A(b , c)",
            options: [{before: true, after: true}],
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
            output: "var a = 1, b = 2;",
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
            output: "var arr = [1, 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 , ];",
            output: "var arr = [1, ];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 , ];",
            output: "var arr = [1 ,];",
            options: [{ before: true, after: false }],
            errors: [
                {
                    message: "There should be no space after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 ,2];",
            output: "var arr = [1, 2];",
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
            output: "var arr = [(1), 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1, 2];",
            output: "var arr = [1 ,2];",
            options: [{before: true, after: false}],
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
            output: "var arr = [1\n  ,2];",
            options: [{before: false, after: false}],
            errors: [
                {
                    message: "There should be no space after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1,\n  2];",
            output: "var arr = [1 ,\n  2];",
            options: [{before: true, after: false}],
            errors: [
                {
                    message: "A space is required before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
            output: "var obj = {'foo':\n'bar' ,'baz':\n'qur'};",
            options: [{before: true, after: false}],
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
            output: "var obj = {a: 1\n  , b: 2};",
            options: [{before: false, after: true}],
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {a: 1 ,\n  b: 2};",
            output: "var obj = {a: 1,\n  b: 2};",
            options: [{before: false, after: false}],
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 ,2];",
            output: "var arr = [1 , 2];",
            options: [{before: true, after: true}],
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1,2];",
            output: "var arr = [1 , 2];",
            options: [{before: true, after: true}],
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
            output: "var obj = {'foo':\n'bar' , 'baz':\n'qur'};",
            options: [{before: true, after: true}],
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
            output: "var arr = [1,2];",
            options: [{before: false, after: false}],
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
            output: "a, b",
            options: [{before: false, after: true}],
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
            output: "function foo(a , b){}",
            options: [{before: true, after: true}],
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
            output: "var foo = (a , b) => {}",
            ecmaFeatures: { arrowFunctions: true },
            options: [{before: true, after: true}],
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
            output: "var foo = (a = 1 , b) => {}",
            ecmaFeatures: { arrowFunctions: true, defaultParams: true },
            options: [{before: true, after: true}],
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
            output: "function foo(a = 1, b = 2) {}",
            ecmaFeatures: { defaultParams: true },
            options: [{before: false, after: true}],
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
            output: "<a>{foo(1, 2)}</a>",
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
            output: "myfunc(404, true/* bla bla bla */, 'hello');",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "myfunc(404, true,/* bla bla bla */ 'hello');",
            output: "myfunc(404, true, /* bla bla bla */ 'hello');",
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "myfunc(404,// comment\n true, 'hello');",
            output: "myfunc(404, // comment\n true, 'hello');",
            errors: [
                {
                    message: "A space is required after ','.",
                    type: "Punctuator"
                }
            ]
        }
    ]
});
