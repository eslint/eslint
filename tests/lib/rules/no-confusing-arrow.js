/**
 * @fileoverview Tests for no-confusing-arrow rule.
 * @author Jxck <https://github.com/Jxck>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-confusing-arrow"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-confusing-arrow", rule, {
    valid: [
        "a => { return 1 ? 2 : 3; }",
        { code: "a => { return 1 ? 2 : 3; }", options: [{ allowParens: false }] },

        "var x = a => { return 1 ? 2 : 3; }",
        { code: "var x = a => { return 1 ? 2 : 3; }", options: [{ allowParens: false }] },

        "var x = (a) => { return 1 ? 2 : 3; }",
        { code: "var x = (a) => { return 1 ? 2 : 3; }", options: [{ allowParens: false }] },

        "var x = a => (1 ? 2 : 3)",
        { code: "var x = a => (1 ? 2 : 3)", options: [{ allowParens: true }] },

        "var x = (a,b) => (1 ? 2 : 3)",
        { code: "() => 1 ? 2 : 3", options: [{ onlyOneSimpleParam: true }] },
        { code: "(a, b) => 1 ? 2 : 3", options: [{ onlyOneSimpleParam: true }] },
        { code: "(a = b) => 1 ? 2 : 3", options: [{ onlyOneSimpleParam: true }] },
        { code: "({ a }) => 1 ? 2 : 3", options: [{ onlyOneSimpleParam: true }] },
        { code: "([a]) => 1 ? 2 : 3", options: [{ onlyOneSimpleParam: true }] },
        { code: "(...a) => 1 ? 2 : 3", options: [{ onlyOneSimpleParam: true }] }
    ],
    invalid: [
        {
            code: "a => 1 ? 2 : 3",
            output: "a => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "a => 1 ? 2 : 3",
            output: "a => (1 ? 2 : 3)",
            options: [{ allowParens: true }],
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "a => 1 ? 2 : 3",
            output: null,
            options: [{ allowParens: false }],
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = a => 1 ? 2 : 3",
            output: "var x = a => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = a => 1 ? 2 : 3",
            output: "var x = a => (1 ? 2 : 3)",
            options: [{ allowParens: true }],
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = a => 1 ? 2 : 3",
            output: null,
            options: [{ allowParens: false }],
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = (a) => 1 ? 2 : 3",
            output: "var x = (a) => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = () => 1 ? 2 : 3",
            output: "var x = () => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = () => 1 ? 2 : 3",
            output: "var x = () => (1 ? 2 : 3)",
            options: [{}],
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = () => 1 ? 2 : 3",
            output: "var x = () => (1 ? 2 : 3)",
            options: [{ onlyOneSimpleParam: false }],
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = (a, b) => 1 ? 2 : 3",
            output: "var x = (a, b) => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = (a = b) => 1 ? 2 : 3",
            output: "var x = (a = b) => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = ({ a }) => 1 ? 2 : 3",
            output: "var x = ({ a }) => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = ([a]) => 1 ? 2 : 3",
            output: "var x = ([a]) => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        },
        {
            code: "var x = (...a) => 1 ? 2 : 3",
            output: "var x = (...a) => (1 ? 2 : 3)",
            errors: [{ messageId: "confusing" }]
        }
    ]
});
