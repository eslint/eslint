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
            code: "var endpoint = 'https://hardcode-url.com'",
            options: ["http://.+.com"]
        },
        {
            code: "var email = 'foo@bar.com'",
            options: ["foobar"]
        }
    ],
    invalid: [
        {
            code: "var endpoint = 'https://prod.hardcode-url.com/some-path'",
            options: ["https?://.+\\.com"],
            errors: [
                { message: "Value of a string 'https://prod.hardcode-url.com/some-path' matches pattern 'https?://.+\\.com' and is considered a hardcode." }
            ]
        },
        {
            code: "someMethod('http://dev.hardcode-url.com/some-path')",
            options: ["https?://.+\\.com"],
            errors: [
                { message: "Value of a string 'http://dev.hardcode-url.com/some-path' matches pattern 'https?://.+\\.com' and is considered a hardcode." }
            ]
        },
        {
            code: "var email = 'foo@bar.com'",
            options: ["https?://.+\\.com", ".+@.+\\.com"],
            errors: [
                { message: "Value of a string 'foo@bar.com' matches pattern '.+@.+\\.com' and is considered a hardcode." }
            ]
        }
    ]
});
