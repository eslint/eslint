/**
 * @fileoverview Tests for undefined rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/no-undef-init", {
    valid: [
        "var a;"
    ],
    invalid: [
        { code: "var a = undefined;", errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator"}] }
    ]
});
