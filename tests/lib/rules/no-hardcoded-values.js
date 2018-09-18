/**
 * @fileoverview Tests for no-hardcoded-values regex.
 * @author Grigory Gorshkov
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-hardcoded-values"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-hardcoded-values", rule, {
    valid: [
        {
            code: "var endpoint = 'https://hardcode-url'",
            options: [{
                pattern: ""
            }]
        }
    ],
    invalid: [
        {
            code: "var endpoint = 'https://hardcode-url'",
            options: [{
                pattern: "hardcode-url"
            }],
            errors: [
                { message: "Value of a string 'https://hardcode-url' matches pattern 'hardcode-url' and is considered a hardcode." }
            ]
        },
        {
            code: "someMethod('https://hardcode-url')",
            options: [{
                pattern: "hardcode-url"
            }],
            errors: [
                { message: "Value of a string 'https://hardcode-url' matches pattern 'hardcode-url' and is considered a hardcode." }
            ]
        }
    ]
});
