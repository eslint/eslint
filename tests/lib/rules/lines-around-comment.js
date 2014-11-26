/**
 * @fileoverview Tests for lines-around-comments rule.
 * @author Hraban Luyat
 * @copyright 2014 Hraban Luyat. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/lines-around-comment", {

    // Examples of code that should not trigger the rule
    valid: [
        // Default: everything goes
        "// line comment\n\ndefaultConfig();",
        "// line comment\ndefaultConfig();",
        "// block\n// comment\n\ndefaultConfig();",
        "// block\n// comment\ndefaultConfig();",
        // Line comment styles that conform to the rules
        {
            code: "// single line comment\n\nafterSingleLineComment: true",
            args: [1, {afterLineComment: true}]
        },
        {
            code: "// single line comment\nafterSingleLineComment: false",
            args: [1, {afterLineComment: false}]
        },
        {
            code: "// multi line\n// comment\n\nafterMultiLineComment: true",
            args: [1, {afterLineComment: true}]
        },
        {
            code: "// multi line\n// comment\nafterMultiComment: false",
            args: [1, {afterLineComment: false}]
        },
        // Block comment styles that conform to the rules
        {
            code: "/* single line block comment */\n\nafterSingleBlockComment: true",
            args: [1, {afterBlockComment: true}]
        },
        {
            code: "/* single line block comment */\nafterSingleBlockComment: false",
            args: [1, {afterBlockComment: false}]
        },
        {
            code: "/* multi line\n * block comment */\n\nafterMultiBlockComment: true",
            args: [1, {afterBlockComment: true}]
        },
        {
            code: "/* multi line\n * block comment */\nafterMultiBlockComment: false",
            args: [1, {afterBlockComment: false}]
        },
        // String literals should be ignored
        {
            code: "'\\\n// string, not a comment\\\n'",
            args: [1, {afterLineComment: true}]
        },
        {
            code: "\"\\\n// string, not a comment\\\n\"",
            args: [1, {afterLineComment: true}]
        },
        {
            code: "/regexp literal looks like block comment.*/\n;",
            args: [1, {afterBlockComment: true}]
        }
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "// line comment\n\nafterLineComment: false",
            args: [1, {afterLineComment: false}],
            errors: [
                { message: "Line comment cannot be followed by empty line (line 2)" }
            ]
        },
        {
            code: "// line comment\nafterLineComment: true",
            args: [1, {afterLineComment: true}],
            errors: [
                { message: "Line comment must be followed by empty line (line 2)" }
            ]
        },
        {
            code: "/* block\n * comment\n */\n\nafterBlockComment: false",
            args: [1, {afterBlockComment: false}],
            errors: [
                { message: "Block comment cannot be followed by empty line (line 4)" }
            ]
        },
        {
            code: "/* block\n * comment\n */\nafterBlockComment: true",
            args: [1, {afterBlockComment: true}],
            errors: [
                { message: "Block comment must be followed by empty line (line 4)" }
            ]
        },
        {
            code: "/* block\n * comment\n with last-line noise */\nfoo;",
            args: [1, {afterBlockComment: true}],
            errors: [
                { message: "Block comment must be followed by empty line (line 4)" }
            ]
        },
        {
            code: "// CRLF instead of LF\r\n\r\nafterLineComment: false",
            args: [1, {afterLineComment: false}],
            errors: [
                { message: "Line comment cannot be followed by empty line (line 2)" }
            ]
        }
    ]
});
