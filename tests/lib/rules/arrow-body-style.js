/**
 * @fileoverview Tests for arrow-body-style
 * @author Alberto Rodríguez
 * @copyright 2015 Alberto Rodríguez. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/arrow-body-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("arrow-body-style", rule, {
    valid: [
        { code: "var foo = () => 0;", ecmaFeatures: { arrowFunctions: true } },
        { code: "var addToB = (a) => { b =  b + a };", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = () => { /* do nothing */ };", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = () => {\n /* do nothing */ \n};", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = (retv, name) => {\nretv[name] = true;\nreturn retv;\n};", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = () => ({});", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = () => { bar(); };", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = () => { b = a };", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = () => { bar: 1 };", ecmaFeatures: { arrowFunctions: true } },
        { code: "var foo = () => { return 0; };", ecmaFeatures: { arrowFunctions: true }, options: ["always"] },
        { code: "var foo = () => { return bar(); };", ecmaFeatures: { arrowFunctions: true }, options: ["always"] }
    ],
    invalid: [
        {
            code: "var foo = () => {};",
            ecmaFeatures: { arrowFunctions: true },
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected empty block in arrow body." }
            ]
        },
        {
            code: "var foo = () => 0;",
            ecmaFeatures: { arrowFunctions: true },
            options: ["always"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Expected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => ({});",
            ecmaFeatures: { arrowFunctions: true },
            options: ["always"],
            errors: [
                { line: 1, column: 18, type: "ArrowFunctionExpression", message: "Expected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return 0; };",
            ecmaFeatures: { arrowFunctions: true },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return bar(); };",
            ecmaFeatures: { arrowFunctions: true },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        }
    ]
});
