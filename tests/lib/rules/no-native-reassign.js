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
        { code: "require = 0;" },
        { code: "a = 1", globals: {a: true}},
        "/*global a:true*/ a = 1"
    ],
    invalid: [
        { code: "String = 'hello world';", errors: [{ message: "Read-only global 'String' should not be modified.", type: "Identifier"}] },
        { code: "String++;", errors: [{ message: "Read-only global 'String' should not be modified.", type: "Identifier"}] },
        {
            code: "({Object = 0, String = 0} = {});",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {message: "Read-only global 'Object' should not be modified.", type: "Identifier"},
                {message: "Read-only global 'String' should not be modified.", type: "Identifier"}
            ]
        },
        {
            code: "top = 0;",
            env: {browser: true},
            errors: [{ message: "Read-only global 'top' should not be modified.", type: "Identifier"}]
        },
        {
            code: "require = 0;",
            env: {node: true},
            errors: [{ message: "Read-only global 'require' should not be modified.", type: "Identifier"}]
        },

        // Notifications of readonly are moved from no-undef: https://github.com/eslint/eslint/issues/4504
        { code: "/*global b:false*/ function f() { b = 1; }", errors: [{ message: "Read-only global 'b' should not be modified.", type: "Identifier"}] },
        { code: "function f() { b = 1; }", global: { b: false }, errors: [{ message: "Read-only global 'b' should not be modified.", type: "Identifier"}] },
        { code: "/*global b:false*/ function f() { b++; }", errors: [{ message: "Read-only global 'b' should not be modified.", type: "Identifier"}] },
        { code: "/*global b*/ b = 1;", errors: [{ message: "Read-only global 'b' should not be modified.", type: "Identifier"}] },
        { code: "Array = 1;", errors: [{ message: "Read-only global 'Array' should not be modified.", type: "Identifier"}] }
    ]
});
