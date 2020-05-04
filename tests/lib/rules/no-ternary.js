/**
 * @fileoverview Tests for no-ternary.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-ternary"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-ternary", rule, {
    valid: [
        "\"x ? y\";"
    ],
    invalid: [
        { code: "var foo = true ? thing : stuff;", errors: [{ messageId: "noTernaryOperator", type: "ConditionalExpression" }] },
        { code: "true ? thing() : stuff();", errors: [{ messageId: "noTernaryOperator", type: "ConditionalExpression" }] },
        { code: "function foo(bar) { return bar ? baz : qux; }", errors: [{ messageId: "noTernaryOperator", type: "ConditionalExpression" }] }
    ]
});
