/**
 * @fileoverview Tests for yoda rule.
 * @author Raphael Pigulla
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/yoda"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("yoda", rule, {
    valid: [

        // "never" mode
        { code: 'if (value === "red") {}', options: ["never"] },
        { code: "if (value === value) {}", options: ["never"] },
        { code: "if (value != 5) {}", options: ["never"] },
        { code: "if (5 & foo) {}", options: ["never"] },
        { code: "if (5 === 4) {}", options: ["never"] },
        {
            code: "if (value === `red`) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (`red` === `red`) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (`${foo}` === `red`) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: 'if (`${""}` === `red`) {}',
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: 'if (`${"red"}` === foo) {}',
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (b > `a` && b > `a`) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: 'if (`b` > `a` && "b" > "a") {}',
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 }
        },

        // "always" mode
        { code: 'if ("blue" === value) {}', options: ["always"] },
        { code: "if (value === value) {}", options: ["always"] },
        { code: "if (4 != value) {}", options: ["always"] },
        { code: "if (foo & 4) {}", options: ["always"] },
        { code: "if (5 === 4) {}", options: ["always"] },
        {
            code: "if (`red` === value) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (`red` === `red`) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (`red` === `${foo}`) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: 'if (`red` === `${""}`) {}',
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: 'if (foo === `${"red"}`) {}',
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (`a` > b && `a` > b) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: 'if (`b` > `a` && "b" > "a") {}',
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 }
        },

        // Range exception
        {
            code: 'if ("a" < x && x < MAX ) {}',
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (1 < x && x < MAX ) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if ('a' < x && x < MAX ) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (x < `x` || `x` <= x) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (0 < x && x <= 1) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (0 <= x && x < 1) {}",
            options: ["always", { exceptRange: true }]
        },
        {
            code: "if ('blue' < x.y && x.y < 'green') {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (0 < x[``] && x[``] < 100) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (0 < x[''] && x[``] < 100) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code:
                "if (a < 4 || (b[c[0]].d['e'] < 0 || 1 <= b[c[0]].d['e'])) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (0 <= x['y'] && x['y'] <= 100) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (a < 0 && (0 < b && b < 1)) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if ((0 < a && a < 1) && b < 0) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (-1 < x && x < 0) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (0 <= this.prop && this.prop <= 1) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (0 <= index && index < list.length) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (ZERO <= index && index < 100) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (value <= MIN || 10 < value) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (value <= 0 || MAX < value) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: 'if (0 <= a.b && a["b"] <= 100) {}',
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (0 <= a.b && a[`b`] <= 100) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (-1n < x && x <= 1n) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if (-1n <= x && x < 1n) {}",
            options: ["always", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if (x < `1` || `1` < x) {}",
            options: ["always", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if (1 <= a['/(?<zero>0)/'] && a[/(?<zero>0)/] <= 100) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "if (x <= `bar` || `foo` < x) {}",
            options: ["always", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if ('a' < x && x < MAX ) {}",
            options: ["always", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if ('a' < x && x < MAX ) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (MIN < x && x < 'a' ) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (MIN < x && x < 'a' ) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (`blue` < x.y && x.y < `green`) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (0 <= x[`y`] && x[`y`] <= 100) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: 'if (0 <= x[`y`] && x["y"] <= 100) {}',
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if ('a' <= x && x < 'b') {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (x < -1n || 1n <= x) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if (x < -1n || 1n <= x) {}",
            options: ["always", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "if (1 < a && a <= 2) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (x < -1 || 1 < x) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (x <= 'bar' || 'foo' < x) {}",
            options: ["always", { exceptRange: true }]
        },
        {
            code: "if (x < 0 || 1 <= x) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if('a' <= x && x < MAX) {}",
            options: ["never", { exceptRange: true }]
        },
        {
            code: "if (0 <= obj?.a && obj?.a < 1) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2020 }
        },

        // onlyEquality
        {
            code: "if (0 < x && x <= 1) {}",
            options: ["never", { onlyEquality: true }]
        },
        {
            code: "if (x !== 'foo' && 'foo' !== x) {}",
            options: ["never", { onlyEquality: true }]
        },
        {
            code: "if (x < 2 && x !== -3) {}",
            options: ["always", { onlyEquality: true }]
        },
        {
            code: "if (x !== `foo` && `foo` !== x) {}",
            options: ["never", { onlyEquality: true }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (x < `2` && x !== `-3`) {}",
            options: ["always", { onlyEquality: true }],
            parserOptions: { ecmaVersion: 2015 }
        }
    ],
    invalid: [
        {
            code: "if (x <= 'foo' || 'bar' < x) {}",
            output: "if ('foo' >= x || 'bar' < x) {}",
            options: ["always", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: 'if ("red" == value) {}',
            output: 'if (value == "red") {}',
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
            code: "if (5n != value) {}",
            output: "if (value != 5n) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 },
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
            code: 'if ("red" <= value) {}',
            output: 'if (value >= "red") {}',
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
            code: "if (`red` <= value) {}",
            output: "if (value >= `red`) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (`red` <= `${foo}`) {}",
            output: "if (`${foo}` >= `red`) {}",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: 'if (`red` <= `${"red"}`) {}',
            output: 'if (`${"red"}` >= `red`) {}',
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
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
            code: 'if (value == "red") {}',
            output: 'if ("red" == value) {}',
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
            code: "if (value == `red`) {}",
            output: "if (`red` == value) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 },
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
            code: "if (value === 5n) {}",
            output: "if (5n === value) {}",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "===" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: 'if (`${"red"}` <= `red`) {}',
            output: 'if (`red` >= `${"red"}`) {}',
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<=" },
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
            code: "var a = (b < `0` && `0` <= b);",
            output: "var a = (`0` > b && `0` <= b);",
            options: ["always", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (`green` < x.y && x.y < `blue`) {}",
            output: "if (x.y > `green` && x.y < `blue`) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
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
            code: "if (0 <= a[b] && a[`b`] < 1) {}",
            output: "if (a[b] >= 0 && a[`b`] < 1) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (`0` <= a[b] && a[`b`] < `1`) {}",
            output: "if (a[b] >= `0` && a[`b`] < `1`) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 },
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
            code: "if (0 <= a[''] && a.b < 1) {}",
            output: "if (a[''] >= 0 && a.b < 1) {}",
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
            code: "if (0 <= a[''] && a[' '] < 1) {}",
            output: "if (a[''] >= 0 && a[' '] < 1) {}",
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
            code: "if (0 <= a[''] && a[null] < 1) {}",
            output: "if (a[''] >= 0 && a[null] < 1) {}",
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
            code: "if (0 <= a[``] && a[null] < 1) {}",
            output: "if (a[``] >= 0 && a[null] < 1) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if (0 <= a[''] && a[b] < 1) {}",
            output: "if (a[''] >= 0 && a[b] < 1) {}",
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
            code: "if (0 <= a[''] && a[b()] < 1) {}",
            output: "if (a[''] >= 0 && a[b()] < 1) {}",
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
            code: "if (0 <= a[``] && a[b()] < 1) {}",
            output: "if (a[``] >= 0 && a[b()] < 1) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 },
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
            code: "if (0 <= a.null && a[/(?<zero>0)/] <= 1) {}",
            output: "if (a.null >= 0 && a[/(?<zero>0)/] <= 1) {}",
            options: ["never", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2018 },
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
            code: "foo(a === `3`);",
            output: "foo(`3` === a);",
            options: ["always", { onlyEquality: true }],
            parserOptions: { ecmaVersion: 2015 },
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
        },

        // Adjacent tokens tests
        {
            code: "function *foo() { yield(1) < a }",
            output: "function *foo() { yield a > (1) }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield((1)) < a }",
            output: "function *foo() { yield a > ((1)) }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield 1 < a }",
            output: "function *foo() { yield a > 1 }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield/**/1 < a }",
            output: "function *foo() { yield/**/a > 1 }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield(1) < ++a }",
            output: "function *foo() { yield++a > (1) }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield(1) < (a) }",
            output: "function *foo() { yield(a) > (1) }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "x=1 < a",
            output: "x=a > 1",
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
            code: "function *foo() { yield++a < 1 }",
            output: "function *foo() { yield 1 > ++a }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield(a) < 1 }",
            output: "function *foo() { yield 1 > (a) }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield a < 1 }",
            output: "function *foo() { yield 1 > a }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield/**/a < 1 }",
            output: "function *foo() { yield/**/1 > a }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield++a < (1) }",
            output: "function *foo() { yield(1) > ++a }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "x=a < 1",
            output: "x=1 > a",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "0 < f()in obj",
            output: "f() > 0 in obj",
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "1 > x++instanceof foo",
            output: "x++ < 1 instanceof foo",
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
            code: "x < ('foo')in bar",
            output: "('foo') > x in bar",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "false <= ((x))in foo",
            output: "((x)) >= false in foo",
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
            code: "x >= (1)instanceof foo",
            output: "(1) <= x instanceof foo",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: ">=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "false <= ((x)) in foo",
            output: "((x)) >= false in foo",
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
            code: "x >= 1 instanceof foo",
            output: "1 <= x instanceof foo",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: ">=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "x >= 1/**/instanceof foo",
            output: "1 <= x/**/instanceof foo",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: ">=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "(x >= 1)instanceof foo",
            output: "(1 <= x)instanceof foo",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: ">=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "(x) >= (1)instanceof foo",
            output: "(1) <= (x)instanceof foo",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: ">=" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "1 > x===foo",
            output: "x < 1===foo",
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
            code: "1 > x",
            output: "x < 1",
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
            code: "if (`green` < x.y && x.y < `blue`) {}",
            output: "if (`green` < x.y && `blue` > x.y) {}",
            options: ["always", { exceptRange: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if('a' <= x && x < 'b') {}",
            output: "if('a' <= x && 'b' > x) {}",
            options: ["always"],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "left", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        },
        {
            code: "if ('b' <= x && x < 'a') {}",
            output: "if (x >= 'b' && x < 'a') {}",
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
            code: "if('a' <= x && x < 1) {}",
            output: "if(x >= 'a' && x < 1) {}",
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
            code: "if (0 < a && b < max) {}",
            output: "if (a > 0 && b < max) {}",
            options: ["never", { exceptRange: true }],
            errors: [
                {
                    messageId: "expected",
                    data: { expectedSide: "right", operator: "<" },
                    type: "BinaryExpression"
                }
            ]
        }
    ]
});
