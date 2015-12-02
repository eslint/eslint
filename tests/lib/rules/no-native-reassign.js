/**
 * @fileoverview Tests for no-native-reassign rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-native-reassign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-native-reassign", rule, {
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
        },

        // Notifications of readonly are moved from no-undef: https://github.com/eslint/eslint/issues/4504
        { code: "/*global b:false*/ function f() { b = 1; }", errors: [{ message: "b is a read-only native object.", type: "Identifier"}] },
        { code: "function f() { b = 1; }", global: { b: false }, errors: [{ message: "b is a read-only native object.", type: "Identifier"}] },
        { code: "/*global b:false*/ function f() { b++; }", errors: [{ message: "b is a read-only native object.", type: "Identifier"}] },
        { code: "/*global b*/ b = 1;", errors: [{ message: "b is a read-only native object.", type: "Identifier"}] },
        { code: "Array = 1;", errors: [{ message: "Array is a read-only native object.", type: "Identifier"}] }
    ]
});
