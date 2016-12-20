/**
 * @fileoverview Tests for no-proto rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-proto"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-proto", rule, {
    valid: [
        "var a = test[__proto__];",
        "var __proto__ = null;"
    ],
    invalid: [
        { code: "var a = test.__proto__;", errors: [{ message: "The '__proto__' property is deprecated.", type: "MemberExpression" }] },
        { code: "var a = test['__proto__'];", errors: [{ message: "The '__proto__' property is deprecated.", type: "MemberExpression" }] }
    ]
});
