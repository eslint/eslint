/**
 * @fileoverview Tests for no-unreachable rule.
 * @author Joel Feenstra
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-unreachable", {
    valid: [
        "function foo() { function bar() { return 1; } return bar(); }",
        "function foo() { var x = 1; var y = 2; }",
        "function foo() { var x = 1; var y = 2; return; }",
        "while (true) { switch (foo) { case 1: x = 1; x = 2;} }"
    ],
    invalid: [
        { code: "function foo() { return; x = 1; }", errors: [{ message: "Found unexpected statement after a return.", type: "ExpressionStatement"}] },
        { code: "function foo() { throw error; x = 1; }", errors: [{ message: "Found unexpected statement after a throw.", type: "ExpressionStatement"}] },
        { code: "while (true) { break; x = 1; }", errors: [{ message: "Found unexpected statement after a break.", type: "ExpressionStatement"}] },
        { code: "while (true) { continue; x = 1; }", errors: [{ message: "Found unexpected statement after a continue.", type: "ExpressionStatement"}] },
        { code: "function foo() { switch (foo) { case 1: return; x = 1; } }", errors: [{ message: "Found unexpected statement after a return.", type: "ExpressionStatement"}] },
        { code: "function foo() { switch (foo) { case 1: throw e; x = 1; } }", errors: [{ message: "Found unexpected statement after a throw.", type: "ExpressionStatement"}] },
        { code: "while (true) { switch (foo) { case 1: break; x = 1; } }", errors: [{ message: "Found unexpected statement after a break.", type: "ExpressionStatement"}] },
        { code: "while (true) { switch (foo) { case 1: continue; x = 1; } }", errors: [{ message: "Found unexpected statement after a continue.", type: "ExpressionStatement"}] }
    ]
});
