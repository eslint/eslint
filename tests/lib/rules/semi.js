/**
 * @fileoverview Tests for semi rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/semi", {
    valid: [
        "var x = 5;",
        "var x =5, y;",
        "foo();",
        "x = foo();",
        "setTimeout(function() {foo = \"bar\"; });",
        "setTimeout(function() {foo = \"bar\";});",
        "for (var a in b){}",
        "for (var i;;){}",
        "if (true) {}\n;[global, extended].forEach(function(){});",
        "throw new Error('foo');",
        { code: "throw new Error('foo')", options: ["never"] },
        { code: "var x = 5", options: ["never"] },
        { code: "var x =5, y", options: ["never"] },
        { code: "foo()", options: ["never"] },
        { code: "debugger", options: ["never"] },
        { code: "for (var a in b){}", options: ["never"] },
        { code: "for (var i;;){}", options: ["never"] },
        { code: "x = foo()", options: ["never"] },
        { code: "if (true) {}\n;[global, extended].forEach(function(){})", options: ["never"] },
        { code: "(function bar() {})\n;(function foo(){})", options: ["never"] },
        { code: ";/foo/.test('bar')", options: ["never"] },
        { code: ";+5", options: ["never"] },
        { code: ";-foo()", options: ["never"] },
        { code: "a++\nb++", options: ["never"] },
        { code: "a++; b++", options: ["never"] },
        { code: "for (let thing of {}) {\n  console.log(thing);\n}", ecmaFeatures: { forOf: true, blockBindings: true }}
    ],
    invalid: [
        { code: "function foo() { return [] }", errors: [{ message: "Missing semicolon.", type: "ReturnStatement"}] },
        { code: "while(true) { break }", errors: [{ message: "Missing semicolon.", type: "BreakStatement"}] },
        { code: "while(true) { continue }", errors: [{ message: "Missing semicolon.", type: "ContinueStatement"}] },
        { code: "let x = 5", ecmaFeatures: { blockBindings: true }, errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5, y", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "debugger", errors: [{ message: "Missing semicolon.", type: "DebuggerStatement"}] },
        { code: "foo()", errors: [{ message: "Missing semicolon.", type: "ExpressionStatement"}] },
        { code: "var x = 5, y", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var a in b) var i ", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;){var i}", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;) var i ", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var j;;) {var i}", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "var foo = {\n bar: baz\n}", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration", line: 3}] },
        { code: "var foo\nvar bar;", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration", line: 1}] },
        { code: "throw new Error('foo')", errors: [{ message: "Missing semicolon.", type: "ThrowStatement", line: 1}] },

        { code: "throw new Error('foo');", options: ["never"], errors: [{ message: "Extra semicolon.", type: "ThrowStatement"}] },
        { code: "function foo() { return []; }", options: ["never"], errors: [{ message: "Extra semicolon.", type: "ReturnStatement"}] },
        { code: "while(true) { break; }", options: ["never"], errors: [{ message: "Extra semicolon.", type: "BreakStatement"}] },
        { code: "while(true) { continue; }", options: ["never"], errors: [{ message: "Extra semicolon.", type: "ContinueStatement"}] },
        { code: "let x = 5;", ecmaFeatures: { blockBindings: true }, options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5;", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5, y;", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "debugger;", options: ["never"], errors: [{ message: "Extra semicolon.", type: "DebuggerStatement"}] },
        { code: "foo();", options: ["never"], errors: [{ message: "Extra semicolon.", type: "ExpressionStatement"}] },
        { code: "var x = 5, y;", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var a in b) var i; ", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;){var i;}", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;) var i; ", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var j;;) {var i;}", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var foo = {\n bar: baz\n};", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration", line: 3}] },
        { code: ";", options: ["never"], errors: [{ message: "Extra semicolon.", type: "EmptyStatement"}] },
        { code: ";;", options: ["never"], errors: [{ message: "Extra semicolon.", type: "EmptyStatement"}, { message: "Extra semicolon.", type: "EmptyStatement"}] }

    ]
});
