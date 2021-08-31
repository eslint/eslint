/**
 * @fileoverview Tests for no-proto rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-proto"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-proto", rule, {
    valid: [
        "var a = test[__proto__];",
        "var __proto__ = null;",
        { code: "foo[`__proto`] = null;", parserOptions: { ecmaVersion: 6 } },
        { code: "foo[`__proto__\n`] = null;", parserOptions: { ecmaVersion: 6 } },
        { code: "class C { #__proto__; foo() { this.#__proto__; } }", parserOptions: { ecmaVersion: 2022 } }
    ],
    invalid: [
        { code: "var a = test.__proto__;", errors: [{ messageId: "unexpectedProto", type: "MemberExpression" }] },
        { code: "var a = test['__proto__'];", errors: [{ messageId: "unexpectedProto", type: "MemberExpression" }] },
        { code: "var a = test[`__proto__`];", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedProto", type: "MemberExpression" }] },
        { code: "test[`__proto__`] = function () {};", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedProto", type: "MemberExpression" }] }
    ]
});
