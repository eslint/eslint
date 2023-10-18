/**
 * @fileoverview Tests for the no-promise-executor-return rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-promise-executor-return");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 }, env: { es6: true } });

ruleTester.run("no-promise-executor-return", rule, {
    valid: [

        //------------------------------------------------------------------------------
        // General
        //------------------------------------------------------------------------------

        // not a promise executor
        "function foo(resolve, reject) { return 1; }",
        "function Promise(resolve, reject) { return 1; }",
        "(function (resolve, reject) { return 1; })",
        "(function foo(resolve, reject) { return 1; })",
        "(function Promise(resolve, reject) { return 1; })",
        "var foo = function (resolve, reject) { return 1; }",
        "var foo = function Promise(resolve, reject) { return 1; }",
        "var Promise = function (resolve, reject) { return 1; }",
        "(resolve, reject) => { return 1; }",
        "(resolve, reject) => 1",
        "var foo = (resolve, reject) => { return 1; }",
        "var Promise = (resolve, reject) => { return 1; }",
        "var foo = (resolve, reject) => 1",
        "var Promise = (resolve, reject) => 1",
        "var foo = { bar(resolve, reject) { return 1; } }",
        "var foo = { Promise(resolve, reject) { return 1; } }",
        "new foo(function (resolve, reject) { return 1; });",
        "new foo(function bar(resolve, reject) { return 1; });",
        "new foo(function Promise(resolve, reject) { return 1; });",
        "new foo((resolve, reject) => { return 1; });",
        "new foo((resolve, reject) => 1);",
        "new promise(function foo(resolve, reject) { return 1; });",
        "new Promise.foo(function foo(resolve, reject) { return 1; });",
        "new foo.Promise(function foo(resolve, reject) { return 1; });",
        "new Promise.Promise(function foo(resolve, reject) { return 1; });",
        "new Promise()(function foo(resolve, reject) { return 1; });",

        // not a promise executor - Promise() without new
        "Promise(function (resolve, reject) { return 1; });",
        "Promise((resolve, reject) => { return 1; });",
        "Promise((resolve, reject) => 1);",

        // not a promise executor - not the first argument
        "new Promise(foo, function (resolve, reject) { return 1; });",
        "new Promise(foo, (resolve, reject) => { return 1; });",
        "new Promise(foo, (resolve, reject) => 1);",

        // global Promise doesn't exist
        "/* globals Promise:off */ new Promise(function (resolve, reject) { return 1; });",
        {
            code: "new Promise((resolve, reject) => { return 1; });",
            globals: { Promise: "off" }
        },
        {
            code: "new Promise((resolve, reject) => 1);",
            env: { es6: false }
        },

        // global Promise is shadowed
        "let Promise; new Promise(function (resolve, reject) { return 1; });",
        "function f() { new Promise((resolve, reject) => { return 1; }); var Promise; }",
        "function f(Promise) { new Promise((resolve, reject) => 1); }",
        "if (x) { const Promise = foo(); new Promise(function (resolve, reject) { return 1; }); }",
        "x = function Promise() { new Promise((resolve, reject) => { return 1; }); }",

        // return without a value is allowed
        "new Promise(function (resolve, reject) { return; });",
        "new Promise(function (resolve, reject) { reject(new Error()); return; });",
        "new Promise(function (resolve, reject) { if (foo) { return; } });",
        "new Promise((resolve, reject) => { return; });",
        "new Promise((resolve, reject) => { if (foo) { resolve(1); return; } reject(new Error()); });",

        // throw is allowed
        "new Promise(function (resolve, reject) { throw new Error(); });",
        "new Promise((resolve, reject) => { throw new Error(); });",

        // not returning from the promise executor
        "new Promise(function (resolve, reject) { function foo() { return 1; } });",
        "new Promise((resolve, reject) => { (function foo() { return 1; })(); });",
        "new Promise(function (resolve, reject) { () => { return 1; } });",
        "new Promise((resolve, reject) => { () => 1 });",
        "function foo() { return new Promise(function (resolve, reject) { resolve(bar); }) };",
        "foo => new Promise((resolve, reject) => { bar(foo, (err, data) => { if (err) { reject(err); return; } resolve(data); })});",

        // promise executors do not have effect on other functions (tests function info tracking)
        "new Promise(function (resolve, reject) {}); function foo() { return 1; }",
        "new Promise((resolve, reject) => {}); (function () { return 1; });",
        "new Promise(function (resolve, reject) {}); () => { return 1; };",
        "new Promise((resolve, reject) => {}); () => 1;",

        // does not report global return
        {
            code: "return 1;",
            env: { node: true }
        },
        {
            code: "return 1;",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "return 1; function foo(){ return 1; } return 1;",
            env: { node: true }
        },
        {
            code: "function foo(){} return 1; var bar = function*(){ return 1; }; return 1; var baz = () => {}; return 1;",
            env: { node: true }
        },
        {
            code: "new Promise(function (resolve, reject) {}); return 1;",
            env: { node: true }
        },

        /*
         * allowVoid: true
         * `=> void` and `return void` are allowed
         */
        {
            code: "new Promise((r) => void cbf(r));",
            options: [{
                allowVoid: true
            }]
        },
        {
            code: "new Promise(r => void 0)",
            options: [{
                allowVoid: true
            }]
        },
        {
            code: "new Promise(r => { return void 0 })",
            options: [{
                allowVoid: true
            }]
        },
        {
            code: "new Promise(r => { if (foo) { return void 0 } return void 0 })",
            options: [{
                allowVoid: true
            }]
        },
        "new Promise(r => {0})"
    ],

    invalid: [

        // full error tests
        {
            code: "new Promise(function (resolve, reject) { return 1; })",
            errors: [{
                message: "Return values from promise executor functions cannot be read.",
                type: "ReturnStatement",
                column: 42,
                endColumn: 51,
                suggestions: null
            }]
        },
        {
            code: "new Promise((resolve, reject) => resolve(1))",
            options: [{
                allowVoid: true
            }],
            errors: [{
                message: "Return values from promise executor functions cannot be read.",
                type: "CallExpression",
                column: 34,
                endColumn: 44,
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise((resolve, reject) => void resolve(1))"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise((resolve, reject) => {resolve(1)})"
                    }
                ]
            }]
        },
        {
            code: "new Promise((resolve, reject) => { return 1 })",
            options: [{
                allowVoid: true
            }],
            errors: [{
                message: "Return values from promise executor functions cannot be read.",
                type: "ReturnStatement",
                column: 36,
                endColumn: 44,
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise((resolve, reject) => { return void 1 })"
                    }
                ]
            }]
        },

        // suggestions arrow function expression
        {
            code: "new Promise(r => 1)",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => void 1)"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => {1})"
                    }
                ]
            }]
        },
        {
            code: "new Promise(r => 1 ? 2 : 3)",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "ConditionalExpression",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => void (1 ? 2 : 3))"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => {1 ? 2 : 3})"
                    }
                ]
            }]
        },
        {
            code: "new Promise(r => (1 ? 2 : 3))",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "ConditionalExpression",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => void (1 ? 2 : 3))"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => {(1 ? 2 : 3)})"
                    }
                ]
            }]
        },
        {
            code:
                "new Promise(r => (1))",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => void (1))"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => {(1)})"
                    }
                ]
            }]
        },
        {
            code:
                "new Promise(r => () => {})",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "ArrowFunctionExpression",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => void (() => {}))"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => {() => {}})"
                    }
                ]
            }]
        },

        // primitives
        {
            code:
                "new Promise(r => null)",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => void null)"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => {null})"
                    }
                ]
            }]
        },
        {
            code:
                "new Promise(r => null)",
            options: [{
                allowVoid: false
            }],
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => {null})"
                    }
                ]
            }]
        },

        // inline comments
        {
            code:
                "new Promise(r => /*hi*/ ~0)",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "UnaryExpression",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => /*hi*/ void ~0)"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => /*hi*/ {~0})"
                    }
                ]
            }]
        },
        {
            code:
                "new Promise(r => /*hi*/ ~0)",
            options: [{
                allowVoid: false
            }],
            errors: [{
                messageId: "returnsValue",
                type: "UnaryExpression",
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => /*hi*/ {~0})"
                    }
                ]
            }]
        },

        // suggestions function
        {
            code:
                "new Promise(r => { return 0 })",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => { return void 0 })"
                    }
                ]
            }]
        },
        {
            code: "new Promise(r => { return 0 })",
            options: [{
                allowVoid: false
            }],
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },

        // multiple returns
        {
            code:
                "new Promise(r => { if (foo) { return void 0 } return 0 })",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => { if (foo) { return void 0 } return void 0 })"
                    }
                ]
            }]
        },

        // return assignment
        {
            code: "new Promise(resolve => { return (foo = resolve(1)); })",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(resolve => { return void (foo = resolve(1)); })"
                    }
                ]
            }]
        },
        {
            code: "new Promise(resolve => r = resolve)",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "AssignmentExpression",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(resolve => void (r = resolve))"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(resolve => {r = resolve})"
                    }
                ]
            }]
        },

        // return<immediate token> (range check)
        {
            code:
                "new Promise(r => { return(1) })",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => { return void (1) })"
                    }
                ]
            }]
        },
        {
            code:
                "new Promise(r =>1)",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r =>void 1)"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r =>{1})"
                    }
                ]
            }]
        },

        // snapshot
        {
            code:
                "new Promise(r => ((1)))",
            options: [{
                allowVoid: true
            }],
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                suggestions: [
                    {
                        messageId: "prependVoid",
                        output: "new Promise(r => void ((1)))"
                    },
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(r => {((1))})"
                    }
                ]
            }]
        },

        // other basic tests
        {
            code: "new Promise(function foo(resolve, reject) { return 1; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise((resolve, reject) => { return 1; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },

        // any returned value
        {
            code: "new Promise(function (resolve, reject) { return undefined; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise((resolve, reject) => { return null; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise(function (resolve, reject) { return false; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise((resolve, reject) => resolve)",
            errors: [{
                messageId: "returnsValue",
                type: "Identifier",
                column: 34,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "new Promise((resolve, reject) => {resolve})"
                    }
                ]
            }]
        },
        {
            code: "new Promise((resolve, reject) => null)",
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                column: 34,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "new Promise((resolve, reject) => {null})"
                    }
                ]
            }]
        },
        {
            code: "new Promise(function (resolve, reject) { return resolve(foo); })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise((resolve, reject) => { return reject(foo); })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise((resolve, reject) => x + y)",
            errors: [{
                messageId: "returnsValue",
                type: "BinaryExpression",
                column: 34,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "new Promise((resolve, reject) => {x + y})"
                    }
                ]
            }]
        },
        {
            code: "new Promise((resolve, reject) => { return Promise.resolve(42); })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },

        // any return statement location
        {
            code: "new Promise(function (resolve, reject) { if (foo) { return 1; } })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise((resolve, reject) => { try { return 1; } catch(e) {} })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise(function (resolve, reject) { while (foo){ if (bar) break; else return 1; } })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },

        // `return void` is not allowed without `allowVoid: true`
        {
            code: "new Promise(() => { return void 1; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },

        {
            code: "new Promise(() => (1))",
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                column: 20,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(() => {(1)})"
                    }
                ]
            }]
        },
        {
            code: "() => new Promise(() => ({}));",
            errors: [{
                messageId: "returnsValue",
                type: "ObjectExpression",
                column: 26,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "() => new Promise(() => {({})});"
                    }
                ]
            }]
        },

        // absence of arguments has no effect
        {
            code: "new Promise(function () { return 1; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise(() => { return 1; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise(() => 1)",
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                column: 19,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "new Promise(() => {1})"
                    }
                ]
            }]
        },

        // various scope tracking tests
        {
            code: "function foo() {} new Promise(function () { return 1; });",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 45,
                suggestions: null
            }]
        },
        {
            code: "function foo() { return; } new Promise(() => { return 1; });",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 48,
                suggestions: null
            }]
        },
        {
            code: "function foo() { return 1; } new Promise(() => { return 2; });",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 50,
                suggestions: null
            }]
        },
        {
            code: "function foo () { return new Promise(function () { return 1; }); }",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 52,
                suggestions: null
            }]
        },
        {
            code: "function foo() { return new Promise(() => { bar(() => { return 1; }); return false; }); }",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 71,
                suggestions: null
            }]
        },
        {
            code: "() => new Promise(() => { if (foo) { return 0; } else bar(() => { return 1; }); })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 38,
                suggestions: null
            }]
        },
        {
            code: "function foo () { return 1; return new Promise(function () { return 2; }); return 3;}",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 62,
                suggestions: null
            }]
        },
        {
            code: "() => 1; new Promise(() => { return 1; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 30,
                suggestions: null
            }]
        },
        {
            code: "new Promise(function () { return 1; }); function foo() { return 1; } ",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 27,
                suggestions: null
            }]
        },
        {
            code: "() => new Promise(() => { return 1; });",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                column: 27,
                suggestions: null
            }]
        },
        {
            code: "() => new Promise(() => 1);",
            errors: [{
                messageId: "returnsValue",
                type: "Literal",
                column: 25,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "() => new Promise(() => {1});"
                    }
                ]
            }]
        },
        {
            code: "() => new Promise(() => () => 1);",
            errors: [{
                messageId: "returnsValue",
                type: "ArrowFunctionExpression",
                column: 25,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "() => new Promise(() => {() => 1});"
                    }
                ]
            }]
        },
        {
            code: "() => new Promise(() => async () => 1);",
            parserOptions: { ecmaVersion: 2017 },

            // for async
            errors: [{
                messageId: "returnsValue",
                type: "ArrowFunctionExpression",
                column: 25,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "() => new Promise(() => {async () => 1});"
                    }
                ]
            }]
        },
        {
            code: "() => new Promise(() => function () {});",
            errors: [{
                messageId: "returnsValue",
                type: "FunctionExpression",
                column: 25,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "() => new Promise(() => {function () {}});"
                    }
                ]
            }]
        },
        {
            code: "() => new Promise(() => function foo() {});",
            errors: [{
                messageId: "returnsValue",
                type: "FunctionExpression",
                column: 25,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "() => new Promise(() => {function foo() {}});"
                    }
                ]
            }]
        },
        {
            code: "() => new Promise(() => []);",
            errors: [{
                messageId: "returnsValue",
                type: "ArrayExpression",
                column: 25,
                suggestions: [
                    {
                        messageId: "wrapBraces",
                        output: "() => new Promise(() => {[]});"
                    }
                ]
            }]
        },

        // edge cases for global Promise reference
        {
            code: "new Promise((Promise) => { return 1; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        },
        {
            code: "new Promise(function Promise(resolve, reject) { return 1; })",
            errors: [{
                messageId: "returnsValue",
                type: "ReturnStatement",
                suggestions: null
            }]
        }
    ]
});
