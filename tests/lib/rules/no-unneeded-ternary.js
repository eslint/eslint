/**
 * @fileoverview Tests for no-unneeded-ternary rule.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unneeded-ternary"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
        {
            code: "var a = foo ? 'Yes' : foo;",
            options: [{ defaultAssignment: false }]
        },
        {
            code: "var a = foo ? bar : foo;",
            options: [{ defaultAssignment: false }]
        }
    ],
    invalid: [
        {
            code: "var a = x === 2 ? true : false;",
            output: "var a = x === 2;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "var a = x >= 2 ? true : false;",
            output: "var a = x >= 2;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 18
            }]
        },
        {
            code: "var a = x ? true : false;",
            output: "var a = !!x;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 13
            }]
        },
        {
            code: "var a = x === 1 ? false : true;",
            output: "var a = x !== 1;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "var a = x != 1 ? false : true;",
            output: "var a = x == 1;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 18
            }]
        },
        {
            code: "var a = foo() ? false : true;",
            output: "var a = !foo();",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 17
            }]
        },
        {
            code: "var a = !foo() ? false : true;",
            output: "var a = !!foo();",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 18
            }]
        },
        {
            code: "var a = foo + bar ? false : true;",
            output: "var a = !(foo + bar);",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 21
            }]
        },
        {
            code: "var a = x instanceof foo ? false : true;",
            output: "var a = !(x instanceof foo);",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 28
            }]
        },
        {
            code: "var a = foo ? false : false;",
            output: "var a = false;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 15
            }]
        },
        {
            code: "var a = foo() ? false : false;",
            output: null,
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 17
            }]
        },
        {
            code: "var a = x instanceof foo ? true : false;",
            output: "var a = x instanceof foo;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 28
            }]
        },
        {
            code: "var a = !foo ? true : false;",
            output: "var a = !foo;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression.",
                type: "ConditionalExpression",
                line: 1,
                column: 16
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
                message: "Unnecessary use of conditional expression for default assignment.",
                type: "ConditionalExpression",
                line: 4,
                column: 38
            }]
        },
        {
            code: "foo ? foo : (bar ? baz : qux)",
            output: "foo || (bar ? baz : qux)",
            options: [{ defaultAssignment: false }],
            errors: [{
                message: "Unnecessary use of conditional expression for default assignment.",
                type: "ConditionalExpression",
                line: 1,
                column: 7
            }]
        },
        {
            code: "function* fn() { foo ? foo : yield bar }",
            output: "function* fn() { foo || (yield bar) }",
            options: [{ defaultAssignment: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unnecessary use of conditional expression for default assignment.",
                type: "ConditionalExpression",
                line: 1,
                column: 24
            }]
        },
        {
            code: "var a = foo ? foo : 'No';",
            output: "var a = foo || 'No';",
            options: [{ defaultAssignment: false }],
            errors: [{
                message: "Unnecessary use of conditional expression for default assignment.",
                type: "ConditionalExpression",
                line: 1,
                column: 15
            }]
        },
        {
            code: "var a = ((foo)) ? (((((foo))))) : ((((((((((((((bar))))))))))))));",
            output: "var a = ((foo)) || ((((((((((((((bar))))))))))))));",
            options: [{ defaultAssignment: false }],
            errors: [{
                message: "Unnecessary use of conditional expression for default assignment.",
                type: "ConditionalExpression",
                line: 1,
                column: 24
            }]
        }
    ]
});
