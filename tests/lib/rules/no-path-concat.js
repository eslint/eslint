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

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-path-concat", rule, {

    valid: [
        "var fullPath = dirname + \"foo.js\";",
        "var fullPath = __dirname == \"foo.js\";",
        "if (fullPath === __dirname) {}",
        "if (__dirname === fullPath) {}",
        "var fullPath = `${dirname}/foo.js`;",
        "var fullPath = `${filename}/foo.js`;",
        "var fullPath = __dirname == `${dirname}/foo.js`;",
        "if(__filename === `${filename}/foo.js`){}"
    ],

    invalid: [
        {
            code: "var fullPath = __dirname + \"/foo.js\";",
            errors: [{
                message: "Use path.join() or path.resolve() instead of concatenation to create paths.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "var fullPath = __filename + \"/foo.js\";",
            errors: [{
                message: "Use path.join() or path.resolve() instead of concatenation to create paths.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "var fullPath = \"/foo.js\" + __filename;",
            errors: [{
                message: "Use path.join() or path.resolve() instead of concatenation to create paths.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "var fullPath = \"/foo.js\" + __dirname;",
            errors: [{
                message: "Use path.join() or path.resolve() instead of concatenation to create paths.",
                type: "BinaryExpression"
            }]
        },
        {
            code: "var fullPath = `${__dirname}/foo.js`",
            errors: [{
                message: "Use path.join() or path.resolve() instead of concatenation to create paths.",
                type: "TemplateLiteral"
            }]
        },
        {
            code: "var fullPath = `/foo.js${__dirname}`",
            errors: [{
                message: "Use path.join() or path.resolve() instead of concatenation to create paths.",
                type: "TemplateLiteral"
            }]
        },
        {
            code: "var fullPath = `${__filename}/foo.js`",
            errors: [{
                message: "Use path.join() or path.resolve() instead of concatenation to create paths.",
                type: "TemplateLiteral"
            }]
        },
        {
            code: "var fullPath = `/foo.js${__filename}`",
            errors: [{
                message: "Use path.join() or path.resolve() instead of concatenation to create paths.",
                type: "TemplateLiteral"
            }]
        }
    ]
});
