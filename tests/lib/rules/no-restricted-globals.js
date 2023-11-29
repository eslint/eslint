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
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }],
            languageOptions: {
                globals: { foo: false }
            }
        },
        {
            code: "event",
            options: ["foo", "event"],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "event" },
                type: "Identifier"
            }],
            languageOptions: { globals: globals.browser }
        },
        {
            code: "foo",
            options: ["foo"],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }],
            languageOptions: {
                globals: { foo: false }
            }
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
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }],
            languageOptions: {
                globals: { foo: false }
            }
        },
        {
            code: "event",
            options: ["foo", { name: "event" }],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "event" },
                type: "Identifier"
            }],
            languageOptions: { globals: globals.browser }
        },
        {
            code: "foo",
            options: [{ name: "foo" }],
            errors: [{
                messageId: "defaultMessage",
                data: { name: "foo" },
                type: "Identifier"
            }],
            languageOptions: {
                globals: { foo: false }
            }
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
            errors: [{
                messageId: "customMessage",
                data: { name: "foo", customMessage },
                type: "Identifier"
            }],
            languageOptions: {
                globals: { foo: false }
            }
        },
        {
            code: "event",
            options: ["foo", { name: "event", message: "Use local event parameter." }],
            errors: [{
                messageId: "customMessage",
                data: { name: "event", customMessage: "Use local event parameter." },
                type: "Identifier"
            }],
            languageOptions: { globals: globals.browser }
        },
        {
            code: "foo",
            options: [{ name: "foo", message: customMessage }],
            errors: [{
                messageId: "customMessage",
                data: { name: "foo", customMessage },
                type: "Identifier"
            }],
            languageOptions: {
                globals: { foo: false }
            }
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
            errors: [{
                messageId: "defaultMessage",
                data: { name: "hasOwnProperty" },
                type: "Identifier"
            }],
            languageOptions: { ecmaVersion: 6 }
        }
    ]
});
