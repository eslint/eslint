/**
 * @fileoverview Tests for no-multi-assign rule.
 * @author Stewart Rand
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-multi-assign"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Returns an error object at the specified line and column
 * @private
 * @param {number} line line number
 * @param {number} column column number
 * @returns {Object} Error object
 */
function errorAt(line, column) {
	return {
		messageId: "unexpectedChain",
		line,
		column,
	};
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-multi-assign", rule, {
	valid: [
		"var a, b, c,\nd = 0;",
		"var a = 1; var b = 2; var c = 3;\nvar d = 0;",
		"var a = 1 + (b === 10 ? 5 : 4);",
		{
			code: "const a = 1, b = 2, c = 3;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = 1;\nconst b = 2;\n const c = 3;",
			languageOptions: { ecmaVersion: 6 },
		},
		"for(var a = 0, b = 0;;){}",
		{
			code: "for(let a = 0, b = 0;;){}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for(const a = 0, b = 0;;){}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export let a, b;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export let a,\n b = 0;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "const x = {};const y = {};x.one = y.one = 1;",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let a, b;a = b = 1",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { [foo = 0] = 0 }",
			languageOptions: { ecmaVersion: 2022 },
		},
	],

	invalid: [
		{
			code: "var a = b = c;",
			errors: [errorAt(1, 9)],
		},
		{
			code: "var a = b = c = d;",
			errors: [errorAt(1, 9), errorAt(1, 13)],
		},
		{
			code: "let foo = bar = cee = 100;",
			languageOptions: { ecmaVersion: 6 },
			errors: [errorAt(1, 11), errorAt(1, 17)],
		},
		{
			code: "a=b=c=d=e",
			errors: [errorAt(1, 3), errorAt(1, 5), errorAt(1, 7)],
		},
		{
			code: "a=b=c",
			errors: [errorAt(1, 3)],
		},

		{
			code: "a\n=b\n=c",
			errors: [errorAt(2, 2)],
		},

		{
			code: "var a = (b) = (((c)))",
			errors: [errorAt(1, 9)],
		},

		{
			code: "var a = ((b)) = (c)",
			errors: [errorAt(1, 9)],
		},

		{
			code: "var a = b = ( (c * 12) + 2)",
			errors: [errorAt(1, 9)],
		},

		{
			code: "var a =\n((b))\n = (c)",
			errors: [errorAt(2, 1)],
		},

		{
			code: "a = b = '=' + c + 'foo';",
			errors: [errorAt(1, 5)],
		},
		{
			code: "a = b = 7 * 12 + 5;",
			errors: [errorAt(1, 5)],
		},
		{
			code: "const x = {};\nconst y = x.one = 1;",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [errorAt(2, 11)],
		},
		{
			code: "let a, b;a = b = 1",
			options: [{}],
			languageOptions: { ecmaVersion: 6 },
			errors: [errorAt(1, 14)],
		},
		{
			code: "let x, y;x = y = 'baz'",
			options: [{ ignoreNonDeclaration: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [errorAt(1, 14)],
		},
		{
			code: "const a = b = 1",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [errorAt(1, 11)],
		},
		{
			code: "class C { field = foo = 0 }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [errorAt(1, 19)],
		},
		{
			code: "class C { field = foo = 0 }",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [errorAt(1, 19)],
		},
	],
});
