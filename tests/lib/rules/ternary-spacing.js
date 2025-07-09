/**
 * @fileoverview Tests for ternary-spacing rule
 * @author Dawson Huang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/ternary-spacing");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("ternary-spacing", rule, {
	valid: [
		// correctly spaced
		"const result = condition ? value1 : value2;",
		"const foo = true ? 'yes' : 'no';",

		// nested ternary (clean)
		"const val = a ? b ? 1 : 2 : 3;",
		"const output = isValid ? 'ok' : isFatal ? 'fatal' : 'warn';",
		"const nested = condition1 ? (condition2 ? 'x' : 'y') : 'z';",

		// nested with parentheses (still clean)
		"const x = (a > b) ? (c > d ? 1 : 2) : 3;",
		"let msg = user ? (admin ? 'Admin' : 'User') : 'Guest';",

		// broken-line ternary (clean spacing)
		`
        const message =
            condition
                ? 'A'
                : 'B';
        `,
		`
        const level = user.isAdmin
            ? user.isSuperAdmin
                ? 'super'
                : 'admin'
            : 'guest';
        `,
	],

	invalid: [
		// No spaces at all
		{
			code: "const x = a?b:c;",
			output: "const x = a ? b : c;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Only missing space before ?
		{
			code: "const x = a? b : c;",
			output: "const x = a ? b : c;",
			errors: [{ messageId: "expectedSpaceBeforeQuestion" }],
		},

		// Only missing space after ?
		{
			code: "const x = a ?b : c;",
			output: "const x = a ? b : c;",
			errors: [{ messageId: "expectedSpaceAfterQuestion" }],
		},

		// Only missing space before :
		{
			code: "const x = a ? b: c;",
			output: "const x = a ? b : c;",
			errors: [{ messageId: "expectedSpaceBeforeColon" }],
		},

		// Only missing space after :
		{
			code: "const x = a ? b :c;",
			output: "const x = a ? b : c;",
			errors: [{ messageId: "expectedSpaceAfterColon" }],
		},

		// Too many spaces before ?
		{
			code: "const x = a  ? b : c;",
			output: "const x = a ? b : c;",
			errors: [{ messageId: "expectedSpaceBeforeQuestion" }],
		},

		// Too many spaces after ?
		{
			code: "const x = a ?  b : c;",
			output: "const x = a ? b : c;",
			errors: [{ messageId: "expectedSpaceAfterQuestion" }],
		},

		// Too many spaces before :
		{
			code: "const x = a ? b  : c;",
			output: "const x = a ? b : c;",
			errors: [{ messageId: "expectedSpaceBeforeColon" }],
		},

		// Too many spaces after :
		{
			code: "const x = a ? b :  c;",
			output: "const x = a ? b : c;",
			errors: [{ messageId: "expectedSpaceAfterColon" }],
		},

		// All too many
		{
			code: "const x = a  ?  b  :  c;",
			output: "const x = a ? b : c;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Nested ternary — no spaces at all
		{
			code: "const x = a?b:c?d:e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Nested ternary — missing space before ?
		{
			code: "const x = a? b : c ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [{ messageId: "expectedSpaceBeforeQuestion" }],
		},

		// Nested ternary — missing space after ?
		{
			code: "const x = a ?b : c ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [{ messageId: "expectedSpaceAfterQuestion" }],
		},

		// Nested ternary — missing space before :
		{
			code: "const x = a ? b: c ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [{ messageId: "expectedSpaceBeforeColon" }],
		},

		// Nested ternary — missing space after :
		{
			code: "const x = a ? b :c ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [{ messageId: "expectedSpaceAfterColon" }],
		},

		// Nested ternary — too many spaces before ?
		{
			code: "const x = a  ? b : c ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [{ messageId: "expectedSpaceBeforeQuestion" }],
		},

		// Nested ternary — too many spaces after ?
		{
			code: "const x = a ?  b : c ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [{ messageId: "expectedSpaceAfterQuestion" }],
		},

		// Nested ternary — too many spaces before :
		{
			code: "const x = a ? b  : c ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [{ messageId: "expectedSpaceBeforeColon" }],
		},

		// Nested ternary — too many spaces after :
		{
			code: "const x = a ? b :  c ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [{ messageId: "expectedSpaceAfterColon" }],
		},

		// Nested ternary — missing space before ?
		{
			code: "const x = a? b : c? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceBeforeQuestion" },
			],
		},

		// Nested ternary — missing space after ?
		{
			code: "const x = a ?b : c ?d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
			],
		},

		// Nested ternary — missing space before :
		{
			code: "const x = a ? b: c ? d: e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceBeforeColon" },
			],
		},

		// Nested ternary — missing space after :
		{
			code: "const x = a ? b :c ? d :e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceAfterColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Nested ternary — too many spaces before ?
		{
			code: "const x = a  ? b : c  ? d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceBeforeQuestion" },
			],
		},

		// Nested ternary — too many spaces after ?
		{
			code: "const x = a ?  b : c ?  d : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
			],
		},

		// Nested ternary — too many spaces before :
		{
			code: "const x = a ? b  : c ? d  : e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceBeforeColon" },
			],
		},

		// Nested ternary — too many spaces after :
		{
			code: "const x = a ? b :  c ? d :  e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceAfterColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Nested ternary — all too many
		{
			code: "const x = a  ?  b  :  c  ?  d  :  e;",
			output: "const x = a ? b : c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Line-broken — no space after '?'
		{
			code: `
                const result =
                    condition
                        ?value1
                        : value2;
            `,
			output: `
                const result =
                    condition
                        ? value1
                        : value2;
            `,
			errors: [{ messageId: "expectedSpaceAfterQuestion" }],
		},

		// Line-broken — too many spaces after ':'
		{
			code: `
                const result =
                    condition
                        ? value1
                        :  value2;
            `,
			output: `
                const result =
                    condition
                        ? value1
                        : value2;
            `,
			errors: [{ messageId: "expectedSpaceAfterColon" }],
		},

		// Line-broken — no space after '?' and too many after ':'
		{
			code: `
                const result =
                    condition
                        ?value1
                        :  value2;
            `,
			output: `
                const result =
                    condition
                        ? value1
                        : value2;
            `,
			errors: [
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Multi-nested line-breaks — various spacing issues
		{
			code: `
                const level = user.isAdmin
                    ?user.isSuperAdmin
                        ?'super'
                        :  'admin'
                    :  'guest';
            `,
			output: `
                const level = user.isAdmin
                    ? user.isSuperAdmin
                        ? 'super'
                        : 'admin'
                    : 'guest';
            `,
			errors: [
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceAfterColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Ternary inside return
		{
			code: "function f() { return a?b:c; }",
			output: "function f() { return a ? b : c; }",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Ternary inside arrow function
		{
			code: "const f = () => a?b:c;",
			output: "const f = () => a ? b : c;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Ternary inside function argument
		{
			code: "call(a?b:c);",
			output: "call(a ? b : c);",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Ternary inside template literal
		{
			code: "const str = `result: ${a?b:c}`;",
			output: "const str = `result: ${a ? b : c}`;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Ternaries in array literals
		{
			code: "const arr = [a?b:c, x?y:z];",
			output: "const arr = [a ? b : c, x ? y : z];",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Deeply nested and line-broken ternary
		{
			code: `
                const val =
                    a
                        ?b
                            ?c
                                ?d
                                :e
                            :f
                        :g;
            `,
			output: `
                const val =
                    a
                        ? b
                            ? c
                                ? d
                                : e
                            : f
                        : g;
            `,
			errors: [
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceAfterColon" },
				{ messageId: "expectedSpaceAfterColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Chained assignment with ternary
		{
			code: "let a = b = c?d:e;",
			output: "let a = b = c ? d : e;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},

		// Ternary inside logical expression
		{
			code: "const x = (a && b)?c:d;",
			output: "const x = (a && b) ? c : d;",
			errors: [
				{ messageId: "expectedSpaceBeforeQuestion" },
				{ messageId: "expectedSpaceAfterQuestion" },
				{ messageId: "expectedSpaceBeforeColon" },
				{ messageId: "expectedSpaceAfterColon" },
			],
		},
	],
});
