/**
 * @fileoverview Tests for complexity rule.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/accessor-pairs"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("accessor-pairs", rule, {
    valid: [

        //------------------------------------------------------------------------------
        // General
        //------------------------------------------------------------------------------

        // Does not check object patterns
        {
            code: "var { get: foo } = bar; ({ set: foo } = bar);",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var { set } = foo; ({ get } = foo);",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        //------------------------------------------------------------------------------
        // Object literals
        //------------------------------------------------------------------------------

        // Test default settings, this would be an error if `getWithoutSet` was set to `true`
        "var o = { get a() {} }",

        // No accessors
        {
            code: "var o = {};",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { a: 1 };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { a };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { a: get };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { a: set };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { get: function(){} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { set: function(foo){} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { get };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { set };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { [get]: function() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { [set]: function(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { set(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Disabled options
        {
            code: "var o = { get a() {} };",
            options: [{ setWithoutGet: false, getWithoutSet: false }]
        },
        {
            code: "var o = { get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: false }]
        },
        {
            code: "var o = { set a(foo) {} };",
            options: [{ setWithoutGet: false, getWithoutSet: false }]
        },
        {
            code: "var o = { set a(foo) {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true }]
        },
        {
            code: "var o = { set a(foo) {} };",
            options: [{ setWithoutGet: false }]
        },

        // Valid pairs with identifiers
        {
            code: "var o = { get a() {}, set a(foo) {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true }]
        },
        {
            code: "var o = { get a() {}, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: false }]
        },
        {
            code: "var o = { get a() {}, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { set a(foo) {}, get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },

        // Valid pairs with statically computed names
        {
            code: "var o = { get 'a'() {}, set 'a'(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { get a() {}, set 'a'(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { get ['abc']() {}, set ['abc'](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [1e2]() {}, set 100(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get abc() {}, set [`abc`](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get ['123']() {}, set 123(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Valid pairs with expressions
        {
            code: "var o = { get [a]() {}, set [a](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [a]() {}, set [(a)](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [(a)]() {}, set [a](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [a]() {}, set [ a ](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [/*comment*/a/*comment*/]() {}, set [a](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [f()]() {}, set [f()](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [f(a)]() {}, set [f(a)](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [a + b]() {}, set [a + b](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get [`${a}`]() {}, set [`${a}`](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Multiple valid pairs in the same literal
        {
            code: "var o = { get a() {}, set a(foo) {}, get b() {}, set b(bar) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { get a() {}, set c(foo) {}, set a(bar) {}, get b() {}, get c() {}, set b(baz) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },

        // Valid pairs with other elements
        {
            code: "var o = { get a() {}, set a(foo) {}, b: bar };",
            options: [{ setWithoutGet: true, getWithoutSet: true }]
        },
        {
            code: "var o = { get a() {}, b, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get a() {}, ...b, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "var o = { get a() {}, set a(foo) {}, ...a };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 2018 }
        },

        // Duplicate keys. This is the responsibility of no-dupe-keys, but this rule still checks is there the other accessor kind.
        {
            code: "var o = { get a() {}, get a() {}, set a(foo) {}, };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get a() {}, set a(foo) {}, get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get a() {}, set a(foo) {}, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { set a(bar) {}, get a() {}, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get a() {}, get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { set a(foo) {}, set a(foo) {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { get a() {}, set a(foo) {}, a };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = { a, get a() {}, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        /*
         * This should be actually invalid by this rule!
         * This code creates a property with the setter only, the getter will be ignored.
         * It's treated as 3 attempts to define the same key, and the last wins.
         * However, this edge case is not covered, it should be reported by no-dupe-keys anyway.
         */
        {
            code: "var o = { get a() {}, a:1, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        //------------------------------------------------------------------------------
        // Property descriptors
        //------------------------------------------------------------------------------

        "var o = {a: 1};\n Object.defineProperty(o, 'b', \n{set: function(value) {\n val = value; \n},\n get: function() {\n return val; \n} \n});",

        // https://github.com/eslint/eslint/issues/3262
        "var o = {set: function() {}}",
        "Object.defineProperties(obj, {set: {value: function() {}}});",
        "Object.create(null, {set: {value: function() {}}});",
        { code: "var o = {get: function() {}}", options: [{ getWithoutSet: true }] },
        { code: "var o = {[set]: function() {}}", parserOptions: { ecmaVersion: 6 } },
        { code: "var set = 'value'; Object.defineProperty(obj, 'foo', {[set]: function(value) {}});", parserOptions: { ecmaVersion: 6 } }
    ],

    invalid: [

        //------------------------------------------------------------------------------
        // Object literals
        //------------------------------------------------------------------------------

        // Test default settings
        {
            code: "var o = { set a(value) {} };",
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property" }]
        },

        // Test that the options do not affect each other
        {
            code: "var o = { set a(value) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: false }],
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property" }]
        },
        {
            code: "var o = { set a(value) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property" }]
        },
        {
            code: "var o = { get a() {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property" }]
        },
        {
            code: "var o = { get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property" }]
        },
        {
            code: "var o = { get a() {} };",
            options: [{ getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property" }]
        },

        // Various kinds of the getter's key
        {
            code: "var o = { get abc() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter 'abc'.", type: "Property" }]
        },
        {
            code: "var o = { get 'abc'() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter 'abc'.", type: "Property" }]
        },
        {
            code: "var o = { get 123() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter '123'.", type: "Property" }]
        },
        {
            code: "var o = { get 1e2() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter '100'.", type: "Property" }]
        },
        {
            code: "var o = { get ['abc']() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter 'abc'.", type: "Property" }]
        },
        {
            code: "var o = { get [`abc`]() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter 'abc'.", type: "Property" }]
        },
        {
            code: "var o = { get [123]() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter '123'.", type: "Property" }]
        },
        {
            code: "var o = { get [abc]() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter.", type: "Property" }]
        },
        {
            code: "var o = { get [f(abc)]() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter.", type: "Property" }]
        },
        {
            code: "var o = { get [a + b]() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter.", type: "Property" }]
        },

        // Various kinds of the setter's key
        {
            code: "var o = { set abc(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Getter is not present for setter 'abc'.", type: "Property" }]
        },
        {
            code: "var o = { set 'abc'(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Getter is not present for setter 'abc'.", type: "Property" }]
        },
        {
            code: "var o = { set 123(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Getter is not present for setter '123'.", type: "Property" }]
        },
        {
            code: "var o = { set 1e2(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Getter is not present for setter '100'.", type: "Property" }]
        },
        {
            code: "var o = { set ['abc'](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for setter 'abc'.", type: "Property" }]
        },
        {
            code: "var o = { set [`abc`](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for setter 'abc'.", type: "Property" }]
        },
        {
            code: "var o = { set [123](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for setter '123'.", type: "Property" }]
        },
        {
            code: "var o = { set [abc](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for setter.", type: "Property" }]
        },
        {
            code: "var o = { set [f(abc)](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for setter.", type: "Property" }]
        },
        {
            code: "var o = { set [a + b](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for setter.", type: "Property" }]
        },

        // Different keys
        {
            code: "var o = { get a() {}, set b(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'b'.", type: "Property", column: 23 }
            ]
        },
        {
            code: "var o = { set a(foo) {}, get b() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 11 },
                { message: "Setter is not present for getter 'b'.", type: "Property", column: 26 }
            ]
        },
        {
            code: "var o = { get 1() {}, set b(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter '1'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'b'.", type: "Property", column: 23 }
            ]
        },
        {
            code: "var o = { get a() {}, set 1(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter '1'.", type: "Property", column: 23 }
            ]
        },
        {
            code: "var o = { get a() {}, set 'a '(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'a '.", type: "Property", column: 23 }
            ]
        },
        {
            code: "var o = { get ' a'() {}, set 'a'(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter ' a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 26 }
            ]
        },
        {
            code: "var o = { get ''() {}, set ' '(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { messageId: "missingSetterInObjectLiteral", type: "Property", column: 11 }, // TODO: Change to message when getFunctionNameWithKind gets fixed
                { message: "Getter is not present for setter ' '.", type: "Property", column: 24 }
            ]
        },
        {
            code: "var o = { get ''() {}, set null(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { messageId: "missingSetterInObjectLiteral", type: "Property", column: 11 }, // TODO: Change to message when getFunctionNameWithKind gets fixed
                { message: "Getter is not present for setter 'null'.", type: "Property", column: 24 }
            ]
        },
        {
            code: "var o = { get [`a`]() {}, set b(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'b'.", type: "Property", column: 27 }
            ]
        },
        {
            code: "var o = { get [a]() {}, set [b](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter.", type: "Property", column: 11 },
                { message: "Getter is not present for setter.", type: "Property", column: 25 }
            ]
        },
        {
            code: "var o = { get [a]() {}, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 25 }
            ]
        },
        {
            code: "var o = { get a() {}, set [a](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter.", type: "Property", column: 23 }
            ]
        },
        {
            code: "var o = { get [a + b]() {}, set [a - b](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter.", type: "Property", column: 11 },
                { message: "Getter is not present for setter.", type: "Property", column: 29 }
            ]
        },
        {
            code: "var o = { get [`${0} `]() {}, set [`${0}`](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter.", type: "Property", column: 11 },
                { message: "Getter is not present for setter.", type: "Property", column: 31 }
            ]
        },

        // Multiple invalid of same and different kinds
        {
            code: "var o = { get a() {}, get b() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 11 },
                { message: "Setter is not present for getter 'b'.", type: "Property", column: 23 }
            ]
        },
        {
            code: "var o = { set a(foo) {}, set b(bar) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'b'.", type: "Property", column: 26 }
            ]
        },
        {
            code: "var o = { get a() {}, set b(foo) {}, set c(foo) {}, get d() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'b'.", type: "Property", column: 23 },
                { message: "Getter is not present for setter 'c'.", type: "Property", column: 38 },
                { message: "Setter is not present for getter 'd'.", type: "Property", column: 53 }
            ]
        },

        // Checks per object literal
        {
            code: "var o1 = { get a() {} }, o2 = { set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 12 },
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 33 }
            ]
        },
        {
            code: "var o1 = { set a(foo) {} }, o2 = { get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 12 },
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 36 }
            ]
        },

        // Combinations or valid and invalid
        {
            code: "var o = { get a() {}, get b() {}, set b(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property", column: 11 }]
        },
        {
            code: "var o = { get b() {}, get a() {}, set b(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property", column: 23 }]
        },
        {
            code: "var o = { get b() {}, set b(foo) {}, get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property", column: 38 }]
        },
        {
            code: "var o = { set a(foo) {}, get b() {}, set b(bar) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property", column: 11 }]
        },
        {
            code: "var o = { get b() {}, set a(foo) {}, set b(bar) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property", column: 23 }]
        },
        {
            code: "var o = { get b() {}, set b(bar) {}, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property", column: 38 }]
        },
        {
            code: "var o = { get v1() {}, set i1(foo) {}, get v2() {}, set v2(bar) {}, get i2() {}, set v1(baz) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Getter is not present for setter 'i1'.", type: "Property", column: 24 },
                { message: "Setter is not present for getter 'i2'.", type: "Property", column: 69 }
            ]
        },

        // In the case of duplicates which don't have the other kind, all nodes are reported
        {
            code: "var o = { get a() {}, get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 11 },
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 23 }
            ]
        },
        {
            code: "var o = { set a(foo) {}, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 11 },
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 26 }
            ]
        },

        // Other elements or even value property duplicates in the same literal do not affect this rule
        {
            code: "var o = { a, get b() {}, c };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter 'b'.", type: "Property", column: 14 }]
        },
        {
            code: "var o = { a, get b() {}, c, set d(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter 'b'.", type: "Property", column: 14 },
                { message: "Getter is not present for setter 'd'.", type: "Property", column: 29 }
            ]
        },
        {
            code: "var o = { get a() {}, a:1 };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property", column: 11 }]
        },
        {
            code: "var o = { a, get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property", column: 14 }]
        },
        {
            code: "var o = { set a(foo) {}, a:1 };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property", column: 11 }]
        },
        {
            code: "var o = { a, set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property", column: 14 }]
        },
        {
            code: "var o = { get a() {}, ...b };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property", column: 11 }]
        },
        {
            code: "var o = { get a() {}, ...a };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ message: "Setter is not present for getter 'a'.", type: "Property", column: 11 }]
        },
        {
            code: "var o = { set a(foo) {}, ...a };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ message: "Getter is not present for setter 'a'.", type: "Property", column: 11 }]
        },

        // Full location tests
        {
            code: "var o = { get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                message: "Setter is not present for getter 'a'.",
                type: "Property",
                line: 1,
                column: 11,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "var o = {\n  set [\n a](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                message: "Getter is not present for setter.",
                type: "Property",
                line: 2,
                column: 3,
                endLine: 3,
                endColumn: 4
            }]
        },

        //------------------------------------------------------------------------------
        // Property descriptors
        //------------------------------------------------------------------------------

        {
            code: "var o = {d: 1};\n Object.defineProperty(o, 'c', \n{set: function(value) {\n val = value; \n} \n});",
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "Reflect.defineProperty(obj, 'foo', {set: function(value) {}});",
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "Object.defineProperties(obj, {foo: {set: function(value) {}}});",
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "Object.create(null, {foo: {set: function(value) {}}});",
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        }
    ]
});
