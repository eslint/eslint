/**
 * @fileoverview Tests for no-implicit-globals rule.
 * @author Joshua Peek
 * @copyright 2015 Joshua Peek. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-implicit-globals"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-implicit-globals", rule, {
    valid: [
        {
            code: "const foo = 1;",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "let foo = 1;",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "let foo = function() {};",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "const foo = function() {};",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "class Foo {}",
            ecmaFeatures: { classes: true }
        },
        {
            code: "window.foo = 1;"
        },
        {
            code: "window.foo = function() {};"
        },
        {
            code: "window.foo = function foo() {};"
        },
        {
            code: "window.foo = function*() {};",
            ecmaFeatures: { generators: true }
        },
        {
            code: "self.foo = 1;"
        },
        {
            code: "self.foo = function() {};"
        },
        {
            code: "this.foo = 1;"
        },
        {
            code: "this.foo = function() {};"
        },
        {
            code: "Utils.foo = 1;"
        },
        {
            code: "Utils.foo = function() {};"
        },
        {
            code: "(function() { var foo = 1; })();"
        },
        {
            code: "(function() { let foo = 1; })();",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "(function() { const foo = 1; })();",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "(function() { function foo() {} })();"
        },
        {
            code: "(function() { function *foo() {} })();",
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = 1;",
            ecmaFeatures: { modules: true }
        },
        {
            code: "let foo = 1;",
            ecmaFeatures: { modules: true, blockBindings: true }
        },
        {
            code: "const foo = 1;",
            ecmaFeatures: { modules: true, blockBindings: true }
        },
        {
            code: "function foo() {}",
            ecmaFeatures: { modules: true }
        },
        {
            code: "function *foo() {}",
            ecmaFeatures: { generators: true, modules: true }
        },
        {
            code: "var foo = 1;",
            ecmaFeatures: { globalReturn: true }
        },
        {
            code: "let foo = 1;",
            ecmaFeatures: { globalReturn: true, blockBindings: true }
        },
        {
            code: "const foo = 1;",
            ecmaFeatures: { globalReturn: true, blockBindings: true }
        },
        {
            code: "function foo() {}",
            ecmaFeatures: { globalReturn: true }
        },
        {
            code: "/*global foo:true*/ var foo = 1;"
        },
        {
            code: "/*global foo:true*/ foo = 1;"
        },
        {
            code: "/*global foo:true*/ function foo() {}"
        }
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
            ecmaFeatures: { generators: true },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "FunctionDeclaration"
                }
            ]
        },
        {
            code: "foo = function*() {};",
            ecmaFeatures: { generators: true },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "var foo = function*() {};",
            ecmaFeatures: { generators: true },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = function *foo() {};",
            ecmaFeatures: { generators: true },
            errors: [
                {
                    message: "Implicit global variable, assign as global property instead.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "foo = 1;",
            ecmaFeatures: { globalReturn: true },
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
