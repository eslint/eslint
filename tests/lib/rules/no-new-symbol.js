/**
 * @fileoverview Tests for the no-new-symbol rule
 * @author Alberto Rodríguez
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-symbol"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ env: { es6: true } });

ruleTester.run("no-new-symbol", rule, {
    valid: [
        "var foo = Symbol('foo');",
        "function bar(Symbol) { var baz = new Symbol('baz');}",
        "function Symbol() {} new Symbol();"
    ],
    invalid: [
        {
            code: "var foo = new Symbol('foo');",
            errors: [{ message: "`Symbol` cannot be called as a constructor." }]
        },
        {
            code: "function bar() { return function Symbol() {}; } var baz = new Symbol('baz');",
            errors: [{ message: "`Symbol` cannot be called as a constructor." }]
        }
    ]
});
