/**
 * @fileoverview Disallow unreachable expressions within nested ternary operators
 * @author Che Fisher
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unreachable-ternary"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-unreachable-ternary", rule, {

    valid: [
        "!user.isMember ? user.isFounder ? 'Founder' : 'Member' : 'Guest';",
        "user.isMember ? !user.isFounder ? x : y : z;",
        "condition1 ? foo() : condition2 ? bar() : condition3 ? baz() : condition4 ? qux() : bar();",
        "condition3 || condition1 ? 2.00 : condition1 || condition2 ? 3.00 : 4.00;",
        "condition3 || condition2 ? 2.00 : condition1 || condition2 || condition3 ? 3.00 : 4.00;",
        "condition1 && condition2 ? condition3 ? condition4 && condition5 ? w : x : y : z;",
        "foo(x) ? bar(x) ? 1 : 2 : 3",
        "condition1 || condition2 ? 2.00 : condition1 && condition2 ? 3.00 : 4.00;",
        "condition1 || condition2 ? !condition1 ? x : y : z;",
        { code: "const getFee = (user) => user.isMember ? 3.00 : user.isFounder ? 2.00 : 4.00;", parserOptions: { ecmaVersion: 6 } },
        { code: "const getFee = (user) => user.isMember ? 3.00 : !user.isFounder ? 2.00 : 4.00;", parserOptions: { ecmaVersion: 6 } },
        { code: "condition3 || condition1 ? condition1 && condition2 ? condition1 || condition2 ? w : x : y : z;", options: [{ allowDuplicateOrConditions: true }] },
        { code: "condition3 || condition2 || condition1 ? x : condition1 || condition4 ? y : z;", options: [{ allowDuplicateOrConditions: true }] }
    ],

    invalid: [
        {
            code: "user.isMember ? user.isMember ? 'Founder' : 'Member' : 'Guest';",
            errors: [{
                messageId: "duplicateCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "!user.isMember ? !!user.isMember ? x : y : z;",
            errors: [{
                messageId: "duplicateInvertedCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "user.isMember ? !user.isMember ? x : y : z;",
            errors: [{
                messageId: "duplicateInvertedCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition1 ? foo() : condition2 ? bar() : condition3 ? baz() : condition1 ? qux() : bar();",
            errors: [{
                messageId: "duplicateCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition1 && condition2 ? condition2 ? 2.00 : 3.00 : 4.00;",
            errors: [{
                messageId: "duplicateCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition1 && !((condition2)) && (((condition3))) ? 2.00 : condition2 ? 3.00 : 4.00;",
            errors: [{
                messageId: "duplicateInvertedCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition1 || condition2 ? 2.00 : condition2 || condition1 ? 3.00 : 4.00;",
            errors: [{
                messageId: "equivalentOrCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition3 || condition2 || condition1 ? 2.00 : condition1 || condition3 ? 3.00 : 4.00;",
            errors: [{
                messageId: "equivalentOrCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition3 || condition2 || condition1 ? 2.00 : condition1 ? 3.00 : 4.00;",
            errors: [{
                messageId: "equivalentOrCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition1 && condition2 ? condition3 ? condition4 && condition2 ? w : x : y : z;",
            errors: [{
                messageId: "duplicateCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "foo(x) ? foo(x) ? 1 : 2 : 3",
            errors: [{
                messageId: "duplicateCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "foo(x) ? (!(foo(x))) ? 1 : 2 : 3",
            errors: [{
                messageId: "duplicateInvertedCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "const thing = condition1 || condition2 ? condition2 ? 'x' : 'y' : 'z';",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "equivalentOrCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "const getFee = (user) => !(user.isMember) ? 3.00 : (user.isMember) ? 2.00 : 4.00;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "duplicateInvertedCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition3 || condition2 || condition1 ? x : condition1 || condition4 ? y : z;",
            options: [{ allowDuplicateOrConditions: false }],
            errors: [{
                messageId: "duplicateOrCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition3 || condition1 ? condition1 && condition2 ? condition1 || condition2 ? w : x : y : z;",
            options: [{ allowDuplicateOrConditions: false }],
            errors: [{
                messageId: "duplicateOrCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition3 || !condition1 ? !condition1 ? x : y : z;",
            options: [{ allowDuplicateOrConditions: false }],
            errors: [{
                messageId: "equivalentOrCondition",
                type: "ConditionalExpression"
            }]
        },
        {
            code: "condition3 || condition2 || condition1 ? x : condition5 || condition2 ? condition3 ? w: y : z;",
            options: [{ allowDuplicateOrConditions: false }],
            errors: [
                {
                    messageId: "duplicateOrCondition",
                    type: "ConditionalExpression"
                },
                {
                    messageId: "equivalentOrCondition",
                    type: "ConditionalExpression"
                }
            ]
        }
    ]
});
