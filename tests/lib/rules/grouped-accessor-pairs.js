/**
 * @fileoverview Tests for the grouped-accessor-pairs rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/grouped-accessor-pairs");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } });

ruleTester.run("grouped-accessor-pairs", rule, {
	valid: [
		// no accessors
		"({})",
		"({ a })",
		"({ a(){}, b(){}, a(){} })",
		"({ a: 1, b: 2 })",
		"({ a, ...b, c: 1 })",
		"({ a, b, ...a })",
		"({ a: 1, [b]: 2, a: 3, [b]: 4 })",
		"({ a: function get(){}, b, a: function set(foo){} })",
		"({ get(){}, a, set(){} })",
		"class A {}",
		"(class { a(){} })",
		"class A { a(){} [b](){} a(){} [b](){} }",
		"(class { a(){} b(){} static a(){} static b(){} })",
		"class A { get(){} a(){} set(){} }",

		// no accessor pairs
		"({ get a(){} })",
		"({ set a(foo){} })",
		"({ a: 1, get b(){}, c, ...d })",
		"({ get a(){}, get b(){}, set c(foo){}, set d(foo){} })",
		"({ get a(){}, b: 1, set c(foo){} })",
		"({ set a(foo){}, b: 1, a: 2 })",
		"({ get a(){}, b: 1, a })",
		"({ set a(foo){}, b: 1, a(){} })",
		"({ get a(){}, b: 1, set [a](foo){} })",
		"({ set a(foo){}, b: 1, get 'a '(){} })",
		"({ get a(){}, b: 1, ...a })",
		"({ set a(foo){}, b: 1 }, { get a(){} })",
		"({ get a(){}, b: 1, ...{ set a(foo){} } })",
		{
			code: "({ set a(foo){}, get b(){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ get a(){}, set b(foo){} })",
			options: ["setBeforeGet"],
		},
		"class A { get a(){} }",
		"(class { set a(foo){} })",
		"class A { static set a(foo){} }",
		"(class { static get a(){} })",
		"class A { a(){} set b(foo){} c(){} }",
		"(class { a(){} get b(){} c(){} })",
		"class A { get a(){} static get b(){} set c(foo){} static set d(bar){} }",
		"(class { get a(){} b(){} a(foo){} })",
		"class A { static set a(foo){} b(){} static a(){} }",
		"(class { get a(){} static b(){} set [a](foo){} })",
		"class A { static set a(foo){} b(){} static get ' a'(){} }",
		"(class { set a(foo){} b(){} static get a(){} })",
		"class A { static set a(foo){} b(){} get a(){} }",
		"(class { get a(){} }, class { b(){} set a(foo){} })",

		// correct grouping
		"({ get a(){}, set a(foo){} })",
		"({ a: 1, set b(foo){}, get b(){}, c: 2 })",
		"({ get a(){}, set a(foo){}, set b(bar){}, get b(){} })",
		"({ get [a](){}, set [a](foo){} })",
		"({ set a(foo){}, get 'a'(){} })",
		"({ a: 1, b: 2, get a(){}, set a(foo){}, c: 3, a: 4 })",
		"({ get a(){}, set a(foo){}, set b(bar){} })",
		"({ get a(){}, get b(){}, set b(bar){} })",
		"class A { get a(){} set a(foo){} }",
		"(class { set a(foo){} get a(){} })",
		"class A { static set a(foo){} static get a(){} }",
		"(class { static get a(){} static set a(foo){} })",
		"class A { a(){} set b(foo){} get b(){} c(){} get d(){} set d(bar){} }",
		"(class { set a(foo){} get a(){} get b(){} set b(bar){} })",
		"class A { static set [a](foo){} static get [a](){} }",
		"(class { get a(){} set [`a`](foo){} })",
		"class A { static get a(){} static set a(foo){} set a(bar){} static get a(){} }",
		"(class { static get a(){} get a(){} set a(foo){} })",

		// correct order
		{
			code: "({ get a(){}, set a(foo){} })",
			options: ["anyOrder"],
		},
		{
			code: "({ set a(foo){}, get a(){} })",
			options: ["anyOrder"],
		},
		{
			code: "({ get a(){}, set a(foo){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ set a(foo){}, get a(){} })",
			options: ["setBeforeGet"],
		},
		{
			code: "class A { get a(){} set a(foo){} }",
			options: ["anyOrder"],
		},
		{
			code: "(class { set a(foo){} get a(){} })",
			options: ["anyOrder"],
		},
		{
			code: "class A { get a(){} set a(foo){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "(class { static set a(foo){} static get a(){} })",
			options: ["setBeforeGet"],
		},

		// ignores properties with duplicate getters/setters
		"({ get a(){}, b: 1, get a(){} })",
		"({ set a(foo){}, b: 1, set a(foo){} })",
		"({ get a(){}, b: 1, set a(foo){}, c: 2, get a(){} })",
		"({ set a(foo){}, b: 1, set 'a'(bar){}, c: 2, get a(){} })",
		"class A { get [a](){} b(){} get [a](){} c(){} set [a](foo){} }",
		"(class { static set a(foo){} b(){} static get a(){} static c(){} static set a(bar){} })",

		// public and private
		"class A { get '#abc'(){} b(){} set #abc(foo){} }",
		"class A { get #abc(){} b(){} set '#abc'(foo){} }",
		{
			code: "class A { set '#abc'(foo){} get #abc(){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { set #abc(foo){} get '#abc'(){} }",
			options: ["getBeforeSet"],
		},
	],

	invalid: [
		// basic grouping tests with full messages
		{
			code: "({ get a(){}, b:1, set a(foo){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 20,
				},
			],
		},
		{
			code: "({ set 'abc'(foo){}, b:1, get 'abc'(){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "setter 'abc'",
						latterName: "getter 'abc'",
					},
					column: 27,
				},
			],
		},
		{
			code: "({ get [a](){}, b:1, set [a](foo){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: { formerName: "getter", latterName: "setter" },
					column: 22,
				},
			],
		},
		{
			code: "class A { get abc(){} b(){} set abc(foo){} }",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'abc'",
						latterName: "setter 'abc'",
					},
					column: 29,
				},
			],
		},
		{
			code: "(class { set abc(foo){} b(){} get abc(){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "setter 'abc'",
						latterName: "getter 'abc'",
					},
					column: 31,
				},
			],
		},
		{
			code: "class A { static set a(foo){} b(){} static get a(){} }",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "static setter 'a'",
						latterName: "static getter 'a'",
					},
					column: 37,
				},
			],
		},
		{
			code: "(class { static get 123(){} b(){} static set 123(foo){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "static getter '123'",
						latterName: "static setter '123'",
					},
					column: 35,
				},
			],
		},
		{
			code: "class A { static get [a](){} b(){} static set [a](foo){} }",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "static getter",
						latterName: "static setter",
					},
					column: 36,
				},
			],
		},
		{
			code: "class A { get '#abc'(){} b(){} set '#abc'(foo){} }",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter '#abc'",
						latterName: "setter '#abc'",
					},
					column: 32,
				},
			],
		},
		{
			code: "class A { get #abc(){} b(){} set #abc(foo){} }",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "private getter #abc",
						latterName: "private setter #abc",
					},
					column: 30,
				},
			],
		},

		// basic ordering tests with full messages
		{
			code: "({ set a(foo){}, get a(){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						latterName: "getter 'a'",
						formerName: "setter 'a'",
					},
					column: 18,
				},
			],
		},
		{
			code: "({ get 123(){}, set 123(foo){} })",
			options: ["setBeforeGet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						latterName: "setter '123'",
						formerName: "getter '123'",
					},
					column: 17,
				},
			],
		},
		{
			code: "({ get [a](){}, set [a](foo){} })",
			options: ["setBeforeGet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: { latterName: "setter", formerName: "getter" },
					column: 17,
				},
			],
		},
		{
			code: "class A { set abc(foo){} get abc(){} }",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						latterName: "getter 'abc'",
						formerName: "setter 'abc'",
					},
					column: 26,
				},
			],
		},
		{
			code: "(class { get [`abc`](){} set [`abc`](foo){} })",
			options: ["setBeforeGet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						latterName: "setter 'abc'",
						formerName: "getter 'abc'",
					},
					column: 26,
				},
			],
		},
		{
			code: "class A { static get a(){} static set a(foo){} }",
			options: ["setBeforeGet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						latterName: "static setter 'a'",
						formerName: "static getter 'a'",
					},
					column: 28,
				},
			],
		},
		{
			code: "(class { static set 'abc'(foo){} static get 'abc'(){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						latterName: "static getter 'abc'",
						formerName: "static setter 'abc'",
					},
					column: 34,
				},
			],
		},
		{
			code: "class A { static set [abc](foo){} static get [abc](){} }",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "static setter",
						latterName: "static getter",
					},
					column: 35,
				},
			],
		},
		{
			code: "class A { set '#abc'(foo){} get '#abc'(){} }",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						latterName: "getter '#abc'",
						formerName: "setter '#abc'",
					},
					column: 29,
				},
			],
		},
		{
			code: "class A { set #abc(foo){} get #abc(){} }",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						latterName: "private getter #abc",
						formerName: "private setter #abc",
					},
					column: 27,
				},
			],
		},

		// ordering option does not affect the grouping check
		{
			code: "({ get a(){}, b: 1, set a(foo){} })",
			options: ["anyOrder"],
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
				},
			],
		},
		{
			code: "({ get a(){}, b: 1, set a(foo){} })",
			options: ["setBeforeGet"],
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
				},
			],
		},
		{
			code: "({ get a(){}, b: 1, set a(foo){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
				},
			],
		},
		{
			code: "class A { set a(foo){} b(){} get a(){} }",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "setter 'a'",
						latterName: "getter 'a'",
					},
				},
			],
		},
		{
			code: "(class { static set a(foo){} b(){} static get a(){} })",
			options: ["setBeforeGet"],
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "static setter 'a'",
						latterName: "static getter 'a'",
					},
				},
			],
		},

		// various kinds of keys
		{
			code: "({ get 'abc'(){}, d(){}, set 'abc'(foo){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'abc'",
						latterName: "setter 'abc'",
					},
				},
			],
		},
		{
			code: "({ set ''(foo){}, get [''](){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: { formerName: "setter ''", latterName: "getter ''" },
				},
			],
		},
		{
			code: "class A { set abc(foo){} get 'abc'(){} }",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "setter 'abc'",
						latterName: "getter 'abc'",
					},
				},
			],
		},
		{
			code: "(class { set [`abc`](foo){} get abc(){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "setter 'abc'",
						latterName: "getter 'abc'",
					},
				},
			],
		},
		{
			code: "({ set ['abc'](foo){}, get [`abc`](){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "setter 'abc'",
						latterName: "getter 'abc'",
					},
				},
			],
		},
		{
			code: "({ set 123(foo){}, get [123](){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "setter '123'",
						latterName: "getter '123'",
					},
				},
			],
		},
		{
			code: "class A { static set '123'(foo){} static get 123(){} }",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "static setter '123'",
						latterName: "static getter '123'",
					},
				},
			],
		},
		{
			code: "(class { set [a+b](foo){} get [a+b](){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: { formerName: "setter", latterName: "getter" },
				},
			],
		},
		{
			code: "({ set [f(a)](foo){}, get [f(a)](){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: { formerName: "setter", latterName: "getter" },
				},
			],
		},

		// multiple invalid
		{
			code: "({ get a(){}, b: 1, set a(foo){}, set c(foo){}, d(){}, get c(){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 21,
				},
				{
					messageId: "notGrouped",
					data: {
						formerName: "setter 'c'",
						latterName: "getter 'c'",
					},
					column: 56,
				},
			],
		},
		{
			code: "({ get a(){}, set b(foo){}, set a(bar){}, get b(){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 29,
				},
				{
					messageId: "notGrouped",
					data: {
						formerName: "setter 'b'",
						latterName: "getter 'b'",
					},
					column: 43,
				},
			],
		},
		{
			code: "({ get a(){}, set [a](foo){}, set a(bar){}, get [a](){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 31,
				},
				{
					messageId: "notGrouped",
					data: { formerName: "setter", latterName: "getter" },
					column: 45,
				},
			],
		},
		{
			code: "({ a(){}, set b(foo){}, ...c, get b(){}, set c(bar){}, get c(){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "setter 'b'",
						latterName: "getter 'b'",
					},
					column: 31,
				},
				{
					messageId: "invalidOrder",
					data: {
						formerName: "setter 'c'",
						latterName: "getter 'c'",
					},
					column: 56,
				},
			],
		},
		{
			code: "({ set [a](foo){}, get [a](){}, set [-a](bar){}, get [-a](){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: { formerName: "setter", latterName: "getter" },
					column: 20,
				},
				{
					messageId: "invalidOrder",
					data: { formerName: "setter", latterName: "getter" },
					column: 50,
				},
			],
		},
		{
			code: "class A { get a(){} constructor (){} set a(foo){} get b(){} static c(){} set b(bar){} }",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 38,
				},
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'b'",
						latterName: "setter 'b'",
					},
					column: 74,
				},
			],
		},
		{
			code: "(class { set a(foo){} static get a(){} get a(){} static set a(bar){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "setter 'a'",
						latterName: "getter 'a'",
					},
					column: 40,
				},
				{
					messageId: "notGrouped",
					data: {
						formerName: "static getter 'a'",
						latterName: "static setter 'a'",
					},
					column: 50,
				},
			],
		},
		{
			code: "class A { get a(){} set a(foo){} static get b(){} static set b(bar){} }",
			options: ["setBeforeGet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 21,
				},
				{
					messageId: "invalidOrder",
					data: {
						formerName: "static getter 'b'",
						latterName: "static setter 'b'",
					},
					column: 51,
				},
			],
		},
		{
			code: "(class { set [a+b](foo){} get [a-b](){} get [a+b](){} set [a-b](bar){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: { formerName: "setter", latterName: "getter" },
					column: 41,
				},
				{
					messageId: "notGrouped",
					data: { formerName: "getter", latterName: "setter" },
					column: 55,
				},
			],
		},

		// combinations of valid and invalid
		{
			code: "({ get a(){}, set a(foo){}, get b(){}, c: function(){}, set b(bar){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'b'",
						latterName: "setter 'b'",
					},
					column: 57,
				},
			],
		},
		{
			code: "({ get a(){}, get b(){}, set a(foo){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 26,
				},
			],
		},
		{
			code: "({ set a(foo){}, get [a](){}, get a(){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "setter 'a'",
						latterName: "getter 'a'",
					},
					column: 31,
				},
			],
		},
		{
			code: "({ set [a](foo){}, set a(bar){}, get [a](){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: { formerName: "setter", latterName: "getter" },
					column: 34,
				},
			],
		},
		{
			code: "({ get a(){}, set a(foo){}, set b(bar){}, get b(){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "setter 'b'",
						latterName: "getter 'b'",
					},
					column: 43,
				},
			],
		},
		{
			code: "class A { get a(){} static set b(foo){} static get b(){} set a(foo){} }",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 58,
				},
			],
		},
		{
			code: "(class { static get a(){} set a(foo){} static set a(bar){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "static getter 'a'",
						latterName: "static setter 'a'",
					},
					column: 40,
				},
			],
		},
		{
			code: "class A { set a(foo){} get a(){} static get a(){} static set a(bar){} }",
			options: ["setBeforeGet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "static getter 'a'",
						latterName: "static setter 'a'",
					},
					column: 51,
				},
			],
		},

		// non-accessor duplicates do not affect this rule
		{
			code: "({ get a(){}, a: 1, set a(foo){} })",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 21,
				},
			],
		},
		{
			code: "({ a(){}, set a(foo){}, get a(){} })",
			options: ["getBeforeSet"],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "setter 'a'",
						latterName: "getter 'a'",
					},
					column: 25,
				},
			],
		},
		{
			code: "class A { get a(){} a(){} set a(foo){} }",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 27,
				},
			],
		},
		{
			code: "class A { get a(){} a; set a(foo){} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 24,
				},
			],
		},

		// full location tests
		{
			code: "({ get a(){},\n    b: 1,\n    set a(foo){}\n})",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 10,
				},
			],
		},
		{
			code: "class A { static set a(foo){} b(){} static get \n a(){}\n}",
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "static setter 'a'",
						latterName: "static getter 'a'",
					},
					line: 1,
					column: 37,
					endLine: 2,
					endColumn: 3,
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

ruleTesterTypeScript.run("grouped-accessor-pairs", rule, {
	valid: [
		"interface I { get prop(): any, between: true, set prop(value: any): void }",
		"type T = { get prop(): any, between: true, set prop(value: any): void }",

		{
			code: "interface I { get prop(): any, set prop(value: any): void }",
			options: ["anyOrder", { enforceForTSTypes: true }],
		},
		{
			code: "interface I { set prop(value: any): void, get prop(): any }",
			options: ["anyOrder", { enforceForTSTypes: true }],
		},
		{
			code: "interface I { get a(): any, between: true, set b(value: any): void }",
			options: ["anyOrder", { enforceForTSTypes: true }],
		},

		{
			code: "interface I { before: true, get prop(): any, set prop(value: any): void, after: true }",
			options: ["getBeforeSet", { enforceForTSTypes: true }],
		},
		{
			code: "interface I { set prop(value: any): void, get prop(): any }",
			options: ["setBeforeGet", { enforceForTSTypes: true }],
		},
		{
			code: "type T = { get prop(): any, set prop(value: any): void }",
			options: ["anyOrder", { enforceForTSTypes: true }],
		},
		{
			code: "type T = { set prop(value: any): void, get prop(): any }",
			options: ["setBeforeGet", { enforceForTSTypes: true }],
		},
	],
	invalid: [
		{
			code: "interface I { get a(): any, between: true, set a(value: any): void }",
			options: ["anyOrder", { enforceForTSTypes: true }],
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 44,
				},
			],
		},
		{
			code: "interface I { get a(): any, set a(value: any): void }",
			options: ["setBeforeGet", { enforceForTSTypes: true }],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 29,
				},
			],
		},
		{
			code: "interface I { set a(value: any): void, get a(): any }",
			options: ["getBeforeSet", { enforceForTSTypes: true }],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "setter 'a'",
						latterName: "getter 'a'",
					},
					column: 40,
				},
			],
		},
		{
			code: "type T = { get a(): any, between: true, set a(value: any): void }",
			options: ["anyOrder", { enforceForTSTypes: true }],
			errors: [
				{
					messageId: "notGrouped",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 41,
				},
			],
		},
		{
			code: "type T = { get a(): any, set a(value: any): void }",
			options: ["setBeforeGet", { enforceForTSTypes: true }],
			errors: [
				{
					messageId: "invalidOrder",
					data: {
						formerName: "getter 'a'",
						latterName: "setter 'a'",
					},
					column: 26,
				},
			],
		},
	],
});
