/**
 * @fileoverview No mixed linebreaks
 * @author Erik Mueller
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const os = require("os"),
    rule = require("../../../lib/rules/linebreak-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

const EXPECTED_LF_MSG = "Expected linebreaks to be 'LF' but found 'CRLF'.",
    EXPECTED_CRLF_MSG = "Expected linebreaks to be 'CRLF' but found 'LF'.",
    EXPECTED_NATIVE_EOL_MSG = os.EOL === "\n" ? EXPECTED_LF_MSG : EXPECTED_CRLF_MSG,
    badEOL = os.EOL === "\n" ? "\r\n" : "\n";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("linebreak-style", rule, {

    valid: [
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n"
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
            code: `var a = 'a',${os.EOL} b = 'b';${os.EOL}${os.EOL} function foo(params) {${os.EOL} /* do stuff */ ${os.EOL} }${os.EOL}`,
            options: ["native"]
        },
        {
            code: "var b = 'b';",
            options: ["unix"]
        },
        {
            code: "var b = 'b';",
            options: ["windows"]
        },
        {
            code: "var b = 'b';",
            options: ["native"]
        }
    ],

    invalid: [
        {
            code: "var a = 'a';\r\n",
            output: "var a = 'a';\n",
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
            code: `var a = 'a';${badEOL}`,
            output: `var a = 'a';${os.EOL}`,
            options: ["native"],
            errors: [{
                line: 1,
                column: 13,
                message: EXPECTED_NATIVE_EOL_MSG
            }]
        },
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\r\n /* do stuff */ \n }\r\n",
            output: "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n",
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
        },




        {
            code: `var a = 'a',${os.EOL} b = 'b';${badEOL}${os.EOL} function foo(params) {${os.EOL}${badEOL} /* do stuff */ ${badEOL} }${os.EOL}`,
            output: `var a = 'a',${os.EOL} b = 'b';${os.EOL}${os.EOL} function foo(params) {${os.EOL}${os.EOL} /* do stuff */ ${os.EOL} }${os.EOL}`,
            options: ["native"],
            errors: [{
                line: 2,
                column: 10,
                message: EXPECTED_NATIVE_EOL_MSG
            },
            {
                line: 5,
                column: 1,
                message: EXPECTED_NATIVE_EOL_MSG
            },
            {
                line: 6,
                column: 17,
                message: EXPECTED_NATIVE_EOL_MSG
            }]
        }
    ]
});
