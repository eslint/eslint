/**
 * @fileoverview Tests for semi-spacing.
 * @author Mathias Schreck
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/semi-spacing"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("semi-spacing", rule, {
    valid: [
        "var a = 'b';",
        "var a = 'b ; c';",
        "var a = 'b',\nc = 'd';",
        "var a = function() {};",
        ";(function(){}());",
        "var a = 'b'\n;(function(){}())",
        "debugger\n;(function(){}())",
        "while (true) { break; }",
        "while (true) { continue; }",
        "debugger;",
        "function foo() { return; }",
        "throw new Error('foo');",
        "for (var i = 0; i < 10; i++) {}",
        "for (;;) {}",
        {
            code: "var a = 'b' ;",
            options: [{ before: true, after: true }]
        },
        {
            code: "var a = 'b';c = 'd';",
            options: [{ before: false, after: false }]
        },
        {
            code: "for (var i = 0 ;i < 10 ;i++) {}",
            options: [{ before: true, after: false }]
        },
        {
            code: "for (var i = 0 ; i < 10 ; i++) {}",
            options: [{ before: true, after: true }]
        },

        // https://github.com/eslint/eslint/issues/3721
        "function foo(){return 2;}",
        "for(var i = 0; i < results.length;) {}",
        { code: "function foo() { return 2; }", options: [{ after: false }] },
        { code: "for ( var i = 0;i < results.length; ) {}", options: [{ after: false }] }
    ],
    invalid: [
        {
            code: "var a = 'b' ;",
            output: "var a = 'b';",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "VariableDeclaration", line: 1, column: 13 }]
        },
        {
            code: "var a = 'b',\nc = 'd' ;",
            output: "var a = 'b',\nc = 'd';",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "VariableDeclaration", line: 2, column: 9 }]
        },
        {
            code: "var a = function() {} ;",
            output: "var a = function() {};",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "VariableDeclaration", line: 1, column: 23 }]
        },
        {
            code: "var a = function() {\n} ;",
            output: "var a = function() {\n};",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "VariableDeclaration", line: 2, column: 3 }]
        },
        {
            code: "/^a$/.test('b') ;",
            output: "/^a$/.test('b');",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ExpressionStatement", line: 1, column: 17 }]
        },
        {
            code: ";(function(){}()) ;",
            output: ";(function(){}());",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ExpressionStatement", line: 1, column: 19 }]
        },
        {
            code: "while (true) { break ; }",
            output: "while (true) { break; }",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "BreakStatement", line: 1, column: 22 }]
        },
        {
            code: "while (true) { continue ; }",
            output: "while (true) { continue; }",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ContinueStatement", line: 1, column: 25 }]
        },
        {
            code: "debugger ;",
            output: "debugger;",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "DebuggerStatement", line: 1, column: 10 }]
        },
        {
            code: "function foo() { return ; }",
            output: "function foo() { return; }",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ReturnStatement", line: 1, column: 25 }]
        },
        {
            code: "throw new Error('foo') ;",
            output: "throw new Error('foo');",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ThrowStatement", line: 1, column: 24 }]
        },
        {
            code: "for (var i = 0 ; i < 10 ; i++) {}",
            output: "for (var i = 0; i < 10; i++) {}",
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ForStatement", line: 1, column: 16 },
                { messageId: "unexpectedWhitespaceBefore", type: "ForStatement", line: 1, column: 25 }
            ]
        },
        {
            code: "var a = 'b';c = 'd';",
            output: "var a = 'b'; c = 'd';",
            errors: [{ messageId: "missingWhitespaceAfter", type: "VariableDeclaration", line: 1, column: 12 }]
        },
        {
            code: "var a = 'b';",
            output: "var a = 'b' ;",
            options: [{ before: true, after: true }],
            errors: [{ messageId: "missingWhitespaceBefore", type: "VariableDeclaration", line: 1, column: 12 }]
        },
        {
            code: "var a = 'b'; c = 'd';",
            output: "var a = 'b';c = 'd';",
            options: [{ before: false, after: false }],
            errors: [{ messageId: "unexpectedWhitespaceAfter", type: "VariableDeclaration", line: 1, column: 12 }]
        },
        {
            code: "for (var i = 0;i < 10;i++) {}",
            output: "for (var i = 0; i < 10; i++) {}",
            errors: [
                { messageId: "missingWhitespaceAfter", type: "ForStatement", line: 1, column: 15 },
                { messageId: "missingWhitespaceAfter", type: "ForStatement", line: 1, column: 22 }
            ]
        },
        {
            code: "for (var i = 0; i < 10; i++) {}",
            output: "for (var i = 0 ; i < 10 ; i++) {}",
            options: [{ before: true, after: true }],
            errors: [
                { messageId: "missingWhitespaceBefore", type: "ForStatement", line: 1, column: 15 },
                { messageId: "missingWhitespaceBefore", type: "ForStatement", line: 1, column: 23 }
            ]
        },
        {
            code: "for (var i = 0; i < 10; i++) {}",
            output: "for (var i = 0;i < 10;i++) {}",
            options: [{ before: false, after: false }],
            errors: [
                { messageId: "unexpectedWhitespaceAfter", type: "ForStatement", line: 1, column: 15 },
                { messageId: "unexpectedWhitespaceAfter", type: "ForStatement", line: 1, column: 23 }
            ]
        },
        {
            code: "import Foo from 'bar' ;",
            output: "import Foo from 'bar';",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ImportDeclaration", line: 1, column: 23 }
            ]
        },
        {
            code: "import * as foo from 'bar' ;",
            output: "import * as foo from 'bar';",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ImportDeclaration", line: 1, column: 28 }
            ]
        },
        {
            code: "var foo = 0; export {foo} ;",
            output: "var foo = 0; export {foo};",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ExportNamedDeclaration", line: 1, column: 27 }
            ]
        },
        {
            code: "export * from 'foo' ;",
            output: "export * from 'foo';",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ExportAllDeclaration", line: 1, column: 21 }
            ]
        },
        {
            code: "export default foo ;",
            output: "export default foo;",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ExportDefaultDeclaration", line: 1, column: 20 }
            ]
        }
    ]
});
