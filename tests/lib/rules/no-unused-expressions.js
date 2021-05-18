/**
 * @fileoverview Tests for no-unused-expressions rule.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-expressions"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-unused-expressions", rule, {
    valid: [
        "function f(){}",
        "a = b",
        "new a",
        "{}",
        "f(); g()",
        "i++",
        "a()",
        { code: "a && a()", options: [{ allowShortCircuit: true }] },
        { code: "a() || (b = c)", options: [{ allowShortCircuit: true }] },
        { code: "a ? b() : c()", options: [{ allowTernary: true }] },
        { code: "a ? b() || (c = d) : e()", options: [{ allowShortCircuit: true, allowTernary: true }] },
        "delete foo.bar",
        "void new C",
        "\"use strict\";",
        "\"directive one\"; \"directive two\"; f();",
        "function foo() {\"use strict\"; return true; }",
        { code: "var foo = () => {\"use strict\"; return true; }", parserOptions: { ecmaVersion: 6 } },
        "function foo() {\"directive one\"; \"directive two\"; f(); }",
        "function foo() { var foo = \"use strict\"; return true; }",
        {
            code: "function* foo(){ yield 0; }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "async function foo() { await 5; }",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "async function foo() { await foo.bar; }",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "async function foo() { bar && await baz; }",
            options: [{ allowShortCircuit: true }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "async function foo() { foo ? await bar : await baz; }",
            options: [{ allowTernary: true }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "tag`tagged template literal`",
            options: [{ allowTaggedTemplates: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "shouldNotBeAffectedByAllowTemplateTagsOption()",
            options: [{ allowTaggedTemplates: true }],
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        { code: "0", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "f(), 0", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "{0}", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "[]", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a && b();", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a() || false", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a || (b = c)", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a ? b() || (c = d) : e", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        {
            code: "`untagged template literal`",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Expected an assignment or function call and instead saw an expression."]
        },
        {
            code: "tag`tagged template literal`",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Expected an assignment or function call and instead saw an expression."]
        },
        { code: "a && b()", options: [{ allowTernary: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a ? b() : c()", options: [{ allowShortCircuit: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a || b", options: [{ allowShortCircuit: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a() && b", options: [{ allowShortCircuit: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a ? b : 0", options: [{ allowTernary: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a ? b : c()", options: [{ allowTernary: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "foo.bar;", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "!a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "+a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "\"directive one\"; f(); \"directive two\";", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "function foo() {\"directive one\"; f(); \"directive two\"; }", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "if (0) { \"not a directive\"; f(); }", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "function foo() { var foo = true; \"use strict\"; }", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "var foo = () => { var foo = true; \"use strict\"; }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        {
            code: "`untagged template literal`",
            options: [{ allowTaggedTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: ["Expected an assignment or function call and instead saw an expression."]
        },
        {
            code: "`untagged template literal`",
            options: [{ allowTaggedTemplates: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: ["Expected an assignment or function call and instead saw an expression."]
        },
        {
            code: "tag`tagged template literal`",
            options: [{ allowTaggedTemplates: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: ["Expected an assignment or function call and instead saw an expression."]
        }
    ]
});
