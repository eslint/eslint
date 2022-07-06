/**
 * @fileoverview Validate strings passed to the RegExp constructor
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-invalid-regexp"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-invalid-regexp", rule, {
    valid: [
        "RegExp('')",
        "RegExp()",
        "RegExp('.', 'g')",
        "new RegExp('.')",
        "new RegExp",
        "new RegExp('.', 'im')",
        "global.RegExp('\\\\')",
        "new RegExp('.', y)",
        "new RegExp('.', 'y')",
        "new RegExp('.', 'u')",
        "new RegExp('.', 'yu')",
        "new RegExp('/', 'yu')",
        "new RegExp('\\/', 'yu')",
        "new RegExp('\\\\u{65}', 'u')",
        "new RegExp('\\\\u{65}*', 'u')",
        "new RegExp('[\\\\u{0}-\\\\u{1F}]', 'u')",
        "new RegExp('.', 's')",
        "new RegExp('(?<=a)b')",
        "new RegExp('(?<!a)b')",
        "new RegExp('(?<a>b)\\k<a>')",
        "new RegExp('(?<a>b)\\k<a>', 'u')",
        "new RegExp('\\\\p{Letter}', 'u')",

        // unknown flags
        "RegExp('{', flags)", // valid without the "u" flag
        "new RegExp('{', flags)", // valid without the "u" flag
        "RegExp('\\\\u{0}*', flags)", // valid with the "u" flag
        "new RegExp('\\\\u{0}*', flags)", // valid with the "u" flag
        {
            code: "RegExp('{', flags)", // valid without the "u" flag
            options: [{ allowConstructorFlags: ["u"] }]
        },
        {
            code: "RegExp('\\\\u{0}*', flags)", // valid with the "u" flag
            options: [{ allowConstructorFlags: ["a"] }]
        },

        // ES2020
        "new RegExp('(?<\\\\ud835\\\\udc9c>.)', 'g')",
        "new RegExp('(?<\\\\u{1d49c}>.)', 'g')",
        "new RegExp('(?<𝒜>.)', 'g');",
        "new RegExp('\\\\p{Script=Nandinagari}', 'u');",

        // ES2022
        "new RegExp('a+(?<Z>z)?', 'd')",

        // allowConstructorFlags
        {
            code: "new RegExp('.', 'g')",
            options: [{ allowConstructorFlags: [] }]
        },
        {
            code: "new RegExp('.', 'g')",
            options: [{ allowConstructorFlags: ["a"] }]
        },
        {
            code: "new RegExp('.', 'a')",
            options: [{ allowConstructorFlags: ["a"] }]
        },
        {
            code: "new RegExp('.', 'ag')",
            options: [{ allowConstructorFlags: ["a"] }]
        },
        {
            code: "new RegExp('.', 'ga')",
            options: [{ allowConstructorFlags: ["a"] }]
        },
        {
            code: "new RegExp('.', 'a')",
            options: [{ allowConstructorFlags: ["a", "z"] }]
        },
        {
            code: "new RegExp('.', 'z')",
            options: [{ allowConstructorFlags: ["a", "z"] }]
        },
        {
            code: "new RegExp('.', 'az')",
            options: [{ allowConstructorFlags: ["a", "z"] }]
        },
        {
            code: "new RegExp('.', 'za')",
            options: [{ allowConstructorFlags: ["a", "z"] }]
        },
        {
            code: "new RegExp('.', 'agz')",
            options: [{ allowConstructorFlags: ["a", "z"] }]
        }
    ],
    invalid: [
        {
            code: "RegExp('[');",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /[/: Unterminated character class" },
                type: "CallExpression"
            }]
        },
        {
            code: "RegExp('.', 'z');",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'z'" },
                type: "CallExpression"
            }]
        },
        {
            code: "RegExp('.', 'a');",
            options: [{}],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'a'" },
                type: "CallExpression"
            }]
        },
        {
            code: "new RegExp('.', 'a');",
            options: [{ allowConstructorFlags: [] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'a'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'z');",
            options: [{ allowConstructorFlags: ["a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'z'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'az');",
            options: [{ allowConstructorFlags: ["z"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'a'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp(')');",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /)/: Unmatched ')'" },
                type: "NewExpression"
            }]
        },
        {
            code: String.raw`new RegExp('\\a', 'u');`,
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /\\a/u: Invalid escape" },
                type: "NewExpression"
            }]
        },
        {
            code: String.raw`new RegExp('\\a', 'u');`,
            options: [{ allowConstructorFlags: ["u"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /\\a/u: Invalid escape" },
                type: "NewExpression"
            }]
        },
        {
            code: String.raw`RegExp('\\u{0}*');`,
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /\\u{0}*/: Nothing to repeat" },
                type: "CallExpression"
            }]
        },
        {
            code: String.raw`new RegExp('\\u{0}*');`,
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /\\u{0}*/: Nothing to repeat" },
                type: "NewExpression"
            }]
        },
        {
            code: String.raw`new RegExp('\\u{0}*', '');`,
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /\\u{0}*/: Nothing to repeat" },
                type: "NewExpression"
            }]
        },
        {
            code: String.raw`new RegExp('\\u{0}*', 'a');`,
            options: [{ allowConstructorFlags: ["a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /\\u{0}*/: Nothing to repeat" },
                type: "NewExpression"
            }]
        },
        {
            code: String.raw`RegExp('\\u{0}*');`,
            options: [{ allowConstructorFlags: ["a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /\\u{0}*/: Nothing to repeat" },
                type: "CallExpression"
            }]
        },

        // https://github.com/eslint/eslint/issues/10861
        {
            code: String.raw`new RegExp('\\');`,
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /\\/: \\ at end of pattern" },
                type: "NewExpression"
            }]
        }
    ]
});
