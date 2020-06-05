/**
 * @fileoverview Tests for array-callback-return rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/array-callback-return"),
    { RuleTester } = require("../../../lib/rule-tester");

const ruleTester = new RuleTester();

const allowImplicitOptions = [{ allowImplicit: true }];

const checkForEachOptions = [{ checkForEach: true }];

const allowImplicitCheckForEach = [{ allowImplicit: true, checkForEach: true }];

ruleTester.run("array-callback-return", rule, {
    valid: [

        "foo.every(function(){}())",
        "foo.every(function(){ return function() { return true; }; }())",
        "foo.every(function(){ return function() { return; }; })",

        "foo.forEach(bar || function(x) { var a=0; })",
        "foo.forEach(bar || function(x) { return a; })",
        "foo.forEach(function() {return function() { var a = 0;}}())",
        "foo.forEach(function(x) { var a=0; })",
        "foo.forEach(function(x) { return a;})",
        "foo.forEach(function(x) { return; })",
        "foo.forEach(function(x) { if (a === b) { return;} var a=0; })",
        "foo.forEach(function(x) { if (a === b) { return x;} var a=0; })",
        "foo.bar().forEach(function(x) { return; })",
        "[\"foo\",\"bar\",\"baz\"].forEach(function(x) { return x; })",
        { code: "foo.forEach(x => { var a=0; })", parserOptions: { ecmaVersion: 6 } },
        { code: "foo.forEach(x => { if (a === b) { return;} var a=0; })", parserOptions: { ecmaVersion: 6 } },
        { code: "foo.forEach(x => x)", parserOptions: { ecmaVersion: 6 } },
        { code: "foo.forEach(val => y += val)", parserOptions: { ecmaVersion: 6 } },

        { code: "foo.map(async function(){})", parserOptions: { ecmaVersion: 8 } },
        { code: "foo.map(async () => {})", parserOptions: { ecmaVersion: 8 } },
        { code: "foo.map(function* () {})", parserOptions: { ecmaVersion: 6 } },

        // options: { allowImplicit: false }
        { code: "Array.from(x, function() { return true; })", options: [{ allowImplicit: false }] },
        { code: "Int32Array.from(x, function() { return true; })", options: [{ allowImplicit: false }] },
        "foo.every(function() { return true; })",
        "foo.filter(function() { return true; })",
        "foo.find(function() { return true; })",
        "foo.findIndex(function() { return true; })",
        "foo.flatMap(function() { return true; })",
        "foo.forEach(function() { return; })",
        "foo.map(function() { return true; })",
        "foo.reduce(function() { return true; })",
        "foo.reduceRight(function() { return true; })",
        "foo.some(function() { return true; })",
        "foo.sort(function() { return 0; })",
        { code: "foo.every(() => { return true; })", parserOptions: { ecmaVersion: 6 } },
        "foo.every(function() { if (a) return true; else return false; })",
        "foo.every(function() { switch (a) { case 0: bar(); default: return true; } })",
        "foo.every(function() { try { bar(); return true; } catch (err) { return false; } })",
        "foo.every(function() { try { bar(); } finally { return true; } })",

        // options: { allowImplicit: true }
        { code: "Array.from(x, function() { return; })", options: allowImplicitOptions },
        { code: "Int32Array.from(x, function() { return; })", options: allowImplicitOptions },
        { code: "foo.every(function() { return; })", options: allowImplicitOptions },
        { code: "foo.filter(function() { return; })", options: allowImplicitOptions },
        { code: "foo.find(function() { return; })", options: allowImplicitOptions },
        { code: "foo.findIndex(function() { return; })", options: allowImplicitOptions },
        { code: "foo.flatMap(function() { return; })", options: allowImplicitOptions },
        { code: "foo.forEach(function() { return; })", options: allowImplicitOptions },
        { code: "foo.map(function() { return; })", options: allowImplicitOptions },
        { code: "foo.reduce(function() { return; })", options: allowImplicitOptions },
        { code: "foo.reduceRight(function() { return; })", options: allowImplicitOptions },
        { code: "foo.some(function() { return; })", options: allowImplicitOptions },
        { code: "foo.sort(function() { return; })", options: allowImplicitOptions },
        { code: "foo.every(() => { return; })", options: allowImplicitOptions, parserOptions: { ecmaVersion: 6 } },
        { code: "foo.every(function() { if (a) return; else return a; })", options: allowImplicitOptions },
        { code: "foo.every(function() { switch (a) { case 0: bar(); default: return; } })", options: allowImplicitOptions },
        { code: "foo.every(function() { try { bar(); return; } catch (err) { return; } })", options: allowImplicitOptions },
        { code: "foo.every(function() { try { bar(); } finally { return; } })", options: allowImplicitOptions },

        // options: { checkForEach: true }
        { code: "foo.forEach(function(x) { return; })", options: checkForEachOptions },
        { code: "foo.forEach(function(x) { var a=0; })", options: checkForEachOptions },
        { code: "foo.forEach(function(x) { if (a === b) { return;} var a=0; })", options: checkForEachOptions },
        { code: "foo.forEach(function() {return function() { if (a == b) { return; }}}())", options: checkForEachOptions },
        { code: "foo.forEach(x => { var a=0; })", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 } },
        { code: "foo.forEach(x => { if (a === b) { return;} var a=0; })", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 } },
        { code: "foo.forEach(x => { x })", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 } },
        { code: "foo.forEach(bar || function(x) { return; })", options: checkForEachOptions },
        { code: "Array.from(x, function() { return true; })", options: checkForEachOptions },
        { code: "Int32Array.from(x, function() { return true; })", options: checkForEachOptions },
        { code: "foo.every(() => { return true; })", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 } },
        { code: "foo.every(function() { if (a) return 1; else return a; })", options: checkForEachOptions },
        { code: "foo.every(function() { switch (a) { case 0: return bar(); default: return a; } })", options: checkForEachOptions },
        { code: "foo.every(function() { try { bar(); return 1; } catch (err) { return err; } })", options: checkForEachOptions },
        { code: "foo.every(function() { try { bar(); } finally { return 1; } })", options: checkForEachOptions },
        { code: "foo.every(function() { return; })", options: allowImplicitCheckForEach },

        "Arrow.from(x, function() {})",
        "foo.abc(function() {})",
        "every(function() {})",
        "foo[every](function() {})",
        "var every = function() {}",
        { code: "foo[`${every}`](function() {})", parserOptions: { ecmaVersion: 6 } },
        { code: "foo.every(() => true)", parserOptions: { ecmaVersion: 6 } }

    ],
    invalid: [

        { code: "Array.from(x, function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "from" } }] },
        { code: "Array.from(x, function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "from" } }] },
        { code: "Int32Array.from(x, function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "from" } }] },
        { code: "Int32Array.from(x, function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "from" } }] },
        { code: "foo.every(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "every" } }] },
        { code: "foo.every(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo.filter(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "filter" } }] },
        { code: "foo.filter(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "filter" } }] },
        { code: "foo.find(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "find" } }] },
        { code: "foo.find(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "find" } }] },
        { code: "foo.findIndex(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "findIndex" } }] },
        { code: "foo.findIndex(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "findIndex" } }] },
        { code: "foo.flatMap(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "flatMap" } }] },
        { code: "foo.flatMap(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "flatMap" } }] },
        { code: "foo.map(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "map" } }] },
        { code: "foo.map(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "map" } }] },
        { code: "foo.reduce(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "reduce" } }] },
        { code: "foo.reduce(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "reduce" } }] },
        { code: "foo.reduceRight(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "reduceRight" } }] },
        { code: "foo.reduceRight(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "reduceRight" } }] },
        { code: "foo.some(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "some" } }] },
        { code: "foo.some(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "some" } }] },
        { code: "foo.sort(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "sort" } }] },
        { code: "foo.sort(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "sort" } }] },
        { code: "foo.bar.baz.every(function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "every" } }] },
        { code: "foo.bar.baz.every(function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo[\"every\"](function() {})", errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "every" } }] },
        { code: "foo[\"every\"](function foo() {})", errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo[`every`](function() {})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "every" } }] },
        { code: "foo[`every`](function foo() {})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo.every(() => {})", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Method .every() expected a return value from arrow function.", column: 14 }] },
        { code: "foo.every(function() { if (a) return true; })", errors: [{ message: "Method .every() expected a value to be returned at the end of function.", column: 11 }] },
        { code: "foo.every(function cb() { if (a) return true; })", errors: [{ message: "Method .every() expected a value to be returned at the end of function 'cb'.", column: 11 }] },
        { code: "foo.every(function() { switch (a) { case 0: break; default: return true; } })", errors: [{ messageId: "expectedAtEnd", data: { name: "function", arrayMethodName: "every" } }] },
        { code: "foo.every(function foo() { switch (a) { case 0: break; default: return true; } })", errors: [{ messageId: "expectedAtEnd", data: { name: "function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo.every(function() { try { bar(); } catch (err) { return true; } })", errors: [{ messageId: "expectedAtEnd", data: { name: "function", arrayMethodName: "every" } }] },
        { code: "foo.every(function foo() { try { bar(); } catch (err) { return true; } })", errors: [{ messageId: "expectedAtEnd", data: { name: "function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo.every(function() { return; })", errors: [{ messageId: "expectedReturnValue", data: { name: "Function", arrayMethodName: "every" } }] },
        { code: "foo.every(function foo() { return; })", errors: [{ messageId: "expectedReturnValue", data: { name: "Function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo.every(function() { if (a) return; })", errors: ["Method .every() expected a value to be returned at the end of function.", { messageId: "expectedReturnValue", data: { name: "Function", arrayMethodName: "every" } }] },
        { code: "foo.every(function foo() { if (a) return; })", errors: ["Method .every() expected a value to be returned at the end of function 'foo'.", { messageId: "expectedReturnValue", data: { name: "Function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo.every(function() { if (a) return; else return; })", errors: [{ messageId: "expectedReturnValue", data: { name: "Function" } }, { messageId: "expectedReturnValue", data: { name: "Function", arrayMethodName: "every" } }] },
        { code: "foo.every(function foo() { if (a) return; else return; })", errors: [{ messageId: "expectedReturnValue", data: { name: "Function 'foo'" } }, { messageId: "expectedReturnValue", data: { name: "Function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo.every(cb || function() {})", errors: ["Method .every() expected a return value from function."] },
        { code: "foo.every(cb || function foo() {})", errors: ["Method .every() expected a return value from function 'foo'."] },
        { code: "foo.every(a ? function() {} : function() {})", errors: ["Method .every() expected a return value from function.", "Method .every() expected a return value from function."] },
        { code: "foo.every(a ? function foo() {} : function bar() {})", errors: ["Method .every() expected a return value from function 'foo'.", "Method .every() expected a return value from function 'bar'."] },
        { code: "foo.every(function(){ return function() {}; }())", errors: [{ message: "Method .every() expected a return value from function.", column: 30 }] },
        { code: "foo.every(function(){ return function foo() {}; }())", errors: [{ message: "Method .every() expected a return value from function 'foo'.", column: 30 }] },
        { code: "foo.every(() => {})", options: [{ allowImplicit: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Method .every() expected a return value from arrow function." }] },
        { code: "foo.every(() => {})", options: [{ allowImplicit: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Method .every() expected a return value from arrow function." }] },

        // options: { allowImplicit: true }
        { code: "Array.from(x, function() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "from" } }] },
        { code: "foo.every(function() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "every" } }] },
        { code: "foo.filter(function foo() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "filter" } }] },
        { code: "foo.find(function foo() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "find" } }] },
        { code: "foo.map(function() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "map" } }] },
        { code: "foo.reduce(function() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "reduce" } }] },
        { code: "foo.reduceRight(function() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "reduceRight" } }] },
        { code: "foo.bar.baz.every(function foo() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "every" } }] },
        { code: "foo.every(cb || function() {})", options: allowImplicitOptions, errors: ["Method .every() expected a return value from function."] },
        { code: "[\"foo\",\"bar\"].sort(function foo() {})", options: allowImplicitOptions, errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "sort" } }] },
        { code: "foo.forEach(x => x)", options: allowImplicitCheckForEach, parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Arrow function" } }] },
        { code: "foo.forEach(function(x) { if (a == b) {return x;}})", options: allowImplicitCheckForEach, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function" } }] },
        { code: "foo.forEach(function bar(x) { return x;})", options: allowImplicitCheckForEach, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function 'bar'" } }] },

        // // options: { checkForEach: true }
        { code: "foo.forEach(x => x)", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Arrow function" } }] },
        { code: "foo.forEach(val => y += val)", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Arrow function" } }] },
        { code: "[\"foo\",\"bar\"].forEach(x => ++x)", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Arrow function" } }] },
        { code: "foo.bar().forEach(x => x === y)", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Arrow function" } }] },
        { code: "foo.forEach(function() {return function() { if (a == b) { return a; }}}())", options: checkForEachOptions, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function" } }] },
        { code: "foo.forEach(function(x) { if (a == b) {return x;}})", options: checkForEachOptions, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function" } }] },
        { code: "foo.forEach(function(x) { if (a == b) {return undefined;}})", options: checkForEachOptions, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function" } }] },
        { code: "foo.forEach(function bar(x) { return x;})", options: checkForEachOptions, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function 'bar'" } }] },
        { code: "foo.bar().forEach(function bar(x) { return x;})", options: checkForEachOptions, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function 'bar'" } }] },
        { code: "[\"foo\",\"bar\"].forEach(function bar(x) { return x;})", options: checkForEachOptions, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Function 'bar'" } }] },
        { code: "foo.forEach((x) => { return x;})", options: checkForEachOptions, parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "expectedNoReturnValue", data: { name: "Arrow function" } }] },
        { code: "Array.from(x, function() {})", options: checkForEachOptions, errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "from" } }] },
        { code: "foo.every(function() {})", options: checkForEachOptions, errors: [{ messageId: "expectedInside", data: { name: "function", arrayMethodName: "every" } }] },
        { code: "foo.filter(function foo() {})", options: checkForEachOptions, errors: [{ messageId: "expectedInside", data: { name: "function 'foo'", arrayMethodName: "filter" } }] },
        { code: "foo.filter(function foo() { return; })", options: checkForEachOptions, errors: [{ messageId: "expectedReturnValue", data: { name: "Function 'foo'", arrayMethodName: "filter" } }] },
        { code: "foo.every(cb || function() {})", options: checkForEachOptions, errors: ["Method .every() expected a return value from function."] },

        // full location tests
        {
            code: "foo.filter(bar => { baz(); } )",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedInside",
                data: { name: "arrow function", arrayMethodName: "filter" },
                type: "ArrowFunctionExpression",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 18
            }]
        },
        {
            code: "foo.filter(\n() => {} )",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedInside",
                data: { name: "arrow function", arrayMethodName: "filter" },
                type: "ArrowFunctionExpression",
                line: 2,
                column: 4,
                endLine: 2,
                endColumn: 6
            }]
        },
        {
            code: "foo.filter(bar || ((baz) => {}) )",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedInside",
                data: { name: "arrow function", arrayMethodName: "filter" },
                type: "ArrowFunctionExpression",
                line: 1,
                column: 26,
                endLine: 1,
                endColumn: 28
            }]
        },
        {
            code: "foo.filter(bar => { return; })",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedReturnValue",
                data: { name: "Arrow function", arrayMethodName: "filter" },
                type: "ReturnStatement",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 28
            }]
        },
        {
            code: "Array.from(foo, bar => { bar })",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedInside",
                data: { name: "arrow function", arrayMethodName: "from" },
                type: "ArrowFunctionExpression",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 23
            }]
        },
        {
            code: "foo.forEach(bar => bar)",
            options: checkForEachOptions,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedNoReturnValue",
                data: { name: "Arrow function" },
                type: "ArrowFunctionExpression",
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 19
            }]
        },
        {
            code: "foo.forEach((function () { return (bar) => bar; })())",
            options: checkForEachOptions,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedNoReturnValue",
                data: { name: "Arrow function" },
                type: "ArrowFunctionExpression",
                line: 1,
                column: 41,
                endLine: 1,
                endColumn: 43
            }]
        },
        {
            code: "foo.forEach((() => {\n return bar => bar; })())",
            options: checkForEachOptions,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedNoReturnValue",
                data: { name: "Arrow function" },
                type: "ArrowFunctionExpression",
                line: 2,
                column: 13,
                endLine: 2,
                endColumn: 15
            }]
        },
        {
            code: "foo.forEach((bar) => { if (bar) { return; } else { return bar ; } })",
            options: checkForEachOptions,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "expectedNoReturnValue",
                data: { name: "Arrow function" },
                type: "ReturnStatement",
                line: 1,
                column: 52,
                endLine: 1,
                endColumn: 64
            }]
        },
        {
            code: "foo.filter(function(){})",
            errors: [{
                messageId: "expectedInside",
                data: { name: "function", arrayMethodName: "filter" },
                type: "FunctionExpression",
                line: 1,
                column: 12,
                endLine: 1,
                endColumn: 20
            }]
        },
        {
            code: "foo.filter(function (){})",
            errors: [{
                messageId: "expectedInside",
                data: { name: "function", arrayMethodName: "filter" },
                type: "FunctionExpression",
                line: 1,
                column: 12,
                endLine: 1,
                endColumn: 21
            }]
        },
        {
            code: "foo.filter(function\n(){})",
            errors: [{
                messageId: "expectedInside",
                data: { name: "function", arrayMethodName: "filter" },
                type: "FunctionExpression",
                line: 1,
                column: 12,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "foo.filter(function bar(){})",
            errors: [{
                messageId: "expectedInside",
                data: { name: "function 'bar'", arrayMethodName: "filter" },
                type: "FunctionExpression",
                line: 1,
                column: 12,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "foo.filter(function bar  (){})",
            errors: [{
                messageId: "expectedInside",
                data: { name: "function 'bar'", arrayMethodName: "filter" },
                type: "FunctionExpression",
                line: 1,
                column: 12,
                endLine: 1,
                endColumn: 26
            }]
        },
        {
            code: "foo.filter(function\n bar() {})",
            errors: [{
                messageId: "expectedInside",
                data: { name: "function 'bar'", arrayMethodName: "filter" },
                type: "FunctionExpression",
                line: 1,
                column: 12,
                endLine: 2,
                endColumn: 5
            }]
        },
        {
            code: "Array.from(foo, function bar(){})",
            errors: [{
                messageId: "expectedInside",
                data: { name: "function 'bar'", arrayMethodName: "from" },
                type: "FunctionExpression",
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 29
            }]
        },
        {
            code: "Array.from(foo, bar ? function (){} : baz)",
            errors: [{
                messageId: "expectedInside",
                data: { name: "function", arrayMethodName: "from" },
                type: "FunctionExpression",
                line: 1,
                column: 23,
                endLine: 1,
                endColumn: 32
            }]
        },
        {
            code: "foo.filter(function bar() { return \n })",
            errors: [{
                messageId: "expectedReturnValue",
                data: { name: "Function 'bar'", arrayMethodName: "filter" },
                type: "ReturnStatement",
                line: 1,
                column: 29,
                endLine: 1,
                endColumn: 35
            }]
        },
        {
            code: "foo.forEach(function () { \nif (baz) return bar\nelse return\n })",
            options: checkForEachOptions,
            errors: [{
                messageId: "expectedNoReturnValue",
                data: { name: "Function" },
                type: "ReturnStatement",
                line: 2,
                column: 10,
                endLine: 2,
                endColumn: 20
            }]
        }
    ]
});
