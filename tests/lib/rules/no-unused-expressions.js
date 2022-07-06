/**
 * @fileoverview Tests for no-unused-expressions rule.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-expressions"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        },
        {
            code: "import(\"foo\")",
            parserOptions: { ecmaVersion: 11 }
        },
        {
            code: "func?.(\"foo\")",
            parserOptions: { ecmaVersion: 11 }
        },
        {
            code: "obj?.foo(\"bar\")",
            parserOptions: { ecmaVersion: 11 }
        },

        // JSX
        {
            code: "<div />",
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        {
            code: "<></>",
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        {
            code: "var partial = <div />",
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        {
            code: "var partial = <div />",
            options: [{ enforceForJSX: true }],
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        {
            code: "var partial = <></>",
            options: [{ enforceForJSX: true }],
            parserOptions: { ecmaFeatures: { jsx: true } }
        }
    ],
    invalid: [
        { code: "0", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "f(), 0", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "{0}", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "[]", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a && b();", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a() || false", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a || (b = c)", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a ? b() || (c = d) : e", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        {
            code: "`untagged template literal`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unusedExpression" }]
        },
        {
            code: "tag`tagged template literal`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unusedExpression" }]
        },
        { code: "a && b()", options: [{ allowTernary: true }], errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a ? b() : c()", options: [{ allowShortCircuit: true }], errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a || b", options: [{ allowShortCircuit: true }], errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a() && b", options: [{ allowShortCircuit: true }], errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a ? b : 0", options: [{ allowTernary: true }], errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "a ? b : c()", options: [{ allowTernary: true }], errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "foo.bar;", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "!a", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "+a", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "\"directive one\"; f(); \"directive two\";", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "function foo() {\"directive one\"; f(); \"directive two\"; }", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "if (0) { \"not a directive\"; f(); }", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "function foo() { var foo = true; \"use strict\"; }", errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        { code: "var foo = () => { var foo = true; \"use strict\"; }", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }] },
        {
            code: "`untagged template literal`",
            options: [{ allowTaggedTemplates: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unusedExpression" }]
        },
        {
            code: "`untagged template literal`",
            options: [{ allowTaggedTemplates: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unusedExpression" }]
        },
        {
            code: "tag`tagged template literal`",
            options: [{ allowTaggedTemplates: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unusedExpression" }]
        },

        // Optional chaining
        {
            code: "obj?.foo",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }]
        },
        {
            code: "obj?.foo.bar",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }]
        },
        {
            code: "obj?.foo().bar",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }]
        },

        // JSX
        {
            code: "<div />",
            options: [{ enforceForJSX: true }],
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }]
        },
        {
            code: "<></>",
            options: [{ enforceForJSX: true }],
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }]
        },

        // class static blocks do not have directive prologues
        {
            code: "class C { static { 'use strict'; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unusedExpression", type: "ExpressionStatement" }]
        },
        {
            code: "class C { static { \n'foo'\n'bar'\n } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "unusedExpression",
                    type: "ExpressionStatement",
                    line: 2
                },
                {
                    messageId: "unusedExpression",
                    type: "ExpressionStatement",
                    line: 3
                }
            ]
        }
    ]
});
