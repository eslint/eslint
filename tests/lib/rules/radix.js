/**
 * @fileoverview Tests for radix rule.
 * @author James Allardice
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

eslintTester.add("radix", {
    valid: [
        "parseInt(\"10\", 10);"
           ],
    invalid: [
        { code: "parseInt(\"10\");",
          errors: [{ message: "Missing radix parameter.", type: "CallExpression"}] }
    ]
});
