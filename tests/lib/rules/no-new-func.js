/**
 * @fileoverview Tests for no-new-func rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-func"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new-func", rule, {
    valid: [
        "var a = new _function(\"b\", \"c\", \"return b+c\");",
        "var a = _function(\"b\", \"c\", \"return b+c\");",
        {
            code: "class Function {}; new Function()",
            parserOptions: {
                ecmaVersion: 2015
            }
        },
        {
            code: "const fn = () => { class Function {}; new Function() }",
            parserOptions: {
                ecmaVersion: 2015
            }
        },
        "function Function() {}; Function()",
        "var fn = function () { function Function() {}; Function() }",
        "var x = function Function() { Function(); }",
        "call(Function)",
        "new Class(Function)",
        "foo[Function]()",
        "foo(Function.bind)",
        "Function.toString()",
        "Function[call]()"
    ],
    invalid: [
        {
            code: "var a = new Function(\"b\", \"c\", \"return b+c\");",
            errors: [{
                messageId: "noFunctionConstructor",
                type: "NewExpression"
            }]
        },
        {
            code: "var a = Function(\"b\", \"c\", \"return b+c\");",
            errors: [{
                messageId: "noFunctionConstructor",
                type: "CallExpression"
            }]
        },
        {
            code: "var a = Function.call(null, \"b\", \"c\", \"return b+c\");",
            errors: [{
                messageId: "noFunctionConstructor",
                type: "CallExpression"
            }]
        },
        {
            code: "var a = Function.apply(null, [\"b\", \"c\", \"return b+c\"]);",
            errors: [{
                messageId: "noFunctionConstructor",
                type: "CallExpression"
            }]
        },
        {
            code: "var a = Function.bind(null, \"b\", \"c\", \"return b+c\")();",
            errors: [{
                messageId: "noFunctionConstructor",
                type: "CallExpression"
            }]
        },
        {
            code: "var a = Function.bind(null, \"b\", \"c\", \"return b+c\");",
            errors: [{
                messageId: "noFunctionConstructor",
                type: "CallExpression"
            }]
        },
        {
            code: "var a = Function[\"call\"](null, \"b\", \"c\", \"return b+c\");",
            errors: [{
                messageId: "noFunctionConstructor",
                type: "CallExpression"
            }]
        },
        {
            code: "var a = (Function?.call)(null, \"b\", \"c\", \"return b+c\");",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "noFunctionConstructor",
                type: "CallExpression"
            }]
        },
        {
            code: "const fn = () => { class Function {} }; new Function('', '')",
            parserOptions: {
                ecmaVersion: 2015
            },
            errors: [{
                messageId: "noFunctionConstructor",
                type: "NewExpression"
            }]
        },
        {
            code: "var fn = function () { function Function() {} }; Function('', '')",
            errors: [{
                messageId: "noFunctionConstructor",
                type: "CallExpression"
            }]
        }
    ]
});
