/**
 * @fileoverview Tests for no-native-reassign rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/no-native-reassign", {
    valid: [
        "string = 'hello world';",
        "var string;",
        {
            code: "var Object = 0",
            options: [{exceptions: ["Object"]}]
        }
    ],
    invalid: [
        { code: "String = 'hello world';", errors: [{ message: "String is a read-only native object.", type: "AssignmentExpression"}] },
        { code: "var String;", errors: [{ message: "Redefinition of 'String'.", type: "VariableDeclarator"}] },
        {
            code: "var Object = 0",
            options: [{exceptions: ["Number"]}],
            errors: [{ message: "Redefinition of 'Object'.", type: "VariableDeclarator"}]
        }
    ]
});
