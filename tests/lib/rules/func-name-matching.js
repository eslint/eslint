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
        "var foo;",
        "var foo = function foo() {};",
        { code: "var foo = function foo() {};", options: ["always"] },
        { code: "var foo = function bar() {};", options: ["never"] },
        "var foo = function() {}",
        { code: "var foo = () => {}", parserOptions: { ecmaVersion: 6 } },
        "foo = function foo() {};",
        { code: "foo = function foo() {};", options: ["always"] },
        { code: "foo = function bar() {};", options: ["never"] },
        "obj.foo = function foo() {};",
        { code: "obj.foo = function foo() {};", options: ["always"] },
        { code: "obj.foo = function bar() {};", options: ["never"] },
        "obj.foo = function() {};",
        { code: "obj.foo = function() {};", options: ["always"] },
        { code: "obj.foo = function() {};", options: ["never"] },
        "obj.bar.foo = function foo() {};",
        { code: "obj.bar.foo = function foo() {};", options: ["always"] },
        { code: "obj.bar.foo = function baz() {};", options: ["never"] },
        "obj['foo'] = function foo() {};",
        { code: "obj['foo'] = function foo() {};", options: ["always"] },
        { code: "obj['foo'] = function bar() {};", options: ["never"] },
        "obj['foo//bar'] = function foo() {};",
        { code: "obj['foo//bar'] = function foo() {};", options: ["always"] },
        { code: "obj['foo//bar'] = function foo() {};", options: ["never"] },
        "obj[foo] = function bar() {};",
        { code: "obj[foo] = function bar() {};", options: ["always"] },
        { code: "obj[foo] = function bar() {};", options: ["never"] },
        "var obj = {foo: function foo() {}};",
        { code: "var obj = {foo: function foo() {}};", options: ["always"] },
        { code: "var obj = {foo: function bar() {}};", options: ["never"] },
        "var obj = {'foo': function foo() {}};",
        { code: "var obj = {'foo': function foo() {}};", options: ["always"] },
        { code: "var obj = {'foo': function bar() {}};", options: ["never"] },
        "var obj = {'foo//bar': function foo() {}};",
        { code: "var obj = {'foo//bar': function foo() {}};", options: ["always"] },
        { code: "var obj = {'foo//bar': function foo() {}};", options: ["never"] },
        "var obj = {foo: function() {}};",
        { code: "var obj = {foo: function() {}};", options: ["always"] },
        { code: "var obj = {foo: function() {}};", options: ["never"] },
        { code: "var obj = {[foo]: function bar() {}} ", parserOptions: { ecmaVersion: 6 } },
        { code: "var obj = {['x' + 2]: function bar(){}};", parserOptions: { ecmaVersion: 6 } },
        "obj['x' + 2] = function bar(){};",
        { code: "var [ bar ] = [ function bar(){} ];", parserOptions: { ecmaVersion: 6 } },
        { code: "function a(foo = function bar() {}) {}", parserOptions: { ecmaVersion: 6 } },
        "module.exports = function foo(name) {};",
        "module['exports'] = function foo(name) {};",
        {
            code: "module.exports = function foo(name) {};",
            options: [{ includeCommonJSModuleExports: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "module.exports = function foo(name) {};",
            options: ["always", { includeCommonJSModuleExports: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "module.exports = function foo(name) {};",
            options: ["never", { includeCommonJSModuleExports: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "module['exports'] = function foo(name) {};",
            options: [{ includeCommonJSModuleExports: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "module['exports'] = function foo(name) {};",
            options: ["always", { includeCommonJSModuleExports: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "module['exports'] = function foo(name) {};",
            options: ["never", { includeCommonJSModuleExports: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({['foo']: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({['foo']: function foo() {}})",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({['foo']: function bar() {}})",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({['❤']: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[foo]: function bar() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[null]: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[1]: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[true]: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[`x`]: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[/abc/]: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[[1, 2, 3]]: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({[{x: 1}]: function foo() {}})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "[] = function foo() {}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({} = function foo() {})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "[a] = function foo() {}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({a} = function foo() {})",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var [] = function foo() {}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {} = function foo() {}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var [a] = function foo() {}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a} = function foo() {}",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "let foo = function bar() {};",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `bar` should match variable name `foo`" }
            ]
        },
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
                { message: "Function name `bar` should match property name `foo`" }
            ]
        },
        {
            code: "module.exports = function foo(name) {};",
            options: [{ includeCommonJSModuleExports: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `foo` should match property name `exports`" }
            ]
        },
        {
            code: "module.exports = function foo(name) {};",
            options: ["always", { includeCommonJSModuleExports: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `foo` should match property name `exports`" }
            ]
        },
        {
            code: "module.exports = function exports(name) {};",
            options: ["never", { includeCommonJSModuleExports: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `exports` should not match property name `exports`" }
            ]
        },
        {
            code: "module['exports'] = function foo(name) {};",
            options: [{ includeCommonJSModuleExports: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `foo` should match property name `exports`" }
            ]
        },
        {
            code: "module['exports'] = function foo(name) {};",
            options: ["always", { includeCommonJSModuleExports: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `foo` should match property name `exports`" }
            ]
        },
        {
            code: "module['exports'] = function exports(name) {};",
            options: ["never", { includeCommonJSModuleExports: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Function name `exports` should not match property name `exports`" }
            ]
        },
        {
            code: "var foo = function foo(name) {};",
            options: ["never"],
            errors: [
                { message: "Function name `foo` should not match variable name `foo`" }
            ]
        },
        {
            code: "obj.foo = function foo(name) {};",
            options: ["never"],
            errors: [
                { message: "Function name `foo` should not match property name `foo`" }
            ]
        }
    ]
});
