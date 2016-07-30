/**
 * @fileoverview Tests for new-parens rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/new-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("new-parens", rule, {
    valid: [
        "var a = new Date();",
        "var a = new Date(function() {});"
    ],
    invalid: [
        { code: "var a = new Date;", errors: [{ message: "Missing '()' invoking a constructor.", type: "NewExpression"}] }
    ]
});
