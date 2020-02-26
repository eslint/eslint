/**
 * @fileoverview Tests for no-extra-boolean-cast rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-boolean-cast"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
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
        {
            code: "var foo = bar || !!baz",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "var foo = bar && !!baz",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "var foo = bar || (baz && !!bat)",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "function foo() { return (!!bar || baz); }",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "var foo = bar() ? (!!baz && bat) : (!!bat && qux)",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "for(!!(foo && bar);;) {}",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "for(;; !!(foo || bar)) {}",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "var foo = Boolean(bar) || baz;",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "var foo = bar || Boolean(baz);",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "var foo = Boolean(bar) || Boolean(baz);",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "function foo() { return (Boolean(bar) || baz); }",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "var foo = bar() ? Boolean(baz) || bat : Boolean(bat)",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "for(Boolean(foo) || bar;;) {}",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "for(;; Boolean(foo) || bar) {}",
            options: [{ enforceForLogicalOperands: true }]
        },
        {
            code: "if (new Boolean(foo) || bar) {}",
            options: [{ enforceForLogicalOperands: true }]
        },
        "if (!!foo || bar) {}",
        {
            code: "if (!!foo || bar) {}",
            options: [{}]
        },
        {
            code: "if (!!foo || bar) {}",
            options: [{ enforceForLogicalOperands: false }]
        },
        {
            code: "if ((!!foo || bar) === baz) {}",
            options: [{ enforceForLogicalOperands: true }]
        }
    ],

    invalid: [
        {
            code: "if (!!foo) {}",
            output: "if (foo) {}",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 5,
                endColumn: 10
            }]
        },
        {
            code: "do {} while (!!foo)",
            output: "do {} while (foo)",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 14
            }]
        },
        {
            code: "while (!!foo) {}",
            output: "while (foo) {}",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 8
            }]
        },
        {
            code: "!!foo ? bar : baz",
            output: "foo ? bar : baz",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 1
            }]
        },
        {
            code: "for (; !!foo;) {}",
            output: "for (; foo;) {}",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 8
            }]
        },
        {
            code: "!!!foo",
            output: "!foo",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 2
            }]
        },
        {
            code: "Boolean(!!foo)",
            output: "Boolean(foo)",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 9
            }]
        },
        {
            code: "new Boolean(!!foo)",
            output: "new Boolean(foo)",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 13
            }]
        },
        {
            code: "if (Boolean(foo)) {}",
            output: "if (foo) {}",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "do {} while (Boolean(foo))",
            output: "do {} while (foo)",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "while (Boolean(foo)) {}",
            output: "while (foo) {}",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "Boolean(foo) ? bar : baz",
            output: "foo ? bar : baz",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "for (; Boolean(foo);) {}",
            output: "for (; foo;) {}",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo)",
            output: "!foo",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo && bar)",
            output: "!(foo && bar)",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo + bar)",
            output: "!(foo + bar)",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(+foo)",
            output: "!+foo",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo())",
            output: "!foo()",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo = bar)",
            output: "!(foo = bar)",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(...foo);",
            output: null,
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo, bar());",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean((foo, bar()));",
            output: "!(foo, bar());",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean();",
            output: "true;",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!(Boolean());",
            output: "true;",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if (!Boolean()) { foo() }",
            output: "if (true) { foo() }",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "while (!Boolean()) { foo() }",
            output: "while (true) { foo() }",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "var foo = Boolean() ? bar() : baz()",
            output: "var foo = false ? bar() : baz()",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if (Boolean()) { foo() }",
            output: "if (false) { foo() }",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "while (Boolean()) { foo() }",
            output: "while (false) { foo() }",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "Boolean(Boolean(foo))",
            output: "Boolean(foo)",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "Boolean(!!foo, bar)",
            output: "Boolean(foo, bar)",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },


        // Adjacent tokens tests
        {
            code: "function *foo() { yield!!a ? b : c }",
            output: "function *foo() { yield a ? b : c }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield!! a ? b : c }",
            output: "function *foo() { yield a ? b : c }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield! !a ? b : c }",
            output: "function *foo() { yield a ? b : c }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield !!a ? b : c }",
            output: "function *foo() { yield a ? b : c }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield(!!a) ? b : c }",
            output: "function *foo() { yield(a) ? b : c }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield/**/!!a ? b : c }",
            output: "function *foo() { yield/**/a ? b : c }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "x=!!a ? b : c ",
            output: "x=a ? b : c ",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "void!Boolean()",
            output: "void true",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "void! Boolean()",
            output: "void true",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "typeof!Boolean()",
            output: "typeof true",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(!Boolean())",
            output: "(true)",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "+!Boolean()",
            output: "+true",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "void !Boolean()",
            output: "void true",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "void(!Boolean())",
            output: "void(true)",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "void/**/!Boolean()",
            output: "void/**/true",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },

        // Comments tests
        {
            code: "!/**/!!foo",
            output: "!/**/foo",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!/**/!foo",
            output: null,
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!!/**/foo",
            output: null,
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!!foo/**/",
            output: "!foo/**/",
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "if(!/**/!foo);",
            output: null,
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "(!!/**/foo ? 1 : 2)",
            output: null,
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!/**/Boolean(foo)",
            output: "!/**/foo",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean/**/(foo)",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(/**/foo)",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo/**/)",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo)/**/",
            output: "!foo/**/",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(Boolean/**/(foo));",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(Boolean(foo/**/) ? 1 : 2)",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "/**/!Boolean()",
            output: "/**/true",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!/**/Boolean()",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean/**/()",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(/**/)",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean()/**/",
            output: "true/**/",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(!/**/Boolean());",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(!Boolean(/**/) ? 1 : 2)",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(/**/Boolean());",
            output: "if(/**/false);",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(Boolean/**/());",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(Boolean(/**/));",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(Boolean()/**/);",
            output: "if(false/**/);",
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(Boolean/**/() ? 1 : 2)",
            output: null,
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },


        // In Logical context
        {
            code: "if (!!foo || bar) {}",
            output: "if (foo || bar) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 5,
                endColumn: 10
            }]
        },
        {
            code: "if (!!foo && bar) {}",
            output: "if (foo && bar) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 5,
                endColumn: 10
            }]
        },

        {
            code: "if ((!!foo || bar) && bat) {}",
            output: "if ((foo || bar) && bat) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 6,
                endColumn: 11
            }]
        },
        {
            code: "if (foo && !!bar) {}",
            output: "if (foo && bar) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 12,
                endColumn: 17
            }]
        },
        {
            code: "do {} while (!!foo || bar)",
            output: "do {} while (foo || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 14
            }]
        },
        {
            code: "while (!!foo || bar) {}",
            output: "while (foo || bar) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 8
            }]
        },
        {
            code: "!!foo && bat ? bar : baz",
            output: "foo && bat ? bar : baz",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 1
            }]
        },
        {
            code: "for (; !!foo || bar;) {}",
            output: "for (; foo || bar;) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 8
            }]
        },
        {
            code: "!!!foo || bar",
            output: "!foo || bar",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 2
            }]
        },
        {
            code: "Boolean(!!foo || bar)",
            output: "Boolean(foo || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 9
            }]
        },
        {
            code: "new Boolean(!!foo || bar)",
            output: "new Boolean(foo || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 13
            }]
        },
        {
            code: "if (Boolean(foo) || bar) {}",
            output: "if (foo || bar) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "do {} while (Boolean(foo) || bar)",
            output: "do {} while (foo || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "while (Boolean(foo) || bar) {}",
            output: "while (foo || bar) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "Boolean(foo) || bat ? bar : baz",
            output: "foo || bat ? bar : baz",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "for (; Boolean(foo) || bar;) {}",
            output: "for (; foo || bar;) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo) || bar",
            output: "!foo || bar",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo && bar) || bat",
            output: "!(foo && bar) || bat",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo + bar) || bat",
            output: "!(foo + bar) || bat",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(+foo)  || bar",
            output: "!+foo  || bar",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo()) || bar",
            output: "!foo() || bar",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo() || bar)",
            output: "!(foo() || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo = bar) || bat",
            output: "!(foo = bar) || bat",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(...foo) || bar;",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo, bar()) || bar;",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean((foo, bar()) || bat);",
            output: "!((foo, bar()) || bat);",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean() || bar;",
            output: "true || bar;",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!(Boolean()) || bar;",
            output: "true || bar;",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if (!Boolean() || bar) { foo() }",
            output: "if (true || bar) { foo() }",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "while (!Boolean() || bar) { foo() }",
            output: "while (true || bar) { foo() }",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "var foo = Boolean() || bar ? bar() : baz()",
            output: "var foo = false || bar ? bar() : baz()",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if (Boolean() || bar) { foo() }",
            output: "if (false || bar) { foo() }",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "while (Boolean() || bar) { foo() }",
            output: "while (false || bar) { foo() }",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },


        // Adjacent tokens tests
        {
            code: "function *foo() { yield(!!a || d) ? b : c }",
            output: "function *foo() { yield(a || d) ? b : c }",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield(!! a || d) ? b : c }",
            output: "function *foo() { yield(a || d) ? b : c }",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield(! !a || d) ? b : c }",
            output: "function *foo() { yield(a || d) ? b : c }",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield (!!a || d) ? b : c }",
            output: "function *foo() { yield (a || d) ? b : c }",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "function *foo() { yield/**/(!!a || d) ? b : c }",
            output: "function *foo() { yield/**/(a || d) ? b : c }",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "x=!!a || d ? b : c ",
            output: "x=a || d ? b : c ",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "void(!Boolean() || bar)",
            output: "void(true || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "void(! Boolean() || bar)",
            output: "void(true || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "typeof(!Boolean() || bar)",
            output: "typeof(true || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(!Boolean() || bar)",
            output: "(true || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "void/**/(!Boolean() || bar)",
            output: "void/**/(true || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },

        // Comments tests
        {
            code: "!/**/(!!foo || bar)",
            output: "!/**/(foo || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!/**/!foo || bar",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!!!/**/foo || bar",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!(!!foo || bar)/**/",
            output: "!(foo || bar)/**/",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "if(!/**/!foo || bar);",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "(!!/**/foo || bar ? 1 : 2)",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression"
            }]
        },
        {
            code: "!/**/(Boolean(foo) || bar)",
            output: "!/**/(foo || bar)",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean/**/(foo) || bar",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(/**/foo) || bar",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(foo/**/) || bar",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!(Boolean(foo)|| bar)/**/",
            output: "!(foo|| bar)/**/",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(Boolean/**/(foo) || bar);",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(Boolean(foo/**/)|| bar ? 1 : 2)",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "/**/!Boolean()|| bar",
            output: "/**/true|| bar",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!/**/Boolean()|| bar",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean/**/()|| bar",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "!Boolean(/**/)|| bar",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(!Boolean()|| bar)/**/",
            output: "(true|| bar)/**/",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(!/**/Boolean()|| bar);",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(!Boolean(/**/) || bar ? 1 : 2)",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(/**/Boolean()|| bar);",
            output: "if(/**/false|| bar);",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(Boolean/**/()|| bar);",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(Boolean(/**/)|| bar);",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if(Boolean()|| bar/**/);",
            output: "if(false|| bar/**/);",
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "(Boolean/**/()|| bar ? 1 : 2)",
            output: null,
            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedCall",
                type: "CallExpression"
            }]
        },
        {
            code: "if (a && !!(b ? c : d)){}",
            output: "if (a && (b ? c : d)){}",

            options: [{ enforceForLogicalOperands: true }],
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 10,
                endColumn: 23
            }]
        },
        {
            code: "function *foo() { yield!!a || d ? b : c }",
            output: "function *foo() { yield a || d ? b : c }",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpectedNegation",
                type: "UnaryExpression",
                column: 24,
                endColumn: 27
            }]
        }
    ]
});
