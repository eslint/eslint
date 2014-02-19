/**
 * @fileoverview Tests for semi rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

eslintTester.addRuleTest("lib/rules/semi", {
    valid: [ "var x = 5;",
             "var x =5, y;",
             "foo();",
             "x = foo();",
             "setTimeout(function() {foo = \"bar\"; });",
             "setTimeout(function() {foo = \"bar\";});",
             "for (var a in b){}",
             "for (var i;;){}"
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
        { code: "var foo = {\n bar: baz\n}", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration", line: 3}] }
    ]
});
