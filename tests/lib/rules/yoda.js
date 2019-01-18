/**
 * @fileoverview Tests for yoda rule.
 * @author Raphael Pigulla
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/yoda"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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
        }, {
            code: "if (0 <= index && index < list.length) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (ZERO <= index && index < 100) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (value <= MIN || 10 < value) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (value <= 0 || MAX < value) {}",
            options: ["never", { exceptRange: true }]
        }, {
            code: "if (0 <= a.b && a[\"b\"] <= 100) {}",
            options: ["never", { exceptRange: true }]
        },

        // onlyEquality
        { code: "if (0 < x && x <= 1) {}", options: ["never", { onlyEquality: true }] },
        { code: "if (x !== 'foo' && 'foo' !== x) {}", options: ["never", { onlyEquality: true }] },
        { code: "if (x < 2 && x !== -3) {}", options: ["always", { onlyEquality: true }] }
    ],
    invalid: [

        {
            code: "if (\"red\" == value) {}",
            output: "if (value == \"red\") {}",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "==" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true === value) {}",
            output: "if (value === true) {}",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (5 != value) {}",
            output: "if (value != 5) {}",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "!=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (null !== value) {}",
            output: "if (value !== null) {}",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "!==" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (\"red\" <= value) {}",
            output: "if (value >= \"red\") {}",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (true >= value) {}",
            output: "if (value <= true) {}",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: ">=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var foo = (5 < value) ? true : false",
            output: "var foo = (value > 5) ? true : false",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function foo() { return (null > value); }",
            output: "function foo() { return (value < null); }",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: ">" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (-1 < str.indexOf(substr)) {}",
            output: "if (str.indexOf(substr) > -1) {}",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (value == \"red\") {}",
            output: "if (\"red\" == value) {}",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "==" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (value === true) {}",
            output: "if (true === value) {}",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (a < 0 && 0 <= b && b < 1) {}",
            output: "if (a < 0 && b >= 0 && b < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a && a < 1 && b < 1) {}",
            output: "if (a >= 0 && a < 1 && b < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (1 < a && a < 0) {}",
            output: "if (a > 1 && a < 0) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "0 < a && a < 1",
            output: "a > 0 && a < 1",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var a = b < 0 || 1 <= b;",
            output: "var a = b < 0 || b >= 1;",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= x && x < -1) {}",
            output: "if (x >= 0 && x < -1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "var a = (b < 0 && 0 <= b);",
            output: "var a = (0 > b && 0 <= b);",
            options: ["always", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a[b] && a['b'] < 1) {}",
            output: "if (a[b] >= 0 && a['b'] < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a[b] && a.b < 1) {}",
            output: "if (a[b] >= 0 && a.b < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a[b()] && a[b()] < 1) {}",
            output: "if (a[b()] >= 0 && a[b()] < 1) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (3 == a) {}",
            output: "if (a == 3) {}",
            options: ["never", { onlyEquality: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "==" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "foo(3 === a);",
            output: "foo(a === 3);",
            options: ["never", { onlyEquality: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "foo(a === 3);",
            output: "foo(3 === a);",
            options: ["always", { onlyEquality: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= x && x < 1) {}",
            output: "if (x >= 0 && x < 1) {}",
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if ( /* a */ 0 /* b */ < /* c */ foo /* d */ ) {}",
            output: "if ( /* a */ foo /* b */ > /* c */ 0 /* d */ ) {}",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if ( /* a */ foo /* b */ > /* c */ 0 /* d */ ) {}",
            output: "if ( /* a */ 0 /* b */ < /* c */ foo /* d */ ) {}",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: ">" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (foo()===1) {}",
            output: "if (1===foo()) {}",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (foo()     === 1) {}",
            output: "if (1     === foo()) {}",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/7326
        {
            code: "while (0 === (a));",
            output: "while ((a) === 0);",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "while (0 === (a = b));",
            output: "while ((a = b) === 0);",
            options: ["never"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "while ((a) === 0);",
            output: "while (0 === (a));",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "while ((a = b) === 0);",
            output: "while (0 === (a = b));",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (((((((((((foo)))))))))) === ((((((5)))))));",
            output: "if (((((((5)))))) === ((((((((((foo)))))))))));",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        }
    ]
});
