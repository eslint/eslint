/**
 * @fileoverview Tests for no-prototype-built-ins
 * @author Andrew Levine
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-prototype-builtins"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester();

const valid = [
    { code: "Object.prototype.hasOwnProperty.call(foo, 'bar')" },
    { code: "Object.prototype.isPrototypeOf.call(foo, 'bar')" },
    { code: "Object.prototype.propertyIsEnumerable.call(foo, 'bar')" },
    { code: "Object.prototype.hasOwnProperty.apply(foo, ['bar'])" },
    { code: "Object.prototype.isPrototypeOf.apply(foo, ['bar'])" },
    { code: "Object.prototype.propertyIsEnumerable.apply(foo, ['bar'])" },
    { code: "hasOwnProperty(foo, 'bar')" },
    { code: "isPrototypeOf(foo, 'bar')" },
    { code: "propertyIsEnumerable(foo, 'bar')" },
    { code: "({}.hasOwnProperty.call(foo, 'bar'))" },
    { code: "({}.isPrototypeOf.call(foo, 'bar'))" },
    { code: "({}.propertyIsEnumerable.call(foo, 'bar'))" },
    { code: "({}.hasOwnProperty.apply(foo, ['bar']))" },
    { code: "({}.isPrototypeOf.apply(foo, ['bar']))" },
    { code: "({}.propertyIsEnumerable.apply(foo, ['bar']))" }
];

const invalid = [
    {
        code: "foo.hasOwnProperty('bar')",
        errors: [{
            line: 1,
            column: 5,
            message: "Do not access Object.prototype method 'hasOwnProperty' from target object.",
            type: "CallExpression"
        }]
    },
    {
        code: "foo.isPrototypeOf('bar')",
        errors: [{
            line: 1,
            column: 5,
            message: "Do not access Object.prototype method 'isPrototypeOf' from target object.",
            type: "CallExpression"
        }]
    },
    {
        code: "foo.propertyIsEnumerable('bar')",
        errors: [{
            line: 1,
            column: 5,
            message: "Do not access Object.prototype method 'propertyIsEnumerable' from target object."
        }]
    },
    {
        code: "foo.bar.hasOwnProperty('bar')",
        errors: [{
            line: 1,
            column: 9,
            message: "Do not access Object.prototype method 'hasOwnProperty' from target object.",
            type: "CallExpression"
        }]
    },
    {
        code: "foo.bar.baz.isPrototypeOf('bar')",
        errors: [{
            line: 1,
            column: 13,
            message: "Do not access Object.prototype method 'isPrototypeOf' from target object.",
            type: "CallExpression"
        }]
    }
];

ruleTester.run("no-prototype-builtins", rule, {
    valid,
    invalid
});
