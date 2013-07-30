/**
 * @fileoverview Tests for eqeqeq rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require("../../eslint-test");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "eqeqeq";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolations({
        "a == b": {
            message: "Unexpected use of ==, use === instead.",
            nodeType: "BinaryExpression"
        },

        "a != b": {
            message: "Unexpected use of !=, use !== instead.",
            nodeType: "BinaryExpression"
        }
    })
    .addNonViolations([
        "a === b",
        "a !== b",
    ])
    .export(module);
