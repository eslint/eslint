/**
 * @fileoverview Tests for no-control-regex rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-control-regex", {
    valid: [
        "var regex = /x1f/",
        "var regex = new RegExp('x1f')",
        "var regex = RegExp('x1f')",
        "new RegExp('[')",
        "RegExp('[')",
        "new (function foo(){})('\\x1f')"
    ],
    invalid: [
        { code: "var regex = /\\\x1f/", errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] },
        { code: "var regex = new RegExp('\\x1f')", errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] },
        { code: "var regex = RegExp('\\x1f')", errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] }
    ]
});
