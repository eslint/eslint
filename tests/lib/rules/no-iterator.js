/**
 * @fileoverview Tests for no-iterator rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-iterator", {
    valid: [
        "var a = test[__iterator__];",
        "var __iterator__ = null;"
    ],
    invalid: [
        { code: "var a = test.__iterator__;", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression"}] },
        { code: "Foo.prototype.__iterator__ = function() {};", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression"}] },
        { code: "var a = test['__iterator__'];", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression"}] }
    ]
});
