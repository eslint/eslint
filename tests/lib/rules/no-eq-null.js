/**
 * @fileoverview Tests for no-eq-null rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-eq-null"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-eq-null", rule, {
    valid: [
        "if (x === null) { }",
        "if (null === f()) { }"
    ],
    invalid: [
        { code: "if (x == null) { }", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] },
        { code: "if (x != null) { }", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] },
        { code: "do {} while (null == x)", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] }
    ]
});
