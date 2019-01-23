/**
 * @fileoverview Tests for no-constant-condition rule.
 * @author Christian Schulz <http://rndm.de>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-constant-condition"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-constant-condition", rule, {
    valid: [
        "if(a);",
        "if(a == 0);",
        "if(a = f());",
        "if(1, a);",
        "if ('every' in []);",
        "while(~!a);",
        "while(a = b);",
        "for(;x < 10;);",
        "for(;;);",
        "do{ }while(x)",
        "q > 0 ? 1 : 2;",
        "while(x += 3) {}",

        // #5228, typeof conditions
        "if(typeof x === 'undefined'){}",
        "if(a === 'str' && typeof b){}",
        "typeof a == typeof b",
        "typeof 'a' === 'string'|| typeof b === 'string'",

        // #5726, void conditions
        "if (void a || a);",
        "if (a || void a);",

        // #5693
        "if(xyz === 'str1' && abc==='str2'){}",
        "if(xyz === 'str1' || abc==='str2'){}",
        "if(xyz === 'str1' || abc==='str2' && pqr === 5){}",
        "if(typeof abc === 'string' && abc==='str2'){}",
        "if(false || abc==='str'){}",
        "if(true && abc==='str'){}",
        "if(typeof 'str' && abc==='str'){}",
        "if(abc==='str' || false || def ==='str'){}",
        "if(true && abc==='str' || def ==='str'){}",
        "if(true && typeof abc==='string'){}",

        // #11181, string literals
        "if('str' || a){}",
        "if('str1' && a){}",
        "if(a && 'str'){}",
        "if('str' || abc==='str'){}",

        // #11306
        "if ((foo || 'bar') === 'baz') {}",
        "if ((foo || 'bar') !== 'baz') {}",
        "if ((foo || 'bar') == 'baz') {}",
        "if ((foo || 'bar') != 'baz') {}",
        "if ((foo || 233) > 666) {}",
        "if ((foo || 233) < 666) {}",
        "if ((foo || 233) >= 666) {}",
        "if ((foo || 233) <= 666) {}",
        "if ((key || 'k') in obj) {}",
        "if ((foo || {}) instanceof obj) {}",

        // { checkLoops: false }
        { code: "while(true);", options: [{ checkLoops: false }] },
        { code: "for(;true;);", options: [{ checkLoops: false }] },
        { code: "do{}while(true)", options: [{ checkLoops: false }] },

        "function* foo(){while(true){yield 'foo';}}",
        "function* foo(){for(;true;){yield 'foo';}}",
        "function* foo(){do{yield 'foo';}while(true)}",
        "function* foo(){while (true) { while(true) {yield;}}}",
        "function* foo() {for (; yield; ) {}}",
        "function* foo() {for (; ; yield) {}}",
        "function* foo() {while (true) {function* foo() {yield;}yield;}}",
        "function* foo() { for (let x = yield; x < 10; x++) {yield;}yield;}",
        "function* foo() { for (let x = yield; ; x++) { yield; }}"
    ],
    invalid: [
        { code: "for(;true;);", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "do{}while(true)", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "do{}while(t = -2)", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "true ? 1 : 2;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "q = 0 ? 1 : 2;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "(q = 0) ? 1 : 2;", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(-2);", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(true);", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if({});", errors: [{ messageId: "unexpected", type: "ObjectExpression" }] },
        { code: "if(0 < 1);", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(0 || 1);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(a, 1);", errors: [{ messageId: "unexpected", type: "SequenceExpression" }] },

        { code: "while([]);", errors: [{ messageId: "unexpected", type: "ArrayExpression" }] },
        { code: "while(~!0);", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "while(x = 1);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "while(function(){});", errors: [{ messageId: "unexpected", type: "FunctionExpression" }] },
        { code: "while(true);", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "while(() => {});", errors: [{ messageId: "unexpected", type: "ArrowFunctionExpression" }] },

        // #5228 , typeof conditions
        { code: "if(typeof x){}", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(typeof 'abc' === 'string'){}", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(a = typeof b){}", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a, typeof b){}", errors: [{ messageId: "unexpected", type: "SequenceExpression" }] },
        { code: "if(typeof 'a' == 'string' || typeof 'b' == 'string'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "while(typeof x){}", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },

        // #5726, void conditions
        { code: "if(1 || void x);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(void x);", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(y = void x);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(x, void x);", errors: [{ messageId: "unexpected", type: "SequenceExpression" }] },
        { code: "if(void x === void y);", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(void x && a);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(a && void x);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },

        // #5693
        { code: "if(false && abc==='str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(true || abc==='str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(abc==='str' || true){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(abc==='str' || true || def ==='str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(false || true){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(typeof abc==='str' || true){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },

        // #11181, string literals
        { code: "if('str1' || 'str2'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if('str1' && 'str2'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(abc==='str' || 'str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(a || 'str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },

        {
            code: "function* foo(){while(true){} yield 'foo';}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo(){while(true){if (true) {yield 'foo';}}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo(){while(true){yield 'foo';} while(true) {}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "var a = function* foo(){while(true){} yield 'foo';}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "while (true) { function* foo() {yield;}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo(){if (true) {yield 'foo';}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo() {for (let foo = yield; true;) {}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo() {for (foo = yield; true;) {}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function foo() {while (true) {function* bar() {while (true) {yield;}}}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function foo() {while (true) {const bar = function*() {while (true) {yield;}}}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo() { for (let foo = 1 + 2 + 3 + (yield); true; baz) {}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        }
    ]
});
