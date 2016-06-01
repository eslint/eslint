/**
 * @fileoverview Enforce spacing between rest and spread operators and their expressions.
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/rest-spread-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();

ruleTester.run("spread-spacing", rule, {
    valid: [
        { code: "fn(...args)", parserOptions: { ecmaVersion: 6 } },
        { code: "fn(...(args))", parserOptions: { ecmaVersion: 6 } },
        { code: "fn(...( args ))", parserOptions: { ecmaVersion: 6 } },
        { code: "fn(...args)", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "fn(... args)", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "fn(...\targs)", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "fn(...\nargs)", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "[...arr, 4, 5, 6]", parserOptions: { ecmaVersion: 6 } },
        { code: "[...(arr), 4, 5, 6]", parserOptions: { ecmaVersion: 6 } },
        { code: "[...( arr ), 4, 5, 6]", parserOptions: { ecmaVersion: 6 } },
        { code: "[...arr, 4, 5, 6]", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "[... arr, 4, 5, 6]", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "[...\tarr, 4, 5, 6]", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "[...\narr, 4, 5, 6]", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];", parserOptions: { ecmaVersion: 6 } },
        { code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "let n = { x, y, ...z };", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let n = { x, y, ...(z) };", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let n = { x, y, ...( z ) };", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let n = { x, y, ...z };", options: ["never"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let n = { x, y, ... z };", options: ["always"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let n = { x, y, ...\tz };", options: ["always"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let n = { x, y, ...\nz };", options: ["always"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };", options: ["never"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };", options: ["always"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };", options: ["always"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } },
        { code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };", options: ["always"], parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } } }
    ],

    invalid: [
        {
            code: "fn(... args)",
            output: "fn(...args)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\targs)",
            output: "fn(...args)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\nargs)",
            output: "fn(...args)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(... args)",
            output: "fn(...args)",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\targs)",
            output: "fn(...args)",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...\nargs)",
            output: "fn(...args)",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...args)",
            output: "fn(... args)",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Expected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(... (args))",
            output: "fn(...(args))",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(... ( args ))",
            output: "fn(...( args ))",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...(args))",
            output: "fn(... (args))",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Expected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "fn(...( args ))",
            output: "fn(... ( args ))",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 7,
                message: "Expected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[... arr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[...\tarr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[...\narr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[... arr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[...\tarr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[...\narr, 4, 5, 6]",
            output: "[...arr, 4, 5, 6]",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[...arr, 4, 5, 6]",
            output: "[... arr, 4, 5, 6]",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Expected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[... (arr), 4, 5, 6]",
            output: "[...(arr), 4, 5, 6]",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[... ( arr ), 4, 5, 6]",
            output: "[...( arr ), 4, 5, 6]",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Unexpected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[...(arr), 4, 5, 6]",
            output: "[... (arr), 4, 5, 6]",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Expected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "[...( arr ), 4, 5, 6]",
            output: "[... ( arr ), 4, 5, 6]",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 5,
                message: "Expected whitespace after spread operator",
                type: "SpreadElement"
            }]
        },
        {
            code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 15,
                message: "Unexpected whitespace after rest operator",
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 15,
                message: "Unexpected whitespace after rest operator",
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 15,
                message: "Unexpected whitespace after rest operator",
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 15,
                message: "Unexpected whitespace after rest operator",
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 15,
                message: "Unexpected whitespace after rest operator",
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 15,
                message: "Unexpected whitespace after rest operator",
                type: "RestElement"
            }]
        },
        {
            code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
            output: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 15,
                message: "Expected whitespace after rest operator",
                type: "RestElement"
            }]
        },
        {
            code: "let n = { x, y, ... z };",
            output: "let n = { x, y, ...z };",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Unexpected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ...\tz };",
            output: "let n = { x, y, ...z };",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Unexpected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ...\nz };",
            output: "let n = { x, y, ...z };",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Unexpected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ... z };",
            output: "let n = { x, y, ...z };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Unexpected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ...\tz };",
            output: "let n = { x, y, ...z };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Unexpected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ...\nz };",
            output: "let n = { x, y, ...z };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Unexpected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ...z };",
            output: "let n = { x, y, ... z };",
            options: ["always"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Expected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ... (z) };",
            output: "let n = { x, y, ...(z) };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Unexpected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ... ( z ) };",
            output: "let n = { x, y, ...( z ) };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Unexpected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ...(z) };",
            output: "let n = { x, y, ... (z) };",
            options: ["always"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Expected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let n = { x, y, ...( z ) };",
            output: "let n = { x, y, ... ( z ) };",
            options: ["always"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 20,
                message: "Expected whitespace after spread property operator",
                type: "ExperimentalSpreadProperty"
            }]
        },
        {
            code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 16,
                message: "Unexpected whitespace after rest property operator",
                type: "ExperimentalRestProperty"
            }]
        },
        {
            code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 16,
                message: "Unexpected whitespace after rest property operator",
                type: "ExperimentalRestProperty"
            }]
        },
        {
            code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 16,
                message: "Unexpected whitespace after rest property operator",
                type: "ExperimentalRestProperty"
            }]
        },
        {
            code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 16,
                message: "Unexpected whitespace after rest property operator",
                type: "ExperimentalRestProperty"
            }]
        },
        {
            code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 16,
                message: "Unexpected whitespace after rest property operator",
                type: "ExperimentalRestProperty"
            }]
        },
        {
            code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 16,
                message: "Unexpected whitespace after rest property operator",
                type: "ExperimentalRestProperty"
            }]
        },
        {
            code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
            output: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
            options: ["always"],
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } },
            errors: [{
                line: 1,
                column: 16,
                message: "Expected whitespace after rest property operator",
                type: "ExperimentalRestProperty"
            }]
        }
    ]
});
