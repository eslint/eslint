/**
 * @fileoverview Tests for func-style rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("func-style", rule, {
    valid: [
        {
            code: "function foo(){}\n function bar(){}",
            options: ["declaration"]
        },
        {
            code: "foo.bar = function(){};",
            options: ["declaration"]
        },
        {
            code: "(function() { /* code */ }());",
            options: ["declaration"]
        },
        {
            code: "var module = (function() { return {}; }());",
            options: ["declaration"]
        },
        {
            code: "var object = { foo: function(){} };",
            options: ["declaration"]
        },
        {
            code: "Array.prototype.foo = function(){};",
            options: ["declaration"]
        },
        {
            code: "foo.bar = function(){};",
            options: ["expression"]
        },
        {
            code: "var foo = function(){};\n var bar = function(){};",
            options: ["expression"]
        },
        {
            code: "var foo = () => {};\n var bar = () => {}",
            options: ["expression"],
            parserOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/3819
        {
            code: "var foo = function() { this; }.bind(this);",
            options: ["declaration"]
        },
        {
            code: "var foo = () => { this; };",
            options: ["declaration"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "export default function () {};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var foo = () => {};",
            options: ["declaration", { allowArrowFunctions: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = () => { function foo() { this; } };",
            options: ["declaration", { allowArrowFunctions: true }],
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [
        {
            code: "var foo = function(){};",
            options: ["declaration"],
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = () => {};",
            options: ["declaration"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = () => { function foo() { this; } };",
            options: ["declaration"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo(){}",
            options: ["expression"],
            errors: [
                {
                    messageId: "expression",
                    type: "FunctionDeclaration"
                }
            ]
        }
    ]
});
