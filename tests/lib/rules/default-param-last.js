/**
 * @fileoverview Test file for default-param-last
 * @author Chiawen Chen
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/default-param-last");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const SHOULD_BE_LAST = "shouldBeLast";

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 8 }
});

const cannedError = {
    messageId: SHOULD_BE_LAST,
    type: "AssignmentPattern"
};

ruleTester.run("default-param-last", rule, {
    valid: [
        "function f() {}",
        "function f(a) {}",
        "function f(a = 5) {}",
        "function f(a, b) {}",
        "function f(a, b = 5) {}",
        "function f(a, b = 5, c = 5) {}",
        "function f(a, b = 5, ...c) {}",
        "const f = () => {}",
        "const f = (a) => {}",
        "const f = (a = 5) => {}",
        "const f = function f() {}",
        "const f = function f(a) {}",
        "const f = function f(a = 5) {}"
    ],
    invalid: [
        {
            code: "function f(a = 5, b) {}",
            errors: [
                {
                    messageId: SHOULD_BE_LAST,
                    column: 12,
                    endColumn: 17
                }
            ]
        },
        {
            code: "function f(a = 5, b = 6, c) {}",
            errors: [
                {
                    messageId: SHOULD_BE_LAST,
                    column: 12,
                    endColumn: 17
                },
                {
                    messageId: SHOULD_BE_LAST,
                    column: 19,
                    endColumn: 24
                }
            ]
        },
        {
            code: "function f (a = 5, b, c = 6, d) {}",
            errors: [cannedError, cannedError]
        },
        {
            code: "function f(a = 5, b, c = 5) {}",
            errors: [
                {
                    messageId: SHOULD_BE_LAST,
                    column: 12,
                    endColumn: 17
                }
            ]
        },
        {
            code: "const f = (a = 5, b, ...c) => {}",
            errors: [cannedError]
        },
        {
            code: "const f = function f (a, b = 5, c) {}",
            errors: [cannedError]
        },
        {
            code: "const f = (a = 5, { b }) => {}",
            errors: [cannedError]
        },
        {
            code: "const f = ({ a } = {}, b) => {}",
            errors: [cannedError]
        },
        {
            code: "const f = ({ a, b } = { a: 1, b: 2 }, c) => {}",
            errors: [cannedError]
        },
        {
            code: "const f = ([a] = [], b) => {}",
            errors: [cannedError]
        },
        {
            code: "const f = ([a, b] = [1, 2], c) => {}",
            errors: [cannedError]
        }
    ]
});
