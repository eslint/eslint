/**
 * @fileoverview Tests for no-unneeded-ternary rule.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unneeded-ternary"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
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
            options: [{defaultAssignment: false}]
        },
        {
            code: "var a = foo ? bar : foo;",
            options: [{defaultAssignment: false}]
        }
    ],
    invalid: [
        {
            code: "var a = x === 2 ? true : false;",
            errors: [{
                message: "Unnecessary use of boolean literals in conditional expression",
                type: "ConditionalExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "var a = foo ? foo : 'No';",
            options: [{defaultAssignment: false}],
            errors: [{
                message: "Unnecessary use of conditional expression for default assignment",
                type: "ConditionalExpression",
                line: 1,
                column: 15
            }]
        }
    ]
});
