/**
 * @fileoverview Tests for no-lexical-globals rule.
 * @author Milos Djermanovic
 */

"use strict";

const rule = require("../../../lib/rules/no-lexical-globals");
const { RuleTester } = require("../../../lib/rule-tester");

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015
    }
});

ruleTester.run("no-lexical-globals", rule, {
    valid: [

        // not a responsibility of this rule
        "a = 1;",
        "var a = 1;",
        "function a(){}",
        "function *a(){}",
        "/* global a:readonly */",
        "/* global a:writable */",

        // class expressions
        "var foo = class {}",
        "var foo = class A {}",
        "typeof class A {}",

        // not in the global scope
        "{ const a = 1; let b; class C {} }",
        "function foo() { const a = 1; let b; class C {} }",

        // different scoping
        {
            code: "const a = 1; let b; class C {}",
            parserOptions: { sourceType: "module" }
        },
        {
            code: "const a = 1; let b; class C {}",
            env: { node: true }
        },
        {
            code: "const a = 1; let b; class C {}",
            env: { commonjs: true }
        },
        {
            code: "const a = 1; let b; class C {}",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        }

    ],
    invalid: [
        {
            code: "const a = 1;",
            errors: [{
                message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable."
            }]
        },
        {
            code: "let a;",
            errors: [{
                message: "Unexpected 'let' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable."
            }]
        },
        {
            code: "let a = 1;",
            errors: [{
                message: "Unexpected 'let' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable."
            }]
        },
        {
            code: "class A {}",
            errors: [{
                message: "Unexpected 'class' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable."
            }]
        },
        {
            code: "const a = 1; const b = 2;",
            errors: [
                { message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." }
            ]
        },
        {
            code: "const a = 1, b = 2;",
            errors: [
                { message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." }
            ]
        },
        {
            code: "let a, b = 1;",
            errors: [
                { message: "Unexpected 'let' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'let' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." }
            ]
        },
        {
            code: "const a = 1; let b; class C {}",
            errors: [
                { message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'let' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'class' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." }
            ]
        },
        {
            code: "const [a, b, ...c] = [];",
            errors: [
                { message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'const' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." }
            ]
        },
        {
            code: "let { a, foo: b, bar: { c } } = {};",
            errors: [
                { message: "Unexpected 'let' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'let' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." },
                { message: "Unexpected 'let' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable." }
            ]
        }
    ]
});
