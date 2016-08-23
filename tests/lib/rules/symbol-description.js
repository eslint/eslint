/**
 * @fileoverview Tests for symbol-description rule.
 * @author Jarek Rencz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/symbol-description");
const RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("symbol-description", rule, {

    valid: [
        {
            code: "Symbol(\"Foo\");",
            env: {es6: true}
        },
        {
            code: "var foo = \"foo\"; Symbol(foo);",
            env: {es6: true}
        },

        // Ignore if it's shadowed.
        {
            code: "var Symbol = function () {}; Symbol();",
            env: {es6: true}
        },
        {
            code: "Symbol(); var Symbol = function () {};",
            env: {es6: true}
        },
        {
            code: "function bar() { var Symbol = function () {}; Symbol(); }",
            env: {es6: true}
        },

        // Ignore if it's an argument.
        {
            code: "function bar(Symbol) { Symbol(); }",
            env: {es6: true}
        },
    ],

    invalid: [
        {
            code: "Symbol();",
            errors: [{
                message: "Expected Symbol to have a description.",
                type: "CallExpression"
            }],
            env: {es6: true}
        },
        {
            code: "Symbol(); Symbol = function () {};",
            errors: [{
                message: "Expected Symbol to have a description.",
                type: "CallExpression"
            }],
            env: {es6: true}
        },
    ]
});
