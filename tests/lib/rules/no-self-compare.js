/**
 * @fileoverview Tests for no-self-compare rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-self-compare"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-self-compare", rule, {
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
