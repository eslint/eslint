/**
 * @fileoverview Tests for no-dupe-class-members rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-dupe-class-members");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-dupe-class-members", rule, {
    valid: [
        {code: "class A { foo() {} bar() {} }", ecmaFeatures: {classes: true}},
        {code: "class A { static foo() {} foo() {} }", ecmaFeatures: {classes: true}},
        {code: "class A { get foo() {} set foo(value) {} }", ecmaFeatures: {classes: true}},
        {code: "class A { static foo() {} get foo() {} set foo(value) {} }", ecmaFeatures: {classes: true}},
        {code: "class A { foo() { } } class B { foo() { } }", ecmaFeatures: {classes: true}},
        {code: "class A { [foo]() {} foo() {} }", ecmaFeatures: {classes: true}}
    ],
    invalid: [
        {
            code: "class A { foo() {} foo() {} }",
            ecmaFeatures: {classes: true},
            errors: [
                {type: "MethodDefinition", line: 1, column: 20, message: "Duplicate name \"foo\"."}
            ]
        },
        {
            code: "!class A { foo() {} foo() {} };",
            ecmaFeatures: {classes: true},
            errors: [
                {type: "MethodDefinition", line: 1, column: 21, message: "Duplicate name \"foo\"."}
            ]
        },
        {
            code: "class A { foo() {} foo() {} foo() {} }",
            ecmaFeatures: {classes: true},
            errors: [
                {type: "MethodDefinition", line: 1, column: 20, message: "Duplicate name \"foo\"."},
                {type: "MethodDefinition", line: 1, column: 29, message: "Duplicate name \"foo\"."}
            ]
        },
        {
            code: "class A { static foo() {} static foo() {} }",
            ecmaFeatures: {classes: true},
            errors: [
                {type: "MethodDefinition", line: 1, column: 27, message: "Duplicate name \"foo\"."}
            ]
        },
        {
            code: "class A { foo() {} get foo() {} }",
            ecmaFeatures: {classes: true},
            errors: [
                {type: "MethodDefinition", line: 1, column: 20, message: "Duplicate name \"foo\"."}
            ]
        },
        {
            code: "class A { set foo(value) {} foo() {} }",
            ecmaFeatures: {classes: true},
            errors: [
                {type: "MethodDefinition", line: 1, column: 29, message: "Duplicate name \"foo\"."}
            ]
        }
    ]
});
