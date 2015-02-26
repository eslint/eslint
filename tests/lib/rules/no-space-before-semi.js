/**
 * @fileoverview Tests for no-space-before-semi rule.
 * @author Jonathan Kingston
 * @copyright 2015 Mathias Schreck
 * @copyright 2014 Jonathan Kingston
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

var eslintTester = new ESLintTester(eslint),
    expectedErrorMessage = "Unexpected whitespace before semicolon.";

eslintTester.addRuleTest("lib/rules/no-space-before-semi", {
    valid: [
        "var thing = 'test';",
        "var thing = 'test ; thing';",
        "var thing = \"test ; thing\";",
        "var thing = function () {};",
        "var thing = function () {\n var thing = 'test ; '; };",
        ";(function(){}());",
        "while (true) { break; }",
        "while (true) { continue; }",
        "debugger;",
        "function foo() { return; }",
        "throw new Error('foo');",
        "for (var i = 0; i < 10; i++) {}",
        "for (;;) {}"
    ],
    invalid: [
        {
            code: "var foo = \"bar\" ;",
            errors: [ { message: expectedErrorMessage, type: "VariableDeclaration", line: 1, column: 16 } ]
        },
        {
            code: "var foo = function() {} ;",
            errors: [ { message: expectedErrorMessage, type: "VariableDeclaration", line: 1, column: 24 } ]
        },
        {
            code: "var foo = function() {\n} ;",
            errors: [ { message: expectedErrorMessage, type: "VariableDeclaration", line: 2, column: 2 } ]
        },
        {
            code: "var thing = 'test' ;",
            errors: [ { message: expectedErrorMessage, type: "VariableDeclaration", line: 1, column: 19 } ]
        },
        {
            code: "var foo = 1 + 2 ;",
            errors: [ { message: expectedErrorMessage, type: "VariableDeclaration", line: 1, column: 16 } ]
        },
        {
            code: "/^thing$/.test('thing') ;",
            errors: [{ message: expectedErrorMessage, type: "ExpressionStatement", line: 1, column: 24 } ]
        },
        {
            code: ";(function(){}()) ;",
            errors: [ { message: expectedErrorMessage, type: "ExpressionStatement", line: 1, column: 18 } ]
        },
        {
            code: "while (true) { break ; }",
            errors: [ { message: expectedErrorMessage, type: "BreakStatement", line: 1, column: 21 } ]
        },
        {
            code: "while (true) { continue ; }",
            errors: [ { message: expectedErrorMessage, type: "ContinueStatement", line: 1, column: 24 } ]
        },
        {
            code: "debugger ;",
            errors: [ { message: expectedErrorMessage, type: "DebuggerStatement", line: 1, column: 9 } ]
        },
        {
            code: "function foo() { return ; }",
            errors: [ { message: expectedErrorMessage, type: "ReturnStatement", line: 1, column: 24 } ]
        },
        {
            code: "throw new Error('foo') ;",
            errors: [ { message: expectedErrorMessage, type: "ThrowStatement", line: 1, column: 23 } ]
        },
        {
            code: "for (var i = 0 ; i < 10 ; i++) {}",
            errors: [
                { message: expectedErrorMessage, type: "ForStatement", line: 1, column: 15 },
                { message: expectedErrorMessage, type: "ForStatement", line: 1, column: 24 }
            ]
        }
    ]
});
