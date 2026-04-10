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

		// Shadowed Promise should not be flagged
		"function Promise() {} new Promise(async (resolve, reject) => {})",
		"const Promise = function() {}; new Promise(async (resolve, reject) => {})",
		"class Promise {} new Promise(async (resolve, reject) => {})",
		{
			code: "import Promise from 'bluebird'; new Promise(async (resolve) => {})",
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
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
	],
});
