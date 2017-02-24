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
        { code: "foo[`${every}`](function() {})", parserOptions: { ecmaVersion: 6 } },
        { code: "foo.every(() => true)", parserOptions: { ecmaVersion: 6 } },
        { code: "foo.every(() => { return true; })", parserOptions: { ecmaVersion: 6 } },
        "foo.every(function() { if (a) return true; else return false; })",
        "foo.every(function() { switch (a) { case 0: bar(); default: return true; } })",
        "foo.every(function() { try { bar(); return true; } catch (err) { return false; } })",
        "foo.every(function() { try { bar(); } finally { return true; } })",
        "foo.every(function(){}())",
        "foo.every(function(){ return function() { return true; }; }())",
        "foo.every(function(){ return function() { return; }; })",
        { code: "foo.map(async function(){})", parserOptions: { ecmaVersion: 8 } },
        { code: "foo.map(async () => {})", parserOptions: { ecmaVersion: 8 } },
        { code: "foo.map(function* () {})", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "Array.from(x, function() {})", errors: ["Expected to return a value in function."] },
        { code: "Array.from(x, function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "Int32Array.from(x, function() {})", errors: ["Expected to return a value in function."] },
        { code: "Int32Array.from(x, function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.every(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.every(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.filter(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.filter(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.find(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.find(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.findIndex(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.findIndex(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.map(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.map(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.reduce(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.reduce(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.reduceRight(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.reduceRight(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.some(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.some(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.sort(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.sort(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.bar.baz.every(function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.bar.baz.every(function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo[\"every\"](function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo[\"every\"](function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo[`every`](function() {})", parserOptions: { ecmaVersion: 6 }, errors: ["Expected to return a value in function."] },
        { code: "foo[`every`](function foo() {})", parserOptions: { ecmaVersion: 6 }, errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.every(() => {})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected to return a value in arrow function.", column: 14 }] },
        { code: "foo.every(function() { if (a) return true; })", errors: [{ message: "Expected to return a value at the end of function.", column: 11 }] },
        { code: "foo.every(function cb() { if (a) return true; })", errors: [{ message: "Expected to return a value at the end of function 'cb'.", column: 20 }] },
        { code: "foo.every(function() { switch (a) { case 0: break; default: return true; } })", errors: ["Expected to return a value at the end of function."] },
        { code: "foo.every(function foo() { switch (a) { case 0: break; default: return true; } })", errors: ["Expected to return a value at the end of function 'foo'."] },
        { code: "foo.every(function() { try { bar(); } catch (err) { return true; } })", errors: ["Expected to return a value at the end of function."] },
        { code: "foo.every(function foo() { try { bar(); } catch (err) { return true; } })", errors: ["Expected to return a value at the end of function 'foo'."] },
        { code: "foo.every(function() { return; })", errors: ["Function expected a return value."] },
        { code: "foo.every(function foo() { return; })", errors: ["Function 'foo' expected a return value."] },
        { code: "foo.every(function() { if (a) return; })", errors: ["Expected to return a value at the end of function.", "Function expected a return value."] },
        { code: "foo.every(function foo() { if (a) return; })", errors: ["Expected to return a value at the end of function 'foo'.", "Function 'foo' expected a return value."] },
        { code: "foo.every(function() { if (a) return; else return; })", errors: ["Function expected a return value.", "Function expected a return value."] },
        { code: "foo.every(function foo() { if (a) return; else return; })", errors: ["Function 'foo' expected a return value.", "Function 'foo' expected a return value."] },
        { code: "foo.every(cb || function() {})", errors: ["Expected to return a value in function."] },
        { code: "foo.every(cb || function foo() {})", errors: ["Expected to return a value in function 'foo'."] },
        { code: "foo.every(a ? function() {} : function() {})", errors: ["Expected to return a value in function.", "Expected to return a value in function."] },
        { code: "foo.every(a ? function foo() {} : function bar() {})", errors: ["Expected to return a value in function 'foo'.", "Expected to return a value in function 'bar'."] },
        { code: "foo.every(function(){ return function() {}; }())", errors: [{ message: "Expected to return a value in function.", column: 30 }] },
        { code: "foo.every(function(){ return function foo() {}; }())", errors: [{ message: "Expected to return a value in function 'foo'.", column: 39 }] }
    ]
});
