/**
 * @fileoverview Test for spaced-comments
 * @author Gyandeep Singh
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 * @copyright 2014 Greg Cochard. All rights reserved.
 */
"use strict";

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint),
    validShebangProgram = "#!/path/to/node\nvar a = 3;",
    invalidShebangProgram = "#!/path/to/node\n#!/second/shebang\nvar a = 3;";

eslintTester.addRuleTest("lib/rules/spaced-comment", {

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
        {
            code: "//-----------------------\n// A comment\n//-----------------------",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
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
        {
            code: "//!< docblock style comment",
            options: ["always", {
                markers: ["/", "!<"]
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
        {
            code: "var a = 1; /*######*/",
            options: ["always", {
                exceptions: ["-", "=", "*", "#", "!@#"]
            }]
        },
        {
            code: "var a = 1; /*# This is an example of a marker in a block comment\nsubsequent lines do not count*/",
            options: ["always", {
                markers: ["#"]
            }]
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
            code: "/*!\n *comment\n */",
            options: ["always", { markers: ["!"] }]
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
        }

    ],

    invalid: [
        {
            code: "//An invalid comment NOT starting with space\nvar a = 1;",
            errors: [{
                messsage: "Expected space or tab after // in comment.",
                type: "Line"
            }],
            options: ["always"]
        },
        {
            code: "// An invalid comment starting with space\nvar a = 2;",
            errors: [{
                message: "Unexpected space or tab after // in comment.",
                type: "Line"
            }],
            options: ["never"]
        },
        {
            code: "//   An invalid comment starting with tab\nvar a = 2;",
            errors: [{
                message: "Unexpected space or tab after // in comment.",
                type: "Line"
            }],
            options: ["never"]
        },
        {
            code: "//*********************-\n// Comment Block 3\n//***********************",
            errors: [{
                message: "Expected exception block, space or tab after // in comment.",
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
                    message: "Expected exception block, space or tab after // in comment.",
                    type: "Line"
                },
                {
                    message: "Expected exception block, space or tab after // in comment.",
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
                message: "Unexpected space or tab after /* in comment.",
                type: "Block"
            }]
        },
        {
            code: "var a = 1; /*######*/",
            options: ["always", {
                exceptions: ["-", "=", "*", "!@#"]
            }],
            errors: [{
                message: "Expected exception block, space or tab after /* in comment.",
                type: "Block"
            }]
        },
        {
            code: "var a = 1; /*A valid comment NOT starting with space */",
            options: ["always"],
            errors: [{
                message: "Expected space or tab after /* in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(/* height */a) { \n }",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after /* in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(/*height */a) { \n }",
            options: ["always"],
            errors: [{
                message: "Expected space or tab after /* in comment.",
                type: "Block"
            }]
        },
        {
            code: "function foo(a/*height */) { \n }",
            options: ["always"],
            errors: [{
                message: "Expected space or tab after /* in comment.",
                type: "Block"
            }]
        },
        {
            code: "/*     \n *Test\n */",
            options: ["never"],
            errors: [{
                message: "Unexpected space or tab after /* in comment.",
                type: "Block"
            }]
        }
    ]

});
