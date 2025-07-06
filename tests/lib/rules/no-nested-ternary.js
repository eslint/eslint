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
		// JavaScript
		"foo ? doBar() : doBaz();",
		"var foo = bar === baz ? qux : quxx;",
		// TypeScript
		"type Foo<T> = T extends string ? string : number;",
		"type CheckType<T> = (T extends string ? string : number) extends boolean ? 1 : 0;", // Nested ternary in `checkType` is valid.
		"type ExtendsType<T> = T extends (true extends false ? never : string) ? 1 : 0;", // Nested ternary in `extendsType` is valid.
	],
	invalid: [],
});
