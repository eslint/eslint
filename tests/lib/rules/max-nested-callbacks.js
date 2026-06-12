/**
 * @fileoverview Tests for max-nested-callbacks rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-nested-callbacks"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const OPENING = "foo(function() {",
	CLOSING = "});";

/**
 * Generates a code string with the specified number of nested callbacks.
 * @param {number} times The number of times to nest the callbacks.
 * @returns {string} Code with the specified number of nested callbacks
 * @private
 */
function nestFunctions(times) {
	let openings = "",
		closings = "";

	for (let i = 0; i < times; i++) {
		openings += OPENING;
		closings += CLOSING;
	}
	return openings + closings;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester();

ruleTester.run("max-nested-callbacks", rule, {
	valid: [
		{
			code: "foo(function() { bar(thing, function(data) {}); });",
			options: [3],
		},
		{
			code: "var foo = function() {}; bar(function(){ baz(function() { qux(foo); }) });",
			options: [2],
		},
		{ code: "fn(function(){}, function(){}, function(){});", options: [2] },
		{
			code: "fn(() => {}, function(){}, function(){});",
			options: [2],
			languageOptions: { ecmaVersion: 6 },
		},
		nestFunctions(10),

		// object property options
		{
			code: "foo(function() { bar(thing, function(data) {}); });",
			options: [{ max: 3 }],
		},
	],
	invalid: [
		{
			code: "foo(function() { bar(thing, function(data) { baz(function() {}); }); });",
			options: [2],
			errors: [
				{
					messageId: "exceed",
					data: { num: 3, max: 2 },
					line: 1,
					column: 50,
					endLine: 1,
					endColumn: 58,
				},
			],
		},
		{
			code: "foo(function() { const helper = function() {}; bar(function() { baz(function() {}); }); });",
			options: [2],
			errors: [
				{
					messageId: "exceed",
					data: { num: 3, max: 2 },
					line: 1,
					column: 69,
					endLine: 1,
					endColumn: 77,
				},
			],
		},
		{
			code: "foo(function() { const helper = () => {}; bar(function() { baz(function() {}); }); });",
			options: [2],
			errors: [
				{
					messageId: "exceed",
					data: { num: 3, max: 2 },
					line: 1,
					column: 64,
					endLine: 1,
					endColumn: 72,
				},
			],
		},
		{
			code: "foo(function() { bar(thing, (data) => { baz(function() {}); }); });",
			options: [2],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "exceed",
					data: { num: 3, max: 2 },
					line: 1,
					column: 45,
					endLine: 1,
					endColumn: 53,
				},
			],
		},
		{
			code: "foo(() => { bar(thing, (data) => { baz( () => {}); }); });",
			options: [2],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "exceed",
					data: { num: 3, max: 2 },
					line: 1,
					column: 44,
					endLine: 1,
					endColumn: 46,
				},
			],
		},
		{
			code: "foo(function() { if (isTrue) { bar(function(data) { baz(function() {}); }); } });",
			options: [2],
			errors: [
				{
					messageId: "exceed",
					data: { num: 3, max: 2 },
					line: 1,
					column: 57,
					endLine: 1,
					endColumn: 65,
				},
			],
		},
		{
			code: nestFunctions(11),
			errors: [
				{
					messageId: "exceed",
					data: { num: 11, max: 10 },
					line: 1,
					column: 165,
					endLine: 1,
					endColumn: 173,
				},
			],
		},
		{
			code: nestFunctions(11),
			options: [{}],
			errors: [
				{
					messageId: "exceed",
					data: { num: 11, max: 10 },
					line: 1,
					column: 165,
					endLine: 1,
					endColumn: 173,
				},
			],
		},
		{
			code: "foo(function() {})",
			options: [{ max: 0 }],
			errors: [
				{
					messageId: "exceed",
					data: { num: 1, max: 0 },
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 13,
				},
			],
		},

		// object property options
		{
			code: "foo(function() { bar(thing, function(data) { baz(function() {}); }); });",
			options: [{ max: 2 }],
			errors: [
				{
					messageId: "exceed",
					data: { num: 3, max: 2 },
					line: 1,
					column: 50,
					endLine: 1,
					endColumn: 58,
				},
			],
		},
	],
});
