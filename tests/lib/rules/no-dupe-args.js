/**
 * @fileoverview Tests for no-dupe-args
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-dupe-args"),
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

ruleTester.run("no-dupe-args", rule, {
	valid: [
		"function a(a, b, c){}",
		"var a = function(a, b, c){}",
		{
			code: "function a({a, b}, {c, d}){}",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "function a([ , a]) {}", languageOptions: { ecmaVersion: 6 } },
		{
			code: "function foo([[a, b], [c, d]]) {}",
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "function a(a, b, b) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "b" },
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "function a(a, a, a) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "a" },
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "function a(a, b, a) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "a" },
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "function a(a, b, a, b) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "a" },
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 23,
				},
				{
					messageId: "unexpected",
					data: { name: "b" },
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "var a = function(a, b, b) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "b" },
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "var a = function(a, a, a) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "a" },
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "var a = function(a, b, a) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "a" },
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "var a = function(a, b, a, b) {}",
			errors: [
				{
					messageId: "unexpected",
					data: { name: "a" },
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 29,
				},
				{
					messageId: "unexpected",
					data: { name: "b" },
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
	],
});
