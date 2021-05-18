/**
 * @fileoverview Tests for no-dupe-args
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-dupe-args"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-dupe-args", rule, {
    valid: [
        "function a(a, b, c){}",
        "var a = function(a, b, c){}",
        { code: "function a({a, b}, {c, d}){}", parserOptions: { ecmaVersion: 6 } },
        { code: "function a([ , a]) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo([[a, b], [c, d]]) {}", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "function a(a, b, b) {}", errors: [{ messageId: "unexpected", data: { name: "b" } }] },
        { code: "function a(a, a, a) {}", errors: [{ messageId: "unexpected", data: { name: "a" } }] },
        { code: "function a(a, b, a) {}", errors: [{ messageId: "unexpected", data: { name: "a" } }] },
        { code: "function a(a, b, a, b) {}", errors: [{ messageId: "unexpected", data: { name: "a" } }, { messageId: "unexpected", data: { name: "b" } }] },
        { code: "var a = function(a, b, b) {}", errors: [{ messageId: "unexpected", data: { name: "b" } }] },
        { code: "var a = function(a, a, a) {}", errors: [{ messageId: "unexpected", data: { name: "a" } }] },
        { code: "var a = function(a, b, a) {}", errors: [{ messageId: "unexpected", data: { name: "a" } }] },
        { code: "var a = function(a, b, a, b) {}", errors: [{ messageId: "unexpected", data: { name: "a" } }, { messageId: "unexpected", data: { name: "b" } }] }
    ]
});
