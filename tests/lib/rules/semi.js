/**
 * @fileoverview Tests for semi rule.
 * @author Nicholas C. Zakas
 * @copyright 2013 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/semi"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
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
        { code: "for (let thing of {}) {\n  console.log(thing);\n}", ecmaFeatures: { forOf: true, blockBindings: true }},
        { code: "do{}while(true)", options: ["never"] },
        { code: "do{}while(true);", options: ["always"] },

        // method definitions don't have a semicolon.
        { code: "class A { a() {} b() {} }", ecmaFeatures: { classes: true }},
        { code: "var A = class { a() {} b() {} };", ecmaFeatures: { classes: true }},

        { code: "import theDefault, { named1, named2 } from 'src/mylib';", ecmaFeatures: { modules: true }},
        { code: "import theDefault, { named1, named2 } from 'src/mylib'", options: ["never"], ecmaFeatures: { modules: true }},

        // exports, "always"
        { code: "export * from 'foo';", ecmaFeatures: { modules: true } },
        { code: "export { foo } from 'foo';", ecmaFeatures: { modules: true } },
        { code: "export { foo };", ecmaFeatures: { modules: true } },
        { code: "export var foo;", ecmaFeatures: { modules: true } },
        { code: "export function foo () { }", ecmaFeatures: { modules: true } },
        { code: "export function* foo () { }", ecmaFeatures: { generators: true, modules: true } },
        { code: "export class Foo { }", ecmaFeatures: { classes: true, modules: true } },
        { code: "export let foo;", ecmaFeatures: { blockBindings: true, modules: true } },
        { code: "export const FOO = 42;", ecmaFeatures: { blockBindings: true, modules: true } },
        { code: "export default function() { }", ecmaFeatures: { modules: true } },
        { code: "export default function* () { }", ecmaFeatures: { generators: true, modules: true } },
        { code: "export default class { }", ecmaFeatures: { classes: true, modules: true } },
        { code: "export default foo || bar;", ecmaFeatures: { modules: true } },
        { code: "export default (foo) => foo.bar();", ecmaFeatures: { arrowFunctions: true, modules: true } },
        { code: "export default foo = 42;", ecmaFeatures: { modules: true } },
        { code: "export default foo += 42;", ecmaFeatures: { modules: true } },

        // exports, "never"
        { code: "export * from 'foo'", options: ["never"], ecmaFeatures: { modules: true } },
        { code: "export { foo } from 'foo'", options: ["never"], ecmaFeatures: { modules: true } },
        { code: "export { foo }", options: ["never"], ecmaFeatures: { modules: true } },
        { code: "export var foo", options: ["never"], ecmaFeatures: { modules: true } },
        { code: "export function foo () { }", options: ["never"], ecmaFeatures: { modules: true } },
        { code: "export function* foo () { }", options: ["never"], ecmaFeatures: { generators: true, modules: true } },
        { code: "export class Foo { }", options: ["never"], ecmaFeatures: { classes: true, modules: true } },
        { code: "export let foo", options: ["never"], ecmaFeatures: { blockBindings: true, modules: true } },
        { code: "export const FOO = 42", options: ["never"], ecmaFeatures: { blockBindings: true, modules: true } },
        { code: "export default function() { }", options: ["never"], ecmaFeatures: { modules: true } },
        { code: "export default function* () { }", options: ["never"], ecmaFeatures: { generators: true, modules: true } },
        { code: "export default class { }", options: ["never"], ecmaFeatures: { classes: true, modules: true } },
        { code: "export default foo || bar", options: ["never"], ecmaFeatures: { modules: true } },
        { code: "export default (foo) => foo.bar()", options: ["never"], ecmaFeatures: { arrowFunctions: true, modules: true } },
        { code: "export default foo = 42", options: ["never"], ecmaFeatures: { modules: true } },
        { code: "export default foo += 42", options: ["never"], ecmaFeatures: { modules: true } }

    ],
    invalid: [
        { code: "import * as utils from './utils'", output: "import * as utils from './utils';", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ImportDeclaration", column: 33}] },
        { code: "import { square, diag } from 'lib'", output: "import { square, diag } from 'lib';", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ImportDeclaration"}] },
        { code: "import { default as foo } from 'lib'", output: "import { default as foo } from 'lib';", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ImportDeclaration"}] },
        { code: "import 'src/mylib'", output: "import 'src/mylib';", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ImportDeclaration"}] },
        { code: "import theDefault, { named1, named2 } from 'src/mylib'", output: "import theDefault, { named1, named2 } from 'src/mylib';", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ImportDeclaration"}] },
        { code: "function foo() { return [] }", output: "function foo() { return []; }", errors: [{ message: "Missing semicolon.", type: "ReturnStatement"}] },
        { code: "while(true) { break }", output: "while(true) { break; }", errors: [{ message: "Missing semicolon.", type: "BreakStatement"}] },
        { code: "while(true) { continue }", output: "while(true) { continue; }", errors: [{ message: "Missing semicolon.", type: "ContinueStatement"}] },
        { code: "let x = 5", output: "let x = 5;", ecmaFeatures: { blockBindings: true }, errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5", output: "var x = 5;", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5, y", output: "var x = 5, y;", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "debugger", output: "debugger;", errors: [{ message: "Missing semicolon.", type: "DebuggerStatement"}] },
        { code: "foo()", output: "foo();", errors: [{ message: "Missing semicolon.", type: "ExpressionStatement"}] },
        { code: "var x = 5, y", output: "var x = 5, y;", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var a in b) var i ", output: "for (var a in b) var i; ", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;){var i}", output: "for (;;){var i;}", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;) var i ", output: "for (;;) var i; ", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var j;;) {var i}", output: "for (var j;;) {var i;}", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration"}] },
        { code: "var foo = {\n bar: baz\n}", output: "var foo = {\n bar: baz\n};", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration", line: 3}] },
        { code: "var foo\nvar bar;", output: "var foo;\nvar bar;", errors: [{ message: "Missing semicolon.", type: "VariableDeclaration", line: 1}] },
        { code: "throw new Error('foo')", output: "throw new Error('foo');", errors: [{ message: "Missing semicolon.", type: "ThrowStatement", line: 1}] },
        { code: "do{}while(true)", output: "do{}while(true);", errors: [{ message: "Missing semicolon.", type: "DoWhileStatement", line: 1}] },

        { code: "throw new Error('foo');", output: "throw new Error('foo')", options: ["never"], errors: [{ message: "Extra semicolon.", type: "ThrowStatement", column: 23}] },
        { code: "function foo() { return []; }", output: "function foo() { return [] }", options: ["never"], errors: [{ message: "Extra semicolon.", type: "ReturnStatement"}] },
        { code: "while(true) { break; }", output: "while(true) { break }", options: ["never"], errors: [{ message: "Extra semicolon.", type: "BreakStatement"}] },
        { code: "while(true) { continue; }", output: "while(true) { continue }", options: ["never"], errors: [{ message: "Extra semicolon.", type: "ContinueStatement"}] },
        { code: "let x = 5;", output: "let x = 5", ecmaFeatures: { blockBindings: true }, options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5;", output: "var x = 5", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var x = 5, y;", output: "var x = 5, y", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "debugger;", output: "debugger", options: ["never"], errors: [{ message: "Extra semicolon.", type: "DebuggerStatement"}] },
        { code: "foo();", output: "foo()", options: ["never"], errors: [{ message: "Extra semicolon.", type: "ExpressionStatement"}] },
        { code: "var x = 5, y;", output: "var x = 5, y", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var a in b) var i; ", output: "for (var a in b) var i ", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;){var i;}", output: "for (;;){var i}", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (;;) var i; ", output: "for (;;) var i ", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "for (var j;;) {var i;}", output: "for (var j;;) {var i}", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration"}] },
        { code: "var foo = {\n bar: baz\n};", output: "var foo = {\n bar: baz\n}", options: ["never"], errors: [{ message: "Extra semicolon.", type: "VariableDeclaration", line: 3}] },
        { code: "import theDefault, { named1, named2 } from 'src/mylib';", output: "import theDefault, { named1, named2 } from 'src/mylib'", options: ["never"], ecmaFeatures: { modules: true }, errors: [{ message: "Extra semicolon.", type: "ImportDeclaration"}] },
        { code: "do{}while(true);", output: "do{}while(true)", options: ["never"], errors: [{ message: "Extra semicolon.", type: "DoWhileStatement", line: 1}] },

        // exports, "always"
        { code: "export * from 'foo'", output: "export * from 'foo';", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ExportAllDeclaration" }] },
        { code: "export { foo } from 'foo'", output: "export { foo } from 'foo';", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ExportNamedDeclaration" }] },
        { code: "export { foo }", output: "export { foo };", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ExportNamedDeclaration" }] },
        { code: "export var foo", output: "export var foo;", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "VariableDeclaration" }] },
        { code: "export let foo", output: "export let foo;", ecmaFeatures: { blockBindings: true, modules: true }, errors: [{ message: "Missing semicolon.", type: "VariableDeclaration" }] },
        { code: "export const FOO = 42", output: "export const FOO = 42;", ecmaFeatures: { blockBindings: true, modules: true }, errors: [{ message: "Missing semicolon.", type: "VariableDeclaration" }] },
        { code: "export default foo || bar", output: "export default foo || bar;", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ExportDefaultDeclaration" }] },
        { code: "export default (foo) => foo.bar()", output: "export default (foo) => foo.bar();", ecmaFeatures: { arrowFunctions: true, modules: true }, errors: [{ message: "Missing semicolon.", type: "ExportDefaultDeclaration" }] },
        { code: "export default foo = 42", output: "export default foo = 42;", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ExportDefaultDeclaration" }] },
        { code: "export default foo += 42", output: "export default foo += 42;", ecmaFeatures: { modules: true }, errors: [{ message: "Missing semicolon.", type: "ExportDefaultDeclaration" }] },

        // exports, "never"
        { code: "export * from 'foo';", output: "export * from 'foo'", options: ["never"], ecmaFeatures: { modules: true }, errors: [{ message: "Extra semicolon.", type: "ExportAllDeclaration" }] },
        { code: "export { foo } from 'foo';", output: "export { foo } from 'foo'", options: ["never"], ecmaFeatures: { modules: true }, errors: [{ message: "Extra semicolon.", type: "ExportNamedDeclaration" }] },
        { code: "export { foo };", output: "export { foo }", options: ["never"], ecmaFeatures: { modules: true }, errors: [{ message: "Extra semicolon.", type: "ExportNamedDeclaration" }] },
        { code: "export var foo;", output: "export var foo", options: ["never"], ecmaFeatures: { modules: true }, errors: [{ message: "Extra semicolon.", type: "VariableDeclaration" }] },
        { code: "export let foo;", output: "export let foo", options: ["never"], ecmaFeatures: { blockBindings: true, modules: true }, errors: [{ message: "Extra semicolon.", type: "VariableDeclaration" }] },
        { code: "export const FOO = 42;", output: "export const FOO = 42", options: ["never"], ecmaFeatures: { blockBindings: true, modules: true }, errors: [{ message: "Extra semicolon.", type: "VariableDeclaration" }] },
        { code: "export default foo || bar;", output: "export default foo || bar", options: ["never"], ecmaFeatures: { modules: true }, errors: [{ message: "Extra semicolon.", type: "ExportDefaultDeclaration" }] },
        { code: "export default (foo) => foo.bar();", output: "export default (foo) => foo.bar()", options: ["never"], ecmaFeatures: { arrowFunctions: true, modules: true }, errors: [{ message: "Extra semicolon.", type: "ExportDefaultDeclaration" }] },
        { code: "export default foo = 42;", output: "export default foo = 42", options: ["never"], ecmaFeatures: { modules: true }, errors: [{ message: "Extra semicolon.", type: "ExportDefaultDeclaration" }] },
        { code: "export default foo += 42;", output: "export default foo += 42", options: ["never"], ecmaFeatures: { modules: true }, errors: [{ message: "Extra semicolon.", type: "ExportDefaultDeclaration" }] }
    ]
});
