/**
 * @fileoverview Tests for no-lonely-if rule.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-lonely-if", {

    // Examples of code that should not trigger the rule
    valid: [
        "if (a) {;} else if (b) {;}",
        "if (a) {;} else { if (b) {;} ; }"
    ],

    // Examples of code that should trigger the rule
    invalid: [{
        code: "if (a) {;} else { if (b) {;} }",
        errors: [{
            message: "Unexpected if as the only statement in an else block.",
            type: "IfStatement"
        }]
    }]
});
