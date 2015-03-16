/**
 * @fileoverview Tests for yoda rule.
 * @author Raphael Pigulla
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
eslintTester.addRuleTest("lib/rules/yoda", {
    valid: [
        // "never" mode
        { code: "if (value === \"red\") {}", args: [2, "never"] },
        { code: "if (value === value) {}", args: [2, "never"] },
        { code: "if (value != 5) {}", args: [2, "never"] },
        { code: "if (5 & foo) {}", args: [2, "never"] },

        // "always" mode
        { code: "if (\"blue\" === value) {}", args: [2, "always"] },
        { code: "if (value === value) {}", args: [2, "always"] },
        { code: "if (4 != value) {}", args: [2, "always"] },
        { code: "if (foo & 4) {}", args: [2, "always"] },

        // Range exception
        {
            code: "if (0 < x && x <= 1) {}",
            args: [2, "never", { exceptRange: true }]
        }, {
            code: "if (x < 0 || 1 <= x) {}",
            args: [2, "never", { exceptRange: true }]
        }, {
            code: "if (0 <= x && x < 1) {}",
            args: [2, "always", { exceptRange: true }]
        }, {
            code: "if (x <= 'bar' || 'foo' < x) {}",
            args: [2, "always", { exceptRange: true }]
        }, {
            code: "if ('blue' < x.y && x.y < 'green') {}",
            args: [2, "never", { exceptRange: true }]
        }, {
            code: "if (0 <= x['y'] && x['y'] <= 100) {}",
            args: [2, "never", { exceptRange: true }]
        }, {
            code: "if (a < 0 && (0 < b && b < 1)) {}",
            args: [2, "never", { exceptRange: true }]
        }, {
            code: "if ((0 < a && a < 1) && b < 0) {}",
            args: [2, "never", { exceptRange: true }]
        }, {
            code: "if (a < 4 || (b[c[0]].d['e'] < 0 || 1 <= b[c[0]].d['e'])) {}",
            args: [2, "never", { exceptRange: true }]
        }, {
            code: "if (-1 < x && x < 0) {}",
            args: [2, "never", { exceptRange: true }]
        }, {
            code: "if (0 <= this.prop && this.prop <= 1) {}",
            args: [2, "never", { exceptRange: true }]
        }
    ],
    invalid: [

        {
            code: "if (\"red\" == value) {}",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of ==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true === value) {}",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of ===.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (5 != value) {}",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of !=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (null !== value) {}",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of !==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (\"red\" <= value) {}",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true >= value) {}",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of >=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var foo = (5 < value) ? true : false",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function foo() { return (null > value); }",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of >.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (-1 < str.indexOf(substr)) {}",
            args: [2, "never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (value == \"red\") {}",
            args: [2, "always"],
            errors: [
                {
                    message: "Expected literal to be on the left side of ==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (value === true) {}",
            args: [2, "always"],
            errors: [
                {
                    message: "Expected literal to be on the left side of ===.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (a < 0 && 0 <= b && b < 1) {}",
            args: [2, "never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a && a < 1 && b < 1) {}",
            args: [2, "never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (1 < a && a < 0) {}",
            args: [2, "never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "0 < a && a < 1",
            args: [2, "never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var a = b < 0 || 1 <= b;",
            args: [2, "never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= x && x < -1) {}",
            args: [2, "never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var a = (b < 0 && 0 <= b);",
            args: [2, "always", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the left side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a[b] && a['b'] < 1) {}",
            args: [2, "never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a[b()] && a[b()] < 1) {}",
            args: [2, "never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= x && x < 1) {}",
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        }

    ]
});
