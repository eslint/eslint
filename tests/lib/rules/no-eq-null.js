/**
 * @fileoverview Tests for no-eq-null rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-eq-null"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-eq-null", rule, {
	valid: ["if (x === null) { }", "if (null === f()) { }"],
	invalid: [
		{
			code: "if (x == null) { }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "if (x === null) { }",
						},
						{
							messageId: "strictNullCheck",
							output: "if (x === null || x === undefined) { }",
						},
					],
				},
			],
		},
		{
			code: "if (x != null) { }",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "if (x !== null) { }",
						},
						{
							messageId: "strictNullCheck",
							output: "if (x !== null && x !== undefined) { }",
						},
					],
				},
			],
		},
		{
			code: "do {} while (null == x)",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "do {} while (null === x)",
						},
						{
							messageId: "strictNullCheck",
							output: "do {} while (x === null || x === undefined)",
						},
					],
				},
			],
		},
		{
			code: "do {} while (null != x)",
			errors: [
				{
					messageId: "unexpected",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "do {} while (null !== x)",
						},
						{
							messageId: "strictNullCheck",
							output: "do {} while (x !== null && x !== undefined)",
						},
					],
				},
			],
		},
		{
			// The operand would be evaluated twice, so only the operator is replaced.
			code: "if (foo() == null) { }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "if (foo() === null) { }",
						},
					],
				},
			],
		},
		{
			code: "if (foo.bar != null) { }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "if (foo.bar !== null) { }",
						},
					],
				},
			],
		},
		{
			// Replacing the whole expression would discard the comment.
			code: "if (x /* comment */ == null) { }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "if (x /* comment */ === null) { }",
						},
					],
				},
			],
		},
		{
			code: "if (null == null) { }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "if (null === null) { }",
						},
					],
				},
			],
		},
		{
			// The replacement must keep the grouping it had in its parent.
			code: "if (a && x == null) { }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "if (a && x === null) { }",
						},
						{
							messageId: "strictNullCheck",
							output: "if (a && (x === null || x === undefined)) { }",
						},
					],
				},
			],
		},
		{
			// `&&` binds as tightly as the replacement, so no parentheses are needed.
			code: "if (a && x != null) { }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "if (a && x !== null) { }",
						},
						{
							messageId: "strictNullCheck",
							output: "if (a && x !== null && x !== undefined) { }",
						},
					],
				},
			],
		},
		{
			// `??` cannot be mixed with `||` without parentheses.
			code: "const y = a ?? x == null;",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "const y = a ?? x === null;",
						},
						{
							messageId: "strictNullCheck",
							output: "const y = a ?? (x === null || x === undefined);",
						},
					],
				},
			],
		},
		{
			// The test of a conditional binds more tightly than the replacement.
			code: "const y = x == null ? 1 : 2;",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "const y = x === null ? 1 : 2;",
						},
						{
							messageId: "strictNullCheck",
							output: "const y = (x === null || x === undefined) ? 1 : 2;",
						},
					],
				},
			],
		},
		{
			// Globals can be accessor properties, so the operand is not duplicated.
			code: "/* global foo */ if (foo == null) { }",
			errors: [
				{
					messageId: "unexpected",
					suggestions: [
						{
							messageId: "replaceOperator",
							output: "/* global foo */ if (foo === null) { }",
						},
					],
				},
			],
		},
	],
});
