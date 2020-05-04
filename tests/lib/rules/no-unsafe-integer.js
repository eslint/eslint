/**
 * @fileoverview Test for no-unsafe-integer rule
 * @author Joshua Westerheide
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unsafe-integer"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-unsafe-integer", rule, {
    valid: [
        "var num1 = 0",
        "var num2 = 1",
        "var num3 = 123456789",
        "var num4 = 9007199254740991",
        "var num5 = 0x1FFFFFFFFFFFFF",
        "parseInt(\"9007199254740991\")",
        "parseInt(\"9007199254740991\", 10)",
        "parseInt(\"1234567891011121315\", 8)",
        "foo(9007199254740991)"
    ],
    invalid: [
        { code: "var num1 = 9223372036854775807", errors: [{ messageId: "unsafe", data: { value: "9223372036854775807" }, type: "Literal" }] },
        { code: "var num2 = 0x7FFFFFFFFFFFFFFF", errors: [{ messageId: "unsafe", data: { value: "0x7FFFFFFFFFFFFFFF" }, type: "Literal" }] },
        { code: "var num3 = 9007199254740992", errors: [{ messageId: "unsafe", data: { value: "9007199254740992" }, type: "Literal" }] },
        { code: "parseInt(\"9007199254740992\")", errors: [{ messageId: "unsafe-parsing", data: { value: "9007199254740992" }, type: "CallExpression" }] },
        { code: "parseInt(\"9007199254740992\", 10)", errors: [{ messageId: "unsafe-parsing", data: { value: "9007199254740992" }, type: "CallExpression" }] },
        { code: "foo(9007199254740992)", errors: [{ messageId: "unsafe", data: { value: "9007199254740992" }, type: "Literal" }] }
    ]
});
