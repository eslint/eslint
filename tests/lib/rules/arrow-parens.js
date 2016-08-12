/**
 * @fileoverview Tests for arrow-parens
 * @author Jxck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/arrow-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester();

const valid = [

    // "always" (by default)
    { code: "() => {}", parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => {}", parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => a", parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => {\n}", parserOptions: { ecmaVersion: 6 } },
    { code: "a.then((foo) => {});", parserOptions: { ecmaVersion: 6 } },
    { code: "a.then((foo) => { if (true) {}; });", parserOptions: { ecmaVersion: 6 } },

    // "always" (explicit)
    { code: "() => {}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => {}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => a", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => {\n}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "a.then((foo) => {});", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "a.then((foo) => { if (true) {}; });", options: ["always"], parserOptions: { ecmaVersion: 6 } },

    // "as-needed"
    { code: "() => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "a => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "a => a", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "([a, b]) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "({ a, b }) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a = 10) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(...a) => a[0]", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a, b) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },

    // "as-needed", { "requireForBlockBody": true }
    { code: "() => {}", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "a => a", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "([a, b]) => {}", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "([a, b]) => a", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "({ a, b }) => {}", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "({ a, b }) => a + b", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "(a = 10) => {}", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "(...a) => a[0]", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "(a, b) => {}", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "a => ({})", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } }

];

const message = "Expected parentheses around arrow function argument.";
const asNeededMessage = "Unexpected parentheses around single function argument.";
const requireForBlockBodyMessage = "Unexpected parentheses around single function argument having a body with no curly braces";
const requireForBlockBodyNoParensMessage = "Expected parentheses around arrow function argument having a body with curly braces.";
const type = "ArrowFunctionExpression";

const invalid = [

    // "always" (by default)
    {
        code: "a => {}",
        output: "(a) => {}",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message,
            type
        }]
    },
    {
        code: "a => a",
        output: "(a) => a",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message,
            type
        }]
    },
    {
        code: "a => {\n}",
        output: "(a) => {\n}",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message,
            type
        }]
    },
    {
        code: "a.then(foo => {});",
        output: "a.then((foo) => {});",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 8,
            message,
            type
        }]
    },
    {
        code: "a.then(foo => a);",
        output: "a.then((foo) => a);",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 8,
            message,
            type
        }]
    },
    {
        code: "a(foo => { if (true) {}; });",
        output: "a((foo) => { if (true) {}; });",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 3,
            message,
            type
        }]
    },

    // "as-needed"
    {
        code: "(a) => a",
        output: "a => a",
        options: ["as-needed"],
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message: asNeededMessage,
            type
        }]
    },

    // "as-needed", { "requireForBlockBody": true }
    {
        code: "a => {}",
        output: "(a) => {}",
        options: ["as-needed", {requireForBlockBody: true}],
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message: requireForBlockBodyNoParensMessage,
            type
        }]
    },
    {
        code: "(a) => a",
        output: "a => a",
        options: ["as-needed", {requireForBlockBody: true}],
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 1,
            message: requireForBlockBodyMessage,
            type
        }]
    }
];

ruleTester.run("arrow-parens", rule, {
    valid,
    invalid
});
