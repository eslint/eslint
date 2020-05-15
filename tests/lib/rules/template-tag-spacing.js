/**
 * @fileoverview Tests for template-tag-spacing rule.
 * @author Jonathan Wilsson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/template-tag-spacing"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });
const unexpectedError = { messageId: "unexpected" };
const missingError = { messageId: "missing" };

ruleTester.run("template-tag-spacing", rule, {
    valid: [
        "tag`name`",
        { code: "tag`name`", options: ["never"] },
        { code: "tag `name`", options: ["always"] },
        "tag`hello ${name}`",
        { code: "tag`hello ${name}`", options: ["never"] },
        { code: "tag `hello ${name}`", options: ["always"] },
        "tag/*here's a comment*/`Hello world`",
        { code: "tag/*here's a comment*/`Hello world`", options: ["never"] },
        { code: "tag /*here's a comment*/`Hello world`", options: ["always"] },
        { code: "tag/*here's a comment*/ `Hello world`", options: ["always"] },
        "new tag`name`",
        { code: "new tag`name`", options: ["never"] },
        { code: "new tag `name`", options: ["always"] },
        "new tag`hello ${name}`",
        { code: "new tag`hello ${name}`", options: ["never"] },
        { code: "new tag `hello ${name}`", options: ["always"] },
        "(tag)`name`",
        { code: "(tag)`name`", options: ["never"] },
        { code: "(tag) `name`", options: ["always"] },
        "(tag)`hello ${name}`",
        { code: "(tag)`hello ${name}`", options: ["never"] },
        { code: "(tag) `hello ${name}`", options: ["always"] },
        "new (tag)`name`",
        { code: "new (tag)`name`", options: ["never"] },
        { code: "new (tag) `name`", options: ["always"] },
        "new (tag)`hello ${name}`",
        { code: "new (tag)`hello ${name}`", options: ["never"] },
        { code: "new (tag) `hello ${name}`", options: ["always"] },
        { code: "new (tag)\n`hello ${name}`", options: ["always"] },
        "func ()`Hello world` ;"
    ],
    invalid: [
        {
            code: "tag `name`",
            output: "tag`name`",
            errors: [unexpectedError]
        },
        {
            code: "tag  `name`",
            output: "tag`name`",
            errors: [
                {
                    line: 1,
                    column: 4,
                    messageId: "unexpected",
                    endLine: 1,
                    endColumn: 6
                }
            ]
        },
        {
            code: "tag `name`",
            output: "tag`name`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "tag`name`",
            output: "tag `name`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "tag /*here's a comment*/`Hello world`",
            output: "tag/*here's a comment*/`Hello world`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "tag/*here's a comment*/ `Hello world`",
            output: "tag/*here's a comment*/`Hello world`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "tag/*here's a comment*/`Hello world`",
            output: "tag /*here's a comment*/`Hello world`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "tag // here's a comment \n`bar`",
            output: null,
            errors: [unexpectedError]
        },
        {
            code: "tag // here's a comment \n`bar`",
            output: null,
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "tag `hello ${name}`",
            output: "tag`hello ${name}`",
            errors: [unexpectedError]
        },
        {
            code: "tag `hello ${name}`",
            output: "tag`hello ${name}`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "tag`hello ${name}`",
            output: "tag `hello ${name}`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "tag`hello ${name}`",
            output: "tag `hello ${name}`",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 4,
                    messageId: "missing",
                    endLine: 1,
                    endColumn: 5
                }
            ]
        },
        {
            code: "new tag `name`",
            output: "new tag`name`",
            errors: [unexpectedError]
        },
        {
            code: "new tag `name`",
            output: "new tag`name`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "new tag`name`",
            output: "new tag `name`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "new tag `hello ${name}`",
            output: "new tag`hello ${name}`",
            errors: [unexpectedError]
        },
        {
            code: "new tag `hello ${name}`",
            output: "new tag`hello ${name}`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "new tag`hello ${name}`",
            output: "new tag `hello ${name}`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "(tag) `name`",
            output: "(tag)`name`",
            errors: [unexpectedError]
        },
        {
            code: "(tag) `name`",
            output: "(tag)`name`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "(tag)`name`",
            output: "(tag) `name`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "(tag) `hello ${name}`",
            output: "(tag)`hello ${name}`",
            errors: [unexpectedError]
        },
        {
            code: "(tag) `hello ${name}`",
            output: "(tag)`hello ${name}`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "(tag)`hello ${name}`",
            output: "(tag) `hello ${name}`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "new (tag) `name`",
            output: "new (tag)`name`",
            errors: [unexpectedError]
        },
        {
            code: "new (tag) `name`",
            output: "new (tag)`name`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "new (tag)`name`",
            output: "new (tag) `name`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "new (tag) `hello ${name}`",
            output: "new (tag)`hello ${name}`",
            errors: [unexpectedError]
        },
        {
            code: "new (tag) `hello ${name}`",
            output: "new (tag)`hello ${name}`",
            options: ["never"],
            errors: [unexpectedError]
        },
        {
            code: "new (tag)`hello ${name}`",
            output: "new (tag) `hello ${name}`",
            options: ["always"],
            errors: [missingError]
        },
        {
            code: "tag\n`hello ${name}`",
            output: "tag`hello ${name}`",
            options: ["never"],
            errors: [
                {
                    line: 1,
                    column: 4,
                    messageId: "unexpected",
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "func() `hello ${name}`",
            output: "func()`hello ${name}`",
            options: ["never"],
            errors: [
                {
                    line: 1,
                    column: 7,
                    messageId: "unexpected",
                    endLine: 1,
                    endColumn: 8
                }
            ]
        },
        {
            code: "func()`hello ${name}`",
            output: "func() `hello ${name}`",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 7,
                    messageId: "missing",
                    endLine: 1,
                    endColumn: 8
                }
            ]
        }

    ]
});
