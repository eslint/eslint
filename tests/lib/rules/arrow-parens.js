/**
 * @fileoverview Tests for arrow-parens
 * @author Jxck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const baseParser = require("../../fixtures/fixture-parser"),
    rule = require("../../../lib/rules/arrow-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

const parser = baseParser.bind(null, "arrow-parens");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

const valid = [

    // "always" (by default)
    "() => {}",
    "(a) => {}",
    "(a) => a",
    "(a) => {\n}",
    "a.then((foo) => {});",
    "a.then((foo) => { if (true) {}; });",
    { code: "a.then(async (foo) => { if (true) {}; });", parserOptions: { ecmaVersion: 8 } },

    // "always" (explicit)
    { code: "() => {}", options: ["always"] },
    { code: "(a) => {}", options: ["always"] },
    { code: "(a) => a", options: ["always"] },
    { code: "(a) => {\n}", options: ["always"] },
    { code: "a.then((foo) => {});", options: ["always"] },
    { code: "a.then((foo) => { if (true) {}; });", options: ["always"] },
    { code: "a.then(async (foo) => { if (true) {}; });", options: ["always"], parserOptions: { ecmaVersion: 8 } },

    // "as-needed"
    { code: "() => {}", options: ["as-needed"] },
    { code: "a => {}", options: ["as-needed"] },
    { code: "a => a", options: ["as-needed"] },
    { code: "([a, b]) => {}", options: ["as-needed"] },
    { code: "({ a, b }) => {}", options: ["as-needed"] },
    { code: "(a = 10) => {}", options: ["as-needed"] },
    { code: "(...a) => a[0]", options: ["as-needed"] },
    { code: "(a, b) => {}", options: ["as-needed"] },
    { code: "async ([a, b]) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 8 } },
    { code: "async (a, b) => {}", options: ["as-needed"], parserOptions: { ecmaVersion: 8 } },
    { code: "(a: T) => a", options: ["as-needed"], parser: parser("identifer-type") },
    { code: "(a): T => a", options: ["as-needed"], parser: parser("return-type") },

    // "as-needed", { "requireForBlockBody": true }
    { code: "() => {}", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "a => a", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "([a, b]) => {}", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "([a, b]) => a", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "({ a, b }) => {}", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "({ a, b }) => a + b", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "(a = 10) => {}", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "(...a) => a[0]", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "(a, b) => {}", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "a => ({})", options: ["as-needed", { requireForBlockBody: true }] },
    { code: "async a => ({})", options: ["as-needed", { requireForBlockBody: true }], parserOptions: { ecmaVersion: 8 } },
    { code: "async a => a", options: ["as-needed", { requireForBlockBody: true }], parserOptions: { ecmaVersion: 8 } },
    { code: "(a: T) => a", options: ["as-needed", { requireForBlockBody: true }], parser: parser("identifer-type") },
    { code: "(a): T => a", options: ["as-needed", { requireForBlockBody: true }], parser: parser("return-type") }
];

const type = "ArrowFunctionExpression";

const invalid = [

    // "always" (by default)
    {
        code: "a => {}",
        output: "(a) => {}",
        errors: [{
            line: 1,
            column: 1,
            messageId: "expectedParens",
            type
        }]
    },
    {
        code: "a => a",
        output: "(a) => a",
        errors: [{
            line: 1,
            column: 1,
            messageId: "expectedParens",
            type
        }]
    },
    {
        code: "a => {\n}",
        output: "(a) => {\n}",
        errors: [{
            line: 1,
            column: 1,
            messageId: "expectedParens",
            type
        }]
    },
    {
        code: "a.then(foo => {});",
        output: "a.then((foo) => {});",
        errors: [{
            line: 1,
            column: 8,
            messageId: "expectedParens",
            type
        }]
    },
    {
        code: "a.then(foo => a);",
        output: "a.then((foo) => a);",
        errors: [{
            line: 1,
            column: 8,
            messageId: "expectedParens",
            type
        }]
    },
    {
        code: "a(foo => { if (true) {}; });",
        output: "a((foo) => { if (true) {}; });",
        errors: [{
            line: 1,
            column: 3,
            messageId: "expectedParens",
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
            messageId: "expectedParens",
            type
        }]
    },

    // "as-needed"
    {
        code: "(a) => a",
        output: "a => a",
        options: ["as-needed"],
        errors: [{
            line: 1,
            column: 1,
            messageId: "unexpectedParens",
            type
        }]
    },
    {
        code: "(a,) => a",
        output: "a => a",
        options: ["as-needed"],
        parserOptions: { ecmaVersion: 8 },
        errors: [{
            line: 1,
            column: 1,
            messageId: "unexpectedParens",
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
            messageId: "unexpectedParens",
            type
        }]
    },
    {
        code: "async(a) => a",
        output: "async a => a",
        options: ["as-needed"],
        parserOptions: { ecmaVersion: 8 },
        errors: [{
            line: 1,
            column: 1,
            messageId: "unexpectedParens",
            type
        }]
    },

    // "as-needed", { "requireForBlockBody": true }
    {
        code: "a => {}",
        output: "(a) => {}",
        options: ["as-needed", { requireForBlockBody: true }],
        errors: [{
            line: 1,
            column: 1,
            messageId: "expectedParensBlock",
            type
        }]
    },
    {
        code: "(a) => a",
        output: "a => a",
        options: ["as-needed", { requireForBlockBody: true }],
        errors: [{
            line: 1,
            column: 1,
            messageId: "unexpectedParensInline",
            type
        }]
    },
    {
        code: "async a => {}",
        output: "async (a) => {}",
        options: ["as-needed", { requireForBlockBody: true }],
        parserOptions: { ecmaVersion: 8 },
        errors: [{
            line: 1,
            column: 1,
            messageId: "expectedParensBlock",
            type
        }]
    },
    {
        code: "async (a) => a",
        output: "async a => a",
        options: ["as-needed", { requireForBlockBody: true }],
        parserOptions: { ecmaVersion: 8 },
        errors: [{
            line: 1,
            column: 1,
            messageId: "unexpectedParensInline",
            type
        }]
    },
    {
        code: "async(a) => a",
        output: "async a => a",
        options: ["as-needed", { requireForBlockBody: true }],
        parserOptions: { ecmaVersion: 8 },
        errors: [{
            line: 1,
            column: 1,
            messageId: "unexpectedParensInline",
            type
        }]
    }
];

ruleTester.run("arrow-parens", rule, {
    valid,
    invalid
});
