/**
 * @fileoverview Tests for no-redeclare rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path");
const rule = require("../../../lib/rules/no-redeclare");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const looseParserPath = path.resolve(__dirname, "../../tools/loose-parser.js");
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
            code: "/*global b:false*/ var b = 1;",
            options: [{ builtinGlobals: true }],
            errors: [
                { message: "'b' is already defined by a variable declaration.", type: "Block" }
            ]
        },
        {
            code: "/*global b:true*/ var b = 1;",
            options: [{ builtinGlobals: true }],
            errors: [
                { message: "'b' is already defined by a variable declaration.", type: "Block" }
            ]
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

        // let/const
        {
            code: "let a; let a;",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "let a; let a;",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "let a; let a;",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015, ecmaFeatures: { globalReturn: true } },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "let a; const a = 0;",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "const a = 0; const a = 0;",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "if (test) { let a; let a; }",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "switch (test) { case 0: let a; let a; }",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "for (let a, a;;);",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "for (let [a, a] in xs);",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "for (let [a, a] of xs);",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "function f() { let a; let a; }",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "function f(a) { let a; }",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },
        {
            code: "function f() { if (test) { let a; let a; } }",
            parser: looseParserPath,
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                { message: "'a' is already defined.", type: "Identifier" }
            ]
        },

        // Comments and built-ins.
        {
            code: "/*globals Array */",
            options: [{ builtinGlobals: true }],
            errors: [
                { message: "'Array' is already defined as a built-in global variable.", type: "Block" }
            ]
        },
        {
            code: "/*globals a */",
            options: [{ builtinGlobals: true }],
            globals: { a: "readonly" },
            errors: [
                { message: "'a' is already defined as a built-in global variable.", type: "Block" }
            ]
        },
        {
            code: "/*globals a */",
            options: [{ builtinGlobals: true }],
            globals: { a: "writable" },
            errors: [
                { message: "'a' is already defined as a built-in global variable.", type: "Block" }
            ]
        },
        {
            code: "/*globals a */ /*globals a */",
            errors: [
                { message: "'a' is already defined.", type: "Block", column: 26 }
            ]
        },
        {
            code: "/*globals a */ /*globals a */ var a = 0",
            options: [{ builtinGlobals: true }],
            globals: { a: "writable" },
            errors: [
                { message: "'a' is already defined as a built-in global variable.", type: "Block", column: 11 },
                { message: "'a' is already defined as a built-in global variable.", type: "Block", column: 26 },
                { message: "'a' is already defined as a built-in global variable.", type: "Identifier", column: 35 }
            ]
        }
    ]
});
