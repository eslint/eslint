/**
 * @fileoverview Tests for no-extra-semi rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-extra-semi"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-extra-semi", rule, {
    valid: [
        "var x = 5;",
        "function foo(){}",
        "for(;;);",
        "while(0);",
        "do;while(0);",
        "for(a in b);",
        { code: "for(a of b);", ecmaFeatures: { forOf: true } },

        // Class body.
        {code: "class A { }", ecmaFeatures: {classes: true}},
        {code: "var A = class { };", ecmaFeatures: {classes: true}},
        {code: "class A { a() { this; } }", ecmaFeatures: {classes: true}},
        {code: "var A = class { a() { this; } };", ecmaFeatures: {classes: true}},
        {code: "class A { } a;", ecmaFeatures: {classes: true}}
    ],
    invalid: [
        { code: "var x = 5;;", errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement"}] },
        { code: "function foo(){};", errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement"}] },
        { code: "for(;;);;", errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }] },
        { code: "while(0);;", errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }] },
        { code: "do;while(0);;", errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }] },
        { code: "for(a in b);;", errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }] },
        { code: "for(a of b);;", ecmaFeatures: { forOf: true }, errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }] },

        // Class body.
        {
            code: "class A { ; }",
            ecmaFeatures: {classes: true},
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 11}]
        },
        {
            code: "class A { /*a*/; }",
            ecmaFeatures: {classes: true},
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 16}]
        },
        {
            code: "class A { ; a() {} }",
            ecmaFeatures: {classes: true},
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 11}]
        },
        {
            code: "class A { a() {}; }",
            ecmaFeatures: {classes: true},
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 17}]
        },
        {
            code: "class A { a() {}; b() {} }",
            ecmaFeatures: {classes: true},
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 17}]
        },
        {
            code: "class A {; a() {}; b() {}; }",
            ecmaFeatures: {classes: true},
            errors: [
                {message: "Unnecessary semicolon.", type: "Punctuator", column: 10},
                {message: "Unnecessary semicolon.", type: "Punctuator", column: 18},
                {message: "Unnecessary semicolon.", type: "Punctuator", column: 26}
            ]
        },
        {
            code: "class A { a() {}; get b() {} }",
            ecmaFeatures: {classes: true},
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 17}]
        }
    ]
});
