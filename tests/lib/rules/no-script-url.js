/**
 * @fileoverview Tests for no-script-url rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-script-url"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-script-url", rule, {
    valid: [
        "var a = 'Hello World!';",
        "var a = 10;",
        "var url = 'xjavascript:'"
    ],
    invalid: [
        {
            code: "var a = 'javascript:void(0);';",
            errors: [
                { message: "Script URL is a form of eval.", type: "Literal" }
            ]
        },
        {
            code: "var a = 'javascript:';",
            errors: [
                { message: "Script URL is a form of eval.", type: "Literal" }
            ]
        }
    ]
});
