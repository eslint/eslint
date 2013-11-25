/**
 * @fileoverview Tests for guard-for-in rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("guard-for-in", {
    valid: [
        "for (var x in o) {}",
        "for (var x in o) { if (x) {}}"
    ],
    invalid: [
        { code: "for (var x in o) { foo() }", errors: [{ message: "The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype.", type: "ForInStatement"}] },
        { code: "for (var x in o) foo();", errors: [{ message: "The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype.", type: "ForInStatement"}] }
    ]
});
