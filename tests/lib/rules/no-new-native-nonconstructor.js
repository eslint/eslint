/**
 * @fileoverview Tests for the no-new-native-nonconstructor rule
 * @author Sosuke Suzuki
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-native-nonconstructor"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } });

ruleTester.run("no-new-native-nonconstructor", rule, {
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
            errors: [{
                message: "`Symbol` cannot be called as a constructor."
            }]
        },
        {
            code: "function bar() { return function Symbol() {}; } var baz = new Symbol('baz');",
            errors: [{
                message: "`Symbol` cannot be called as a constructor."
            }]
        },

        // BigInt
        {
            code: "var foo = new BigInt(9007199254740991);",
            errors: [{
                message: "`BigInt` cannot be called as a constructor."
            }]
        },
        {
            code: "function bar() { return function BigInt() {}; } var baz = new BigInt(9007199254740991);",
            errors: [{
                message: "`BigInt` cannot be called as a constructor."
            }]
        }
    ]
});
