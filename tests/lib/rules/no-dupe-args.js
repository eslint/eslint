/**
 * @fileoverview Tests for no-dupe-args
 * @author Jamund Ferguson
 * @copyright 2015 Jamund Ferguson. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-dupe-args", {
    valid: [
        "function a(a, b, c){}",
        "var a = function(a, b, c){}",
        { code: "function a({a, b}, {c, d}){}", ecmaFeatures: { destructuring: true } }
    ],
    invalid: [
        { code: "function a(a, b, b) {}", errors: [{ message: "Duplicate param 'b'." }] },
        { code: "function a({a, b}, b) {}", ecmaFeatures: { destructuring: true }, errors: [{ message: "Duplicate param 'b'." }] },
        { code: "function a([a, b], b) {}", ecmaFeatures: { destructuring: true }, errors: [{ message: "Duplicate param 'b'." }] },
        { code: "function a([a, b], {b}) {}", ecmaFeatures: { destructuring: true }, errors: [{ message: "Duplicate param 'b'." }] },
        { code: "function a(a, a, a) {}", errors: [{ message: "Duplicate param 'a'." }] },
        { code: "function a(a, b, a) {}", errors: [{ message: "Duplicate param 'a'." }]},
        { code: "function a(a, b, a, b) {}", errors: [{ message: "Duplicate param 'a'." }, { message: "Duplicate param 'b'." }]},
        { code: "var a = function(a, b, b) {}", errors: [{ message: "Duplicate param 'b'." }] },
        { code: "var a = function(a, a, a) {}", errors: [{ message: "Duplicate param 'a'." }] },
        { code: "var a = function(a, b, a) {}", errors: [{ message: "Duplicate param 'a'." }]},
        { code: "var a = function(a, b, a, b) {}", errors: [{ message: "Duplicate param 'a'." }, { message: "Duplicate param 'b'." }]}
    ]
});
