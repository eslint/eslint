/**
 * @fileoverview Tests for the no-new-symbol rule
 * @author Alberto Rodríguez
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-symbol"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ env: { es6: true } });

ruleTester.run("no-new-symbol", rule, {
    valid: [
        "var foo = Symbol('foo');",
        "function bar(Symbol) { var baz = new Symbol('baz');}",
        "function Symbol() {} new Symbol();",
        "new foo(Symbol);",
        "new foo(bar, Symbol);"
    ],
    invalid: [
        {
            code: "var foo = new Symbol('foo');",
            errors: [{ messageId: "noNewSymbol" }]
        },
        {
            code: "function bar() { return function Symbol() {}; } var baz = new Symbol('baz');",
            errors: [{ messageId: "noNewSymbol" }]
        }
    ]
});
