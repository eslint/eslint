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
        },
        {
            code: "if (!!foo ?? bar) {}",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2020 }
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
        },

        // test parentheses in autofix
        {
            code: "Boolean(!!(a, b))",
            output: "Boolean((a, b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(Boolean((a, b)))",
            output: "Boolean((a, b))",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "Boolean((!!(a, b)))",
            output: "Boolean((a, b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean((Boolean((a, b))))",
            output: "Boolean((a, b))",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "Boolean(!(!(a, b)))",
            output: "Boolean((a, b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean((!(!(a, b))))",
            output: "Boolean((a, b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(!!(a = b))",
            output: "Boolean(a = b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean((!!(a = b)))",
            output: "Boolean((a = b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(Boolean(a = b))",
            output: "Boolean(a = b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "Boolean(Boolean((a += b)))",
            output: "Boolean(a += b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "Boolean(!!(a === b))",
            output: "Boolean(a === b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(!!((a !== b)))",
            output: "Boolean(a !== b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(!!a.b)",
            output: "Boolean(a.b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(Boolean((a)))",
            output: "Boolean(a)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "Boolean((!!(a)))",
            output: "Boolean((a))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },

        {
            code: "new Boolean(!!(a, b))",
            output: "new Boolean((a, b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean(Boolean((a, b)))",
            output: "new Boolean((a, b))",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "new Boolean((!!(a, b)))",
            output: "new Boolean((a, b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean((Boolean((a, b))))",
            output: "new Boolean((a, b))",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "new Boolean(!(!(a, b)))",
            output: "new Boolean((a, b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean((!(!(a, b))))",
            output: "new Boolean((a, b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean(!!(a = b))",
            output: "new Boolean(a = b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean((!!(a = b)))",
            output: "new Boolean((a = b))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean(Boolean(a = b))",
            output: "new Boolean(a = b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "new Boolean(Boolean((a += b)))",
            output: "new Boolean(a += b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "new Boolean(!!(a === b))",
            output: "new Boolean(a === b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean(!!((a !== b)))",
            output: "new Boolean(a !== b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean(!!a.b)",
            output: "new Boolean(a.b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "new Boolean(Boolean((a)))",
            output: "new Boolean(a)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "new Boolean((!!(a)))",
            output: "new Boolean((a))",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if (!!(a, b));",
            output: "if (a, b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if (Boolean((a, b)));",
            output: "if (a, b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "if (!(!(a, b)));",
            output: "if (a, b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if (!!(a = b));",
            output: "if (a = b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if (Boolean(a = b));",
            output: "if (a = b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "if (!!(a > b));",
            output: "if (a > b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if (Boolean(a === b));",
            output: "if (a === b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "if (!!f(a));",
            output: "if (f(a));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if (Boolean(f(a)));",
            output: "if (f(a));",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "if (!!(f(a)));",
            output: "if (f(a));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if ((!!f(a)));",
            output: "if ((f(a)));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if ((Boolean(f(a))));",
            output: "if ((f(a)));",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "if (!!a);",
            output: "if (a);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "if (Boolean(a));",
            output: "if (a);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "while (!!(a, b));",
            output: "while (a, b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "while (Boolean((a, b)));",
            output: "while (a, b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "while (!(!(a, b)));",
            output: "while (a, b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "while (!!(a = b));",
            output: "while (a = b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "while (Boolean(a = b));",
            output: "while (a = b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "while (!!(a > b));",
            output: "while (a > b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "while (Boolean(a === b));",
            output: "while (a === b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "while (!!f(a));",
            output: "while (f(a));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "while (Boolean(f(a)));",
            output: "while (f(a));",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "while (!!(f(a)));",
            output: "while (f(a));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "while ((!!f(a)));",
            output: "while ((f(a)));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "while ((Boolean(f(a))));",
            output: "while ((f(a)));",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "while (!!a);",
            output: "while (a);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "while (Boolean(a));",
            output: "while (a);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "do {} while (!!(a, b));",
            output: "do {} while (a, b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "do {} while (Boolean((a, b)));",
            output: "do {} while (a, b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "do {} while (!(!(a, b)));",
            output: "do {} while (a, b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "do {} while (!!(a = b));",
            output: "do {} while (a = b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "do {} while (Boolean(a = b));",
            output: "do {} while (a = b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "do {} while (!!(a > b));",
            output: "do {} while (a > b);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "do {} while (Boolean(a === b));",
            output: "do {} while (a === b);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "do {} while (!!f(a));",
            output: "do {} while (f(a));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "do {} while (Boolean(f(a)));",
            output: "do {} while (f(a));",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "do {} while (!!(f(a)));",
            output: "do {} while (f(a));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "do {} while ((!!f(a)));",
            output: "do {} while ((f(a)));",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "do {} while ((Boolean(f(a))));",
            output: "do {} while ((f(a)));",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "do {} while (!!a);",
            output: "do {} while (a);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "do {} while (Boolean(a));",
            output: "do {} while (a);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "for (; !!(a, b););",
            output: "for (; a, b;);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "for (; Boolean((a, b)););",
            output: "for (; a, b;);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "for (; !(!(a, b)););",
            output: "for (; a, b;);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "for (; !!(a = b););",
            output: "for (; a = b;);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "for (; Boolean(a = b););",
            output: "for (; a = b;);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "for (; !!(a > b););",
            output: "for (; a > b;);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "for (; Boolean(a === b););",
            output: "for (; a === b;);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "for (; !!f(a););",
            output: "for (; f(a););",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "for (; Boolean(f(a)););",
            output: "for (; f(a););",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "for (; !!(f(a)););",
            output: "for (; f(a););",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "for (; (!!f(a)););",
            output: "for (; (f(a)););",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "for (; (Boolean(f(a))););",
            output: "for (; (f(a)););",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "for (; !!a;);",
            output: "for (; a;);",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "for (; Boolean(a););",
            output: "for (; a;);",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!(a, b) ? c : d",
            output: "(a, b) ? c : d",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "(!!(a, b)) ? c : d",
            output: "(a, b) ? c : d",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean((a, b)) ? c : d",
            output: "(a, b) ? c : d",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!(a = b) ? c : d",
            output: "(a = b) ? c : d",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(a -= b) ? c : d",
            output: "(a -= b) ? c : d",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "(Boolean((a *= b))) ? c : d",
            output: "(a *= b) ? c : d",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!(a ? b : c) ? d : e",
            output: "(a ? b : c) ? d : e",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(a ? b : c) ? d : e",
            output: "(a ? b : c) ? d : e",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!(a || b) ? c : d",
            output: "a || b ? c : d",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(a && b) ? c : d",
            output: "a && b ? c : d",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!(a === b) ? c : d",
            output: "a === b ? c : d",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(a < b) ? c : d",
            output: "a < b ? c : d",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!((a !== b)) ? c : d",
            output: "a !== b ? c : d",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean((a >= b)) ? c : d",
            output: "a >= b ? c : d",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!+a ? b : c",
            output: "+a ? b : c",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!!+(a) ? b : c",
            output: "+(a) ? b : c",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(!a) ? b : c",
            output: "!a ? b : c",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!f(a) ? b : c",
            output: "f(a) ? b : c",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "(!!f(a)) ? b : c",
            output: "(f(a)) ? b : c",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(a.b) ? c : d",
            output: "a.b ? c : d",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!a ? b : c",
            output: "a ? b : c",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "Boolean(a) ? b : c",
            output: "a ? b : c",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!(a, b)",
            output: "!(a, b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!Boolean((a, b))",
            output: "!(a, b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!(a = b)",
            output: "!(a = b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!!(!(a += b))",
            output: "!(a += b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!(!!(a += b))",
            output: "!(a += b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!Boolean(a -= b)",
            output: "!(a -= b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!Boolean((a -= b))",
            output: "!(a -= b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!(Boolean(a -= b))",
            output: "!(a -= b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!(a || b)",
            output: "!(a || b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!Boolean(a || b)",
            output: "!(a || b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!(a && b)",
            output: "!(a && b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!Boolean(a && b)",
            output: "!(a && b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!(a != b)",
            output: "!(a != b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!!!(a === b)",
            output: "!(a === b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "var x = !Boolean(a > b)",
            output: "var x = !(a > b)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!(a - b)",
            output: "!(a - b)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!!!(a ** b)",
            output: "!(a ** b)",
            parserOptions: { ecmaVersion: 2016 },
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!Boolean(a ** b)",
            output: "!(a ** b)",
            parserOptions: { ecmaVersion: 2016 },
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "async function f() { !!!(await a) }",
            output: "async function f() { !await a }",
            parserOptions: { ecmaVersion: 2017 },
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "async function f() { !Boolean(await a) }",
            output: "async function f() { !await a }",
            parserOptions: { ecmaVersion: 2017 },
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!!a",
            output: "!!a", // Reports 2 errors. After the first fix, the second error will disappear.
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "!!(!(!a))",
            output: "!!a", // Reports 2 errors. After the first fix, the second error will disappear.
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "!Boolean(!a)",
            output: "!!a",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!Boolean((!a))",
            output: "!!a",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!Boolean(!(a))",
            output: "!!(a)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!(Boolean(!a))",
            output: "!(!a)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!+a",
            output: "!+a",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!!!(+a)",
            output: "!+a",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!!(!+a)",
            output: "!+a",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!(!!+a)",
            output: "!(+a)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!Boolean((-a))",
            output: "!-a",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!Boolean(-(a))",
            output: "!-(a)",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!(--a)",
            output: "!--a",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!Boolean(a++)",
            output: "!a++",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "!!!f(a)",
            output: "!f(a)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!!!(f(a))",
            output: "!f(a)",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!!!a",
            output: "!a",
            errors: [{ messageId: "unexpectedNegation", type: "UnaryExpression" }]
        },
        {
            code: "!Boolean(a)",
            output: "!a",
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },
        {
            code: "if (!!(a, b) || !!(c, d)) {}",
            output: "if ((a, b) || (c, d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean((a, b)) || Boolean((c, d))) {}",
            output: "if ((a, b) || (c, d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if ((!!((a, b))) || (!!((c, d)))) {}",
            output: "if ((a, b) || (c, d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (!!(a, b) && !!(c, d)) {}",
            output: "if ((a, b) && (c, d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean((a, b)) && Boolean((c, d))) {}",
            output: "if ((a, b) && (c, d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if ((!!((a, b))) && (!!((c, d)))) {}",
            output: "if ((a, b) && (c, d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (!!(a = b) || !!(c = d)) {}",
            output: "if ((a = b) || (c = d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a /= b) || Boolean(c /= d)) {}",
            output: "if ((a /= b) || (c /= d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a >>= b) && !!(c >>= d)) {}",
            output: "if ((a >>= b) && (c >>= d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a **= b) && Boolean(c **= d)) {}",
            output: "if ((a **= b) && (c **= d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2016 },
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a ? b : c) || !!(d ? e : f)) {}",
            output: "if ((a ? b : c) || (d ? e : f)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a ? b : c) || Boolean(d ? e : f)) {}",
            output: "if ((a ? b : c) || (d ? e : f)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a ? b : c) && !!(d ? e : f)) {}",
            output: "if ((a ? b : c) && (d ? e : f)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a ? b : c) && Boolean(d ? e : f)) {}",
            output: "if ((a ? b : c) && (d ? e : f)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a || b) || !!(c || d)) {}",
            output: "if (a || b || (c || d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a || b) || Boolean(c || d)) {}",
            output: "if (a || b || (c || d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a || b) && !!(c || d)) {}",
            output: "if ((a || b) && (c || d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a || b) && Boolean(c || d)) {}",
            output: "if ((a || b) && (c || d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a && b) || !!(c && d)) {}",
            output: "if (a && b || c && d) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a && b) || Boolean(c && d)) {}",
            output: "if (a && b || c && d) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a && b) && !!(c && d)) {}",
            output: "if (a && b && (c && d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a && b) && Boolean(c && d)) {}",
            output: "if (a && b && (c && d)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a !== b) || !!(c !== d)) {}",
            output: "if (a !== b || c !== d) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a != b) || Boolean(c != d)) {}",
            output: "if (a != b || c != d) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!(a === b) && !!(c === d)) {}",
            output: "if (a === b && c === d) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (!!(a > b) || !!(c < d)) {}",
            output: "if (a > b || c < d) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(!a) || Boolean(+b)) {}",
            output: "if (!a || +b) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if (!!f(a) && !!b.c) {}",
            output: "if (f(a) && b.c) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (Boolean(a) || !!b) {}",
            output: "if (a || b) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedCall", type: "CallExpression" },
                { messageId: "unexpectedNegation", type: "UnaryExpression" }
            ]
        },
        {
            code: "if (!!a && Boolean(b)) {}",
            output: "if (a && b) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },
        {
            code: "if ((!!a) || (Boolean(b))) {}",
            output: "if ((a) || (b)) {}",
            options: [{ enforceForLogicalOperands: true }],
            errors: [
                { messageId: "unexpectedNegation", type: "UnaryExpression" },
                { messageId: "unexpectedCall", type: "CallExpression" }
            ]
        },

        {
            code: "if (Boolean(a ?? b) || c) {}",
            output: "if ((a ?? b) || c) {}",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall", type: "CallExpression" }]
        },

        // Optional chaining
        {
            code: "if (Boolean?.(foo)) ;",
            output: "if (foo) ;",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall" }]
        },
        {
            code: "if (Boolean?.(a ?? b) || c) {}",
            output: "if ((a ?? b) || c) {}",
            options: [{ enforceForLogicalOperands: true }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedCall" }]
        }
    ]
});
