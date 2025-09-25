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
		{
			code: "foo",
			options: [{ globals: ["bar"] }],
		},
		{
			code: "const foo = 1",
			options: [{ globals: ["foo"] }],
		},
		{
			code: "event",
			options: [{ globals: ["bar"] }],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "import foo from 'bar';",
			options: [{ globals: ["foo"] }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo() {}",
			options: [{ globals: ["foo"] }],
		},
		{
			code: "function fn() { let foo; }",
			options: [{ globals: ["foo"] }],
		},
		{
			code: "foo.bar",
			options: [{ globals: ["bar"] }],
		},
		{
			code: "foo",
			options: [
				{ globals: [{ name: "bar", message: "Use baz instead." }] },
			],
		},
		{
			code: "window.foo()",
			options: [{ globals: ["foo"] }],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "self.foo()",
			options: [{ globals: ["foo"] }],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "globalThis.foo()",
			options: [{ globals: ["foo"] }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "myGlobal.foo()",
			options: [
				{
					globals: ["foo"],
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: { globals: { myGlobal: "readonly" } },
		},
		{
			code: "window.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
				},
			],
		},
		{
			code: "self.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
				},
			],
		},
		{
			code: "globalThis.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "myGlobal.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
		},
		{
			code: "otherGlobal.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: { globals: { otherGlobal: "readonly" } },
		},
		{
			code: "foo.window.bar()",
			options: [
				{
					globals: ["bar"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "foo.self.bar()",
			options: [
				{
					globals: ["bar"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "foo.globalThis.bar()",
			options: [
				{
					globals: ["bar"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.myGlobal.bar()",
			options: [
				{
					globals: ["bar"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: { globals: { myGlobal: "readonly" } },
		},
		{
			code: "let window; window.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "let self; self.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { globals: globals.browser },
		},
		{
			code: "let globalThis; globalThis.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let myGlobal; myGlobal.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: { globals: { myGlobal: "readonly" } },
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
				},
			],
		},
		{
			code: "foo",
			options: [{ globals: ["foo"] }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ globals: ["foo"] }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ globals: ["foo"] }],
			languageOptions: {
				globals: { foo: "readonly" },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "event",
			options: [{ globals: ["foo", "event"] }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
				},
			],
		},
		{
			code: "foo",
			options: [{ globals: ["foo"] }],
			languageOptions: {
				globals: { foo: "readonly" },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "foo()",
			options: [{ globals: ["foo"] }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "foo.bar()",
			options: [{ globals: ["foo"] }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "foo",
			options: [{ globals: [{ name: "foo" }] }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ globals: [{ name: "foo" }] }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ globals: [{ name: "foo" }] }],
			languageOptions: {
				globals: { foo: "readonly" },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "event",
			options: [{ globals: ["foo", { name: "event" }] }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
				},
			],
		},
		{
			code: "foo",
			options: [{ globals: [{ name: "foo" }] }],
			languageOptions: {
				globals: { foo: "readonly" },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "foo()",
			options: [{ globals: [{ name: "foo" }] }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "foo.bar()",
			options: [{ globals: [{ name: "foo" }] }],
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "foo",
			options: [{ globals: [{ name: "foo", message: customMessage }] }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ globals: [{ name: "foo", message: customMessage }] }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
				},
			],
		},
		{
			code: "function fn() { foo; }",
			options: [{ globals: [{ name: "foo", message: customMessage }] }],
			languageOptions: {
				globals: { foo: "readonly" },
			},
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
				},
			],
		},
		{
			code: "event",
			options: [
				{
					globals: [
						"foo",
						{
							name: "event",
							message: "Use local event parameter.",
						},
					],
				},
			],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "customMessage",
					data: {
						name: "event",
						customMessage: "Use local event parameter.",
					},
				},
			],
		},
		{
			code: "foo",
			options: [{ globals: [{ name: "foo", message: customMessage }] }],
			languageOptions: {
				globals: { foo: false },
			},
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
				},
			],
		},
		{
			code: "foo()",
			options: [{ globals: [{ name: "foo", message: customMessage }] }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
				},
			],
		},
		{
			code: "foo.bar()",
			options: [{ globals: [{ name: "foo", message: customMessage }] }],
			errors: [
				{
					messageId: "customMessage",
					data: { name: "foo", customMessage },
				},
			],
		},
		{
			code: "var foo = obj => hasOwnProperty(obj, 'name');",
			options: [{ globals: ["hasOwnProperty"] }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "hasOwnProperty" },
				},
			],
		},
		{
			code: "window.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "self.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "window.window.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "self.self.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "globalThis.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "globalThis.globalThis.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "myGlobal.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: { globals: { myGlobal: "readonly" } },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "myGlobal.myGlobal.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: { globals: { myGlobal: "readonly" } },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: 'window["foo"]',
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: 'self["foo"]',
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: 'globalThis["foo"]',
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: 'myGlobal["foo"]',
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: { globals: { myGlobal: "readonly" } },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "window?.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "self?.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "window.foo(); myGlobal.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: {
				globals: { ...globals.browser, myGlobal: "readonly" },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "myGlobal.foo(); myOtherGlobal.bar()",
			options: [
				{
					globals: ["foo", "bar"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal", "myOtherGlobal"],
				},
			],
			languageOptions: {
				globals: { myGlobal: "readonly", myOtherGlobal: "readonly" },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
				{
					messageId: "defaultMessage",
					data: { name: "bar" },
				},
			],
		},
		{
			code: "foo(); window.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "foo(); self.foo()",
			options: [{ globals: ["foo"], checkGlobalObject: true }],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "foo(); myGlobal.foo()",
			options: [
				{
					globals: ["foo"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: {
				globals: { myGlobal: "readonly" },
			},
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
				{
					messageId: "defaultMessage",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "function onClick(event) { console.log(event); console.log(window.event); }",
			options: [
				{
					globals: ["event"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
					line: 1,
					column: 66,
					endLine: 1,
					endColumn: 71,
				},
			],
		},
		{
			code: "function onClick(event) { console.log(event); console.log(self.event); }",
			options: [
				{
					globals: ["event"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { globals: globals.browser },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
					line: 1,
					column: 64,
					endLine: 1,
					endColumn: 69,
				},
			],
		},
		{
			code: "function onClick(event) { console.log(event); console.log(globalThis.event); }",
			options: [
				{
					globals: ["event"],
					checkGlobalObject: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
					line: 1,
					column: 70,
					endLine: 1,
					endColumn: 75,
				},
			],
		},
		{
			code: "function onClick(event) { console.log(event); console.log(myGlobal.event); }",
			options: [
				{
					globals: ["event"],
					checkGlobalObject: true,
					globalObjects: ["myGlobal"],
				},
			],
			languageOptions: { globals: { myGlobal: "readonly" } },
			errors: [
				{
					messageId: "defaultMessage",
					data: { name: "event" },
					line: 1,
					column: 68,
					endLine: 1,
					endColumn: 73,
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
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
	],
});
