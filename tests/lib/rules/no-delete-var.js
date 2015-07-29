/**
 * @fileoverview Tests for no-delete-var rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-delete-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-delete-var", rule, {
    valid: [
        "delete x.prop;"
    ],
    invalid: [
        { code: "delete x", errors: [{ message: "Variables should not be deleted.", type: "UnaryExpression"}] }
    ]
});
