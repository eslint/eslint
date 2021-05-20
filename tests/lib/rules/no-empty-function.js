/**
 * @fileoverview Tests for no-empty-function rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-function"),
    { RuleTester } = require("../../../lib/rule-tester");

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
    "constructors",
    "asyncFunctions",
    "asyncMethods"
]);

/**
 * Folds test items to `{valid: [], invalid: []}`.
 * One item would be converted to 4 valid patterns and 8 invalid patterns.
 * @param {{valid: Object[], invalid: Object[]}} patterns The result.
 * @param {{code: string, message: string, allow: string}} item A test item.
 * @returns {{valid: Object[], invalid: Object[]}} The result.
 */
function toValidInvalid(patterns, item) {

    const ecmaVersion =
        item.parserOptions && item.parserOptions.ecmaVersion
            ? item.parserOptions.ecmaVersion
            : 6;

    // Valid Patterns
    patterns.valid.push(
        {
            code: item.code.replace("{}", "{ bar(); }"),
            parserOptions: { ecmaVersion }
        },
        {
            code: item.code.replace("{}", "{ /* empty */ }"),
            parserOptions: { ecmaVersion }
        },
        {
            code: item.code.replace("{}", "{\n    // empty\n}"),
            parserOptions: { ecmaVersion }
        },
        {
            code: `${item.code} // allow: ${item.allow}`,
            options: [{ allow: [item.allow] }],
            parserOptions: { ecmaVersion }
        }
    );

    const error = item.message || { messageId: item.messageId, data: item.data };

    // Invalid Patterns.
    patterns.invalid.push({
        code: item.code,
        errors: [error],
        parserOptions: { ecmaVersion }
    });
    ALLOW_OPTIONS
        .filter(allow => allow !== item.allow)
        .forEach(allow => {

            // non related "allow" option has no effect.
            patterns.invalid.push({
                code: `${item.code} // allow: ${allow}`,
                errors: [error],
                options: [{ allow: [allow] }],
                parserOptions: { ecmaVersion }
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
    },
    {
        code: "const foo = { async method() {} }",
        allow: "asyncMethods",
        messageId: "unexpected",
        data: { name: "async method 'method'" },
        parserOptions: { ecmaVersion: 8 }
    },
    {
        code: "async function a(){}",
        allow: "asyncFunctions",
        messageId: "unexpected",
        data: { name: "async function 'a'" },
        parserOptions: { ecmaVersion: 8 }
    },
    {
        code: "const foo = async function () {}",
        messageId: "unexpected",
        data: { name: "async function" },
        allow: "asyncFunctions",
        parserOptions: { ecmaVersion: 8 }
    },
    {
        code: "class Foo { async bar() {} }",
        messageId: "unexpected",
        data: { name: "async method 'bar'" },
        allow: "asyncMethods",
        parserOptions: { ecmaVersion: 8 }
    },
    {
        code: "const foo = async () => {};",
        messageId: "unexpected",
        data: { name: "async arrow function" },
        allow: "arrowFunctions",
        parserOptions: { ecmaVersion: 8 }
    }
].reduce(toValidInvalid, {
    valid: [
        {
            code: "var foo = () => 0;",
            parserOptions: { ecmaVersion: 6 }
        }

    ],
    invalid: [

        // location tests
        {
            code: "function foo() {}",
            errors: [{
                messageId: "unexpected",
                data: { name: "function 'foo'" },
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 18
            }]
        },
        {
            code: "var foo = function () {\n}",
            errors: [{
                messageId: "unexpected",
                data: { name: "function" },
                line: 1,
                column: 23,
                endLine: 2,
                endColumn: 2
            }]
        },
        {
            code: "var foo = () => { \n\n  }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { name: "arrow function" },
                line: 1,
                column: 17,
                endLine: 3,
                endColumn: 4
            }]
        },
        {
            code: "var obj = {\n\tfoo() {\n\t}\n}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { name: "method 'foo'" },
                line: 2,
                column: 8,
                endLine: 3,
                endColumn: 3
            }]
        },
        {
            code: "class A { foo() { } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { name: "method 'foo'" },
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 20
            }]
        }
    ]
}));
