/**
 * @fileoverview Check, that file is ended with newline, and there are no multiple empty lines at the end.
 * @author Nodeca Team <https://github.com/nodeca>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/eol-last"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
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
        {
            code: "var a = 123;\n\n\n\n\n\n\n\n\n\n",
            options: [{"max": 10}]
        },
        {
            code: "var a = 123;\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n",
            options: [{"type": "windows", "max": 10}]
        }
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
            options: [{"type": "windows"}],
            errors: [{ message: "Newline required at end of file but not found.", type: "Program" }],
            output: "var a = 123;\r\n"
        },
        {
            code: "var a = 123;\r\n   ",
            options: [{"type": "windows"}],
            errors: [{ message: "Newline required at end of file but not found.", type: "Program" }],
            output: "var a = 123;\r\n   \r\n"
        },
        {
            code: "var a = 123;\n\n",
            options: [{"max": 1}],
            errors: [{ message: "Too many newlines at end of file.", type: "Program" }],
            output: "var a = 123;\n"
        },
        {
            code: "var a = 123;\n\n\n\n\n\n\n\n\n\n",
            options: [{"max": 5}],
            errors: [{ message: "Too many newlines at end of file.", type: "Program" }],
            output: "var a = 123;\n\n\n\n\n"
        },
        {
            code: "var a = 123;\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n",
            options: [{"type": "windows", "max": 5}],
            errors: [{ message: "Too many newlines at end of file.", type: "Program" }],
            output: "var a = 123;\r\n\r\n\r\n\r\n\r\n"
        }
    ]
});
