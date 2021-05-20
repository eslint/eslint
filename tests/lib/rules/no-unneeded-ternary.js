/**
 * @fileoverview Tests for no-unneeded-ternary rule.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unneeded-ternary"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-unneeded-ternary", rule, {
    valid: [
        "config.newIsCap = config.newIsCap !== false",
        "var a = x === 2 ? 'Yes' : 'No';",
        "var a = x === 2 ? true : 'No';",
        "var a = x === 2 ? 'Yes' : false;",
        "var a = x === 2 ? 'true' : 'false';",
        "var a = foo ? foo : bar;",
        "var value = 'a';var canSet = true;var result = value || (canSet ? 'unset' : 'can not set')",
        "var a = foo ? bar : foo;",
        "foo ? bar : foo;",
        "var a = f(x ? x : 1)",
        "f(x ? x : 1);",
        "foo ? foo : bar;",
        "var a = foo ? 'Yes' : foo;",
        {
            code: "var a = foo ? 'Yes' : foo;",
            options: [{ defaultAssignment: false }]
        },
        {
            code: "var a = foo ? bar : foo;",
            options: [{ defaultAssignment: false }]
        },
        {
            code: "foo ? bar : foo;",
            options: [{ defaultAssignment: false }]
        }
    ],
    invalid: [
        {
            code: "var a = x === 2 ? true : false;",
            output: "var a = x === 2;",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 31
            }]
        },
        {
            code: "var a = x >= 2 ? true : false;",
            output: "var a = x >= 2;",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 30
            }]
        },
        {
            code: "var a = x ? true : false;",
            output: "var a = !!x;",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 25
            }]
        },
        {
            code: "var a = x === 1 ? false : true;",
            output: "var a = x !== 1;",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 31
            }]
        },
        {
            code: "var a = x != 1 ? false : true;",
            output: "var a = x == 1;",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 30
            }]
        },
        {
            code: "var a = foo() ? false : true;",
            output: "var a = !foo();",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 29
            }]
        },
        {
            code: "var a = !foo() ? false : true;",
            output: "var a = !!foo();",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 30
            }]
        },
        {
            code: "var a = foo + bar ? false : true;",
            output: "var a = !(foo + bar);",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 33
            }]
        },
        {
            code: "var a = x instanceof foo ? false : true;",
            output: "var a = !(x instanceof foo);",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 40
            }]
        },
        {
            code: "var a = foo ? false : false;",
            output: "var a = false;",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 28
            }]
        },
        {
            code: "var a = foo() ? false : false;",
            output: null,
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 30
            }]
        },
        {
            code: "var a = x instanceof foo ? true : false;",
            output: "var a = x instanceof foo;",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 40
            }]
        },
        {
            code: "var a = !foo ? true : false;",
            output: "var a = !foo;",
            errors: [{
                messageId: "unnecessaryConditionalExpression",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 28
            }]
        },
        {
            code: `
                var value = 'a'
                var canSet = true
                var result = value ? value : canSet ? 'unset' : 'can not set'
            `,
            output: `
                var value = 'a'
                var canSet = true
                var result = value || (canSet ? 'unset' : 'can not set')
            `,
            options: [{ defaultAssignment: false }],
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 4,
                column: 30,
                endLine: 4,
                endColumn: 78
            }]
        },
        {
            code: "foo ? foo : (bar ? baz : qux)",
            output: "foo || (bar ? baz : qux)",
            options: [{ defaultAssignment: false }],
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 30
            }]
        },
        {
            code: "function* fn() { foo ? foo : yield bar }",
            output: "function* fn() { foo || (yield bar) }",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 18,
                endLine: 1,
                endColumn: 39
            }]
        },
        {
            code: "var a = foo ? foo : 'No';",
            output: "var a = foo || 'No';",
            options: [{ defaultAssignment: false }],
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 25
            }]
        },
        {
            code: "var a = ((foo)) ? (((((foo))))) : ((((((((((((((bar))))))))))))));",
            output: "var a = ((foo)) || ((((((((((((((bar))))))))))))));",
            options: [{ defaultAssignment: false }],
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 66
            }]
        },
        {
            code: "var a = b ? b : c => c;",
            output: "var a = b || (c => c);",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 23
            }]
        },
        {
            code: "var a = b ? b : c = 0;",
            output: "var a = b || (c = 0);",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 22
            }]
        },
        {
            code: "var a = b ? b : (c => c);",
            output: "var a = b || (c => c);",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 25
            }]
        },
        {
            code: "var a = b ? b : (c = 0);",
            output: "var a = b || (c = 0);",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "var a = b ? b : (c) => (c);",
            output: "var a = b || ((c) => (c));",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 27
            }]
        },
        {
            code: "var a = b ? b : c, d; // this is ((b ? b : c), (d))",
            output: "var a = b || c, d; // this is ((b ? b : c), (d))",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 18
            }]
        },
        {
            code: "var a = b ? b : (c, d);",
            output: "var a = b || (c, d);",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 23
            }]
        },
        {
            code: "f(x ? x : 1);",
            output: "f(x || 1);",
            options: [{ defaultAssignment: false }],
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 3,
                endLine: 1,
                endColumn: 12
            }]
        },
        {
            code: "x ? x : 1;",
            output: "x || 1;",
            options: [{ defaultAssignment: false }],
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 10
            }]
        },
        {
            code: "var a = foo ? foo : bar;",
            output: "var a = foo || bar;",
            options: [{ defaultAssignment: false }],
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "var a = foo ? foo : a ?? b;",
            output: "var a = foo || (a ?? b);",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "unnecessaryConditionalAssignment",
                type: "ConditionalExpression",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 27
            }]
        }
    ]
});
