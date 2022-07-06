/**
 * @fileoverview Enforce spacing between rest and spread operators and their expressions.
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/rest-spread-spacing"),
    { RuleTester } = require("../../../lib/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("rest-spread-spacing", rule, {
    valid: [
        "fn(...args)",
        "fn(...(args))",
        "fn(...( args ))",
        { code: "fn(...args)", options: ["never"] },
        { code: "fn(... args)", options: ["always"] },
        { code: "fn(...\targs)", options: ["always"] },
        { code: "fn(...\nargs)", options: ["always"] },
        "[...arr, 4, 5, 6]",
        "[...(arr), 4, 5, 6]",
        "[...( arr ), 4, 5, 6]",
        { code: "[...arr, 4, 5, 6]", options: ["never"] },
        { code: "[... arr, 4, 5, 6]", options: ["always"] },
        { code: "[...\tarr, 4, 5, 6]", options: ["always"] },
        { code: "[...\narr, 4, 5, 6]", options: ["always"] },
        "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
        { code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];", options: ["never"] },
        { code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];", options: ["always"] },
        { code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];", options: ["always"] },
        { code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];", options: ["always"] },
        { code: "let n = { x, y, ...z };", parserOptions: { ecmaVersion: 2018 } },
        { code: "let n = { x, y, ...(z) };", parserOptions: { ecmaVersion: 2018 } },
        { code: "let n = { x, y, ...( z ) };", parserOptions: { ecmaVersion: 2018 } },
        { code: "let n = { x, y, ...z };", options: ["never"], parserOptions: { ecmaVersion: 2018 } },
        { code: "let n = { x, y, ... z };", options: ["always"], parserOptions: { ecmaVersion: 2018 } },
        { code: "let n = { x, y, ...\tz };", options: ["always"], parserOptions: { ecmaVersion: 2018 } },
        { code: "let n = { x, y, ...\nz };", options: ["always"], parserOptions: { ecmaVersion: 2018 } },
        { code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };", parserOptions: { ecmaVersion: 2018 } },
        { code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };", options: ["never"], parserOptions: { ecmaVersion: 2018 } },
        { code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };", options: ["always"], parserOptions: { ecmaVersion: 2018 } },
        { code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };", options: ["always"], parserOptions: { ecmaVersion: 2018 } },
        { code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };", options: ["always"], parserOptions: { ecmaVersion: 2018 } }
    ],

    invalid: [
        {
            code: "fn(... args)",
            output: "fn(...args)",
            errors: [{
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...  args)",
            output: "fn(...args)",
            errors: [{
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 9,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\targs)",
            output: "fn(...args)",
            errors: [{
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(... \t args)",
            output: "fn(...args)",
            errors: [{
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 10,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\nargs)",
            output: "fn(...args)",
            errors: [{
                line: 1,
                column: 7,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\n    args)",
            output: "fn(...args)",
            errors: [{
                line: 1,
                column: 7,
                endLine: 2,
                endColumn: 5,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\n\targs)",
            output: "fn(...args)",
            errors: [{
                line: 1,
                column: 7,
                endLine: 2,
                endColumn: 2,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(... args)",
            output: "fn(...args)",
            options: ["never"],
            errors: [{
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\targs)",
            output: "fn(...args)",
            options: ["never"],
            errors: [{
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\nargs)",
            output: "fn(...args)",
            options: ["never"],
            errors: [{
                line: 1,
                column: 7,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...args)",
            output: "fn(... args)",
            options: ["always"],
            errors: [{
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 7,
                messageId: "expectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(... (args))",
            output: "fn(...(args))",
            errors: [{
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(... ( args ))",
            output: "fn(...( args ))",
            errors: [{
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...(args))",
            output: "fn(... (args))",
            options: ["always"],
            errors: [{
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 7,
                messageId: "expectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...( args ))",
            output: "fn(... ( args ))",
            options: ["always"],
            errors: [{
                line: 1,
                column: 4,
                endLine: 1,
                endColumn: 7,
                messageId: "expectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[... arr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[...\tarr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[...\narr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            errors: [{
                line: 1,
                column: 5,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[... arr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            options: ["never"],
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[...\tarr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            options: ["never"],
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[...\narr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            options: ["never"],
            errors: [{
                line: 1,
                column: 5,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[...arr, 4, 5, 6]",
            output: "[... arr, 4, 5, 6]",
            options: ["always"],
            errors: [{
                line: 1,
                column: 2,
                endLine: 1,
                endColumn: 5,
                messageId: "expectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[... (arr), 4, 5, 6]",
            output: "[...(arr), 4, 5, 6]",
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[... ( arr ), 4, 5, 6]",
            output: "[...( arr ), 4, 5, 6]",
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6,
                messageId: "unexpectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[...(arr), 4, 5, 6]",
            output: "[... (arr), 4, 5, 6]",
            options: ["always"],
            errors: [{
                line: 1,
                column: 2,
                endLine: 1,
                endColumn: 5,
                messageId: "expectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "[...( arr ), 4, 5, 6]",
            output: "[... ( arr ), 4, 5, 6]",
            options: ["always"],
            errors: [{
                line: 1,
                column: 2,
                endLine: 1,
                endColumn: 5,
                messageId: "expectedWhitespace",
                data: { type: "spread" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            errors: [{
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16,
                messageId: "unexpectedWhitespace",
                data: { type: "rest" },
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            errors: [{
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16,
                messageId: "unexpectedWhitespace",
                data: { type: "rest" },
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            errors: [{
                line: 1,
                column: 15,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "rest" },
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            options: ["never"],
            errors: [{
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16,
                messageId: "unexpectedWhitespace",
                data: { type: "rest" },
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            options: ["never"],
            errors: [{
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16,
                messageId: "unexpectedWhitespace",
                data: { type: "rest" },
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            options: ["never"],
            errors: [{
                line: 1,
                column: 15,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "rest" },
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
            options: ["always"],
            errors: [{
                line: 1,
                column: 12,
                endLine: 1,
                endColumn: 15,
                messageId: "expectedWhitespace",
                data: { type: "rest" },
                type: "RestElement"
            }]
        },
        {
            code: "let n = { x, y, ... z };",
            output: "let n = { x, y, ...z };",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21,
                messageId: "unexpectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ...\tz };",
            output: "let n = { x, y, ...z };",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21,
                messageId: "unexpectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ...\nz };",
            output: "let n = { x, y, ...z };",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 20,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ... z };",
            output: "let n = { x, y, ...z };",
            options: ["never"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21,
                messageId: "unexpectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ...\tz };",
            output: "let n = { x, y, ...z };",
            options: ["never"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21,
                messageId: "unexpectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ...\nz };",
            output: "let n = { x, y, ...z };",
            options: ["never"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 20,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ...z };",
            output: "let n = { x, y, ... z };",
            options: ["always"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 20,
                messageId: "expectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ... (z) };",
            output: "let n = { x, y, ...(z) };",
            options: ["never"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21,
                messageId: "unexpectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ... ( z ) };",
            output: "let n = { x, y, ...( z ) };",
            options: ["never"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21,
                messageId: "unexpectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ...(z) };",
            output: "let n = { x, y, ... (z) };",
            options: ["always"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 20,
                messageId: "expectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let n = { x, y, ...( z ) };",
            output: "let n = { x, y, ... ( z ) };",
            options: ["always"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 20,
                messageId: "expectedWhitespace",
                data: { type: "spread property" },
                type: "SpreadElement"
            }]
        },
        {
            code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17,
                messageId: "unexpectedWhitespace",
                data: { type: "rest property" },
                type: "RestElement"
            }]
        },
        {
            code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17,
                messageId: "unexpectedWhitespace",
                data: { type: "rest property" },
                type: "RestElement"
            }]
        },
        {
            code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 16,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "rest property" },
                type: "RestElement"
            }]
        },
        {
            code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            options: ["never"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17,
                messageId: "unexpectedWhitespace",
                data: { type: "rest property" },
                type: "RestElement"
            }]
        },
        {
            code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            options: ["never"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17,
                messageId: "unexpectedWhitespace",
                data: { type: "rest property" },
                type: "RestElement"
            }]
        },
        {
            code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            options: ["never"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 16,
                endLine: 2,
                endColumn: 1,
                messageId: "unexpectedWhitespace",
                data: { type: "rest property" },
                type: "RestElement"
            }]
        },
        {
            code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
            options: ["always"],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 16,
                messageId: "expectedWhitespace",
                data: { type: "rest property" },
                type: "RestElement"
            }]
        }
    ]
});
