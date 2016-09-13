/**
 * @fileoverview Tests for eol-last rule.
 * @author Nodeca Team <https://github.com/nodeca>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/eol-last"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("eol-last", rule, {

    valid: [
        "",
        "\n",
        "var a = 123;\n",
        "var a = 123;\n\n",
        "var a = 123;\n   \n",

        "\r\n",
        "var a = 123;\r\n",
        "var a = 123;\r\n\r\n",
        "var a = 123;\r\n   \r\n",

        { code: "var a = 123;", options: ["never"] },
        { code: "var a = 123;\nvar b = 456;", options: ["never"] },
        { code: "var a = 123;\r\nvar b = 456;", options: ["never"] },

        // Deprecated: `"unix"` parameter
        { code: "", options: ["unix"] },
        { code: "\n", options: ["unix"] },
        { code: "var a = 123;\n", options: ["unix"] },
        { code: "var a = 123;\n\n", options: ["unix"] },
        { code: "var a = 123;\n   \n", options: ["unix"] },

        // Deprecated: `"windows"` parameter
        { code: "", options: ["windows"] },
        { code: "\n", options: ["windows"] },
        { code: "\r\n", options: ["windows"] },
        { code: "var a = 123;\r\n", options: ["windows"] },
        { code: "var a = 123;\r\n\r\n", options: ["windows"] },
        { code: "var a = 123;\r\n   \r\n", options: ["windows"] }
    ],

    invalid: [
        {
            code: "var a = 123;",
            errors: [{ message: "Newline required at end of file but not found.", type: "Program" }],
            output: "var a = 123;\n"
        },
        {
            code: "var a = 123;\n   ",
            errors: [{ message: "Newline required at end of file but not found.", type: "Program" }],
            output: "var a = 123;\n   \n"
        },
        {
            code: "var a = 123;\n",
            options: ["never"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;"
        },
        {
            code: "var a = 123;\r\n",
            options: ["never"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;"
        },
        {
            code: "var a = 123;\r\n\r\n",
            options: ["never"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;"
        },
        {
            code: "var a = 123;\nvar b = 456;\n",
            options: ["never"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;\nvar b = 456;"
        },
        {
            code: "var a = 123;\r\nvar b = 456;\r\n",
            options: ["never"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;\r\nvar b = 456;"
        },
        {
            code: "var a = 123;\n\n",
            options: ["never"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;"
        },

        // Deprecated: `"unix"` parameter
        {
            code: "var a = 123;",
            options: ["unix"],
            errors: [{ message: "Newline required at end of file but not found.", type: "Program" }],
            output: "var a = 123;\n"
        },
        {
            code: "var a = 123;\n   ",
            options: ["unix"],
            errors: [{ message: "Newline required at end of file but not found.", type: "Program" }],
            output: "var a = 123;\n   \n"
        },

        // Deprecated: `"windows"` parameter
        {
            code: "var a = 123;",
            options: ["windows"],
            errors: [{ message: "Newline required at end of file but not found.", type: "Program" }],
            output: "var a = 123;\r\n"
        },
        {
            code: "var a = 123;\r\n   ",
            options: ["windows"],
            errors: [{ message: "Newline required at end of file but not found.", type: "Program" }],
            output: "var a = 123;\r\n   \r\n"
        }
    ]
});
