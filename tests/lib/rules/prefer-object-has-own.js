/**
 * @fileoverview Prefers Object.hasOwn instead of Object.prototype.hasOwnProperty
 * @author Nitin Kumar, Gautam Arora
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-object-has-own");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = {
    ecmaVersion: 2022
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("prefer-object-has-own", rule, {
    valid: [
        "Object",
        "Object(obj, prop)",
        "Object.hasOwnProperty",
        "Object.hasOwnProperty(prop)",
        "foo.hasOwnProperty(prop)",
        "foo.hasOwnProperty(obj, prop)",
        "Object.hasOwnProperty.call",
        "foo.Object.hasOwnProperty.call(obj, prop)",
        "foo.hasOwnProperty.call(obj, prop)",
        "foo.call(Object.prototype.hasOwnProperty, Object.prototype.hasOwnProperty.call)",
        "Object.foo.call(obj, prop)",
        "Object.hasOwnProperty.foo(obj, prop)",
        "Object.hasOwnProperty.call.foo(obj, prop)",
        "Object[hasOwnProperty].call(obj, prop)",
        "Object.hasOwnProperty[call](obj, prop)",
        "class C { #hasOwnProperty; foo() { Object.#hasOwnProperty.call(obj, prop) } }",
        "class C { #call; foo() { Object.hasOwnProperty.#call(obj, prop) } }",
        "(Object) => Object.hasOwnProperty.call(obj, prop)", // not global Object
        "Object.prototype",
        "Object.prototype(obj, prop)",
        "Object.prototype.hasOwnProperty",
        "Object.prototype.hasOwnProperty(obj, prop)",
        "Object.prototype.hasOwnProperty.call",
        "foo.Object.prototype.hasOwnProperty.call(obj, prop)",
        "foo.prototype.hasOwnProperty.call(obj, prop)",
        "Object.foo.hasOwnProperty.call(obj, prop)",
        "Object.prototype.foo.call(obj, prop)",
        "Object.prototype.hasOwnProperty.foo(obj, prop)",
        "Object.prototype.hasOwnProperty.call.foo(obj, prop)",
        "Object.prototype[hasOwnProperty].call(obj, prop)",
        "Object.prototype.hasOwnProperty[call](obj, prop)",
        "class C { #hasOwnProperty; foo() { Object.prototype.#hasOwnProperty.call(obj, prop) } }",
        "class C { #call; foo() { Object.prototype.hasOwnProperty.#call(obj, prop) } }",
        "Object[prototype].hasOwnProperty.call(obj, prop)",
        "class C { #prototype; foo() { Object.#prototype.hasOwnProperty.call(obj, prop) } }",
        "(Object) => Object.prototype.hasOwnProperty.call(obj, prop)", // not global Object
        "({})",
        "({}(obj, prop))",
        "({}.hasOwnProperty)",
        "({}.hasOwnProperty(prop))",
        "({}.hasOwnProperty(obj, prop))",
        "({}.hasOwnProperty.call)",
        "({}.foo.call(obj, prop))",
        "({}.hasOwnProperty.foo(obj, prop))",
        "({}[hasOwnProperty].call(obj, prop))",
        "({}.hasOwnProperty[call](obj, prop))",
        "({}).hasOwnProperty[call](object, property)",
        "({})[hasOwnProperty].call(object, property)",
        "class C { #hasOwnProperty; foo() { ({}.#hasOwnProperty.call(obj, prop)) } }",
        "class C { #call; foo() { ({}.hasOwnProperty.#call(obj, prop)) } }",
        "({ foo }.hasOwnProperty.call(obj, prop))", // object literal should be empty
        `
        let obj = {};
        Object.hasOwn(obj,"");
        `,
        "const hasProperty = Object.hasOwn(object, property);"
    ],
    invalid: [
        {
            code: "Object.hasOwnProperty.call(obj, 'foo')",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 39
            }]
        },
        {
            code: "Object.prototype.hasOwnProperty.call(obj, 'foo')",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 49
            }]
        },
        {
            code: "({}).hasOwnProperty.call(obj, 'foo')",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 37
            }]
        },
        {
            code: "const hasProperty = Object.prototype.hasOwnProperty.call(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 75
            }]
        },
        {
            code: "const hasProperty = (( Object.prototype.hasOwnProperty.call(object, property) ));",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 24,
                endLine: 1,
                endColumn: 78
            }]
        },
        {
            code: "const hasProperty = (( Object.prototype.hasOwnProperty.call ))(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 81
            }]
        },
        {
            code: "const hasProperty = (( Object.prototype.hasOwnProperty )).call(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 81
            }]
        },
        {
            code: "const hasProperty = (( Object.prototype )).hasOwnProperty.call(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 81
            }]
        },
        {
            code: "const hasProperty = (( Object )).prototype.hasOwnProperty.call(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 81
            }]
        },
        {
            code: "const hasProperty = {}.hasOwnProperty.call(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 61
            }]
        },
        {
            code: "const hasProperty = (( {}.hasOwnProperty.call(object, property) ));",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 24,
                endLine: 1,
                endColumn: 64
            }]
        },
        {
            code: "const hasProperty = (( {}.hasOwnProperty.call ))(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 67
            }]
        },
        {
            code: "const hasProperty = (( {}.hasOwnProperty )).call(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 67
            }]
        },
        {
            code: "const hasProperty = (( {} )).hasOwnProperty.call(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 67
            }]
        },
        {
            code: "function foo(){return{}.hasOwnProperty.call(object, property)}",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 22,
                endLine: 1,
                endColumn: 62
            }]
        }
    ]
});
