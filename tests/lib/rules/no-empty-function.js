/**
 * @fileoverview Tests for no-empty-function rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-function"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALLOW_OPTIONS = Object.freeze([
	"functions",
	"arrowFunctions",
	"generatorFunctions",
	"methods",
	"generatorMethods",
	"getters",
	"setters",
	"constructors",
	"asyncFunctions",
	"asyncMethods",
	"privateConstructors",
	"protectedConstructors",
	"decoratedFunctions",
	"overrideMethods",
]);

/**
 * Folds test items to `{valid: [], invalid: []}`.
 * One item would be converted to 4 valid patterns and 8 invalid patterns.
 * @param {{valid: Object[], invalid: Object[]}} patterns The result.
 * @param {{code: string, message: string, allow: string|string[]}} item A test item.
 * @returns {{valid: Object[], invalid: Object[]}} The result.
 */
function toValidInvalid(patterns, item) {
	const ecmaVersion =
		item.languageOptions && item.languageOptions.ecmaVersion
			? item.languageOptions.ecmaVersion
			: 6;

	const allowOptions = Array.isArray(item.allow) ? item.allow : [item.allow];

	// Valid Patterns
	patterns.valid.push(
		{
			code: item.code.replace("{}", "{ bar(); }"),
			languageOptions: { ecmaVersion },
		},
		{
			code: item.code.replace("{}", "{ /* empty */ }"),
			languageOptions: { ecmaVersion },
		},
		{
			code: item.code.replace("{}", "{\n    // empty\n}"),
			languageOptions: { ecmaVersion },
		},
		...allowOptions.map(allow => ({
			code: `${item.code} // allow: ${allow}`,
			options: [{ allow: [allow] }],
			languageOptions: { ecmaVersion },
		})),
	);

	const error = item.message || {
		messageId: item.messageId,
		data: item.data,
	};

	// Invalid Patterns.
	patterns.invalid.push({
		code: item.code,
		errors: [error],
		languageOptions: { ecmaVersion },
	});
	ALLOW_OPTIONS.filter(allow => !allowOptions.includes(allow)).forEach(
		allow => {
			// non related "allow" option has no effect.
			patterns.invalid.push({
				code: `${item.code} // allow: ${allow}`,
				errors: [error],
				options: [{ allow: [allow] }],
				languageOptions: { ecmaVersion },
			});
		},
	);

	return patterns;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run(
	"no-empty-function",
	rule,
	[
		{
			code: "function foo() {}",
			messageId: "unexpected",
			data: { name: "function 'foo'" },
			allow: "functions",
		},
		{
			code: "var foo = function() {};",
			messageId: "unexpected",
			data: { name: "function" },
			allow: "functions",
		},
		{
			code: "var obj = {foo: function() {}};",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "functions",
		},
		{
			code: "var foo = () => {};",
			messageId: "unexpected",
			data: { name: "arrow function" },
			allow: "arrowFunctions",
		},
		{
			code: "function* foo() {}",
			messageId: "unexpected",
			data: { name: "generator function 'foo'" },
			allow: "generatorFunctions",
		},
		{
			code: "var foo = function*() {};",
			messageId: "unexpected",
			data: { name: "generator function" },
			allow: "generatorFunctions",
		},
		{
			code: "var obj = {foo: function*() {}};",
			messageId: "unexpected",
			data: { name: "generator method 'foo'" },
			allow: "generatorFunctions",
		},
		{
			code: "var obj = {foo() {}};",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "methods",
		},
		{
			code: "class A {foo() {}}",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "methods",
		},
		{
			code: "class A {static foo() {}}",
			messageId: "unexpected",
			data: { name: "static method 'foo'" },
			allow: "methods",
		},
		{
			code: "var A = class {foo() {}};",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "methods",
		},
		{
			code: "var A = class {static foo() {}};",
			messageId: "unexpected",
			data: { name: "static method 'foo'" },
			allow: "methods",
		},
		{
			code: "var obj = {*foo() {}};",
			messageId: "unexpected",
			data: { name: "generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "class A {*foo() {}}",
			messageId: "unexpected",
			data: { name: "generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "class A {static *foo() {}}",
			messageId: "unexpected",
			data: { name: "static generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "var A = class {*foo() {}};",
			messageId: "unexpected",
			data: { name: "generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "var A = class {static *foo() {}};",
			messageId: "unexpected",
			data: { name: "static generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "var obj = {get foo() {}};",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: "getters",
		},
		{
			code: "class A {get foo() {}}",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: "getters",
		},
		{
			code: "class A {static get foo() {}}",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: "getters",
		},
		{
			code: "var A = class {get foo() {}};",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: "getters",
		},
		{
			code: "var A = class {static get foo() {}};",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: "getters",
		},
		{
			code: "var obj = {set foo(value) {}};",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: "setters",
		},
		{
			code: "class A {set foo(value) {}}",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: "setters",
		},
		{
			code: "class A {static set foo(value) {}}",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: "setters",
		},
		{
			code: "var A = class {set foo(value) {}};",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: "setters",
		},
		{
			code: "var A = class {static set foo(value) {}};",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: "setters",
		},
		{
			code: "class A {constructor() {}}",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: "constructors",
		},
		{
			code: "var A = class {constructor() {}};",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: "constructors",
		},
		{
			code: "const foo = { async method() {} }",
			allow: "asyncMethods",
			messageId: "unexpected",
			data: { name: "async method 'method'" },
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function a(){}",
			allow: "asyncFunctions",
			messageId: "unexpected",
			data: { name: "async function 'a'" },
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "const foo = async function () {}",
			messageId: "unexpected",
			data: { name: "async function" },
			allow: "asyncFunctions",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class Foo { async bar() {} }",
			messageId: "unexpected",
			data: { name: "async method 'bar'" },
			allow: "asyncMethods",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "const foo = async () => {};",
			messageId: "unexpected",
			data: { name: "async arrow function" },
			allow: "arrowFunctions",
			languageOptions: { ecmaVersion: 8 },
		},
	].reduce(toValidInvalid, {
		valid: [
			{
				code: "var foo = () => 0;",
				languageOptions: { ecmaVersion: 6 },
			},
		],
		invalid: [
			// location tests
			{
				code: "function foo() {}",
				errors: [
					{
						messageId: "unexpected",
						data: { name: "function 'foo'" },
						line: 1,
						column: 16,
						endLine: 1,
						endColumn: 18,
					},
				],
			},
			{
				code: "var foo = function () {\n}",
				errors: [
					{
						messageId: "unexpected",
						data: { name: "function" },
						line: 1,
						column: 23,
						endLine: 2,
						endColumn: 2,
					},
				],
			},
			{
				code: "var foo = () => { \n\n  }",
				languageOptions: { ecmaVersion: 6 },
				errors: [
					{
						messageId: "unexpected",
						data: { name: "arrow function" },
						line: 1,
						column: 17,
						endLine: 3,
						endColumn: 4,
					},
				],
			},
			{
				code: "var obj = {\n\tfoo() {\n\t}\n}",
				languageOptions: { ecmaVersion: 6 },
				errors: [
					{
						messageId: "unexpected",
						data: { name: "method 'foo'" },
						line: 2,
						column: 8,
						endLine: 3,
						endColumn: 3,
					},
				],
			},
			{
				code: "class A { foo() { } }",
				languageOptions: { ecmaVersion: 6 },
				errors: [
					{
						messageId: "unexpected",
						data: { name: "method 'foo'" },
						line: 1,
						column: 17,
						endLine: 1,
						endColumn: 20,
					},
				],
			},
		],
	}),
);

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run(
	"no-empty-function",
	rule,
	[
		{
			code: "function foo() {}",
			messageId: "unexpected",
			data: { name: "function 'foo'" },
			allow: "functions",
		},
		{
			code: "const foo = function(param: string) {};",
			messageId: "unexpected",
			data: { name: "function" },
			allow: "functions",
		},
		{
			code: "const obj = {foo: function(param: string) {}};",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "functions",
		},
		{
			code: "const foo = (param: string) => {};",
			messageId: "unexpected",
			data: { name: "arrow function" },
			allow: "arrowFunctions",
		},
		{
			code: "function* foo(param: string) {}",
			messageId: "unexpected",
			data: { name: "generator function 'foo'" },
			allow: "generatorFunctions",
		},
		{
			code: "const foo = function*(param: string) {};",
			messageId: "unexpected",
			data: { name: "generator function" },
			allow: "generatorFunctions",
		},
		{
			code: "const obj = {foo: function*(param: string) {}};",
			messageId: "unexpected",
			data: { name: "generator method 'foo'" },
			allow: "generatorFunctions",
		},
		{
			code: "const obj = {foo(param: string) {}};",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "methods",
		},
		{
			code: "class A { foo(param: string) {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "methods",
		},
		{
			code: "class A { private foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "methods",
		},
		{
			code: "class A { protected foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "methods",
		},
		{
			code: "class A { static foo(param: string) {} }",
			messageId: "unexpected",
			data: { name: "static method 'foo'" },
			allow: "methods",
		},
		{
			code: "class A { private static foo() {} }",
			messageId: "unexpected",
			data: { name: "static method 'foo'" },
			allow: "methods",
		},
		{
			code: "class A { protected static foo() {} }",
			messageId: "unexpected",
			data: { name: "static method 'foo'" },
			allow: "methods",
		},
		{
			code: "const A = class {foo(param: string) {}};",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: "methods",
		},
		{
			code: "const A = class {static foo(param: string) {}};",
			messageId: "unexpected",
			data: { name: "static method 'foo'" },
			allow: "methods",
		},
		{
			code: "const A = class {private static foo() {}};",
			messageId: "unexpected",
			data: { name: "static method 'foo'" },
			allow: "methods",
		},
		{
			code: "const A = class {protected static foo() {}};",
			messageId: "unexpected",
			data: { name: "static method 'foo'" },
			allow: "methods",
		},
		{
			code: "class B { @decorator() foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["methods", "decoratedFunctions"],
		},
		{
			code: "const B = class { @decorator() foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["methods", "decoratedFunctions"],
		},
		{
			code: "class B extends C { override foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["methods", "overrideMethods"],
		},
		{
			code: "class B extends C { @decorator() override foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["methods", "decoratedFunctions", "overrideMethods"],
		},
		{
			code: "const obj = {*foo(param: string) {}};",
			messageId: "unexpected",
			data: { name: "generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "class A { *foo(param: string) {} }",
			messageId: "unexpected",
			data: { name: "generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "class A {static *foo(param: string) {}}",
			messageId: "unexpected",
			data: { name: "static generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "class A {private static *foo() {}}",
			messageId: "unexpected",
			data: { name: "static generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "class A {protected static *foo() {}}",
			messageId: "unexpected",
			data: { name: "static generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "const A = class {*foo(param: string) {}};",
			messageId: "unexpected",
			data: { name: "generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "const A = class {static *foo(param: string) {}};",
			messageId: "unexpected",
			data: { name: "static generator method 'foo'" },
			allow: "generatorMethods",
		},
		{
			code: "const obj = {get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: "getters",
		},
		{
			code: "class A {get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: "getters",
		},
		{
			code: "class A {static get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: "getters",
		},
		{
			code: "const A = class {get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: "getters",
		},
		{
			code: "const A = class {static get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: "getters",
		},
		{
			code: "class A {@decorator() get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: ["getters", "decoratedFunctions"],
		},
		{
			code: "class A {@decorator() static get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: ["getters", "decoratedFunctions"],
		},
		{
			code: "const A = class {@decorator() get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: ["getters", "decoratedFunctions"],
		},
		{
			code: "const A = class {@decorator() static get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: ["getters", "decoratedFunctions"],
		},
		{
			code: "class A extends B {override get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: ["getters", "overrideMethods"],
		},
		{
			code: "class A extends B {static override get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: ["getters", "overrideMethods"],
		},
		{
			code: "const A = class extends B {override get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: ["getters", "overrideMethods"],
		},
		{
			code: "const A = class extends B {static override get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: ["getters", "overrideMethods"],
		},
		{
			code: "const obj = {set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: "setters",
		},
		{
			code: "class A {set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: "setters",
		},
		{
			code: "class A {static set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: "setters",
		},
		{
			code: "const A = class {set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: "setters",
		},
		{
			code: "const A = class {static set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: "setters",
		},
		{
			code: "class A {@decorator() set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: ["setters", "decoratedFunctions"],
		},
		{
			code: "class A {@decorator() static set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: ["setters", "decoratedFunctions"],
		},
		{
			code: "const A = class {@decorator() set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: ["setters", "decoratedFunctions"],
		},
		{
			code: "const A = class {@decorator() static set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: ["setters", "decoratedFunctions"],
		},
		{
			code: "class A extends B {override set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: ["setters", "overrideMethods"],
		},
		{
			code: "class A extends B {static override set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: ["setters", "overrideMethods"],
		},
		{
			code: "const A = class extends B {override set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: ["setters", "overrideMethods"],
		},
		{
			code: "const A = class extends B {static override set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: ["setters", "overrideMethods"],
		},
		{
			code: "class A { constructor(param: string) {} }",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: "constructors",
		},
		{
			code: "class B { private constructor() {} }",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: ["constructors", "privateConstructors"],
		},
		{
			code: "class B { protected constructor() {} }",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: ["constructors", "protectedConstructors"],
		},
		{
			code: "const A = class {constructor(param: string) {}};",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: "constructors",
		},
		{
			code: "const B = class { private constructor() {} }",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: ["constructors", "privateConstructors"],
		},
		{
			code: "const B = class { protected constructor() {} }",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: ["constructors", "protectedConstructors"],
		},
		{
			code: "const foo = { async method(param: string) {} }",
			allow: "asyncMethods",
			messageId: "unexpected",
			data: { name: "async method 'method'" },
		},
		{
			code: "async function a(param: string){}",
			allow: "asyncFunctions",
			messageId: "unexpected",
			data: { name: "async function 'a'" },
		},
		{
			code: "const foo = async function(param: string) {}",
			messageId: "unexpected",
			data: { name: "async function" },
			allow: "asyncFunctions",
		},
		{
			code: "class A { async foo(param: string) {} }",
			messageId: "unexpected",
			data: { name: "async method 'foo'" },
			allow: "asyncMethods",
		},
		{
			code: "class A { @decorator() async foo(param: string) {} }",
			messageId: "unexpected",
			data: { name: "async method 'foo'" },
			allow: ["asyncMethods", "decoratedFunctions"],
		},
		{
			code: "class A extends B { override async foo(param: string) {} }",
			messageId: "unexpected",
			data: { name: "async method 'foo'" },
			allow: ["asyncMethods", "overrideMethods"],
		},
		{
			code: "const foo = async (): Promise<void> => {};",
			messageId: "unexpected",
			data: { name: "async arrow function" },
			allow: "arrowFunctions",
		},
		{
			code: "class A { private constructor() {} }",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: ["privateConstructors", "constructors"],
		},
		{
			code: "const A = class { private constructor() {} };",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: ["privateConstructors", "constructors"],
		},
		{
			code: "class A { protected constructor() {} }",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: ["protectedConstructors", "constructors"],
		},
		{
			code: "const A = class { protected constructor() {} };",
			messageId: "unexpected",
			data: { name: "constructor" },
			allow: ["protectedConstructors", "constructors"],
		},
		{
			code: "class A { @decorator() foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["decoratedFunctions", "methods"],
		},
		{
			code: "const A = class { @decorator() foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["decoratedFunctions", "methods"],
		},
		{
			code: "class B {@decorator() get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: ["decoratedFunctions", "getters"],
		},
		{
			code: "class B {@decorator() static get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: ["decoratedFunctions", "getters"],
		},
		{
			code: "const B = class {@decorator() get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: ["decoratedFunctions", "getters"],
		},
		{
			code: "const B = class {@decorator() static get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: ["decoratedFunctions", "getters"],
		},
		{
			code: "class B {@decorator() set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: ["decoratedFunctions", "setters"],
		},
		{
			code: "class B {@decorator() static set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: ["decoratedFunctions", "setters"],
		},
		{
			code: "const B = class {@decorator() set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: ["decoratedFunctions", "setters"],
		},
		{
			code: "const B = class {@decorator() static set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: ["decoratedFunctions", "setters"],
		},
		{
			code: "class B { @decorator() async foo(param: string) {} }",
			messageId: "unexpected",
			data: { name: "async method 'foo'" },
			allow: ["decoratedFunctions", "asyncMethods"],
		},
		{
			code: "class A extends B { @decorator() override foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["decoratedFunctions", "methods", "overrideMethods"],
		},
		{
			code: "class B extends C {override get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: ["overrideMethods", "getters"],
		},
		{
			code: "class B extends C {static override get foo(): string {}}",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: ["overrideMethods", "getters"],
		},
		{
			code: "const B = class extends C {override get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "getter 'foo'" },
			allow: ["overrideMethods", "getters"],
		},
		{
			code: "const B = class extends C {static override get foo(): string {}};",
			messageId: "unexpected",
			data: { name: "static getter 'foo'" },
			allow: ["overrideMethods", "getters"],
		},
		{
			code: "class B extends C {override set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: ["overrideMethods", "setters"],
		},
		{
			code: "class B extends C {static override set foo(value: string) {}}",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: ["overrideMethods", "setters"],
		},
		{
			code: "const B = class extends C {override set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "setter 'foo'" },
			allow: ["overrideMethods", "setters"],
		},
		{
			code: "const B = class extends C {static override set foo(value: string) {}};",
			messageId: "unexpected",
			data: { name: "static setter 'foo'" },
			allow: ["overrideMethods", "setters"],
		},
		{
			code: "class B extends C { override async foo(param: string) {} }",
			messageId: "unexpected",
			data: { name: "async method 'foo'" },
			allow: ["overrideMethods", "asyncMethods"],
		},
		{
			code: "class C extends D { @decorator() override foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["overrideMethods", "methods", "decoratedFunctions"],
		},
		{
			code: "class A extends B { override foo() {} }",
			messageId: "unexpected",
			data: { name: "method 'foo'" },
			allow: ["overrideMethods", "methods"],
		},
	].reduce(toValidInvalid, {
		valid: [
			{
				code: "class A { constructor(public param: string) {} }",
			},
			{
				code: "class A { constructor(private param: string) {} }",
			},
			{
				code: "class A { constructor(protected param: string) {} }",
			},
			{
				code: "class A { constructor(readonly param: string) {} }",
			},
		],
		invalid: [],
	}),
);
