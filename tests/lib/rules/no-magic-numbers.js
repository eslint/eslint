/**
 * @fileoverview Tests for no-magic-numbers rule.
 * @author Vincent Lemeunier
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-magic-numbers"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-magic-numbers", rule, {
    valid: [
        "var x = parseInt(y, 10);",
        "var x = parseInt(y, -10);",
        "var x = Number.parseInt(y, 10);",
        {
            code: "const foo = 42;",
            env: { es6: true }
        },
        {
            code: "var foo = 42;",
            options: [{
                enforceConst: false
            }],
            env: { es6: true }
        },
        "var foo = -42;",
        {
            code: "var foo = 0 + 1 - 2 + -2;",
            options: [{
                ignore: [0, 1, 2, -2]
            }]
        },
        {
            code: "var foo = 0 + 1 + 2 + 3 + 4;",
            options: [{
                ignore: [0, 1, 2, 3, 4]
            }]
        },
        "var foo = { bar:10 }",
        {
            code: "setTimeout(function() {return 1;}, 0);",
            options: [{
                ignore: [0, 1]
            }]
        },
        {
            code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "var a = <input maxLength={10} />;",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        {
            code: "var a = <div objectProp={{ test: 1}}></div>;",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        }
    ],
    invalid: [
        {
            code: "var foo = 42",
            options: [{
                enforceConst: true
            }],
            errors: [{ messageId: "useConst" }],
            env: { es6: true }
        },
        {
            code: "var foo = 0 + 1;",
            errors: [
                { messageId: "noMagic", data: { raw: "0" } },
                { messageId: "noMagic", data: { raw: "1" } }
            ]
        },
        {
            code: "a = a + 5;",
            errors: [
                { messageId: "noMagic", data: { raw: "5" } }
            ]
        },
        {
            code: "a += 5;",
            errors: [
                { messageId: "noMagic", data: { raw: "5" } }
            ]
        },
        {
            code: "var foo = 0 + 1 + -2 + 2;",
            errors: [
                { messageId: "noMagic", data: { raw: "0" } },
                { messageId: "noMagic", data: { raw: "1" } },
                { messageId: "noMagic", data: { raw: "-2" } },
                { messageId: "noMagic", data: { raw: "2" } }
            ]
        },
        {
            code: "var foo = 0 + 1 + 2;",
            options: [{
                ignore: [0, 1]
            }],
            errors: [
                { messageId: "noMagic", data: { raw: "2" } }
            ]
        },
        {
            code: "var foo = { bar:10 }",
            options: [{
                detectObjects: true
            }],
            errors: [
                { messageId: "noMagic", data: { raw: "10" } }
            ]
        }, {
            code: "console.log(0x1A + 0x02); console.log(071);",
            errors: [
                { messageId: "noMagic", data: { raw: "0x1A" } },
                { messageId: "noMagic", data: { raw: "0x02" } },
                { messageId: "noMagic", data: { raw: "071" } }
            ]
        }, {
            code: "var stats = {avg: 42};",
            options: [{
                detectObjects: true
            }],
            errors: [
                { messageId: "noMagic", data: { raw: "42" } }
            ]
        }, {
            code: "var colors = {}; colors.RED = 2; colors.YELLOW = 3; colors.BLUE = 4 + 5;",
            errors: [
                { messageId: "noMagic", data: { raw: "4" } },
                { messageId: "noMagic", data: { raw: "5" } }
            ]
        },
        {
            code: "function getSecondsInMinute() {return 60;}",
            errors: [
                { message: "No magic number: 60." }
            ]
        },
        {
            code: "function getNegativeSecondsInMinute() {return -60;}",
            errors: [
                { messageId: "noMagic", data: { raw: "-60" } }
            ]
        },
        {
            code: "var Promise = require('bluebird');\n" +
                "var MINUTE = 60;\n" +
                "var HOUR = 3600;\n" +
                "const DAY = 86400;\n" +
                "var configObject = {\n" +
                  "key: 90,\n" +
                  "another: 10 * 10,\n" +
                  "10: 'an \"integer\" key'\n" +
                "};\n" +
                "function getSecondsInDay() {\n" +
                 " return 24 * HOUR;\n" +
                "}\n" +
                "function getMillisecondsInDay() {\n" +
                  "return (getSecondsInDay() *\n" +
                    "(1000)\n" +
                  ");\n" +
                "}\n" +
                "function callSetTimeoutZero(func) {\n" +
                  "setTimeout(func, 0);\n" +
                "}\n" +
                "function invokeInTen(func) {\n" +
                  "setTimeout(func, 10);\n" +
                "}\n",
            errors: [
                { messageId: "noMagic", data: { raw: "10" }, line: 7 },
                { messageId: "noMagic", data: { raw: "10" }, line: 7 },
                { messageId: "noMagic", data: { raw: "24" }, line: 11 },
                { messageId: "noMagic", data: { raw: "1000" }, line: 15 },
                { messageId: "noMagic", data: { raw: "0" }, line: 19 },
                { messageId: "noMagic", data: { raw: "10" }, line: 22 }
            ],
            env: { es6: true }
        },
        {
            code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
            options: [{}],
            errors: [{
                messageId: "noMagic", data: { raw: "3" }, line: 1
            }]
        },
        {
            code: "var a = <div arrayProp={[1,2,3]}></div>;",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            errors: [
                { messageId: "noMagic", data: { raw: "1" }, line: 1 },
                { messageId: "noMagic", data: { raw: "2" }, line: 1 },
                { messageId: "noMagic", data: { raw: "3" }, line: 1 }
            ]
        },
        {
            code: "var min, max, mean; min = 1; max = 10; mean = 4;",
            options: [{}],
            errors: [
                { messageId: "noMagic", data: { raw: "1" }, line: 1 },
                { messageId: "noMagic", data: { raw: "10" }, line: 1 },
                { messageId: "noMagic", data: { raw: "4" }, line: 1 }
            ]
        }
    ]
});
