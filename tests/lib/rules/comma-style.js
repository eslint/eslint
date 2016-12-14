/**
 * @fileoverview Comma style
 * @author Vignesh Anand aka vegetableman
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/comma-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

const BAD_LN_BRK_MSG = "Bad line breaking before and after ','.",
    FIRST_MSG = "',' should be placed first.",
    LAST_MSG = "',' should be placed last.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("comma-style", rule, {

    valid: [
        "var foo = 1, bar = 3;",
        "var foo = {'a': 1, 'b': 2};",
        "var foo = [1, 2];",
        "var foo = [, 2];",
        "var foo = [1, ];",
        "var foo = ['apples', \n 'oranges'];",
        "var foo = {'a': 1, \n 'b': 2, \n'c': 3};",
        "var foo = {'a': 1, \n 'b': 2, 'c':\n 3};",
        "var foo = {'a': 1, \n 'b': 2, 'c': [{'d': 1}, \n {'e': 2}, \n {'f': 3}]};",
        { code: "var foo = [1, \n2, \n3];" },
        { code: "function foo(){var a=[1,\n 2]}" },
        { code: "function foo(){return {'a': 1,\n'b': 2}}" },
        { code: "var foo = \n1, \nbar = \n2;" },
        { code: "var foo = [\n(bar),\nbaz\n];" },
        { code: "var foo = [\n(bar\n),\nbaz\n];" },
        { code: "var foo = [\n(\nbar\n),\nbaz\n];" },
        { code: "var foo = [\n(bar\n)\n,baz\n];", options: ["first"] },
        { code: "var foo = \n1, \nbar = [1,\n2,\n3]" },
        { code: "var foo = ['apples'\n,'oranges'];", options: ["first"] },
        { code: "var foo = 1, bar = 2;", options: ["first"] },
        { code: "var foo = 1 \n ,bar = 2;", options: ["first"] },
        { code: "var foo = {'a': 1 \n ,'b': 2 \n,'c': 3};", options: ["first"] },
        { code: "var foo = [1 \n ,2 \n, 3];", options: ["first"] },
        { code: "function foo(){return {'a': 1\n,'b': 2}}", options: ["first"] },
        { code: "function foo(){var a=[1\n, 2]}", options: ["first"] },
        { code: "f(1\n, 2);" },
        { code: "function foo(a\n, b) { return a + b; }" },
        {
            code: "var a = 'a',\no = 'o';",
            options: ["first", { exceptions: { VariableDeclaration: true } }]
        },
        {
            code: "var arr = ['a',\n'o'];",
            options: ["first", { exceptions: { ArrayExpression: true } }]
        },
        {
            code: "var obj = {a: 'a',\nb: 'b'};",
            options: ["first", { exceptions: { ObjectExpression: true } }]
        },
        {
            code: "var a = 'a',\no = 'o',\narr = [1,\n2];",
            options: ["first", { exceptions: { VariableDeclaration: true, ArrayExpression: true } }]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            options: ["first", { exceptions: { ArrayExpression: true, ObjectExpression: true } }]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            options: ["first", { exceptions: { ArrayExpression: true, ObjectExpression: true } }]
        },
        {
            code: "var a = 'a',\nar ={fst:1,\nsnd: [1,\n2]};",
            options: ["first", {
                exceptions: {
                    ArrayExpression: true,
                    ObjectExpression: true,
                    VariableDeclaration: true
                }
            }]
        },
        {
            code: "const foo = (a\n, b) => { return a + b; }",
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "function foo([a\n, b]) { return a + b; }",
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "const foo = ([a\n, b]) => { return a + b; }",
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "import { a\n, b } from './source';",
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            }
        },
        {
            code: "const foo = function (a\n, b) { return a + b; }",
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "var {foo\n, bar} = {foo:'apples', bar:'oranges'};",
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "var {foo\n, bar} = {foo:'apples', bar:'oranges'};",
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "var {foo\n, bar} = {foo:'apples', bar:'oranges'};",
            options: ["first", {
                exceptions: {
                    ObjectPattern: true
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "f(1\n, 2);",
            options: ["last", {
                exceptions: {
                    CallExpression: true
                }
            }]
        },
        {
            code: "function foo(a\n, b) { return a + b; }",
            options: ["last", {
                exceptions: {
                    FunctionDeclaration: true
                }
            }]
        },
        {
            code: "const foo = function (a\n, b) { return a + b; }",
            options: ["last", {
                exceptions: {
                    FunctionExpression: true
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "function foo([a\n, b]) { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrayPattern: true
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "const foo = (a\n, b) => { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrowFunctionExpression: true
                },
            }],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "const foo = ([a\n, b]) => { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrayPattern: true
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "import { a\n, b } from './source';",
            options: ["last", {
                exceptions: {
                    ImportDeclaration: true
                }
            }],
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            }
        },
        {
            code: "var {foo\n, bar} = {foo:'apples', bar:'oranges'};",
            options: ["last", {
                exceptions: {
                    ObjectPattern: true
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            }
        }
    ],

    invalid: [
        {
            code: "var foo = { a: 1. //comment \n, b: 2\n}",
            output: "var foo = { a: 1., //comment \n b: 2\n}",
            errors: [{
                message: LAST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var foo = { a: 1. //comment \n //comment1 \n //comment2 \n, b: 2\n}",
            output: "var foo = { a: 1., //comment \n //comment1 \n //comment2 \n b: 2\n}",
            errors: [{
                message: LAST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var foo = 1\n,\nbar = 2;",
            output: "var foo = 1,\nbar = 2;",
            errors: [{
                message: BAD_LN_BRK_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = 1 //comment\n,\nbar = 2;",
            output: "var foo = 1, //comment\nbar = 2;",
            errors: [{
                message: BAD_LN_BRK_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = 1 //comment\n, // comment 2\nbar = 2;",
            output: "var foo = 1, //comment // comment 2\nbar = 2;",
            errors: [{
                message: BAD_LN_BRK_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = 1\n,bar = 2;",
            output: "var foo = 1,\nbar = 2;",
            errors: [{
                message: LAST_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "f([1,2\n,3]);",
            output: "f([1,2,\n3]);",
            errors: [{
                message: LAST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "f([1,2\n,]);",
            output: "f([1,2,\n]);",
            errors: [{
                message: LAST_MSG,
                type: "Punctuator"
            }]
        },
        {
            code: "f([,2\n,3]);",
            output: "f([,2,\n3]);",
            errors: [{
                message: LAST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var foo = ['apples'\n, 'oranges'];",
            output: "var foo = ['apples',\n 'oranges'];",
            errors: [{
                message: LAST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var [foo\n, bar] = ['apples', 'oranges'];",
            options: ["last", {
                exceptions: {
                    ArrayPattern: false
                }
            }],
            output: "var [foo,\n bar] = ['apples', 'oranges'];",
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                message: LAST_MSG,
                type: "Identifier"
            }]
        },
        {
            code: "f(1\n, 2);",
            options: ["last", {
                exceptions: {
                    CallExpression: false
                }
            }],
            output: "f(1,\n 2);",
            errors: [{
                message: LAST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "function foo(a\n, b) { return a + b; }",
            options: ["last", {
                exceptions: {
                    FunctionDeclaration: false
                }
            }],
            output: "function foo(a,\n b) { return a + b; }",
            errors: [{
                message: LAST_MSG,
                type: "Identifier"
            }]
        },
        {
            code: "const foo = function (a\n, b) { return a + b; }",
            options: ["last", {
                exceptions: {
                    FunctionExpression: false
                }
            }],
            output: "const foo = function (a,\n b) { return a + b; }",
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [{
                message: LAST_MSG,
                type: "Identifier"
            }]
        },
        {
            code: "function foo([a\n, b]) { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrayPattern: false
                }
            }],
            output: "function foo([a,\n b]) { return a + b; }",
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                message: LAST_MSG,
                type: "Identifier"
            }]
        },
        {
            code: "const foo = (a\n, b) => { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrowFunctionExpression: false
                },
            }],
            output: "const foo = (a,\n b) => { return a + b; }",
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                message: LAST_MSG,
                type: "Identifier"
            }]
        },
        {
            code: "const foo = ([a\n, b]) => { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrayPattern: false
                }
            }],
            output: "const foo = ([a,\n b]) => { return a + b; }",
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                message: LAST_MSG,
                type: "Identifier"
            }]
        },
        {
            code: "import { a\n, b } from './source';",
            options: ["last", {
                exceptions: {
                    ImportDeclaration: false
                }
            }],
            output: "import { a,\n b } from './source';",
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [{
                message: LAST_MSG,
                type: "ImportSpecifier"
            }]
        },
        {
            code: "var {foo\n, bar} = {foo:'apples', bar:'oranges'};",
            options: ["last", {
                exceptions: {
                    ObjectPattern: false
                }
            }],
            output: "var {foo,\n bar} = {foo:'apples', bar:'oranges'};",
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                message: LAST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var foo = 1,\nbar = 2;",
            output: "var foo = 1\n,bar = 2;",
            options: ["first"],
            errors: [{
                message: FIRST_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "f([1,\n2,3]);",
            output: "f([1\n,2,3]);",
            options: ["first"],
            errors: [{
                message: FIRST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var foo = ['apples', \n 'oranges'];",
            output: "var foo = ['apples' \n ,'oranges'];",
            options: ["first"],
            errors: [{
                message: FIRST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var foo = {'a': 1, \n 'b': 2\n ,'c': 3};",
            output: "var foo = {'a': 1 \n ,'b': 2\n ,'c': 3};",
            options: ["first"],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var foo = {'a': 1, \n 'b': 2\n ,'c': 3};",
            output: "var foo = {'a': 1 \n ,'b': 2\n ,'c': 3};",
            options: ["first"],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var a = 'a',\no = 'o',\narr = [1,\n2];",
            output: "var a = 'a',\no = 'o',\narr = [1\n,2];",
            options: ["first", { exceptions: { VariableDeclaration: true } }],
            errors: [{
                message: FIRST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var a = 'a',\nobj = {a: 'a',\nb: 'b'};",
            output: "var a = 'a',\nobj = {a: 'a'\n,b: 'b'};",
            options: ["first", { exceptions: { VariableDeclaration: true } }],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var a = 'a',\nobj = {a: 'a',\nb: 'b'};",
            output: "var a = 'a'\n,obj = {a: 'a',\nb: 'b'};",
            options: ["first", { exceptions: { ObjectExpression: true } }],
            errors: [{
                message: FIRST_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var a = 'a',\narr = [1,\n2];",
            output: "var a = 'a'\n,arr = [1,\n2];",
            options: ["first", { exceptions: { ArrayExpression: true } }],
            errors: [{
                message: FIRST_MSG,
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var ar =[1,\n{a: 'a',\nb: 'b'}];",
            output: "var ar =[1,\n{a: 'a'\n,b: 'b'}];",
            options: ["first", { exceptions: { ArrayExpression: true } }],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var ar =[1,\n{a: 'a',\nb: 'b'}];",
            output: "var ar =[1\n,{a: 'a',\nb: 'b'}];",
            options: ["first", { exceptions: { ObjectExpression: true } }],
            errors: [{
                message: FIRST_MSG,
                type: "ObjectExpression"
            }]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            output: "var ar ={fst:1,\nsnd: [1\n,2]};",
            options: ["first", { exceptions: { ObjectExpression: true } }],
            errors: [{
                message: FIRST_MSG,
                type: "Literal"
            }]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            output: "var ar ={fst:1\n,snd: [1,\n2]};",
            options: ["first", { exceptions: { ArrayExpression: true } }],
            errors: [{
                message: FIRST_MSG,
                type: "Property"
            }]
        },
        {
            code: "var foo = [\n(bar\n)\n,\nbaz\n];",
            output: "var foo = [\n(bar\n),\nbaz\n];",
            errors: [{
                message: BAD_LN_BRK_MSG,
                type: "Identifier"
            }]
        }
    ]
});
