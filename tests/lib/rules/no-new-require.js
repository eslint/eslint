/**
 * @fileoverview Tests for no-new-require rule.
 * @author Wil Moore III
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-new-require", {
    valid: [
        "var appHeader = require('app-header')",
        "var AppHeader = new (require('app-header'))",
        "var AppHeader = new (require('headers').appHeader)"
    ],
    invalid: [
        { code: "var appHeader = new require('app-header')", errors: [{ message: "Unexpected use of new with require.", type: "NewExpression"}] },
        { code: "var appHeader = new require('headers').appHeader", errors: [{ message: "Unexpected use of new with require.", type: "NewExpression"}] }
    ]
});
