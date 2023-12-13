/**
 * @fileoverview tests to validate spacing before and after comma.
 * @author Vignesh Anand.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/comma-spacing"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("comma-spacing", rule, {
    valid: [
        "myfunc(404, true/* bla bla bla */, 'hello');",
        "myfunc(404, true /* bla bla bla */, 'hello');",
        "myfunc(404, true/* bla bla bla *//* hi */, 'hello');",
        "myfunc(404, true/* bla bla bla */ /* hi */, 'hello');",
        "myfunc(404, true, /* bla bla bla */ 'hello');",
        "myfunc(404, // comment\n true, /* bla bla bla */ 'hello');",
        { code: "myfunc(404, // comment\n true,/* bla bla bla */ 'hello');", options: [{ before: false, after: false }] },
        "var a = 1, b = 2;",
        "var arr = [,];",
        "var arr = [, ];",
        "var arr = [ ,];",
        "var arr = [ , ];",
        "var arr = [1,];",
        "var arr = [1, ];",
        "var arr = [, 2];",
        "var arr = [ , 2];",
        "var arr = [1, 2];",
        "var arr = [,,];",
        "var arr = [ ,,];",
        "var arr = [, ,];",
        "var arr = [,, ];",
        "var arr = [ , ,];",
        "var arr = [ ,, ];",
        "var arr = [, , ];",
        "var arr = [ , , ];",
        "var arr = [1, , ];",
        "var arr = [, 2, ];",
        "var arr = [, , 3];",
        "var arr = [,, 3];",
        "var arr = [1, 2, ];",
        "var arr = [, 2, 3];",
        "var arr = [1, , 3];",
        "var arr = [1, 2, 3];",
        "var arr = [1, 2, 3,];",
        "var arr = [1, 2, 3, ];",
        "var obj = {'foo':'bar', 'baz':'qur'};",
        "var obj = {'foo':'bar', 'baz':'qur', };",
        "var obj = {'foo':'bar', 'baz':'qur',};",
        "var obj = {'foo':'bar', 'baz':\n'qur'};",
        "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
        "function foo(a, b){}",
        { code: "function foo(a, b = 1){}", languageOptions: { ecmaVersion: 6 } },
        { code: "function foo(a = 1, b, c){}", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = (a, b) => {}", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = (a=1, b) => {}", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = a => a + 2", languageOptions: { ecmaVersion: 6 } },
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
        { code: "[`  ,  `]", languageOptions: { ecmaVersion: 6 } },
        { code: "`${[1, 2]}`", languageOptions: { ecmaVersion: 6 } },
        { code: "fn(a, b,)", languageOptions: { ecmaVersion: 2018 } }, // #11295
        { code: "const fn = (a, b,) => {}", languageOptions: { ecmaVersion: 2018 } }, // #11295
        { code: "const fn = function (a, b,) {}", languageOptions: { ecmaVersion: 2018 } }, // #11295
        { code: "function fn(a, b,) {}", languageOptions: { ecmaVersion: 2018 } }, // #11295
        "foo(/,/, 'a')",
        "var x = ',,,,,';",
        "var code = 'var foo = 1, bar = 3;'",
        "['apples', \n 'oranges'];",
        "{x: 'var x,y,z'}",
        { code: "var obj = {'foo':\n'bar' ,'baz':\n'qur'};", options: [{ before: true, after: false }] },
        { code: "var a = 1 ,b = 2;", options: [{ before: true, after: false }] },
        { code: "function foo(a ,b){}", options: [{ before: true, after: false }] },
        { code: "var arr = [,];", options: [{ before: true, after: false }] },
        { code: "var arr = [ ,];", options: [{ before: true, after: false }] },
        { code: "var arr = [, ];", options: [{ before: true, after: false }] },
        { code: "var arr = [ , ];", options: [{ before: true, after: false }] },
        { code: "var arr = [1 ,];", options: [{ before: true, after: false }] },
        { code: "var arr = [1 , ];", options: [{ before: true, after: false }] },
        { code: "var arr = [ ,2];", options: [{ before: true, after: false }] },
        { code: "var arr = [1 ,2];", options: [{ before: true, after: false }] },
        { code: "var arr = [,,];", options: [{ before: true, after: false }] },
        { code: "var arr = [ ,,];", options: [{ before: true, after: false }] },
        { code: "var arr = [, ,];", options: [{ before: true, after: false }] },
        { code: "var arr = [,, ];", options: [{ before: true, after: false }] },
        { code: "var arr = [ , ,];", options: [{ before: true, after: false }] },
        { code: "var arr = [ ,, ];", options: [{ before: true, after: false }] },
        { code: "var arr = [, , ];", options: [{ before: true, after: false }] },
        { code: "var arr = [ , , ];", options: [{ before: true, after: false }] },
        { code: "var arr = [1 , ,];", options: [{ before: true, after: false }] },
        { code: "var arr = [ ,2 ,];", options: [{ before: true, after: false }] },
        { code: "var arr = [,2 , ];", options: [{ before: true, after: false }] },
        { code: "var arr = [ , ,3];", options: [{ before: true, after: false }] },
        { code: "var arr = [1 ,2 ,];", options: [{ before: true, after: false }] },
        { code: "var arr = [ ,2 ,3];", options: [{ before: true, after: false }] },
        { code: "var arr = [1 , ,3];", options: [{ before: true, after: false }] },
        { code: "var arr = [1 ,2 ,3];", options: [{ before: true, after: false }] },
        { code: "var obj = {'foo':'bar' , 'baz':'qur'};", options: [{ before: true, after: true }] },
        { code: "var obj = {'foo':'bar' ,'baz':'qur' , };", options: [{ before: true, after: false }] },
        { code: "var a = 1 , b = 2;", options: [{ before: true, after: true }] },
        { code: "var arr = [, ];", options: [{ before: true, after: true }] },
        { code: "var arr = [,,];", options: [{ before: true, after: true }] },
        { code: "var arr = [1 , ];", options: [{ before: true, after: true }] },
        { code: "var arr = [ , 2];", options: [{ before: true, after: true }] },
        { code: "var arr = [1 , 2];", options: [{ before: true, after: true }] },
        { code: "var arr = [, , ];", options: [{ before: true, after: true }] },
        { code: "var arr = [1 , , ];", options: [{ before: true, after: true }] },
        { code: "var arr = [ , 2 , ];", options: [{ before: true, after: true }] },
        { code: "var arr = [ , , 3];", options: [{ before: true, after: true }] },
        { code: "var arr = [1 , 2 , ];", options: [{ before: true, after: true }] },
        { code: "var arr = [, 2 , 3];", options: [{ before: true, after: true }] },
        { code: "var arr = [1 , , 3];", options: [{ before: true, after: true }] },
        { code: "var arr = [1 , 2 , 3];", options: [{ before: true, after: true }] },
        { code: "a , b", options: [{ before: true, after: true }] },
        { code: "var arr = [,];", options: [{ before: false, after: false }] },
        { code: "var arr = [ ,];", options: [{ before: false, after: false }] },
        { code: "var arr = [1,];", options: [{ before: false, after: false }] },
        { code: "var arr = [,2];", options: [{ before: false, after: false }] },
        { code: "var arr = [ ,2];", options: [{ before: false, after: false }] },
        { code: "var arr = [1,2];", options: [{ before: false, after: false }] },
        { code: "var arr = [,,];", options: [{ before: false, after: false }] },
        { code: "var arr = [ , , ];", options: [{ before: false, after: false }] },
        { code: "var arr = [ ,,];", options: [{ before: false, after: false }] },
        { code: "var arr = [1,,];", options: [{ before: false, after: false }] },
        { code: "var arr = [,2,];", options: [{ before: false, after: false }] },
        { code: "var arr = [ ,2,];", options: [{ before: false, after: false }] },
        { code: "var arr = [,,3];", options: [{ before: false, after: false }] },
        { code: "var arr = [1,2,];", options: [{ before: false, after: false }] },
        { code: "var arr = [,2,3];", options: [{ before: false, after: false }] },
        { code: "var arr = [1,,3];", options: [{ before: false, after: false }] },
        { code: "var arr = [1,2,3];", options: [{ before: false, after: false }] },
        { code: "var a = (1 + 2,2)", options: [{ before: false, after: false }] },
        { code: "var a; console.log(`${a}`, \"a\");", languageOptions: { ecmaVersion: 6 } },
        { code: "var [a, b] = [1, 2];", languageOptions: { ecmaVersion: 6 } },
        { code: "var [a, b, ] = [1, 2];", languageOptions: { ecmaVersion: 6 } },
        { code: "var [a, b,] = [1, 2];", languageOptions: { ecmaVersion: 6 } },
        { code: "var [a, , b] = [1, 2, 3];", languageOptions: { ecmaVersion: 6 } },
        { code: "var [a,, b] = [1, 2, 3];", languageOptions: { ecmaVersion: 6 } },
        { code: "var [ , b] = a;", languageOptions: { ecmaVersion: 6 } },
        { code: "var [, b] = a;", languageOptions: { ecmaVersion: 6 } },
        { code: "var { a,} = a;", languageOptions: { ecmaVersion: 6 } },
        { code: "import { a,} from 'mod';", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "<a>,</a>", languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<a>  ,  </a>", languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<a>Hello, world</a>", options: [{ before: true, after: false }], languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },

        // For backwards compatibility. Ignoring spacing between a comment and comma of a null element was possibly unintentional.
        { code: "[a, /**/ , ]", options: [{ before: false, after: true }] },
        { code: "[a , /**/, ]", options: [{ before: true, after: true }] },
        { code: "[a, /**/ , ] = foo", options: [{ before: false, after: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "[a , /**/, ] = foo", options: [{ before: true, after: true }], languageOptions: { ecmaVersion: 6 } }
    ],

    invalid: [
        {
            code: "a(b,c)",
            output: "a(b , c)",
            options: [{ before: true, after: true }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "new A(b,c)",
            output: "new A(b , c)",
            options: [{ before: true, after: true }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
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
                    messageId: "missing",
                    data: { loc: "after" },
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
            code: "var arr = [1 ,2];",
            output: "var arr = [1, 2];",
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
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
            options: [{ before: true, after: false }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
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
            options: [{ before: false, after: false }],
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
            options: [{ before: true, after: false }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar', 'baz':\n'qur'};",
            output: "var obj = {'foo':\n'bar' ,'baz':\n'qur'};",
            options: [{ before: true, after: false }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
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
            options: [{ before: false, after: true }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {a: 1 ,\n  b: 2};",
            output: "var obj = {a: 1,\n  b: 2};",
            options: [{ before: false, after: false }],
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
            options: [{ before: true, after: true }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1,2];",
            output: "var arr = [1 , 2];",
            options: [{ before: true, after: true }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var obj = {'foo':\n'bar','baz':\n'qur'};",
            output: "var obj = {'foo':\n'bar' , 'baz':\n'qur'};",
            options: [{ before: true, after: true }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var arr = [1 , 2];",
            output: "var arr = [1,2];",
            options: [{ before: false, after: false }],
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
            options: [{ before: false, after: true }],
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "function foo(a,b){}",
            output: "function foo(a , b){}",
            options: [{ before: true, after: true }],
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var foo = (a,b) => {}",
            output: "var foo = (a , b) => {}",
            options: [{ before: true, after: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "var foo = (a = 1,b) => {}",
            output: "var foo = (a = 1 , b) => {}",
            options: [{ before: true, after: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "before" },
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "function foo(a = 1 ,b = 2) {}",
            output: "function foo(a = 1, b = 2) {}",
            options: [{ before: false, after: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "<a>{foo(1 ,2)}</a>",
            output: "<a>{foo(1, 2)}</a>",
            languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } },
            errors: [
                {
                    message: "There should be no space before ','.",
                    type: "Punctuator"
                },
                {
                    messageId: "missing",
                    data: { loc: "after" },
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
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        },
        {
            code: "myfunc(404,// comment\n true, 'hello');",
            output: "myfunc(404, // comment\n true, 'hello');",
            errors: [
                {
                    messageId: "missing",
                    data: { loc: "after" },
                    type: "Punctuator"
                }
            ]
        }
    ]
});
