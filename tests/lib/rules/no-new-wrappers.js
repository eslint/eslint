/**
 * @fileoverview Tests for no-new-wrappers rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-wrappers"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new-wrappers", rule, {
    valid: [
        "var a = new Object();",
        "var a = String('test'), b = String.fromCharCode(32);"
    ],
    invalid: [
        {
            code: "var a = new String('hello');",
            errors: [{
                messageId: "noConstructor",
                data: {
                    fn: "String"
                },
                type: "NewExpression"
            }]
        },
        {
            code: "var a = new Number(10);",
            errors: [{
                messageId: "noConstructor",
                data: {
                    fn: "Number"
                },
                type: "NewExpression"
            }]
        },
        {
            code: "var a = new Boolean(false);",
            errors: [{
                messageId: "noConstructor",
                data: {
                    fn: "Boolean"
                },
                type: "NewExpression"
            }]
        }
    ]
});
