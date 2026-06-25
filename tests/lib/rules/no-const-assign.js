/**
 * @fileoverview Tests for no-const-assign rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-const-assign");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-const-assign", rule, {
	valid: [
		"const x = 0; { let x; x = 1; }",
		"const x = 0; function a(x) { x = 1; }",
		"const x = 0; foo(x);",
		"for (const x in [1,2,3]) { foo(x); }",
		"for (const x of [1,2,3]) { foo(x); }",
		"const x = {key: 0}; x.key = 1;",
		"using x = foo();",
		"await using x = foo();",
		"using x = foo(); bar(x);",
		"await using x = foo(); bar(x);",

		// ignores non constant.
		"var x = 0; x = 1;",
		"let x = 0; x = 1;",
		"function x() {} x = 1;",
		"function foo(x) { x = 1; }",
		"class X {} X = 1;",
		"try {} catch (x) { x = 1; }",
	],
	invalid: [
		{
			code: "const x = 0; x = 1;",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "const {a: x} = {a: 0}; x = 1;",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "const x = 0; ({x} = {x: 1});",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "const x = 0; ({a: x = 1} = {});",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "const x = 0; x += 1;",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "const x = 0; ++x;",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "for (const i = 0; i < 10; ++i) { foo(i); }",
			errors: [
				{
					messageId: "const",
					data: { name: "i" },
				},
			],
		},
		{
			code: "const x = 0; x = 1; x = 2;",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
					line: 1,
					column: 14,
				},
				{
					messageId: "const",
					data: { name: "x" },
					line: 1,
					column: 21,
				},
			],
		},
		{
			code: "const x = 0; function foo() { x = x + 1; }",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "const x = 0; function foo(a) { x = a; }",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "const x = 0; while (true) { x = x + 1; }",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
				},
			],
		},
		{
			code: "using x = foo(); x = 1;",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
					column: 18,
				},
			],
		},
		{
			code: "await using x = foo(); x = 1;",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
					column: 24,
				},
			],
		},
		{
			code: "using x = foo(); x ??= bar();",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
					column: 18,
				},
			],
		},
		{
			code: "await using x = foo(); x ||= bar();",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
					column: 24,
				},
			],
		},
		{
			code: "using x = foo(); [x, y] = bar();",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
					column: 19,
				},
			],
		},
		{
			code: "await using x = foo(); [x = baz, y] = bar();",
			errors: [
				{
					messageId: "const",
					data: { name: "x" },
					column: 25,
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
