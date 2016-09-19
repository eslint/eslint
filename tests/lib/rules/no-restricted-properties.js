/**
 * @fileoverview Tests for no-restricted-properties rule.
 * @author Will Klein & Eli White
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-properties"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-restricted-properties", rule, {
    valid: [
        {
            code: "someObject.someProperty",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "anotherObject.disallowedProperty",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "someObject.someProperty()",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "anotherObject.disallowedProperty()",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "anotherObject.disallowedProperty()",
            options: [{
                object: "someObject",
                property: "disallowedProperty",
                message: "Please use someObject.allowedProperty instead."
            }]
        }, {
            code: "anotherObject['disallowedProperty']()",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "obj.toString",
            options: [{
                object: "obj",
                property: "__proto__"
            }]
        }, {
            code: "toString.toString",
            options: [{
                object: "obj",
                property: "foo"
            }]
        }, {
            code: "obj.toString",
            options: [{
                object: "obj",
                property: "foo"
            }]
        }, {
            code: "foo.bar",
            options: [{
                property: "baz"
            }]
        }, {
            code: "foo.bar",
            options: [{
                object: "baz"
            }]
        }, {
            code: "foo()",
            options: [{
                object: "foo"
            }]
        }, {
            code: "foo;",
            options: [{
                object: "foo"
            }]
        }
    ],

    invalid: [
        {
            code: "someObject.disallowedProperty",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }],
            errors: [{
                message: "'someObject.disallowedProperty' is restricted from being used.",
                type: "MemberExpression"
            }]
        }, {
            code: "someObject.disallowedProperty",
            options: [{
                object: "someObject",
                property: "disallowedProperty",
                message: "Please use someObject.allowedProperty instead."
            }],
            errors: [{
                message: "'someObject.disallowedProperty' is restricted from being used. Please use someObject.allowedProperty instead.",
                type: "MemberExpression"
            }]
        }, {
            code: "someObject.disallowedProperty; anotherObject.anotherDisallowedProperty()",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }, {
                object: "anotherObject",
                property: "anotherDisallowedProperty"
            }],
            errors: [{
                message: "'someObject.disallowedProperty' is restricted from being used.",
                type: "MemberExpression"
            }, {
                message: "'anotherObject.anotherDisallowedProperty' is restricted from being used.",
                type: "MemberExpression"
            }]
        }, {
            code: "foo.__proto__",
            options: [{
                property: "__proto__",
                message: "Please use Object.getPrototypeOf instead."
            }],
            errors: [{
                message: "'__proto__' is restricted from being used. Please use Object.getPrototypeOf instead.",
                type: "MemberExpression"
            }]
        }, {
            code: "foo['__proto__']",
            options: [{
                property: "__proto__",
                message: "Please use Object.getPrototypeOf instead."
            }],
            errors: [{
                message: "'__proto__' is restricted from being used. Please use Object.getPrototypeOf instead.",
                type: "MemberExpression"
            }]
        }, {
            code: "foo.bar.baz;",
            options: [{ object: "foo" }],
            errors: [{ message: "'foo.bar' is restricted from being used.", type: "MemberExpression" }]
        }, {
            code: "foo.bar();",
            options: [{ object: "foo" }],
            errors: [{ message: "'foo.bar' is restricted from being used.", type: "MemberExpression" }]
        }, {
            code: "foo.bar.baz();",
            options: [{ object: "foo" }],
            errors: [{ message: "'foo.bar' is restricted from being used.", type: "MemberExpression" }]
        }, {
            code: "foo.bar.baz;",
            options: [{ property: "bar" }],
            errors: [{ message: "'bar' is restricted from being used.", type: "MemberExpression" }]
        }, {
            code: "foo.bar();",
            options: [{ property: "bar" }],
            errors: [{ message: "'bar' is restricted from being used.", type: "MemberExpression" }]
        }, {
            code: "foo.bar.baz();",
            options: [{ property: "bar" }],
            errors: [{ message: "'bar' is restricted from being used.", type: "MemberExpression" }]
        }, {
            code: "require.call({}, 'foo')",
            options: [{
                object: "require",
                message: "Please call require() directly."
            }],
            errors: [{
                message: "'require.call' is restricted from being used. Please call require() directly.",
                type: "MemberExpression"
            }]
        }, {
            code: "require['resolve']",
            options: [{
                object: "require"
            }],
            errors: [{
                message: "'require.resolve' is restricted from being used.",
                type: "MemberExpression"
            }]
        }
    ]
});
