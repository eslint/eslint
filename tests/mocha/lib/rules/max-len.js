/**
 * @fileoverview Tests for max-len rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("max-len", {
    valid: [
        { code: "var x = 5;\nvar x = 2;", args: [1, 80, 4] },
        { code: "\t\t\tvar i = 1;\n\t\t\tvar j = 1;", args: [1, 15, 1] }
    ],
    invalid: [
        { code: "var x = 5, y = 2, z = 5;", args: [1, 10, 4], errors: [{ message: "Line 0 exceeds the maximum line length of 10.", type: "Program"}] },
        { code: "\t\t\tvar i = 1;", args: [1, 15, 4], errors: [{ message: "Line 0 exceeds the maximum line length of 15.", type: "Program"}] },
        { code: "\t\t\tvar i = 1;\n\t\t\tvar j = 1;", args: [1, 15, 4], errors: [{ message: "Line 0 exceeds the maximum line length of 15.", type: "Program"}, { message: "Line 1 exceeds the maximum line length of 15.", type: "Program"}] }
    ]
});
