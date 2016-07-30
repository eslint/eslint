/**
 * @fileoverview Tests for no-control-regex rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-control-regex"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-control-regex", rule, {
    valid: [
        "var regex = /x1f/",
        "var regex =" + /\\x1f/,
        "var regex = new RegExp('x1f')",
        "var regex = RegExp('x1f')",
        "new RegExp('[')",
        "RegExp('[')",
        "new (function foo(){})('\\x1f')"
    ],
    invalid: [
        { code: "var regex = " + /\x1f/, errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] }, // eslint-disable-line no-control-regex
        { code: "var regex = " + /\\\x1f/, errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] }, // eslint-disable-line no-control-regex
        { code: "var regex = new RegExp('\\x1f')", errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] },
        { code: "var regex = RegExp('\\x1f')", errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] }
    ]
});
