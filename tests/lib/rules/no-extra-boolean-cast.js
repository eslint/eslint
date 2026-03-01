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
					column: 5,
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
					column: 14,
				},
			],
		},
		{
			code: "while (!!foo) {}",
			output: "while (foo) {}",
			errors: [
				{
					messageId: "unexpectedNegation",
					column: 8,
				},
			],
		},
		{
			code: "!!foo ? bar : baz",
			output: "foo ? bar : baz",
			errors: [
				{
					messageId: "unexpectedNegation",
					column: 1,
				},
			],
		},
		{
			code: "for (; !!foo;) {}",
			output: "for (; foo;) {}",
			errors: [
				{
					messageId: "unexpectedNegation",
					column: 8,
				},
			],
		},
		{
			code: "!!!foo",
			output: "!foo",
			errors: [
				{
					messageId: "unexpectedNegation",
					column: 2,
				},
			],
		},
		{
			code: "Boolean(!!foo)",
			output: "Boolean(foo)",
			errors: [
				{
					messageId: "unexpectedNegation",
					column: 9,
				},
			],
		},
		{
			code: "new Boolean(!!foo)",
			output: "new Boolean(foo)",
			errors: [
				{
					messageId: "unexpectedNegation",
					column: 13,
				},
			],
		},
		{
			code: "if (Boolean(foo)) {}",
			output: "if (foo) {}",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "do {} while (Boolean(foo))",
			output: "do {} while (foo)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (Boolean(foo)) {}",
			output: "while (foo) {}",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "Boolean(foo) ? bar : baz",
			output: "foo ? bar : baz",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "for (; Boolean(foo);) {}",
			output: "for (; foo;) {}",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(foo)",
			output: "!foo",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(foo && bar)",
			output: "!(foo && bar)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(foo + bar)",
			output: "!(foo + bar)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(+foo)",
			output: "!+foo",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(foo())",
			output: "!foo()",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(foo = bar)",
			output: "!(foo = bar)",
			errors: [
				{
					messageId: "unexpectedCall",
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
				},
			],
		},
		{
			code: "!Boolean(foo, bar());",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean((foo, bar()));",
			output: "!(foo, bar());",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean();",
			output: "true;",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!(Boolean());",
			output: "true;",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if (!Boolean()) { foo() }",
			output: "if (true) { foo() }",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (!Boolean()) { foo() }",
			output: "while (true) { foo() }",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "var foo = Boolean() ? bar() : baz()",
			output: "var foo = false ? bar() : baz()",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if (Boolean()) { foo() }",
			output: "if (false) { foo() }",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (Boolean()) { foo() }",
			output: "while (false) { foo() }",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "Boolean(Boolean(foo))",
			output: "Boolean(foo)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "Boolean(!!foo, bar)",
			output: "Boolean(foo, bar)",
			errors: [
				{
					messageId: "unexpectedNegation",
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
				},
			],
		},
		{
			code: "x=!!a ? b : c ",
			output: "x=a ? b : c ",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "void!Boolean()",
			output: "void true",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "void! Boolean()",
			output: "void true",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "typeof!Boolean()",
			output: "typeof true",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "(!Boolean())",
			output: "(true)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "+!Boolean()",
			output: "+true",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "void !Boolean()",
			output: "void true",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "void(!Boolean())",
			output: "void(true)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "void/**/!Boolean()",
			output: "void/**/true",
			errors: [
				{
					messageId: "unexpectedCall",
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
				},
			],
		},
		{
			code: "!!/**/!foo",
			output: null,
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!!/**/foo",
			output: null,
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!!foo/**/",
			output: "!foo/**/",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if(!/**/!foo);",
			output: null,
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "(!!/**/foo ? 1 : 2)",
			output: null,
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!/**/Boolean(foo)",
			output: "!/**/foo",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean/**/(foo)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(/**/foo)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(foo/**/)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(foo)/**/",
			output: "!foo/**/",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if(Boolean/**/(foo));",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "(Boolean(foo/**/) ? 1 : 2)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "/**/!Boolean()",
			output: "/**/true",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!/**/Boolean()",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean/**/()",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(/**/)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean()/**/",
			output: "true/**/",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if(!/**/Boolean());",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "(!Boolean(/**/) ? 1 : 2)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if(/**/Boolean());",
			output: "if(/**/false);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if(Boolean/**/());",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if(Boolean(/**/));",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if(Boolean()/**/);",
			output: "if(false/**/);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "(Boolean/**/() ? 1 : 2)",
			output: null,
			errors: [
				{
					messageId: "unexpectedCall",
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
					column: 5,
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
					column: 5,
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
					column: 6,
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
					column: 12,
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
					column: 14,
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
					column: 8,
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
					column: 1,
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
					column: 8,
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
					column: 2,
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
					column: 9,
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
					column: 13,
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
					column: 10,
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
					column: 24,
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
					column: 5,
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
					column: 5,
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
					column: 6,
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
					column: 12,
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
					column: 14,
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
					column: 8,
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
					column: 1,
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
					column: 8,
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
					column: 2,
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
					column: 9,
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
					column: 13,
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
					column: 10,
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
					column: 24,
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
				},
			],
		},
		{
			code: "Boolean(Boolean((a, b)))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "Boolean((!!(a, b)))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean((Boolean((a, b))))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "Boolean(!(!(a, b)))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean((!(!(a, b))))",
			output: "Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(!!(a = b))",
			output: "Boolean(a = b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean((!!(a = b)))",
			output: "Boolean((a = b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(Boolean(a = b))",
			output: "Boolean(a = b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "Boolean(Boolean((a += b)))",
			output: "Boolean(a += b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "Boolean(!!(a === b))",
			output: "Boolean(a === b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(!!((a !== b)))",
			output: "Boolean(a !== b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(!!a.b)",
			output: "Boolean(a.b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(Boolean((a)))",
			output: "Boolean(a)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "Boolean((!!(a)))",
			output: "Boolean((a))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},

		{
			code: "new Boolean(!!(a, b))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean(Boolean((a, b)))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "new Boolean((!!(a, b)))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean((Boolean((a, b))))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "new Boolean(!(!(a, b)))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean((!(!(a, b))))",
			output: "new Boolean((a, b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean(!!(a = b))",
			output: "new Boolean(a = b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean((!!(a = b)))",
			output: "new Boolean((a = b))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean(Boolean(a = b))",
			output: "new Boolean(a = b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "new Boolean(Boolean((a += b)))",
			output: "new Boolean(a += b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "new Boolean(!!(a === b))",
			output: "new Boolean(a === b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean(!!((a !== b)))",
			output: "new Boolean(a !== b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean(!!a.b)",
			output: "new Boolean(a.b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "new Boolean(Boolean((a)))",
			output: "new Boolean(a)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "new Boolean((!!(a)))",
			output: "new Boolean((a))",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if (!!(a, b));",
			output: "if (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if (Boolean((a, b)));",
			output: "if (a, b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if (!(!(a, b)));",
			output: "if (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if (!!(a = b));",
			output: "if (a = b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if (Boolean(a = b));",
			output: "if (a = b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if (!!(a > b));",
			output: "if (a > b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if (Boolean(a === b));",
			output: "if (a === b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if (!!f(a));",
			output: "if (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if (Boolean(f(a)));",
			output: "if (f(a));",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if (!!(f(a)));",
			output: "if (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if ((!!f(a)));",
			output: "if ((f(a)));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if ((Boolean(f(a))));",
			output: "if ((f(a)));",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "if (!!a);",
			output: "if (a);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "if (Boolean(a));",
			output: "if (a);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (!!(a, b));",
			output: "while (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "while (Boolean((a, b)));",
			output: "while (a, b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (!(!(a, b)));",
			output: "while (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "while (!!(a = b));",
			output: "while (a = b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "while (Boolean(a = b));",
			output: "while (a = b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (!!(a > b));",
			output: "while (a > b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "while (Boolean(a === b));",
			output: "while (a === b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (!!f(a));",
			output: "while (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "while (Boolean(f(a)));",
			output: "while (f(a));",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (!!(f(a)));",
			output: "while (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "while ((!!f(a)));",
			output: "while ((f(a)));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "while ((Boolean(f(a))));",
			output: "while ((f(a)));",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "while (!!a);",
			output: "while (a);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "while (Boolean(a));",
			output: "while (a);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "do {} while (!!(a, b));",
			output: "do {} while (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "do {} while (Boolean((a, b)));",
			output: "do {} while (a, b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "do {} while (!(!(a, b)));",
			output: "do {} while (a, b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "do {} while (!!(a = b));",
			output: "do {} while (a = b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "do {} while (Boolean(a = b));",
			output: "do {} while (a = b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "do {} while (!!(a > b));",
			output: "do {} while (a > b);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "do {} while (Boolean(a === b));",
			output: "do {} while (a === b);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "do {} while (!!f(a));",
			output: "do {} while (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "do {} while (Boolean(f(a)));",
			output: "do {} while (f(a));",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "do {} while (!!(f(a)));",
			output: "do {} while (f(a));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "do {} while ((!!f(a)));",
			output: "do {} while ((f(a)));",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "do {} while ((Boolean(f(a))));",
			output: "do {} while ((f(a)));",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "do {} while (!!a);",
			output: "do {} while (a);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "do {} while (Boolean(a));",
			output: "do {} while (a);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "for (; !!(a, b););",
			output: "for (; a, b;);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "for (; Boolean((a, b)););",
			output: "for (; a, b;);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "for (; !(!(a, b)););",
			output: "for (; a, b;);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "for (; !!(a = b););",
			output: "for (; a = b;);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "for (; Boolean(a = b););",
			output: "for (; a = b;);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "for (; !!(a > b););",
			output: "for (; a > b;);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "for (; Boolean(a === b););",
			output: "for (; a === b;);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "for (; !!f(a););",
			output: "for (; f(a););",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "for (; Boolean(f(a)););",
			output: "for (; f(a););",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "for (; !!(f(a)););",
			output: "for (; f(a););",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "for (; (!!f(a)););",
			output: "for (; (f(a)););",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "for (; (Boolean(f(a))););",
			output: "for (; (f(a)););",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "for (; !!a;);",
			output: "for (; a;);",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "for (; Boolean(a););",
			output: "for (; a;);",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!(a, b) ? c : d",
			output: "(a, b) ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "(!!(a, b)) ? c : d",
			output: "(a, b) ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean((a, b)) ? c : d",
			output: "(a, b) ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!(a = b) ? c : d",
			output: "(a = b) ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(a -= b) ? c : d",
			output: "(a -= b) ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "(Boolean((a *= b))) ? c : d",
			output: "(a *= b) ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!(a ? b : c) ? d : e",
			output: "(a ? b : c) ? d : e",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(a ? b : c) ? d : e",
			output: "(a ? b : c) ? d : e",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!(a || b) ? c : d",
			output: "a || b ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(a && b) ? c : d",
			output: "a && b ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!(a === b) ? c : d",
			output: "a === b ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(a < b) ? c : d",
			output: "a < b ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!((a !== b)) ? c : d",
			output: "a !== b ? c : d",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean((a >= b)) ? c : d",
			output: "a >= b ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!+a ? b : c",
			output: "+a ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!+(a) ? b : c",
			output: "+(a) ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(!a) ? b : c",
			output: "!a ? b : c",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!f(a) ? b : c",
			output: "f(a) ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "(!!f(a)) ? b : c",
			output: "(f(a)) ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(a.b) ? c : d",
			output: "a.b ? c : d",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!a ? b : c",
			output: "a ? b : c",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "Boolean(a) ? b : c",
			output: "a ? b : c",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!(a, b)",
			output: "!(a, b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!Boolean((a, b))",
			output: "!(a, b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!(a = b)",
			output: "!(a = b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!(!(a += b))",
			output: "!(a += b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!(!!(a += b))",
			output: "!(a += b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!Boolean(a -= b)",
			output: "!(a -= b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean((a -= b))",
			output: "!(a -= b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!(Boolean(a -= b))",
			output: "!(a -= b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!(a || b)",
			output: "!(a || b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!Boolean(a || b)",
			output: "!(a || b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!(a && b)",
			output: "!(a && b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!Boolean(a && b)",
			output: "!(a && b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!(a != b)",
			output: "!(a != b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!!(a === b)",
			output: "!(a === b)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "var x = !Boolean(a > b)",
			output: "var x = !(a > b)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!(a - b)",
			output: "!(a - b)",
			errors: [
				{
					messageId: "unexpectedNegation",
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
				},
			],
		},
		{
			code: "!!!!a",
			output: "!!a", // Reports 2 errors. After the first fix, the second error will disappear.
			errors: [
				{
					messageId: "unexpectedNegation",
				},
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!(!(!a))",
			output: "!!a", // Reports 2 errors. After the first fix, the second error will disappear.
			errors: [
				{
					messageId: "unexpectedNegation",
				},
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!Boolean(!a)",
			output: "!!a",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean((!a))",
			output: "!!a",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(!(a))",
			output: "!!(a)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!(Boolean(!a))",
			output: "!(!a)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!+a",
			output: "!+a",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!!(+a)",
			output: "!+a",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!(!+a)",
			output: "!+a",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!(!!+a)",
			output: "!(+a)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!Boolean((-a))",
			output: "!-a",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!Boolean(-(a))",
			output: "!-(a)",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!(--a)",
			output: "!--a",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!Boolean(a++)",
			output: "!a++",
			errors: [
				{
					messageId: "unexpectedCall",
				},
			],
		},
		{
			code: "!!!f(a)",
			output: "!f(a)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!!(f(a))",
			output: "!f(a)",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!!!a",
			output: "!a",
			errors: [
				{
					messageId: "unexpectedNegation",
				},
			],
		},
		{
			code: "!Boolean(a)",
			output: "!a",
			errors: [
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
			],
		},

		// Optional chaining
		{
			code: "if (Boolean?.(foo)) {};",
			output: "if (foo) {};",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if (Boolean?.(a ?? b) || c) {}",
			output: "if ((a ?? b) || c) {}",
			options: [{ enforceForLogicalOperands: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpectedCall" }],
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
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if ((1, 2, Boolean(3))) {}",
			output: "if ((1, 2, 3)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if (a ?? Boolean(b)) {}",
			output: "if (a ?? b) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if ((a, b, c ?? (d, e, f ?? Boolean(g)))) {}",
			output: "if ((a, b, c ?? (d, e, f ?? g))) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if (!!(a, b) || !!(c, d)) {}",
			output: "if ((a, b) || (c, d)) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{
					messageId: "unexpectedNegation",
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedNegation",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
				{
					messageId: "unexpectedCall",
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
				},
			],
		},
		{
			code: "if (Boolean?.(a ?? b) || c) {}",
			output: "if ((a ?? b) || c) {}",
			options: [{ enforceForInnerExpressions: true }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if (a ? Boolean(b) : c) {}",
			output: "if (a ? b : c) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if (a ? b : Boolean(c)) {}",
			output: "if (a ? b : c) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if (a ? b : Boolean(c ? d : e)) {}",
			output: "if (a ? b : c ? d : e) {}",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "const ternary = Boolean(bar ? !!baz : bat);",
			output: "const ternary = Boolean(bar ? baz : bat);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedNegation" }],
		},
		{
			code: "const commaOperator = Boolean((bar, baz, !!bat));",
			output: "const commaOperator = Boolean((bar, baz, bat));",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedNegation" }],
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
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "const nullishCoalescingOperator = Boolean(bar ?? Boolean(baz));",
			output: "const nullishCoalescingOperator = Boolean(bar ?? baz);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [{ messageId: "unexpectedCall" }],
		},
		{
			code: "if (a ? Boolean(b = c) : Boolean(d = e));",
			output: "if (a ? b = c : d = e);",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{ messageId: "unexpectedCall" },
				{ messageId: "unexpectedCall" },
			],
		},
		{
			code: "if (a ? Boolean((b, c)) : Boolean((d, e)));",
			output: "if (a ? (b, c) : (d, e));",
			options: [{ enforceForInnerExpressions: true }],
			errors: [
				{ messageId: "unexpectedCall" },
				{ messageId: "unexpectedCall" },
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
			errors: [{ messageId: "unexpectedCall" }],
		},
	],
});
