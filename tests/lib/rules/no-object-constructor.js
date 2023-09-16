/**
 * @fileoverview Tests for the no-object-constructor rule
 * @author Francesco Trotta
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-object-constructor"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: "latest" } });

ruleTester.run("no-object-constructor", rule, {
    valid: [
        "new Object(x)",
        "Object(x)",
        "new globalThis.Object",
        "const createObject = Object => new Object()",
        "var Object; new Object;",
        {
            code: "new Object()",
            globals: {
                Object: "off"
            }
        }
    ],
    invalid: [
        {
            code: "new Object",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: "({})"
                }]
            }]
        },
        {
            code: "Object()",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: "({})"
                }]
            }]
        },
        {
            code: "const fn = () => Object();",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: "const fn = () => ({});"
                }]
            }]
        },
        {
            code: "Object() instanceof Object;",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    desc: "Replace with '({})'.",
                    messageId: "useLiteral",
                    output: "({}) instanceof Object;"
                }]
            }]
        },
        {
            code: "const obj = Object?.();",
            errors: [{
                messageId: "preferLiteral",
                type: "CallExpression",
                suggestions: [{
                    desc: "Replace with '{}'.",
                    messageId: "useLiteral",
                    output: "const obj = {};"
                }]
            }]
        },
        {
            code: "(new Object() instanceof Object);",
            errors: [{
                messageId: "preferLiteral",
                type: "NewExpression",
                suggestions: [{
                    desc: "Replace with '{}'.",
                    messageId: "useLiteral",
                    output: "({} instanceof Object);"
                }]
            }]
        }
    ]
});
