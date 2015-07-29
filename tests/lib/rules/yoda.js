/**
 * @fileoverview Tests for yoda rule.
 * @author Raphael Pigulla
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var rule = require("../../../lib/rules/yoda"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("yoda", rule, {
    valid: [
        // "never" mode
        { code: "if (value === \"red\") {}", options: ["never"] },
        { code: "if (value === value) {}", options: ["never"] },
        { code: "if (value != 5) {}", options: ["never"] },
        { code: "if (5 & foo) {}", options: ["never"] },
        { code: "if (5 === 4) {}", options: ["never"] },

        // "always" mode
        { code: "if (\"blue\" === value) {}", options: ["always"] },
        { code: "if (value === value) {}", options: ["always"] },
        { code: "if (4 != value) {}", options: ["always"] },
        { code: "if (foo & 4) {}", options: ["always"] },
        { code: "if (5 === 4) {}", options: ["always"] },

        // Range exception
        {
            code: "if (0 < x && x <= 1) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (x < 0 || 1 <= x) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (0 <= x && x < 1) {}",
            options: ["always", { exceptRange: true }]
        }, {
            code: "if (x <= 'bar' || 'foo' < x) {}",
            options: ["always", { exceptRange: true }]
        }, {
            code: "if ('blue' < x.y && x.y < 'green') {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (0 <= x['y'] && x['y'] <= 100) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (a < 0 && (0 < b && b < 1)) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if ((0 < a && a < 1) && b < 0) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (a < 4 || (b[c[0]].d['e'] < 0 || 1 <= b[c[0]].d['e'])) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (-1 < x && x < 0) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (0 <= this.prop && this.prop <= 1) {}",
            options: ["never", { exceptRange: true }]
        },

        // onlyEquality
        { code: "if (0 < x && x <= 1) {}", options: ["never", { onlyEquality: true }]},
        { code: "if (x !== 'foo' && 'foo' !== x) {}", options: ["never", { onlyEquality: true }]},
        { code: "if (x < 2 && x !== -3) {}", options: ["always", { onlyEquality: true }]}
    ],
    invalid: [

        {
            code: "if (\"red\" == value) {}",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of ==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true === value) {}",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of ===.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (5 != value) {}",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of !=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (null !== value) {}",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of !==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (\"red\" <= value) {}",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true >= value) {}",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of >=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var foo = (5 < value) ? true : false",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function foo() { return (null > value); }",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of >.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (-1 < str.indexOf(substr)) {}",
            options: ["never"],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (value == \"red\") {}",
            options: ["always"],
            errors: [
                {
                    message: "Expected literal to be on the left side of ==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (value === true) {}",
            options: ["always"],
            errors: [
                {
                    message: "Expected literal to be on the left side of ===.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (a < 0 && 0 <= b && b < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a && a < 1 && b < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (1 < a && a < 0) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "0 < a && a < 1",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var a = b < 0 || 1 <= b;",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= x && x < -1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var a = (b < 0 && 0 <= b);",
            options: ["always", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the left side of <.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a[b] && a['b'] < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a[b()] && a[b()] < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of <=.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (3 == a) {}",
            options: ["never", { onlyEquality: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of ==.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "foo(3 === a);",
            options: ["never", { onlyEquality: true }],
            errors: [
                {
                    message: "Expected literal to be on the right side of ===.",
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "foo(a === 3);",
            options: ["always", { onlyEquality: true }],
            errors: [
                {
                    message: "Expected literal to be on the left side of ===.",
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
