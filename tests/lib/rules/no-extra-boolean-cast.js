/**
 * @fileoverview Tests for no-extra-boolean-cast rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-boolean-cast"),
	RuleTester = require("../../../lib/rule-tester/rule-tester"),
	parser = require("../../fixtures/fixture-parser");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-extra-boolean-cast", rule, {
	valid: [
		"Boolean(bar, !!baz);",
		"var foo = !!bar;",
		"function foo() { return !!bar; }",
		"var foo = bar() ? !!baz : !!bat",
		"for(!!foo;;) {}",
		"for(;; !!foo) {}",
		"var foo = Boolean(bar);",
		"function foo() { return Boolean(bar); }",
		"var foo = bar() ? Boolean(baz) : Boolean(bat)",
		"for(Boolean(foo);;) {}",
		"for(;; Boolean(foo)) {}",
		"if (new Boolean(foo)) {}",
		"if ((Boolean(1), 2)) {}",

		// shadowed `Boolean` is not the global, so the call is not redundant
		"function foo(Boolean) { if (Boolean(bar)) {} }",
		"let Boolean = x => x; if (Boolean(bar)) {}",
		"function foo(Boolean) { return !!Boolean(bar); }",
		"function foo(Boolean) { if (Boolean(!!bar)) {} }",
		"function foo(Boolean) { if (new Boolean(!!bar)) {} }",
		{
			code: "function foo(Boolean) { if (bar && Boolean(baz)) {} }",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "if (Boolean(bar)) {}",
			languageOptions: { globals: { Boolean: "off" } },
		},
		{
			code: "var foo = bar || !!baz",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "var foo = bar && !!baz",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "var foo = bar || (baz && !!bat)",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "function foo() { return (!!bar || baz); }",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "var foo = bar() ? (!!baz && bat) : (!!bat && qux)",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "for(!!(foo && bar);;) {}",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "for(;; !!(foo || bar)) {}",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "var foo = Boolean(bar) || baz;",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "var foo = bar || Boolean(baz);",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "var foo = Boolean(bar) || Boolean(baz);",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "function foo() { return (Boolean(bar) || baz); }",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "var foo = bar() ? Boolean(baz) || bat : Boolean(bat)",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "for(Boolean(foo) || bar;;) {}",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "for(;; Boolean(foo) || bar) {}",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "if (new Boolean(foo) || bar) {}",
			options: [{ enforceForLogicalOperands: true }],
		},
		"if (!!foo || bar) {}",
		{
			code: "if (!!foo || bar) {}",
			options: [{}],
		},
		{
			code: "if (!!foo || bar) {}",
			options: [{ enforceForLogicalOperands: false }],
		},
		{
			code: "if ((!!foo || bar) === baz) {}",
			options: [{ enforceForLogicalOperands: true }],
		},
		{
			code: "if (!!foo ?? bar) {}",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var foo = bar || !!baz",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "var foo = bar && !!baz",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "var foo = bar || (baz && !!bat)",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "function foo() { return (!!bar || baz); }",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "var foo = bar() ? (!!baz && bat) : (!!bat && qux)",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "for(!!(foo && bar);;) {}",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "for(;; !!(foo || bar)) {}",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "var foo = Boolean(bar) || baz;",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "var foo = bar || Boolean(baz);",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "var foo = Boolean(bar) || Boolean(baz);",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "function foo() { return (Boolean(bar) || baz); }",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "var foo = bar() ? Boolean(baz) || bat : Boolean(bat)",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "for(Boolean(foo) || bar;;) {}",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "for(;; Boolean(foo) || bar) {}",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "if (new Boolean(foo) || bar) {}",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "if (!!foo || bar) {}",
			options: [{ enforceForInnerExpressions: false }],
		},
		{
			code: "if ((!!foo || bar) === baz) {}",
			options: [{ enforceForInnerExpressions: true }],
		},
		{
			code: "if (!!foo ?? bar) {}",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "if ((1, Boolean(2), 3)) {}",
			options: [{ enforceForInnerExpressions: true }],
		},

		/*
		 * additional expressions should not be checked with option
		 * configurations other than `enforceForInnerExpressions: true`.
		 */
		...[
			"Boolean((1, 2, Boolean(3)))",
			"Boolean(foo ? Boolean(bar) : Boolean(baz))",
			"Boolean(foo ?? Boolean(bar))",
		].flatMap(code => [
			{ code },
			{
				code,
				options: [{ enforceForLogicalOperands: true }],
			},
			{
				code,
				options: [{ enforceForLogicalOperands: false }],
			},
		]),
	],

	invalid: [
		{
			code: "if (!!foo) {}",
			output: "if (foo) {}",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "do {} while (!!foo)",
			output: "do {} while (foo)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "while (!!foo) {}",
			output: "while (foo) {}",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!!foo ? bar : baz",
			output: "foo ? bar : baz",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "for (; !!foo;) {}",
			output: "for (; foo;) {}",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!!!foo",
			output: "!foo",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "Boolean(!!foo)",
			output: "Boolean(foo)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "new Boolean(!!foo)",
			output: "new Boolean(foo)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "if (Boolean(foo)) {}",
			output: "if (foo) {}",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "do {} while (Boolean(foo))",
			output: "do {} while (foo)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "while (Boolean(foo)) {}",
			output: "while (foo) {}",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "Boolean(foo) ? bar : baz",
			output: "foo ? bar : baz",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "for (; Boolean(foo);) {}",
			output: "for (; foo;) {}",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(foo)",
			output: "!foo",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "!Boolean(foo && bar)",
			output: "!(foo && bar)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "!Boolean(foo + bar)",
			output: "!(foo + bar)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(+foo)",
			output: "!+foo",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean(foo())",
			output: "!foo()",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "!Boolean(foo = bar)",
			output: "!(foo = bar)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(...foo);",
			output: null,
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "!Boolean(foo, bar());",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "!Boolean((foo, bar()));",
			output: "!(foo, bar());",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "!Boolean();",
			output: "true;",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!(Boolean());",
			output: "true;",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "if (!Boolean()) { foo() }",
			output: "if (true) { foo() }",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "while (!Boolean()) { foo() }",
			output: "while (true) { foo() }",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "var foo = Boolean() ? bar() : baz()",
			output: "var foo = false ? bar() : baz()",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "if (Boolean()) { foo() }",
			output: "if (false) { foo() }",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "while (Boolean()) { foo() }",
			output: "while (false) { foo() }",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "Boolean(Boolean(foo))",
			output: "Boolean(foo)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "Boolean(!!foo, bar)",
			output: "Boolean(foo, bar)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 14,
				},
			],
		},

		// Adjacent tokens tests
		{
			code: "function *foo() { yield!!a ? b : c }",
			output: "function *foo() { yield a ? b : c }",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: "function *foo() { yield!! a ? b : c }",
			output: "function *foo() { yield a ? b : c }",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "function *foo() { yield! !a ? b : c }",
			output: "function *foo() { yield a ? b : c }",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "function *foo() { yield !!a ? b : c }",
			output: "function *foo() { yield a ? b : c }",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "function *foo() { yield(!!a) ? b : c }",
			output: "function *foo() { yield(a) ? b : c }",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "function *foo() { yield/**/!!a ? b : c }",
			output: "function *foo() { yield/**/a ? b : c }",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 28,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "x=!!a ? b : c ",
			output: "x=a ? b : c ",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "void!Boolean()",
			output: "void true",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "void! Boolean()",
			output: "void true",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "typeof!Boolean()",
			output: "typeof true",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "(!Boolean())",
			output: "(true)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "+!Boolean()",
			output: "+true",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "void !Boolean()",
			output: "void true",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "void(!Boolean())",
			output: "void(true)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "void/**/!Boolean()",
			output: "void/**/true",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 19,
				},
			],
		},

		// Comments tests
		{
			code: "!/**/!!foo",
			output: "!/**/foo",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!!/**/!foo",
			output: null,
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!!!/**/foo",
			output: null,
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!!!foo/**/",
			output: "!foo/**/",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "if(!/**/!foo);",
			output: null,
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "(!!/**/foo ? 1 : 2)",
			output: null,
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!/**/Boolean(foo)",
			output: "!/**/foo",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!Boolean/**/(foo)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!Boolean(/**/foo)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!Boolean(foo/**/)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!Boolean(foo)/**/",
			output: "!foo/**/",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "if(Boolean/**/(foo));",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "(Boolean(foo/**/) ? 1 : 2)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "/**/!Boolean()",
			output: "/**/true",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!/**/Boolean()",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean/**/()",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean(/**/)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean()/**/",
			output: "true/**/",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "if(!/**/Boolean());",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "(!Boolean(/**/) ? 1 : 2)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "if(/**/Boolean());",
			output: "if(/**/false);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean/**/());",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean(/**/));",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean()/**/);",
			output: "if(false/**/);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "(Boolean/**/() ? 1 : 2)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},

		// In Logical context
		{
			code: "if (!!foo || bar) {}",
			output: "if (foo || bar) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "if (!!foo && bar) {}",
			output: "if (foo && bar) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 10,
				},
			],
		},

		{
			code: "if ((!!foo || bar) && bat) {}",
			output: "if ((foo || bar) && bat) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "if (foo && !!bar) {}",
			output: "if (foo && bar) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "do {} while (!!foo || bar)",
			output: "do {} while (foo || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "while (!!foo || bar) {}",
			output: "while (foo || bar) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!!foo && bat ? bar : baz",
			output: "foo && bat ? bar : baz",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "for (; !!foo || bar;) {}",
			output: "for (; foo || bar;) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!!!foo || bar",
			output: "!foo || bar",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "Boolean(!!foo || bar)",
			output: "Boolean(foo || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "new Boolean(!!foo || bar)",
			output: "new Boolean(foo || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "if (Boolean(foo) || bar) {}",
			output: "if (foo || bar) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "do {} while (Boolean(foo) || bar)",
			output: "do {} while (foo || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "while (Boolean(foo) || bar) {}",
			output: "while (foo || bar) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "Boolean(foo) || bat ? bar : baz",
			output: "foo || bat ? bar : baz",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "for (; Boolean(foo) || bar;) {}",
			output: "for (; foo || bar;) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(foo) || bar",
			output: "!foo || bar",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "!Boolean(foo && bar) || bat",
			output: "!(foo && bar) || bat",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "!Boolean(foo + bar) || bat",
			output: "!(foo + bar) || bat",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(+foo)  || bar",
			output: "!+foo  || bar",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean(foo()) || bar",
			output: "!foo() || bar",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "!Boolean(foo() || bar)",
			output: "!(foo() || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "!Boolean(foo = bar) || bat",
			output: "!(foo = bar) || bat",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(...foo) || bar;",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "!Boolean(foo, bar()) || bar;",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "!Boolean((foo, bar()) || bat);",
			output: "!((foo, bar()) || bat);",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 30,
				},
			],
		},
		{
			code: "!Boolean() || bar;",
			output: "true || bar;",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!(Boolean()) || bar;",
			output: "true || bar;",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "if (!Boolean() || bar) { foo() }",
			output: "if (true || bar) { foo() }",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "while (!Boolean() || bar) { foo() }",
			output: "while (true || bar) { foo() }",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "var foo = Boolean() || bar ? bar() : baz()",
			output: "var foo = false || bar ? bar() : baz()",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "if (Boolean() || bar) { foo() }",
			output: "if (false || bar) { foo() }",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "while (Boolean() || bar) { foo() }",
			output: "while (false || bar) { foo() }",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},

		// Adjacent tokens tests
		{
			code: "function *foo() { yield(!!a || d) ? b : c }",
			output: "function *foo() { yield(a || d) ? b : c }",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "function *foo() { yield(!! a || d) ? b : c }",
			output: "function *foo() { yield(a || d) ? b : c }",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "function *foo() { yield(! !a || d) ? b : c }",
			output: "function *foo() { yield(a || d) ? b : c }",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "function *foo() { yield (!!a || d) ? b : c }",
			output: "function *foo() { yield (a || d) ? b : c }",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "function *foo() { yield/**/(!!a || d) ? b : c }",
			output: "function *foo() { yield/**/(a || d) ? b : c }",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 29,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "x=!!a || d ? b : c ",
			output: "x=a || d ? b : c ",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "void(!Boolean() || bar)",
			output: "void(true || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "void(! Boolean() || bar)",
			output: "void(true || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "typeof(!Boolean() || bar)",
			output: "typeof(true || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "(!Boolean() || bar)",
			output: "(true || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "void/**/(!Boolean() || bar)",
			output: "void/**/(true || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
			],
		},

		// Comments tests
		{
			code: "!/**/(!!foo || bar)",
			output: "!/**/(foo || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "!!/**/!foo || bar",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!!!/**/foo || bar",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!(!!foo || bar)/**/",
			output: "!(foo || bar)/**/",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "if(!/**/!foo || bar);",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "(!!/**/foo || bar ? 1 : 2)",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!/**/(Boolean(foo) || bar)",
			output: "!/**/(foo || bar)",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "!Boolean/**/(foo) || bar",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!Boolean(/**/foo) || bar",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!Boolean(foo/**/) || bar",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!(Boolean(foo)|| bar)/**/",
			output: "!(foo|| bar)/**/",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "if(Boolean/**/(foo) || bar);",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "(Boolean(foo/**/)|| bar ? 1 : 2)",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "/**/!Boolean()|| bar",
			output: "/**/true|| bar",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!/**/Boolean()|| bar",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean/**/()|| bar",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean(/**/)|| bar",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "(!Boolean()|| bar)/**/",
			output: "(true|| bar)/**/",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "if(!/**/Boolean()|| bar);",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "(!Boolean(/**/) || bar ? 1 : 2)",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "if(/**/Boolean()|| bar);",
			output: "if(/**/false|| bar);",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean/**/()|| bar);",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean(/**/)|| bar);",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean()|| bar/**/);",
			output: "if(false|| bar/**/);",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "(Boolean/**/()|| bar ? 1 : 2)",
			output: null,
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "if (a && !!(b ? c : d)){}",
			output: "if (a && (b ? c : d)){}",

			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "function *foo() { yield!!a || d ? b : c }",
			output: "function *foo() { yield a || d ? b : c }",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 27,
				},
			],
		},

		// In Logical context
		{
			code: "if (!!foo || bar) {}",
			output: "if (foo || bar) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "if (!!foo && bar) {}",
			output: "if (foo && bar) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 10,
				},
			],
		},

		{
			code: "if ((!!foo || bar) && bat) {}",
			output: "if ((foo || bar) && bat) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "if (foo && !!bar) {}",
			output: "if (foo && bar) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "do {} while (!!foo || bar)",
			output: "do {} while (foo || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "while (!!foo || bar) {}",
			output: "while (foo || bar) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!!foo && bat ? bar : baz",
			output: "foo && bat ? bar : baz",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "for (; !!foo || bar;) {}",
			output: "for (; foo || bar;) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!!!foo || bar",
			output: "!foo || bar",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "Boolean(!!foo || bar)",
			output: "Boolean(foo || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "new Boolean(!!foo || bar)",
			output: "new Boolean(foo || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "if (Boolean(foo) || bar) {}",
			output: "if (foo || bar) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "do {} while (Boolean(foo) || bar)",
			output: "do {} while (foo || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "while (Boolean(foo) || bar) {}",
			output: "while (foo || bar) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "Boolean(foo) || bat ? bar : baz",
			output: "foo || bat ? bar : baz",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "for (; Boolean(foo) || bar;) {}",
			output: "for (; foo || bar;) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(foo) || bar",
			output: "!foo || bar",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "!Boolean(foo && bar) || bat",
			output: "!(foo && bar) || bat",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "!Boolean(foo + bar) || bat",
			output: "!(foo + bar) || bat",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(+foo)  || bar",
			output: "!+foo  || bar",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean(foo()) || bar",
			output: "!foo() || bar",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "!Boolean(foo() || bar)",
			output: "!(foo() || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "!Boolean(foo = bar) || bat",
			output: "!(foo = bar) || bat",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "!Boolean(...foo) || bar;",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "!Boolean(foo, bar()) || bar;",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "!Boolean((foo, bar()) || bat);",
			output: "!((foo, bar()) || bat);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 30,
				},
			],
		},
		{
			code: "!Boolean() || bar;",
			output: "true || bar;",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!(Boolean()) || bar;",
			output: "true || bar;",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "if (!Boolean() || bar) { foo() }",
			output: "if (true || bar) { foo() }",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "while (!Boolean() || bar) { foo() }",
			output: "while (true || bar) { foo() }",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "var foo = Boolean() || bar ? bar() : baz()",
			output: "var foo = false || bar ? bar() : baz()",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "if (Boolean() || bar) { foo() }",
			output: "if (false || bar) { foo() }",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "while (Boolean() || bar) { foo() }",
			output: "while (false || bar) { foo() }",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},

		// Adjacent tokens tests
		{
			code: "function *foo() { yield(!!a || d) ? b : c }",
			output: "function *foo() { yield(a || d) ? b : c }",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "function *foo() { yield(!! a || d) ? b : c }",
			output: "function *foo() { yield(a || d) ? b : c }",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "function *foo() { yield(! !a || d) ? b : c }",
			output: "function *foo() { yield(a || d) ? b : c }",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "function *foo() { yield (!!a || d) ? b : c }",
			output: "function *foo() { yield (a || d) ? b : c }",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "function *foo() { yield/**/(!!a || d) ? b : c }",
			output: "function *foo() { yield/**/(a || d) ? b : c }",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 29,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "x=!!a || d ? b : c ",
			output: "x=a || d ? b : c ",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "void(!Boolean() || bar)",
			output: "void(true || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "void(! Boolean() || bar)",
			output: "void(true || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "typeof(!Boolean() || bar)",
			output: "typeof(true || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "(!Boolean() || bar)",
			output: "(true || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "void/**/(!Boolean() || bar)",
			output: "void/**/(true || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 20,
				},
			],
		},

		// Comments tests
		{
			code: "!/**/(!!foo || bar)",
			output: "!/**/(foo || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "!!/**/!foo || bar",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!!!/**/foo || bar",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!(!!foo || bar)/**/",
			output: "!(foo || bar)/**/",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "if(!/**/!foo || bar);",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "(!!/**/foo || bar ? 1 : 2)",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!/**/(Boolean(foo) || bar)",
			output: "!/**/(foo || bar)",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "!Boolean/**/(foo) || bar",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!Boolean(/**/foo) || bar",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!Boolean(foo/**/) || bar",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!(Boolean(foo)|| bar)/**/",
			output: "!(foo|| bar)/**/",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "if(Boolean/**/(foo) || bar);",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "(Boolean(foo/**/)|| bar ? 1 : 2)",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "/**/!Boolean()|| bar",
			output: "/**/true|| bar",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!/**/Boolean()|| bar",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean/**/()|| bar",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean(/**/)|| bar",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "(!Boolean()|| bar)/**/",
			output: "(true|| bar)/**/",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "if(!/**/Boolean()|| bar);",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "(!Boolean(/**/) || bar ? 1 : 2)",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "if(/**/Boolean()|| bar);",
			output: "if(/**/false|| bar);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean/**/()|| bar);",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean(/**/)|| bar);",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "if(Boolean()|| bar/**/);",
			output: "if(false|| bar/**/);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "(Boolean/**/()|| bar ? 1 : 2)",
			output: null,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "if (a && !!(b ? c : d)){}",
			output: "if (a && (b ? c : d)){}",

			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "function *foo() { yield!!a || d ? b : c }",
			output: "function *foo() { yield a || d ? b : c }",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 27,
				},
			],
		},

		// test parentheses in autofix
		{
			code: "Boolean(!!(a, b))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "Boolean(Boolean((a, b)))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "Boolean((!!(a, b)))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "Boolean((Boolean((a, b))))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "Boolean(!(!(a, b)))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "Boolean((!(!(a, b))))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "Boolean(!!(a = b))",
			output: "Boolean(a = b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "Boolean((!!(a = b)))",
			output: "Boolean((a = b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "Boolean(Boolean(a = b))",
			output: "Boolean(a = b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "Boolean(Boolean((a += b)))",
			output: "Boolean(a += b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "Boolean(!!(a === b))",
			output: "Boolean(a === b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "Boolean(!!((a !== b)))",
			output: "Boolean(a !== b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "Boolean(!!a.b)",
			output: "Boolean(a.b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "Boolean(Boolean((a)))",
			output: "Boolean(a)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "Boolean((!!(a)))",
			output: "Boolean((a))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 15,
				},
			],
		},

		{
			code: "new Boolean(!!(a, b))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "new Boolean(Boolean((a, b)))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "new Boolean((!!(a, b)))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "new Boolean((Boolean((a, b))))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "new Boolean(!(!(a, b)))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "new Boolean((!(!(a, b))))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "new Boolean(!!(a = b))",
			output: "new Boolean(a = b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "new Boolean((!!(a = b)))",
			output: "new Boolean((a = b))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "new Boolean(Boolean(a = b))",
			output: "new Boolean(a = b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: "new Boolean(Boolean((a += b)))",
			output: "new Boolean(a += b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 30,
				},
			],
		},
		{
			code: "new Boolean(!!(a === b))",
			output: "new Boolean(a === b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "new Boolean(!!((a !== b)))",
			output: "new Boolean(a !== b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 26,
				},
			],
		},
		{
			code: "new Boolean(!!a.b)",
			output: "new Boolean(a.b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "new Boolean(Boolean((a)))",
			output: "new Boolean(a)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "new Boolean((!!(a)))",
			output: "new Boolean((a))",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "if (!!(a, b));",
			output: "if (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "if (Boolean((a, b)));",
			output: "if (a, b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "if (!(!(a, b)));",
			output: "if (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "if (!!(a = b));",
			output: "if (a = b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "if (Boolean(a = b));",
			output: "if (a = b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "if (!!(a > b));",
			output: "if (a > b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "if (Boolean(a === b));",
			output: "if (a === b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "if (!!f(a));",
			output: "if (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "if (Boolean(f(a)));",
			output: "if (f(a));",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "if (!!(f(a)));",
			output: "if (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "if ((!!f(a)));",
			output: "if ((f(a)));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "if ((Boolean(f(a))));",
			output: "if ((f(a)));",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "if (!!a);",
			output: "if (a);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "if (Boolean(a));",
			output: "if (a);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "while (!!(a, b));",
			output: "while (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "while (Boolean((a, b)));",
			output: "while (a, b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "while (!(!(a, b)));",
			output: "while (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "while (!!(a = b));",
			output: "while (a = b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "while (Boolean(a = b));",
			output: "while (a = b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "while (!!(a > b));",
			output: "while (a > b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "while (Boolean(a === b));",
			output: "while (a === b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "while (!!f(a));",
			output: "while (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "while (Boolean(f(a)));",
			output: "while (f(a));",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "while (!!(f(a)));",
			output: "while (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "while ((!!f(a)));",
			output: "while ((f(a)));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "while ((Boolean(f(a))));",
			output: "while ((f(a)));",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "while (!!a);",
			output: "while (a);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "while (Boolean(a));",
			output: "while (a);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "do {} while (!!(a, b));",
			output: "do {} while (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "do {} while (Boolean((a, b)));",
			output: "do {} while (a, b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "do {} while (!(!(a, b)));",
			output: "do {} while (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "do {} while (!!(a = b));",
			output: "do {} while (a = b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "do {} while (Boolean(a = b));",
			output: "do {} while (a = b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "do {} while (!!(a > b));",
			output: "do {} while (a > b);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "do {} while (Boolean(a === b));",
			output: "do {} while (a === b);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 30,
				},
			],
		},
		{
			code: "do {} while (!!f(a));",
			output: "do {} while (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "do {} while (Boolean(f(a)));",
			output: "do {} while (f(a));",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: "do {} while (!!(f(a)));",
			output: "do {} while (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "do {} while ((!!f(a)));",
			output: "do {} while ((f(a)));",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "do {} while ((Boolean(f(a))));",
			output: "do {} while ((f(a)));",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 28,
				},
			],
		},
		{
			code: "do {} while (!!a);",
			output: "do {} while (a);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "do {} while (Boolean(a));",
			output: "do {} while (a);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "for (; !!(a, b););",
			output: "for (; a, b;);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "for (; Boolean((a, b)););",
			output: "for (; a, b;);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "for (; !(!(a, b)););",
			output: "for (; a, b;);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "for (; !!(a = b););",
			output: "for (; a = b;);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "for (; Boolean(a = b););",
			output: "for (; a = b;);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "for (; !!(a > b););",
			output: "for (; a > b;);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "for (; Boolean(a === b););",
			output: "for (; a === b;);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "for (; !!f(a););",
			output: "for (; f(a););",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "for (; Boolean(f(a)););",
			output: "for (; f(a););",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 21,
				},
			],
		},
		{
			code: "for (; !!(f(a)););",
			output: "for (; f(a););",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "for (; (!!f(a)););",
			output: "for (; (f(a)););",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "for (; (Boolean(f(a))););",
			output: "for (; (f(a)););",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "for (; !!a;);",
			output: "for (; a;);",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "for (; Boolean(a););",
			output: "for (; a;);",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 8,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!!(a, b) ? c : d",
			output: "(a, b) ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "(!!(a, b)) ? c : d",
			output: "(a, b) ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "Boolean((a, b)) ? c : d",
			output: "(a, b) ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "!!(a = b) ? c : d",
			output: "(a = b) ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "Boolean(a -= b) ? c : d",
			output: "(a -= b) ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "(Boolean((a *= b))) ? c : d",
			output: "(a *= b) ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "!!(a ? b : c) ? d : e",
			output: "(a ? b : c) ? d : e",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "Boolean(a ? b : c) ? d : e",
			output: "(a ? b : c) ? d : e",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "!!(a || b) ? c : d",
			output: "a || b ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "Boolean(a && b) ? c : d",
			output: "a && b ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 16,
				},
			],
		},
		{
			code: "!!(a === b) ? c : d",
			output: "a === b ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "Boolean(a < b) ? c : d",
			output: "a < b ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!!((a !== b)) ? c : d",
			output: "a !== b ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "Boolean((a >= b)) ? c : d",
			output: "a >= b ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!!+a ? b : c",
			output: "+a ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "!!+(a) ? b : c",
			output: "+(a) ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "Boolean(!a) ? b : c",
			output: "!a ? b : c",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "!!f(a) ? b : c",
			output: "f(a) ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "(!!f(a)) ? b : c",
			output: "(f(a)) ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "Boolean(a.b) ? c : d",
			output: "a.b ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!!a ? b : c",
			output: "a ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 4,
				},
			],
		},
		{
			code: "Boolean(a) ? b : c",
			output: "a ? b : c",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!!!(a, b)",
			output: "!(a, b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "!Boolean((a, b))",
			output: "!(a, b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "!!!(a = b)",
			output: "!(a = b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!!(!(a += b))",
			output: "!(a += b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "!(!!(a += b))",
			output: "!(a += b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!Boolean(a -= b)",
			output: "!(a -= b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "!Boolean((a -= b))",
			output: "!(a -= b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "!(Boolean(a -= b))",
			output: "!(a -= b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 18,
				},
			],
		},
		{
			code: "!!!(a || b)",
			output: "!(a || b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "!Boolean(a || b)",
			output: "!(a || b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "!!!(a && b)",
			output: "!(a && b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "!Boolean(a && b)",
			output: "!(a && b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "!!!(a != b)",
			output: "!(a != b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "!!!(a === b)",
			output: "!(a === b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "var x = !Boolean(a > b)",
			output: "var x = !(a > b)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 24,
				},
			],
		},
		{
			code: "!!!(a - b)",
			output: "!(a - b)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 11,
				},
			],
		},
		{
			code: "!!!(a ** b)",
			output: "!(a ** b)",
			languageOptions: { ecmaVersion: 2016 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "!Boolean(a ** b)",
			output: "!(a ** b)",
			languageOptions: { ecmaVersion: 2016 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 17,
				},
			],
		},
		{
			code: "async function f() { !!!(await a) }",
			output: "async function f() { !await a }",
			languageOptions: { ecmaVersion: 2017 },
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 34,
				},
			],
		},
		{
			code: "async function f() { !Boolean(await a) }",
			output: "async function f() { !await a }",
			languageOptions: { ecmaVersion: 2017 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 23,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "!!!!a",
			output: "!!a", // Reports 2 errors. After the first fix, the second error will disappear.
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 6,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "!!(!(!a))",
			output: "!!a", // Reports 2 errors. After the first fix, the second error will disappear.
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 4,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "!Boolean(!a)",
			output: "!!a",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 13,
				},
			],
		},
		{
			code: "!Boolean((!a))",
			output: "!!a",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean(!(a))",
			output: "!!(a)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!(Boolean(!a))",
			output: "!(!a)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "!!!+a",
			output: "!+a",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 6,
				},
			],
		},
		{
			code: "!!!(+a)",
			output: "!+a",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "!!(!+a)",
			output: "!+a",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "!(!!+a)",
			output: "!(+a)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 3,
					endLine: 1,
					endColumn: 7,
				},
			],
		},
		{
			code: "!Boolean((-a))",
			output: "!-a",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!Boolean(-(a))",
			output: "!-(a)",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 15,
				},
			],
		},
		{
			code: "!!!(--a)",
			output: "!--a",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 9,
				},
			],
		},
		{
			code: "!Boolean(a++)",
			output: "!a++",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 14,
				},
			],
		},
		{
			code: "!!!f(a)",
			output: "!f(a)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 8,
				},
			],
		},
		{
			code: "!!!(f(a))",
			output: "!f(a)",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 10,
				},
			],
		},
		{
			code: "!!!a",
			output: "!a",
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 5,
				},
			],
		},
		{
			code: "!Boolean(a)",
			output: "!a",
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 2,
					endLine: 1,
					endColumn: 12,
				},
			],
		},
		{
			code: "if (!!(a, b) || !!(c, d)) {}",
			output: "if ((a, b) || (c, d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 13,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "if (Boolean((a, b)) || Boolean((c, d))) {}",
			output: "if ((a, b) || (c, d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if ((!!((a, b))) || (!!((c, d)))) {}",
			output: "if ((a, b) || (c, d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "if (!!(a, b) && !!(c, d)) {}",
			output: "if ((a, b) && (c, d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 13,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "if (Boolean((a, b)) && Boolean((c, d))) {}",
			output: "if ((a, b) && (c, d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if ((!!((a, b))) && (!!((c, d)))) {}",
			output: "if ((a, b) && (c, d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "if (!!(a = b) || !!(c = d)) {}",
			output: "if ((a = b) || (c = d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: "if (Boolean(a /= b) || Boolean(c /= d)) {}",
			output: "if ((a /= b) || (c /= d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a >>= b) && !!(c >>= d)) {}",
			output: "if ((a >>= b) && (c >>= d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "if (Boolean(a **= b) && Boolean(c **= d)) {}",
			output: "if ((a **= b) && (c **= d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2016 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 21,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 41,
				},
			],
		},
		{
			code: "if (!!(a ? b : c) || !!(d ? e : f)) {}",
			output: "if ((a ? b : c) || (d ? e : f)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 18,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: "if (Boolean(a ? b : c) || Boolean(d ? e : f)) {}",
			output: "if ((a ? b : c) || (d ? e : f)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 23,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
		{
			code: "if (!!(a ? b : c) && !!(d ? e : f)) {}",
			output: "if ((a ? b : c) && (d ? e : f)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 18,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: "if (Boolean(a ? b : c) && Boolean(d ? e : f)) {}",
			output: "if ((a ? b : c) && (d ? e : f)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 23,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
		{
			code: "if (!!(a || b) || !!(c || d)) {}",
			output: "if (a || b || (c || d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "if (Boolean(a || b) || Boolean(c || d)) {}",
			output: "if (a || b || (c || d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a || b) && !!(c || d)) {}",
			output: "if ((a || b) && (c || d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "if (Boolean(a || b) && Boolean(c || d)) {}",
			output: "if ((a || b) && (c || d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a && b) || !!(c && d)) {}",
			output: "if (a && b || c && d) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "if (Boolean(a && b) || Boolean(c && d)) {}",
			output: "if (a && b || c && d) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a && b) && !!(c && d)) {}",
			output: "if (a && b && (c && d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "if (Boolean(a && b) && Boolean(c && d)) {}",
			output: "if (a && b && (c && d)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a !== b) || !!(c !== d)) {}",
			output: "if (a !== b || c !== d) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "if (Boolean(a != b) || Boolean(c != d)) {}",
			output: "if (a != b || c != d) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a === b) && !!(c === d)) {}",
			output: "if (a === b && c === d) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "if (!!(a > b) || !!(c < d)) {}",
			output: "if (a > b || c < d) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: "if (Boolean(!a) || Boolean(+b)) {}",
			output: "if (!a || +b) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "if (!!f(a) && !!b.c) {}",
			output: "if (f(a) && b.c) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 11,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "if (Boolean(a) || !!b) {}",
			output: "if (a || b) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "if (!!a && Boolean(b)) {}",
			output: "if (a && b) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 8,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "if ((!!a) || (Boolean(b))) {}",
			output: "if ((a) || (b)) {}",
			options: [{ enforceForLogicalOperands: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 9,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 25,
				},
			],
		},

		{
			code: "if (Boolean(a ?? b) || c) {}",
			output: "if ((a ?? b) || c) {}",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
			],
		},

		// Optional chaining
		{
			code: "if (Boolean?.(foo)) {};",
			output: "if (foo) {};",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "if (Boolean?.(a ?? b) || c) {}",
			output: "if ((a ?? b) || c) {}",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 22,
				},
			],
		},

		// https://github.com/eslint/eslint/issues/17173
		{
			code: "if (!Boolean(a as any)) { }",
			output: "if (!(a as any)) { }",
			languageOptions: {
				parser: require(
					parser("typescript-parsers/boolean-cast-with-assertion"),
				),
				ecmaVersion: 2020,
			},
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "if ((1, 2, Boolean(3))) {}",
			output: "if ((1, 2, 3)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "if (a ?? Boolean(b)) {}",
			output: "if (a ?? b) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "if ((a, b, c ?? (d, e, f ?? Boolean(g)))) {}",
			output: "if ((a, b, c ?? (d, e, f ?? g))) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 29,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a, b) || !!(c, d)) {}",
			output: "if ((a, b) || (c, d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 13,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "if (Boolean((a, b)) || Boolean((c, d))) {}",
			output: "if ((a, b) || (c, d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if ((!!((a, b))) || (!!((c, d)))) {}",
			output: "if ((a, b) || (c, d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "if (!!(a, b) && !!(c, d)) {}",
			output: "if ((a, b) && (c, d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 13,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 17,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: "if (Boolean((a, b)) && Boolean((c, d))) {}",
			output: "if ((a, b) && (c, d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if ((!!((a, b))) && (!!((c, d)))) {}",
			output: "if ((a, b) && (c, d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 32,
				},
			],
		},
		{
			code: "if (!!(a = b) || !!(c = d)) {}",
			output: "if ((a = b) || (c = d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: "if (Boolean(a /= b) || Boolean(c /= d)) {}",
			output: "if ((a /= b) || (c /= d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a >>= b) && !!(c >>= d)) {}",
			output: "if ((a >>= b) && (c >>= d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "if (Boolean(a **= b) && Boolean(c **= d)) {}",
			output: "if ((a **= b) && (c **= d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2016 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 21,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 25,
					endLine: 1,
					endColumn: 41,
				},
			],
		},
		{
			code: "if (!!(a ? b : c) || !!(d ? e : f)) {}",
			output: "if ((a ? b : c) || (d ? e : f)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 18,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: "if (Boolean(a ? b : c) || Boolean(d ? e : f)) {}",
			output: "if ((a ? b : c) || (d ? e : f)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 23,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
		{
			code: "if (!!(a ? b : c) && !!(d ? e : f)) {}",
			output: "if ((a ? b : c) && (d ? e : f)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 18,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 22,
					endLine: 1,
					endColumn: 35,
				},
			],
		},
		{
			code: "if (Boolean(a ? b : c) && Boolean(d ? e : f)) {}",
			output: "if ((a ? b : c) && (d ? e : f)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 23,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 45,
				},
			],
		},
		{
			code: "if (!!(a || b) || !!(c || d)) {}",
			output: "if (a || b || (c || d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "if (Boolean(a || b) || Boolean(c || d)) {}",
			output: "if (a || b || (c || d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a || b) && !!(c || d)) {}",
			output: "if ((a || b) && (c || d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "if (Boolean(a || b) && Boolean(c || d)) {}",
			output: "if ((a || b) && (c || d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a && b) || !!(c && d)) {}",
			output: "if (a && b || c && d) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "if (Boolean(a && b) || Boolean(c && d)) {}",
			output: "if (a && b || c && d) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a && b) && !!(c && d)) {}",
			output: "if (a && b && (c && d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 29,
				},
			],
		},
		{
			code: "if (Boolean(a && b) && Boolean(c && d)) {}",
			output: "if (a && b && (c && d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a !== b) || !!(c !== d)) {}",
			output: "if (a !== b || c !== d) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "if (Boolean(a != b) || Boolean(c != d)) {}",
			output: "if (a != b || c != d) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 24,
					endLine: 1,
					endColumn: 39,
				},
			],
		},
		{
			code: "if (!!(a === b) && !!(c === d)) {}",
			output: "if (a === b && c === d) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "if (!!(a > b) || !!(c < d)) {}",
			output: "if (a > b || c < d) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 14,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 27,
				},
			],
		},
		{
			code: "if (Boolean(!a) || Boolean(+b)) {}",
			output: "if (!a || +b) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 16,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "if (!!f(a) && !!b.c) {}",
			output: "if (f(a) && b.c) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 11,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "if (Boolean(a) || !!b) {}",
			output: "if (a || b) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 15,
				},
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 19,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "if (!!a && Boolean(b)) {}",
			output: "if (a && b) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 8,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 12,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "if ((!!a) || (Boolean(b))) {}",
			output: "if ((a) || (b)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 6,
					endLine: 1,
					endColumn: 9,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 15,
					endLine: 1,
					endColumn: 25,
				},
			],
		},

		{
			code: "if (Boolean(a ?? b) || c) {}",
			output: "if ((a ?? b) || c) {}",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 20,
				},
			],
		},
		{
			code: "if (Boolean?.(a ?? b) || c) {}",
			output: "if ((a ?? b) || c) {}",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 5,
					endLine: 1,
					endColumn: 22,
				},
			],
		},
		{
			code: "if (a ? Boolean(b) : c) {}",
			output: "if (a ? b : c) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 19,
				},
			],
		},
		{
			code: "if (a ? b : Boolean(c)) {}",
			output: "if (a ? b : c) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 23,
				},
			],
		},
		{
			code: "if (a ? b : Boolean(c ? d : e)) {}",
			output: "if (a ? b : c ? d : e) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 31,
				},
			],
		},
		{
			code: "const ternary = Boolean(bar ? !!baz : bat);",
			output: "const ternary = Boolean(bar ? baz : bat);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 31,
					endLine: 1,
					endColumn: 36,
				},
			],
		},
		{
			code: "const commaOperator = Boolean((bar, baz, !!bat));",
			output: "const commaOperator = Boolean((bar, baz, bat));",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
					line: 1,
					column: 42,
					endLine: 1,
					endColumn: 47,
				},
			],
		},
		{
			code: `
for (let i = 0; (console.log(i), Boolean(i < 10)); i++) {
    // ...
}`,
			output: `
for (let i = 0; (console.log(i), i < 10); i++) {
    // ...
}`,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 2,
					column: 34,
					endLine: 2,
					endColumn: 49,
				},
			],
		},
		{
			code: "const nullishCoalescingOperator = Boolean(bar ?? Boolean(baz));",
			output: "const nullishCoalescingOperator = Boolean(bar ?? baz);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 50,
					endLine: 1,
					endColumn: 62,
				},
			],
		},
		{
			code: "if (a ? Boolean(b = c) : Boolean(d = e));",
			output: "if (a ? b = c : d = e);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 23,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 26,
					endLine: 1,
					endColumn: 40,
				},
			],
		},
		{
			code: "if (a ? Boolean((b, c)) : Boolean((d, e)));",
			output: "if (a ? (b, c) : (d, e));",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 9,
					endLine: 1,
					endColumn: 24,
				},
				{
					messageId: "unexpectedCall",
					line: 1,
					column: 27,
					endLine: 1,
					endColumn: 42,
				},
			],
		},
		{
			code: `
function * generator() {
    if (a ? Boolean(yield y) : x) {
        return a;
    };
}
`,
			output: `
function * generator() {
    if (a ? yield y : x) {
        return a;
    };
}
`,
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedCall",
					line: 3,
					column: 13,
					endLine: 3,
					endColumn: 29,
				},
			],
		},
	],
});
