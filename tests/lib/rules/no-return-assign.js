/**
 * @fileoverview Tests for no-return-assign.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-return-assign"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-return-assign", rule, {
    valid: [
        {
            code: "module.exports = {'a': 1};",
            parserOptions: {
                sourceType: "module"
            }
        },
        "var result = a * b;",
        "function x() { var result = a * b; return result; }",
        "function x() { return (result = a * b); }",
        {
            code: "function x() { var result = a * b; return result; }",
            options: ["except-parens"]
        },
        {
            code: "function x() { return (result = a * b); }",
            options: ["except-parens"]
        },
        {
            code: "function x() { var result = a * b; return result; }",
            options: ["always"]
        },
        {
            code: "function x() { return function y() { result = a * b }; }",
            options: ["always"]
        },
        {
            code: "() => { return (result = a * b); }",
            options: ["except-parens"]
        },
        {
            code: "() => (result = a * b)",
            options: ["except-parens"]
        },
        "const foo = (a,b,c) => ((a = b), c)",
        `function foo(){
            return (a = b)
        }`,
        `function bar(){
            return function foo(){
                return (a = b) && c
            }
        }`,
        {
            code: "const foo = (a) => (b) => (a = b)",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "function x() { return result = a * b; };",
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: "function x() { return (result) = (a * b); };",
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: "function x() { return result = a * b; };",
            options: ["except-parens"],
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: "function x() { return (result) = (a * b); };",
            options: ["except-parens"],
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: "() => { return result = a * b; }",
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: "() => result = a * b",
            errors: [
                {
                    messageId: "arrowAssignment",
                    type: "ArrowFunctionExpression"
                }
            ]
        },
        {
            code: "function x() { return result = a * b; };",
            options: ["always"],
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: "function x() { return (result = a * b); };",
            options: ["always"],
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: "function x() { return result || (result = a * b); };",
            options: ["always"],
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: `function foo(){
                return a = b
            }`,
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: `function doSomething() {
                return foo = bar && foo > 0;
            }`,
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: `function doSomething() {
                return foo = function(){
                    return (bar = bar1)
                }
            }`,
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: `function doSomething() {
                return foo = () => a
            }`,
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "returnAssignment",
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: `function doSomething() {
                return () => a = () => b
            }`,
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "arrowAssignment",
                    type: "ArrowFunctionExpression"
                }
            ]
        },
        {
            code: `function foo(a){
                return function bar(b){
                    return a = b
                }
            }`,
            errors: [{ messageId: "returnAssignment", type: "ReturnStatement" }]
        },
        {
            code: "const foo = (a) => (b) => a = b",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "arrowAssignment",
                    type: "ArrowFunctionExpression"
                }
            ]
        }
    ]
});
