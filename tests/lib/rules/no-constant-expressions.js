/**
 * @fileoverview Tests for the no-mixed-requires rule.
 * @author Raphael Pigulla
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

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-constant-expressions", {
    valid: [
        { code: "5", args: 1 },
        { code: "a", args: 1 },
        { code: "b && c", args: 1 },
        { code: "b & 7", args: 1 },
        { code: "b | c", args: 1 },
        { code: "b === 3 && c !== 4", args: 1 },
        { code: "a && b && c && d && e && f && g && h && i && j && k && l && m", args: 1 },
        { code: "a === foo(a)", args: 1 },
        { code: "(null)(5) + 9", args: 1},
        { code: "(null)(5) && a === 3", args: 1},
        { code: "(foo || bar)(5) + 9", args: 1},
        { code: "(foo || bar)(5) && a === 3", args: 1},
        { code: "foo() || bar()", args: 1 },
        { code: "(a = 5) === 5", args: 1 },
        { code: "3 === (a ? 2 : 3)", args: 1 },
        { code: "a - 9 > -25", args: 1 },
        { code: "2 < a && a < 2.1", args: 1 },
        { code: "a >= 0", args: 1 },
        { code: "200000 < a && a < 200000.0000001", args: 1 },
        { code: "a > 19 || a + 1 > 0", args: 1 },
        { code: "5 === (a || true)", args: 1 },
        { code: "a === 'true'", args: 1 },
        { code: "'long string' + 'another string'", args: 1 },
        { code: "\"long string\" + \"another string\" + \"another string\"", args: 1 },
        { code: "3 + (-a)", args: 1 }
    ],
    invalid: [
        { code: "5 + 3", args: 1, errors: [{ message: "Expression always 8", type: "BinaryExpression" }] },
        { code: "true && false", args: 1, errors: [{ message: "Expression always false", type: "LogicalExpression" }] },
        { code: "a * 0 + 5;", args: 1, errors: [{ message: "Expression always 5", type: "BinaryExpression"}] },
        { code: "a === a;", args: 1, errors: [{ message: "Expression always true", type: "BinaryExpression"}] },
        { code: "a !== a;", args: 1, errors: [{ message: "Expression always false", type: "BinaryExpression"}] },
        { code: "a / a;", args: 1, errors: [{ message: "Expression always 1", type: "BinaryExpression"}] },
        { code: "a == 1 && a == 2;", args: 1, errors: [{ message: "Expression always false", type: "LogicalExpression"}] },
        { code: "a > 1 || a <= 1;", args: 1, errors: [{ message: "Expression always true", type: "LogicalExpression"}] },
        { code: "a > 1 && a < 1;", args: 1, errors: [{ message: "Expression always false", type: "LogicalExpression"}] },
        { code: "a != 1 || a != 2;", args: 1, errors: [{ message: "Expression always true", type: "LogicalExpression"}] },
        { code: "a > 1 && a === b && b < 1", args: 1, errors: [{ message: "Expression always false", type: "LogicalExpression"}] },
        { code: "(a / a - 1) + 13", args: 1, errors: [{ message: "Expression always 13", type: "BinaryExpression"}] },
        { code: "(a === 3 || b === 4 || c !== c) && (a !== 3 && b !== 4 && d === d)", args: 1, errors: [{ message: "Expression always false", type: "LogicalExpression"}] },
        { code: "a === 0 && (a ? 4 : false)", args: 1, errors: [{ message: "Expression always false", type: "LogicalExpression"}] }
    ]
});
