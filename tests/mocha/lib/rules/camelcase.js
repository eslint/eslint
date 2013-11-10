/**
 * @fileoverview Tests for camelcase rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("camelcase", {
    valid: [
        "firstName = \"Nicholas\"",
        "FIRST_NAME = \"Nicholas\"",
        "__myPrivateVariable = \"Patrick\"",
        "myPrivateVariable_ = \"Patrick\""
    ],
    invalid: [
        { code: "first_name = \"Nicholas\"", errors: [{ message: "Identifier 'first_name' is not in camel case.", type: "Identifier"}] },
        { code: "__private_first_name = \"Patrick\"", errors: [{ message: "Identifier '__private_first_name' is not in camel case.", type: "Identifier"}] }
    ]
});