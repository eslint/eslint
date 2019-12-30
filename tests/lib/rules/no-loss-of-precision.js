/**
 * @fileoverview Tests for no-loss-of-precision rule.
 * @author Jacob Moore
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
        "var x = 123e-34",
        "var x = -123e34",
        "var x = -123e-34",
        "var x = 12.3e34",
        "var x = 12.3e-34",
        "var x = -12.3e34",
        "var x = -12.3e-34",
        "var x = 12300000000000000000000000",
        "var x = -12300000000000000000000000",
        "var x = 0000000000000000000000012300000000000000000000000",
        "var x = -0000000000000000000012300000000000000000000000",
        "var x = 0.00000000000000000000000123",
        "var x = -0.00000000000000000000000123",
        "var x = 9007199254740991",
        "var x = -9007199254740991",
        "var x = 9007.199254740991",
        "var x = -9007.199254740991",
        "var x = 900719925474099100",
        "var x = -900719925474099100",
        "var x = 9007199254740991e3",
        "var x = 9007199254740991e-3",
        "var x = .9007199254740991",
        "var x = -.0009007199254740991"
    ],
    invalid: [
        {
            code: "var x = 9007199254740992",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = -9007199254740992",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 900719.9254740992",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = -900719.9254740992",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 9007199254740992e23",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = -9007199254740992e23",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 900719.9254740992e23",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = -900719.9254740992e23",
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
            code: "var x = 123.0000000000000000000000",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = .1230000000000000000000000",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 1.0000000000000000000000123",
            errors: [{ messageId: "noLossOfPrecision" }]
        },
        {
            code: "var x = 1.230000000000000000000000e35",
            errors: [{ messageId: "noLossOfPrecision" }]
        }
    ]
});
