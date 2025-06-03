/**
 * @fileoverview Tests for no-restricted-globals.
 * @author Benoît Zugmeyer
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-globals"),
	RuleTester = require("../../../lib/rule-tester/rule-tester"),
	globals = require("globals");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const customMessage = "Use bar instead.";

ruleTester.run("no-restricted-globals", rule, {
	valid: [
		"foo",
		{
			code: "foo",
			options: ["bar"],
		},
		{
			code: "var foo = 1;",
			options: ["foo"],
		},
		{
			code: "event",
			options: ["bar"],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "import foo from 'bar';",
			options: ["foo"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo() {}",
			options: ["foo"],
		},
		{
			code: "function fn() { var foo; }",
			options: ["foo"],
		},
		{
			code: "foo.bar",
			options: ["bar"],
		},
		{
			code: "foo",
			options: [{ name: "bar", message: "Use baz instead." }],
		},
	],
	invalid: [
		{
			code: "foo",
			options: ["foo"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: ["foo"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: ["foo"],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "event",
			options: ["foo", "event"],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: ["foo"],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo()",
			options: ["foo"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo.bar()",
			options: ["foo"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: [{ name: "foo" }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ name: "foo" }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ name: "foo" }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "event",
			options: ["foo", { name: "event" }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: [{ name: "foo" }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo()",
			options: [{ name: "foo" }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo.bar()",
			options: [{ name: "foo" }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: [{ name: "foo", message: customMessage }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ name: "foo", message: customMessage }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ name: "foo", message: customMessage }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "event",
			options: [
				"foo",
				{ name: "event", message: "Use local event parameter." },
			],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "customMessage",
					data: {
						name: "event",
						customMessage: "Use local event parameter.",
					},
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: [{ name: "foo", message: customMessage }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo()",
			options: [{ name: "foo", message: customMessage }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo.bar()",
			options: [{ name: "foo", message: customMessage }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "var foo = obj => hasOwnProperty(obj, 'name');",
			options: ["hasOwnProperty"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "hasOwnProperty" },
					type: "Identifier",
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

ruleTesterTypeScript.run("no-restricted-globals", rule, {
	valid: [
		"foo",
		{
			code: "foo",
			options: ["bar"],
		},
		{
			code: "const foo: number = 1;",
			options: ["foo"],
		},
		{
			code: "event",
			options: ["bar"],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "import foo from 'bar';",
			options: ["foo"],
		},
		{
			code: "function foo(): void {}",
			options: ["foo"],
		},
		{
			code: "function fn(): void { let foo; }",
			options: ["foo"],
		},
		{
			code: "foo.bar",
			options: ["bar"],
		},
		{
			code: "foo",
			options: [{ name: "bar", message: "Use baz instead." }],
		},
		{
			code: `
			export default class Test {
				private status: string;
				getStatus() {
					return this.status;
				}
			}`,
			options: ["status"],
		},
		{
			code: "type Handler = (event: string) => any",
			options: ["event"],
		},
		...[
			"bigint",
			"boolean",
			"never",
			"null",
			"number",
			"object",
			"string",
			"symbol",
			"undefined",
			"unknown",
			"void",
			"[]",
			"{}",
		].map(typeExpression => ({
			code: `let value: ${typeExpression}`,
			options: [`${typeExpression}`],
		})),
		...["Test", "Test[]", "[Test]"].map(typeExpression => ({
			code: `let value: ${typeExpression}`,
			options: ["Test"],
		})),
		{
			code: "let b: { c: Test }",
			options: ["Test"],
		},
		{
			code: "function foo(param: Test) {}",
			options: ["Test"],
		},
		{
			code: "1 as Test",
			options: ["Test"],
		},
		{
			code: "class Derived implements Test {}",
			options: ["Test"],
		},
		{
			code: "class Derived implements Test1, Test2 {}",
			options: ["Test1", "Test2"],
		},
		{
			code: "interface Derived extends Test {}",
			options: ["Test"],
		},
		{
			code: "type Intersection = Test & {}",
			options: ["Test"],
		},
		{
			code: "type Union = Test | {}",
			options: ["Test"],
		},
		{
			code: "let value: NS.Test",
			options: ["NS"],
		},
		{
			code: "let value: NS.Test",
			options: ["Test"],
		},
		{
			code: "let value: NS.Test",
			options: ["NS.Test"],
		},
		{
			code: "let value: typeof Test",
			options: ["Test"],
		},
		{
			code: "let value: Type<Test>",
			options: ["Type", "Test"],
		},
		{
			code: "type Intersection = Test<any>",
			options: ["Test", "any"],
		},
		{
			code: "type Intersection = Test<A, B>",
			options: ["Test", "A", "B"],
		},
	],
	invalid: [
		{
			code: "foo",
			options: ["foo"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn(): void { foo; }",
			options: ["foo"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn(): void { foo; }",
			options: ["foo"],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "event",
			options: ["foo", "event"],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: ["foo"],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo()",
			options: ["foo"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo.bar()",
			options: ["foo"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: [{ name: "foo" }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn(): void { foo; }",
			options: [{ name: "foo" }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn(): void { foo; }",
			options: [{ name: "foo" }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "event",
			options: ["foo", { name: "event" }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: [{ name: "foo" }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo()",
			options: [{ name: "foo" }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo.bar()",
			options: [{ name: "foo" }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: [{ name: "foo", message: customMessage }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn(): void { foo; }",
			options: [{ name: "foo", message: customMessage }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "function fn(): void { foo; }",
			options: [{ name: "foo", message: customMessage }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "event",
			options: [
				"foo",
				{ name: "event", message: "Use local event parameter." },
			],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "customMessage",
					data: {
						name: "event",
						customMessage: "Use local event parameter.",
					},
					type: "Identifier",
				},
			],
		},
		{
			code: "foo",
			options: [{ name: "foo", message: customMessage }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo()",
			options: [{ name: "foo", message: customMessage }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "foo.bar()",
			options: [{ name: "foo", message: customMessage }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
					type: "Identifier",
				},
			],
		},
		{
			code: "const foo = obj => hasOwnProperty(obj, 'name');",
			options: ["hasOwnProperty"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "hasOwnProperty" },
					type: "Identifier",
				},
			],
		},
		{
			code: "const x: Promise<any> = Promise.resolve();",
			options: ["Promise"],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "Promise" },
					type: "Identifier",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
	],
});
