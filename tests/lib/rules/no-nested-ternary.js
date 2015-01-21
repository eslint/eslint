/**
 * @fileoverview Tests for the no-nested-ternary rule
 * @author Ian Christian Myers
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
eslintTester.addRuleTest("lib/rules/no-nested-ternary", {
    valid: [
        "foo ? doBar() : doBaz();",
        "var foo = bar === baz ? qux : quxx;"
    ],
    invalid: [
        { code: "foo ? bar : baz === qux ? quxx : foobar;", errors: [{ message: "Do not nest ternary expressions", type: "ConditionalExpression"}] },
        { code: "foo ? baz === qux ? quxx : foobar : bar;", errors: [{ message: "Do not nest ternary expressions", type: "ConditionalExpression"}] }
    ]
});
