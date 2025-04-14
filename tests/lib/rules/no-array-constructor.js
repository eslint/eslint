/**
 * @fileoverview Tests for the no-array-constructor rule
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-array-constructor"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		sourceType: "script",
	},
});

ruleTester.run("no-array-constructor", rule, {
	valid: [
		"new Array(x)",
		"Array(x)",
		"new Array(9)",
		"Array(9)",
		"new foo.Array()",
		"foo.Array()",
		"new Array.foo",
		"Array.foo()",
		"new globalThis.Array",
		"const createArray = Array => new Array()",
		"var Array; new Array;",
		{
			code: "new Array()",
			languageOptions: {
				globals: {
					Array: "off",
				},
			},
		},
	],
	invalid: [
		{
			code: "new Array()",
			output: "[]",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: "new Array",
			output: "[]",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: "new Array(x, y)",
			output: "[x, y]",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: "new Array(0, 1, 2)",
			output: "[0, 1, 2]",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: "const array = Array?.();",
			output: "const array = [];",
			errors: [
				{
					messageId: "useLiteral",
					type: "CallExpression",
				},
			],
		},
		{
			code: `
                    const array = (Array)(
                        /* foo */ a,
                        b = c() // bar
                    );
                    `,
			output: `
                    const array = [
                        /* foo */ a,
                        b = c() // bar
                    ];
                    `,
			errors: [
				{
					messageId: "useLiteral",
					type: "CallExpression",
				},
			],
		},
		{
			code: "const array = Array(...args);",
			errors: [
				{
					messageId: "preferLiteral",
					type: "CallExpression",
					suggestions: [
						{
							messageId: "useLiteral",
							output: "const array = [...args];",
						},
					],
				},
			],
		},
		{
			code: "a = new (Array);",
			output: "a = [];",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: "a = new (Array) && (foo);",
			output: "a = [] && (foo);",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},

		...[
			// Semicolon required before array literal to compensate for ASI
			{
				code: `
                foo
                Array()
                `,
			},
			{
				code: `
                foo()
                Array(bar, baz)
                `,
			},
			{
				code: `
                new foo
                Array()
                `,
			},
			{
				code: `
                (a++)
                Array()
                `,
			},
			{
				code: `
                ++a
                Array()
                `,
			},
			{
				code: `
                const foo = function() {}
                Array()
                `,
			},
			{
				code: `
                const foo = class {}
                Array("a", "b", "c")
                `,
			},
			{
				code: `
                foo = this.return
                Array()
                `,
			},
			{
				code: `
                var yield = bar.yield
                Array()
                `,
			},
			{
				code: `
                var foo = { bar: baz }
                Array()
                `,
			},
			{
				code: `
                <foo />
                Array()
                `,
				languageOptions: {
					parserOptions: { ecmaFeatures: { jsx: true } },
				},
			},
			{
				code: `
                <foo></foo>
                Array()
                `,
				languageOptions: {
					parserOptions: { ecmaFeatures: { jsx: true } },
				},
			},
		].map(props => ({
			...props,
			output: props.code.replace(
				/(new )?Array\((?<args>.*?)\)/su,
				";[$<args>]",
			),
			errors: [
				{
					messageId: "useLiteralAfterSemicolon",
				},
			],
		})),

		...[
			// No semicolon required before array literal because ASI does not occur
			{ code: "Array()" },
			{
				code: `
                {}
                Array()
                `,
			},
			{
				code: `
                function foo() {}
                Array()
                `,
			},
			{
				code: `
                class Foo {}
                Array()
                `,
			},
			{ code: "foo: Array();" },
			{ code: "foo();Array();" },
			{ code: "{ Array(); }" },
			{ code: "if (a) Array();" },
			{ code: "if (a); else Array();" },
			{ code: "while (a) Array();" },
			{
				code: `
                do Array();
                while (a);
                `,
			},
			{ code: "for (let i = 0; i < 10; i++) Array();" },
			{ code: "for (const prop in obj) Array();" },
			{ code: "for (const element of iterable) Array();" },
			{
				code: "with (obj) Array();",
				languageOptions: { sourceType: "script" },
			},

			// No semicolon required before array literal because ASI still occurs
			{
				code: `
                const foo = () => {}
                Array()
                `,
			},
			{
				code: `
                a++
                Array()
                `,
			},
			{
				code: `
                a--
                Array()
                `,
			},
			{
				code: `
                function foo() {
                    return
                    Array();
                }
                `,
			},
			{
				code: `
                function * foo() {
                    yield
                    Array();
                }
                `,
			},
			{
				code: `
                do {}
                while (a)
                Array()
                `,
			},
			{
				code: `
                debugger
                Array()
                `,
			},
			{
				code: `
                for (;;) {
                    break
                    Array()
                }
                `,
			},
			{
				code: `
                for (;;) {
                    continue
                    Array()
                }
                `,
			},
			{
				code: `
                foo: break foo
                Array()
                `,
			},
			{
				code: `
                foo: while (true) continue foo
                Array()
                `,
			},
			{
				code: `
                const foo = bar
                export { foo }
                Array()
                `,
				languageOptions: { sourceType: "module" },
			},
			{
				code: `
                export { foo } from 'bar'
                Array()
                `,
				languageOptions: { sourceType: "module" },
			},
			{
				code: `
                export { foo } from 'bar' with { type: "json" }
                Array()
                `,
				languageOptions: { sourceType: "module" },
			},
			{
				code: `
                export * as foo from 'bar'
                Array()
                `,
				languageOptions: { sourceType: "module" },
			},
			{
				code: `
                export * as foo from 'bar' with { type: "json" }
                Array()
                `,
				languageOptions: { sourceType: "module" },
			},
			{
				code: `
                import foo from 'bar'
                Array()
                `,
				languageOptions: { sourceType: "module" },
			},
			{
				code: `
                import foo from 'bar' with { type: "json" }
                Array()
                `,
				languageOptions: { sourceType: "module" },
			},
			{
				code: `
                var yield = 5;

                yield: while (foo) {
                    if (bar)
                        break yield
                    new Array();
                }
                `,
			},
		].map(props => ({
			...props,
			output: props.code.replace(
				/(new )?Array\((?<args>.*?)\)/su,
				"[$<args>]",
			),
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		})),
		{
			code: "new /*a*/ /*b*/ Array /*c*/ /*d*/ () /*e*/ /*f*/ ; /*g*/ /*h*/",
			output: " /*a*/ /*b*/ [] /*c*/ /*d*/  /*e*/ /*f*/ ; /*g*/ /*h*/",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: "new Array(/*a*/ /*b*/)",
			output: "[/*a*/ /*b*/]",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: "new Array(/*a*/ x /*b*/, /*c*/ y /*d*/)",
			output: "[/*a*/ x /*b*/, /*c*/ y /*d*/]",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: "new /*a*/ Array(/*b*/ x /*c*/, /*d*/ y /*e*/) /*f*/ ; /*g*/",
			output: " /*a*/ [/*b*/ x /*c*/, /*d*/ y /*e*/] /*f*/ ; /*g*/",
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
				},
			],
		},
		{
			code: `
			new // a
			Array // b
			()
			`,
			output: `
			 // a
			[] // b
			
			`,
			errors: [
				{
					messageId: "useLiteral",
					type: "NewExpression",
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

ruleTesterTypeScript.run("no-array-constructor", rule, {
	valid: [
		"new Array(x);",
		"Array(x);",
		"new Array(9);",
		"Array(9);",
		"new foo.Array();",
		"foo.Array();",
		"new Array.foo();",
		"Array.foo();",

		// TypeScript
		"new Array<Foo>(1, 2, 3);",
		"new Array<Foo>();",
		"Array<Foo>(1, 2, 3);",
		"Array<Foo>();",
		"Array<Foo>(3);",

		//optional chain
		"Array?.(x);",
		"Array?.(9);",
		"foo?.Array();",
		"Array?.foo();",
		"foo.Array?.();",
		"Array.foo?.();",
		"Array?.<Foo>(1, 2, 3);",
		"Array?.<Foo>();",
	],

	invalid: [
		{
			code: "new Array();",
			output: "[];",
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		},
		{
			code: "Array();",
			output: "[];",
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		},
		{
			code: "new Array(x, y);",
			output: "[x, y];",
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		},
		{
			code: "Array(x, y);",
			output: "[x, y];",
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		},
		{
			code: "new Array(0, 1, 2);",
			output: "[0, 1, 2];",
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		},
		{
			code: "Array(0, 1, 2);",
			output: "[0, 1, 2];",
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		},
		{
			code: "Array?.(0, 1, 2);",
			output: "[0, 1, 2];",
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		},
		{
			code: "Array?.(x, y);",
			output: "[x, y];",
			errors: [
				{
					messageId: "useLiteral",
				},
			],
		},
	],
});
