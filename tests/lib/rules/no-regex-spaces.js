/**
 * @fileoverview Tests for regex-spaces rule.
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-regex-spaces"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("no-regex-spaces", rule, {
    valid: [
        "var foo = /bar {3}baz/;",
        "var foo = RegExp('bar {3}baz')",
        "var foo = new RegExp('bar {3}baz')",
        "var foo = /bar\t\t\tbaz/;",
        "var foo = RegExp('bar\t\t\tbaz');",
        "var foo = new RegExp('bar\t\t\tbaz');"
    ],

    invalid: [
        {
            code: "var foo = /bar    baz/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = RegExp('bar    baz');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = new RegExp('bar    baz');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "NewExpression"
                }
            ]
        }
    ]
});
