/**
 * @fileoverview Tests for no-iterator rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-iterator", {
    valid: [
        "var a = test[__iterator__];",
        "var __iterator__ = null;"
    ],
    invalid: [
        { code: "var a = test.__iterator__;", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression"}] },
        { code: "Foo.prototype.__iterator__ = function () {};", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression"}] },
        { code: "var a = test['__iterator__'];", errors: [{ message: "Reserved name '__iterator__'.", type: "MemberExpression"}] }
    ]
});
