/**
 * @fileoverview Tests for no-new-func rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-new-func", {
    valid: [
        "var a = new _function(\"b\", \"c\", \"return b+c\");"
    ],
    invalid: [
        { code: "var a = new Function(\"b\", \"c\", \"return b+c\");", errors: [{ message: "The Function constructor is eval.", type: "NewExpression"}] }
    ]
});
