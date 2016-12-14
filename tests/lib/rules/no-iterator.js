/**
 * @fileoverview Tests for no-iterator rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-iterator"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-iterator", rule, {
    valid: [
        "var a = test[__iterator__];",
        "var __iterator__ = null;"
    ],
    invalid: [
        { code: "var a = test.__iterator__;", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression" }] },
        { code: "Foo.prototype.__iterator__ = function() {};", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression" }] },
        { code: "var a = test['__iterator__'];", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression" }] }
    ]
});
