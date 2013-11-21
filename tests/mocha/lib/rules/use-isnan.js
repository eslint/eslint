/**
 * @fileoverview Tests for use-isnan rule.
 * @author James Allardice, Michael Paulukonis
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


eslintTester.add("use-isnan", {
    valid: [
        "var x = NaN;",
        "isNaN(NaN) === true;",
        "isNaN(123) !== true;",
        "Number.isNaN(NaN) === true;",
        "Number.isNaN(123) !== true;"
    ],
    invalid: [

        { code: "123 === NaN;",
          errors: [{ message: "Use the isNaN function to compare with NaN.", type: "BinaryExpression"}] },
        { code: "NaN === \"abc\";",
          errors: [{ message: "Use the isNaN function to compare with NaN.", type: "BinaryExpression"}] }


    ]
});
