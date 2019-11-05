/**
 * @fileoverview Tests for no-constructor-return rule.
 * @author Pig Fang <https://github.com/g-plane>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-constructor-return"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

const errors = [{ type: "ReturnStatement", messageId: "unexpected" }];

ruleTester.run("no-constructor-return", rule, {
    valid: [
        "class C {  }",
        "class C { constructor() {} }",
        "class C { constructor() { let v } }",
        "class C { method() { return '' } }",
        "class C { get value() { return '' } }",
        "class C { constructor(a) { if (!a) { return } else { a() } } }"
    ],
    invalid: [
        {
            code: "class C { constructor() { return } }",
            errors
        },
        {
            code: "class C { constructor() { return '' } }",
            errors
        },
        {
            code: "class C { constructor(a) { if (!a) { return '' } else { a() } } }",
            errors
        }
    ]
});
