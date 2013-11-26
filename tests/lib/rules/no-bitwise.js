/**
 * @fileoverview Tests for no-bitwise rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-bitwise", {
    valid: [
        "a + b",
    	"!a"
    ],
    invalid: [
        { code: "a ^ b", errors: [{ message: "Unexpected use of '^'.", type: "BinaryExpression"}] },
        { code: "a | b", errors: [{ message: "Unexpected use of '|'.", type: "BinaryExpression"}] },
        { code: "a & b", errors: [{ message: "Unexpected use of '&'.", type: "BinaryExpression"}] },
        { code: "a << b", errors: [{ message: "Unexpected use of '<<'.", type: "BinaryExpression"}] },
        { code: "a >> b", errors: [{ message: "Unexpected use of '>>'.", type: "BinaryExpression"}] },
        { code: "a >>> b", errors: [{ message: "Unexpected use of '>>>'.", type: "BinaryExpression"}] },
        { code: "~a", errors: [{ message: "Unexpected use of '~'.", type: "UnaryExpression"}] }
    ]
});
