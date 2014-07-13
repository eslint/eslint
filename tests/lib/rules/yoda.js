/**
 * @fileoverview Tests for yoda rule.
 * @author Raphael Pigulla
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/yoda", {
    valid: [
        { code: "if (value === \"red\") {}", args: ["2", "never"] },
        { code: "if (value === value) {}", args: ["2", "never"] },
        { code: "if (value != 5) {}", args: ["2", "never"] },
        { code: "if (5 & foo) {}", args: ["2", "never"] },
        { code: "if (\"blue\" === value) {}", args: ["2", "always"] },
        { code: "if (value === value) {}", args: ["2", "always"] },
        { code: "if (4 != value) {}", args: ["2", "always"] },
        { code: "if (foo & 4) {}", args: ["2", "always"] }
    ],
    invalid: [

        {
            code: "if (\"red\" == value) {}",
            args: ["2", "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of ==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true === value) {}",
            args: ["2", "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of ===.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (5 != value) {}",
            args: ["2", "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of !=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (null !== value) {}",
            args: ["2", "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of !==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (\"red\" <= value) {}",
            args: ["2", "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true >= value) {}",
            args: ["2", "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of >=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var foo = (5 < value) ? true : false",
            args: ["2", "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function foo() { return (null > value); }",
            args: ["2", "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of >.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (value == \"red\") {}",
            args: ["2", "always"],
            errors: [
                {
                    message: "Expected literal to be on the left side of ==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (value === true) {}",
            args: ["2", "always"],
            errors: [
                {
                    message: "Expected literal to be on the left side of ===.",
                    type: "BinaryExpression"
                }
            ]
        }

    ]
});
