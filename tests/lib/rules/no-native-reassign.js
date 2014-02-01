/**
 * @fileoverview Tests for no-native-reassign rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-native-reassign", {
    valid: [
        "string = 'hello world';",
        "var string;"
    ],
    invalid: [
        { code: "String = 'hello world';", errors: [{ message: "String is a read-only native object.", type: "AssignmentExpression"}] },
        { code: "var String;", errors: [{ message: "Redefinition of 'String'.", type: "VariableDeclarator"}] }
    ]
});
