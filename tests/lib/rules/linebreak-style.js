/**
 * @fileoverview No mixed linebreaks
 * @author Erik Mueller
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/linebreak-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

const EXPECTED_LF_MSG = "Expected linebreaks to be 'LF' but found 'CRLF'.",
    EXPECTED_CRLF_MSG = "Expected linebreaks to be 'CRLF' but found 'LF'.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("linebreak-style", rule, {

    valid: [
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n",
            args: [2]
        },
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n",
            options: ["unix"]
        },
        {
            code: "var a = 'a',\r\n b = 'b';\r\n\r\n function foo(params) {\r\n /* do stuff */ \r\n }\r\n",
            options: ["windows"]
        },
        {
            code: "var b = 'b';",
            options: ["unix"]
        },
        {
            code: "var b = 'b';",
            options: ["windows"]
        }
    ],

    invalid: [
        {
            code: "var a = 'a';\r\n",
            output: "var a = 'a';\n",
            args: [2],
            errors: [{
                line: 1,
                column: 13,
                message: EXPECTED_LF_MSG
            }]
        },
        {
            code: "var a = 'a';\r\n",
            output: "var a = 'a';\n",
            options: ["unix"],
            errors: [{
                line: 1,
                column: 13,
                message: EXPECTED_LF_MSG
            }]
        },
        {
            code: "var a = 'a';\n",
            output: "var a = 'a';\r\n",
            options: ["windows"],
            errors: [{
                line: 1,
                column: 13,
                message: EXPECTED_CRLF_MSG
            }]
        },
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\r\n /* do stuff */ \n }\r\n",
            output: "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n",
            args: [2],
            errors: [{
                line: 4,
                column: 24,
                message: EXPECTED_LF_MSG
            },
            {
                line: 6,
                column: 3,
                message: EXPECTED_LF_MSG
            }]
        },
        {
            code: "var a = 'a',\r\n b = 'b';\r\n\n function foo(params) {\r\n\n /* do stuff */ \n }\r\n",
            output: "var a = 'a',\r\n b = 'b';\r\n\r\n function foo(params) {\r\n\r\n /* do stuff */ \r\n }\r\n",
            options: ["windows"],
            errors: [{
                line: 3,
                column: 1,
                message: EXPECTED_CRLF_MSG
            },
            {
                line: 5,
                column: 1,
                message: EXPECTED_CRLF_MSG
            },
            {
                line: 6,
                column: 17,
                message: EXPECTED_CRLF_MSG
            }]
        }
    ]
});
