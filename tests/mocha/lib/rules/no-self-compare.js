/**
 * @fileoverview Tests for no-self-compare rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-self-compare", {
    valid: [
        "if (x === y) { }",
        "if (f() === f()) { }",
        "if (a[1] === a[1]) { }",
        "if (1 === 2) { }",
        "y=x*x"
    ],
    invalid: [
        { code: "if (x === x) { }", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "if (x !== x) { }", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "if (x > x) { }", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "if ('x' > 'x') { }", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "do {} while (x === x)", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "x === x", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "x !== x", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "x == x", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "x != x", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "x > x", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "x < x", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "x >= x", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] },
        { code: "x <= x", errors: [{ message: "Comparing to itself is potentially pointless.", type: "BinaryExpression"}] }
    ]
});
