/**
 * @fileoverview Tests for undefined rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-undef-init", {
    valid: [
        "var a;"
    ],
    invalid: [
        { code: "var a = undefined;", errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator"}] }
    ]
});
