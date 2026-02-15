/**
 * @fileoverview Tests for no-proto rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-proto"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-proto", rule, {
	valid: [
		"var a = test[__proto__];",
		"var __proto__ = null;",
		{ code: "foo[`__proto`] = null;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "foo[`__proto__\n`] = null;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { #__proto__; foo() { this.#__proto__; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
	],
	invalid: [
		{
			code: "var a = test.__proto__;",
			errors: [
				{
					messageId: "unexpectedProto",
				},
			],
		},
		{
			code: "var a = test['__proto__'];",
			errors: [
				{
					messageId: "unexpectedProto",
				},
			],
		},
		{
			code: "var a = test[`__proto__`];",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unexpectedProto",
				},
			],
		},
		{
			code: "test[`__proto__`] = function () {};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unexpectedProto",
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
