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

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("linebreak-style", rule, {

    valid: [
        "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n",
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
            errors: [{
                line: 1,
                column: 13,
                messageId: "expectedLF"
            }]
        },
        {
            code: "var a = 'a';\r\n",
            output: "var a = 'a';\n",
            options: ["unix"],
            errors: [{
                line: 1,
                column: 13,
                messageId: "expectedLF"
            }]
        },
        {
            code: "var a = 'a';\n",
            output: "var a = 'a';\r\n",
            options: ["windows"],
            errors: [{
                line: 1,
                column: 13,
                messageId: "expectedCRLF"
            }]
        },
        {
            code: "var a = 'a',\n b = 'b';\n\n function foo(params) {\r\n /* do stuff */ \n }\r\n",
            output: "var a = 'a',\n b = 'b';\n\n function foo(params) {\n /* do stuff */ \n }\n",
            errors: [{
                line: 4,
                column: 24,
                messageId: "expectedLF"
            },
            {
                line: 6,
                column: 3,
                messageId: "expectedLF"
            }]
        },
        {
            code: "var a = 'a',\r\n b = 'b';\r\n\n function foo(params) {\r\n\n /* do stuff */ \n }\r\n",
            output: "var a = 'a',\r\n b = 'b';\r\n\r\n function foo(params) {\r\n\r\n /* do stuff */ \r\n }\r\n",
            options: ["windows"],
            errors: [{
                line: 3,
                column: 1,
                messageId: "expectedCRLF"
            },
            {
                line: 5,
                column: 1,
                messageId: "expectedCRLF"
            },
            {
                line: 6,
                column: 17,
                messageId: "expectedCRLF"
            }]
        }
    ]
});
