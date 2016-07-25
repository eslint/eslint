/**
 * @fileoverview Tests for no-proto rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/no-proto"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester();

ruleTester.run("no-proto", rule, {
    valid: [
        "var a = test[__proto__];",
        "var __proto__ = null;"
    ],
    invalid: [
        { code: "var a = test.__proto__;", errors: [{ message: "The '__proto__' property is deprecated.", type: "MemberExpression"}] },
        { code: "var a = test['__proto__'];", errors: [{ message: "The '__proto__' property is deprecated.", type: "MemberExpression"}] }
    ]
});
