/**
 * @fileoverview Tests for no-class-assign rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-class-assign");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-class-assign", rule, {
    valid: [
        {code: "class A { } foo(A);", ecmaFeatures: {classes: true}},
        {code: "let A = class A { }; foo(A);", ecmaFeatures: {classes: true, blockBindings: true}},
        {code: "class A { b(A) { A = 0; } }", ecmaFeatures: {classes: true}},
        {code: "class A { b() { let A; A = 0; } }", ecmaFeatures: {classes: true, blockBindings: true}},
        {code: "let A = class { b() { A = 0; } }", ecmaFeatures: {classes: true, blockBindings: true}},

        // ignores non class.
        {code: "var x = 0; x = 1;"},
        {code: "let x = 0; x = 1;", ecmaFeatures: {blockBindings: true}},
        {code: "const x = 0; x = 1;", ecmaFeatures: {blockBindings: true}},
        {code: "function x() {} x = 1;"},
        {code: "function foo(x) { x = 1; }"},
        {code: "try {} catch (x) { x = 1; }"}
    ],
    invalid: [
        {
            code: "class A { } A = 0;",
            ecmaFeatures: {classes: true},
            errors: [{message: "`A` is a class.", type: "Identifier"}]
        },
        {
            code: "class A { } ({A}) = 0;",
            ecmaFeatures: {classes: true, destructuring: true},
            errors: [{message: "`A` is a class.", type: "Identifier"}]
        },
        {
            code: "class A { } ({b: A = 0}) = {};",
            ecmaFeatures: {classes: true, destructuring: true},
            errors: [{message: "`A` is a class.", type: "Identifier"}]
        },
        {
            code: "A = 0; class A { }",
            ecmaFeatures: {classes: true},
            errors: [{message: "`A` is a class.", type: "Identifier"}]
        },
        {
            code: "class A { b() { A = 0; } }",
            ecmaFeatures: {classes: true},
            errors: [{message: "`A` is a class.", type: "Identifier"}]
        },
        {
            code: "let A = class A { b() { A = 0; } }",
            ecmaFeatures: {classes: true, blockBindings: true},
            errors: [{message: "`A` is a class.", type: "Identifier"}]
        },
        {
            code: "class A { } A = 0; A = 1;",
            ecmaFeatures: {classes: true},
            errors: [
                {message: "`A` is a class.", type: "Identifier", line: 1, column: 13},
                {message: "`A` is a class.", type: "Identifier", line: 1, column: 20}
            ]
        }
    ]
});
