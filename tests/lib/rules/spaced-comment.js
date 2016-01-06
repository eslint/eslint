/**
 * @fileoverview Test for spaced-comments
 * @author Gyandeep Singh
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 * @copyright 2014 Greg Cochard. All rights reserved.
 */
"use strict";

var rule = require("../../../lib/rules/spaced-comment"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester(),
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
            code: "var a = 1; /* A valid comment starting with space */",
            options: ["always"]
        },

        // block comments
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

        // markers & exceptions
        {
            code: "///--------\r\n/// test\r\n///--------",
            options: ["always", { markers: ["/"], exceptions: ["-"] }]
        },
        {
            code: "///--------\r\n/// test\r\n///--------\r\n/* blah */",
            options: ["always", { markers: ["/"], exceptions: ["-"], block: { markers: [] } }]
        }
    ],

    invalid: [
        {
            code: "//An invalid comment NOT starting with space\nvar a = 1;",
            errors: [{
                messsage: "Expected space or tab after '//' in comment.",
                type: "Line"
            }],
            options: ["always"]
        },
        {
            code: "// An invalid comment starting with space\nvar a = 2;",
            errors: [{
                message: "Unexpected space or tab after '//' in comment.",
                type: "Line"
            }],
            options: ["never"]
        },
        {
            code: "//   An invalid comment starting with tab\nvar a = 2;",
            errors: [{
                message: "Unexpected space or tab after '//' in comment.",
                type: "Line"
            }],
            options: ["never"]
        },
        {
            code: "//*********************-\n// Comment Block 3\n//***********************",
            errors: [{
                message: "Expected exception block, space or tab after '//' in comment.",
                type: "Line"
            }],
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }]
        },
        {
            code: "//-=-=-=-=-=-=\n// A comment\n//-=-=-=-=-=-=",
            errors: [
                {
                    message: "Expected exception block, space or tab after '//' in comment.",
                    type: "Line"
                },
                {
                    message: "Expected exception block, space or tab after '//' in comment.",
                    type: "Line"
                }
            ],
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }]
        },
        {
            code: "//!<docblock style comment",
            errors: 1,
            options: ["always", {
                markers: ["/", "!<"]
            }]
        },
        {
            code: "//!< docblock style comment",
            errors: 1,
            options: ["never", {
                markers: ["/", "!<"]
            }]
        },
        {
            code: invalidShebangProgram,
            errors: 1,
            options: ["always"]
        },
        {
            code: invalidShebangProgram,
            errors: 1,
            options: ["never"]
        },
        {
            code: "var a = 1; /* A valid comment starting with space */",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "var a = 1; /*######*/",
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
            options: ["always"],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(/* height */a) { \n }",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(/*height */a) { \n }",
            options: ["always"],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(a/*height */) { \n }",
            options: ["always"],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "/*     \n *Test\n */",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "//-----------------------\n// A comment\n//-----------------------",
            options: ["always", {
                block: { exceptions: ["-", "=", "*", "#", "!@#"] }
            }],
            errors: [
                { message: "Expected space or tab after '//' in comment.", type: "Line"},
                { message: "Expected space or tab after '//' in comment.", type: "Line"}
            ]
        },
        {
            code: "var a = 1; /*######*/",
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
            options: ["always", { line: { markers: ["!"] } }],
            errors: [{
                message: "Expected space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "///--------\r\n/// test\r\n///--------\r\n/*/ blah *//*-----*/",
            options: ["always", { markers: ["/"], exceptions: ["-"], block: { markers: [] } }],
            errors: [{
                message: "Expected exception block, space or tab after '/*' in comment.",
                type: "Block"
            }]
        },
        {
            code: "///--------\r\n/// test\r\n///--------\r\n/*/ blah */ /*-----*/",
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
        }
    ]

});
