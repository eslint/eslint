/**
 * @fileoverview Tests for no-multi-str rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-multi-str", {
    valid: [
        "var a = 'Line 1 Line 2';"
    ],
    invalid: [
        { code: "var x = 'Line 1 \\\n Line 2'", errors: [{ message: "Multiline support is limited to browsers supporting ES5 only.", type: "Literal"}] },
        { code: "test('Line 1 \\\n Line 2');", errors: [{ message: "Multiline support is limited to browsers supporting ES5 only.", type: "Literal"}] }
    ]
});
