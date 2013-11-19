/**
 * @fileoverview Tests for no-caller rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-caller", {
    valid: [
        "var x = arguments.length",
    	"var x = arguments",
    	"var x = arguments[0]",
    	"var x = arguments[caller]"
    ],
    invalid: [
        { code: "var x = arguments.callee", errors: [{ message: "Avoid arguments.callee.", type: "MemberExpression"}] },
        { code: "var x = arguments.caller", errors: [{ message: "Avoid arguments.caller.", type: "MemberExpression"}] }
    ]
});
