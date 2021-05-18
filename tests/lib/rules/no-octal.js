/**
 * @fileoverview Tests for no-octal rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-octal"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-octal", rule, {
    valid: [
        "var a = 'hello world';",
        "0x1234",
        "0X5;",
        "a = 0;",
        "0.1",
        "0.5e1"
    ],
    invalid: [
        { code: "var a = 01234;", errors: [{ message: "Octal literals should not be used.", type: "Literal" }] },
        { code: "a = 1 + 01234;", errors: [{ message: "Octal literals should not be used.", type: "Literal" }] },
        { code: "00", errors: [{ message: "Octal literals should not be used.", type: "Literal" }] }
    ]
});
