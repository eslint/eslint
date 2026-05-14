/**
 * @fileoverview Tests for prefer-rest-params rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-rest-params"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 6, sourceType: "script" },
});

ruleTester.run("prefer-rest-params", rule, {
	valid: [
		"arguments;",
		"function foo(arguments) { arguments; }",
		"function foo() { var arguments; arguments; }",
		"var foo = () => arguments;", // Arrows don't have "arguments".,
		"function foo(...args) { args; }",
		"function foo() { arguments.length; }",
		"function foo() { arguments.callee; }",
	],
	invalid: [
		{
			code: "function foo() { arguments; }",
			errors: [
				{
					messageId: "preferRestParams",
				},
			],
		},
		{
			code: "function foo() { arguments[0]; }",
			errors: [
				{
					messageId: "preferRestParams",
				},
			],
		},
		{
			code: "function foo() { arguments[1]; }",
			errors: [
				{
					messageId: "preferRestParams",
				},
			],
		},
		{
			code: "function foo() { arguments[Symbol.iterator]; }",
			errors: [
				{
					messageId: "preferRestParams",
				},
			],
		},
	],
});
