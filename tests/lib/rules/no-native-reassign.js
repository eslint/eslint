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
        { code: "Object = 0;", options: [{exceptions: ["Object"]}] },
        { code: "top = 0;" },
        { code: "onload = 0;", env: {browser: true} },
        { code: "require = 0;" }
    ],
    invalid: [
        { code: "String = 'hello world';", errors: [{ message: "String is a read-only native object.", type: "Identifier"}] },
        {
            code: "({Object = 0, String = 0}) = {};",
            ecmaFeatures: {destructuring: true},
            errors: [
                {message: "Object is a read-only native object.", type: "Identifier"},
                {message: "String is a read-only native object.", type: "Identifier"}
            ]
        },
        {
            code: "top = 0;",
            env: {browser: true},
            errors: [{ message: "top is a read-only native object.", type: "Identifier"}]
        },
        {
            code: "require = 0;",
            env: {node: true},
            errors: [{ message: "require is a read-only native object.", type: "Identifier"}]
        }
    ]
});
