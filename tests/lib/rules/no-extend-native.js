/**
 * @fileoverview Tests for no-extend-native rule.
 * @author David Nelson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extend-native"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
});

ruleTester.run("no-extend-native", rule, {
	valid: [
		"x.prototype.p = 0",
		"x.prototype['p'] = 0",
		"Object.p = 0",
		"Object.toString.bind = 0",
		"Object['toString'].bind = 0",
		"Object.defineProperty(x, 'p', {value: 0})",
		"Object.defineProperties(x, {p: {value: 0}})",
		"global.Object.prototype.toString = 0",
		"this.Object.prototype.toString = 0",
		"with(Object) { prototype.p = 0; }",
		"o = Object; o.prototype.toString = 0",
		"eval('Object.prototype.toString = 0')",
		"parseFloat.prototype.x = 1",
		{
			code: "Object.prototype.g = 0",
			options: [{ exceptions: ["Object"] }],
		},
		"obj[Object.prototype] = 0",

		// https://github.com/eslint/eslint/issues/4438
		"Object.defineProperty()",
		"Object.defineProperties()",

		// https://github.com/eslint/eslint/issues/8461
		"function foo() { var Object = function() {}; Object.prototype.p = 0 }",
		{
			code: "{ let Object = function() {}; Object.prototype.p = 0 }",
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "Object.prototype.p = 0",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Object" },
				},
			],
		},
		{
			code: "BigInt.prototype.p = 0",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "BigInt" },
				},
			],
		},
		{
			code: "WeakRef.prototype.p = 0",
			languageOptions: { ecmaVersion: 2021 },
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "WeakRef" },
				},
			],
		},
		{
			code: "FinalizationRegistry.prototype.p = 0",
			languageOptions: { ecmaVersion: 2021 },
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "FinalizationRegistry" },
				},
			],
		},
		{
			code: "AggregateError.prototype.p = 0",
			languageOptions: { ecmaVersion: 2021 },
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "AggregateError" },
				},
			],
		},
		{
			code: "Function.prototype['p'] = 0",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Function" },
				},
			],
		},
		{
			code: "String['prototype'].p = 0",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "String" },
				},
			],
		},
		{
			code: "Number['prototype']['p'] = 0",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Number" },
				},
			],
		},
		{
			code: "Object.defineProperty(Array.prototype, 'p', {value: 0})",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Array" },
				},
			],
		},
		{
			code: "Object.defineProperties(Array.prototype, {p: {value: 0}})",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Array" },
				},
			],
		},
		{
			code: "Object.defineProperties(Array.prototype, {p: {value: 0}, q: {value: 0}})",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Array" },
				},
			],
		},
		{
			code: "Number['prototype']['p'] = 0",
			options: [{ exceptions: ["Object"] }],
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Number" },
				},
			],
		},
		{
			code: "Object.prototype.p = 0; Object.prototype.q = 0",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Object" },
					column: 1,
				},
				{
					messageId: "unexpected",
					data: { builtin: "Object" },
					column: 25,
				},
			],
		},
		{
			code: "function foo() { Object.prototype.p = 0 }",
			errors: [
				{
					messageId: "unexpected",
					data: { builtin: "Object" },
				},
			],
		},

		// Optional chaining
		{
			code: "(Object?.prototype).p = 0",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpected", data: { builtin: "Object" } }],
		},
		{
			code: "Object.defineProperty(Object?.prototype, 'p', { value: 0 })",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpected", data: { builtin: "Object" } }],
		},
		{
			code: "Object?.defineProperty(Object.prototype, 'p', { value: 0 })",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpected", data: { builtin: "Object" } }],
		},
		{
			code: "(Object?.defineProperty)(Object.prototype, 'p', { value: 0 })",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpected", data: { builtin: "Object" } }],
		},

		// Logical assignments
		{
			code: "Array.prototype.p &&= 0",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "unexpected", data: { builtin: "Array" } }],
		},
		{
			code: "Array.prototype.p ||= 0",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "unexpected", data: { builtin: "Array" } }],
		},
		{
			code: "Array.prototype.p ??= 0",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "unexpected", data: { builtin: "Array" } }],
		},
	],
	fatal: [
		{
			name: "first option wrong type (number)",
			options: [123],
			error: { name: "SchemaValidationError" },
		},
	],
});
