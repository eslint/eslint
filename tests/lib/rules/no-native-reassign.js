/**
 * @fileoverview Tests for no-native-reassign rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
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
        { code: "String = 'hello world';", errors: [{ message: "String is a read-only native object.", type: "Identifier"}] },
        { code: "var String;", errors: [{ message: "Redefinition of 'String'.", type: "Identifier"}] },
        {
            code: "var Object = 0",
            options: [{exceptions: ["Number"]}],
            errors: [{ message: "Redefinition of 'Object'.", type: "Identifier"}]
        },
        {
            code: "({Object = 0, String = 0}) = {};",
            ecmaFeatures: {destructuring: true},
            errors: [
                {message: "Object is a read-only native object.", type: "Identifier"},
                {message: "String is a read-only native object.", type: "Identifier"}
            ]
        },
        {
            code: "var {Array, Number = 0} = {};",
            ecmaFeatures: {destructuring: true},
            errors: [
                {message: "Redefinition of 'Array'.", type: "Identifier"},
                {message: "Redefinition of 'Number'.", type: "Identifier"}
            ]
        }
    ]
});
