/**
 * @fileoverview No mixed linebreaks
 * @author Erik Mueller
 * @copyright 2015 Varun Verma. All rights reserverd.
 * @copyright 2015 James Whitney. All rights reserved.
 * @copyright 2015 Erik Mueller. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

var EXPECTED_LF_MSG = "Expected linebreaks to be 'LF' but found 'CRLF'.",
    EXPECTED_CRLF_MSG = "Expected linebreaks to be 'CRLF' but found 'LF'.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/linebreak-style", {

    valid: [
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n",
            args: [2]
        },
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n",
            args: [2, "unix"]
        },
        {
            code: "var a = 'a',\r\n b = 'b';\r\n\r\n function foo(params) {\r\n /* do stuff */ \r\n }\r\n",
            args: [2, "windows"]
        },
        {
            code: "var b = 'b';",
            args: [2, "unix"]
        },
        {
            code: "var b = 'b';",
            args: [2, "windows"]
        }
    ],

    invalid: [
        {
            code: "var a = 'a';\r\n",
            args: [2],
            errors: [{
                line: 1,
                column: 13,
                message: EXPECTED_LF_MSG
            }]
        },
        {
            code: "var a = 'a';\r\n",
            args: [2, "unix"],
            errors: [{
                line: 1,
                column: 13,
                message: EXPECTED_LF_MSG
            }]
        },
        {
            code: "var a = 'a';\n",
            args: [2, "windows"],
            errors: [{
                line: 1,
                column: 13,
                message: EXPECTED_CRLF_MSG
            }]
        },
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\r\n /* do stuff */ \n }\r\n",
            args: [2],
            errors: [{
                line: 4,
                column: 24,
                message: EXPECTED_LF_MSG
            }]
        },
        {
            code: "var a = 'a',\r\n b = 'b';\r\n\n function foo(params) {\r\n /* do stuff */ \n }\r\n",
            args: [2, "windows"],
            errors: [{
                line: 3,
                column: 1,
                message: EXPECTED_CRLF_MSG
            }]
        }
    ]
});
