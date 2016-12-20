/**
 * @fileoverview Tests for no-new-require rule.
 * @author Wil Moore III
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-require"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new-require", rule, {
    valid: [
        "var appHeader = require('app-header')",
        "var AppHeader = new (require('app-header'))",
        "var AppHeader = new (require('headers').appHeader)"
    ],
    invalid: [
        { code: "var appHeader = new require('app-header')", errors: [{ message: "Unexpected use of new with require.", type: "NewExpression" }] },
        { code: "var appHeader = new require('headers').appHeader", errors: [{ message: "Unexpected use of new with require.", type: "NewExpression" }] }
    ]
});
