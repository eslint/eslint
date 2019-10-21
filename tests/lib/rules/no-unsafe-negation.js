/**
 * @fileoverview Tests for no-unsafe-negation rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unsafe-negation"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const unexpectedInError = { messageId: "unexpected", data: { operator: "in" } };
const unexpectedInstanceofError = {
    messageId: "unexpected",
    data: { operator: "instanceof" }
};
const unexpectedLessThanOperatorError = {
    messageId: "unexpected",
    data: { operator: "<" }
};
const unexpectedMoreThanOperatorError = {
    messageId: "unexpected",
    data: { operator: ">" }
};
const unexpectedMoreThanOrEqualOperatorError = {
    messageId: "unexpected",
    data: { operator: ">=" }
};
const unexpectedLessThanOrEqualOperatorError = {
    messageId: "unexpected",
    data: { operator: "<=" }
};

ruleTester.run("no-unsafe-negation", rule, {
    valid: [
        "a in b",
        "a in b === false",
        "!(a in b)",
        "(!a) in b",
        "a instanceof b",
        "a instanceof b === false",
        "!(a instanceof b)",
        "(!a) instanceof b",

        // tests cases for enforceForOrderingRelations option:
        "if (! a < b) {}",
        "while (! a > b) {}",
        "foo = ! a <= b;",
        "foo = ! a >= b;",
        {
            code: "! a <= b",
            options: [{}]
        },
        {
            code: "foo = ! a >= b;",
            options: [{ enforceForOrderingRelations: false }]
        },
        {
            code: "foo = (!a) >= b;",
            options: [{ enforceForOrderingRelations: true }]
        },
        {
            code: "a <= b",
            options: [{ enforceForOrderingRelations: true }]
        },
        {
            code: "!(a < b)",
            options: [{ enforceForOrderingRelations: true }]
        },
        {
            code: "foo = a > b;",
            options: [{ enforceForOrderingRelations: true }]
        }
    ],
    invalid: [
        {
            code: "!a in b",
            errors: [unexpectedInError]
        },
        {
            code: "(!a in b)",
            errors: [unexpectedInError]
        },
        {
            code: "!(a) in b",
            errors: [unexpectedInError]
        },
        {
            code: "!a instanceof b",
            errors: [unexpectedInstanceofError]
        },
        {
            code: "(!a instanceof b)",
            errors: [unexpectedInstanceofError]
        },
        {
            code: "!(a) instanceof b",
            errors: [unexpectedInstanceofError]
        },
        {
            code: "if (! a < b) {}",
            options: [{ enforceForOrderingRelations: true }],
            errors: [unexpectedLessThanOperatorError]
        },
        {
            code: "while (! a > b) {}",
            options: [{ enforceForOrderingRelations: true }],
            errors: [unexpectedMoreThanOperatorError]
        },
        {
            code: "foo = ! a <= b;",
            options: [{ enforceForOrderingRelations: true }],
            errors: [unexpectedLessThanOrEqualOperatorError]
        },
        {
            code: "foo = ! a >= b;",
            options: [{ enforceForOrderingRelations: true }],
            errors: [unexpectedMoreThanOrEqualOperatorError]
        },
        {
            code: "! a <= b",
            options: [{ enforceForOrderingRelations: true }],
            errors: [unexpectedLessThanOrEqualOperatorError]
        }
    ]
});
