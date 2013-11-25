/**
 * @fileoverview Tests for no-eq-null rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-eq-null", {
    valid: [
        "if (x === null) { }",
        "if (null === f()) { }"
    ],
    invalid: [
        { code: "if (x == null) { }", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] },
        { code: "if (x != null) { }", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] },
        { code: "do {} while (null == x)", errors: [{ message: "Use ‘===’ to compare with ‘null’.", type: "BinaryExpression"}] }
    ]
});
