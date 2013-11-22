/**
 * @fileoverview Tests for no-script-url rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-script-url", {
    valid: [
        "var a = 'Hello World!';",
        "var a = 10;"
    ],
    invalid: [
        { code: "var a = 'javascript:void(0);';", errors: [{ message: "Script URL is a form of eval.", type: "Literal"}] }
    ]
});
