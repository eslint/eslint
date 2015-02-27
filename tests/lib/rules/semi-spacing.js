/**
 * @fileoverview Tests for semi-spacing.
 * @author Mathias Schreck
 * @copyright 2015 Mathias Schreck
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

eslintTester.addRuleTest("lib/rules/semi-spacing", {
    valid: [
        "var a = 'b';",
        "var a = 'b ; c';",
        "var a = 'b',\nc = 'd';",
        "var a = function () {};",
        ";(function(){}());",
        "while (true) { break; }",
        "while (true) { continue; }",
        "debugger;",
        "function foo() { return; }",
        "throw new Error('foo');",
        "for (var i = 0; i < 10; i++) {}",
        "for (;;) {}",
        {
            code: "var a = 'b' ;",
            options: [ { before: true, after: true } ]
        },
        {
            code: "var a = 'b';c = 'd';",
            options: [ { before: false, after: false } ]
        },
        {
            code: "for (var i = 0 ;i < 10 ;i++) {}",
            options: [ { before: true, after: false } ]
        },
        {
            code: "for (var i = 0 ; i < 10 ; i++) {}",
            options: [ { before: true, after: true } ]
        }
    ],
    invalid: [
        {
            code: "var a = 'b' ;",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "VariableDeclaration", line: 1, column: 12 } ]
        },
        {
            code: "var a = 'b',\nc = 'd' ;",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "VariableDeclaration", line: 2, column: 8 } ]
        },
        {
            code: "var a = function() {} ;",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "VariableDeclaration", line: 1, column: 22 } ]
        },
        {
            code: "var a = function() {\n} ;",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "VariableDeclaration", line: 2, column: 2 } ]
        },
        {
            code: "/^a$/.test('b') ;",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "ExpressionStatement", line: 1, column: 16 } ]
        },
        {
            code: ";(function(){}()) ;",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "ExpressionStatement", line: 1, column: 18 } ]
        },
        {
            code: "while (true) { break ; }",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "BreakStatement", line: 1, column: 21 } ]
        },
        {
            code: "while (true) { continue ; }",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "ContinueStatement", line: 1, column: 24 } ]
        },
        {
            code: "debugger ;",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "DebuggerStatement", line: 1, column: 9 } ]
        },
        {
            code: "function foo() { return ; }",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "ReturnStatement", line: 1, column: 24 } ]
        },
        {
            code: "throw new Error('foo') ;",
            errors: [ { message: "Unexpected whitespace before semicolon.", type: "ThrowStatement", line: 1, column: 23 } ]
        },
        {
            code: "for (var i = 0 ; i < 10 ; i++) {}",
            errors: [
                { message: "Unexpected whitespace before semicolon.", type: "ForStatement", line: 1, column: 15 },
                { message: "Unexpected whitespace before semicolon.", type: "ForStatement", line: 1, column: 24 }
            ]
        },
        {
            code: "var a = 'b';c = 'd';",
            errors: [ { message: "Missing whitespace after semicolon.", type: "VariableDeclaration", line: 1, column: 11 } ]
        },
        {
            code: "var a = 'b';",
            options: [ { before: true, after: true } ],
            errors: [ { message: "Missing whitespace before semicolon.", type: "VariableDeclaration", line: 1, column: 11 } ]
        },
        {
            code: "var a = 'b'; c = 'd';",
            options: [ { before: false, after: false } ],
            errors: [ { message: "Unexpected whitespace after semicolon.", type: "VariableDeclaration", line: 1, column: 11 } ]
        },
        {
            code: "for (var i = 0;i < 10;i++) {}",
            errors: [
                { message: "Missing whitespace after semicolon.", type: "ForStatement", line: 1, column: 14 },
                { message: "Missing whitespace after semicolon.", type: "ForStatement", line: 1, column: 21 }
            ]
        },
        {
            code: "for (var i = 0; i < 10; i++) {}",
            options: [ { before: true, after: true } ],
            errors: [
                { message: "Missing whitespace before semicolon.", type: "ForStatement", line: 1, column: 14 },
                { message: "Missing whitespace before semicolon.", type: "ForStatement", line: 1, column: 22 }
            ]
        },
        {
            code: "for (var i = 0; i < 10; i++) {}",
            options: [ { before: false, after: false } ],
            errors: [
                { message: "Unexpected whitespace after semicolon.", type: "ForStatement", line: 1, column: 14 },
                { message: "Unexpected whitespace after semicolon.", type: "ForStatement", line: 1, column: 22 }
            ]
        }

    ]
});
