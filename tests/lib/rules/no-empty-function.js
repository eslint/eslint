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
 * @param {{valid: Object[], invalid: Object[]}} patterns - The result.
 * @param {{code: string, message: string, allow: string}} item - A test item.
 * @returns {{valid: Object[], invalid: Object[]}} The result.
 */
function toValidInvalid(patterns, item) {

    // Valid Patterns
    patterns.valid.push(
        {
            code: item.code.replace("{}", "{ bar(); }"),
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: item.code.replace("{}", "{ /* empty */ }"),
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: item.code.replace("{}", "{\n    // empty\n}"),
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: `${item.code} // allow: ${item.allow}`,
            options: [{ allow: [item.allow] }],
            parserOptions: { ecmaVersion: 6 }
        }
    );

    const error = item.message || { messageId: item.messageId, data: item.data };

    // Invalid Patterns.
    patterns.invalid.push({
        code: item.code,
        errors: [error],
        parserOptions: { ecmaVersion: 6 }
    });
    ALLOW_OPTIONS
        .filter(allow => allow !== item.allow)
        .forEach(allow => {

            // non related "allow" option has no effect.
            patterns.invalid.push({
                code: `${item.code} // allow: ${allow}`,
                errors: [error],
                options: [{ allow: [allow] }],
                parserOptions: { ecmaVersion: 6 }
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
        messageId: "unexpected",
        data: { name: "function 'foo'" },
        allow: "functions"
    },
    {
        code: "var foo = function() {};",
        messageId: "unexpected",
        data: { name: "function" },
        allow: "functions"
    },
    {
        code: "var obj = {foo: function() {}};",
        messageId: "unexpected",
        data: { name: "method 'foo'" },
        allow: "functions"
    },
    {
        code: "var foo = () => {};",
        messageId: "unexpected",
        data: { name: "arrow function" },
        allow: "arrowFunctions"
    },
    {
        code: "function* foo() {}",
        messageId: "unexpected",
        data: { name: "generator function 'foo'" },
        allow: "generatorFunctions"
    },
    {
        code: "var foo = function*() {};",
        messageId: "unexpected",
        data: { name: "generator function" },
        allow: "generatorFunctions"
    },
    {
        code: "var obj = {foo: function*() {}};",
        messageId: "unexpected",
        data: { name: "generator method 'foo'" },
        allow: "generatorFunctions"
    },
    {
        code: "var obj = {foo() {}};",
        messageId: "unexpected",
        data: { name: "method 'foo'" },
        allow: "methods"
    },
    {
        code: "class A {foo() {}}",
        messageId: "unexpected",
        data: { name: "method 'foo'" },
        allow: "methods"
    },
    {
        code: "class A {static foo() {}}",
        messageId: "unexpected",
        data: { name: "static method 'foo'" },
        allow: "methods"
    },
    {
        code: "var A = class {foo() {}};",
        messageId: "unexpected",
        data: { name: "method 'foo'" },
        allow: "methods"
    },
    {
        code: "var A = class {static foo() {}};",
        messageId: "unexpected",
        data: { name: "static method 'foo'" },
        allow: "methods"
    },
    {
        code: "var obj = {*foo() {}};",
        messageId: "unexpected",
        data: { name: "generator method 'foo'" },
        allow: "generatorMethods"
    },
    {
        code: "class A {*foo() {}}",
        messageId: "unexpected",
        data: { name: "generator method 'foo'" },
        allow: "generatorMethods"
    },
    {
        code: "class A {static *foo() {}}",
        messageId: "unexpected",
        data: { name: "static generator method 'foo'" },
        allow: "generatorMethods"
    },
    {
        code: "var A = class {*foo() {}};",
        messageId: "unexpected",
        data: { name: "generator method 'foo'" },
        allow: "generatorMethods"
    },
    {
        code: "var A = class {static *foo() {}};",
        messageId: "unexpected",
        data: { name: "static generator method 'foo'" },
        allow: "generatorMethods"
    },
    {
        code: "var obj = {get foo() {}};",
        messageId: "unexpected",
        data: { name: "getter 'foo'" },
        allow: "getters"
    },
    {
        code: "class A {get foo() {}}",
        messageId: "unexpected",
        data: { name: "getter 'foo'" },
        allow: "getters"
    },
    {
        code: "class A {static get foo() {}}",
        messageId: "unexpected",
        data: { name: "static getter 'foo'" },
        allow: "getters"
    },
    {
        code: "var A = class {get foo() {}};",
        messageId: "unexpected",
        data: { name: "getter 'foo'" },
        allow: "getters"
    },
    {
        code: "var A = class {static get foo() {}};",
        messageId: "unexpected",
        data: { name: "static getter 'foo'" },
        allow: "getters"
    },
    {
        code: "var obj = {set foo(value) {}};",
        messageId: "unexpected",
        data: { name: "setter 'foo'" },
        allow: "setters"
    },
    {
        code: "class A {set foo(value) {}}",
        messageId: "unexpected",
        data: { name: "setter 'foo'" },
        allow: "setters"
    },
    {
        code: "class A {static set foo(value) {}}",
        messageId: "unexpected",
        data: { name: "static setter 'foo'" },
        allow: "setters"
    },
    {
        code: "var A = class {set foo(value) {}};",
        messageId: "unexpected",
        data: { name: "setter 'foo'" },
        allow: "setters"
    },
    {
        code: "var A = class {static set foo(value) {}};",
        messageId: "unexpected",
        data: { name: "static setter 'foo'" },
        allow: "setters"
    },
    {
        code: "class A {constructor() {}}",
        messageId: "unexpected",
        data: { name: "constructor" },
        allow: "constructors"
    },
    {
        code: "var A = class {constructor() {}};",
        messageId: "unexpected",
        data: { name: "constructor" },
        allow: "constructors"
    }
].reduce(toValidInvalid, {
    valid: [
        {
            code: "var foo = () => 0;",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: []
}));
