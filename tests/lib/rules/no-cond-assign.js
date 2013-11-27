/**
 * @fileoverview Tests for no-cond-assign rule.
 * @author Stephen Murray <spmurrayzzz>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-cond-assign", {
    valid: [
        "var x = 0; if (x == 0) { var b = 1; }",
        "var x = 5; while (x < 5) { x = x + 1; }",
        "var x = 0; if (x == 0) { var b = 1; }",
        "if ((someNode = someNode.parentNode) !== null) { }"
    ],
    invalid: [
        { code: "var x; if (x = 0) { var b = 1; }", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "IfStatement"}] },
        { code: "var x; while (x = 0) { var b = 1; }", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "WhileStatement"}] },
        { code: "var x = 0, y; do { y = x; } while (x = x + 1);", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "DoWhileStatement"}] },
        { code: "var x; for(; x+=1 ;){};", errors: [{ message: "Expected a conditional expression and instead saw an assignment.", type: "ForStatement"}] }
    ]
});
