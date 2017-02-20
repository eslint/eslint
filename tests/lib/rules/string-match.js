/**
 * @fileoverview Rule to flag matching strings
 * @author Jonny Arnold
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/string-match"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("string-match", rule, {
    valid: [
        {
            code: "x = \"FOO\"",
            options: []
        },
        {
            code: "x = \"INVALID\"",
            options: ["NOT_VALID"]
        }
    ],
    invalid: [
        {
            code: "x = \"\"",
            options: [],
            errors: [
                {
                    message: "String '' is not allowed.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "x = \"NOT_VALID\"",
            options: ["NOT_VALID"],
            errors: [
                {
                    message: "String 'NOT_VALID' is not allowed.",
                    type: "Literal"
                }
            ]
        }
    ]
});
