/**
 * @fileoverview Tests for `no-restricted-syntax` rule
 * @author Burak Yigit Kaya
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-syntax"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-restricted-syntax", rule, {
	valid: [
		// string format
		"doSomething();",
		{ code: "var foo = 42;", options: ["ConditionalExpression"] },
		{
			code: "foo += 42;",
			options: ["VariableDeclaration", "FunctionExpression"],
		},
		{ code: "foo;", options: ['Identifier[name="bar"]'] },
		{
			code: "() => 5",
			options: ["ArrowFunctionExpression > BlockStatement"],
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "({ foo: 1, bar: 2 })", options: ["Property > Literal.key"] },
		{ code: "A: for (;;) break;", options: ["BreakStatement[label]"] },
		{
			code: "function foo(bar, baz) {}",
			options: ["FunctionDeclaration[params.length>2]"],
		},

		//  object format
		{
			code: "var foo = 42;",
			options: [{ selector: "ConditionalExpression" }],
		},
		{
			code: "({ foo: 1, bar: 2 })",
			options: [{ selector: "Property > Literal.key" }],
		},
		{
			code: "({ foo: 1, bar: 2 })",
			options: [
				{
					selector: "FunctionDeclaration[params.length>2]",
					message: "custom error message.",
				},
			],
		},

		// https://github.com/eslint/eslint/issues/8733
		{ code: "console.log(/a/);", options: ["Literal[regex.flags=/./]"] },
	],
	invalid: [
		// string format
		{
			code: "var foo = 41;",
			options: ["VariableDeclaration"],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message: "Using 'VariableDeclaration' is not allowed.",
					},
				},
			],
		},
		{
			code: ";function lol(a) { return 42; }",
			options: ["EmptyStatement"],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: { message: "Using 'EmptyStatement' is not allowed." },
				},
			],
		},
		{
			code: "try { voila(); } catch (e) { oops(); }",
			options: ["TryStatement", "CallExpression", "CatchClause"],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: { message: "Using 'TryStatement' is not allowed." },
				},
				{
					messageId: "restrictedSyntax",
					data: { message: "Using 'CallExpression' is not allowed." },
				},
				{
					messageId: "restrictedSyntax",
					data: { message: "Using 'CatchClause' is not allowed." },
				},
				{
					messageId: "restrictedSyntax",
					data: { message: "Using 'CallExpression' is not allowed." },
				},
			],
		},
		{
			code: "bar;",
			options: ['Identifier[name="bar"]'],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'Identifier[name=\"bar\"]' is not allowed.",
					},
				},
			],
		},
		{
			code: "bar;",
			options: ["Identifier", 'Identifier[name="bar"]'],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: { message: "Using 'Identifier' is not allowed." },
				},
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'Identifier[name=\"bar\"]' is not allowed.",
					},
				},
			],
		},
		{
			code: "() => {}",
			options: ["ArrowFunctionExpression > BlockStatement"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'ArrowFunctionExpression > BlockStatement' is not allowed.",
					},
				},
			],
		},
		{
			code: "({ foo: 1, 'bar': 2 })",
			options: ["Property > Literal.key"],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'Property > Literal.key' is not allowed.",
					},
				},
			],
		},
		{
			code: "A: for (;;) break A;",
			options: ["BreakStatement[label]"],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'BreakStatement[label]' is not allowed.",
					},
				},
			],
		},
		{
			code: "function foo(bar, baz, qux) {}",
			options: ["FunctionDeclaration[params.length>2]"],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'FunctionDeclaration[params.length>2]' is not allowed.",
					},
				},
			],
		},

		// object format
		{
			code: "var foo = 41;",
			options: [{ selector: "VariableDeclaration" }],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message: "Using 'VariableDeclaration' is not allowed.",
					},
				},
			],
		},
		{
			code: "function foo(bar, baz, qux) {}",
			options: [{ selector: "FunctionDeclaration[params.length>2]" }],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'FunctionDeclaration[params.length>2]' is not allowed.",
					},
				},
			],
		},
		{
			code: "function foo(bar, baz, qux) {}",
			options: [
				{
					selector: "FunctionDeclaration[params.length>2]",
					message: "custom error message.",
				},
			],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: { message: "custom error message." },
				},
			],
		},

		// with object format, the custom message may contain the string '{{selector}}'
		{
			code: "function foo(bar, baz, qux) {}",
			options: [
				{
					selector: "FunctionDeclaration[params.length>2]",
					message: "custom message with {{selector}}",
				},
			],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: { message: "custom message with {{selector}}" },
				},
			],
		},

		// https://github.com/eslint/eslint/issues/8733
		{
			code: "console.log(/a/i);",
			options: ["Literal[regex.flags=/./]"],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'Literal[regex.flags=/./]' is not allowed.",
					},
				},
			],
		},

		// Optional chaining
		{
			code: "var foo = foo?.bar?.();",
			options: ["ChainExpression"],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message: "Using 'ChainExpression' is not allowed.",
					},
				},
			],
		},
		{
			code: "var foo = foo?.bar?.();",
			options: ["[optional=true]"],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message: "Using '[optional=true]' is not allowed.",
					},
				},
				{
					messageId: "restrictedSyntax",
					data: {
						message: "Using '[optional=true]' is not allowed.",
					},
				},
			],
		},

		// fix https://github.com/estools/esquery/issues/110
		{
			code: "a?.b",
			options: [":nth-child(1)"],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "restrictedSyntax",
					data: { message: "Using ':nth-child(1)' is not allowed." },
				},
			],
		},

		// https://github.com/eslint/eslint/issues/13639#issuecomment-683976062
		{
			code: "const foo = [<div/>, <div/>]",
			options: ["* ~ *"],
			languageOptions: {
				ecmaVersion: 2020,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "restrictedSyntax",
					data: { message: "Using '* ~ *' is not allowed." },
				},
			],
		},

		{
			code: "{ using x = foo(); }",
			options: ["VariableDeclaration[kind='using']"],
			languageOptions: {
				ecmaVersion: 2026,
			},
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'VariableDeclaration[kind='using']' is not allowed.",
					},
				},
			],
		},

		{
			code: "async function f() { await using x = foo(); }",
			options: ["VariableDeclaration[kind='await using']"],
			languageOptions: {
				ecmaVersion: 17,
			},
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'VariableDeclaration[kind='await using']' is not allowed.",
					},
				},
			],
		},
		{
			code: "import values from 'some/path';",
			options: ["ImportDeclaration[source.value=/^some\\/path$/]"],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using 'ImportDeclaration[source.value=/^some\\/path$/]' is not allowed.",
					},
				},
			],
		},
		{
			code: "foo + bar + baz",
			options: [
				":is(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])",
			],
			errors: [
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using ':is(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])' is not allowed.",
					},
				},
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using ':is(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])' is not allowed.",
					},
				},
				{
					messageId: "restrictedSyntax",
					data: {
						message:
							"Using ':is(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])' is not allowed.",
					},
				},
			],
		},
	],
	fatal: [
		{
			name: "first option wrong type (number)",
			options: [123],
			error: { name: "SchemaValidationError" },
		},
	],
});
