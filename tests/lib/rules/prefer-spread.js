/**
 * @fileoverview Tests for prefer-spread rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-spread");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{ messageId: "preferSpread", type: "CallExpression" }];

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

ruleTester.run("prefer-spread", rule, {
    valid: [
        "foo.apply(obj, args);",
        "obj.foo.apply(null, args);",
        "obj.foo.apply(otherObj, args);",
        "a.b(x, y).c.foo.apply(a.b(x, z).c, args);",
        "a.b.foo.apply(a.b.c, args);",

        // ignores non variadic.
        "foo.apply(undefined, [1, 2]);",
        "foo.apply(null, [1, 2]);",
        "obj.foo.apply(obj, [1, 2]);",

        // ignores computed property.
        "var apply; foo[apply](null, args);",

        // ignores incomplete things.
        "foo.apply();",
        "obj.foo.apply();",
        "obj.foo.apply(obj, ...args)",

        // Optional chaining
        "(a?.b).c.foo.apply(a?.b.c, args);",
        "a?.b.c.foo.apply((a?.b).c, args);",

        // Private fields
        "class C { #apply; foo() { foo.#apply(undefined, args); } }"
    ],
    invalid: [
        {
            code: "foo.apply(undefined, args);",
            errors
        },
        {
            code: "foo.apply(void 0, args);",
            errors
        },
        {
            code: "foo.apply(null, args);",
            errors
        },
        {
            code: "obj.foo.apply(obj, args);",
            errors
        },
        {
            code: "a.b.c.foo.apply(a.b.c, args);",
            errors
        },
        {
            code: "a.b(x, y).c.foo.apply(a.b(x, y).c, args);",
            errors
        },
        {
            code: "[].concat.apply([ ], args);",
            errors
        },
        {
            code: "[].concat.apply([\n/*empty*/\n], args);",
            errors
        },

        // Optional chaining
        {
            code: "foo.apply?.(undefined, args);",
            errors
        },
        {
            code: "foo?.apply(undefined, args);",
            errors
        },
        {
            code: "foo?.apply?.(undefined, args);",
            errors
        },
        {
            code: "(foo?.apply)(undefined, args);",
            errors
        },
        {
            code: "(foo?.apply)?.(undefined, args);",
            errors
        },
        {
            code: "(obj?.foo).apply(obj, args);",
            errors
        },
        {
            code: "a?.b.c.foo.apply(a?.b.c, args);",
            errors
        },
        {
            code: "(a?.b.c).foo.apply(a?.b.c, args);",
            errors
        },
        {
            code: "(a?.b).c.foo.apply((a?.b).c, args);",
            errors
        },

        // Private fields
        {
            code: "class C { #foo; foo() { obj.#foo.apply(obj, args); } }",
            errors
        }
    ]
});
