/**
 * @fileoverview Tests for no-redeclare rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-redeclare");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-redeclare", rule, {
    valid: [
        "var a = 3; var b = function() { var a = 10; };",
        "var a = 3; a = 10;",
        {
            code: "if (true) {\n    let b = 2;\n} else {    \nlet b = 3;\n}",
            parserOptions: {
                ecmaVersion: 6
            }
        },
        {
            code: "var a; class C { static { var a; } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "class C { static { var a; } } var a; ",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "function a(){} class C { static { var a; } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "var a; class C { static { function a(){} } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "class C { static { var a; } static { var a; } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "class C { static { function a(){} } static { function a(){} } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "class C { static { var a; { function a(){} } } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "class C { static { function a(){}; { function a(){} } } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "class C { static { var a; { let a; } } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "class C { static { let a; { let a; } } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        {
            code: "class C { static { { let a; } { let a; } } }",
            parserOptions: {
                ecmaVersion: 2022
            }
        },
        { code: "var Object = 0;", options: [{ builtinGlobals: false }] },
        { code: "var Object = 0;", options: [{ builtinGlobals: true }], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var Object = 0;", options: [{ builtinGlobals: true }], parserOptions: { ecmaFeatures: { globalReturn: true } } },
        { code: "var top = 0;", options: [{ builtinGlobals: true }] },
        { code: "var top = 0;", options: [{ builtinGlobals: true }], parserOptions: { ecmaFeatures: { globalReturn: true } }, env: { browser: true } },
        { code: "var top = 0;", options: [{ builtinGlobals: true }], parserOptions: { ecmaVersion: 6, sourceType: "module" }, env: { browser: true } },
        {
            code: "var self = 1",
            options: [{ builtinGlobals: true }],
            env: { browser: false }
        },
        { code: "var glovalThis = foo", options: [{ builtinGlobals: true }], env: { es6: true } },
        { code: "var glovalThis = foo", options: [{ builtinGlobals: true }], env: { es2017: true } },

        // Comments and built-ins.
        {
            code: "/*globals Array */",
            options: [{ builtinGlobals: false }]
        },
        {
            code: "/*globals a */",
            options: [{ builtinGlobals: false }],
            globals: { a: "readonly" }
        },
        {
            code: "/*globals a */",
            options: [{ builtinGlobals: false }],
            globals: { a: "writable" }
        },
        {
            code: "/*globals a:off */",
            options: [{ builtinGlobals: true }],
            globals: { a: "readonly" }
        },
        {
            code: "/*globals a */",
            options: [{ builtinGlobals: true }],
            globals: { a: "off" }
        }
    ],
    invalid: [
        { code: "var a = 3; var a = 10;", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' is already defined.", type: "Identifier" }] },
        { code: "switch(foo) { case a: var b = 3;\ncase b: var b = 4}", errors: [{ message: "'b' is already defined.", type: "Identifier" }] },
        { code: "var a = 3; var a = 10;", errors: [{ message: "'a' is already defined.", type: "Identifier" }] },
        { code: "var a = {}; var a = [];", errors: [{ message: "'a' is already defined.", type: "Identifier" }] },
        { code: "var a; function a() {}", errors: [{ message: "'a' is already defined.", type: "Identifier" }] },
        { code: "function a() {} function a() {}", errors: [{ message: "'a' is already defined.", type: "Identifier" }] },
        { code: "var a = function() { }; var a = function() { }", errors: [{ message: "'a' is already defined.", type: "Identifier" }] },
        { code: "var a = function() { }; var a = new Date();", errors: [{ message: "'a' is already defined.", type: "Identifier" }] },
        { code: "var a = 3; var a = 10; var a = 15;", errors: [{ message: "'a' is already defined.", type: "Identifier" }, { message: "'a' is already defined.", type: "Identifier" }] },
        { code: "var a; var a;", parserOptions: { ecmaVersion: 6, sourceType: "module" }, errors: [{ message: "'a' is already defined.", type: "Identifier" }] },
        { code: "export var a; var a;", parserOptions: { ecmaVersion: 6, sourceType: "module" }, errors: [{ message: "'a' is already defined.", type: "Identifier" }] },

        // `var` redeclaration in class static blocks. Redeclaration of functions is not allowed in class static blocks.
        {
            code: "class C { static { var a; var a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ message: "'a' is already defined.", type: "Identifier" }]
        },
        {
            code: "class C { static { var a; { var a; } } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ message: "'a' is already defined.", type: "Identifier" }]
        },
        {
            code: "class C { static { { var a; } var a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ message: "'a' is already defined.", type: "Identifier" }]
        },
        {
            code: "class C { static { { var a; } { var a; } } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ message: "'a' is already defined.", type: "Identifier" }]
        },

        {
            code: "var Object = 0;",
            options: [{ builtinGlobals: true }],
            errors: [{ message: "'Object' is already defined as a built-in global variable.", type: "Identifier" }]
        },
        {
            code: "var top = 0;",
            options: [{ builtinGlobals: true }],
            env: { browser: true },
            errors: [{ message: "'top' is already defined as a built-in global variable.", type: "Identifier" }]
        },
        {
            code: "var a; var {a = 0, b: Object = 0} = {};",
            options: [{ builtinGlobals: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" },
                { message: "'Object' is already defined as a built-in global variable.", type: "Identifier" }
            ]
        },
        {
            code: "var a; var {a = 0, b: Object = 0} = {};",
            options: [{ builtinGlobals: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "var a; var {a = 0, b: Object = 0} = {};",
            options: [{ builtinGlobals: true }],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { globalReturn: true } },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "var a; var {a = 0, b: Object = 0} = {};",
            options: [{ builtinGlobals: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "var globalThis = 0;",
            options: [{ builtinGlobals: true }],
            env: { es2020: true },
            errors: [{ message: "'globalThis' is already defined as a built-in global variable.", type: "Identifier" }]
        },
        {
            code: "var a; var {a = 0, b: globalThis = 0} = {};",
            options: [{ builtinGlobals: true }],
            parserOptions: { ecmaVersion: 6 },
            env: { es2020: true },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" },
                { message: "'globalThis' is already defined as a built-in global variable.", type: "Identifier" }
            ]
        },
        {
            code: "/*global b:false*/ var b = 1;",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'b' is already defined by a variable declaration.",
                type: "Block",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "/*global b:true*/ var b = 1;",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'b' is already defined by a variable declaration.",
                type: "Block",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "function f() { var a; var a; }",
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "function f(a) { var a; }",
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "function f() { var a; if (test) { var a; } }",
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "for (var a, a;;);",
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },

        {
            code: "var Object = 0;",
            errors: [
                { message: "'Object' is already defined as a built-in global variable.", type: "Identifier" }
            ]
        },
        {
            code: "var top = 0;",
            env: { browser: true },
            errors: [
                { message: "'top' is already defined as a built-in global variable.", type: "Identifier" }
            ]
        },

        // Comments and built-ins.
        {
            code: "/*globals Array */",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 11,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "/*globals parseInt */",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'parseInt' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 11,
                endLine: 1,
                endColumn: 19
            }]
        },
        {
            code: "/*globals foo, Array */",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 21
            }]
        },
        {
            code: "/* globals foo, Array, baz */",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 22
            }]
        },
        {
            code: "/*global foo, Array, baz*/",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 20
            }]
        },
        {
            code: "/*global array, Array*/",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 22
            }]
        },
        {
            code: "/*globals a,Array*/",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 18
            }]
        },
        {
            code: "/*globals a:readonly, Array:writable */",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 23,
                endLine: 1,
                endColumn: 28
            }]
        },
        {
            code: "\n/*globals Array */",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 2,
                column: 11,
                endLine: 2,
                endColumn: 16
            }]
        },
        {
            code: "/*globals\nArray */",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 6
            }]
        },
        {
            code: "\n/*globals\n\nArray*/",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 4,
                column: 1,
                endLine: 4,
                endColumn: 6
            }]
        },
        {
            code: "/*globals foo,\n    Array */",
            options: [{ builtinGlobals: true }],
            errors: [{
                message: "'Array' is already defined as a built-in global variable.",
                type: "Block",
                line: 2,
                column: 5,
                endLine: 2,
                endColumn: 10
            }]
        },
        {
            code: "/*globals a */",
            options: [{ builtinGlobals: true }],
            globals: { a: "readonly" },
            errors: [{
                message: "'a' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 11,
                endLine: 1,
                endColumn: 12
            }]
        },
        {
            code: "/*globals a */",
            options: [{ builtinGlobals: true }],
            globals: { a: "writable" },
            errors: [{
                message: "'a' is already defined as a built-in global variable.",
                type: "Block",
                line: 1,
                column: 11,
                endLine: 1,
                endColumn: 12
            }]
        },
        {
            code: "/*globals a */ /*globals a */",
            errors: [{
                message: "'a' is already defined.",
                type: "Block",
                line: 1,
                column: 26,
                endLine: 1,
                endColumn: 27
            }]
        },
        {
            code: "/*globals a */ /*globals a */ var a = 0",
            options: [{ builtinGlobals: true }],
            globals: { a: "writable" },
            errors: [
                {
                    message: "'a' is already defined as a built-in global variable.",
                    type: "Block",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    message: "'a' is already defined as a built-in global variable.",
                    type: "Block",
                    line: 1,
                    column: 26,
                    endLine: 1,
                    endColumn: 27
                },
                {
                    message: "'a' is already defined as a built-in global variable.",
                    type: "Identifier",
                    line: 1,
                    column: 35,
                    endLine: 1,
                    endColumn: 36
                }
            ]
        }
    ]
});
