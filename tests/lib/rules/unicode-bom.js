/**
 * @fileoverview Check, that the Unicode BOM can be allowed and disallowed
 * @author ehjay <https://github.com/ehjay>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/unicode-bom"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("unicode-bom", rule, {

    valid: [
        {
            code: "\uFEFF",
            options: ["always"]
        },
        {
            code: "\uFEFF var a = 123;",
            options: ["always"]
        },
        {
            code: "var a = 123; \uFEFF",
            options: ["always"]
        },
        {
            code: "var a = 123;",
            options: ["never"]
        },
        {
            code: "var a = 123; \uFEFF",
            options: ["never"]
        }
    ],

    invalid: [
        {
            code: "\uFEFF var a = 123;",
            errors: [{ message: "Found unicode BOM (Byte Order Mark).", type: "Program" }]
        },
        {
            code: "\uFEFF var a = 123;",
            errors: [{ message: "Found unicode BOM (Byte Order Mark).", type: "Program" }],
            options: ["never"]
        }
    ]
});
