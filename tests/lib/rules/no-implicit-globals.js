/**
 * @fileoverview Tests for no-implicit-globals rule.
 * @author Joshua Peek
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-implicit-globals"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-implicit-globals", rule, {
    valid: [
        {
            code: "const foo = 1;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo = 1;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "let foo = function() {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const foo = function() {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {}",
            parserOptions: { ecmaVersion: 6 }
        },
        "window.foo = 1;",
        "window.foo = function() {};",
        "window.foo = function foo() {};",
        {
            code: "window.foo = function*() {};",
            parserOptions: { ecmaVersion: 6 }
        },
        "self.foo = 1;",
        "self.foo = function() {};",
        "this.foo = 1;",
        "this.foo = function() {};",
        "Utils.foo = 1;",
        "Utils.foo = function() {};",
        "(function() { var foo = 1; })();",
        {
            code: "(function() { let foo = 1; })();",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function() { const foo = 1; })();",
            parserOptions: { ecmaVersion: 6 }
        },
        "(function() { function foo() {} })();",
        {
            code: "(function() { function *foo() {} })();",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = 1;",
            parserOptions: { sourceType: "module" }
        },
        {
            code: "let foo = 1;",
            parserOptions: { sourceType: "module" }
        },
        {
            code: "const foo = 1;",
            parserOptions: { sourceType: "module" }
        },
        {
            code: "function foo() {}",
            parserOptions: { sourceType: "module" }
        },
        {
            code: "function *foo() {}",
            parserOptions: { sourceType: "module" }
        },
        {
            code: "var foo = 1;",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "let foo = 1;",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "const foo = 1;",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "function foo() {}",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        "/*global foo:true*/ var foo = 1;",
        "/*global foo:true*/ foo = 1;",
        "/*global foo:true*/ function foo() {}"
    ],

    invalid: [
        {
            code: "foo = 1;",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "foo = 1, bar = 2;",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "AssignmentExpression"
                },
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "var foo = 1;",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = 1, bar = 2;",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                },
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo() {}",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "foo = function() {};",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "var foo = function() {};",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = function foo() {};",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function *foo() {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "foo = function*() {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "var foo = function*() {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = function *foo() {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "foo = 1;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:false*/ var foo = 1;",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "/*global foo:false*/ foo = 1;",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "/*global foo:false*/ function foo() {}",
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "FunctionDeclaration"
                }
            ]
        }
    ]
});
