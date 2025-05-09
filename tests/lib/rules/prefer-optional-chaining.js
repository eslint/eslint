/**
 * @fileoverview Tests for prefer-optional-chaining rule
 * @author GitHub Copilot
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-optional-chaining"),
	{ RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2020,
	},
});

ruleTester.run("prefer-optional-chaining", rule, {
	valid: [
		// Already using optional chaining
		"obj?.prop",
		"obj?.[key]",
		"obj?.()",

		// Non-matching logical expressions
		"a && b",
		"obj.prop && obj.other.prop",
		"a && a.b.c",
		"obj && prop",
		"obj && obj.prop.subprop",
		"obj || obj.prop",

		// Non-matching conditionals
		"obj ? obj.prop : null",
		"obj !== undefined ? obj : obj.prop",
		"obj != null ? value : obj.prop",
		"obj != null ? obj.prop : null",

		// Non-matching if statements
		"if (condition) { obj.prop; }",
		"if (obj.prop) { obj.prop; }",
		"if (obj) { doSomething(); }",
	],

	invalid: [
		{
			code: "obj && obj.prop",
			output: "obj?.prop",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "LogicalExpression",
				},
			],
		},
		{
			code: "obj && obj[key]",
			output: "obj?.[key]",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "LogicalExpression",
				},
			],
		},
		{
			code: "obj && obj['key']",
			output: "obj?.['key']",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "LogicalExpression",
				},
			],
		},
		{
			code: "obj && obj()",
			output: "obj?.()",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "LogicalExpression",
				},
			],
		},
		{
			code: "obj != null ? obj.prop : undefined",
			output: "obj?.prop",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "ConditionalExpression",
				},
			],
		},
		{
			code: "obj !== null ? obj.prop : undefined",
			output: "obj?.prop",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "ConditionalExpression",
				},
			],
		},
		{
			code: "obj != undefined ? obj.prop : undefined",
			output: "obj?.prop",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "ConditionalExpression",
				},
			],
		},
		{
			code: "obj !== undefined ? obj.prop : undefined",
			output: "obj?.prop",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "ConditionalExpression",
				},
			],
		},
		{
			code: "if (obj) obj.prop",
			output: "obj?.prop;",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "IfStatement",
				},
			],
		},
		{
			code: "if (obj) { obj.prop; }",
			output: "obj?.prop;",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "IfStatement",
				},
			],
		},
		{
			code: "if (obj) obj[key]",
			output: "obj?.[key];",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "IfStatement",
				},
			],
		},
		{
			code: "if (obj) { obj[key]; }",
			output: "obj?.[key];",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "IfStatement",
				},
			],
		},
		{
			code: "if (obj) obj()",
			output: "obj?.();",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "IfStatement",
				},
			],
		},
		{
			code: "if (obj) { obj(); }",
			output: "obj?.();",
			errors: [
				{
					messageId: "preferOptionalChain",
					type: "IfStatement",
				},
			],
		},
	],
});
