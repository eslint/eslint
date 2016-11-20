/**
 * @fileoverview Tests for arrow-parens
 * @author Jxck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    rule = require("../../../lib/rules/arrow-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the path to the specified parser.
 *
 * @param {string} name - The parser name to get.
 * @returns {string} The path to the specified parser.
 */
function parser(name) {
    return path.resolve(__dirname, `../../fixtures/parsers/arrow-parens/${name}.js`);
}

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
    { code: "a.then(async (foo) => { if (true) {}; });", parserOptions: { ecmaVersion: 8 } },

    // "always" (explicit)
    { code: "() => {}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => {}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => a", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a) => {\n}", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "a.then((foo) => {});", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "a.then((foo) => { if (true) {}; });", options: ["always"], parserOptions: { ecmaVersion: 6 } },
    { code: "a.then(async (foo) => { if (true) {}; });", options: ["always"], parserOptions: { ecmaVersion: 8 } },

    // "as-needed"
    { code: "() => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "a => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "a => a", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "([a, b]) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "({ a, b }) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a = 10) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(...a) => a[0]", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "(a, b) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
    { code: "async ([a, b]) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 8 } },
    { code: "async (a, b) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 8 } },
    { code: "(a: T) => a", options: ["as-needed"], parserOptions: { ecmaVersion: 6 }, parser: parser("identifer-type") },
    { code: "(a): T => a", options: ["as-needed"], parserOptions: { ecmaVersion: 6 }, parser: parser("return-type") },

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
    { code: "a => ({})", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 } },
    { code: "async a => ({})", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 8 } },
    { code: "async a => a", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 8 } },
    { code: "(a: T) => a", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 }, parser: parser("identifer-type") },
    { code: "(a): T => a", options: ["as-needed", {requireForBlockBody: true}], parserOptions: { ecmaVersion: 6 }, parser: parser("return-type") },
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
    {
        code: "a(async foo => { if (true) {}; });",
        output: "a(async (foo) => { if (true) {}; });",
        parserOptions: { ecmaVersion: 8 },
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
    {
        code: "async (a) => a",
        output: "async a => a",
        options: ["as-needed"],
        parserOptions: { ecmaVersion: 8 },
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
    },
    {
        code: "async a => {}",
        output: "async (a) => {}",
        options: ["as-needed", {requireForBlockBody: true}],
        parserOptions: { ecmaVersion: 8 },
        errors: [{
            line: 1,
            column: 1,
            message: requireForBlockBodyNoParensMessage,
            type
        }]
    },
    {
        code: "async (a) => a",
        output: "async a => a",
        options: ["as-needed", {requireForBlockBody: true}],
        parserOptions: { ecmaVersion: 8 },
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
