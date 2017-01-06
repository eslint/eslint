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
            output: "var a = foo() ? false : false;",
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
