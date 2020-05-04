/**
 * @fileoverview Tests for prefer-spread rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-spread");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{ message: "Use the spread operator instead of '.apply()'.", type: "CallExpression" }];

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

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
        "obj.foo.apply(obj, ...args)"
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
        }
    ]
});
