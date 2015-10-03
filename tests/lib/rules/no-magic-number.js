/**
 * @fileoverview Tests for complexity rule.
 * @author Vincent Lemeunier
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-magic-number"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-magic-number", rule, {
    valid: [
        {
            code: "const foo = 42;",
            env: { es6: true }
        },
        {
            code: "var foo = 42;",
            env: { es6: true },
            options: [{
                enforceConst: false
            }]
        },
        {
            code: "var foo = 0 + 1 + 2;"
        },
        {
            code: "var foo = 0 + 1 + 2 + 3 + 4;",
            options: [{
                ignore: [0, 1, 2, 3, 4]
            }]
        },
        {
            code: "var min, max, mean; min = 1; max = 10; mean = 4;"
        },
        {
            code: "var foo = { bar:10 }"
        },
        {
            code: "setTimeout(function() {return 1;}, 0);"
        }
    ],
    invalid: [
        {
            code: "var foo = 42",
            env: { es6: true },
            options: [{
                enforceConst: true
            }],
            errors: [{
                message: "Number constants declarations must use 'const'"
            }]
        },
        {
            code: "var foo = 0 + 1 + 2;",
            options: [{
                ignore: [0, 1]
            }],
            errors: [
                { message: "No magic number: 2"}
            ]
        },
        {
            code: "var foo = { bar:10 }",
            options: [{
                detectObjects: true
            }],
            errors: [
                { message: "No magic number: 10"}
            ]
        }, {
            code: "console.log(0x1A + 0x02); console.log(071);",
            errors: [
                { message: "No magic number: 0x1A"},
                { message: "No magic number: 071"}
            ]
        }, {
            code: "var stats = {avg: 42};",
            options: [{
                detectObjects: true
            }],
            errors: [
                { message: "No magic number: 42"}
            ]
        }, {
            code: "var colors = {}; colors.RED = 2; colors.YELLOW = 3; colors.BLUE = 4 + 5;",
            errors: [
                { message: "No magic number: 4"},
                { message: "No magic number: 5"}
            ]
        },
        {
            code: "function getSecondsInMinute() {return 60;}",
            errors: [
                { message: "No magic number: 60"}
            ]
        },
        {
            code: "var Promise = require('bluebird');var MINUTE = 60;" +
                "var HOUR = 3600;" +
                "const DAY = 86400;" +
                "var configObject = {" +
                  "key: 90," +
                  "another: 10 * 10," +
                  "10: 'an \"integer\" key'" +
                "};" +
                "function getSecondsInDay() {" +
                 " return 24 * HOUR;" +
                "}" +
                "function getMillisecondsInDay() {" +
                  "return (getSecondsInDay() *" +
                    "(1000)" +
                  ");" +
                "}" +
                "function callSetTimeoutZero(func) {" +
                  "setTimeout(func, 0);" +
                "}" +
                "function invokeInTen(func) {" +
                  "setTimeout(func, 10);" +
                "}",
            env: { es6: true },
            errors: [
                { message: "No magic number: 10"},
                { message: "No magic number: 10"},
                { message: "No magic number: 24"},
                { message: "No magic number: 1000"},
                { message: "No magic number: 10"}
            ]
        }
    ]
});
