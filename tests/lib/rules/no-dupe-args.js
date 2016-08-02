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
        { code: "function a(a, b, b) {}", errors: [{ message: "Duplicate param 'b'." }] },
        { code: "function a({a, b}, b) {}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Duplicate param 'b'." }] },
        { code: "function a([a, b], b) {}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Duplicate param 'b'." }] },
        { code: "function a([ , a], [b, , a]) {}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Duplicate param 'a'." }] },
        { code: "function a([a, b], {b}) {}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Duplicate param 'b'." }] },
        { code: "function a(a, a, a) {}", errors: [{ message: "Duplicate param 'a'." }] },
        { code: "function a(a, b, a) {}", errors: [{ message: "Duplicate param 'a'." }]},
        { code: "function a(a, b, a, b) {}", errors: [{ message: "Duplicate param 'a'." }, { message: "Duplicate param 'b'." }]},
        { code: "var a = function(a, b, b) {}", errors: [{ message: "Duplicate param 'b'." }] },
        { code: "var a = function(a, a, a) {}", errors: [{ message: "Duplicate param 'a'." }] },
        { code: "var a = function(a, b, a) {}", errors: [{ message: "Duplicate param 'a'." }]},
        { code: "var a = function(a, b, a, b) {}", errors: [{ message: "Duplicate param 'a'." }, { message: "Duplicate param 'b'." }]}
    ]
});
