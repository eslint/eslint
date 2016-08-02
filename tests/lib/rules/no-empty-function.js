/**
 * @fileoverview Tests for no-empty-function rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-function"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALLOW_OPTIONS = Object.freeze([
    "functions",
    "arrowFunctions",
    "generatorFunctions",
    "methods",
    "generatorMethods",
    "getters",
    "setters",
    "constructors"
]);

/**
 * Folds test items to `{valid: [], invalid: []}`.
 * One item would be converted to 4 valid patterns and 8 invalid patterns.
 *
 * @param {{valid: object[], invalid: object[]}} patterns - The result.
 * @param {{code: string, message: string, allow: string}} item - A test item.
 * @returns {{valid: object[], invalid: object[]}} The result.
 */
function toValidInvalid(patterns, item) {

    // Valid Patterns
    patterns.valid.push(
        {
            code: item.code.replace("{}", "{ bar(); }"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: item.code.replace("{}", "{ /* empty */ }"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: item.code.replace("{}", "{\n    // empty\n}"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: item.code + " // allow: " + item.allow,
            options: [{allow: [item.allow]}],
            parserOptions: {ecmaVersion: 6}
        }
    );

    // Invalid Patterns.
    patterns.invalid.push({
        code: item.code,
        errors: [item.message],
        parserOptions: {ecmaVersion: 6}
    });
    ALLOW_OPTIONS
        .filter(function(allow) {
            return allow !== item.allow;
        })
        .forEach(function(allow) {

            // non related "allow" option has no effect.
            patterns.invalid.push({
                code: item.code + " // allow: " + allow,
                errors: [item.message],
                options: [{allow: [allow]}],
                parserOptions: {ecmaVersion: 6}
            });
        });

    return patterns;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-empty-function", rule, [
    {
        code: "function foo() {}",
        message: "Unexpected empty function.",
        allow: "functions"
    },
    {
        code: "var foo = function() {};",
        message: "Unexpected empty function.",
        allow: "functions"
    },
    {
        code: "var obj = {foo: function() {}};",
        message: "Unexpected empty function.",
        allow: "functions"
    },
    {
        code: "var foo = () => {};",
        message: "Unexpected empty arrow function.",
        allow: "arrowFunctions"
    },
    {
        code: "function* foo() {}",
        message: "Unexpected empty generator function.",
        allow: "generatorFunctions"
    },
    {
        code: "var foo = function*() {};",
        message: "Unexpected empty generator function.",
        allow: "generatorFunctions"
    },
    {
        code: "var obj = {foo: function*() {}};",
        message: "Unexpected empty generator function.",
        allow: "generatorFunctions"
    },
    {
        code: "var obj = {foo() {}};",
        message: "Unexpected empty method.",
        allow: "methods"
    },
    {
        code: "class A {foo() {}}",
        message: "Unexpected empty method.",
        allow: "methods"
    },
    {
        code: "class A {static foo() {}}",
        message: "Unexpected empty method.",
        allow: "methods"
    },
    {
        code: "var A = class {foo() {}};",
        message: "Unexpected empty method.",
        allow: "methods"
    },
    {
        code: "var A = class {static foo() {}};",
        message: "Unexpected empty method.",
        allow: "methods"
    },
    {
        code: "var obj = {*foo() {}};",
        message: "Unexpected empty generator method.",
        allow: "generatorMethods"
    },
    {
        code: "class A {*foo() {}}",
        message: "Unexpected empty generator method.",
        allow: "generatorMethods"
    },
    {
        code: "class A {static *foo() {}}",
        message: "Unexpected empty generator method.",
        allow: "generatorMethods"
    },
    {
        code: "var A = class {*foo() {}};",
        message: "Unexpected empty generator method.",
        allow: "generatorMethods"
    },
    {
        code: "var A = class {static *foo() {}};",
        message: "Unexpected empty generator method.",
        allow: "generatorMethods"
    },
    {
        code: "var obj = {get foo() {}};",
        message: "Unexpected empty getter.",
        allow: "getters"
    },
    {
        code: "class A {get foo() {}}",
        message: "Unexpected empty getter.",
        allow: "getters"
    },
    {
        code: "class A {static get foo() {}}",
        message: "Unexpected empty getter.",
        allow: "getters"
    },
    {
        code: "var A = class {get foo() {}};",
        message: "Unexpected empty getter.",
        allow: "getters"
    },
    {
        code: "var A = class {static get foo() {}};",
        message: "Unexpected empty getter.",
        allow: "getters"
    },
    {
        code: "var obj = {set foo(value) {}};",
        message: "Unexpected empty setter.",
        allow: "setters"
    },
    {
        code: "class A {set foo(value) {}}",
        message: "Unexpected empty setter.",
        allow: "setters"
    },
    {
        code: "class A {static set foo(value) {}}",
        message: "Unexpected empty setter.",
        allow: "setters"
    },
    {
        code: "var A = class {set foo(value) {}};",
        message: "Unexpected empty setter.",
        allow: "setters"
    },
    {
        code: "var A = class {static set foo(value) {}};",
        message: "Unexpected empty setter.",
        allow: "setters"
    },
    {
        code: "class A {constructor() {}}",
        message: "Unexpected empty constructor.",
        allow: "constructors"
    },
    {
        code: "var A = class {constructor() {}};",
        message: "Unexpected empty constructor.",
        allow: "constructors"
    }
].reduce(toValidInvalid, {
    valid: [
        {
            code: "var foo = () => 0;",
            parserOptions: {ecmaVersion: 6}
        }
    ],
    invalid: []
}));
