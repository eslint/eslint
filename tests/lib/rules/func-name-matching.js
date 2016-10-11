/**
 * @fileoverview Tests for func-name-matching rule.
 * @author Annie Zhang
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-name-matching"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("func-name-matching", rule, {
    valid: [
        { code: "var foo;" },
        { code: "var foo = function foo() {};" },
        { code: "var foo = function() {}"},
        { code: "var foo = () => {}", parserOptions: { ecmaVersion: 6} },
        { code: "foo = function foo() {};" },
        { code: "obj.foo = function foo() {};" },
        { code: "obj.foo = function() {};" },
        { code: "obj.bar.foo = function foo() {};" },
        { code: "obj['foo'] = function foo() {};" },
        { code: "obj['foo//bar'] = function foo() {};"},
        { code: "obj[foo] = function bar() {};" },
        { code: "var obj = {foo: function foo() {}};" },
        { code: "var obj = {'foo': function foo() {}};" },
        { code: "var obj = {'foo//bar': function foo() {}};" },
        { code: "var obj = {foo: function() {}};" },
        { code: "var obj = {[foo]: function bar() {}} ", parserOptions: { ecmaVersion: 6} },
        { code: "var obj = {['x' + 2]: function bar(){}};", parserOptions: { ecmaVersion: 6} },
        { code: "obj['x' + 2] = function bar(){};" },
        { code: "var [ bar ] = [ function bar(){} ];", parserOptions: { ecmaVersion: 6} },
        { code: "function a(foo = function bar() {}) {}", parserOptions: { ecmaVersion: 6} },
        { code: "module.exports = function foo(name) {};" },
        { code: "module['exports'] = function foo(name) {};" },
        {
            code: "module.exports = function foo(name) {};",
            options: [{ includeCommonJSModuleExports: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "module['exports'] = function foo(name) {};",
            options: [{ includeCommonJSModuleExports: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({['foo']: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({['❤']: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[foo]: function bar() {}})",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "let foo = function bar() {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match variable name `foo`" }
            ]
        },
        {
            code: "foo = function bar() {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match variable name `foo`" }
            ]
        },
        {
            code: "obj.foo = function bar() {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match property name `foo`" }
            ]
        },
        {
            code: "obj.bar.foo = function bar() {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match property name `foo`" }
            ]
        },
        {
            code: "obj['foo'] = function bar() {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match property name `foo`" }
            ]
        },
        {
            code: "let obj = {foo: function bar() {}};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match property name `foo`" }
            ]
        },
        {
            code: "let obj = {'foo': function bar() {}};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match property name `foo`" }
            ]
        },
        {
            code: "({['foo']: function bar() {}})",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match property name `foo`"}
            ]
        },
        {
            code: "module.exports = function foo(name) {};",
            parserOptions: { ecmaVersion: 6 },
            options: [{ includeCommonJSModuleExports: true }],
            errors: [
                { message: "Function name `foo` should match property name `exports`" }
            ]
        },
        {
            code: "module['exports'] = function foo(name) {};",
            parserOptions: { ecmaVersion: 6 },
            options: [{ includeCommonJSModuleExports: true }],
            errors: [
                { message: "Function name `foo` should match property name `exports`" }
            ]
        }
    ]
});
