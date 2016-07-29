/**
 * @fileoverview Check that the Unicode BOM can be required and disallowed
 * @author Andrew Johnston <https://github.com/ehjay>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/unicode-bom"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester();

ruleTester.run("unicode-bom", rule, {

    valid: [
        {
            code: "\uFEFF var a = 123;",
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
            code: "var a = 123;",
            errors: [{ message: "Expected Unicode BOM (Byte Order Mark).", type: "Program" }],
            options: ["always"],
            output: "\uFEFFvar a = 123;"
        },
        {
            code: "\uFEFF var a = 123;",
            errors: [{ message: "Unexpected Unicode BOM (Byte Order Mark).", type: "Program" }],
            output: " var a = 123;"
        },
        {
            code: "\uFEFF var a = 123;",
            errors: [{ message: "Unexpected Unicode BOM (Byte Order Mark).", type: "Program" }],
            options: ["never"],
            output: " var a = 123;"
        }
    ]
});
