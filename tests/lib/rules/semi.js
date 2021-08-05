/**
 * @fileoverview Tests for semi rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/semi"),
    { RuleTester } = require("../../../lib/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("semi", rule, {
    valid: [
        "var x = 5;",
        "var x =5, y;",
        "foo();",
        "x = foo();",
        "setTimeout(function() {foo = \"bar\"; });",
        "setTimeout(function() {foo = \"bar\";});",
        "for (var a in b){}",
        "for (var i;;){}",
        "if (true) {}\n;[global, extended].forEach(function(){});",
        "throw new Error('foo');",
        { code: "throw new Error('foo')", options: ["never"] },
        { code: "var x = 5", options: ["never"] },
        { code: "var x =5, y", options: ["never"] },
        { code: "foo()", options: ["never"] },
        { code: "debugger", options: ["never"] },
        { code: "for (var a in b){}", options: ["never"] },
        { code: "for (var i;;){}", options: ["never"] },
        { code: "x = foo()", options: ["never"] },
        { code: "if (true) {}\n;[global, extended].forEach(function(){})", options: ["never"] },
        { code: "(function bar() {})\n;(function foo(){})", options: ["never"] },
        { code: ";/foo/.test('bar')", options: ["never"] },
        { code: ";+5", options: ["never"] },
        { code: ";-foo()", options: ["never"] },
        { code: "a++\nb++", options: ["never"] },
        { code: "a++; b++", options: ["never"] },
        { code: "for (let thing of {}) {\n  console.log(thing);\n}", parserOptions: { ecmaVersion: 6 } },
        { code: "do{}while(true)", options: ["never"] },
        { code: "do{}while(true);", options: ["always"] },

        { code: "if (foo) { bar() }", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "if (foo) { bar(); baz() }", options: ["always", { omitLastInOneLineBlock: true }] },


        // method definitions don't have a semicolon.
        { code: "class A { a() {} b() {} }", parserOptions: { ecmaVersion: 6 } },
        { code: "var A = class { a() {} b() {} };", parserOptions: { ecmaVersion: 6 } },

        { code: "import theDefault, { named1, named2 } from 'src/mylib';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import theDefault, { named1, named2 } from 'src/mylib'", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },

        // exports, "always"
        { code: "export * from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export { foo } from 'foo';", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var foo = 0;export { foo };", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export var foo;", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function foo () { }", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function* foo () { }", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export class Foo { }", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export let foo;", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export const FOO = 42;", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default function() { }", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default function* () { }", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default class { }", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo || bar;", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default (foo) => foo.bar();", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo = 42;", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo += 42;", parserOptions: { ecmaVersion: 6, sourceType: "module" } },

        // exports, "never"
        { code: "export * from 'foo'", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export { foo } from 'foo'", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var foo = 0; export { foo }", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export var foo", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function foo () { }", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function* foo () { }", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export class Foo { }", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export let foo", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export const FOO = 42", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default function() { }", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default function* () { }", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default class { }", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo || bar", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default (foo) => foo.bar()", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo = 42", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo += 42", options: ["never"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "++\nfoo;", options: ["always"] },
        { code: "var a = b;\n+ c", options: ["never"] },

        // https://github.com/eslint/eslint/issues/7782
        { code: "var a = b;\n/foo/.test(c)", options: ["never"] },
        { code: "var a = b;\n`foo`", options: ["never"], parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/9521
        {
            code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "any" }]
        },
        {
            code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "any" }]
        },
        {
            code: `
                import a from "a";
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: `
                var a = 0; export {a};
                [a] = b
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: `
                function wrap() {
                    return;
                    ({a} = b)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: `
                while (true) {
                    break;
                    +i
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }]
        },
        {
            code: `
                while (true) {
                    continue;
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }]
        },
        {
            code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }]
        },
        {
            code: `
                const f = () => {};
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: `
                var a = 0; export {a}
                [a] = b
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: `
                function wrap() {
                    return
                    ({a} = b)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: `
                while (true) {
                    break
                    +i
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }]
        },
        {
            code: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }]
        },
        {
            code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }]
        },
        {
            code: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2015 }
        },

        // Class fields
        {
            code: "class C { foo; }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = obj\n;[bar] }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo;\n[bar]; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n;[bar] }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n[bar] }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n;[bar] }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n;[bar] }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n[bar] }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n;[bar] }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo() {} }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo() {}; }", // no-extra-semi reports it
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "import * as utils from './utils'",
            output: "import * as utils from './utils';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration",
                column: 33,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "import { square, diag } from 'lib'",
            output: "import { square, diag } from 'lib';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration"
            }]
        },
        {
            code: "import { default as foo } from 'lib'",
            output: "import { default as foo } from 'lib';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration"
            }]
        },
        {
            code: "import 'src/mylib'",
            output: "import 'src/mylib';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration"
            }]
        },
        {
            code: "import theDefault, { named1, named2 } from 'src/mylib'",
            output: "import theDefault, { named1, named2 } from 'src/mylib';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration"
            }]
        },
        {
            code: "function foo() { return [] }",
            output: "function foo() { return []; }",
            errors: [{
                messageId: "missingSemi",
                type: "ReturnStatement"
            }]
        },
        {
            code: "while(true) { break }",
            output: "while(true) { break; }",
            errors: [{
                messageId: "missingSemi",
                type: "BreakStatement"
            }]
        },
        {
            code: "while(true) { continue }",
            output: "while(true) { continue; }",
            errors: [{
                messageId: "missingSemi",
                type: "ContinueStatement"
            }]
        },
        {
            code: "let x = 5",
            output: "let x = 5;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var x = 5",
            output: "var x = 5;",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var x = 5, y",
            output: "var x = 5, y;",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "debugger",
            output: "debugger;",
            errors: [{
                messageId: "missingSemi",
                type: "DebuggerStatement"
            }]
        },
        {
            code: "foo()",
            output: "foo();",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                column: 6,
                endColumn: void 0
            }]
        },
        {
            code: "foo()\n",
            output: "foo();\n",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                column: 6,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "foo()\r\n",
            output: "foo();\r\n",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                column: 6,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "foo()\nbar();",
            output: "foo();\nbar();",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                column: 6,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "foo()\r\nbar();",
            output: "foo();\r\nbar();",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                column: 6,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "for (var a in b) var i ",
            output: "for (var a in b) var i; ",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (;;){var i}",
            output: "for (;;){var i;}",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (;;) var i ",
            output: "for (;;) var i; ",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (var j;;) {var i}",
            output: "for (var j;;) {var i;}",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var foo = {\n bar: baz\n}",
            output: "var foo = {\n bar: baz\n};",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 3
            }]
        },
        {
            code: "var foo\nvar bar;",
            output: "var foo;\nvar bar;",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1
            }]
        },
        {
            code: "throw new Error('foo')",
            output: "throw new Error('foo');",
            errors: [{
                messageId: "missingSemi",
                type: "ThrowStatement",
                line: 1
            }]
        },
        {
            code: "do{}while(true)",
            output: "do{}while(true);",
            errors: [{
                messageId: "missingSemi",
                type: "DoWhileStatement",
                line: 1
            }]
        },
        {
            code: "if (foo) {bar()}",
            output: "if (foo) {bar();}",
            errors: [{
                messageId: "missingSemi",
                column: 16,
                endColumn: 17
            }]
        },
        {
            code: "if (foo) {bar()} ",
            output: "if (foo) {bar();} ",
            errors: [{
                messageId: "missingSemi",
                column: 16,
                endColumn: 17
            }]
        },
        {
            code: "if (foo) {bar()\n}",
            output: "if (foo) {bar();\n}",
            errors: [{
                messageId: "missingSemi",
                column: 16,
                endLine: 2,
                endColumn: 1
            }]
        },

        {
            code: "throw new Error('foo');",
            output: "throw new Error('foo')",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "ThrowStatement",
                column: 23
            }]
        },
        {
            code: "function foo() { return []; }",
            output: "function foo() { return [] }",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "ReturnStatement"
            }]
        },
        {
            code: "while(true) { break; }",
            output: "while(true) { break }",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "BreakStatement"
            }]
        },
        {
            code: "while(true) { continue; }",
            output: "while(true) { continue }",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "ContinueStatement"
            }]
        },
        {
            code: "let x = 5;",
            output: "let x = 5",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var x = 5;",
            output: "var x = 5",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var x = 5, y;",
            output: "var x = 5, y",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "debugger;",
            output: "debugger",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "DebuggerStatement"
            }]
        },
        {
            code: "foo();",
            output: "foo()",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "ExpressionStatement"
            }]
        },
        {
            code: "for (var a in b) var i; ",
            output: "for (var a in b) var i ",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (;;){var i;}",
            output: "for (;;){var i}",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (;;) var i; ",
            output: "for (;;) var i ",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "for (var j;;) {var i;}",
            output: "for (var j;;) {var i}",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var foo = {\n bar: baz\n};",
            output: "var foo = {\n bar: baz\n}",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 3
            }]
        },
        {
            code: "import theDefault, { named1, named2 } from 'src/mylib';",
            output: "import theDefault, { named1, named2 } from 'src/mylib'",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ImportDeclaration"
            }]
        },
        {
            code: "do{}while(true);",
            output: "do{}while(true)",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "DoWhileStatement",
                line: 1
            }]
        },

        {
            code: "if (foo) { bar()\n }",
            output: "if (foo) { bar();\n }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "missingSemi"
            }]
        },
        {
            code: "if (foo) {\n bar() }",
            output: "if (foo) {\n bar(); }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "missingSemi"
            }]
        },
        {
            code: "if (foo) {\n bar(); baz() }",
            output: "if (foo) {\n bar(); baz(); }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "missingSemi"
            }]
        },
        {
            code: "if (foo) { bar(); }",
            output: "if (foo) { bar() }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "extraSemi"
            }]
        },


        // exports, "always"
        {
            code: "export * from 'foo'",
            output: "export * from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportAllDeclaration"
            }]
        },
        {
            code: "export { foo } from 'foo'",
            output: "export { foo } from 'foo';",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportNamedDeclaration"
            }]
        },
        {
            code: "var foo = 0;export { foo }",
            output: "var foo = 0;export { foo };",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportNamedDeclaration"
            }]
        },
        {
            code: "export var foo",
            output: "export var foo;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export let foo",
            output: "export let foo;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export const FOO = 42",
            output: "export const FOO = 42;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export default foo || bar",
            output: "export default foo || bar;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportDefaultDeclaration"
            }]
        },
        {
            code: "export default (foo) => foo.bar()",
            output: "export default (foo) => foo.bar();",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportDefaultDeclaration"
            }]
        },
        {
            code: "export default foo = 42",
            output: "export default foo = 42;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportDefaultDeclaration"
            }]
        },
        {
            code: "export default foo += 42",
            output: "export default foo += 42;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportDefaultDeclaration"
            }]
        },

        // exports, "never"
        {
            code: "export * from 'foo';",
            output: "export * from 'foo'",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportAllDeclaration",
                column: 20,
                endColumn: 21
            }]
        },
        {
            code: "export { foo } from 'foo';",
            output: "export { foo } from 'foo'",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportNamedDeclaration"
            }]
        },
        {
            code: "var foo = 0;export { foo };",
            output: "var foo = 0;export { foo }",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportNamedDeclaration"
            }]
        },
        {
            code: "export var foo;",
            output: "export var foo",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export let foo;",
            output: "export let foo",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export const FOO = 42;",
            output: "export const FOO = 42",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration"
            }]
        },
        {
            code: "export default foo || bar;",
            output: "export default foo || bar",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportDefaultDeclaration"
            }]
        },
        {
            code: "export default (foo) => foo.bar();",
            output: "export default (foo) => foo.bar()",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportDefaultDeclaration"
            }]
        },
        {
            code: "export default foo = 42;",
            output: "export default foo = 42",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportDefaultDeclaration"
            }]
        },
        {
            code: "export default foo += 42;",
            output: "export default foo += 42",
            options: ["never"],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportDefaultDeclaration"
            }]
        },
        {
            code: "a;\n++b",
            output: "a\n++b",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                column: 2,
                endColumn: 3
            }]
        },

        // https://github.com/eslint/eslint/issues/7928
        {
            code: [
                "/*eslint no-extra-semi: error */",
                "foo();",
                ";[0,1,2].forEach(bar)"
            ].join("\n"),
            output: [
                "/*eslint no-extra-semi: error */",
                "foo()",
                ";[0,1,2].forEach(bar)"
            ].join("\n"),
            options: ["never"],
            errors: [
                "Extra semicolon.",
                "Unnecessary semicolon."
            ]
        },

        // https://github.com/eslint/eslint/issues/9521
        {
            code: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
            output: `
                import a from "a";
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Missing semicolon."]
        },
        {
            code: `
                var a = 0; export {a}
                [a] = b
            `,
            output: `
                var a = 0; export {a};
                [a] = b
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Missing semicolon."]
        },
        {
            code: `
                function wrap() {
                    return
                    ({a} = b)
                }
            `,
            output: `
                function wrap() {
                    return;
                    ({a} = b)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 2015 },
            errors: ["Missing semicolon."]
        },
        {
            code: `
                while (true) {
                    break
                   +i
                }
            `,
            output: `
                while (true) {
                    break;
                   +i
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            errors: ["Missing semicolon."]
        },
        {
            code: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
            output: `
                while (true) {
                    continue;
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            errors: ["Missing semicolon."]
        },
        {
            code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            output: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            errors: ["Missing semicolon."]
        },
        {
            code: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
            output: `
                const f = () => {};
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 2015 },
            errors: ["Missing semicolon."]
        },
        {
            code: `
                import a from "a";
                [1,2,3].forEach(doSomething)
            `,
            output: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Extra semicolon."]
        },
        {
            code: `
                var a = 0; export {a};
                [a] = b
            `,
            output: `
                var a = 0; export {a}
                [a] = b
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Extra semicolon."]
        },
        {
            code: `
                function wrap() {
                    return;
                    ({a} = b)
                }
            `,
            output: `
                function wrap() {
                    return
                    ({a} = b)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2015 },
            errors: ["Extra semicolon."]
        },
        {
            code: `
                while (true) {
                    break;
                    +i
                }
            `,
            output: `
                while (true) {
                    break
                    +i
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: ["Extra semicolon."]
        },
        {
            code: `
                while (true) {
                    continue;
                    [1,2,3].forEach(doSomething)
                }
            `,
            output: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: ["Extra semicolon."]
        },
        {
            code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
            output: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: ["Extra semicolon."]
        },
        {
            code: `
                const f = () => {};
                [1,2,3].forEach(doSomething)
            `,
            output: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2015 },
            errors: ["Extra semicolon."]
        },
        {
            code: `
                import a from "a"
                ;[1,2,3].forEach(doSomething)
            `,
            output: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Extra semicolon."]
        },
        {
            code: `
                var a = 0; export {a}
                ;[1,2,3].forEach(doSomething)
            `,
            output: `
                var a = 0; export {a}
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: ["Extra semicolon."]
        },
        {
            code: `
                function wrap() {
                    return
                    ;[1,2,3].forEach(doSomething)
                }
            `,
            output: `
                function wrap() {
                    return
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: ["Extra semicolon."]
        },
        {
            code: `
                while (true) {
                    break
                    ;[1,2,3].forEach(doSomething)
                }
            `,
            output: `
                while (true) {
                    break
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: ["Extra semicolon."]
        },
        {
            code: `
                while (true) {
                    continue
                    ;[1,2,3].forEach(doSomething)
                }
            `,
            output: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: ["Extra semicolon."]
        },
        {
            code: `
                do; while(a)
                ;[1,2,3].forEach(doSomething)
            `,
            output: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: ["Extra semicolon."]
        },
        {
            code: `
                const f = () => {}
                ;[1,2,3].forEach(doSomething)
            `,
            output: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2015 },
            errors: ["Extra semicolon."]
        },

        // Class fields
        {
            code: "class C { foo }",
            output: "class C { foo; }",
            parserOptions: { ecmaVersion: 2022 },
            errors: ["Missing semicolon."]
        },
        {
            code: "class C { foo }",
            output: "class C { foo; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: ["Missing semicolon."]
        },
        {
            code: "class C { foo; }",
            output: "class C { foo }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: ["Extra semicolon."]
        },
        {
            code: "class C { foo\n[bar]; }",
            output: "class C { foo;\n[bar]; }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: ["Missing semicolon."]
        },
        {
            code: "class C { foo\n[bar] }",
            output: "class C { foo;\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: ["Missing semicolon."]
        },
        {
            code: "class C { foo\n;[bar] }",
            output: "class C { foo\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: ["Extra semicolon."]
        },
        {
            code: "class C { foo = () => {}\n[bar] }",
            output: "class C { foo = () => {};\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: ["Missing semicolon."]
        },
        {
            code: "class C { foo = () => {}\n;[bar] }",
            output: "class C { foo = () => {}\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            parserOptions: { ecmaVersion: 2022 },
            errors: ["Extra semicolon."]
        }
    ]
});
