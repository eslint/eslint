/**
 * @fileoverview Tests for no-await-in-loop.
 * @author Nat Mote (nmote)
 */

"use strict";

const rule = require("../../../lib/rules/no-await-in-loop"),
    RuleTester = require("../../../lib/testers/rule-tester");

const error = { messageId: "unexpectedAwait", type: "AwaitExpression" };

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });

ruleTester.run("no-await-in-loop", rule, {
    valid: [
        "async function foo() { await bar; }",
        "async function foo() { for (var bar in await baz) { } }",
        "async function foo() { for (var bar of await baz) { } }",
        "async function foo() { for await (var bar of await baz) { } }",
        "async function foo() { for (var bar = await baz in qux) {} }",

        // While loops
        "async function foo() { while (true) { async function foo() { await bar; } } }", // Blocked by a function declaration
        // For loops
        "async function foo() { for (var i = await bar; i < n; i++) {  } }",

        // Do while loops
        "async function foo() { do { } while (bar); }",

        // Blocked by a function expression
        "async function foo() { while (true) { var y = async function() { await bar; } } }",

        // Blocked by an arrow function
        "async function foo() { while (true) { var y = async () => await foo; } }",
        "async function foo() { while (true) { var y = async () => { await foo; } } }",

        // Blocked by a class method
        "async function foo() { while (true) { class Foo { async foo() { await bar; } } } }",

        // Asynchronous iteration intentionally
        "async function foo() { for await (var x of xs) { await f(x) } }"
    ],
    invalid: [

        // While loops
        { code: "async function foo() { while (baz) { await bar; } }", errors: [error] },
        { code: "async function foo() { while (await foo()) {  } }", errors: [error] },
        {
            code: "async function foo() { while (baz) { for await (x of xs); } }",
            errors: [Object.assign({}, error, { type: "ForOfStatement" })]
        },

        // For of loops
        { code: "async function foo() { for (var bar of baz) { await bar; } }", errors: [error] },
        { code: "async function foo() { for (var bar of baz) await bar; }", errors: [error] },

        // For in loops
        { code: "async function foo() { for (var bar in baz) { await bar; } }", errors: [error] },

        // For loops
        { code: "async function foo() { for (var i; i < n; i++) { await bar; } }", errors: [error] },
        { code: "async function foo() { for (var i; await foo(i); i++) {  } }", errors: [error] },
        { code: "async function foo() { for (var i; i < n; i = await bar) {  } }", errors: [error] },

        // Do while loops
        { code: "async function foo() { do { await bar; } while (baz); }", errors: [error] },
        { code: "async function foo() { do { } while (await bar); }", errors: [error] },

        // Deep in a loop body
        { code: "async function foo() { while (true) { if (bar) { foo(await bar); } } }", errors: [error] },

        // Deep in a loop condition
        { code: "async function foo() { while (xyz || 5 > await x) {  } }", errors: [error] },

        // In a nested loop of for-await-of
        { code: "async function foo() { for await (var x of xs) { while (1) await f(x) } }", errors: [error] }
    ]
});
