/**
 * @fileoverview Tests for no-ternary.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-ternary"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-ternary", rule, {
    valid: [
        "\"x ? y\";"
    ],
    invalid: [
        { code: "var foo = true ? thing : stuff;", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] },
        { code: "true ? thing() : stuff();", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] },
        { code: "function foo(bar) { return bar ? baz : qux; }", errors: [{ message: "Ternary operator used.", type: "ConditionalExpression"}] }
    ]
});
