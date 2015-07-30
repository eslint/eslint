/**
 * @fileoverview Tests for no-lonely-if rule.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-lonely-if"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-lonely-if", rule, {

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
