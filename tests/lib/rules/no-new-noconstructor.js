/**
 * @fileoverview Tests for the no-new-noconstructor rule
 * @author Sosuke Suzuki
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-noconstructor"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ env: { es2022: true } });

ruleTester.run("no-new-noconstructor", rule, {
    valid: [

        // Symbol
        "var foo = Symbol('foo');",
        "function bar(Symbol) { var baz = new Symbol('baz');}",
        "function Symbol() {} new Symbol();",
        "new foo(Symbol);",
        "new foo(bar, Symbol);",

        // BigInt
        "var foo = BigInt(9007199254740991);",
        "function bar(BigInt) { var baz = new BigInt(9007199254740991);}",
        "function BigInt() {} new BigInt();",
        "new foo(BigInt);",
        "new foo(bar, BigInt);"
    ],
    invalid: [

        // Symbol
        {
            code: "var foo = new Symbol('foo');",
            errors: [{ messageId: "noNewNoconstructor" }]
        },
        {
            code: "function bar() { return function Symbol() {}; } var baz = new Symbol('baz');",
            errors: [{ messageId: "noNewNoconstructor" }]
        },

        // BigInt
        {
            code: "var foo = new BigInt(9007199254740991);",
            errors: [{ messageId: "noNewNoconstructor" }]
        },
        {
            code: "function bar() { return function BigInt() {}; } var baz = new BigInt(9007199254740991);",
            errors: [{ messageId: "noNewNoconstructor" }]
        }
    ]
});
