/**
 * @fileoverview Tests for no-dupe-class-members rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-dupe-class-members");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } });

ruleTester.run("no-dupe-class-members", rule, {
	valid: [
		"class A { foo() {} bar() {} }",
		"class A { static foo() {} foo() {} }",
		"class A { get foo() {} set foo(value) {} }",
		"class A { static foo() {} get foo() {} set foo(value) {} }",
		"class A { foo() { } } class B { foo() { } }",
		"class A { [foo]() {} foo() {} }",
		"class A { 'foo'() {} 'bar'() {} baz() {} }",
		"class A { *'foo'() {} *'bar'() {} *baz() {} }",
		"class A { get 'foo'() {} get 'bar'() {} get baz() {} }",
		"class A { 1() {} 2() {} }",
		"class A { ['foo']() {} ['bar']() {} }",
		"class A { [`foo`]() {} [`bar`]() {} }",
		"class A { [12]() {} [123]() {} }",
		"class A { [1.0]() {} ['1.0']() {} }",
		"class A { [0x1]() {} [`0x1`]() {} }",
		"class A { [null]() {} ['']() {} }",
		"class A { get ['foo']() {} set ['foo'](value) {} }",
		"class A { ['foo']() {} static ['foo']() {} }",

		// computed "constructor" key doesn't create constructor
		"class A { ['constructor']() {} constructor() {} }",
		"class A { 'constructor'() {} [`constructor`]() {} }",
		"class A { constructor() {} get [`constructor`]() {} }",
		"class A { 'constructor'() {} set ['constructor'](value) {} }",

		// not assumed to be statically-known values
		"class A { ['foo' + '']() {} ['foo']() {} }",
		"class A { [`foo${''}`]() {} [`foo`]() {} }",
		"class A { [-1]() {} ['-1']() {} }",

		// not supported by this rule
		"class A { [foo]() {} [foo]() {} }",

		// private and public
		"class A { foo; static foo; }",
		"class A { foo; #foo; }",
		"class A { '#foo'; #foo; }",
	],
	invalid: [
		{
			code: "class A { foo() {} foo() {} }",
			errors: [
				{
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 23,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "!class A { foo() {} foo() {} };",
			errors: [
				{
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 24,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { 'foo'() {} 'foo'() {} }",
			errors: [
				{
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 27,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { 10() {} 1e1() {} }",
			errors: [
				{
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 22,
					messageId: "unexpected",
					data: { name: "10" },
				},
			],
		},
		{
			code: "class A { ['foo']() {} ['foo']() {} }",
			errors: [
				{
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 30,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { static ['foo']() {} static foo() {} }",
			errors: [
				{
					line: 1,
					column: 38,
					endLine: 1,
					endColumn: 41,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { set 'foo'(value) {} set ['foo'](val) {} }",
			errors: [
				{
					line: 1,
					column: 36,
					endLine: 1,
					endColumn: 41,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { ''() {} ['']() {} }",
			errors: [
				{
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 22,
					messageId: "unexpected",
					data: { name: "" },
				},
			],
		},
		{
			code: "class A { [`foo`]() {} [`foo`]() {} }",
			errors: [
				{
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 30,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { static get [`foo`]() {} static get ['foo']() {} }",
			errors: [
				{
					line: 1,
					column: 47,
					endLine: 1,
					endColumn: 52,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { foo() {} [`foo`]() {} }",
			errors: [
				{
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 26,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { get [`foo`]() {} 'foo'() {} }",
			errors: [
				{
					line: 1,
					column: 28,
					endLine: 1,
					endColumn: 33,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { static 'foo'() {} static [`foo`]() {} }",
			errors: [
				{
					line: 1,
					column: 37,
					endLine: 1,
					endColumn: 42,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { ['constructor']() {} ['constructor']() {} }",
			errors: [
				{
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 46,
					messageId: "unexpected",
					data: { name: "constructor" },
				},
			],
		},
		{
			code: "class A { static [`constructor`]() {} static constructor() {} }",
			errors: [
				{
					line: 1,
					column: 46,
					endLine: 1,
					endColumn: 57,
					messageId: "unexpected",
					data: { name: "constructor" },
				},
			],
		},
		{
			code: "class A { static constructor() {} static 'constructor'() {} }",
			errors: [
				{
					line: 1,
					column: 42,
					endLine: 1,
					endColumn: 55,
					messageId: "unexpected",
					data: { name: "constructor" },
				},
			],
		},
		{
			code: "class A { [123]() {} [123]() {} }",
			errors: [
				{
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
					messageId: "unexpected",
					data: { name: "123" },
				},
			],
		},
		{
			code: "class A { [0x10]() {} 16() {} }",
			errors: [
				{
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 25,
					messageId: "unexpected",
					data: { name: "16" },
				},
			],
		},
		{
			code: "class A { [100]() {} [1e2]() {} }",
			errors: [
				{
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
					messageId: "unexpected",
					data: { name: "100" },
				},
			],
		},
		{
			code: "class A { [123.00]() {} [`123`]() {} }",
			errors: [
				{
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 31,
					messageId: "unexpected",
					data: { name: "123" },
				},
			],
		},
		{
			code: "class A { static '65'() {} static [0o101]() {} }",
			errors: [
				{
					line: 1,
					column: 36,
					endLine: 1,
					endColumn: 41,
					messageId: "unexpected",
					data: { name: "65" },
				},
			],
		},
		{
			code: "class A { [123n]() {} 123() {} }",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 26,
					messageId: "unexpected",
					data: { name: "123" },
				},
			],
		},
		{
			code: "class A { [null]() {} 'null'() {} }",
			errors: [
				{
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 29,
					messageId: "unexpected",
					data: { name: "null" },
				},
			],
		},
		{
			code: "class A { foo() {} foo() {} foo() {} }",
			errors: [
				{
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 23,
					messageId: "unexpected",
					data: { name: "foo" },
				},
				{
					line: 1,
					column: 29,
					endLine: 1,
					endColumn: 32,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { static foo() {} static foo() {} }",
			errors: [
				{
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 37,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { foo() {} get foo() {} }",
			errors: [
				{
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 27,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { set foo(value) {} foo() {} }",
			errors: [
				{
					line: 1,
					column: 29,
					endLine: 1,
					endColumn: 32,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},
		{
			code: "class A { foo; foo; }",
			errors: [
				{
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 19,
					messageId: "unexpected",
					data: { name: "foo" },
				},
			],
		},

		/*
		 * This is syntax error
		 * { code: "class A { #foo; #foo; }" }
		 */
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("no-dupe-class-members", rule, {
	valid: [
		`
		  class A {
			foo() {}
			bar() {}
		  }
			  `,
		`
		  class A {
			static foo() {}
			foo() {}
		  }
			  `,
		`
		  class A {
			get foo() {}
			set foo(value) {}
		  }
			  `,
		`
		  class A {
			static foo() {}
			get foo() {}
			set foo(value) {}
		  }
			  `,
		`
		  class A {
			foo() {}
		  }
		  class B {
			foo() {}
		  }
			  `,
		`
		  class A {
			[foo]() {}
			foo() {}
		  }
			  `,
		`
		  class A {
			foo() {}
			bar() {}
			baz() {}
		  }
			  `,
		`
		  class A {
			*foo() {}
			*bar() {}
			*baz() {}
		  }
			  `,
		`
		  class A {
			get foo() {}
			get bar() {}
			get baz() {}
		  }
			  `,
		`
		  class A {
			1() {}
			2() {}
		  }
			  `,
		`
		class Foo {
		  foo(a: string): string;
		  foo(a: number): number;
		  foo(a: any): any {}
		}
	  `,
	],
	invalid: [
		{
			code: `
  class A {
	foo() {}
    foo() {}
  }
		`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 5,
					endLine: 4,
					endColumn: 8,
				},
			],
		},
		{
			code: `
		  !class A {
			foo() {}
			foo() {}
		  };
				`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 4,
					endLine: 4,
					endColumn: 7,
				},
			],
		},
		{
			code: `
		  class A {
			'foo'() {}
			'foo'() {}
		  }
				`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 4,
					endLine: 4,
					endColumn: 9,
				},
			],
		},
		{
			code: `
		  class A {
			10() {}
			1e1() {}
		  }
				`,
			errors: [
				{
					data: { name: "10" },
					messageId: "unexpected",
					line: 4,
					column: 4,
					endLine: 4,
					endColumn: 7,
				},
			],
		},
		{
			code: `
		  class A {
			foo() {}
			foo() {}
			foo() {}
		  }
				`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 4,
					endLine: 4,
					endColumn: 7,
				},
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 5,
					column: 4,
					endLine: 5,
					endColumn: 7,
				},
			],
		},
		{
			code: `
		  class A {
			static foo() {}
			static foo() {}
		  }
				`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 11,
					endLine: 4,
					endColumn: 14,
				},
			],
		},
		{
			code: `
		  class A {
			foo() {}
			get foo() {}
		  }
				`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 8,
					endLine: 4,
					endColumn: 11,
				},
			],
		},
		{
			code: `
		  class A {
			set foo(value) {}
			foo() {}
		  }
				`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 4,
					endLine: 4,
					endColumn: 7,
				},
			],
		},
		{
			code: `
		  class A {
			foo;
			foo = 42;
		  }
				`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 4,
					endLine: 4,
					endColumn: 7,
				},
			],
		},
		{
			code: `
		  class A {
			foo;
			foo() {}
		  }
				`,
			errors: [
				{
					data: { name: "foo" },
					messageId: "unexpected",
					line: 4,
					column: 4,
					endLine: 4,
					endColumn: 7,
				},
			],
		},
	],
	fatal: [
		{
			name: "options provided when schema allows none",
			code: "var x = 1;",
			options: [1],
			error: { name: "SchemaValidationError" },
		},
	],
});
