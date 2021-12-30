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
        { code: "for ( var i = 0;i < results.length; ) {}", options: [{ after: false }] },

        "do {} while (true); foo",

        // Class fields
        {
            code: "class C { foo; bar; method() {} }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo }",
            parserOptions: { ecmaVersion: 2022 }
        },

        // Empty are ignored (`no-extra-semi` rule will remove those)
        "foo; ;;;;;;;;;",
        {
            code: "class C { foo; ;;;;;;;;;; }",
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "var a = 'b'  ;",
            output: "var a = 'b';",
            errors: [
                {
                    messageId: "unexpectedWhitespaceBefore",
                    type: "VariableDeclaration",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 14
                }
            ]
        },
        {
            code: "var a = 'b' ;",
            output: "var a = 'b';",
            errors: [
                {
                    messageId: "unexpectedWhitespaceBefore",
                    type: "VariableDeclaration",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var a = 'b',\nc = 'd' ;",
            output: "var a = 'b',\nc = 'd';",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "VariableDeclaration", line: 2, column: 8 }]
        },
        {
            code: "var a = function() {} ;",
            output: "var a = function() {};",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "VariableDeclaration", line: 1, column: 22 }]
        },
        {
            code: "var a = function() {\n} ;",
            output: "var a = function() {\n};",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "VariableDeclaration", line: 2, column: 2 }]
        },
        {
            code: "/^a$/.test('b') ;",
            output: "/^a$/.test('b');",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ExpressionStatement", line: 1, column: 16 }]
        },
        {
            code: ";(function(){}()) ;",
            output: ";(function(){}());",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ExpressionStatement", line: 1, column: 18 }]
        },
        {
            code: "while (true) { break ; }",
            output: "while (true) { break; }",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "BreakStatement", line: 1, column: 21 }]
        },
        {
            code: "while (true) { continue ; }",
            output: "while (true) { continue; }",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ContinueStatement", line: 1, column: 24 }]
        },
        {
            code: "debugger ;",
            output: "debugger;",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "DebuggerStatement", line: 1, column: 9 }]
        },
        {
            code: "function foo() { return ; }",
            output: "function foo() { return; }",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ReturnStatement", line: 1, column: 24 }]
        },
        {
            code: "throw new Error('foo') ;",
            output: "throw new Error('foo');",
            errors: [{ messageId: "unexpectedWhitespaceBefore", type: "ThrowStatement", line: 1, column: 23 }]
        },
        {
            code: "for (var i = 0 ; i < 10 ; i++) {}",
            output: "for (var i = 0; i < 10; i++) {}",
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ForStatement", line: 1, column: 15 },
                { messageId: "unexpectedWhitespaceBefore", type: "ForStatement", line: 1, column: 24 }
            ]
        },
        {
            code: "var a = 'b';c = 'd';",
            output: "var a = 'b'; c = 'd';",
            errors: [
                {
                    messageId: "missingWhitespaceAfter",
                    type: "VariableDeclaration",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var a = 'b';",
            output: "var a = 'b' ;",
            options: [{ before: true, after: true }],
            errors: [
                {
                    messageId: "missingWhitespaceBefore",
                    type: "VariableDeclaration",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var a = 'b'; c = 'd';",
            output: "var a = 'b';c = 'd';",
            options: [{ before: false, after: false }],
            errors: [
                {
                    messageId: "unexpectedWhitespaceAfter",
                    type: "VariableDeclaration",
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 14
                }
            ]
        },
        {
            code: "var a = 'b';   c = 'd';",
            output: "var a = 'b';c = 'd';",
            options: [{ before: false, after: false }],
            errors: [
                {
                    messageId: "unexpectedWhitespaceAfter",
                    type: "VariableDeclaration",
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 16
                }
            ]
        },
        {
            code: "for (var i = 0;i < 10;i++) {}",
            output: "for (var i = 0; i < 10; i++) {}",
            errors: [
                {
                    messageId: "missingWhitespaceAfter",
                    type: "ForStatement",
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 16
                },
                {
                    messageId: "missingWhitespaceAfter",
                    type: "ForStatement",
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 23
                }
            ]
        },
        {
            code: "for (var i = 0; i < 10; i++) {}",
            output: "for (var i = 0 ; i < 10 ; i++) {}",
            options: [{ before: true, after: true }],
            errors: [
                {
                    messageId: "missingWhitespaceBefore",
                    type: "ForStatement",
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 16
                },
                {
                    messageId: "missingWhitespaceBefore",
                    type: "ForStatement",
                    line: 1,
                    column: 23,
                    endLine: 1,
                    endColumn: 24
                }
            ]
        },
        {
            code: "for (var i = 0; i < 10; i++) {}",
            output: "for (var i = 0;i < 10;i++) {}",
            options: [{ before: false, after: false }],
            errors: [
                { messageId: "unexpectedWhitespaceAfter", type: "ForStatement", line: 1, column: 16 },
                { messageId: "unexpectedWhitespaceAfter", type: "ForStatement", line: 1, column: 24 }
            ]
        },
        {
            code: "import Foo from 'bar' ;",
            output: "import Foo from 'bar';",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ImportDeclaration", line: 1, column: 22 }
            ]
        },
        {
            code: "import * as foo from 'bar' ;",
            output: "import * as foo from 'bar';",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ImportDeclaration", line: 1, column: 27 }
            ]
        },
        {
            code: "var foo = 0; export {foo} ;",
            output: "var foo = 0; export {foo};",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ExportNamedDeclaration", line: 1, column: 26 }
            ]
        },
        {
            code: "export * from 'foo' ;",
            output: "export * from 'foo';",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ExportAllDeclaration", line: 1, column: 20 }
            ]
        },
        {
            code: "export default foo ;",
            output: "export default foo;",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedWhitespaceBefore", type: "ExportDefaultDeclaration", line: 1, column: 19 }
            ]
        },
        {
            code: "while(foo) {continue   ;}",
            output: "while(foo) {continue;}",
            options: [{ before: false, after: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedWhitespaceBefore",
                    type: "ContinueStatement",
                    line: 1,
                    column: 21,
                    endLine: 1,
                    endColumn: 24
                }
            ]
        },
        {
            code: "if(foo) {throw new Error()   ;  }",
            output: "if(foo) {throw new Error();  }",
            options: [{ before: false, after: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedWhitespaceBefore",
                    type: "ThrowStatement",
                    line: 1,
                    column: 27,
                    endLine: 1,
                    endColumn: 30
                }
            ]
        },
        {
            code: "for(a ; ; );",
            output: "for(a;; );",
            options: [{ before: false, after: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                type: "ForStatement",
                messageId: "unexpectedWhitespaceBefore",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 7
            },
            {
                type: "ForStatement",
                messageId: "unexpectedWhitespaceAfter",
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 9
            }]
        },
        {
            code: "for(a ; \n ; );",
            output: "for(a; \n ; );",
            options: [{ before: false, after: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                type: "ForStatement",
                messageId: "unexpectedWhitespaceBefore",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 7
            }
            ]
        },
        {
            code: "do {} while (true) ;",
            output: "do {} while (true);",
            errors: [{
                messageId: "unexpectedWhitespaceBefore",
                type: "DoWhileStatement",
                line: 1,
                column: 19,
                endLine: 1,
                endColumn: 20
            }]
        },
        {
            code: "do {} while (true);foo",
            output: "do {} while (true); foo",
            errors: [{
                messageId: "missingWhitespaceAfter",
                type: "DoWhileStatement",
                line: 1,
                column: 19,
                endLine: 1,
                endColumn: 20
            }]
        },
        {
            code: "do {} while (true);  foo",
            output: "do {} while (true) ;foo",
            options: [{ before: true, after: false }],
            errors: [{
                messageId: "missingWhitespaceBefore",
                type: "DoWhileStatement",
                line: 1,
                column: 19,
                endLine: 1,
                endColumn: 20
            },
            {
                messageId: "unexpectedWhitespaceAfter",
                type: "DoWhileStatement",
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 22
            }]
        },

        // Class fields
        {
            code: "class C { foo ;bar;}",
            output: "class C { foo; bar;}",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "unexpectedWhitespaceBefore",
                    type: "PropertyDefinition",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    messageId: "missingWhitespaceAfter",
                    type: "PropertyDefinition",
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 16
                }
            ]
        },
        {
            code: "class C { foo; bar ; }",
            output: "class C { foo ;bar ; }",
            options: [{ before: true, after: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "missingWhitespaceBefore",
                    type: "PropertyDefinition",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    messageId: "unexpectedWhitespaceAfter",
                    type: "PropertyDefinition",
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 16
                }
            ]
        },
        {
            code: "class C { foo;static {}}",
            output: "class C { foo; static {}}",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingWhitespaceAfter",
                type: "PropertyDefinition",
                line: 1,
                column: 14,
                endLine: 1,
                endColumn: 15
            }]
        }
    ]
});
