/**
 * @fileoverview Prefers object spread property over Object.assign
 * @author Sharmila Jesupaul
 * See LICENSE file in root directory for full license.
 */

"use strict";

const rule = require("../../../lib/rules/prefer-object-spread");

const RuleTester = require("../../../lib/testers/rule-tester");

const parserOptions = {
    ecmaVersion: 6,
    ecmaFeatures: {
        experimentalObjectRestSpread: true
    }
};

const defaultErrorMessage = "Use an object spread instead of `Object.assign()` eg: `{ ...foo }`";
const useObjLiteralErrorMessage = "Use an object literal instead of `Object.assign`.";
const ruleTester = new RuleTester();

ruleTester.run("prefer-object-spread", rule, {
    valid: [
        {
            code: "const bar = { ...foo }",
            parserOptions
        },
        {
            code: "Object.assign(...foo)",
            parserOptions
        },
        {
            code: "Object.assign(foo, { bar: baz })",
            parserOptions
        }
    ],

    invalid: [
        {
            code: "Object.assign({}, foo)",
            output: "{...foo}",
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({}, { foo: 'bar' })",
            output: "{foo: 'bar'}",
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({}, baz, { foo: 'bar' })",
            output: "{...baz, foo: 'bar'}",
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({}, { foo: 'bar', baz: 'foo' })",
            output: "{foo: 'bar', baz: 'foo'}",
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({ foo: 'bar' }, baz)",
            output: "{foo: 'bar', ...baz}",
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },

        // Many args
        {
            code: "Object.assign({ foo: 'bar' }, cats, dogs, trees, birds)",
            output: "{foo: 'bar', ...cats, ...dogs, ...trees, ...birds}",
            parserOptions,
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },

        // Nested Object.assign calls
        {
            code:
                "Object.assign({ foo: 'bar' }, Object.assign({ bar: 'foo' }, baz))",
            output: "{foo: 'bar', bar: 'foo', ...baz}",
            parserOptions,
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                },
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },
        {
            code:
                "Object.assign({ foo: 'bar' }, Object.assign({ bar: 'foo' }, Object.assign({}, { superNested: 'butwhy' })))",
            output: "{foo: 'bar', bar: 'foo', superNested: 'butwhy'}",
            parserOptions,
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                },
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                },
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },

        // Mix spread in argument
        {
            code: "Object.assign({ foo: 'bar', ...bar }, baz)",
            output: "{foo: 'bar', ...bar, ...baz}",
            parserOptions,
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },

        // Object shorthand
        {
            code: "Object.assign({}, { foo, bar, baz })",
            output: "{foo, bar, baz}",
            parserOptions,
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },

        // Objects with computed properties
        {
            code: "Object.assign({}, { [bar]: 'foo' })",
            output: "{[bar]: 'foo'}",
            parserOptions,
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },

        // Objects with spread properties
        {
            code: "Object.assign({ ...bar }, { ...baz })",
            output: "{...bar, ...baz}",
            parserOptions,
            errors: [
                {
                    message: defaultErrorMessage,
                    type: "CallExpression"
                }
            ]
        },

        /*
         * This is a special case where Object.assign is called with a single argument
         * and that argument is an object expression. In this case we warn and display
         * a message to use an object literal instead.
         */
        {
            code: "Object.assign({})",
            output: "{}",
            errors: [
                {
                    message: useObjLiteralErrorMessage,
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({ foo: bar })",
            output: "{ foo: bar }",
            errors: [
                {
                    message: useObjLiteralErrorMessage,
                    type: "CallExpression"
                }
            ]
        }
    ]
});
