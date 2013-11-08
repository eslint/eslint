/**
 * @fileoverview Tests for eqeqeq rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("eqeqeq", {
    valid: [
        "a === b",
        "a !== b",
        { code: "typeof a == 'number'", args: [1, "smart"] },
        { code: "'string' != typeof a", args: [1, "smart"] },
        { code: "'hello' != 'world'", args: [1, "smart"] },
        { code: "2 == 3", args: [1, "smart"] },
        { code: "true == true", args: [1, "smart"] }
    ],
    invalid: [
        { code: "a == b", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "a != b", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "true == 1", args: [1, "smart"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "0 != '1'", args: [1, "smart"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "'wee' == /wee/", args: [1, "smart"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] }
    ]
});
