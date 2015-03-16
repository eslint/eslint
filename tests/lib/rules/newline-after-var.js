/**
 * @fileoverview Tests for newline-after-var rule.
 * @author Gopal Venkatesan <http://g13n.me>
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
        { code: "var greet = 'hello'; console.log(greet);", args: [2, "never"] },
        { code: "var greet = 'hello';\n\nconsole.log(greet);", args: [2, "always"] },
        { code: "var greet = 'hello';\n\n\nconsole.log(greet);", args: [2, "always"] },
        { code: "var greet = 'hello'; var name = 'world';\n\n\nconsole.log(greet);", args: [2, "always"] }
    ],

    invalid: [
        {
            code: "var greet = 'hello';\n\nconsole.log(greet);",
            args: [2, "never"],
            errors: [{
                message: "Newline is never expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var greet = 'hello'; console.log(greet);",
            args: [2, "always"],
            errors: [{
                message: "Newline is always expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var greet = 'hello'; var name = 'world'; console.log(greet);",
            args: [2, "always"],
            errors: [{
                message: "Newline is always expected after a \"var\" statement.",
                type: "VariableDeclaration"
            }]
        }
    ]
});
