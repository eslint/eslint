/**
 * @fileoverview Tests for max-params rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-params"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("max-params", rule, {
	valid: [
		"function test(d, e, f) {}",
		{ code: "var test = function(a, b, c) {};", options: [3] },
		{
			code: "var test = (a, b, c) => {};",
			options: [3],
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var test = function test(a, b, c) {};", options: [3] },

		// object property options
		{ code: "var test = function(a, b, c) {};", options: [{ max: 3 }] },
	],
	invalid: [
		{
			code: "function test(a, b, c) {}",
			options: [2],
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function 'test'", count: 3, max: 2.0 },
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "function test(a, b, c, d) {}",
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function 'test'", count: 4, max: 3.0 },
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "var test = function(a, b, c, d) {};",
			options: [3],
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function", count: 4, max: 3.0 },
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "var test = (a, b, c, d) => {};",
			options: [3],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "exceed",
					data: { name: "Arrow function", count: 4, max: 3.0 },
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "(function(a, b, c, d) {});",
			options: [3],
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function", count: 4, max: 3.0 },
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "var test = function test(a, b, c) {};",
			options: [1],
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function 'test'", count: 3, max: 1.0 },
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 34,
				},
			],
		},

		// object property options
		{
			code: "function test(a, b, c) {}",
			options: [{ max: 2 }],
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function 'test'", count: 3, max: 2.0 },
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "function test(a, b, c, d) {}",
			options: [{}],
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function 'test'", count: 4, max: 3 },
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "function test(a) {}",
			options: [{ max: 0 }],
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function 'test'", count: 1, max: 0 },
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 17,
				},
			],
		},

		// Error location should not cover the entire function; just the name.
		{
			code: `function test(a, b, c) {
              // Just to make it longer
            }`,
			options: [{ max: 2 }],
			errors: [
				{
					messageId: "exceed",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
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

ruleTesterTypeScript.run("max-params", rule, {
	valid: [
		"function foo() {}",
		"const foo = function () {};",
		"const foo = () => {};",
		"function foo(a) {}",
		`
  class Foo {
	constructor(a) {}
  }
	  `,
		`
  class Foo {
	method(this: void, a, b, c) {}
  }
	  `,
		`
  class Foo {
	method(this: Foo, a, b) {}
  }
	  `,
		{
			code: "function foo(a, b, c, d) {}",
			options: [{ max: 4 }],
		},
		{
			code: "function foo(a, b, c, d) {}",
			options: [{ maximum: 4 }],
		},
		{
			code: `
  class Foo {
	method(this: void) {}
  }
		`,
			options: [{ max: 0 }],
		},
		{
			code: `
  class Foo {
	method(this: void, a) {}
  }
		`,
			options: [{ max: 1 }],
		},
		{
			code: `
  class Foo {
	method(this: void, a) {}
  }
		`,
			options: [{ countVoidThis: true, max: 2 }],
		},
		{
			code: `function testD(this: void, a) {}`,
			options: [{ max: 1 }],
		},
		{
			code: `function testD(this: void, a) {}`,
			options: [{ countVoidThis: true, max: 2 }],
		},
		{
			code: `const testE = function (this: void, a) {}`,
			options: [{ max: 1 }],
		},
		{
			code: `const testE = function (this: void, a) {}`,
			options: [{ countVoidThis: true, max: 2 }],
		},
		{
			code: `
  declare function makeDate(m: number, d: number, y: number): Date;
		`,
			options: [{ max: 3 }],
		},
		{
			code: `
  type sum = (a: number, b: number) => number;
		`,
			options: [{ max: 2 }],
		},
	],
	invalid: [
		{
			code: "function foo(a, b, c, d) {}",
			errors: [
				{
					messageId: "exceed",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "const foo = function (a, b, c, d) {};",
			errors: [
				{
					messageId: "exceed",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 34,
				},
			],
		},
		{
			code: "const foo = (a, b, c, d) => {};",
			errors: [
				{
					messageId: "exceed",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "const foo = a => {};",
			options: [{ max: 0 }],
			errors: [
				{
					messageId: "exceed",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: `
  class Foo {
	method(this: void, a, b, c, d) {}
  }
		`,
			errors: [
				{
					messageId: "exceed",
					line: 3,
					column: 8,
					endLine: 3,
					endColumn: 32,
				},
			],
		},
		{
			code: `
  class Foo {
	method(this: void, a) {}
  }
		`,
			options: [{ countVoidThis: true, max: 1 }],
			errors: [
				{
					messageId: "exceed",
					line: 3,
					column: 8,
					endLine: 3,
					endColumn: 23,
				},
			],
		},
		{
			code: `function testD(this: void, a) {}`,
			options: [{ countVoidThis: true, max: 1 }],
			errors: [
				{
					messageId: "exceed",
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 30,
				},
			],
		},
		{
			code: `const testE = function (this: void, a) {}`,
			options: [{ countVoidThis: true, max: 1 }],
			errors: [
				{
					messageId: "exceed",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: `function testFunction(test: void, a: number) {}`,
			options: [{ countVoidThis: false, max: 1 }],
			errors: [
				{
					messageId: "exceed",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
		{
			code: `
  class Foo {
	method(this: Foo, a, b, c) {}
  }
		`,
			errors: [
				{
					messageId: "exceed",
					line: 3,
					column: 8,
					endLine: 3,
					endColumn: 28,
				},
			],
		},
		{
			code: `
  declare function makeDate(m: number, d: number, y: number): Date;
		`,
			options: [{ max: 1 }],
			errors: [
				{
					messageId: "exceed",
					line: 2,
					column: 28,
					endLine: 2,
					endColumn: 61,
				},
			],
		},
		{
			code: `
  type sum = (a: number, b: number) => number;
		`,
			options: [{ max: 1 }],
			errors: [
				{
					messageId: "exceed",
					line: 2,
					column: 14,
					endLine: 2,
					endColumn: 36,
				},
			],
		},
	],
});
