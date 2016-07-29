/**
 * @fileoverview Tests for arrow-parens
 * @author Jxck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/arrow-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
let ruleTester = new RuleTester();

let valid = [
    { code: "() => {}", parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => {}", parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => a", parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => {\n}", parserOptions: { ecmaVersion: 6 } },
    { code: "a.then((foo) => {});", parserOptions: { ecmaVersion: 6 } },
    { code: "a.then((foo) => { if (true) {}; });", parserOptions: { ecmaVersion: 6 } },

    // as-needed
    { code: "() => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "a => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "a => a", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "([a, b]) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "({ a, b }) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a = 10) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(...a) => a[0]", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a, b) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } }

];

let message = "Expected parentheses around arrow function argument.";
let asNeededMessage = "Unexpected parentheses around single function argument";
let type = "ArrowFunctionExpression";

let invalid = [
    {
        code: "a => {}",
        output: "(a) => {}",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message: message,
            type: type
        }]
    },
    {
        code: "a => a",
        output: "(a) => a",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message: message,
            type: type
        }]
    },
    {
        code: "a => {\n}",
        output: "(a) => {\n}",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message: message,
            type: type
        }]
    },
    {
        code: "a.then(foo => {});",
        output: "a.then((foo) => {});",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 8,
            message: message,
            type: type
        }]
    },
    {
        code: "a.then(foo => a);",
        output: "a.then((foo) => a);",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 8,
            message: message,
            type: type
        }]
    },
    {
        code: "a(foo => { if (true) {}; });",
        output: "a((foo) => { if (true) {}; });",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 3,
            message: message,
            type: type
        }]
    },

    // as-needed
    {
        code: "(a) => a",
        output: "a => a",
        options: ["as-needed"],
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message: asNeededMessage,
            type: type
        }]
    },
    {
        code: "(b) => b",
        output: "b => b",
        options: ["as-needed"],
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message: asNeededMessage,
            type: type
        }]
    }

];

ruleTester.run("arrow-parens", rule, {
    valid: valid,
    invalid: invalid
});
