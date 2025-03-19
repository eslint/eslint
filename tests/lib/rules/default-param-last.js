/**
 * @fileoverview Test file for default-param-last
 * @author Chiawen Chen
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/default-param-last");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const SHOULD_BE_LAST = "shouldBeLast";

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 8 },
});

const cannedError = {
	messageId: SHOULD_BE_LAST,
	type: "AssignmentPattern",
};

ruleTester.run("default-param-last", rule, {
	valid: [
		"function f() {}",
		"function f(a) {}",
		"function f(a = 5) {}",
		"function f(a, b) {}",
		"function f(a, b = 5) {}",
		"function f(a, b = 5, c = 5) {}",
		"function f(a, b = 5, ...c) {}",
		"const f = () => {}",
		"const f = (a) => {}",
		"const f = (a = 5) => {}",
		"const f = function f() {}",
		"const f = function f(a) {}",
		"const f = function f(a = 5) {}",
	],
	invalid: [
		{
			code: "function f(a = 5, b) {}",
			errors: [
				{
					messageId: SHOULD_BE_LAST,
					column: 12,
					endColumn: 17,
				},
			],
		},
		{
			code: "function f(a = 5, b = 6, c) {}",
			errors: [
				{
					messageId: SHOULD_BE_LAST,
					column: 12,
					endColumn: 17,
				},
				{
					messageId: SHOULD_BE_LAST,
					column: 19,
					endColumn: 24,
				},
			],
		},
		{
			code: "function f (a = 5, b, c = 6, d) {}",
			errors: [cannedError, cannedError],
		},
		{
			code: "function f(a = 5, b, c = 5) {}",
			errors: [
				{
					messageId: SHOULD_BE_LAST,
					column: 12,
					endColumn: 17,
				},
			],
		},
		{
			code: "const f = (a = 5, b, ...c) => {}",
			errors: [cannedError],
		},
		{
			code: "const f = function f (a, b = 5, c) {}",
			errors: [cannedError],
		},
		{
			code: "const f = (a = 5, { b }) => {}",
			errors: [cannedError],
		},
		{
			code: "const f = ({ a } = {}, b) => {}",
			errors: [cannedError],
		},
		{
			code: "const f = ({ a, b } = { a: 1, b: 2 }, c) => {}",
			errors: [cannedError],
		},
		{
			code: "const f = ([a] = [], b) => {}",
			errors: [cannedError],
		},
		{
			code: "const f = ([a, b] = [1, 2], c) => {}",
			errors: [cannedError],
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("default-param-last", rule, {
	valid: [
		"function foo() {}",
		"function foo(a: number) {}",
		"function foo(a = 1) {}",
		"function foo(a?: number) {}",
		"function foo(a: number, b: number) {}",
		"function foo(a: number, b: number, c?: number) {}",
		"function foo(a: number, b = 1) {}",
		"function foo(a: number, b = 1, c = 1) {}",
		"function foo(a: number, b = 1, c?: number) {}",
		"function foo(a: number, b?: number, c = 1) {}",
		"function foo(a: number, b = 1, ...c) {}",

		"const foo = function () {};",
		"const foo = function (a: number) {};",
		"const foo = function (a = 1) {};",
		"const foo = function (a?: number) {};",
		"const foo = function (a: number, b: number) {};",
		"const foo = function (a: number, b: number, c?: number) {};",
		"const foo = function (a: number, b = 1) {};",
		"const foo = function (a: number, b = 1, c = 1) {};",
		"const foo = function (a: number, b = 1, c?: number) {};",
		"const foo = function (a: number, b?: number, c = 1) {};",
		"const foo = function (a: number, b = 1, ...c) {};",

		"const foo = () => {};",
		"const foo = (a: number) => {};",
		"const foo = (a = 1) => {};",
		"const foo = (a?: number) => {};",
		"const foo = (a: number, b: number) => {};",
		"const foo = (a: number, b: number, c?: number) => {};",
		"const foo = (a: number, b = 1) => {};",
		"const foo = (a: number, b = 1, c = 1) => {};",
		"const foo = (a: number, b = 1, c?: number) => {};",
		"const foo = (a: number, b?: number, c = 1) => {};",
		"const foo = (a: number, b = 1, ...c) => {};",
		`
    class Foo {
      constructor(a: number, b: number, c: number) {}
    }
        `,
		`
    class Foo {
      constructor(a: number, b?: number, c = 1) {}
    }
        `,
		`
    class Foo {
      constructor(a: number, b = 1, c?: number) {}
    }
        `,
		`
    class Foo {
      constructor(
        public a: number,
        protected b: number,
        private c: number,
      ) {}
    }
        `,
		`
    class Foo {
      constructor(
        public a: number,
        protected b?: number,
        private c = 10,
      ) {}
    }
        `,
		`
    class Foo {
      constructor(
        public a: number,
        protected b = 10,
        private c?: number,
      ) {}
    }
        `,
		`
    class Foo {
      constructor(
        a: number,
        protected b?: number,
        private c = 0,
      ) {}
    }
        `,
		`
    class Foo {
      constructor(
        a: number,
        b?: number,
        private c = 0,
      ) {}
    }
        `,
		`
    class Foo {
      constructor(
        a: number,
        private b?: number,
        c = 0,
      ) {}
    }
        `,
	],
	invalid: [
		{
			code: "function foo(a = 1, b: number) {}",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
			],
		},
		{
			code: "function foo(a = 1, b = 2, c: number) {}",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 21,
					endColumn: 26,
				},
			],
		},
		{
			code: "function foo(a = 1, b: number, c = 2, d: number) {}",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 32,
					endColumn: 37,
				},
			],
		},
		{
			code: "function foo(a = 1, b: number, c = 2) {}",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
			],
		},
		{
			code: "function foo(a = 1, b: number, ...c) {}",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
			],
		},
		{
			code: "function foo(a?: number, b: number) {}",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 24,
				},
			],
		},
		{
			code: "function foo(a: number, b?: number, c: number) {}",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 25,
					endColumn: 35,
				},
			],
		},
		{
			code: "function foo(a = 1, b?: number, c: number) {}",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 21,
					endColumn: 31,
				},
			],
		},
		{
			code: "const foo = function (a = 1, b: number) {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 23,
					endColumn: 28,
				},
			],
		},
		{
			code: "const foo = function (a = 1, b = 2, c: number) {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 23,
					endColumn: 28,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 30,
					endColumn: 35,
				},
			],
		},
		{
			code: "const foo = function (a = 1, b: number, c = 2, d: number) {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 23,
					endColumn: 28,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 41,
					endColumn: 46,
				},
			],
		},
		{
			code: "const foo = function (a = 1, b: number, c = 2) {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 23,
					endColumn: 28,
				},
			],
		},
		{
			code: "const foo = function (a = 1, b: number, ...c) {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 23,
					endColumn: 28,
				},
			],
		},
		{
			code: "const foo = function (a?: number, b: number) {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 23,
					endColumn: 33,
				},
			],
		},
		{
			code: "const foo = function (a: number, b?: number, c: number) {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 34,
					endColumn: 44,
				},
			],
		},
		{
			code: "const foo = function (a = 1, b?: number, c: number) {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 23,
					endColumn: 28,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 30,
					endColumn: 40,
				},
			],
		},
		{
			code: "const foo = (a = 1, b: number) => {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
			],
		},
		{
			code: "const foo = (a = 1, b = 2, c: number) => {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 21,
					endColumn: 26,
				},
			],
		},
		{
			code: "const foo = (a = 1, b: number, c = 2, d: number) => {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 32,
					endColumn: 37,
				},
			],
		},
		{
			code: "const foo = (a = 1, b: number, c = 2) => {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
			],
		},
		{
			code: "const foo = (a = 1, b: number, ...c) => {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
			],
		},
		{
			code: "const foo = (a?: number, b: number) => {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 24,
				},
			],
		},
		{
			code: "const foo = (a: number, b?: number, c: number) => {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 25,
					endColumn: 35,
				},
			],
		},
		{
			code: "const foo = (a = 1, b?: number, c: number) => {};",
			errors: [
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 14,
					endColumn: 19,
				},
				{
					messageId: "shouldBeLast",
					line: 1,
					column: 21,
					endColumn: 31,
				},
			],
		},
		{
			code: `
    class Foo {
      constructor(
        public a: number,
        protected b?: number,
        private c: number,
      ) {}
    }
          `,
			errors: [
				{
					messageId: "shouldBeLast",
					line: 5,
					column: 9,
					endColumn: 29,
				},
			],
		},
		{
			code: `
    class Foo {
      constructor(
        public a: number,
        protected b = 0,
        private c: number,
      ) {}
    }
          `,
			errors: [
				{
					messageId: "shouldBeLast",
					line: 5,
					column: 9,
					endColumn: 24,
				},
			],
		},
		{
			code: `
    class Foo {
      constructor(
        public a?: number,
        private b: number,
      ) {}
    }
          `,
			errors: [
				{
					messageId: "shouldBeLast",
					line: 4,
					column: 9,
					endColumn: 26,
				},
			],
		},
		{
			code: `
    class Foo {
      constructor(
        public a = 0,
        private b: number,
      ) {}
    }
          `,
			errors: [
				{
					messageId: "shouldBeLast",
					line: 4,
					column: 9,
					endColumn: 21,
				},
			],
		},
		{
			code: `
    class Foo {
      constructor(a = 0, b: number) {}
    }
          `,
			errors: [
				{
					messageId: "shouldBeLast",
					line: 3,
					column: 19,
					endColumn: 24,
				},
			],
		},
		{
			code: `
    class Foo {
      constructor(a?: number, b: number) {}
    }
          `,
			errors: [
				{
					messageId: "shouldBeLast",
					line: 3,
					column: 19,
					endColumn: 29,
				},
			],
		},
	],
});
