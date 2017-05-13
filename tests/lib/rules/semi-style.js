/**
 * @fileoverview Tests for semi-style rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/semi-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("semi-style", rule, {
    valid: [
        ";",
        ";foo;bar;baz;",
        "foo;\nbar;",
        "for(a;b;c);",
        "for(a;\nb;\nc);",
        "if(a)foo;\nbar",
        { code: ";foo;bar;baz;", options: ["last"] },
        { code: "foo;\nbar;", options: ["last"] },
        { code: "for(a;b;c);", options: ["last"] },
        { code: "for(a;\nb;\nc);", options: ["last"] },
        { code: "if(a)foo;\nbar", options: ["last"] },
        { code: ";foo;bar;baz;", options: ["first"] },
        { code: "foo\n;bar;", options: ["first"] },
        { code: "for(a;b;c);", options: ["first"] },
        { code: "for(a\n;b\n;c);", options: ["first"] },
        { code: "for((a)\n;(b)\n;(c));", options: ["first"] },
        { code: "if(a)foo\n;bar", options: ["first"] },
        { code: "for(a\n;;)d;\ne", options: [{ statements: "last", forLoopHead: "first" }] },
        { code: "for(a;;\n)d\n;e", options: [{ statements: "first", forLoopHead: "last" }] }
    ],
    invalid: [
        {
            code: "foo\n;bar",
            output: "foo;\nbar",
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "if(a)foo\n;bar",
            output: "if(a)foo;\nbar",
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "var foo\n;bar",
            output: "var foo;\nbar",
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "foo\n;\nbar",
            output: "foo;\nbar",
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "for(a\n;b;c)d",
            output: "for(a;\nb;c)d",
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "for(a;b\n;c)d",
            output: "for(a;b;\nc)d",
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "do;while(a)\n;b",
            output: "do;while(a);\nb",
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },

        {
            code: "foo\n;bar",
            output: "foo;\nbar",
            options: ["last"],
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "if(a)foo\n;bar",
            output: "if(a)foo;\nbar",
            options: ["last"],
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "var foo\n;bar",
            output: "var foo;\nbar",
            options: ["last"],
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "foo\n;\nbar",
            output: "foo;\nbar",
            options: ["last"],
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "for(a\n;b;c)d",
            output: "for(a;\nb;c)d",
            options: ["last"],
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "for(a;b\n;c)d",
            output: "for(a;b;\nc)d",
            options: ["last"],
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },

        {
            code: "foo;\nbar",
            output: "foo\n;bar",
            options: ["first"],
            errors: ["Expected this semicolon to be at the beginning of the next line."]
        },
        {
            code: "if(a)foo;\nbar",
            output: "if(a)foo\n;bar",
            options: ["first"],
            errors: ["Expected this semicolon to be at the beginning of the next line."]
        },
        {
            code: "var foo;\nbar",
            output: "var foo\n;bar",
            options: ["first"],
            errors: ["Expected this semicolon to be at the beginning of the next line."]
        },
        {
            code: "foo\n;\nbar",
            output: "foo\n;bar",
            options: ["first"],
            errors: ["Expected this semicolon to be at the beginning of the next line."]
        },
        {
            code: "for(a;\nb;c)d",
            output: "for(a\n;b;c)d",
            options: ["first"],
            errors: ["Expected this semicolon to be at the beginning of the next line."]
        },
        {
            code: "for(a;b;\nc)d",
            output: "for(a;b\n;c)d",
            options: ["first"],
            errors: ["Expected this semicolon to be at the beginning of the next line."]
        },

        {
            code: "for(a;\n;)d\n;e",
            output: "for(a\n;;)d;\ne",
            options: [{ statements: "last", forLoopHead: "first" }],
            errors: [
                { line: 1, message: "Expected this semicolon to be at the beginning of the next line." },
                { line: 3, message: "Expected this semicolon to be at the end of the previous line." }
            ]
        },
        {
            code: "for(a\n;;)d;\ne",
            output: "for(a;\n;)d\n;e",
            options: [{ statements: "first", forLoopHead: "last" }],
            errors: [
                { line: 2, message: "Expected this semicolon to be at the end of the previous line." },
                { line: 2, message: "Expected this semicolon to be at the beginning of the next line." }
            ]
        },

        {
            code: "foo\n;/**/bar",
            output: null,
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },
        {
            code: "foo\n/**/;bar",
            output: null,
            errors: ["Expected this semicolon to be at the end of the previous line."]
        },

        {
            code: "foo;\n/**/bar",
            output: null,
            options: ["first"],
            errors: ["Expected this semicolon to be at the beginning of the next line."]
        },
        {
            code: "foo/**/;\nbar",
            output: null,
            options: ["first"],
            errors: ["Expected this semicolon to be at the beginning of the next line."]
        }
    ]
});
