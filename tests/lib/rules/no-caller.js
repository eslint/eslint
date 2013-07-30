/**
 * @fileoverview Tests for no-caller rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require("../../eslint-test");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-caller";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolations({
        "var x = arguments.callee": {
            message: "Avoid arguments.callee.",
            nodeType: "MemberExpression"
        },
        "var x = arguments.caller": {
            message: "Avoid arguments.caller.",
            nodeType: "MemberExpression"
        }
    })
    .addNonViolations([
        "var x = arguments.length",
        "var x = arguments"
    ])
    .export(module);
