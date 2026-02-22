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
				},
			],
		},
		{
			code: "function test(a, b, c, d) {}",
			errors: [
				{
					messageId: "exceed",
					data: { name: "Function 'test'", count: 4, max: 3.0 },
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
					column: 1,
					endLine: 1,
					endColumn: 14,
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
		{
			code: `function foo(this: unknown[], a, b, c) {}`,
			options: [{ max: 3, countThis: "never" }],
		},
		{
			code: `function foo(this: void, a, b, c) {}`,
			options: [{ max: 3, countThis: "except-void" }],
		},
	],
	invalid: [
		{
			code: "function foo(a, b, c, d) {}",
			errors: [{ messageId: "exceed" }],
		},
		{
			code: "const foo = function (a, b, c, d) {};",
			errors: [{ messageId: "exceed" }],
		},
		{
			code: "const foo = (a, b, c, d) => {};",
			errors: [{ messageId: "exceed" }],
		},
		{
			code: "const foo = a => {};",
			options: [{ max: 0 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `
  class Foo {
	method(this: void, a, b, c, d) {}
  }
		`,
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `
  class Foo {
	method(this: void, a) {}
  }
		`,
			options: [{ countVoidThis: true, max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `
  class Foo {
	method(this: void, a) {}
  }
		`,
			options: [{ countThis: "always", max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `function testD(this: void, a) {}`,
			options: [{ countVoidThis: true, max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `function testD(this: void, a) {}`,
			options: [{ countThis: "always", max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `const testE = function (this: void, a) {}`,
			options: [{ countThis: "always", max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `function testFunction(test: void, a: number) {}`,
			options: [{ countThis: "except-void", max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `const testE = function (this: void, a) {}`,
			options: [{ countVoidThis: true, max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `function testFunction(test: void, a: number) {}`,
			options: [{ countVoidThis: false, max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `
  class Foo {
	method(this: Foo, a, b, c) {}
  }
		`,
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `
  declare function makeDate(m: number, d: number, y: number): Date;
		`,
			options: [{ max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `
  type sum = (a: number, b: number) => number;
		`,
			options: [{ max: 1 }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `function foo(this: unknown[], a, b, c) {}`,
			options: [{ max: 3, countThis: "always" }],
			errors: [{ messageId: "exceed" }],
		},
		{
			code: `function foo(this: unknown[], a, b, c) {}`,
			options: [{ max: 3, countThis: "except-void" }],
			errors: [{ messageId: "exceed" }],
		},
	],
	fatal: [
		{
			name: "first option wrong type (string)",
			options: ["invalid"],
			error: { name: "SchemaValidationError" },
		},
		{
			name: "invalid enum value for countThis option",
			options: [{ max: 2, countThis: "invalid" }],
			error: { name: "SchemaValidationError" },
		},
	],
});
