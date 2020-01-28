/**
 * @fileoverview Tests for no-iterator rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-iterator"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-iterator", rule, {
    valid: [
        "var a = test[__iterator__];",
        "var __iterator__ = null;",
        { code: "foo[`__iterator`] = null;", parserOptions: { ecmaVersion: 6 } },
        { code: "foo[`__iterator__\n`] = null;", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        {
            code: "var a = test.__iterator__;",
            errors: [{
                messageId: "noIterator",
                type: "MemberExpression"
            }]
        },
        {
            code: "Foo.prototype.__iterator__ = function() {};",
            errors: [{
                messageId: "noIterator",
                type: "MemberExpression"
            }]
        },
        {
            code: "var a = test['__iterator__'];",
            errors: [{
                messageId: "noIterator",
                type: "MemberExpression"
            }]
        },
        {
            code: "var a = test[`__iterator__`];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noIterator",
                type: "MemberExpression"
            }]
        },
        {
            code: "test[`__iterator__`] = function () {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noIterator",
                type: "MemberExpression"
            }]
        }
    ]
});
