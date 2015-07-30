/**
 * @fileoverview Tests for no-console rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-console"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-console", rule, {
    valid: [
        "Console.info(foo)"
    ],
    invalid: [
        { code: "console.log(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.error(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.info(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] }
    ]
});
