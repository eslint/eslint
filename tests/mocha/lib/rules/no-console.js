/**
 * @fileoverview Tests for no-console rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-console", {
    valid: [
        "Console.info(foo)"
    ],
    invalid: [
        { code: "console.log(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.error(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.info(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] }
    ]
});
