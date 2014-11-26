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
        "defaultConfig();\n\n// line comment",
        "defaultConfig();\n// line comment",
        "/* block\n * comment\n */\n\ndefaultConfig();",
        "/* block\n * comment\n */\ndefaultConfig();",
        "defaultConfig();\n\n/* block\n * comment\n */",
        "defaultConfig();\n/* block\n * comment\n */",

        // Line comment styles that conform to the rules
        {
            code: "beforeLineComment: true\n\n// single line comment",
            args: [1, {beforeLineComment: true}]
        },
        {
            code: "beforeLineComment: false\n// single line comment",
            args: [1, {beforeLineComment: false}]
        },
        {
            code: "// single line comment\n\nafterLineComment: true",
            args: [1, {afterLineComment: true}]
        },
        {
            code: "// single line comment\nafterLineComment: false",
            args: [1, {afterLineComment: false}]
        },
        {
            code: "// multi line\n// comment\n\nafterLineComment: true",
            args: [1, {afterLineComment: true}]
        },
        {
            code: "// multi line\n// comment\nafterLineComment: false",
            args: [1, {afterLineComment: false}]
        },
        {
            code: "var x = 5; // end of line comment\nafterLineComment: true",
            args: [1, {afterLineComment: true}]
        },

        // Block comment styles that conform to the rules
        {
            code: "beforeBlockComment: true;\n\n/* single line block comment */",
            args: [1, {beforeBlockComment: true}]
        },
        {
            code: "beforeBlockComment: false;\n/* single line block comment */",
            args: [1, {beforeBlockComment: false}]
        },
        {
            code: "/* single line block comment */\n\nafterBlockComment: true",
            args: [1, {afterBlockComment: true}]
        },
        {
            code: "/* single line block comment */\nafterBlockComment: false",
            args: [1, {afterBlockComment: false}]
        },
        {
            code: "beforeBlockComment: false;\n/* multi line\n * block comment */",
            args: [1, {beforeBlockComment: false}]
        },
        {
            code: "/* multi line\n * block comment */\n\nafterBlockComment: true",
            args: [1, {afterBlockComment: true}]
        },
        {
            code: "/* multi line\n * block comment */\nafterBlockComment: false",
            args: [1, {afterBlockComment: false}]
        },
        {
            code: "var x = /* inline comment */ 5;\nafterBlockComment: true",
            args: [1, {afterBlockComment: true}]
        },

        // These are considered in-line comments, and thus completely ignored
        {
            code: "/* two block comments */ /* on one line */\nafterBlockComment: true",
            args: [1, {afterBlockComment: true}]
        },
        {
            code: "/* two block comments */ /* on one line */\nafterBlockComment: false",
            args: [1, {afterBlockComment: false}]
        },
        {
            code: "/* block comment */ // and line comment\nafterBlockComment: true",
            args: [1, {afterBlockComment: true}]
        },
        {
            code: "/* block comment */ // and line comment\nafterBlockComment: false",
            args: [1, {afterBlockComment: false}]
        },

        // String literals should be ignored
        {
            code: "'\\\n// string, not a comment\\\nafterLineComment: true'",
            args: [1, {afterLineComment: true}]
        },
        {
            code: "\"\\\n// string, not a comment\\\nafterLineComment: true\"",
            args: [1, {afterLineComment: true}]
        },
        {
            code: "/regexp literal looks like block comment.*/\nafterBlockComment: true",
            args: [1, {afterBlockComment: true}]
        }
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "beforeLineComment: false;\n\n// line comment",
            args: [1, {beforeLineComment: false}],
            errors: [
                { message: "Line comment cannot be preceded by empty line (line 2)" }
            ]
        },
        {
            code: "beforeLineComment: true;\n// line comment",
            args: [1, {beforeLineComment: true}],
            errors: [
                { message: "Line comment must be preceded by empty line (line 1)" }
            ]
        },
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
            code: "// line comment\nafterLineComment: true",
            args: [1, {afterLineComment: true}],
            errors: [
                { message: "Line comment must be followed by empty line (line 2)" }
            ]
        },
        {
            code: "beforeBlockComment: false;\n\n/* single-line block comment */",
            args: [1, {beforeBlockComment: false}],
            errors: [
                { message: "Block comment cannot be preceded by empty line (line 2)" }
            ]
        },
        {
            code: "beforeBlockComment: true;\n/* single-line block comment */",
            args: [1, {beforeBlockComment: true}],
            errors: [
                { message: "Block comment must be preceded by empty line (line 1)" }
            ]
        },
        {
            code: "/* single-line block comment */\n\nafterBlockComment: false",
            args: [1, {afterBlockComment: false}],
            errors: [
                { message: "Block comment cannot be followed by empty line (line 2)" }
            ]
        },
        {
            code: "/* multi-line\n * block comment\n */\n\nafterBlockComment: false",
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
            code: "beforeBlockComment: true\n/* block comment */\nafterBlockComment: true",
            args: [1, {beforeBlockComment: true, afterBlockComment: true}],
            errors: [
                { message: "Block comment must be preceded by empty line (line 1)" },
                { message: "Block comment must be followed by empty line (line 3)" }
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
