/**
 * @fileoverview Tests for no-bitwise rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require("../../eslint-test");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-bitwise";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolations({
        "a ^ b": {
            message: "Unexpected use of ^ found.",
            nodeType: "BinaryExpression"
        },
        "a | b": {
            message: "Unexpected use of | found.",
            nodeType: "BinaryExpression"
        },
        "a & b": {
            message: "Unexpected use of & found.",
            nodeType: "BinaryExpression"
        }
    })
    .addNonViolations([
        "a + b",
    ])
    .export(module);
