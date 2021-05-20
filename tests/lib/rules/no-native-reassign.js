/**
 * @fileoverview Tests for no-native-reassign rule.
 * @author Ilya Volodin
 * @deprecated in ESLint v3.3.0
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-native-reassign"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-native-reassign", rule, {
    valid: [
        "string = 'hello world';",
        "var string;",
        { code: "Object = 0;", options: [{ exceptions: ["Object"] }] },
        "top = 0;",
        { code: "onload = 0;", env: { browser: true } },
        "require = 0;",
        { code: "a = 1", globals: { a: true } },
        "/*global a:true*/ a = 1"
    ],
    invalid: [
        { code: "String = 'hello world';", errors: [{ messageId: "nativeReassign", data: { name: "String" }, type: "Identifier" }] },
        { code: "String++;", errors: [{ messageId: "nativeReassign", data: { name: "String" }, type: "Identifier" }] },
        {
            code: "({Object = 0, String = 0} = {});",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "nativeReassign", data: { name: "Object" }, type: "Identifier" },
                { messageId: "nativeReassign", data: { name: "String" }, type: "Identifier" }
            ]
        },
        {
            code: "top = 0;",
            env: { browser: true },
            errors: [{ messageId: "nativeReassign", data: { name: "top" }, type: "Identifier" }]
        },
        {
            code: "require = 0;",
            env: { node: true },
            errors: [{ messageId: "nativeReassign", data: { name: "require" }, type: "Identifier" }]
        },

        // Notifications of readonly are moved from no-undef: https://github.com/eslint/eslint/issues/4504
        { code: "/*global b:false*/ function f() { b = 1; }", errors: [{ messageId: "nativeReassign", data: { name: "b" }, type: "Identifier" }] },
        { code: "function f() { b = 1; }", globals: { b: false }, errors: [{ messageId: "nativeReassign", data: { name: "b" }, type: "Identifier" }] },
        { code: "/*global b:false*/ function f() { b++; }", errors: [{ messageId: "nativeReassign", data: { name: "b" }, type: "Identifier" }] },
        { code: "/*global b*/ b = 1;", errors: [{ messageId: "nativeReassign", data: { name: "b" }, type: "Identifier" }] },
        { code: "Array = 1;", errors: [{ messageId: "nativeReassign", data: { name: "Array" }, type: "Identifier" }] }
    ]
});
