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
        { code: "new (tag) `hello ${name}`", options: ["always"] }
    ],
    invalid: [
        {
            code: "tag `name`",
            output: "tag`name`",
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "tag `name`",
            output: "tag`name`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "tag`name`",
            output: "tag `name`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 4
            }]
        },
        {
            code: "tag /*here's a comment*/`Hello world`",
            output: "tag/*here's a comment*/`Hello world`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 25
            }]
        },
        {
            code: "tag/*here's a comment*/ `Hello world`",
            output: "tag/*here's a comment*/`Hello world`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 25
            }]
        },
        {
            code: "tag/*here's a comment*/`Hello world`",
            output: "tag /*here's a comment*/`Hello world`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "tag // here's a comment \n`bar`",
            output: null,
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "tag // here's a comment \n`bar`",
            output: null,
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "tag `hello ${name}`",
            output: "tag`hello ${name}`",
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "tag `hello ${name}`",
            output: "tag`hello ${name}`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 5
            }]
        },
        {
            code: "tag`hello ${name}`",
            output: "tag `hello ${name}`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 4
            }]
        },
        {
            code: "new tag `name`",
            output: "new tag`name`",
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 9
            }]
        },
        {
            code: "new tag `name`",
            output: "new tag`name`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 9
            }]
        },
        {
            code: "new tag`name`",
            output: "new tag `name`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 8
            }]
        },
        {
            code: "new tag `hello ${name}`",
            output: "new tag`hello ${name}`",
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 9
            }]
        },
        {
            code: "new tag `hello ${name}`",
            output: "new tag`hello ${name}`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 9
            }]
        },
        {
            code: "new tag`hello ${name}`",
            output: "new tag `hello ${name}`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 8
            }]
        },
        {
            code: "(tag) `name`",
            output: "(tag)`name`",
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "(tag) `name`",
            output: "(tag)`name`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "(tag)`name`",
            output: "(tag) `name`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "(tag) `hello ${name}`",
            output: "(tag)`hello ${name}`",
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "(tag) `hello ${name}`",
            output: "(tag)`hello ${name}`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "(tag)`hello ${name}`",
            output: "(tag) `hello ${name}`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "new (tag) `name`",
            output: "new (tag)`name`",
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "new (tag) `name`",
            output: "new (tag)`name`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "new (tag)`name`",
            output: "new (tag) `name`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 10
            }]
        },
        {
            code: "new (tag) `hello ${name}`",
            output: "new (tag)`hello ${name}`",
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "new (tag) `hello ${name}`",
            output: "new (tag)`hello ${name}`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "new (tag)`hello ${name}`",
            output: "new (tag) `hello ${name}`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 10
            }]
        },
        {
            code: "tag   `name`",
            output: "tag`name`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "tag\n`name`",
            output: "tag`name`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "tag \n  `name`",
            output: "tag`name`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 2,
                endColumn: 3
            }]
        },
        {
            code: "tag\n\n`name`",
            output: "tag`name`",
            options: ["never"],
            errors: [{
                messageId: "unexpected",
                line: 1,
                column: 4,
                endLine: 3,
                endColumn: 1
            }]
        },
        {
            code: "foo\n  .bar`Hello world`",
            output: "foo\n  .bar `Hello world`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 1,
                endLine: 2,
                endColumn: 7
            }]
        },
        {
            code: "foo(\n  bar\n)`Hello world`",
            output: "foo(\n  bar\n) `Hello world`",
            options: ["always"],
            errors: [{
                messageId: "missing",
                line: 1,
                column: 1,
                endLine: 3,
                endColumn: 2
            }]
        }
    ]
});
