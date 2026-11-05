/**
 * @fileoverview Tests for no-iterator rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-iterator"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-iterator", rule, {
	valid: [
		"var a = test[__iterator__];",
		"var __iterator__ = null;",
		{
			code: "foo[`__iterator`] = null;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "foo[`__iterator__\n`] = null;",
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "var a = test.__iterator__;",
			errors: [
				{
					messageId: "noIterator",
				},
			],
		},
		{
			code: "Foo.prototype.__iterator__ = function() {};",
			errors: [
				{
					messageId: "noIterator",
				},
			],
		},
		{
			code: "var a = test['__iterator__'];",
			errors: [
				{
					messageId: "noIterator",
				},
			],
		},
		{
			code: "var a = test[`__iterator__`];",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noIterator",
				},
			],
		},
		{
			code: "test[`__iterator__`] = function () {};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noIterator",
				},
			],
		},
	],
	fatal: [
		{
			name: "options provided when schema allows none",
			options: [1],
			error: { name: "SchemaValidationError" },
		},
	],
});
