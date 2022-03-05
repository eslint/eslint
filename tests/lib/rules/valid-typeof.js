/**
 * @fileoverview Ensures that the results of typeof are compared against a valid string
 * @author Ian Christian Myers
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/valid-typeof"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("valid-typeof", rule, {

    valid: [
        "typeof foo === 'string'",
        "typeof foo === 'object'",
        "typeof foo === 'function'",
        "typeof foo === 'undefined'",
        "typeof foo === 'boolean'",
        "typeof foo === 'number'",
        "typeof foo === 'bigint'",
        "'string' === typeof foo",
        "'object' === typeof foo",
        "'function' === typeof foo",
        "'undefined' === typeof foo",
        "'boolean' === typeof foo",
        "'number' === typeof foo",
        "typeof foo === typeof bar",
        "typeof foo === baz",
        "typeof foo !== someType",
        "typeof bar != someType",
        "someType === typeof bar",
        "someType == typeof bar",
        "typeof foo == 'string'",
        "typeof(foo) === 'string'",
        "typeof(foo) !== 'string'",
        "typeof(foo) == 'string'",
        "typeof(foo) != 'string'",
        "var oddUse = typeof foo + 'thing'",
        "function f(undefined) { typeof x === undefined }",
        {
            code: "typeof foo === 'number'",
            options: [{ requireStringLiterals: true }]
        },
        {
            code: "typeof foo === \"number\"",
            options: [{ requireStringLiterals: true }]
        },
        {
            code: "var baz = typeof foo + 'thing'",
            options: [{ requireStringLiterals: true }]
        },
        {
            code: "typeof foo === typeof bar",
            options: [{ requireStringLiterals: true }]
        },
        {
            code: "typeof foo === `string`",
            options: [{ requireStringLiterals: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "`object` === typeof foo",
            options: [{ requireStringLiterals: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "typeof foo === `str${somethingElse}`",
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [
        {
            code: "typeof foo === 'strnig'",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "'strnig' === typeof foo",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "if (typeof bar === 'umdefined') {}",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "typeof foo !== 'strnig'",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "'strnig' !== typeof foo",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "if (typeof bar !== 'umdefined') {}",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "typeof foo != 'strnig'",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "'strnig' != typeof foo",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "if (typeof bar != 'umdefined') {}",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "typeof foo == 'strnig'",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "'strnig' == typeof foo",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "if (typeof bar == 'umdefined') {}",
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "if (typeof bar === `umdefined`) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "invalidValue", type: "TemplateLiteral" }]
        },
        {
            code: "typeof foo == 'invalid string'",
            options: [{ requireStringLiterals: true }],
            errors: [{ messageId: "invalidValue", type: "Literal" }]
        },
        {
            code: "if (typeof bar !== undefined) {}",
            errors: [
                {
                    messageId: "invalidValue",
                    type: "Identifier",
                    suggestions: [
                        {
                            messageId: "suggestString",
                            data: { type: "undefined" },
                            output: 'if (typeof bar !== "undefined") {}'
                        }
                    ]
                }]
        },
        {
            code: "typeof foo == Object",
            options: [{ requireStringLiterals: true }],
            errors: [{ messageId: "notString", type: "Identifier" }]
        },
        {
            code: "typeof foo === undefined",
            options: [{ requireStringLiterals: true }],
            errors: [
                {
                    messageId: "notString",
                    type: "Identifier",
                    suggestions: [
                        {
                            messageId: "suggestString",
                            data: { type: "undefined" },
                            output: 'typeof foo === "undefined"'
                        }
                    ]
                }]
        },
        {
            code: "undefined === typeof foo",
            options: [{ requireStringLiterals: true }],
            errors: [
                {
                    messageId: "notString",
                    type: "Identifier",
                    suggestions: [
                        {
                            messageId: "suggestString",
                            data: { type: "undefined" },
                            output: '"undefined" === typeof foo'
                        }
                    ]
                }]
        },
        {
            code: "undefined == typeof foo",
            options: [{ requireStringLiterals: true }],
            errors: [
                {
                    messageId: "notString",
                    type: "Identifier",
                    suggestions: [
                        {
                            messageId: "suggestString",
                            data: { type: "undefined" },
                            output: '"undefined" == typeof foo'
                        }
                    ]
                }]
        },
        {
            code: "typeof foo === `undefined${foo}`",
            options: [{ requireStringLiterals: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "notString", type: "TemplateLiteral" }]
        },
        {
            code: "typeof foo === `${string}`",
            options: [{ requireStringLiterals: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "notString", type: "TemplateLiteral" }]
        }
    ]
});
