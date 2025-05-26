/**
 * @fileoverview Tests for func-style rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-style"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("func-style", rule, {
	valid: [
		{
			code: "function foo(){}\n function bar(){}",
			options: ["declaration"],
		},
		{
			code: "foo.bar = function(){};",
			options: ["declaration"],
		},
		{
			code: "(function() { /* code */ }());",
			options: ["declaration"],
		},
		{
			code: "var module = (function() { return {}; }());",
			options: ["declaration"],
		},
		{
			code: "var object = { foo: function(){} };",
			options: ["declaration"],
		},
		{
			code: "Array.prototype.foo = function(){};",
			options: ["declaration"],
		},
		{
			code: "foo.bar = function(){};",
			options: ["expression"],
		},
		{
			code: "var foo = function(){};\n var bar = function(){};",
			options: ["expression"],
		},
		{
			code: "var foo = () => {};\n var bar = () => {}",
			options: ["expression"],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/3819
		{
			code: "var foo = function() { this; }.bind(this);",
			options: ["declaration"],
		},
		{
			code: "var foo = () => { this; };",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C extends D { foo() { var bar = () => { super.baz(); }; } }",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var obj = { foo() { var bar = () => super.baz; } }",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export default function () {};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = () => {};",
			options: ["declaration", { allowArrowFunctions: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = () => { function foo() { this; } };",
			options: ["declaration", { allowArrowFunctions: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = () => ({ bar() { super.baz(); } });",
			options: ["declaration", { allowArrowFunctions: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export function foo() {};",
			options: ["declaration"],
		},
		{
			code: "export function foo() {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
		},
		{
			code: "export function foo() {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
		},
		{
			code: "export function foo() {};",
			options: ["expression", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export function foo() {};",
			options: ["declaration", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = function(){};",
			options: ["expression"],
		},
		{
			code: "export var foo = function(){};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = function(){};",
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = function(){};",
			options: ["declaration", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = function(){};",
			options: ["expression", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = () => {};",
			options: ["declaration", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = () => {};",
			options: ["expression", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"declaration",
				{
					allowArrowFunctions: true,
					overrides: { namedExports: "expression" },
				},
			],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"expression",
				{
					allowArrowFunctions: true,
					overrides: { namedExports: "expression" },
				},
			],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"declaration",
				{
					allowArrowFunctions: true,
					overrides: { namedExports: "ignore" },
				},
			],
		},
		{
			code: "$1: function $2() { }",
			options: ["declaration"],
			languageOptions: { sourceType: "script" },
		},
		{
			code: "switch ($0) { case $1: function $2() { } }",
			options: ["declaration"],
		},
	],

	invalid: [
		{
			code: "var foo = function(){};",
			options: ["declaration"],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "var foo = () => {};",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "var foo = () => { function foo() { this; } };",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "var foo = () => ({ bar() { super.baz(); } });",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo(){}",
			options: ["expression"],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "export function foo(){}",
			options: ["expression"],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "export function foo() {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "export function foo() {};",
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "export var foo = function(){};",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export var foo = function(){};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export var foo = function(){};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export var foo = () => {};",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export var b = () => {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export var c = () => {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo() {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "var foo = function() {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "var foo = () => {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "$1: function $2() { }",
			languageOptions: { sourceType: "script" },
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "if (foo) function bar() {}",
			languageOptions: { sourceType: "script" },
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("func-style", rule, {
	valid: [
		{
			code: "function foo(): void {}\n function bar(): void {}",
			options: ["declaration"],
		},
		{
			code: "(function(): void { /* code */ }());",
			options: ["declaration"],
		},
		{
			code: "const module = (function(): { [key: string]: any } { return {}; }());",
			options: ["declaration"],
		},
		{
			code: "const object: { foo: () => void } = { foo: function(): void {} };",
			options: ["declaration"],
		},
		{
			code: "Array.prototype.foo = function(): void {};",
			options: ["declaration"],
		},
		{
			code: "const foo: () => void = function(): void {};\n const bar: () => void = function(): void {};",
			options: ["expression"],
		},
		{
			code: "const foo: () => void = (): void => {};\n const bar: () => void = (): void => {}",
			options: ["expression"],
		},
		{
			code: "const foo: () => void = function(): void { this; }.bind(this);",
			options: ["declaration"],
		},
		{
			code: "const foo: () => void = (): void => { this; };",
			options: ["declaration"],
		},
		{
			code: "class C extends D { foo(): void { const bar: () => void = (): void => { super.baz(); }; } }",
			options: ["declaration"],
		},
		{
			code: "const obj: { foo(): void } = { foo(): void { const bar: () => void = (): void => super.baz; } }",
			options: ["declaration"],
		},
		{
			code: "const foo: () => void = (): void => {};",
			options: ["declaration", { allowArrowFunctions: true }],
		},
		{
			code: "const foo: () => void = (): void => { function foo(): void { this; } };",
			options: ["declaration", { allowArrowFunctions: true }],
		},
		{
			code: "const foo: () => { bar(): void } = (): { bar(): void } => ({ bar(): void { super.baz(); } });",
			options: ["declaration", { allowArrowFunctions: true }],
		},
		{
			code: "export function foo(): void {};",
			options: ["declaration"],
		},
		{
			code: "export function foo(): void {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
		},
		{
			code: "export function foo(): void {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
		},
		{
			code: "export function foo(): void {};",
			options: ["expression", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export function foo(): void {};",
			options: ["declaration", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export const foo: () => void = function(): void {};",
			options: ["expression"],
		},
		{
			code: "export const foo: () => void = function(): void {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export const foo: () => void = function(): void {};",
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export const foo: () => void = function(): void {};",
			options: ["declaration", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export const foo: () => void = function(): void {};",
			options: ["expression", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "$1: function $2(): void { }",
			options: ["declaration"],
		},
		{
			code: "switch ($0) { case $1: function $2(): void { } }",
			options: ["declaration"],
		},
		`
		function test(a: string): string;
		function test(a: number): number;
		function test(a: unknown) {
		  return a;
		}
		`,
		`
		export function test(a: string): string;
		export function test(a: number): number;
		export function test(a: unknown) {
		  return a;
		}
		`,
		{
			code: `
			export function test(a: string): string;
		    export function test(a: number): number;
		    export function test(a: unknown) {
		      return a;
		    }
			`,
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
		},
		`
		switch ($0) {
			case $1:
			function test(a: string): string;
			function test(a: number): number;
			function test(a: unknown) {
			return a;
			}
		}
		`,
		`
		switch ($0) {
			case $1:
			function test(a: string): string;
			break;
			case $2:
			function test(a: unknown) {
			return a;
			}
		}
		`,
	],
	invalid: [
		{
			code: "const foo: () => void = function(): void {};",
			options: ["declaration"],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "const foo: () => void = (): void => {};",
			options: ["declaration"],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "const foo: () => void = (): void => { function foo(): void { this; } };",
			options: ["declaration"],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "const foo: () => { bar(): void } = (): { bar(): void } => ({ bar(): void { super.baz(); } });",
			options: ["declaration"],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo(): void {}",
			options: ["expression"],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "export function foo(): void {}",
			options: ["expression"],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "export function foo(): void {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "export function foo(): void {};",
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "export const foo: () => void = function(): void {};",
			options: ["declaration"],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export const foo: () => void = function(): void {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export const foo: () => void = function(): void {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export const foo: () => void = (): void => {};",
			options: ["declaration"],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export const b: () => void = (): void => {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "export const c: () => void = (): void => {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo(): void {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "const foo: () => void = function(): void {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "const foo: () => void = (): void => {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
			errors: [
				{
					messageId: "declaration",
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "$1: function $2(): void { }",
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: "if (foo) function bar(): string {}",
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: `
			function test1(a: string): string;
			function test2(a: number): number;
			function test3(a: unknown) {
			  return a;
			}`,
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: `
			export function test1(a: string): string;
			export function test2(a: number): number;
			export function test3(a: unknown) {
			  return a;
			}`,
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: `
			export function test1(a: string): string;
		    export function test2(a: number): number;
		    export function test3(a: unknown) {
		      return a;
		    }
			`,
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: `
			switch ($0) {
				case $1:
				function test1(a: string): string;
				function test2(a: number): number;
				function test3(a: unknown) {
					return a;
				}
			}
			`,
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
		{
			code: `
			switch ($0) {
				case $1:
				function test1(a: string): string;
				break;
				case $2:
				function test2(a: unknown) {
				return a;
				}
			}
			`,
			errors: [
				{
					messageId: "expression",
					type: "FunctionDeclaration",
				},
			],
		},
	],
});
