/**
 * @fileoverview Tests for no-global-assign rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-global-assign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("no-global-assign", rule, {
    valid: [
        "a = 1",
        "var a; a = 1",
        "var a = 0; a = 1",
        "function a() { a = 1 }",
        "(function a() { a = 1 })",
        "/*globals a:true*/ a = 1",
        {code: "onload = null", env: {browser: true}},
        {code: "a = 1", globals: {a: true}},
        "var a = Object",
        "var a = undefined"
    ],
    invalid: [
        {
            code: "Object = null",
            errors: ["Unexpected modifying of 'Object'. It's readonly."]
        },
        {
            code: "undefined = 1",
            errors: ["Unexpected modifying of 'undefined'. It's readonly."]
        },
        {
            code: "length = 1",
            env: {browser: true},
            errors: ["Unexpected modifying of 'length'. It's readonly."]
        },
        {
            code: "/*globals a*/ a = 1",
            errors: ["Unexpected modifying of 'a'. It's readonly."]
        },
        {
            code: "/*globals a:false*/ a = 1",
            errors: ["Unexpected modifying of 'a'. It's readonly."]
        },
        {
            code: "a = 1",
            globals: {a: false},
            errors: ["Unexpected modifying of 'a'. It's readonly."]
        },

        // From no-undef
        {
            code: "/*global b:false*/ function f() { b = 1; }",
            errors: ["Unexpected modifying of 'b'. It's readonly."]
        },
        {
            code: "function f() { b = 1; }",
            global: { b: false },
            errors: ["Unexpected modifying of 'b'. It's readonly."]
        },
        {
            code: "/*global b:false*/ function f() { b++; }",
            errors: ["Unexpected modifying of 'b'. It's readonly."]
        },
        {
            code: "/*global b*/ b = 1;",
            errors: ["Unexpected modifying of 'b'. It's readonly."]
        },
        {
            code: "/*global b:false*/ var b = 1;",
            errors: ["Unexpected modifying of 'b'. It's readonly."]
        },
        {
            code: "Array = 1;",
            errors: ["Unexpected modifying of 'Array'. It's readonly."]
        }
    ]
});
