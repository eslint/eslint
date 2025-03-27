/**
 * @fileoverview A rule to control the style of variable initializations.
 * @author Colin Ihrig
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/init-declarations"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("init-declarations", rule, {
	valid: [
		"var foo = null;",
		"foo = true;",
		"var foo = 1, bar = false, baz = {};",
		"function foo() { var foo = 0; var bar = []; }",
		"var fn = function() {};",
		"var foo = bar = 2;",
		"for (var i = 0; i < 1; i++) {}",
		"for (var foo in []) {}",
		{ code: "for (var foo of []) {}", languageOptions: { ecmaVersion: 6 } },
		{
			code: "let a = true;",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = {};",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a = 1, b = false; if (a) { let c = 3, d = null; } }",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { const a = 1, b = true; if (a) { const c = 3, d = null; } }",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a = 1; const b = false; var c = true; }",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo, bar, baz;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { var foo; var bar; }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let a;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = 1;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a, b; if (a) { let c, d; } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { const a = 1, b = true; if (a) { const c = 3, d = null; } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; const b = false; var c; }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for(var i = 0; i < 1; i++){}",
			options: ["never", { ignoreForLoopInit: true }],
		},
		{
			code: "for (var foo in []) {}",
			options: ["never", { ignoreForLoopInit: true }],
		},
		{
			code: "for (var foo of []) {}",
			options: ["never", { ignoreForLoopInit: true }],
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "var foo;",
			options: ["always"],
			errors: [
				{
					messageId: "initialized",
					data: { idName: "foo" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "for (var a in []) var foo;",
			options: ["always"],
			errors: [
				{
					messageId: "initialized",
					data: { idName: "foo" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "var foo, bar = false, baz;",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "initialized",
					data: { idName: "foo" },
					type: "VariableDeclarator",
				},
				{
					messageId: "initialized",
					data: { idName: "baz" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo() { var foo = 0; var bar; }",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "initialized",
					data: { idName: "bar" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo() { var foo; var bar = foo; }",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "initialized",
					data: { idName: "foo" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "let a;",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "initialized",
					data: { idName: "a" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo() { let a = 1, b; if (a) { let c = 3, d = null; } }",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "initialized",
					data: { idName: "b" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo() { let a; const b = false; var c; }",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "initialized",
					data: { idName: "a" },
					type: "VariableDeclarator",
				},
				{
					messageId: "initialized",
					data: { idName: "c" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "var foo = bar = 2;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "foo" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "var foo = true;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "foo" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "var foo, bar = 5, baz = 3;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "bar" },
					type: "VariableDeclarator",
				},
				{
					messageId: "notInitialized",
					data: { idName: "baz" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo() { var foo; var bar = foo; }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "bar" },

					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "let a = 1;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "a" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo() { let a = 'foo', b; if (a) { let c, d; } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "a" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "function foo() { let a; const b = false; var c = 1; }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "c" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "for(var i = 0; i < 1; i++){}",
			options: ["never"],
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "i" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "for (var foo in []) {}",
			options: ["never"],
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "foo" },
					type: "VariableDeclarator",
				},
			],
		},
		{
			code: "for (var foo of []) {}",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "notInitialized",
					data: { idName: "foo" },
					type: "VariableDeclarator",
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

ruleTesterTypeScript.run("init-declarations", rule, {
	valid: [
		{
			code: "declare const foo: number;",
			options: ["always"],
		},
		{
			code: "declare const foo: number;",
			options: ["never"],
		},
		{
			code: `
	  declare namespace myLib {
		let numberOfGreetings: number;
	  }
			`,
			options: ["always"],
		},
		{
			code: `
	  declare namespace myLib {
		let numberOfGreetings: number;
	  }
			`,
			options: ["never"],
		},
		{
			code: `
	  declare namespace myLib {
		let valueInside: number;
	  }
		let valueOutside: number;
			`,
			options: ["never"],
		},
		`
	  interface GreetingSettings {
		greeting: string;
		duration?: number;
		color?: string;
	  }
			`,
		{
			code: `
	  interface GreetingSettings {
		greeting: string;
		duration?: number;
		color?: string;
	  }
			`,
			options: ["never"],
		},
		"type GreetingLike = string | (() => string) | Greeter;",
		{
			code: "type GreetingLike = string | (() => string) | Greeter;",
			options: ["never"],
		},
		{
			code: `
	  function foo() {
		var bar: string;
	  }
			`,
			options: ["never"],
		},
		{
			code: "var bar: string;",
			options: ["never"],
		},
		{
			code: `
	  var bar: string = function (): string {
		return 'string';
	  };
			`,
			options: ["always"],
		},
		{
			code: `
	  var bar: string = function (arg1: stirng): string {
		return 'string';
	  };
			`,
			options: ["always"],
		},
		{
			code: "function foo(arg1: string = 'string'): void {}",
			options: ["never"],
		},
		{
			code: "const foo: string = 'hello';",
			options: ["never"],
		},
		`
	  const class1 = class NAME {
		constructor() {
		  var name1: string = 'hello';
		}
	  };
			`,
		`
	  const class1 = class NAME {
		static pi: number = 3.14;
	  };
			`,
		{
			code: `
	  const class1 = class NAME {
		static pi: number = 3.14;
	  };
			`,
			options: ["never"],
		},
		`
	  interface IEmployee {
		empCode: number;
		empName: string;
		getSalary: (number) => number; // arrow function
		getManagerName(number): string;
	  }
			`,
		{
			code: `
	  interface IEmployee {
		empCode: number;
		empName: string;
		getSalary: (number) => number; // arrow function
		getManagerName(number): string;
	  }
			`,
			options: ["never"],
		},
		{
			code: "const foo: number = 'asd';",
			options: ["always"],
		},
		{
			code: "const foo: number;",
			options: ["never"],
		},
		{
			code: `
	  namespace myLib {
		let numberOfGreetings: number;
	  }
			`,
			options: ["never"],
		},
		{
			code: `
	  namespace myLib {
		let numberOfGreetings: number = 2;
	  }
			`,
			options: ["always"],
		},
		{
			code: `
	  declare namespace myLib1 {
		const foo: number;
		namespace myLib2 {
		  let bar: string;
		  namespace myLib3 {
			let baz: object;
		  }
		}
	  }
			`,
			options: ["always"],
		},

		{
			code: `
	  declare namespace myLib1 {
		const foo: number;
		namespace myLib2 {
		  let bar: string;
		  namespace myLib3 {
			let baz: object;
		  }
		}
	  }
			`,
			options: ["never"],
		},
	],
	invalid: [
		{
			code: "let arr: string[] = ['arr', 'ar'];",
			options: ["never"],
			errors: [
				{
					column: 5,
					data: { idName: "arr" },
					endColumn: 34,
					endLine: 1,
					line: 1,
					messageId: "notInitialized",
				},
			],
		},
		{
			code: "let arr: string = function () {};",
			options: ["never"],
			errors: [
				{
					column: 5,
					data: { idName: "arr" },
					endColumn: 33,
					endLine: 1,
					line: 1,
					messageId: "notInitialized",
				},
			],
		},
		{
			code: `
	  const class1 = class NAME {
		constructor() {
		  var name1: string = 'hello';
		}
	  };
			`,
			options: ["never"],
			errors: [
				{
					column: 9,
					data: { idName: "name1" },
					endColumn: 32,
					endLine: 4,
					line: 4,
					messageId: "notInitialized",
				},
			],
		},
		{
			code: "let arr: string;",
			options: ["always"],
			errors: [
				{
					column: 5,
					data: { idName: "arr" },
					endColumn: 16,
					endLine: 1,
					line: 1,
					messageId: "initialized",
				},
			],
		},
		{
			code: `
	  namespace myLib {
		let numberOfGreetings: number;
	  }
			`,
			options: ["always"],
			errors: [
				{
					column: 7,
					data: { idName: "numberOfGreetings" },
					endColumn: 32,
					endLine: 3,
					line: 3,
					messageId: "initialized",
				},
			],
		},
		{
			code: `
	  namespace myLib {
		let numberOfGreetings: number = 2;
	  }
			`,
			options: ["never"],
			errors: [
				{
					column: 7,
					data: { idName: "numberOfGreetings" },
					endColumn: 36,
					endLine: 3,
					line: 3,
					messageId: "notInitialized",
				},
			],
		},
		{
			code: `
		namespace myLib1 {
		  const foo: number;
			namespace myLib2 {
			  let bar: string;
			  namespace myLib3 {
				let baz: object;
			  }
		  }
		}
			`,
			options: ["always"],
			errors: [
				{
					column: 11,
					data: { idName: "foo" },
					endColumn: 22,
					endLine: 3,
					line: 3,
					messageId: "initialized",
				},
				{
					column: 10,
					data: { idName: "bar" },
					endColumn: 21,
					endLine: 5,
					line: 5,
					messageId: "initialized",
				},
				{
					column: 9,
					data: { idName: "baz" },
					endColumn: 20,
					endLine: 7,
					line: 7,
					messageId: "initialized",
				},
			],
		},
		{
			code: `
	  declare namespace myLib {
		let valueInside: number;
	  }
		let valueOutside: number;
			`,
			options: ["always"],
			errors: [
				{
					column: 7,
					data: { idName: "valueOutside" },
					endColumn: 27,
					endLine: 5,
					line: 5,
					messageId: "initialized",
				},
			],
		},
	],
});
