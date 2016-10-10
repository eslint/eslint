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

const errors = [{message: "Use the spread operator instead of '.apply()'.", type: "CallExpression"}];

const ruleTester = new RuleTester();

ruleTester.run("prefer-spread", rule, {
    valid: [
        {code: "foo.apply(obj, args);"},
        {code: "obj.foo.apply(null, args);"},
        {code: "obj.foo.apply(otherObj, args);"},
        {code: "a.b(x, y).c.foo.apply(a.b(x, z).c, args);"},
        {code: "a.b.foo.apply(a.b.c, args);"},

        // ignores non variadic.
        {code: "foo.apply(undefined, [1, 2]);"},
        {code: "foo.apply(null, [1, 2]);"},
        {code: "obj.foo.apply(obj, [1, 2]);"},

        // ignores computed property.
        {code: "var apply; foo[apply](null, args);"},

        // ignores incomplete things.
        {code: "foo.apply();"},
        {code: "obj.foo.apply();"},
        {
            code: "obj.foo.apply(obj, ...args)",
            parserOptions: {ecmaVersion: 6}
        }
    ],
    invalid: [
        {
            code: "foo.apply(undefined, args);",
            output: "foo(...args);",
            errors
        },
        {
            code: "foo.apply(void 0, args);",
            output: "foo(...args);",
            errors
        },
        {
            code: "foo.apply(null, args);",
            output: "foo(...args);",
            errors
        },
        {
            code: "obj.foo.apply(obj, args);",
            output: "obj.foo(...args);",
            errors
        },
        {

            // Not fixed: a.b.c might activate getters
            code: "a.b.c.foo.apply(a.b.c, args);",
            output: "a.b.c.foo.apply(a.b.c, args);",
            errors
        },
        {

            // Not fixed: a.b(x, y).c might activate getters
            code: "a.b(x, y).c.foo.apply(a.b(x, y).c, args);",
            output: "a.b(x, y).c.foo.apply(a.b(x, y).c, args);",
            errors
        },
        {

            // Not fixed (not an identifier)
            code: "[].concat.apply([ ], args);",
            output: "[].concat.apply([ ], args);",
            errors
        },
        {

            // Not fixed (not an identifier)
            code: "[].concat.apply([\n/*empty*/\n], args);",
            output: "[].concat.apply([\n/*empty*/\n], args);",
            errors
        }
    ]
});
