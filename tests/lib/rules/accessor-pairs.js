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
        {
            code: "var o = { get a() {} }",
            options: [{}]
        },

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
        { code: "var set = 'value'; Object.defineProperty(obj, 'foo', {[set]: function(value) {}});", parserOptions: { ecmaVersion: 6 } },

        //------------------------------------------------------------------------------
        // Classes
        //------------------------------------------------------------------------------

        // Test default settings
        {
            code: "class A { get a() {} }",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { get #a() {} }",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 13 }
        },

        // Explicitly disabled option
        {
            code: "class A { set a(foo) {} }",
            options: [{ enforceForClassMembers: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { get a() {} set b(foo) {} static get c() {} static set d(bar) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(class A { get a() {} set b(foo) {} static get c() {} static set d(bar) {} });",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: false }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Disabled accessor kind options
        {
            code: "class A { get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: false, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { set a(foo) {} }",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: false, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static set a(foo) {} }",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { set a(foo) {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { get a() {} set b(foo) {} static get c() {} static set d(bar) {} }",
            options: [{ setWithoutGet: false, getWithoutSet: false, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // No accessors
        {
            code: "class A {}",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(class {})",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { constructor () {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static a() {} 'b'() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { [a]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { a() {} static a() {} b() {} static c() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Valid pairs with identifiers
        {
            code: "class A { get a() {} set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { set a(foo) {} get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static get a() {} static set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static set a(foo) {} static get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(class { set a(foo) {} get a() {} });",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Valid pairs with statically computed names
        {
            code: "class A { get 'a'() {} set ['a'](foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { set [`a`](foo) {} get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { get 'a'() {} set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { static get 1e2() {} static set [100](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Valid pairs with expressions
        {
            code: "class A { get [a]() {} set [a](foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { set [(f())](foo) {} get [(f())]() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static set [f(a)](foo) {} static get [f(a)]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Multiple valid pairs in the same class
        {
            code: "class A { get a() {} set b(foo) {} set a(bar) {} get b() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { get a() {} set a(bar) {} b() {} set c(foo) {} get c() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(class { get a() {} static set a(foo) {} set a(bar) {} static get a() {} });",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Valid pairs with other elements
        {
            code: "class A { get a() {} b() {} set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { set a(foo) {} get a() {} b() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { a() {} get b() {} c() {} set b(foo) {} d() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { get a() {} set a(foo) {} static a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { static get a() {} static b() {} static set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { static set a(foo) {} static get a() {} a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // Duplicate keys. This is the responsibility of no-dupe-class-members, but this rule still checks if there is the other accessor kind.
        {
            code: "class A { get a() {} get a() {} set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { get [a]() {} set [a](foo) {} set [a](foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { get a() {} set 'a'(foo) {} get [`a`]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { get a() {} set a(foo) {} a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "A = class { a() {} get a() {} set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static set a(foo) {} static set a(foo) {} static get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static get a() {} static set a(foo) {} static get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static set a(foo) {} static get a() {} static a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        /*
         * This code should be invalid by this rule because it creates a class with the setter only, while the getter is ignored.
         * However, this edge case is not covered, it should be reported by no-dupe-class-members anyway.
         */
        {
            code: "class A { get a() {} a() {} set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { static set a(foo) {} static a() {} static get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 }
        }
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
        {
            code: "var o = { set a(value) {} };",
            options: [{}],
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
                { message: "Setter is not present for getter ''.", type: "Property", column: 11 },
                { message: "Getter is not present for setter ' '.", type: "Property", column: 24 }
            ]
        },
        {
            code: "var o = { get ''() {}, set null(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            errors: [
                { message: "Setter is not present for getter ''.", type: "Property", column: 11 },
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
            parserOptions: { ecmaVersion: 2015 },
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
        },
        {
            code: "var o = {d: 1};\n Object?.defineProperty(o, 'c', \n{set: function(value) {\n val = value; \n} \n});",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "Reflect?.defineProperty(obj, 'foo', {set: function(value) {}});",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "Object?.defineProperties(obj, {foo: {set: function(value) {}}});",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "Object?.create(null, {foo: {set: function(value) {}}});",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "var o = {d: 1};\n (Object?.defineProperty)(o, 'c', \n{set: function(value) {\n val = value; \n} \n});",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "(Reflect?.defineProperty)(obj, 'foo', {set: function(value) {}});",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "(Object?.defineProperties)(obj, {foo: {set: function(value) {}}});",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },
        {
            code: "(Object?.create)(null, {foo: {set: function(value) {}}});",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ message: "Getter is not present in property descriptor.", type: "ObjectExpression" }]
        },

        //------------------------------------------------------------------------------
        // Classes
        //------------------------------------------------------------------------------

        // Test default settings
        {
            code: "class A { set a(foo) {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { get a() {} set b(foo) {} }",
            options: [{}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'b'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class static setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "A = class { get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "A = class { get a() {} set b(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition" },
                { message: "Getter is not present for class setter 'b'.", type: "MethodDefinition" }
            ]
        },
        {
            code: "class A { set a(value) {} }",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static set a(value) {} }",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class static setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "A = class { set a(value) {} };",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "(class A { static set a(value) {} });",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class static setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { set '#a'(foo) {} }",
            parserOptions: { ecmaVersion: 13 },
            errors: [{ message: "Getter is not present for class setter '#a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { set #a(foo) {} }",
            parserOptions: { ecmaVersion: 13 },
            errors: [{ message: "Getter is not present for class private setter #a.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static set '#a'(foo) {} }",
            parserOptions: { ecmaVersion: 13 },
            errors: [{ message: "Getter is not present for class static setter '#a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static set #a(foo) {} }",
            parserOptions: { ecmaVersion: 13 },
            errors: [{ message: "Getter is not present for class static private setter #a.", type: "MethodDefinition" }]
        },

        // Test that the accessor kind options do not affect each other
        {
            code: "class A { set a(value) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: false, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "A = class { static set a(value) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class static setter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "let foo = class A { get a() {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "(class { get a() {} });",
            options: [{ getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { get '#a'() {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 13 },
            errors: [{ message: "Setter is not present for class getter '#a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { get #a() {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 13 },
            errors: [{ message: "Setter is not present for class private getter #a.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static get '#a'() {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 13 },
            errors: [{ message: "Setter is not present for class static getter '#a'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static get #a() {} };",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 13 },
            errors: [{ message: "Setter is not present for class static private getter #a.", type: "MethodDefinition" }]
        },

        // Various kinds of keys
        {
            code: "class A { get abc() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'abc'.", type: "MethodDefinition" }]
        },
        {
            code: "A = class { static set 'abc'(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class static setter 'abc'.", type: "MethodDefinition" }]
        },
        {
            code: "(class { get 123() {} });",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter '123'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static get 1e2() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class static getter '100'.", type: "MethodDefinition" }]
        },
        {
            code: "A = class { get ['abc']() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'abc'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { set [`abc`](foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'abc'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static get [123]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class static getter '123'.", type: "MethodDefinition" }]
        },
        {
            code: "class A { get [abc]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter.", type: "MethodDefinition" }]
        },
        {
            code: "class A { static get [f(abc)]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class static getter.", type: "MethodDefinition" }]
        },
        {
            code: "A = class { set [a + b](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter.", type: "MethodDefinition" }]
        },
        {
            code: "class A { get ['constructor']() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'constructor'.", type: "MethodDefinition" }]
        },

        // Different keys
        {
            code: "class A { get a() {} set b(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter 'b'.", type: "MethodDefinition", column: 22 }
            ]
        },
        {
            code: "A = class { set a(foo) {} get b() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Setter is not present for class getter 'b'.", type: "MethodDefinition", column: 27 }
            ]
        },
        {
            code: "A = class { static get a() {} static set b(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Getter is not present for class static setter 'b'.", type: "MethodDefinition", column: 31 }
            ]
        },
        {
            code: "class A { get a() {} set b(foo) {} }",
            options: [{ setWithoutGet: false, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 }
            ]
        },
        {
            code: "class A { get a() {} set b(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: false, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class setter 'b'.", type: "MethodDefinition", column: 22 }
            ]
        },
        {
            code: "class A { get 'a '() {} set 'a'(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a '.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 25 }
            ]
        },
        {
            code: "class A { get 'a'() {} set 1(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter '1'.", type: "MethodDefinition", column: 24 }
            ]
        },
        {
            code: "class A { get 1() {} set 2(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter '1'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter '2'.", type: "MethodDefinition", column: 22 }
            ]
        },
        {
            code: "class A { get ''() {} set null(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter ''.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter 'null'.", type: "MethodDefinition", column: 23 }
            ]
        },
        {
            code: "class A { get a() {} set [a](foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter.", type: "MethodDefinition", column: 22 }
            ]
        },
        {
            code: "class A { get [a]() {} set [b](foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter.", type: "MethodDefinition", column: 24 }
            ]
        },
        {
            code: "class A { get [a]() {} set [a++](foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter.", type: "MethodDefinition", column: 24 }
            ]
        },
        {
            code: "class A { get [a + b]() {} set [a - b](foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter.", type: "MethodDefinition", column: 28 }
            ]
        },
        {
            code: "class A { get #a() {} set '#a'(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 13 },
            errors: [
                { message: "Setter is not present for class private getter #a.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter '#a'.", type: "MethodDefinition", column: 23 }
            ]
        },
        {
            code: "class A { get '#a'() {} set #a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 13 },
            errors: [
                { message: "Setter is not present for class getter '#a'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class private setter #a.", type: "MethodDefinition", column: 25 }
            ]
        },

        // Prototype and static accessors with same keys
        {
            code: "class A { get a() {} static set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class static setter 'a'.", type: "MethodDefinition", column: 22 }
            ]
        },
        {
            code: "A = class { static get a() {} set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 31 }
            ]
        },
        {
            code: "class A { set [a](foo) {} static get [a]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class setter.", type: "MethodDefinition", column: 11 },
                { message: "Setter is not present for class static getter.", type: "MethodDefinition", column: 27 }
            ]
        },
        {
            code: "class A { static set [a](foo) {} get [a]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class static setter.", type: "MethodDefinition", column: 11 },
                { message: "Setter is not present for class getter.", type: "MethodDefinition", column: 34 }
            ]
        },

        // Multiple invalid of same and different kinds
        {
            code: "class A { get a() {} get b() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Setter is not present for class getter 'b'.", type: "MethodDefinition", column: 22 }
            ]
        },
        {
            code: "A = class { get a() {} get [b]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Setter is not present for class getter.", type: "MethodDefinition", column: 24 }
            ]
        },
        {
            code: "class A { get [a]() {} get [b]() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter.", type: "MethodDefinition", column: 11 },
                { message: "Setter is not present for class getter.", type: "MethodDefinition", column: 24 }
            ]
        },
        {
            code: "A = class { set a(foo) {} set b(bar) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Getter is not present for class setter 'b'.", type: "MethodDefinition", column: 27 }
            ]
        },
        {
            code: "class A { static get a() {} static get b() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Setter is not present for class static getter 'b'.", type: "MethodDefinition", column: 29 }
            ]
        },
        {
            code: "A = class { static set a(foo) {} static set b(bar) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class static setter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Getter is not present for class static setter 'b'.", type: "MethodDefinition", column: 34 }
            ]
        },
        {
            code: "class A { static get a() {} set b(foo) {} static set c(bar) {} get d() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter 'b'.", type: "MethodDefinition", column: 29 },
                { message: "Getter is not present for class static setter 'c'.", type: "MethodDefinition", column: 43 },
                { message: "Setter is not present for class getter 'd'.", type: "MethodDefinition", column: 64 }
            ]
        },

        // Checks per class
        {
            code: "class A { get a() {} } class B { set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 34 }
            ]
        },
        {
            code: "A = class { set a(foo) {} }, class { get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 38 }
            ]
        },
        {
            code: "A = class { get a() {} }, { set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Getter is not present for setter 'a'.", type: "Property", column: 29 }
            ]
        },
        {
            code: "A = { get a() {} }, class { set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for getter 'a'.", type: "Property", column: 7 },
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 29 }
            ]
        },

        // Combinations or valid and invalid
        {
            code: "class A { get a() {} get b() {} set b(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 }]
        },
        {
            code: "A = class { get b() {} get a() {} set b(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 24 }]
        },
        {
            code: "class A { set b(foo) {} get b() {} set a(bar) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 36 }]
        },
        {
            code: "A = class { static get b() {} set a(foo) {} static set b(bar) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 31 }]
        },
        {
            code: "class A { static set a(foo) {} get b() {} set b(bar) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Getter is not present for class static setter 'a'.", type: "MethodDefinition", column: 11 }]
        },
        {
            code: "class A { get b() {} static get a() {} set b(bar) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 22 }]
        },
        {
            code: "class A { static set b(foo) {} static get a() {} static get b() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 32 }]
        },
        {
            code: "class A { get [v1](){} static set i1(foo){} static set v2(bar){} get [i2](){} static get i3(){} set [v1](baz){} static get v2(){} set i4(quux){} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class static setter 'i1'.", type: "MethodDefinition", column: 24 },
                { message: "Setter is not present for class getter.", type: "MethodDefinition", column: 66 },
                { message: "Setter is not present for class static getter 'i3'.", type: "MethodDefinition", column: 79 },
                { message: "Getter is not present for class setter 'i4'.", type: "MethodDefinition", column: 131 }
            ]
        },

        // In the case of duplicates which don't have the other kind, all nodes are reported
        {
            code: "class A { get a() {} get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 22 }
            ]
        },
        {
            code: "A = class { set a(foo) {} set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 27 }
            ]
        },
        {
            code: "A = class { static get a() {} static get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 13 },
                { message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 31 }
            ]
        },
        {
            code: "class A { set a(foo) {} set a(foo) {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 11 },
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 25 }
            ]
        },

        // Other elements or even method duplicates in the same class do not affect this rule
        {
            code: "class A { a() {} get b() {} c() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'b'.", type: "MethodDefinition", column: 18 }
            ]
        },
        {
            code: "A = class { a() {} get b() {} c() {} set d(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'b'.", type: "MethodDefinition", column: 20 },
                { message: "Getter is not present for class setter 'd'.", type: "MethodDefinition", column: 38 }
            ]
        },
        {
            code: "class A { static a() {} get b() {} static c() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'b'.", type: "MethodDefinition", column: 25 }
            ]
        },
        {
            code: "class A { a() {} get a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class getter 'a'.", type: "MethodDefinition", column: 18 }
            ]
        },
        {
            code: "A = class { static a() {} set a(foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class setter 'a'.", type: "MethodDefinition", column: 27 }
            ]
        },
        {
            code: "class A { a() {} static get b() {} c() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class static getter 'b'.", type: "MethodDefinition", column: 18 }
            ]
        },
        {
            code: "A = class { static a() {} static set b(foo) {} static c() {} d() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class static setter 'b'.", type: "MethodDefinition", column: 27 }
            ]
        },
        {
            code: "class A { a() {} static get a() {} a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Setter is not present for class static getter 'a'.", type: "MethodDefinition", column: 18 }
            ]
        },
        {
            code: "class A { static set a(foo) {} static a() {} }",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Getter is not present for class static setter 'a'.", type: "MethodDefinition", column: 11 }
            ]
        },

        // Full location tests
        {
            code: "class A { get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Setter is not present for class getter 'a'.",
                type: "MethodDefinition",
                line: 1,
                column: 11,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "A = class {\n  set [\n a](foo) {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Getter is not present for class setter.",
                type: "MethodDefinition",
                line: 2,
                column: 3,
                endLine: 3,
                endColumn: 4
            }]
        },
        {
            code: "class A { static get a() {} };",
            options: [{ setWithoutGet: true, getWithoutSet: true, enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Setter is not present for class static getter 'a'.",
                type: "MethodDefinition",
                line: 1,
                column: 11,
                endLine: 1,
                endColumn: 23
            }]
        }
    ]
});
