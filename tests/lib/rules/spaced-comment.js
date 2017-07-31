/**
 * @fileoverview Test for spaced-comments
 * @author Gyandeep Singh
 */
"use strict";

const rule = require("../../../lib/rules/spaced-comment"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester(),
    validShebangProgram = "#!/path/to/node\nvar a = 3;",
    invalidShebangProgram = "#!/path/to/node\n#!/second/shebang\nvar a = 3;";

ruleTester.run("spaced-comment", rule, {

    valid: [
        {
            code: "// A valid comment starting with space\nvar a = 1;",
            options: ["always"]
        },
        {
            code: "//   A valid comment starting with tab\nvar a = 1;",
            options: ["always"]
        },
        {
            code: "//A valid comment NOT starting with space\nvar a = 2;",
            options: ["never"]
        },

        // exceptions - line comments
        {
            code: "//-----------------------\n// A comment\n//-----------------------",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }]
        },
        {
            code: "//-----------------------\n// A comment\n//-----------------------",
            options: ["always", {
                line: { exceptions: ["-", "=", "*", "#", "!@#"] }
            }]
        },
        {
            code: "//===========\n// A comment\n//*************",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }]
        },
        {
            code: "//######\n// A comment",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }]
        },
        {
            code: "//!@#!@#!@#\n// A comment\n//!@#",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }]
        },

        // exceptions - block comments
        {
            code: "var a = 1; /*######*/",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }]
        },
        {
            code: "var a = 1; /*######*/",
            options: ["always", {
                block: { exceptions: ["-", "=", "*", "#", "!@#"] }
            }]
        },
        {
            code: "/*****************\n * A comment\n *****************/",
            options: ["always", {
                exceptions: ["*"]
            }]
        },
        {
            code: "/*++++++++++++++\n * A comment\n +++++++++++++++++*/",
            options: ["always", {
                exceptions: ["+"]
            }]
        },
        {
            code: "/*++++++++++++++\n + A comment\n * B comment\n - C comment\n----------------*/",
            options: ["always", {
                exceptions: ["+", "-"]
            }]
        },

        // markers - line comments
        {
            code: "//!< docblock style comment",
            options: ["always", {
                markers: ["/", "!<"]
            }]
        },
        {
            code: "//!< docblock style comment",
            options: ["always", {
                line: { markers: ["/", "!<"] }
            }]
        },
        {
            code: "//----\n// a comment\n//----\n/// xmldoc style comment\n//!< docblock style comment",
            options: ["always", {
                exceptions: ["-"],
                markers: ["/", "!<"]
            }]
        },
        {
            code: "/*\u2028x*/",
            options: ["always", {
                markers: ["/", "!<"]
            }]
        },
        {
            code: "///xmldoc style comment",
            options: ["never", {
                markers: ["/", "!<"]
            }]
        },

        // markers - block comments
        {
            code: "var a = 1; /*# This is an example of a marker in a block comment\nsubsequent lines do not count*/",
            options: ["always", {
                markers: ["#"]
            }]
        },
        {
            code: "/*!\n *comment\n */",
            options: ["always", { markers: ["!"] }]
        },
        {
            code: "/*!\n *comment\n */",
            options: ["always", { block: { markers: ["!"] } }]
        },
        {
            code: "/**\n *jsdoc\n */",
            options: ["always", { markers: ["*"] }]
        },
        {
            code: "/*global ABC*/",
            options: ["always", { markers: ["global"] }]
        },
        {
            code: "/*eslint-env node*/",
            options: ["always", { markers: ["eslint-env"] }]
        },
        {
            code: "/*eslint eqeqeq:0, curly: 2*/",
            options: ["always", { markers: ["eslint"] }]
        },
        {
            code: "/*eslint-disable no-alert, no-console */\nalert()\nconsole.log()\n/*eslint-enable no-alert */",
            options: ["always", { markers: ["eslint-enable", "eslint-disable"] }]
        },

        // misc. variations
        {
            code: validShebangProgram,
            options: ["always"]
        },
        {
            code: validShebangProgram,
            options: ["never"]
        },
        {
            code: "//",
            options: ["always"]
        },
        {
            code: "//\n",
            options: ["always"]
        },
        {
            code: "// space only at start; valid since balanced doesn't apply to line comments",
            options: ["always", { block: { balanced: true } }]
        },
        {
            code: "//space only at end; valid since balanced doesn't apply to line comments ",
            options: ["never", { block: { balanced: true } }]
        },

        // block comments
        {
            code: "var a = 1; /* A valid comment starting with space */",
            options: ["always"]
        },
        {
            code: "var a = 1; /*A valid comment NOT starting with space */",
            options: ["never"]
        },
        {
            code: "function foo(/* height */a) { \n }",
            options: ["always"]
        },
        {
            code: "function foo(/*height */a) { \n }",
            options: ["never"]
        },
        {
            code: "function foo(a/* height */) { \n }",
            options: ["always"]
        },
        {
            code: "/*\n * Test\n */",
            options: ["always"]
        },
        {
            code: "/*\n *Test\n */",
            options: ["never"]
        },
        {
            code: "/*     \n *Test\n */",
            options: ["always"]
        },
        {
            code: "/*\r\n *Test\r\n */",
            options: ["never"]
        },
        {
            code: "/*     \r\n *Test\r\n */",
            options: ["always"]
        },
        {
            code: "/**\n *jsdoc\n */",
            options: ["always"]
        },
        {
            code: "/**\r\n *jsdoc\r\n */",
            options: ["always"]
        },
        {
            code: "/**\n *jsdoc\n */",
            options: ["never"]
        },
        {
            code: "/**   \n *jsdoc \n */",
            options: ["always"]
        },

        // balanced block comments
        {
            code: "var a = 1; /* comment */",
            options: ["always", { block: { balanced: true } }]
        },
        {
            code: "var a = 1; /*comment*/",
            options: ["never", { block: { balanced: true } }]
        },
        {
            code: "function foo(/* height */a) { \n }",
            options: ["always", { block: { balanced: true } }]
        },
        {
            code: "function foo(/*height*/a) { \n }",
            options: ["never", { block: { balanced: true } }]
        },
        {
            code: "var a = 1; /*######*/",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"],
                block: { balanced: true }
            }]
        },
        {
            code: "/*****************\n * A comment\n *****************/",
            options: ["always", {
                exceptions: ["*"],
                block: { balanced: true }
            }]
        },
        {
            code: "/*! comment */",
            options: ["always", { markers: ["!"], block: { balanced: true } }]
        },
        {
            code: "/*!comment*/",
            options: ["never", { markers: ["!"], block: { balanced: true } }]
        },
        {
            code: "/*!\n *comment\n */",
            options: ["always", { markers: ["!"], block: { balanced: true } }]
        },
        {
            code: "/*global ABC */",
            options: ["always", { markers: ["global"], block: { balanced: true } }]
        },

        // markers & exceptions
        {
            code: "///--------\r\n/// test\r\n///--------",
            options: ["always", { markers: ["/"], exceptions: ["-"] }]
        },
        {
            code: "///--------\r\n/// test\r\n///--------\r\n/* blah */",
            options: ["always", { markers: ["/"], exceptions: ["-"], block: { markers: [] } }]
        },
        {
            code: "/***\u2028*/",
            options: ["always", { exceptions: ["*"] }]
        }
    ],

    invalid: [
        {
            code: "//An invalid comment NOT starting with space\nvar a = 1;",
            output: "// An invalid comment NOT starting with space\nvar a = 1;",
            options: ["always"],
            errors: [{
                messsage: "Expected space or tab after '//' in comment.",
                type: "Line"
            }]
        },
        {
            code: "// An invalid comment starting with space\nvar a = 2;",
            output: "//An invalid comment starting with space\nvar a = 2;",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after '//' in comment.",
                type: "Line"
            }]
        },
        {
            code: "//   An invalid comment starting with tab\nvar a = 2;",
            output: "//An invalid comment starting with tab\nvar a = 2;",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after '//' in comment.",
                type: "Line"
            }]
        },
        {

            /*
             * note that the first line in the comment is not a valid exception
             * block pattern because of the minus sign at the end of the line:
             * `//*********************-`
             */
            code: "//*********************-\n// Comment Block 3\n//***********************",
            output: "//* ********************-\n// Comment Block 3\n//***********************",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }],
            errors: [{
                message: "Expected exception block, space or tab after '//*' in comment.",
                type: "Line"
            }]
        },
        {
            code: "//-=-=-=-=-=-=\n// A comment\n//-=-=-=-=-=-=",
            output: "// -=-=-=-=-=-=\n// A comment\n// -=-=-=-=-=-=",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }],
            errors: [
                {
                    message: "Expected exception block, space or tab after '//' in comment.",
                    type: "Line"
                },
                {
                    message: "Expected exception block, space or tab after '//' in comment.",
                    type: "Line"
                }
            ]
        },
        {
            code: "//!<docblock style comment",
            output: "//!< docblock style comment",
            options: ["always", {
                markers: ["/", "!<"]
            }],
            errors: 1
        },
        {
            code: "//!< docblock style comment",
            output: "//!<docblock style comment",
            options: ["never", {
                markers: ["/", "!<"]
            }],
            errors: 1
        },
        {
            code: "var a = 1; /* A valid comment starting with space */",
            output: "var a = 1; /*A valid comment starting with space */",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "var a = 1; /*######*/",
            output: "var a = 1; /* ######*/",
            options: ["always", {
                exceptions: ["-", "=", "*", "!@#"]
            }],
            errors: [{
                message: "Expected exception block, space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "var a = 1; /*A valid comment NOT starting with space */",
            output: "var a = 1; /* A valid comment NOT starting with space */",
            options: ["always"],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(/* height */a) { \n }",
            output: "function foo(/*height */a) { \n }",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(/*height */a) { \n }",
            output: "function foo(/* height */a) { \n }",
            options: ["always"],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(a/*height */) { \n }",
            output: "function foo(a/* height */) { \n }",
            options: ["always"],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "/*     \n *Test\n */",
            output: "/*\n *Test\n */",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "//-----------------------\n// A comment\n//-----------------------",
            output: "// -----------------------\n// A comment\n// -----------------------",
            options: ["always", {
                block: { exceptions: ["-", "=", "*", "#", "!@#"] }
            }],
            errors: [
                { message: "Expected space or tab after '//' in comment.", type: "Line" },
                { message: "Expected space or tab after '//' in comment.", type: "Line" }
            ]
        },
        {
            code: "var a = 1; /*######*/",
            output: "var a = 1; /* ######*/",
            options: ["always", {
                line: { exceptions: ["-", "=", "*", "#", "!@#"] }
            }],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "//!< docblock style comment",
            output: "// !< docblock style comment",
            options: ["always", {
                block: { markers: ["/", "!<"] }
            }],
            errors: [{
                message: "Expected space or tab after '//' in comment.",
                type: "Line"
            }]
        },
        {
            code: "/*!\n *comment\n */",
            output: "/* !\n *comment\n */",
            options: ["always", { line: { markers: ["!"] } }],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "///--------\r\n/// test\r\n///--------\r\n/*/ blah *//*-----*/",
            output: "///--------\r\n/// test\r\n///--------\r\n/* / blah *//*-----*/",
            options: ["always", { markers: ["/"], exceptions: ["-"], block: { markers: [] } }],
            errors: [{
                message: "Expected exception block, space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "///--------\r\n/// test\r\n///--------\r\n/*/ blah */ /*-----*/",
            output: "///--------\r\n/// test\r\n///--------\r\n/* / blah */ /* -----*/",
            options: ["always", { line: { markers: ["/"], exceptions: ["-"] } }],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block",
                line: 4,
                column: 1
            }, {
                message: "Expected space or tab after '/*' in comment.",
                type: "Block",
                line: 4,
                column: 13
            }]
        },

        // balanced block comments
        {
            code: "var a = 1; /* A balanced comment starting with space*/",
            output: "var a = 1; /* A balanced comment starting with space */",
            options: ["always", { block: { balanced: true } }],
            errors: [{
                message: "Expected space or tab before '*/' in comment.",
                type: "Block"
            }]
        },
        {
            code: "var a = 1; /*A balanced comment NOT starting with space */",
            output: "var a = 1; /*A balanced comment NOT starting with space*/",
            options: ["never", { block: { balanced: true } }],
            errors: [{
                message: "Unexpected space or tab before '*/' in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(/* height*/a) { \n }",
            output: "function foo(/* height */a) { \n }",
            options: ["always", { block: { balanced: true } }],
            errors: [{
                message: "Expected space or tab before '*/' in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(/*height */a) { \n }",
            output: "function foo(/*height*/a) { \n }",
            options: ["never", { block: { balanced: true } }],
            errors: [{
                message: "Unexpected space or tab before '*/' in comment.",
                type: "Block"
            }]
        },
        {
            code: "/*! comment*/",
            output: "/*! comment */",
            options: ["always", { markers: ["!"], block: { balanced: true } }],
            errors: [{
                message: "Expected space or tab before '*/' in comment.",
                type: "Block"
            }]
        },
        {
            code: "/*!comment */",
            output: "/*!comment*/",
            options: ["never", { markers: ["!"], block: { balanced: true } }],
            errors: [{
                message: "Unexpected space or tab before '*/' in comment.",
                type: "Block"
            }]
        },

        // Parser errors
        {
            code: invalidShebangProgram,
            output: null,
            options: ["always"],
            errors: 1
        },
        {
            code: invalidShebangProgram,
            output: null,
            options: ["never"],
            errors: 1
        }
    ]

});
