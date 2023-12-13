/**
 * @fileoverview Tests for no-restricted-globals.
 * @author Benoît Zugmeyer
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-globals"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester"),
    globals = require("globals");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const customMessage = "Use bar instead.";

ruleTester.run("no-restricted-globals", rule, {
    valid: [
        "foo",
        {
            code: "foo",
            options: ["bar"]
        },
        {
            code: "var foo = 1;",
            options: ["foo"]
        },
        {
            code: "event",
            options: ["bar"],
            languageOptions: { globals: globals.browser }
        },
        {
            code: "import foo from 'bar';",
            options: ["foo"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "function foo() {}",
            options: ["foo"]
        },
        {
            code: "function fn() { var foo; }",
            options: ["foo"]
        },
        {
            code: "foo.bar",
            options: ["bar"]
        },
        {
            code: "foo",
            options: [{ name: "bar", message: "Use baz instead." }]
        }
    ],
    invalid: [
        {
            code: "foo",
            options: ["foo"],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "function fn() { foo; }",
            options: ["foo"],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "function fn() { foo; }",
            options: ["foo"],
            languageOptions: {
                globals: { foo: false }
            },
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "event",
            options: ["foo", "event"],
            languageOptions: { globals: globals.browser },
            errors: [{
                messageId: "defaultMessage",
                data: { name: "event" },
                type: "Identifier"
            }]
        },
        {
            code: "foo",
            options: ["foo"],
            languageOptions: {
                globals: { foo: false }
            },
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "foo()",
            options: ["foo"],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "foo.bar()",
            options: ["foo"],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "foo",
            options: [{ name: "foo" }],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "function fn() { foo; }",
            options: [{ name: "foo" }],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "function fn() { foo; }",
            options: [{ name: "foo" }],
            languageOptions: {
                globals: { foo: false }
            },
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "event",
            options: ["foo", { name: "event" }],
            languageOptions: { globals: globals.browser },
            errors: [{
                messageId: "defaultMessage",
                data: { name: "event" },
                type: "Identifier"
            }]
        },
        {
            code: "foo",
            options: [{ name: "foo" }],
            languageOptions: {
                globals: { foo: false }
            },
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "foo()",
            options: [{ name: "foo" }],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "foo.bar()",
            options: [{ name: "foo" }],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "foo",
            options: [{ name: "foo", message: customMessage }],
            errors: [{
                messageId: "customMessage",
                data: { name: "foo", customMessage },
                type: "Identifier"
            }]
        },
        {
            code: "function fn() { foo; }",
            options: [{ name: "foo", message: customMessage }],
            errors: [{
                messageId: "customMessage",
                data: { name: "foo", customMessage },
                type: "Identifier"
            }]
        },
        {
            code: "function fn() { foo; }",
            options: [{ name: "foo", message: customMessage }],
            languageOptions: {
                globals: { foo: false }
            },
            errors: [{
                messageId: "customMessage",
                data: { name: "foo", customMessage },
                type: "Identifier"
            }]
        },
        {
            code: "event",
            options: ["foo", { name: "event", message: "Use local event parameter." }],
            languageOptions: { globals: globals.browser },
            errors: [{
                messageId: "customMessage",
                data: { name: "event", customMessage: "Use local event parameter." },
                type: "Identifier"
            }]
        },
        {
            code: "foo",
            options: [{ name: "foo", message: customMessage }],
            languageOptions: {
                globals: { foo: false }
            },
            errors: [{
                messageId: "customMessage",
                data: { name: "foo", customMessage },
                type: "Identifier"
            }]
        },
        {
            code: "foo()",
            options: [{ name: "foo", message: customMessage }],
            errors: [{
                messageId: "customMessage",
                data: { name: "foo", customMessage },
                type: "Identifier"
            }]
        },
        {
            code: "foo.bar()",
            options: [{ name: "foo", message: customMessage }],
            errors: [{
                messageId: "customMessage",
                data: { name: "foo", customMessage },
                type: "Identifier"
            }]
        },
        {
            code: "var foo = obj => hasOwnProperty(obj, 'name');",
            options: ["hasOwnProperty"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "defaultMessage",
                data: { name: "hasOwnProperty" },
                type: "Identifier"
            }]
        }
    ]
});
