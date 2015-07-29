/**
 * @fileoverview Tests for prefer-reflect rule.
 * @author Keith Cirkel
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var rule = require("../../../lib/rules/prefer-reflect"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("prefer-reflect", rule, {
    valid: [
        // Reflect.apply
        { code: "Reflect.apply(function(){}, null, 1, 2);" },
        { code: "Reflect.apply(function(){}, null, 1, 2);", options: [{ exceptions: ["apply"] }] },
        { code: "(function(){}).apply(null, [1, 2]);", options: [{ exceptions: ["apply"] }] },
        { code: "(function(){}).call(null, 1, 2);", options: [{ exceptions: ["call"] }] },

        // Reflect.defineProperty
        { code: "Reflect.defineProperty({}, 'foo', {value: 1})" },
        { code: "Reflect.defineProperty({}, 'foo', {value: 1})", options: [{ exceptions: ["defineProperty"] }] },
        { code: "Object.defineProperty({}, 'foo', {value: 1})", options: [{ exceptions: ["defineProperty"] }] },

        // Reflect.getOwnPropertyDescriptor
        { code: "Reflect.getOwnPropertyDescriptor({}, 'foo');" },
        { code: "Reflect.getOwnPropertyDescriptor({}, 'foo');", options: [{ exceptions: ["getOwnPropertyDescriptor"] }] },
        { code: "Object.getOwnPropertyDescriptor({}, 'foo');", options: [{ exceptions: ["getOwnPropertyDescriptor"] }] },

        // Reflect.getPrototypeOf
        { code: "Reflect.getPrototypeOf({});" },
        { code: "Reflect.getPrototypeOf({});", options: [{ exceptions: ["getPrototypeOf"] }] },
        { code: "Object.getPrototypeOf({});", options: [{ exceptions: ["getPrototypeOf"] }] },

        // Reflect.setPrototypeOf
        { code: "Reflect.setPrototypeOf({}, Object.prototype);" },
        { code: "Reflect.setPrototypeOf({}, Object.prototype);", options: [{ exceptions: ["setPrototypeOf"] }] },
        { code: "Object.setPrototypeOf({}, Object.prototype);", options: [{ exceptions: ["setPrototypeOf"] }] },

        // Reflect.isExtensible
        { code: "Reflect.isExtensible({});" },
        { code: "Reflect.isExtensible({});", options: [{ exceptions: ["isExtensible"] }] },
        { code: "Object.isExtensible({});", options: [{ exceptions: ["isExtensible"] }] },

        // Reflect.getOwnPropertyNames
        { code: "Reflect.getOwnPropertyNames({});" },
        { code: "Reflect.getOwnPropertyNames({});", options: [{ exceptions: ["getOwnPropertyNames"] }] },
        { code: "Object.getOwnPropertyNames({});", options: [{ exceptions: ["getOwnPropertyNames"] }] },

        // Reflect.getOwnPropertyNames
        { code: "Reflect.preventExtensions({});" },
        { code: "Reflect.preventExtensions({});", options: [{ exceptions: ["preventExtensions"] }] },
        { code: "Object.preventExtensions({});", options: [{ exceptions: ["preventExtensions"] }] },

        // Reflect.getOwnPropertyNames
        { code: "Reflect.deleteProperty({}, 'foo');" },
        { code: "Reflect.deleteProperty({}, 'foo');", options: [{ exceptions: ["delete"] }] },
        { code: "delete foo;" },
        { code: "delete ({}).foo", options: [{ exceptions: ["delete"] }] }
    ],
    invalid: [

        {
            code: "(function(){}).apply(null, [1, 2])",
            errors: [
                {
                    message: "Avoid using Function.prototype.apply, instead use Reflect.apply",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "(function(){}).apply(null, [1, 2])",
            options: [{ exceptions: ["defineProperty"] }],
            errors: [
                {
                    message: "Avoid using Function.prototype.apply, instead use Reflect.apply",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "(function(){}).call(null, 1, 2)",
            errors: [
                {
                    message: "Avoid using Function.prototype.call, instead use Reflect.apply",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "(function(){}).call(null, 1, 2)",
            options: [{ exceptions: ["defineProperty"] }],
            errors: [
                {
                    message: "Avoid using Function.prototype.call, instead use Reflect.apply",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.defineProperty({}, 'foo', { value: 1 })",
            errors: [
                {
                    message: "Avoid using Object.defineProperty, instead use Reflect.defineProperty",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.defineProperty({}, 'foo', { value: 1 })",
            options: [{ exceptions: ["apply"] }],
            errors: [
                {
                    message: "Avoid using Object.defineProperty, instead use Reflect.defineProperty",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.getOwnPropertyDescriptor({}, 'foo')",
            errors: [
                {
                    message: "Avoid using Object.getOwnPropertyDescriptor, instead use Reflect.getOwnPropertyDescriptor",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.getOwnPropertyDescriptor({}, 'foo')",
            options: [{ exceptions: ["apply"] }],
            errors: [
                {
                    message: "Avoid using Object.getOwnPropertyDescriptor, instead use Reflect.getOwnPropertyDescriptor",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.getPrototypeOf({})",
            errors: [
                {
                    message: "Avoid using Object.getPrototypeOf, instead use Reflect.getPrototypeOf",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.getPrototypeOf({})",
            options: [{ exceptions: ["apply"] }],
            errors: [
                {
                    message: "Avoid using Object.getPrototypeOf, instead use Reflect.getPrototypeOf",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.setPrototypeOf({}, Object.prototype)",
            errors: [
                {
                    message: "Avoid using Object.setPrototypeOf, instead use Reflect.setPrototypeOf",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.setPrototypeOf({}, Object.prototype)",
            options: [{ exceptions: ["apply"] }],
            errors: [
                {
                    message: "Avoid using Object.setPrototypeOf, instead use Reflect.setPrototypeOf",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.isExtensible({})",
            errors: [
                {
                    message: "Avoid using Object.isExtensible, instead use Reflect.isExtensible",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.isExtensible({})",
            options: [{ exceptions: ["apply"] }],
            errors: [
                {
                    message: "Avoid using Object.isExtensible, instead use Reflect.isExtensible",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.getOwnPropertyNames({})",
            errors: [
                {
                    message: "Avoid using Object.getOwnPropertyNames, instead use Reflect.getOwnPropertyNames",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.getOwnPropertyNames({})",
            options: [{ exceptions: ["apply"] }],
            errors: [
                {
                    message: "Avoid using Object.getOwnPropertyNames, instead use Reflect.getOwnPropertyNames",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.preventExtensions({})",
            errors: [
                {
                    message: "Avoid using Object.preventExtensions, instead use Reflect.preventExtensions",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.preventExtensions({})",
            options: [{ exceptions: ["apply"] }],
            errors: [
                {
                    message: "Avoid using Object.preventExtensions, instead use Reflect.preventExtensions",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "delete ({}).foo",
            errors: [
                {
                    message: "Avoid using the delete keyword, instead use Reflect.deleteProperty",
                    type: "UnaryExpression"
                }
            ]
        },
        {
            code: "delete ({}).foo",
            options: [{ exceptions: ["apply"] }],
            errors: [
                {
                    message: "Avoid using the delete keyword, instead use Reflect.deleteProperty",
                    type: "UnaryExpression"
                }
            ]
        }

    ]
});
