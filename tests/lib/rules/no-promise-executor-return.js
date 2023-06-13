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
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates an error object.
 * @param {number} [column] Reported column.
 * @param {string} [type="ReturnStatement"] Reported node type.
 * @returns {Object} The error object.
 */
function eReturnsValue(column, type = "ReturnStatement") {
    const errorObject = {
        messageId: "returnsValue",
        type
    };

    if (column) {
        errorObject.column = column;
    }

    return errorObject;
}

/**
 * Creates an error object.
 * @param {number} [column] Reported column.
 * @returns {Object} The error object.
 */
function eUseVoid(column) {
    const errorObject = {
        messageId: "useVoid"
    };

    if (column) {
        errorObject.column = column;
    }

    return errorObject;
}

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
         * void
         * arrow functions + void return is allowed
         */
        "new Promise((r) => void cbf(r));"
    ],

    invalid: [

        // full error tests
        {
            code: "new Promise(function (resolve, reject) { return 1; })",
            output: null,
            errors: [{ message: "Return values from promise executor functions cannot be read.", type: "ReturnStatement", column: 42, endColumn: 51 }]
        },
        {
            code: "new Promise((resolve, reject) => resolve(1))",
            output: "new Promise((resolve, reject) => void resolve(1))",
            errors: [{
                message: "Return values from promise executor functions cannot be read. If you prefer to use arrow functions without `{...}`, prepend `void` to the expression.",
                type: "CallExpression",
                column: 34,
                endColumn: 44,
                suggestions: [
                    { output: "new Promise((resolve, reject) => void resolve(1))" },
                    { output: "new Promise((resolve, reject) => {resolve(1)})" }]
            }]
        },

        // other basic tests
        {
            code: "new Promise(function foo(resolve, reject) { return 1; })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise((resolve, reject) => { return 1; })",
            output: null,
            errors: [eReturnsValue()]
        },

        // any returned value
        {
            code: "new Promise(function (resolve, reject) { return undefined; })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise((resolve, reject) => { return null; })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise(function (resolve, reject) { return false; })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise((resolve, reject) => resolve)",
            output: "new Promise((resolve, reject) => void resolve)",
            errors: [eUseVoid(34)]
        },
        {
            code: "new Promise((resolve, reject) => null)",
            output: "new Promise((resolve, reject) => void null)",
            errors: [eUseVoid(34)]
        },
        {
            code: "new Promise(function (resolve, reject) { return resolve(foo); })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise((resolve, reject) => { return reject(foo); })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise((resolve, reject) => x + y)",
            output: "new Promise((resolve, reject) => void x + y)",
            errors: [eUseVoid(34)]
        },
        {
            code: "new Promise((resolve, reject) => { return Promise.resolve(42); })",
            output: null,
            errors: [eReturnsValue()]
        },

        // any return statement location
        {
            code: "new Promise(function (resolve, reject) { if (foo) { return 1; } })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise((resolve, reject) => { try { return 1; } catch(e) {} })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise(function (resolve, reject) { while (foo){ if (bar) break; else return 1; } })",
            output: null,
            errors: [eReturnsValue()]
        },

        // void return is not allowed unless arrow function expression
        {
            code: "new Promise(() => { return void 1; })",
            output: null,
            errors: [eReturnsValue()]
        },

        /*
         * output snapshot; the behavior is not specified and can be changed in the future
         * this is the current behavior
         */
        {
            code: "new Promise(() => (1))",
            output: "new Promise(() => (void 1))",
            errors: [eUseVoid(20)]
        },
        {
            code: "() => new Promise(() => ({}));",
            output: "() => new Promise(() => (void {}));",
            errors: [eUseVoid(26)]
        },

        // absence of arguments has no effect
        {
            code: "new Promise(function () { return 1; })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise(() => { return 1; })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise(() => 1)",
            output: "new Promise(() => void 1)",
            errors: [eUseVoid(19)]
        },

        // various scope tracking tests
        {
            code: "function foo() {} new Promise(function () { return 1; });",
            output: null,
            errors: [eReturnsValue(45)]
        },
        {
            code: "function foo() { return; } new Promise(() => { return 1; });",
            output: null,
            errors: [eReturnsValue(48)]
        },
        {
            code: "function foo() { return 1; } new Promise(() => { return 2; });",
            output: null,
            errors: [eReturnsValue(50)]
        },
        {
            code: "function foo () { return new Promise(function () { return 1; }); }",
            output: null,
            errors: [eReturnsValue(52)]
        },
        {
            code: "function foo() { return new Promise(() => { bar(() => { return 1; }); return false; }); }",
            output: null,
            errors: [eReturnsValue(71)]
        },
        {
            code: "() => new Promise(() => { if (foo) { return 0; } else bar(() => { return 1; }); })",
            output: null,
            errors: [eReturnsValue(38)]
        },
        {
            code: "function foo () { return 1; return new Promise(function () { return 2; }); return 3;}",
            output: null,
            errors: [eReturnsValue(62)]
        },
        {
            code: "() => 1; new Promise(() => { return 1; })",
            output: null,
            errors: [eReturnsValue(30)]
        },
        {
            code: "new Promise(function () { return 1; }); function foo() { return 1; } ",
            output: null,
            errors: [eReturnsValue(27)]
        },
        {
            code: "() => new Promise(() => { return 1; });",
            output: null,
            errors: [eReturnsValue(27)]
        },
        {
            code: "() => new Promise(() => 1);",
            output: "() => new Promise(() => void 1);",
            errors: [eUseVoid(25, "Literal")]
        },
        {
            code: "() => new Promise(() => () => 1);",
            output: "() => new Promise(() => void (() => 1));",
            errors: [eUseVoid(25)]
        },
        {
            code: "() => new Promise(() => async () => 1);",
            output: "() => new Promise(() => void (async () => 1));",
            parserOptions: { ecmaVersion: 2017 },

            // for async
            errors: [eUseVoid(25)]
        },
        {
            code: "() => new Promise(() => function () {});",
            output: "() => new Promise(() => void function () {});",
            errors: [eUseVoid(25)]
        },
        {
            code: "() => new Promise(() => function foo() {});",
            output: "() => new Promise(() => void function foo() {});",
            errors: [eUseVoid(25)]
        },
        {
            code: "() => new Promise(() => []);",
            output: "() => new Promise(() => void []);",
            errors: [eUseVoid(25)]
        },

        // edge cases for global Promise reference
        {
            code: "new Promise((Promise) => { return 1; })",
            output: null,
            errors: [eReturnsValue()]
        },
        {
            code: "new Promise(function Promise(resolve, reject) { return 1; })",
            output: null,
            errors: [eReturnsValue()]
        }
    ]
});
