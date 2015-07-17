/**
 * @fileoverview Tests for no-for-in rule.
 * @author John Ford
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
eslintTester.addRuleTest("lib/rules/no-for-in", {
    valid: [
        "for (var i ; i++ ; i <= 10) {}",
        " /* for (var x in []) {} */"
    ],
    invalid: [
        { code: "for (var x in o) { foo() }", errors: [{ message: "The for-in statement should not be used", type: "ForInStatement"}] },
        { code: "for (var x in o) foo();", errors: [{ message: "The for-in statement should not be used", type: "ForInStatement"}] }
    ]
});
