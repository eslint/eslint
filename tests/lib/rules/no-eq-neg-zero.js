/**
 * @fileoverview The rule should warn against code that tries to use the === operator to compare against -0.
 * @author no-eq-neg-zero
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-eq-neg-zero");

const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-eq-neg-zero", rule, {

    valid: [
        { code: "if (x === 0) {}" },
        { code: "if (x === '0') {}" },
        { code: "if (x === -1) {}" },
        { code: "x < 0" },
        { code: "x > 0" }
    ],

    invalid: [
        {
            code: "if (x === -0) {}",
            errors: [{
                message: "disallow use the === operator to compare against -0.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "if (-0 === x) {}",
            errors: [{
                message: "disallow use the === operator to compare against -0.",
                type: "BinaryExpression"
            }]
        }
    ]
});
