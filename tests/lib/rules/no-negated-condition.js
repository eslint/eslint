/**
 * @fileoverview Tests for no-negated-condition rule.
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-negated-condition"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-negated-condition", rule, {

    // Examples of code that should not trigger the rule
    valid: [
        "if (a) {}",
        "if (a) {} else {}",
        "if (!a) {}",
        "if (!a) {} else if (b) {}",
        "if (!a) {} else if (b) {} else {}",
        "if (a == b) {}",
        "if (a == b) {} else {}",
        "if (a != b) {}",
        "if (a != b) {} else if (b) {}",
        "if (a != b) {} else if (b) {} else {}",
        "if (a !== b) {}",
        "if (a === b) {} else {}",
        "a ? b : c"
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "if (!a) {;} else {;}",
            errors: [{
                message: "Unexpected negated condition.",
                type: "IfStatement"
            }]
        },
        {
            code: "if (a != b) {;} else {;}",
            errors: [{
                message: "Unexpected negated condition.",
                type: "IfStatement"
            }]
        },
        {
            code: "if (a !== b) {;} else {;}",
            errors: [{
                message: "Unexpected negated condition.",
                type: "IfStatement"
            }]
        },
        {
            code: "!a ? b : c",
            errors: [{
                message: "Unexpected negated condition.",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "a != b ? c : d",
            errors: [{
                message: "Unexpected negated condition.",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "a !== b ? c : d",
            errors: [{
                message: "Unexpected negated condition.",
                type: "ConditionalExpression"
            }]
        }
    ]
});
