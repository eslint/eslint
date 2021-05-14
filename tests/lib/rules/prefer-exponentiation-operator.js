/**
 * @fileoverview Tests for the prefer-exponentiation-operator rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-exponentiation-operator");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Create an object for the invalid array
 * @param {string} code source code
 * @param {string} output fixed source code
 * @returns {Object} result object
 * @private
 */
function invalid(code, output) {
    return {
        code,
        output,
        errors: [
            {
                messageId: "useExponentiation",
                type: "CallExpression"
            }
        ]
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

ruleTester.run("prefer-exponentiation-operator", rule, {
    valid: [

        // not Math.pow()
        "Object.pow(a, b)",
        "Math.max(a, b)",
        "Math",
        "Math(a, b)",
        "pow",
        "pow(a, b)",
        "Math.pow",
        "Math.Pow(a, b)",
        "math.pow(a, b)",
        "foo.Math.pow(a, b)",
        "new Math.pow(a, b)",
        "Math[pow](a, b)",
        { code: "globalThis.Object.pow(a, b)", env: { es2020: true } },
        { code: "globalThis.Math.max(a, b)", env: { es2020: true } },

        // not the global Math
        "/* globals Math:off*/ Math.pow(a, b)",
        "let Math; Math.pow(a, b);",
        "if (foo) { const Math = 1; Math.pow(a, b); }",
        "var x = function Math() { Math.pow(a, b); }",
        "function foo(Math) { Math.pow(a, b); }",
        "function foo() { Math.pow(a, b); var Math; }",

        "globalThis.Math.pow(a, b)",
        { code: "globalThis.Math.pow(a, b)", env: { es6: true } },
        { code: "globalThis.Math.pow(a, b)", env: { es2017: true } },
        {
            code: `
                var globalThis = bar;
                globalThis.Math.pow(a, b)
            `,
            env: { es2020: true }
        },

        "class C { #pow; foo() { Math.#pow(a, b); } }"
    ],

    invalid: [

        invalid("Math.pow(a, b)", "a**b"),
        invalid("(Math).pow(a, b)", "a**b"),
        invalid("Math['pow'](a, b)", "a**b"),
        invalid("(Math)['pow'](a, b)", "a**b"),
        invalid("var x=Math\n.  pow( a, \n b )", "var x=a**b"),
        {
            code: "globalThis.Math.pow(a, b)",
            output: "a**b",
            env: { es2020: true },
            errors: [
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 26
                }
            ]
        },
        {
            code: "globalThis.Math['pow'](a, b)",
            output: "a**b",
            env: { es2020: true },
            errors: [
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 29
                }
            ]
        },

        // able to catch some workarounds
        invalid("Math[`pow`](a, b)", "a**b"),
        invalid("Math[`${'pow'}`](a, b)", "a**b"),
        invalid("Math['p' + 'o' + 'w'](a, b)", "a**b"),

        // non-expression parents that don't require parens
        invalid("var x = Math.pow(a, b);", "var x = a**b;"),
        invalid("if(Math.pow(a, b)){}", "if(a**b){}"),
        invalid("for(;Math.pow(a, b);){}", "for(;a**b;){}"),
        invalid("switch(foo){ case Math.pow(a, b): break; }", "switch(foo){ case a**b: break; }"),
        invalid("{ foo: Math.pow(a, b) }", "{ foo: a**b }"),
        invalid("function foo(bar, baz = Math.pow(a, b), quux){}", "function foo(bar, baz = a**b, quux){}"),
        invalid("`${Math.pow(a, b)}`", "`${a**b}`"),

        // non-expression parents that do require parens
        invalid("class C extends Math.pow(a, b) {}", "class C extends (a**b) {}"),

        // parents with a higher precedence
        invalid("+ Math.pow(a, b)", "+ (a**b)"),
        invalid("- Math.pow(a, b)", "- (a**b)"),
        invalid("! Math.pow(a, b)", "! (a**b)"),
        invalid("typeof Math.pow(a, b)", "typeof (a**b)"),
        invalid("void Math.pow(a, b)", "void (a**b)"),
        invalid("Math.pow(a, b) .toString()", "(a**b) .toString()"),
        invalid("Math.pow(a, b) ()", "(a**b) ()"),
        invalid("Math.pow(a, b) ``", "(a**b) ``"),
        invalid("(class extends Math.pow(a, b) {})", "(class extends (a**b) {})"),

        // already parenthesised, shouldn't insert extra parens
        invalid("+(Math.pow(a, b))", "+(a**b)"),
        invalid("(Math.pow(a, b)).toString()", "(a**b).toString()"),
        invalid("(class extends (Math.pow(a, b)) {})", "(class extends (a**b) {})"),
        invalid("class C extends (Math.pow(a, b)) {}", "class C extends (a**b) {}"),

        // parents with a higher precedence, but the expression's role doesn't require parens
        invalid("f(Math.pow(a, b))", "f(a**b)"),
        invalid("f(foo, Math.pow(a, b))", "f(foo, a**b)"),
        invalid("f(Math.pow(a, b), foo)", "f(a**b, foo)"),
        invalid("f(foo, Math.pow(a, b), bar)", "f(foo, a**b, bar)"),
        invalid("new F(Math.pow(a, b))", "new F(a**b)"),
        invalid("new F(foo, Math.pow(a, b))", "new F(foo, a**b)"),
        invalid("new F(Math.pow(a, b), foo)", "new F(a**b, foo)"),
        invalid("new F(foo, Math.pow(a, b), bar)", "new F(foo, a**b, bar)"),
        invalid("obj[Math.pow(a, b)]", "obj[a**b]"),
        invalid("[foo, Math.pow(a, b), bar]", "[foo, a**b, bar]"),

        // parents with a lower precedence
        invalid("a * Math.pow(b, c)", "a * b**c"),
        invalid("Math.pow(a, b) * c", "a**b * c"),
        invalid("a + Math.pow(b, c)", "a + b**c"),
        invalid("Math.pow(a, b)/c", "a**b/c"),
        invalid("a < Math.pow(b, c)", "a < b**c"),
        invalid("Math.pow(a, b) > c", "a**b > c"),
        invalid("a === Math.pow(b, c)", "a === b**c"),
        invalid("a ? Math.pow(b, c) : d", "a ? b**c : d"),
        invalid("a = Math.pow(b, c)", "a = b**c"),
        invalid("a += Math.pow(b, c)", "a += b**c"),
        invalid("function *f() { yield Math.pow(a, b) }", "function *f() { yield a**b }"),
        invalid("a, Math.pow(b, c), d", "a, b**c, d"),

        // '**' is right-associative, that applies to both parent and child nodes
        invalid("a ** Math.pow(b, c)", "a ** b**c"),
        invalid("Math.pow(a, b) ** c", "(a**b) ** c"),
        invalid("Math.pow(a, b ** c)", "a**b ** c"),
        invalid("Math.pow(a ** b, c)", "(a ** b)**c"),
        invalid("a ** Math.pow(b ** c, d ** e) ** f", "a ** ((b ** c)**d ** e) ** f"),

        // doesn't remove already existing unnecessary parens around the whole expression
        invalid("(Math.pow(a, b))", "(a**b)"),
        invalid("foo + (Math.pow(a, b))", "foo + (a**b)"),
        invalid("(Math.pow(a, b)) + foo", "(a**b) + foo"),
        invalid("`${(Math.pow(a, b))}`", "`${(a**b)}`"),

        // base and exponent with a higher precedence
        invalid("Math.pow(2, 3)", "2**3"),
        invalid("Math.pow(a.foo, b)", "a.foo**b"),
        invalid("Math.pow(a, b.foo)", "a**b.foo"),
        invalid("Math.pow(a(), b)", "a()**b"),
        invalid("Math.pow(a, b())", "a**b()"),
        invalid("Math.pow(++a, ++b)", "++a**++b"),
        invalid("Math.pow(a++, ++b)", "a++**++b"),
        invalid("Math.pow(a--, b--)", "a--**b--"),
        invalid("Math.pow(--a, b--)", "--a**b--"),

        // doesn't preserve unnecessary parens around base and exponent
        invalid("Math.pow((a), (b))", "a**b"),
        invalid("Math.pow(((a)), ((b)))", "a**b"),
        invalid("Math.pow((a.foo), b)", "a.foo**b"),
        invalid("Math.pow(a, (b.foo))", "a**b.foo"),
        invalid("Math.pow((a()), b)", "a()**b"),
        invalid("Math.pow(a, (b()))", "a**b()"),

        // unary expressions are exception by the language - parens are required for the base to disambiguate operator precedence
        invalid("Math.pow(+a, b)", "(+a)**b"),
        invalid("Math.pow(a, +b)", "a**+b"),
        invalid("Math.pow(-a, b)", "(-a)**b"),
        invalid("Math.pow(a, -b)", "a**-b"),
        invalid("Math.pow(-2, 3)", "(-2)**3"),
        invalid("Math.pow(2, -3)", "2**-3"),
        invalid("async () => Math.pow(await a, b)", "async () => (await a)**b"),
        invalid("async () => Math.pow(a, await b)", "async () => a**await b"),

        // base and exponent with a lower precedence
        invalid("Math.pow(a * b, c)", "(a * b)**c"),
        invalid("Math.pow(a, b * c)", "a**(b * c)"),
        invalid("Math.pow(a / b, c)", "(a / b)**c"),
        invalid("Math.pow(a, b / c)", "a**(b / c)"),
        invalid("Math.pow(a + b, 3)", "(a + b)**3"),
        invalid("Math.pow(2, a - b)", "2**(a - b)"),
        invalid("Math.pow(a + b, c + d)", "(a + b)**(c + d)"),
        invalid("Math.pow(a = b, c = d)", "(a = b)**(c = d)"),
        invalid("Math.pow(a += b, c -= d)", "(a += b)**(c -= d)"),
        invalid("Math.pow((a, b), (c, d))", "(a, b)**(c, d)"),
        invalid("function *f() { Math.pow(yield, yield) }", "function *f() { (yield)**(yield) }"),

        // doesn't put extra parens
        invalid("Math.pow((a + b), (c + d))", "(a + b)**(c + d)"),

        // tokens that can be adjacent
        invalid("a+Math.pow(b, c)+d", "a+b**c+d"),

        // tokens that cannot be adjacent
        invalid("a+Math.pow(++b, c)", "a+ ++b**c"),
        invalid("(a)+(Math).pow((++b), c)", "(a)+ ++b**c"),
        invalid("Math.pow(a, b)in c", "a**b in c"),
        invalid("Math.pow(a, (b))in (c)", "a**b in (c)"),
        invalid("a+Math.pow(++b, c)in d", "a+ ++b**c in d"),
        invalid("a+Math.pow( ++b, c )in d", "a+ ++b**c in d"),

        // tokens that cannot be adjacent, but there is already space or something else between
        invalid("a+ Math.pow(++b, c) in d", "a+ ++b**c in d"),
        invalid("a+/**/Math.pow(++b, c)/**/in d", "a+/**/++b**c/**/in d"),
        invalid("a+(Math.pow(++b, c))in d", "a+(++b**c)in d"),

        // tokens that cannot be adjacent, but the autofix inserts parens required for precedence, so there is no need for an extra space
        invalid("+Math.pow(++a, b)", "+(++a**b)"),
        invalid("Math.pow(a, b + c)in d", "a**(b + c)in d"),

        {
            code: "Math.pow(a, b) + Math.pow(c,\n d)",
            output: "a**b + c**d",
            errors: [
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    line: 1,
                    column: 18,
                    endLine: 2,
                    endColumn: 4
                }
            ]
        },
        {
            code: "Math.pow(Math.pow(a, b), Math.pow(c, d))",
            output: "Math.pow(a, b)**Math.pow(c, d)", // tests perform only one autofix iteration, below is the following one
            errors: [
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    column: 1,
                    endColumn: 41
                },
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    column: 10,
                    endColumn: 24
                },
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    column: 26,
                    endColumn: 40
                }
            ]
        },
        {
            code: "Math.pow(a, b)**Math.pow(c, d)",
            output: "(a**b)**c**d",
            errors: [
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    column: 1,
                    endColumn: 15
                },
                {
                    messageId: "useExponentiation",
                    type: "CallExpression",
                    column: 17,
                    endColumn: 31
                }
            ]
        },

        // shouldn't autofix if the call doesn't have exactly two arguments
        invalid("Math.pow()", null),
        invalid("Math.pow(a)", null),
        invalid("Math.pow(a, b, c)", null),
        invalid("Math.pow(a, b, c, d)", null),

        // shouldn't autofix if any of the arguments is spread
        invalid("Math.pow(...a)", null),
        invalid("Math.pow(...a, b)", null),
        invalid("Math.pow(a, ...b)", null),
        invalid("Math.pow(a, b, ...c)", null),

        // shouldn't autofix if that would remove comments
        invalid("/* comment */Math.pow(a, b)", "/* comment */a**b"),
        invalid("Math/**/.pow(a, b)", null),
        invalid("Math//\n.pow(a, b)", null),
        invalid("Math[//\n'pow'](a, b)", null),
        invalid("Math['pow'/**/](a, b)", null),
        invalid("Math./**/pow(a, b)", null),
        invalid("Math.pow/**/(a, b)", null),
        invalid("Math.pow//\n(a, b)", null),
        invalid("Math.pow(/**/a, b)", null),
        invalid("Math.pow(a,//\n b)", null),
        invalid("Math.pow(a, b/**/)", null),
        invalid("Math.pow(a, b//\n)", null),
        invalid("Math.pow(a, b)/* comment */;", "a**b/* comment */;"),
        invalid("Math.pow(a, b)// comment\n;", "a**b// comment\n;"),

        // Optional chaining
        invalid("Math.pow?.(a, b)", "a**b"),
        invalid("Math?.pow(a, b)", "a**b"),
        invalid("Math?.pow?.(a, b)", "a**b"),
        invalid("(Math?.pow)(a, b)", "a**b"),
        invalid("(Math?.pow)?.(a, b)", "a**b")
    ]
});
