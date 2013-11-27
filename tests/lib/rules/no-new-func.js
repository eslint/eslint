/**
 * @fileoverview Tests for no-new-func rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-new-func", {
    valid: [
        "var a = new _function(\"b\", \"c\", \"return b+c\");"
    ],
    invalid: [
        { code: "var a = new Function(\"b\", \"c\", \"return b+c\");", errors: [{ message: "The Function constructor is eval.", type: "NewExpression"}] }
    ]
});
