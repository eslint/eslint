/**
 * @fileoverview Tests for semi-spacing.
 * @author Mathias Schreck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/semi-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("semi-spacing", rule, {
    valid: [
        "var a = 'b';",
        "var a = 'b ; c';",
        "var a = 'b',\nc = 'd';",
        "var a = function() {};",
        ";(function(){}());",
        "var a = 'b'\n;(function(){}())",
        "debugger\n;(function(){}())",
        "while (true) { break; }",
        "while (true) { continue; }",
        "debugger;",
        "function foo() { return; }",
        "throw new Error('foo');",
        "for (var i = 0; i < 10; i++) {}",
        "for (;;) {}",
        {
            code: "var a = 'b' ;",
            options: [{ before: true, after: true }]
        },
        {
            code: "var a = 'b';c = 'd';",
            options: [{ before: false, after: false }]
        },
        {
            code: "for (var i = 0 ;i < 10 ;i++) {}",
            options: [{ before: true, after: false }]
        },
        {
            code: "for (var i = 0 ; i < 10 ; i++) {}",
            options: [{ before: true, after: true }]
        },

        // https://github.com/eslint/eslint/issues/3721
        "function foo(){return 2;}",
        "for(var i = 0; i < results.length;) {}",
        { code: "function foo() { return 2; }", options: [{ after: false }] },
        { code: "for ( var i = 0;i < results.length; ) {}", options: [{ after: false }] }
    ],
    invalid: [
        {
            code: "var a = 'b' ;",
            output: "var a = 'b';",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "VariableDeclaration", line: 1, column: 13 }]
        },
        {
            code: "var a = 'b',\nc = 'd' ;",
            output: "var a = 'b',\nc = 'd';",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "VariableDeclaration", line: 2, column: 9 }]
        },
        {
            code: "var a = function() {} ;",
            output: "var a = function() {};",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "VariableDeclaration", line: 1, column: 23 }]
        },
        {
            code: "var a = function() {\n} ;",
            output: "var a = function() {\n};",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "VariableDeclaration", line: 2, column: 3 }]
        },
        {
            code: "/^a$/.test('b') ;",
            output: "/^a$/.test('b');",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "ExpressionStatement", line: 1, column: 17 }]
        },
        {
            code: ";(function(){}()) ;",
            output: ";(function(){}());",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "ExpressionStatement", line: 1, column: 19 }]
        },
        {
            code: "while (true) { break ; }",
            output: "while (true) { break; }",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "BreakStatement", line: 1, column: 22 }]
        },
        {
            code: "while (true) { continue ; }",
            output: "while (true) { continue; }",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "ContinueStatement", line: 1, column: 25 }]
        },
        {
            code: "debugger ;",
            output: "debugger;",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "DebuggerStatement", line: 1, column: 10 }]
        },
        {
            code: "function foo() { return ; }",
            output: "function foo() { return; }",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "ReturnStatement", line: 1, column: 25 }]
        },
        {
            code: "throw new Error('foo') ;",
            output: "throw new Error('foo');",
            errors: [{ message: "Unexpected whitespace before semicolon.", type: "ThrowStatement", line: 1, column: 24 }]
        },
        {
            code: "for (var i = 0 ; i < 10 ; i++) {}",
            output: "for (var i = 0; i < 10; i++) {}",
            errors: [
                { message: "Unexpected whitespace before semicolon.", type: "ForStatement", line: 1, column: 16 },
                { message: "Unexpected whitespace before semicolon.", type: "ForStatement", line: 1, column: 25 }
            ]
        },
        {
            code: "var a = 'b';c = 'd';",
            output: "var a = 'b'; c = 'd';",
            errors: [{ message: "Missing whitespace after semicolon.", type: "VariableDeclaration", line: 1, column: 12 }]
        },
        {
            code: "var a = 'b';",
            output: "var a = 'b' ;",
            options: [{ before: true, after: true }],
            errors: [{ message: "Missing whitespace before semicolon.", type: "VariableDeclaration", line: 1, column: 12 }]
        },
        {
            code: "var a = 'b'; c = 'd';",
            output: "var a = 'b';c = 'd';",
            options: [{ before: false, after: false }],
            errors: [{ message: "Unexpected whitespace after semicolon.", type: "VariableDeclaration", line: 1, column: 12 }]
        },
        {
            code: "for (var i = 0;i < 10;i++) {}",
            output: "for (var i = 0; i < 10; i++) {}",
            errors: [
                { message: "Missing whitespace after semicolon.", type: "ForStatement", line: 1, column: 15 },
                { message: "Missing whitespace after semicolon.", type: "ForStatement", line: 1, column: 22 }
            ]
        },
        {
            code: "for (var i = 0; i < 10; i++) {}",
            output: "for (var i = 0 ; i < 10 ; i++) {}",
            options: [{ before: true, after: true }],
            errors: [
                { message: "Missing whitespace before semicolon.", type: "ForStatement", line: 1, column: 15 },
                { message: "Missing whitespace before semicolon.", type: "ForStatement", line: 1, column: 23 }
            ]
        },
        {
            code: "for (var i = 0; i < 10; i++) {}",
            output: "for (var i = 0;i < 10;i++) {}",
            options: [{ before: false, after: false }],
            errors: [
                { message: "Unexpected whitespace after semicolon.", type: "ForStatement", line: 1, column: 15 },
                { message: "Unexpected whitespace after semicolon.", type: "ForStatement", line: 1, column: 23 }
            ]
        },
        {
            code: "import Foo from 'bar' ;",
            output: "import Foo from 'bar';",
            options: [{ before: false, after: true }],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "Unexpected whitespace before semicolon.", type: "ImportDeclaration", line: 1, column: 23 }
            ]
        },
        {
            code: "import * as foo from 'bar' ;",
            output: "import * as foo from 'bar';",
            options: [{ before: false, after: true }],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "Unexpected whitespace before semicolon.", type: "ImportDeclaration", line: 1, column: 28 }
            ]
        },
        {
            code: "var foo = 0; export {foo} ;",
            output: "var foo = 0; export {foo};",
            options: [{ before: false, after: true }],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "Unexpected whitespace before semicolon.", type: "ExportNamedDeclaration", line: 1, column: 27 }
            ]
        },
        {
            code: "export * from 'foo' ;",
            output: "export * from 'foo';",
            options: [{ before: false, after: true }],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "Unexpected whitespace before semicolon.", type: "ExportAllDeclaration", line: 1, column: 21 }
            ]
        },
        {
            code: "export default foo ;",
            output: "export default foo;",
            options: [{ before: false, after: true }],
            parserOptions: { sourceType: "module" },
            errors: [
                { message: "Unexpected whitespace before semicolon.", type: "ExportDefaultDeclaration", line: 1, column: 20 }
            ]
        }
    ]
});
