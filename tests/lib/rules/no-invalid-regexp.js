/**
 * @fileoverview Validate strings passed to the RegExp constructor
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-invalid-regexp"),
    RuleTester = require("../../../lib/rule-tester/rule-tester");

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

        // unknown pattern
        "new RegExp(pattern, 'g')",
        "new RegExp('.' + '', 'g')",
        "new RegExp(pattern, '')",
        "new RegExp(pattern)",

        // ES2020
        "new RegExp('(?<\\\\ud835\\\\udc9c>.)', 'g')",
        "new RegExp('(?<\\\\u{1d49c}>.)', 'g')",
        "new RegExp('(?<𝒜>.)', 'g');",
        "new RegExp('\\\\p{Script=Nandinagari}', 'u');",

        // ES2022
        "new RegExp('a+(?<Z>z)?', 'd')",
        "new RegExp('\\\\p{Script=Cpmn}', 'u')",
        "new RegExp('\\\\p{Script=Cypro_Minoan}', 'u')",
        "new RegExp('\\\\p{Script=Old_Uyghur}', 'u')",
        "new RegExp('\\\\p{Script=Ougr}', 'u')",
        "new RegExp('\\\\p{Script=Tangsa}', 'u')",
        "new RegExp('\\\\p{Script=Tnsa}', 'u')",
        "new RegExp('\\\\p{Script=Toto}', 'u')",
        "new RegExp('\\\\p{Script=Vith}', 'u')",
        "new RegExp('\\\\p{Script=Vithkuqi}', 'u')",

        // ES2024
        "new RegExp('[A--B]', 'v')",
        "new RegExp('[A&&B]', 'v')",
        "new RegExp('[A--[0-9]]', 'v')",
        "new RegExp('[\\\\p{Basic_Emoji}--\\\\q{a|bc|def}]', 'v')",
        "new RegExp('[A--B]', flags)", // valid only with `v` flag
        "new RegExp('[[]\\\\u{0}*', flags)", // valid only with `u` flag

        // ES2025
        "new RegExp('((?<k>a)|(?<k>b))')",

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
            code: "new RegExp(pattern, 'ga')",
            options: [{ allowConstructorFlags: ["a"] }]
        },
        {
            code: "new RegExp('.' + '', 'ga')",
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
            code: "RegExp('.', 'a');",
            options: [{ allowConstructorFlags: ["A"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'a'" },
                type: "CallExpression"
            }]
        },
        {
            code: "RegExp('.', 'A');",
            options: [{ allowConstructorFlags: ["a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'A'" },
                type: "CallExpression"
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
            code: "new RegExp('.', 'aa');",
            options: [{ allowConstructorFlags: ["a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'aa'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'aa');",
            options: [{ allowConstructorFlags: ["a", "a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'aa'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'aA');",
            options: [{ allowConstructorFlags: ["a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'A'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'aaz');",
            options: [{ allowConstructorFlags: ["a", "z"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'aa'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'azz');",
            options: [{ allowConstructorFlags: ["a", "z"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'zz'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'aga');",
            options: [{ allowConstructorFlags: ["a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'aa'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'uu');",
            options: [{ allowConstructorFlags: ["u"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'uu'" },
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
        },

        // https://github.com/eslint/eslint/issues/16573
        {
            code: "RegExp(')' + '', 'a');",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'a'" },
                type: "CallExpression"
            }]
        },
        {
            code: "new RegExp('.' + '', 'az');",
            options: [{ allowConstructorFlags: ["z"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'a'" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp(pattern, 'az');",
            options: [{ allowConstructorFlags: ["a"] }],
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid flags supplied to RegExp constructor 'z'" },
                type: "NewExpression"
            }]
        },

        // ES2024
        {
            code: "new RegExp('[[]', 'v');",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /[[]/v: Unterminated character class" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('.', 'uv');",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Regex 'u' and 'v' flags cannot be used together" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp(pattern, 'uv');",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Regex 'u' and 'v' flags cannot be used together" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('[A--B]' /* valid only with `v` flag */, 'u')",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /[A--B]/u: Range out of order in character class" },
                type: "NewExpression"
            }]
        },
        {
            code: "new RegExp('[[]\\\\u{0}*' /* valid only with `u` flag */, 'v')",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /[[]\\u{0}*/v: Unterminated character class" },
                type: "NewExpression"
            }]
        },

        // ES2025
        {
            code: "new RegExp('(?<k>a)(?<k>b)')",
            errors: [{
                messageId: "regexMessage",
                data: { message: "Invalid regular expression: /(?<k>a)(?<k>b)/: Duplicate capture group name" },
                type: "NewExpression"
            }]
        }
    ]
});
