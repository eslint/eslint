/**
 * @fileoverview Tests for newline-after-var rule.
 * @author Gopal Venkatesan
 * @copyright 2015 Gopal Venkatesan. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);

eslintTester.addRuleTest("lib/rules/newline-after-var", {
    valid: [
        { code: "var greet = 'hello'; console.log(greet);", options: ["never"] },
        { code: "var greet = 'hello';\n\nconsole.log(greet);", options: ["always"] },
        { code: "var greet = 'hello';\n\n\nconsole.log(greet);", options: ["always"] },
        {
            code: "var greet = 'hello'; var name = 'world';\n\n\nconsole.log(greet, name);",
            options: ["always"]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\n\n\nconsole.log(greet, name);",
            options: ["always"]
        },
        // invalid configuration option
        {
            code: "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: ["foobar"]
        },
        // es6 block bindings
        {
            code: "let greet = 'hello';\n\nconsole.log(greet);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "let greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "let greet = 'hello';\nconst name = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "const greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "const greet = 'hello';\nlet name = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        }
    ],

    invalid: [
        {
            code: "var greet = 'hello';\n\nconsole.log(greet);",
            options: ["never"],
            errors: [{
                message: "Newline is never expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var greet = 'hello'; console.log(greet);",
            options: ["always"],
            errors: [{
                message: "Newline is always expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var greet = 'hello'; var name = 'world'; console.log(greet);",
            options: ["always"],
            errors: [{
                message: "Newline is always expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        },
        // es6 block bindings
        {
            code: "let greet = 'hello'; const name = 'world';\n\nconsole.log(greet);",
            options: ["never"],
            ecmaFeatures: { blockBindings: true },
            errors: [{
                message: "Newline is never expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "const greet = 'hello';\nlet name = 'world';\n\nconsole.log(greet, name);",
            options: ["never"],
            ecmaFeatures: { blockBindings: true },
            errors: [{
                message: "Newline is never expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        },
        // invalid configuration option
        {
            code: "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
            options: ["foobar"],
            errors: [{
                message: "Newline is always expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        }
    ]
});
