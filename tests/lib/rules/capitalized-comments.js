/**
 * @fileoverview enforce or disallow capitalization of the first letter of a comment
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/capitalized-comments"),
    RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALWAYS_MESSAGE = "Comments should not begin with a lowercase character",
    NEVER_MESSAGE = "Comments should not begin with an uppercase character";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("capitalized-comments", rule, {

    valid: [

        // No options: capitalization required
        "//Uppercase",
        "// Uppercase",
        "/*Uppercase */",
        "/* Uppercase */",
        "/*\nUppercase */",
        "/** Uppercase */",
        "/**\nUppercase */",
        "//\xDCber",
        "//\u03A0",
        "/* Uppercase\nsecond line need not be uppercase */",

        // No options: Skips comments that only contain whitespace
        "// ",
        "//\t",
        "/* */",
        "/*\t*/",
        "/*\n*/",
        "/*\r*/",
        "/*\r\n*/",
        "/*\u2028*/",
        "/*\u2029*/",

        // No options: non-alphabetical is okay
        "//123",
        "// 123",
        "/*123*/",
        "/* 123 */",
        "/**123 */",
        "/** 123 */",
        "/**\n123 */",
        "/*\n123 */",
        "/*123\nsecond line need not be uppercase */",
        "/**\n * @fileoverview This is a file */",

        // No options: eslint/istanbul/jshint/jscs/globals?/exported are okay
        "// jscs: enable",
        "// jscs:disable",
        "// eslint-disable-line",
        "// eslint-disable-next-line",
        "/* eslint semi:off */",
        "/* eslint-env node */",
        "/* istanbul ignore next */",
        "/* jshint asi:true */",
        "/* jscs: enable */",
        "/* global var1, var2 */",
        "/* global var1:true, var2 */",
        "/* globals var1, var2 */",
        "/* globals var1:true, var2 */",
        "/* exported myVar */",

        // Using "always" string option
        { code: "//Uppercase", options: ["always"] },
        { code: "// Uppercase", options: ["always"] },
        { code: "/*Uppercase */", options: ["always"] },
        { code: "/* Uppercase */", options: ["always"] },
        { code: "/*\nUppercase */", options: ["always"] },
        { code: "/** Uppercase */", options: ["always"] },
        { code: "/**\nUppercase */", options: ["always"] },
        { code: "//\xDCber", options: ["always"] },
        { code: "//\u03A0", options: ["always"] },
        {
            code: "/* Uppercase\nsecond line need not be uppercase */",
            options: ["always"]
        },

        // Using "always" string option: non-alphabetical is okay
        { code: "//123", options: ["always"] },
        { code: "// 123", options: ["always"] },
        { code: "/*123*/", options: ["always"] },
        { code: "/**123*/", options: ["always"] },
        { code: "/* 123 */", options: ["always"] },
        { code: "/** 123*/", options: ["always"] },
        { code: "/**\n123*/", options: ["always"] },
        { code: "/*\n123 */", options: ["always"] },
        {
            code: "/*123\nsecond line need not be uppercase */",
            options: ["always"]
        },
        {
            code: "/**\n @todo: foobar\n */",
            options: ["always"]
        },
        {
            code: "/**\n * @fileoverview This is a file */",
            options: ["always"]
        },

        // Using "always" string option: eslint/istanbul/jshint/jscs/globals?/exported are okay
        { code: "// jscs: enable", options: ["always"] },
        { code: "// jscs:disable", options: ["always"] },
        { code: "// eslint-disable-line", options: ["always"] },
        { code: "// eslint-disable-next-line", options: ["always"] },
        { code: "/* eslint semi:off */", options: ["always"] },
        { code: "/* eslint-env node */", options: ["always"] },
        { code: "/* istanbul ignore next */", options: ["always"] },
        { code: "/* jshint asi:true */", options: ["always"] },
        { code: "/* jscs: enable */", options: ["always"] },
        { code: "/* global var1, var2 */", options: ["always"] },
        { code: "/* global var1:true, var2 */", options: ["always"] },
        { code: "/* globals var1, var2 */", options: ["always"] },
        { code: "/* globals var1:true, var2 */", options: ["always"] },
        { code: "/* exported myVar */", options: ["always"] },

        // Using "never" string option
        { code: "//lowercase", options: ["never"] },
        { code: "// lowercase", options: ["never"] },
        { code: "/*lowercase */", options: ["never"] },
        { code: "/* lowercase */", options: ["never"] },
        { code: "/*\nlowercase */", options: ["never"] },
        { code: "//\xFCber", options: ["never"] },
        { code: "//\u03C0", options: ["never"] },
        {
            code: "/* lowercase\nSecond line need not be lowercase */",
            options: ["never"]
        },

        // Using "never" string option: non-alphabetical is okay
        { code: "//123", options: ["never"] },
        { code: "// 123", options: ["never"] },
        { code: "/*123*/", options: ["never"] },
        { code: "/* 123 */", options: ["never"] },
        { code: "/*\n123 */", options: ["never"] },
        {
            code: "/*123\nsecond line need not be uppercase */",
            options: ["never"]
        },
        {
            code: "/**\n @TODO: foobar\n */",
            options: ["never"]
        },
        {
            code: "/**\n * @Fileoverview This is a file */",
            options: ["never"]
        },

        // If first word in comment matches ignorePattern, don't warn
        {
            code: "// matching",
            options: ["always", { ignorePattern: "match" }]
        },
        {
            code: "// Matching",
            options: ["never", { ignorePattern: "Match" }]
        },
        {
            code: "// bar",
            options: ["always", { ignorePattern: "foo|bar" }]
        },
        {
            code: "// Bar",
            options: ["never", { ignorePattern: "Foo|Bar" }]
        },

        // Inline comments are not warned if ignoreInlineComments: true
        {
            code: "foo(/* ignored */ a);",
            options: ["always", { ignoreInlineComments: true }]
        },
        {
            code: "foo(/* Ignored */ a);",
            options: ["never", { ignoreInlineComments: true }]
        },

        // Inline comments can span multiple lines
        {
            code: "foo(/*\nignored */ a);",
            options: ["always", { ignoreInlineComments: true }]
        },
        {
            code: "foo(/*\nIgnored */ a);",
            options: ["never", { ignoreInlineComments: true }]
        },

        // Tolerating consecutive comments
        {
            code: [
                "// This comment is valid since it is capitalized,",
                "// and this one is valid since it follows a valid one,",
                "// and same with this one."
            ].join("\n"),
            options: ["always", { ignoreConsecutiveComments: true }]
        },
        {
            code: [
                "/* This comment is valid since it is capitalized, */",
                "/* and this one is valid since it follows a valid one, */",
                "/* and same with this one. */"
            ].join("\n"),
            options: ["always", { ignoreConsecutiveComments: true }]
        },
        {
            code: [
                "/*",
                " * This comment is valid since it is capitalized,",
                " */",
                "/* and this one is valid since it follows a valid one, */",
                "/*",
                " * and same with this one.",
                " */"
            ].join("\n"),
            options: ["always", { ignoreConsecutiveComments: true }]
        },
        {
            code: [
                "// This comment is valid since it is capitalized,",
                "// and this one is valid since it follows a valid one,",
                "foo();",
                "// This comment now has to be capitalized."
            ].join("\n"),
            options: ["always", { ignoreConsecutiveComments: true }]
        },

        // Comments which start with URLs should always be valid
        {
            code: "// https://github.com",
            options: ["always"]
        },
        {
            code: "// HTTPS://GITHUB.COM",
            options: ["never"]
        },

        // Using different options for line/block comments
        {
            code: [
                "// Valid capitalized line comment",
                "/* Valid capitalized block comment */",
                "// lineCommentIgnorePattern",
                "/* blockCommentIgnorePattern */"
            ].join("\n"),
            options: [
                "always",
                {
                    line: {
                        ignorePattern: "lineCommentIgnorePattern"
                    },
                    block: {
                        ignorePattern: "blockCommentIgnorePattern"
                    }
                }
            ]
        }
    ],

    invalid: [

        // No options: capitalization required
        {
            code: "//lowercase",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "// lowercase",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*lowercase */",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/* lowercase */",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/** lowercase */",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\nlowercase */",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/**\nlowercase */",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//\xFCber",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//\u03C0",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/* lowercase\nSecond line need not be lowercase */",
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },

        // Using "always" string option
        {
            code: "//lowercase",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "// lowercase",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*lowercase */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/* lowercase */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/** lowercase */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/**\nlowercase */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//\xFCber",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//\u03C0",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/* lowercase\nSecond line need not be lowercase */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },

        // Using "never" string option
        {
            code: "//Uppercase",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "// Uppercase",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*Uppercase */",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/* Uppercase */",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\nUppercase */",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//\xDCber",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//\u03A0",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/* Uppercase\nsecond line need not be uppercase */",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },

        // Default ignore words should be warned if there are non-whitespace characters in the way
        {
            code: "//* jscs: enable",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//* jscs:disable",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//* eslint-disable-line",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "//* eslint-disable-next-line",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n * eslint semi:off */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n * eslint-env node */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n *  istanbul ignore next */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n *  jshint asi:true */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n *  jscs: enable */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n *  global var1, var2 */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n *  global var1:true, var2 */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n *  globals var1, var2 */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n *  globals var1:true, var2 */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "/*\n *  exported myVar */",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },

        // Inline comments should be warned if ignoreInlineComments is omitted or false
        {
            code: "foo(/* invalid */a);",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 5
            }]
        },
        {
            code: "foo(/* invalid */a);",
            options: ["always", { ignoreInlineComments: false }],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 5
            }]
        },

        // ignoreInlineComments should only allow inline comments to pass
        {
            code: "foo(a, // not an inline comment\nb);",
            options: ["always", { ignoreInlineComments: true }],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 8
            }]
        },
        {
            code: "foo(a, /* not an inline comment */\nb);",
            options: ["always", { ignoreInlineComments: true }],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 8
            }]
        },
        {
            code: "foo(a,\n/* not an inline comment */b);",
            options: ["always", { ignoreInlineComments: true }],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 2,
                column: 1
            }]
        },
        {
            code: "foo(a,\n/* not an inline comment */\nb);",
            options: ["always", { ignoreInlineComments: true }],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 2,
                column: 1
            }]
        },
        {
            code: "foo(a, // Not an inline comment\nb);",
            options: ["never", { ignoreInlineComments: true }],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 8
            }]
        },
        {
            code: "foo(a, /* Not an inline comment */\nb);",
            options: ["never", { ignoreInlineComments: true }],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 8
            }]
        },
        {
            code: "foo(a,\n/* Not an inline comment */b);",
            options: ["never", { ignoreInlineComments: true }],
            errors: [{
                message: NEVER_MESSAGE,
                line: 2,
                column: 1
            }]
        },
        {
            code: "foo(a,\n/* Not an inline comment */\nb);",
            options: ["never", { ignoreInlineComments: true }],
            errors: [{
                message: NEVER_MESSAGE,
                line: 2,
                column: 1
            }]
        },

        // Comments which do not match ignorePattern are still warned
        {
            code: "// not matching",
            options: ["always", { ignorePattern: "ignored?" }],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "// Not matching",
            options: ["never", { ignorePattern: "ignored?" }],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        },

        // ignoreConsecutiveComments only applies to comments with no tokens between them
        {
            code: [
                "// This comment is valid since it is capitalized,",
                "// and this one is valid since it follows a valid one,",
                "foo();",
                "// this comment is now invalid."
            ].join("\n"),
            options: ["always", { ignoreConsecutiveComments: true }],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 4,
                column: 1
            }]
        },

        // Consecutive comments should warn if ignoreConsecutiveComments:false
        {
            code: [
                "// This comment is valid since it is capitalized,",
                "// but this one is invalid even if it follows a valid one.",
            ].join("\n"),
            options: ["always", { ignoreConsecutiveComments: false }],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 2,
                column: 1
            }]
        },

        // Comments are warned if URL is not at the start of the comment
        {
            code: "// should fail. https://github.com",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                line: 1,
                column: 1
            }]
        },
        {
            code: "// Should fail. https://github.com",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                line: 1,
                column: 1
            }]
        }
    ]
});
