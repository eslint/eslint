/**
 * @fileoverview Disallow duplicate left and right hand ternary expressions
 * @author Che Fisher
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-dupe-ternary-expressions"),
    { RuleTester } = require("../../../lib/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-dupe-ternary-expressions", rule, {

    valid: [
        "isMember ? 2.00 : 3.00;",
        "formula = condition && condition1 ? User.months * currentRate - User.fee : User.months * oldRate - User.fee",
        "thing === otherThing\n  ? User.a && myBoolean\n  : User.b && myBoolean",
        "condition1 ? foo() : condition2 ? bar() : condition3 ? baz() : qux()",
        "5 < 7 ? (5 < 6 ? true : false) : false"
    ],

    invalid: [
        {
            code: "isMember ? 2.00 : 2.00",
            errors: [{
                messageId: "duplicateExpression",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "formula = condition && condition1 ? User.months * oldRate - User.fee : User.months * oldRate - User.fee",
            errors: [{
                messageId: "duplicateExpression",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "thing === otherThing\n  ? User.a && myBoolean\n  : User.a && myBoolean",
            errors: [{
                messageId: "duplicateExpression",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition1 ? foo() : condition2 ? bar() : condition3 ? baz(true) : baz(true)",
            errors: [{
                messageId: "duplicateExpression",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "5 < 7 ? (5 < 6 ? false : false) : true",
            errors: [{
                messageId: "duplicateExpression",
                type: "ConditionalExpression"
            }]
        }
    ]
});
