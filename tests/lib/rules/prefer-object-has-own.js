/**
 * @fileoverview Tests for prefer-object-has-own rule.
 * @author Nitin Kumar
 * @author Gautam Arora
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
        "hasOwnProperty(obj, prop)",
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
        "Object.prototype.prototype.hasOwnProperty.call(a, b);",
        "Object.hasOwnProperty.prototype.hasOwnProperty.call(a, b);",
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
        "({}).prototype.hasOwnProperty.call(a, b);",
        "({}.foo.call(obj, prop))",
        "({}.hasOwnProperty.foo(obj, prop))",
        "({}[hasOwnProperty].call(obj, prop))",
        "({}.hasOwnProperty[call](obj, prop))",
        "({}).hasOwnProperty[call](object, property)",
        "({})[hasOwnProperty].call(object, property)",
        "class C { #hasOwnProperty; foo() { ({}.#hasOwnProperty.call(obj, prop)) } }",
        "class C { #call; foo() { ({}.hasOwnProperty.#call(obj, prop)) } }",
        "({ foo }.hasOwnProperty.call(obj, prop))", // object literal should be empty
        "(Object) => ({}).hasOwnProperty.call(obj, prop)", // Object is shadowed, so Object.hasOwn cannot be used here
        `
        let obj = {};
        Object.hasOwn(obj,"");
        `,
        "const hasProperty = Object.hasOwn(object, property);",
        `/* global Object: off */
        ({}).hasOwnProperty.call(a, b);`
    ],
    invalid: [
        {
            code: "Object.hasOwnProperty.call(obj, 'foo')",
            output: "Object.hasOwn(obj, 'foo')",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 39
            }]
        },
        {
            code: "Object.hasOwnProperty.call(obj, property)",
            output: "Object.hasOwn(obj, property)",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 42
            }]
        },
        {
            code: "Object.prototype.hasOwnProperty.call(obj, 'foo')",
            output: "Object.hasOwn(obj, 'foo')",
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
            output: "Object.hasOwn(obj, 'foo')",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 37
            }]
        },

        //  prevent autofixing if there are any comments
        {
            code: "Object/* comment */.prototype.hasOwnProperty.call(a, b);",
            output: null,
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 56
            }]
        },
        {
            code: "const hasProperty = Object.prototype.hasOwnProperty.call(object, property);",
            output: "const hasProperty = Object.hasOwn(object, property);",
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
            output: "const hasProperty = (( Object.hasOwn(object, property) ));",
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
            output: "const hasProperty = (( Object.hasOwn ))(object, property);",
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
            output: "const hasProperty = Object.hasOwn(object, property);",
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
            output: "const hasProperty = Object.hasOwn(object, property);",
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
            output: "const hasProperty = Object.hasOwn(object, property);",
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
            output: "const hasProperty = Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 61
            }]
        },
        {
            code: "const hasProperty={}.hasOwnProperty.call(object, property);",
            output: "const hasProperty=Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 19,
                endLine: 1,
                endColumn: 59
            }]
        },
        {
            code: "const hasProperty = (( {}.hasOwnProperty.call(object, property) ));",
            output: "const hasProperty = (( Object.hasOwn(object, property) ));",
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
            output: "const hasProperty = (( Object.hasOwn ))(object, property);",
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
            output: "const hasProperty = Object.hasOwn(object, property);",
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
            output: "const hasProperty = Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 67
            }]
        },
        {
            code: "function foo(){return {}.hasOwnProperty.call(object, property)}",
            output: "function foo(){return Object.hasOwn(object, property)}",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 23,
                endLine: 1,
                endColumn: 63
            }]
        },

        // https://github.com/eslint/eslint/pull/15346#issuecomment-991417335
        {
            code: "function foo(){return{}.hasOwnProperty.call(object, property)}",
            output: "function foo(){return Object.hasOwn(object, property)}",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 22,
                endLine: 1,
                endColumn: 62
            }]
        },
        {
            code: "function foo(){return/*comment*/{}.hasOwnProperty.call(object, property)}",
            output: "function foo(){return/*comment*/Object.hasOwn(object, property)}",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 33,
                endLine: 1,
                endColumn: 73
            }]
        },
        {
            code: "async function foo(){return await{}.hasOwnProperty.call(object, property)}",
            output: "async function foo(){return await Object.hasOwn(object, property)}",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 34,
                endLine: 1,
                endColumn: 74
            }]
        },
        {
            code: "async function foo(){return await/*comment*/{}.hasOwnProperty.call(object, property)}",
            output: "async function foo(){return await/*comment*/Object.hasOwn(object, property)}",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 45,
                endLine: 1,
                endColumn: 85
            }]
        },
        {
            code: "for (const x of{}.hasOwnProperty.call(object, property).toString());",
            output: "for (const x of Object.hasOwn(object, property).toString());",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 56
            }]
        },
        {
            code: "for (const x of/*comment*/{}.hasOwnProperty.call(object, property).toString());",
            output: "for (const x of/*comment*/Object.hasOwn(object, property).toString());",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 27,
                endLine: 1,
                endColumn: 67
            }]
        },
        {
            code: "for (const x in{}.hasOwnProperty.call(object, property).toString());",
            output: "for (const x in Object.hasOwn(object, property).toString());",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 56
            }]
        },
        {
            code: "for (const x in/*comment*/{}.hasOwnProperty.call(object, property).toString());",
            output: "for (const x in/*comment*/Object.hasOwn(object, property).toString());",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 27,
                endLine: 1,
                endColumn: 67
            }]
        },
        {
            code: "function foo(){return({}.hasOwnProperty.call)(object, property)}",
            output: "function foo(){return(Object.hasOwn)(object, property)}",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 22,
                endLine: 1,
                endColumn: 64
            }]
        },
        {
            code: "Object['prototype']['hasOwnProperty']['call'](object, property);",
            output: "Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 64
            }]
        },
        {
            code: "Object[`prototype`][`hasOwnProperty`][`call`](object, property);",
            output: "Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 64
            }]
        },
        {
            code: "Object['hasOwnProperty']['call'](object, property);",
            output: "Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 51
            }]
        },
        {
            code: "Object[`hasOwnProperty`][`call`](object, property);",
            output: "Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 51
            }]
        },
        {
            code: "({})['hasOwnProperty']['call'](object, property);",
            output: "Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 49
            }]
        },
        {
            code: "({})[`hasOwnProperty`][`call`](object, property);",
            output: "Object.hasOwn(object, property);",
            errors: [{
                messageId: "useHasOwn",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 49
            }]
        }
    ]
});
