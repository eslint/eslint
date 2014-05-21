/**
 * @fileoverview Tests for no-cond-assign rule.
 * @author Stephen Murray <spmurrayzzz>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-cond-assign", {
    valid: [
        "var x = 0; if (x == 0) { var b = 1; }",
        "var x = 5; while (x < 5) { x = x + 1; }",
        "var x = 0; if (x == 0) { var b = 1; }",
        "if ((someNode = someNode.parentNode) !== null) { }",
        "if ((a = b));",
        "for (;;) {}"
    ],
    invalid: [
        { code: "var x; if (x = 0) { var b = 1; }", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "IfStatement"}] },
        { code: "var x; while (x = 0) { var b = 1; }", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "WhileStatement"}] },
        { code: "var x = 0, y; do { y = x; } while (x = x + 1);", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "DoWhileStatement"}] },
        { code: "var x; for(; x+=1 ;){};", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "ForStatement"}] },
        { code: "var x; if ((x) = (0));", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "IfStatement"}] }
    ]
});
