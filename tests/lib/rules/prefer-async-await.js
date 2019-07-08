/**
 * @fileoverview Tests for prefer-async-await rule.
 * @author Milos Djermanovic
 */

"use strict";

const rule = require("../../../lib/rules/prefer-async-await");
const { RuleTester } = require("../../../lib/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("prefer-async-await", rule, {
    valid: [
        "function foo() { then; }",
        "function foo() { then(); }",
        "function foo() { bar.then; }",
        "function foo() { bar.catch; }",
        "function foo() { bar.finally; }",
        "function foo() { then.then; }",
        "function foo() { then.catch.finally; }",
        "function foo() { then().bar; }",
        "function foo() { then().then; }",
        "function foo() { then().catch; }",
        "function foo() { bar().then; }",
        "function foo() { bar().catch; }",
        "function foo() { bar().then.catch; }",
        "function foo() { bar.then.baz; }",
        "function foo() { bar.then.then; }",
        "function foo() { then.bar(); }",
        "function foo() { bar.then.baz(); }",
        "function foo() { bar(then); }",
        "function foo() { bar.baz(then); }",
        "function then() {}",
        "function foo() { bar[then](); }",

        // options
        {
            code: "foo.then()",
            options: [{ atTopLevel: false }]
        },
        {
            code: "if (true) { foo.then() }",
            options: [{ atTopLevel: false }]
        },
        {
            code: "var foo = { get a() { bar.then(); }, set a(b) { baz.then(); } }",
            options: [{ inGetOrSet: false }]
        },
        {
            code: "var foo = { get a() { bar.then(); }, set b(c) { baz.then(); } }",
            options: [{ inGetOrSet: false }]
        },
        {
            code: "class foo { get a() { bar.then(); } set a(b) { baz.then(); } }",
            options: [{ inGetOrSet: false }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "class foo { get a() { bar.then(); } set b(c) { baz.then(); } }",
            options: [{ inGetOrSet: false }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "async function foo() { await bar.then(); }",
            options: [{ inAwaitExpressions: false }],
            parserOptions: { ecmaVersion: 2017 }
        },
        {
            code: "async function foo() { await bar.catch(); }",
            options: [{ inAwaitExpressions: false }],
            parserOptions: { ecmaVersion: 2017 }
        },
        {
            code: "async function foo() { await bar.baz.then(); }",
            options: [{ inAwaitExpressions: false }],
            parserOptions: { ecmaVersion: 2017 }
        },
        {
            code: "async function foo() { await bar().then().baz().catch().finally(); }",
            options: [{ inAwaitExpressions: false }],
            parserOptions: { ecmaVersion: 2017 }
        },
        {
            code: "function *foo() { yield bar.then(); }",
            options: [{ inYieldExpressions: false }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "function *foo() { yield bar.catch(); }",
            options: [{ inYieldExpressions: false }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "function *foo() { yield bar.baz.then(); }",
            options: [{ inYieldExpressions: false }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "function *foo() { yield bar().then().baz().catch().finally(); }",
            options: [{ inYieldExpressions: false }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "function *foo() { yield 1 + bar.then() + 2; }",
            options: [{ inYieldExpressions: false }],
            parserOptions: { ecmaVersion: 2015 }
        }
    ],
    invalid: [
        {
            code: "function foo() { bar.then(); }",
            errors: [{
                message: "Use async/await syntax instead of .then() method.",
                type: "CallExpression"
            }]
        },
        {
            code: "function foo() { bar.catch(); }",
            errors: [{
                message: "Use async/await syntax instead of .catch() method.",
                type: "CallExpression"
            }]
        },
        {
            code: "function foo() { bar.finally(); }",
            errors: [{
                message: "Use async/await syntax instead of .finally() method.",
                type: "CallExpression"
            }]
        },
        {
            code: "function foo() { bar.then().then().catch().then().catch().finally(); }",
            errors: [
                {
                    message: "Use async/await syntax instead of .finally() method.",
                    type: "CallExpression"
                },
                {
                    message: "Use async/await syntax instead of .catch() method.",
                    type: "CallExpression"
                },
                {
                    message: "Use async/await syntax instead of .then() method.",
                    type: "CallExpression"
                },
                {
                    message: "Use async/await syntax instead of .catch() method.",
                    type: "CallExpression"
                },
                {
                    message: "Use async/await syntax instead of .then() method.",
                    type: "CallExpression"
                },

                {
                    message: "Use async/await syntax instead of .then() method.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "function foo() { bar().then(); }",
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "function foo() { bar.then().baz; }",
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "function foo() { bar.baz.then(); }",
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "function foo() { then.then(); }",
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "function foo() { bar.then.then(); }",
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },

        // options
        {
            code: "function foo() { bar.then(); }",
            options: [{ atTopLevel: false, inGetOrSet: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "const foo = function() { bar.then(); }",
            options: [{ atTopLevel: false, inGetOrSet: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "const foo = () => { bar.then(); }",
            options: [{ atTopLevel: false, inGetOrSet: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "const foo = { a() { bar.then(); } }",
            options: [{ atTopLevel: false, inGetOrSet: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "class foo { a() { bar.then(); } }",
            options: [{ atTopLevel: false, inGetOrSet: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "foo.then()",
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "foo.then()",
            options: [{ atTopLevel: true }],
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "foo.then()",
            options: [{ atTopLevel: true, inGetOrSet: false }],
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if (true) { foo.then() }",
            options: [{ atTopLevel: true }],
            errors: [{
                messageId: "promiseMethodCall",
                type: "CallExpression"
            }]
        },
        {
            code: "var foo = { get a() { bar.then(); }, set a(b) { baz.then(); } }",
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                },
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "class foo { get a() { bar.then(); } set a(b) { baz.then(); } }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                },
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = { get a() { bar.then(); }, set a(b) { baz.then(); } }",
            options: [{ inGetOrSet: true }],
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                },
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = { get a() { bar.then(); }, set a(b) { baz.then(); } }",
            options: [{ atTopLevel: false, inGetOrSet: true }],
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                },
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "class foo { get a() { bar.then(); } set a(b) { baz.then(); } }",
            options: [{ inGetOrSet: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                },
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "async function foo() { await bar.then(); }",
            parserOptions: { ecmaVersion: 2017 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "async function foo() { await bar.then(); }",
            options: [{ inAwaitExpressions: true }],
            parserOptions: { ecmaVersion: 2017 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "async function foo() { await (() => bar.then()) }",
            options: [{ inAwaitExpressions: false }],
            parserOptions: { ecmaVersion: 2017 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "async function foo() { await bar.then(); }",
            options: [{ inAwaitExpressions: true, inYieldExpressions: false }],
            parserOptions: { ecmaVersion: 2017 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield bar.then(); }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield bar.then(); }",
            options: [{ inYieldExpressions: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield (() => bar.then()) }",
            options: [{ inYieldExpressions: false }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "function *foo() { yield bar.then(); }",
            options: [{ inAwaitExpressions: false, inYieldExpressions: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "promiseMethodCall",
                    type: "CallExpression"
                }
            ]
        }
    ]
});
