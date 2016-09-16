/**
 * @fileoverview Tests for array-callback-return rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/array-callback-return"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("array-callback-return", rule, {
    valid: [
        "Array.from(x, function() { return true; })",
        "Int32Array.from(x, function() { return true; })",
        "Arrow.from(x, function() {})",
        "foo.every(function() { return true; })",
        "foo.filter(function() { return true; })",
        "foo.find(function() { return true; })",
        "foo.findIndex(function() { return true; })",
        "foo.map(function() { return true; })",
        "foo.reduce(function() { return true; })",
        "foo.reduceRight(function() { return true; })",
        "foo.some(function() { return true; })",
        "foo.sort(function() { return 0; })",
        "foo.abc(function() {})",
        "every(function() {})",
        "foo[every](function() {})",
        "var every = function() {}",
        {code: "foo[`${every}`](function() {})", parserOptions: { ecmaVersion: 6 }},
        {code: "foo.every(() => true)", parserOptions: { ecmaVersion: 6 }},
        {code: "foo.every(() => { return true; })", parserOptions: { ecmaVersion: 6 }},
        "foo.every(function() { if (a) return true; else return false; })",
        "foo.every(function() { switch (a) { case 0: bar(); default: return true; } })",
        "foo.every(function() { try { bar(); return true; } catch (err) { return false; } })",
        "foo.every(function() { try { bar(); } finally { return true; } })",
        "foo.every(function(){}())",
        "foo.every(function(){ return function() { return true; }; }())",
        "foo.every(function(){ return function() { return; }; })",
        {code: "foo.map(async function(){})", parserOptions: { ecmaVersion: 8 }},
        {code: "foo.map(async () => {})", parserOptions: { ecmaVersion: 8 }},
        {code: "foo.map(function* () {})", parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {code: "Array.from(x, function() {})", errors: ["Expected to return a value in this function."]},
        {code: "Int32Array.from(x, function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.every(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.filter(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.find(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.findIndex(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.map(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.reduce(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.reduceRight(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.some(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.sort(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.bar.baz.every(function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo[\"every\"](function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo[`every`](function() {})", parserOptions: { ecmaVersion: 6 }, errors: ["Expected to return a value in this function."]},
        {code: "foo.every(() => {})", parserOptions: { ecmaVersion: 6 }, errors: [{message: "Expected to return a value in this function.", column: 14}]},
        {code: "foo.every(function cb() { if (a) return true; })", errors: [{message: "Expected to return a value at the end of this function.", column: 20}]},
        {code: "foo.every(function() { switch (a) { case 0: break; default: return true; } })", errors: ["Expected to return a value at the end of this function."]},
        {code: "foo.every(function() { try { bar(); } catch (err) { return true; } })", errors: ["Expected to return a value at the end of this function."]},
        {code: "foo.every(function() { return; })", errors: ["Expected a return value."]},
        {code: "foo.every(function() { if (a) return; })", errors: ["Expected to return a value at the end of this function.", "Expected a return value."]},
        {code: "foo.every(function() { if (a) return; else return; })", errors: ["Expected a return value.", "Expected a return value."]},
        {code: "foo.every(cb || function() {})", errors: ["Expected to return a value in this function."]},
        {code: "foo.every(a ? function() {} : function() {})", errors: ["Expected to return a value in this function.", "Expected to return a value in this function."]},
        {code: "foo.every(function(){ return function() {}; }())", errors: [{message: "Expected to return a value in this function.", column: 30}]}
    ]
});
