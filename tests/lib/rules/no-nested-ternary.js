/**
 * @fileoverview Tests for the no-nested-ternary rule
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-nested-ternary"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-nested-ternary", rule, {
	valid: ["foo ? doBar() : doBaz();", "var foo = bar === baz ? qux : quxx;"],
	invalid: [
		{
			code: "foo ? bar : baz === qux ? quxx : foobar;",
			errors: [
				{
					messageId: "noNestedTernary",
					type: "ConditionalExpression",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 40,
				},
			],
		},
		{
			code: "foo ? baz === qux ? quxx : foobar : bar;",
			errors: [
				{
					messageId: "noNestedTernary",
					type: "ConditionalExpression",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 40,
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

ruleTesterTypeScript.run("no-nested-ternary", rule, {
	valid: [
		// Simple ternary expression is valid.
		"type Type<T> = T extends string ? string : number;",
		// Nested ternary in `checkType` is valid.
		"type CheckType<T> = (T extends string ? string : number) extends boolean ? 1 : 0;",
		// Nested ternary in `extendsType` is valid.
		"type ExtendsType<T> = T extends (true extends false ? never : string) ? 1 : 0;",
		// Nested ternary in `trueType` when `allowConditionalType: false` is valid.
		{
			code: "type TrueType<T> = T extends string ? (boolean extends boolean ? true : false) : false;",
			options: [{ allowConditionalType: false }],
		},
		// Nested ternary in `falseType` when `allowConditionalType: false` is valid.
		{
			code: "type FalseType<T> = T extends string ? true : (boolean extends boolean ? true : false);",
			options: [{ allowConditionalType: false }],
		},
		// Nested ternary in `trueType` and `falseType` when `allowConditionalType: false` is valid.
		{
			code: "type TrueFalseType<T> = T extends string ? (T extends number ? true : false) : (T extends boolean ? true : false);",
			options: [{ allowConditionalType: false }],
		},
	],
	invalid: [
		{
			code: "type TrueType<T> = T extends string ? (boolean extends boolean ? true : false) : false;",
			options: [{ allowConditionalType: true }],
			errors: [
				{
					messageId: "noNestedTernary",
					type: "TSConditionalType",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 87,
				},
			],
		},
		{
			code: "type FalseType<T> = T extends string ? true : (boolean extends boolean ? true : false);",
			options: [{ allowConditionalType: true }],
			errors: [
				{
					messageId: "noNestedTernary",
					type: "TSConditionalType",
					line: 1,
					column: 21,
					endLine: 1,
					endColumn: 87,
				},
			],
		},
		{
			code: "type TrueFalseType<T> = T extends string ? (T extends number ? true : false) : (T extends boolean ? true : false);",
			options: [{ allowConditionalType: true }],
			errors: [
				{
					messageId: "noNestedTernary",
					type: "TSConditionalType",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 114,
				},
			],
		},
	],
});
