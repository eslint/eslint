/**
 * @fileoverview Tests for no-cond-assign rule.
 * @author Stephen Murray <spmurrayzzz>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");
var ERROR_MESSAGE = "Expected a conditional expression and instead saw an assignment.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-cond-assign", {
    valid: [
        "var x = 0; if (x == 0) { var b = 1; }",
        { code: "var x = 0; if (x == 0) { var b = 1; }", args: ["2", "always"] },
        "var x = 5; while (x < 5) { x = x + 1; }",
        "var x = 0; if (x == 0) { var b = 1; }",
        "if ((someNode = someNode.parentNode) !== null) { }",
        { code: "if ((someNode = someNode.parentNode) !== null) { }", args: ["2", "except-parens"] },
        "if ((a = b));",
        "for (;;) {}",
        "if (someNode || (someNode = parentNode)) { }",
        "while (someNode || (someNode = parentNode)) { }",
        "do { } while (someNode || (someNode = parentNode));",
        "if ((function(node) { return (node = parentNode); })(someNode)) { }"
    ],
    invalid: [
        { code: "var x; if (x = 0) { var b = 1; }", errors: [{ message: ERROR_MESSAGE, type: "IfStatement"}] },
        { code: "var x; while (x = 0) { var b = 1; }", errors: [{ message: ERROR_MESSAGE, type: "WhileStatement"}] },
        { code: "var x = 0, y; do { y = x; } while (x = x + 1);", errors: [{ message: ERROR_MESSAGE, type: "DoWhileStatement"}] },
        { code: "var x; for(; x+=1 ;){};", errors: [{ message: ERROR_MESSAGE, type: "ForStatement"}] },
        { code: "var x; if ((x) = (0));", errors: [{ message: ERROR_MESSAGE, type: "IfStatement"}] },
        { code: "if (someNode || (someNode = parentNode)) { }", args: ["2", "always"], errors: [{ message: "Unexpected assignment within an 'if' statement.", type: "IfStatement"}] },
        { code: "while (someNode || (someNode = parentNode)) { }", args: ["2", "always"], errors: [{ message: "Unexpected assignment within a 'while' statement.", type: "WhileStatement"}] },
        { code: "do { } while (someNode || (someNode = parentNode));", args: ["2", "always"], errors: [{ message: "Unexpected assignment within a 'do...while' statement.", type: "DoWhileStatement"}] },
        { code: "for (; (typeof l === 'undefined' ? (l = 0) : l); i++) { }", args: ["2", "always"], errors: [{ message: "Unexpected assignment within a 'for' statement.", type: "ForStatement"}] },
        { code: "if ((function(node) { return (node = parentNode); })(someNode)) { }", args: ["2", "always"], errors: [{ message: "Unexpected assignment within an 'if' statement.", type: "IfStatement"}] }
    ]
});
