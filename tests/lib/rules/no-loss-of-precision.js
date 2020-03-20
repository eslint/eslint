/**
 *@fileoverview Tests for no-loss-of-precision rule.
 *@author Jacob Moore
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-loss-of-precision"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-loss-of-precision", rule, {
    valid: [
        "var x = 12345",
        "var x = 123.456",
        "var x = -123.456",
        "var x = -123456",
        "var x = 123e34",
        "var x = 123.0e34",
        "var x = 123e-34",
        "var x = -123e34",
        "var x = -123e-34",
        "var x = 12.3e34",
        "var x = 12.3e-34",
        "var x = -12.3e34",
        "var x = -12.3e-34",
        "var x = 12300000000000000000000000",
        "var x = -12300000000000000000000000",
        "var x = 0.00000000000000000000000123",
        "var x = -0.00000000000000000000000123",
        "var x = 9007199254740991",
        "var x = 0",
        "var x = 0.0",
        "var x = 0.000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "var x = -0",
        "var x = 123.0000000000000000000000",
        "var x = 019.5",
        "var x = 0195",
        "var x = 0e5",


        { code: "var x = 0b11111111111111111111111111111111111111111111111111111", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 0B11111111111111111111111111111111111111111111111111111", parserOptions: { ecmaVersion: 6 } },

        { code: "var x = 0o377777777777777777", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 0O377777777777777777", parserOptions: { ecmaVersion: 6 } },
        "var x = 0377777777777777777",

        "var x = 0x1FFFFFFFFFFFFF",
        "var x = 0X1FFFFFFFFFFFFF",
        "var x = true",
        "var x = 'abc'",
        "var x = ''",
        "var x = null",
        "var x = undefined",
        "var x = {}",
        "var x = ['a', 'b']",
        "var x = new Date()",
        "var x = '9007199254740993'"

    ],
    invalid: [
        {
            code: "var x = 9007199254740993",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 9007199254740.993e3",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 9.007199254740993e15",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = -9007199254740993",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 900719.9254740994",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = -900719.9254740994",
            errors: [{ messageId: "noLossOfPrecision" }]
        },

        {
            code: "var x = 5123000000000000000000000000001",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = -5123000000000000000000000000001",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 1230000000000000000000000.0",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 1.0000000000000000000000123",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 17498005798264095394980017816940970922825355447145699491406164851279623993595007385788105416184430592",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 2e999",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = .1230000000000000000000000",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 0b100000000000000000000000000000000000000000000000000001",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 0B100000000000000000000000000000000000000000000000000001",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 0o400000000000000001",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 0O400000000000000001",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 0400000000000000001",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 0x20000000000001",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 0X20000000000001",
            errors: [{ messageId: "noLossOfPrecision" }]
        }

    ]
});
