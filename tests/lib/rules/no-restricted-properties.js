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
        }
    ]
});
