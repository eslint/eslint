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
        "var foo = [1, \n2, \n3];",
        "function foo(){var a=[1,\n 2]}",
        "function foo(){return {'a': 1,\n'b': 2}}",
        "var foo = \n1, \nbar = \n2;",
        "var foo = [\n(bar),\nbaz\n];",
        "var foo = [\n(bar\n),\nbaz\n];",
        "var foo = [\n(\nbar\n),\nbaz\n];",
        "new Foo(a\n,b);",
        { code: "var foo = [\n(bar\n)\n,baz\n];", options: ["first"] },
        "var foo = \n1, \nbar = [1,\n2,\n3]",
        { code: "var foo = ['apples'\n,'oranges'];", options: ["first"] },
        { code: "var foo = 1, bar = 2;", options: ["first"] },
        { code: "var foo = 1 \n ,bar = 2;", options: ["first"] },
        { code: "var foo = {'a': 1 \n ,'b': 2 \n,'c': 3};", options: ["first"] },
        { code: "var foo = [1 \n ,2 \n, 3];", options: ["first"] },
        { code: "function foo(){return {'a': 1\n,'b': 2}}", options: ["first"] },
        { code: "function foo(){var a=[1\n, 2]}", options: ["first"] },
        { code: "new Foo(a,\nb);", options: ["first"] },
        "f(1\n, 2);",
        "function foo(a\n, b) { return a + b; }",
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
            code: "new Foo(a,\nb);",
            options: ["first", {
                exceptions: {
                    NewExpression: true
                }
            }]
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
                }
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
        },
        {
            code: "new Foo(a,\nb);",
            options: ["last", {
                exceptions: {
                    NewExpression: false
                }
            }]
        },
        {
            code: "new Foo(a\n,b);",
            options: ["last", {
                exceptions: {
                    NewExpression: true
                }
            }]
        }
    ],

    invalid: [
        {
            code: "var foo = { a: 1. //comment \n, b: 2\n}",
            output: "var foo = { a: 1., //comment \n b: 2\n}",
            errors: [{
                messageId: "expectedCommaLast",
                type: "Property"
            }]
        },
        {
            code: "var foo = { a: 1. //comment \n //comment1 \n //comment2 \n, b: 2\n}",
            output: "var foo = { a: 1., //comment \n //comment1 \n //comment2 \n b: 2\n}",
            errors: [{
                messageId: "expectedCommaLast",
                type: "Property"
            }]
        },
        {
            code: "var foo = 1\n,\nbar = 2;",
            output: "var foo = 1,\nbar = 2;",
            errors: [{
                messageId: "unexpectedLineBeforeAndAfterComma",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = 1 //comment\n,\nbar = 2;",
            output: "var foo = 1, //comment\nbar = 2;",
            errors: [{
                messageId: "unexpectedLineBeforeAndAfterComma",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = 1 //comment\n, // comment 2\nbar = 2;",
            output: "var foo = 1, //comment // comment 2\nbar = 2;",
            errors: [{
                messageId: "unexpectedLineBeforeAndAfterComma",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "new Foo(a\n,\nb);",
            output: "new Foo(a,\nb);",
            options: ["last", {
                exceptions: {
                    NewExpression: false
                }
            }],
            errors: [{ messageId: "unexpectedLineBeforeAndAfterComma" }]
        },
        {
            code: "var foo = 1\n,bar = 2;",
            output: "var foo = 1,\nbar = 2;",
            errors: [{
                messageId: "expectedCommaLast",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "f([1,2\n,3]);",
            output: "f([1,2,\n3]);",
            errors: [{
                messageId: "expectedCommaLast",
                type: "Literal"
            }]
        },
        {
            code: "f([1,2\n,]);",
            output: "f([1,2,\n]);",
            errors: [{
                messageId: "expectedCommaLast",
                type: "Punctuator"
            }]
        },
        {
            code: "f([,2\n,3]);",
            output: "f([,2,\n3]);",
            errors: [{
                messageId: "expectedCommaLast",
                type: "Literal"
            }]
        },
        {
            code: "var foo = ['apples'\n, 'oranges'];",
            output: "var foo = ['apples',\n 'oranges'];",
            errors: [{
                messageId: "expectedCommaLast",
                type: "Literal"
            }]
        },
        {
            code: "var [foo\n, bar] = ['apples', 'oranges'];",
            output: "var [foo,\n bar] = ['apples', 'oranges'];",
            options: ["last", {
                exceptions: {
                    ArrayPattern: false
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "expectedCommaLast",
                type: "Identifier"
            }]
        },
        {
            code: "f(1\n, 2);",
            output: "f(1,\n 2);",
            options: ["last", {
                exceptions: {
                    CallExpression: false
                }
            }],
            errors: [{
                messageId: "expectedCommaLast",
                type: "Literal"
            }]
        },
        {
            code: "function foo(a\n, b) { return a + b; }",
            output: "function foo(a,\n b) { return a + b; }",
            options: ["last", {
                exceptions: {
                    FunctionDeclaration: false
                }
            }],
            errors: [{
                messageId: "expectedCommaLast",
                type: "Identifier"
            }]
        },
        {
            code: "const foo = function (a\n, b) { return a + b; }",
            output: "const foo = function (a,\n b) { return a + b; }",
            options: ["last", {
                exceptions: {
                    FunctionExpression: false
                }
            }],
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [{
                messageId: "expectedCommaLast",
                type: "Identifier"
            }]
        },
        {
            code: "function foo([a\n, b]) { return a + b; }",
            output: "function foo([a,\n b]) { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrayPattern: false
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "expectedCommaLast",
                type: "Identifier"
            }]
        },
        {
            code: "const foo = (a\n, b) => { return a + b; }",
            output: "const foo = (a,\n b) => { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrowFunctionExpression: false
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "expectedCommaLast",
                type: "Identifier"
            }]
        },
        {
            code: "const foo = ([a\n, b]) => { return a + b; }",
            output: "const foo = ([a,\n b]) => { return a + b; }",
            options: ["last", {
                exceptions: {
                    ArrayPattern: false
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "expectedCommaLast",
                type: "Identifier"
            }]
        },
        {
            code: "import { a\n, b } from './source';",
            output: "import { a,\n b } from './source';",
            options: ["last", {
                exceptions: {
                    ImportDeclaration: false
                }
            }],
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            errors: [{
                messageId: "expectedCommaLast",
                type: "ImportSpecifier"
            }]
        },
        {
            code: "var {foo\n, bar} = {foo:'apples', bar:'oranges'};",
            output: "var {foo,\n bar} = {foo:'apples', bar:'oranges'};",
            options: ["last", {
                exceptions: {
                    ObjectPattern: false
                }
            }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "expectedCommaLast",
                type: "Property"
            }]
        },
        {
            code: "var foo = 1,\nbar = 2;",
            output: "var foo = 1\n,bar = 2;",
            options: ["first"],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "f([1,\n2,3]);",
            output: "f([1\n,2,3]);",
            options: ["first"],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "Literal"
            }]
        },
        {
            code: "var foo = ['apples', \n 'oranges'];",
            output: "var foo = ['apples' \n ,'oranges'];",
            options: ["first"],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "Literal"
            }]
        },
        {
            code: "var foo = {'a': 1, \n 'b': 2\n ,'c': 3};",
            output: "var foo = {'a': 1 \n ,'b': 2\n ,'c': 3};",
            options: ["first"],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "Property"
            }]
        },
        {
            code: "var a = 'a',\no = 'o',\narr = [1,\n2];",
            output: "var a = 'a',\no = 'o',\narr = [1\n,2];",
            options: ["first", { exceptions: { VariableDeclaration: true } }],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "Literal"
            }]
        },
        {
            code: "var a = 'a',\nobj = {a: 'a',\nb: 'b'};",
            output: "var a = 'a',\nobj = {a: 'a'\n,b: 'b'};",
            options: ["first", { exceptions: { VariableDeclaration: true } }],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "Property"
            }]
        },
        {
            code: "var a = 'a',\nobj = {a: 'a',\nb: 'b'};",
            output: "var a = 'a'\n,obj = {a: 'a',\nb: 'b'};",
            options: ["first", { exceptions: { ObjectExpression: true } }],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var a = 'a',\narr = [1,\n2];",
            output: "var a = 'a'\n,arr = [1,\n2];",
            options: ["first", { exceptions: { ArrayExpression: true } }],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var ar =[1,\n{a: 'a',\nb: 'b'}];",
            output: "var ar =[1,\n{a: 'a'\n,b: 'b'}];",
            options: ["first", { exceptions: { ArrayExpression: true } }],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "Property"
            }]
        },
        {
            code: "var ar =[1,\n{a: 'a',\nb: 'b'}];",
            output: "var ar =[1\n,{a: 'a',\nb: 'b'}];",
            options: ["first", { exceptions: { ObjectExpression: true } }],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "ObjectExpression"
            }]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            output: "var ar ={fst:1,\nsnd: [1\n,2]};",
            options: ["first", { exceptions: { ObjectExpression: true } }],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "Literal"
            }]
        },
        {
            code: "var ar ={fst:1,\nsnd: [1,\n2]};",
            output: "var ar ={fst:1\n,snd: [1,\n2]};",
            options: ["first", { exceptions: { ArrayExpression: true } }],
            errors: [{
                messageId: "expectedCommaFirst",
                type: "Property"
            }]
        },
        {
            code: "new Foo(a,\nb);",
            output: "new Foo(a\n,b);",
            options: ["first", {
                exceptions: {
                    NewExpression: false
                }
            }],
            errors: [{ messageId: "expectedCommaFirst" }]
        },
        {
            code: "var foo = [\n(bar\n)\n,\nbaz\n];",
            output: "var foo = [\n(bar\n),\nbaz\n];",
            errors: [{
                messageId: "unexpectedLineBeforeAndAfterComma",
                type: "Identifier"
            }]
        },
        {
            code: "[(foo),\n,\nbar]",
            output: "[(foo),,\nbar]",
            errors: [{ messageId: "unexpectedLineBeforeAndAfterComma" }]
        },
        {
            code: "new Foo(a\n,b);",
            output: "new Foo(a,\nb);",
            options: ["last", {
                exceptions: {
                    NewExpression: false
                }
            }],
            errors: [{ messageId: "expectedCommaLast" }]
        },
        {
            code: "[\n[foo(3)],\n,\nbar\n];",
            output: "[\n[foo(3)],,\nbar\n];",
            errors: [{ messageId: "unexpectedLineBeforeAndAfterComma" }]
        },
        {

            // https://github.com/eslint/eslint/issues/10632
            code: "[foo//\n,/*block\ncomment*/];",
            output: "[foo,//\n/*block\ncomment*/];",
            errors: [{ messageId: "unexpectedLineBeforeAndAfterComma" }]
        }
    ]
});
