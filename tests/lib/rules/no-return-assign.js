/**
 * @fileoverview Tests for no-return-assign.
 * @author Ilya Volodin
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
eslintTester.addRuleTest("lib/rules/no-return-assign", {
    valid: [
        "function x() { var result = a * b; return result; };"
    ],
    invalid: [
        { code: "function x() { return result = a * b; };", errors: [{ message: "Return statement should not contain assignment.", type: "ReturnStatement"}] }
    ]
});
