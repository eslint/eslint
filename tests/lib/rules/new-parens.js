/**
 * @fileoverview Tests for new-parens rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require("../../eslint-test");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "new-parens";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolationsWithMessage("Missing '()' invoking a constructor", {
        "var a = new Date;": "NewExpression"
    })
    .addNonViolations([
        "var a = new Date();",
        "var a = new Date(function() {});"
    ])
    .export(module);
