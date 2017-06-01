/**
 * @fileoverview Tests for no-greater-than rule.
 * @author Christophe Maillard
 */
"use strict";

const rule = require("../../../lib/rules/no-greater-than");
const RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("no-greater-than", rule, {

    valid: [
        "if (1 < 2) {}",
        "if (1 <= 2) {}"
    ],

    invalid: [{
        code: "if (2 > 1) {}",
        output: "if (1 < 2) {}",
        errors: [{
            message: "Expected < instead of >.",
            type: "BinaryExpression"
        }]
    }, {
        code: "if (2 >= 1) {}",
        output: "if (1 <= 2) {}",
        errors: [{
            message: "Expected <= instead of >=.",
            type: "BinaryExpression"
        }]
    }]

});
