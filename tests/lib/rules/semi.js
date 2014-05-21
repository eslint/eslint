/**
 * @fileoverview Tests for semi rule.
 * @author Nicholas C. Zakas
 */

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
        { code: "var x = 5", args: [1, "never"] },
        { code: "var x =5, y", args: [1, "never"] },
        { code: "foo()", args: [1, "never"] },
        { code: "debugger", args: [1, "never"] },
        { code: "for (var a in b){}", args: [1, "never"] },
        { code: "for (var i;;){}", args: [1, "never"] },
        { code: "x = foo()", args: [1, "never"] },
        { code: "if (true) {}\n;[global, extended].forEach(function(){})", args: [1, "never"] },
        { code: "(function bar() {})\n;(function foo(){})", args: [1, "never"] },
        { code: ";/foo/.test('bar')", args: [1, "never"] },
        { code: ";+5", args: [1, "never"] },
        { code: ";-foo()", args: [1, "never"] }
    ],
    invalid: [
        { code: "function foo() { return [] }", errors: [{ message: "Missing semicolon.", type: "ReturnStatement"}] },
        { code: "while(true) { break }", errors: [{ message: "Missing semicolon.", type: "BreakStatement"}] },
        { code: "while(true) { continue }", errors: [{ message: "Missing semicolon.", type: "ContinueStatement"}] },
        { code: "let x = 5", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
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

        { code: "function foo() { return []; }", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "ReturnStatement"}] },
        { code: "while(true) { break; }", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "BreakStatement"}] },
        { code: "while(true) { continue; }", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "ContinueStatement"}] },
        { code: "let x = 5;", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5;", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5, y;", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "debugger;", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "DebuggerStatement"}] },
        { code: "foo();", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "ExpressionStatement"}] },
        { code: "var x = 5, y;", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var a in b) var i; ", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;){var i;}", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;) var i; ", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var j;;) {var i;}", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var foo = {\n bar: baz\n};", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration", line: 3}] },
        { code: ";", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "EmptyStatement"}] },
        { code: ";;", args: [1, "never"], errors: [{ message: "Extra semicolon.", type: "EmptyStatement"}, { message: "Extra semicolon.", type: "EmptyStatement"}] }

    ]
});
