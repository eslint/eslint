/**
 * @fileoverview Check, that file is ended with newline, and there are no multiple empty lines at the end.
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

        { code: "var a = 123;", options: ["none"] },
        { code: "var a = 123;\nvar b = 456;", options: ["none"] },
        { code: "var a = 123;\r\nvar b = 456;", options: ["none"] }
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
        },
        {
            code: "var a = 123;\n",
            options: ["none"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;"
        },
        {
            code: "var a = 123;\r\n",
            options: ["none"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;"
        },
        {
            code: "var a = 123;\r\n\r\n",
            options: ["none"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;"
        },
        {
            code: "var a = 123;\nvar b = 456;\n",
            options: ["none"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;\nvar b = 456;"
        },
        {
            code: "var a = 123;\r\nvar b = 456;\r\n",
            options: ["none"],
            errors: [{ message: "Newline not allowed at end of file.", type: "Program" }],
            output: "var a = 123;\r\nvar b = 456;"
        }
    ]
});
