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
            errors: [{
                messageId: "unexpected",
                data: { operator: "in" },
                suggestions: [
                    {
                        desc: "Negate 'in' expression instead of its left operand. This changes the current behavior.",
                        output: "!(a in b)"
                    },
                    {
                        desc: "Wrap negation in '()' to make the intention explicit. This preserves the current behavior.",
                        output: "(!a) in b"
                    }
                ]
            }]
        },
        {
            code: "(!a in b)",
            errors: [{
                messageId: "unexpected",
                data: { operator: "in" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "(!(a in b))"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "((!a) in b)"
                    }
                ]
            }]
        },
        {
            code: "!(a) in b",
            errors: [{
                messageId: "unexpected",
                data: { operator: "in" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "!((a) in b)"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "(!(a)) in b"
                    }
                ]
            }]
        },
        {
            code: "!a instanceof b",
            errors: [{
                messageId: "unexpected",
                data: { operator: "instanceof" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "!(a instanceof b)"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "(!a) instanceof b"
                    }
                ]
            }]
        },
        {
            code: "(!a instanceof b)",
            errors: [{
                messageId: "unexpected",
                data: { operator: "instanceof" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "(!(a instanceof b))"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "((!a) instanceof b)"
                    }
                ]
            }]
        },
        {
            code: "!(a) instanceof b",
            errors: [{
                messageId: "unexpected",
                data: { operator: "instanceof" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "!((a) instanceof b)"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "(!(a)) instanceof b"
                    }
                ]
            }]
        },
        {
            code: "if (! a < b) {}",
            options: [{ enforceForOrderingRelations: true }],
            errors: [{
                messageId: "unexpected",
                data: { operator: "<" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "if (!( a < b)) {}"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "if ((! a) < b) {}"
                    }
                ]
            }]
        },
        {
            code: "while (! a > b) {}",
            options: [{ enforceForOrderingRelations: true }],
            errors: [{
                messageId: "unexpected",
                data: { operator: ">" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "while (!( a > b)) {}"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "while ((! a) > b) {}"
                    }
                ]
            }]
        },
        {
            code: "foo = ! a <= b;",
            options: [{ enforceForOrderingRelations: true }],
            errors: [{
                messageId: "unexpected",
                data: { operator: "<=" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "foo = !( a <= b);"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "foo = (! a) <= b;"
                    }
                ]
            }]
        },
        {
            code: "foo = ! a >= b;",
            options: [{ enforceForOrderingRelations: true }],
            errors: [{
                messageId: "unexpected",
                data: { operator: ">=" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "foo = !( a >= b);"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "foo = (! a) >= b;"
                    }
                ]
            }]
        },
        {
            code: "! a <= b",
            options: [{ enforceForOrderingRelations: true }],
            errors: [{
                messageId: "unexpected",
                data: { operator: "<=" },
                suggestions: [
                    {
                        messageId: "suggestNegatedExpression",
                        output: "!( a <= b)"
                    },
                    {
                        messageId: "suggestParenthesisedNegation",
                        output: "(! a) <= b"
                    }
                ]
            }]
        }
    ]
});
