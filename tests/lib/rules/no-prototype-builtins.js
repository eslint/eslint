/**
 * @fileoverview Tests for no-prototype-built-ins
 * @author Andrew Levine
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-prototype-builtins"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-prototype-builtins", rule, {
    valid: [
        "Object.prototype.hasOwnProperty.call(foo, 'bar')",
        "Object.prototype.isPrototypeOf.call(foo, 'bar')",
        "Object.prototype.propertyIsEnumerable.call(foo, 'bar')",
        "Object.prototype.hasOwnProperty.apply(foo, ['bar'])",
        "Object.prototype.isPrototypeOf.apply(foo, ['bar'])",
        "Object.prototype.propertyIsEnumerable.apply(foo, ['bar'])",
        "foo.hasOwnProperty",
        "foo.hasOwnProperty.bar()",
        "foo(hasOwnProperty)",
        "hasOwnProperty(foo, 'bar')",
        "isPrototypeOf(foo, 'bar')",
        "propertyIsEnumerable(foo, 'bar')",
        "({}.hasOwnProperty.call(foo, 'bar'))",
        "({}.isPrototypeOf.call(foo, 'bar'))",
        "({}.propertyIsEnumerable.call(foo, 'bar'))",
        "({}.hasOwnProperty.apply(foo, ['bar']))",
        "({}.isPrototypeOf.apply(foo, ['bar']))",
        "({}.propertyIsEnumerable.apply(foo, ['bar']))",
        "foo[hasOwnProperty]('bar')",
        "foo['HasOwnProperty']('bar')",
        { code: "foo[`isPrototypeOff`]('bar')", parserOptions: { ecmaVersion: 2015 } },
        { code: "foo?.['propertyIsEnumerabl']('bar')", parserOptions: { ecmaVersion: 2020 } },
        "foo[1]('bar')",
        "foo[null]('bar')",
        { code: "class C { #hasOwnProperty; foo() { obj.#hasOwnProperty('bar'); } }", parserOptions: { ecmaVersion: 2022 } },

        // out of scope for this rule
        "foo['hasOwn' + 'Property']('bar')",
        { code: "foo[`hasOwnProperty${''}`]('bar')", parserOptions: { ecmaVersion: 2015 } }
    ],

    invalid: [
        {
            code: "foo.hasOwnProperty('bar')",
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 19,
                messageId: "prototypeBuildIn",
                data: { prop: "hasOwnProperty" },
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.hasOwnProperty.call(foo, 'bar')"
                    }
                ],
                type: "CallExpression"
            }]
        },
        {
            code: "foo.isPrototypeOf('bar')",
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 18,
                messageId: "prototypeBuildIn",
                data: { prop: "isPrototypeOf" },
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.isPrototypeOf.call(foo, 'bar')"
                    }
                ],
                type: "CallExpression"
            }]
        },
        {
            code: "foo.propertyIsEnumerable('bar')",
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 25,
                messageId: "prototypeBuildIn",
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.propertyIsEnumerable.call(foo, 'bar')"
                    }
                ],
                data: { prop: "propertyIsEnumerable" }
            }]
        },
        {
            code: "foo.bar.hasOwnProperty('bar')",
            errors: [{
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 23,
                messageId: "prototypeBuildIn",
                data: { prop: "hasOwnProperty" },
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.hasOwnProperty.call(foo.bar, 'bar')"
                    }
                ],
                type: "CallExpression"
            }]
        },
        {
            code: "foo.bar.baz.isPrototypeOf('bar')",
            errors: [{
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 26,
                messageId: "prototypeBuildIn",
                data: { prop: "isPrototypeOf" },
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.isPrototypeOf.call(foo.bar.baz, 'bar')"
                    }
                ],
                type: "CallExpression"
            }]
        },
        {
            code: "foo['hasOwnProperty']('bar')",
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 21,
                messageId: "prototypeBuildIn",
                data: { prop: "hasOwnProperty" },
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.hasOwnProperty.call(foo, 'bar')"
                    }
                ],
                type: "CallExpression"
            }]
        },
        {
            code: "foo[`isPrototypeOf`]('bar').baz",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 20,
                messageId: "prototypeBuildIn",
                data: { prop: "isPrototypeOf" },
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.isPrototypeOf.call(foo, 'bar').baz"
                    }
                ],
                type: "CallExpression"
            }]
        },
        {
            code: String.raw`foo.bar["propertyIsEnumerable"]('baz')`,
            errors: [{
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 31,
                messageId: "prototypeBuildIn",
                data: { prop: "propertyIsEnumerable" },
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: String.raw`Object.prototype.propertyIsEnumerable.call(foo.bar, 'baz')`
                    }
                ],
                type: "CallExpression"
            }]
        },
        {

            // Can't suggest Object.prototype when Object is shadowed
            code: "(function(Object) {return foo.hasOwnProperty('bar');})",
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]
        },
        {
            code: "foo.hasOwnProperty('bar')",
            globals: {
                Object: "off"
            },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }],
            name: "Can't suggest Object.prototype when there is no Object global variable"
        },

        // Optional chaining
        {
            code: "foo?.hasOwnProperty('bar')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]
        },
        {
            code: "foo?.bar.hasOwnProperty('baz')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]
        },
        {
            code: "foo.hasOwnProperty?.('bar')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]
        },
        {

            /*
             * If hasOwnProperty is part of a ChainExpresion
             * and the optional part is before it, then don't suggest the fix
             */
            code: "foo?.hasOwnProperty('bar').baz",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]
        },
        {

            /*
             * If hasOwnProperty is part of a ChainExpresion
             * but the optional part is after it, then the fix is safe
             */
            code: "foo.hasOwnProperty('bar')?.baz",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "prototypeBuildIn",
                data: { prop: "hasOwnProperty" },
                suggestions: [
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.hasOwnProperty.call(foo, 'bar')?.baz"
                    }
                ]
            }]
        },
        {

            code: "(a,b).hasOwnProperty('bar')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "prototypeBuildIn",
                data: { prop: "hasOwnProperty" },
                suggestions: [

                    // Make sure the SequenceExpression has parentheses before other arguments
                    {
                        messageId: "callObjectPrototype",
                        output: "Object.prototype.hasOwnProperty.call((a,b), 'bar')"
                    }
                ]
            }]
        },
        {

            // No suggestion where no-unsafe-optional-chaining is reported on the call
            code: "(foo?.hasOwnProperty)('bar')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]

        },
        {
            code: "(foo?.hasOwnProperty)?.('bar')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]
        },
        {
            code: "foo?.['hasOwnProperty']('bar')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]
        },
        {

            // No suggestion where no-unsafe-optional-chaining is reported on the call
            code: "(foo?.[`hasOwnProperty`])('bar')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "prototypeBuildIn", data: { prop: "hasOwnProperty" }, suggestions: [] }]
        }
    ]
});
