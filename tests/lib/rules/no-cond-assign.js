/**
 * @fileoverview Tests for no-cond-assign rule.
 * @author Stephen Murray <spmurrayzzz>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-cond-assign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-cond-assign", rule, {
    valid: [
        "var x = 0; if (x == 0) { var b = 1; }",
        { code: "var x = 0; if (x == 0) { var b = 1; }", options: ["always"] },
        "var x = 5; while (x < 5) { x = x + 1; }",
        "if ((someNode = someNode.parentNode) !== null) { }",
        { code: "if ((someNode = someNode.parentNode) !== null) { }", options: ["except-parens"] },
        "if ((a = b));",
        "while ((a = b));",
        "do {} while ((a = b));",
        "for (;(a = b););",
        "for (;;) {}",
        "if (someNode || (someNode = parentNode)) { }",
        "while (someNode || (someNode = parentNode)) { }",
        "do { } while (someNode || (someNode = parentNode));",
        "for (;someNode || (someNode = parentNode););",
        { code: "if ((function(node) { return node = parentNode; })(someNode)) { }", options: ["except-parens"] },
        { code: "if ((function(node) { return node = parentNode; })(someNode)) { }", options: ["always"] },
        { code: "if ((node => node = parentNode)(someNode)) { }", options: ["except-parens"], parserOptions: { ecmaVersion: 6 } },
        { code: "if ((node => node = parentNode)(someNode)) { }", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "if (function(node) { return node = parentNode; }) { }", options: ["except-parens"] },
        { code: "if (function(node) { return node = parentNode; }) { }", options: ["always"] },
        { code: "x = 0;", options: ["always"] },
        "var x; var b = (x === 0) ? 1 : 0;"
    ],
    invalid: [
        { code: "var x; if (x = 0) { var b = 1; }", errors: [{ messageId: "missing", type: "IfStatement", line: 1, column: 12 }] },
        { code: "var x; while (x = 0) { var b = 1; }", errors: [{ messageId: "missing", type: "WhileStatement" }] },
        { code: "var x = 0, y; do { y = x; } while (x = x + 1);", errors: [{ messageId: "missing", type: "DoWhileStatement" }] },
        { code: "var x; for(; x+=1 ;){};", errors: [{ messageId: "missing", type: "ForStatement" }] },
        { code: "var x; if ((x) = (0));", errors: [{ messageId: "missing", type: "IfStatement" }] },
        { code: "if (someNode || (someNode = parentNode)) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "an 'if' statement" }, type: "IfStatement" }] },
        { code: "while (someNode || (someNode = parentNode)) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'while' statement" }, type: "WhileStatement" }] },
        { code: "do { } while (someNode || (someNode = parentNode));", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'do...while' statement" }, type: "DoWhileStatement" }] },
        { code: "for (; (typeof l === 'undefined' ? (l = 0) : l); i++) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'for' statement" }, type: "ForStatement" }] },
        { code: "if (x = 0) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "an 'if' statement" }, type: "IfStatement" }] },
        { code: "while (x = 0) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'while' statement" }, type: "WhileStatement" }] },
        { code: "do { } while (x = x + 1);", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'do...while' statement" }, type: "DoWhileStatement" }] },
        { code: "for(; x = y; ) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'for' statement" }, type: "ForStatement" }] },
        { code: "if ((x = 0)) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "an 'if' statement" }, type: "IfStatement" }] },
        { code: "while ((x = 0)) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'while' statement" }, type: "WhileStatement" }] },
        { code: "do { } while ((x = x + 1));", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'do...while' statement" }, type: "DoWhileStatement" }] },
        { code: "for(; (x = y); ) { }", options: ["always"], errors: [{ messageId: "unexpected", data: { type: "a 'for' statement" }, type: "ForStatement" }] },
        { code: "var x; var b = (x = 0) ? 1 : 0;", errors: [{ messageId: "missing", type: "ConditionalExpression" }] }
    ]
});
