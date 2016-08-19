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
        "//\xDCber",
        "//\u03A0",
        "/* Uppercase\nsecond line need not be uppercase */",

        // No options: non-alphabetical is okay
        "//123",
        "// 123",
        "/*123*/",
        "/* 123 */",
        "/*\n123 */",
        "/*123\nsecond line need not be uppercase */",

        // Using "always" string option
        { code: "//Uppercase", options: ["always"] },
        { code: "// Uppercase", options: ["always"] },
        { code: "/*Uppercase */", options: ["always"] },
        { code: "/* Uppercase */", options: ["always"] },
        { code: "/*\nUppercase */", options: ["always"] },
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
        { code: "/* 123 */", options: ["always"] },
        { code: "/*\n123 */", options: ["always"] },
        {
            code: "/*123\nsecond line need not be uppercase */",
            options: ["always"]
        },

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
            code: "/*\nlowercase */",
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
        }
    ]
});
