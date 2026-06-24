/**
 * @fileoverview disallow using an async function as a Promise executor
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-async-promise-executor");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 8 } });

ruleTester.run("no-async-promise-executor", rule, {
	valid: [
		"new Promise((resolve, reject) => {})",
		"new Promise((resolve, reject) => {}, async function unrelated() {})",
		"new Foo(async (resolve, reject) => {})",
		"/* global Promise:off */ new Promise(async (resolve, reject) => {})",
		{
			code: "new Promise(async (resolve, reject) => {})",
			languageOptions: {
				globals: { Promise: "off" },
			},
		},
		"let Promise; new Promise(async (resolve, reject) => {})",
		"function f() { new Promise(async (resolve, reject) => {}); var Promise; }",
		"function f(Promise) { new Promise(async (resolve, reject) => {}); }",
		{
			code: "const globalThis = { Promise }; new globalThis.Promise(async (resolve, reject) => {});",
			languageOptions: { ecmaVersion: 2020 },
		},
	],

	invalid: [
		{
			code: "new Promise(async function foo(resolve, reject) {})",
			errors: [
				{
					messageId: "async",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "new Promise(async (resolve, reject) => {})",
			errors: [
				{
					messageId: "async",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "new Promise(((((async () => {})))))",
			errors: [
				{
					messageId: "async",
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "new globalThis.Promise(async (resolve, reject) => {})",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "async",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "new globalThis['Promise'](async () => {})",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "async",
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
	],
});
