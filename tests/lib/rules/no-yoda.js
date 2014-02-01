/**
 * @fileoverview Tests for no-yoda rule.
 * @author Raphael Pigulla
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-yoda", {
    valid: [
        "if (value === \"red\") {}",
        "if (value === value) {}",
        "if (value != 5) {}",
        "if (5 & foo) {}"
    ],
    invalid: [

        {
            code: "if (\"red\" == value) {}",
            errors: [
                {
                    message: "Expected literal to be on the right side of ==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true === value) {}",
            errors: [
                {
                    message: "Expected literal to be on the right side of ===.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (5 != value) {}",
            errors: [
                {
                    message: "Expected literal to be on the right side of !=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (null !== value) {}",
            errors: [
                {
                    message: "Expected literal to be on the right side of !==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (\"red\" <= value) {}",
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true >= value) {}",
            errors: [
                {
                    message: "Expected literal to be on the right side of >=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var foo = (5 < value) ? true : false",
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function foo() { return (null > value); }",
            errors: [
                {
                    message: "Expected literal to be on the right side of >.",
                    type: "BinaryExpression"
                }
            ]
        }
    ]
});
