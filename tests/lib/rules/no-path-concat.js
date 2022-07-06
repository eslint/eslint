/**
 * @fileoverview Disallow string concatenation when using __dirname and __filename
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-path-concat"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-path-concat", rule, {

    valid: [
        "var fullPath = dirname + \"foo.js\";",
        "var fullPath = __dirname == \"foo.js\";",
        "if (fullPath === __dirname) {}",
        "if (__dirname === fullPath) {}"
    ],

    invalid: [
        {
            code: "var fullPath = __dirname + \"/foo.js\";",
            errors: [{
                messageId: "usePathFunctions",
                type: "BinaryExpression"
            }]
        },
        {
            code: "var fullPath = __filename + \"/foo.js\";",
            errors: [{
                messageId: "usePathFunctions",
                type: "BinaryExpression"
            }]
        },
        {
            code: "var fullPath = \"/foo.js\" + __filename;",
            errors: [{
                messageId: "usePathFunctions",
                type: "BinaryExpression"
            }]
        },
        {
            code: "var fullPath = \"/foo.js\" + __dirname;",
            errors: [{
                messageId: "usePathFunctions",
                type: "BinaryExpression"
            }]
        }
    ]
});
