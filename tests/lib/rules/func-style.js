/**
 * @fileoverview Tests for func-style rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-style"),
    RuleTester = require("../../../lib/rule-tester/rule-tester");

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
            languageOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/3819
        {
            code: "var foo = function() { this; }.bind(this);",
            options: ["declaration"]
        },
        {
            code: "var foo = () => { this; };",
            options: ["declaration"],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class C extends D { foo() { var bar = () => { super.baz(); }; } }",
            options: ["declaration"],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = { foo() { var bar = () => super.baz; } }",
            options: ["declaration"],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "export default function () {};",
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var foo = () => {};",
            options: ["declaration", { allowArrowFunctions: true }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = () => { function foo() { this; } };",
            options: ["declaration", { allowArrowFunctions: true }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = () => ({ bar() { super.baz(); } });",
            options: ["declaration", { allowArrowFunctions: true }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "export function foo() {};",
            options: ["declaration"]
        },
        {
            code: "export function foo() {};",
            options: ["expression", { overrides: { namedExports: "declaration" } }]
        },
        {
            code: "export function foo() {};",
            options: ["declaration", { overrides: { namedExports: "declaration" } }]
        },
        {
            code: "export function foo() {};",
            options: ["expression", { overrides: { namedExports: "ignore" } }]
        },
        {
            code: "export function foo() {};",
            options: ["declaration", { overrides: { namedExports: "ignore" } }]
        },
        {
            code: "export var foo = function(){};",
            options: ["expression"]
        },
        {
            code: "export var foo = function(){};",
            options: ["declaration", { overrides: { namedExports: "expression" } }]
        },
        {
            code: "export var foo = function(){};",
            options: ["expression", { overrides: { namedExports: "expression" } }]
        },
        {
            code: "export var foo = function(){};",
            options: ["declaration", { overrides: { namedExports: "ignore" } }]
        },
        {
            code: "export var foo = function(){};",
            options: ["expression", { overrides: { namedExports: "ignore" } }]
        },
        {
            code: "export var foo = () => {};",
            options: ["expression", { overrides: { namedExports: "expression" } }]
        },
        {
            code: "export var foo = () => {};",
            options: ["declaration", { overrides: { namedExports: "expression" } }]
        },
        {
            code: "export var foo = () => {};",
            options: ["declaration", { overrides: { namedExports: "ignore" } }]
        },
        {
            code: "export var foo = () => {};",
            options: ["expression", { overrides: { namedExports: "ignore" } }]
        },
        {
            code: "export var foo = () => {};",
            options: ["declaration", { allowArrowFunctions: true, overrides: { namedExports: "expression" } }]
        },
        {
            code: "export var foo = () => {};",
            options: ["expression", { allowArrowFunctions: true, overrides: { namedExports: "expression" } }]
        },
        {
            code: "export var foo = () => {};",
            options: ["declaration", { allowArrowFunctions: true, overrides: { namedExports: "ignore" } }]
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = () => ({ bar() { super.baz(); } });",
            options: ["declaration"],
            languageOptions: { ecmaVersion: 6 },
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
        },
        {
            code: "export function foo(){}",
            options: ["expression"],
            errors: [
                {
                    messageId: "expression",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "export function foo() {};",
            options: ["declaration", { overrides: { namedExports: "expression" } }],
            errors: [
                {
                    messageId: "expression",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "export function foo() {};",
            options: ["expression", { overrides: { namedExports: "expression" } }],
            errors: [
                {
                    messageId: "expression",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "export var foo = function(){};",
            options: ["declaration"],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "export var foo = function(){};",
            options: ["expression", { overrides: { namedExports: "declaration" } }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "export var foo = function(){};",
            options: ["declaration", { overrides: { namedExports: "declaration" } }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "export var foo = () => {};",
            options: ["declaration"],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "export var b = () => {};",
            options: ["expression", { overrides: { namedExports: "declaration" } }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "export var c = () => {};",
            options: ["declaration", { overrides: { namedExports: "declaration" } }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() {};",
            options: ["expression", { overrides: { namedExports: "declaration" } }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "expression",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "var foo = function() {};",
            options: ["declaration", { overrides: { namedExports: "expression" } }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = () => {};",
            options: ["declaration", { overrides: { namedExports: "expression" } }],
            languageOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "declaration",
                    type: "VariableDeclarator"
                }
            ]
        }
    ]
});
