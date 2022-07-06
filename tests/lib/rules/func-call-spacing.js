/**
 * @fileoverview Tests for func-call-spacing rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-call-spacing"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("func-call-spacing", rule, {
    valid: [

        // default ("never")
        "f();",
        "f(a, b);",
        "f.b();",
        "f.b().c();",
        "f()()",
        "(function() {}())",
        "var f = new Foo()",
        "var f = new Foo",
        "f( (0) )",
        "( f )( 0 )",
        "( (f) )( (0) )",
        "( f()() )(0)",
        "(function(){ if (foo) { bar(); } }());",
        "f(0, (1))",
        "describe/**/('foo', function () {});",
        "new (foo())",
        {
            code: "import(source)",
            parserOptions: { ecmaVersion: 2020 }
        },

        // "never"
        {
            code: "f();",
            options: ["never"]
        },
        {
            code: "f(a, b);",
            options: ["never"]
        },
        {
            code: "f.b();",
            options: ["never"]
        },
        {
            code: "f.b().c();",
            options: ["never"]
        },
        {
            code: "f()()",
            options: ["never"]
        },
        {
            code: "(function() {}())",
            options: ["never"]
        },
        {
            code: "var f = new Foo()",
            options: ["never"]
        },
        {
            code: "var f = new Foo",
            options: ["never"]
        },
        {
            code: "f( (0) )",
            options: ["never"]
        },
        {
            code: "( f )( 0 )",
            options: ["never"]
        },
        {
            code: "( (f) )( (0) )",
            options: ["never"]
        },
        {
            code: "( f()() )(0)",
            options: ["never"]
        },
        {
            code: "(function(){ if (foo) { bar(); } }());",
            options: ["never"]
        },
        {
            code: "f(0, (1))",
            options: ["never"]
        },
        {
            code: "describe/**/('foo', function () {});",
            options: ["never"]
        },
        {
            code: "new (foo())",
            options: ["never"]
        },
        {
            code: "import(source)",
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 }
        },

        // "always"
        {
            code: "f ();",
            options: ["always"]
        },
        {
            code: "f (a, b);",
            options: ["always"]
        },
        {
            code: "f.b ();",
            options: ["always"]
        },
        {
            code: "f.b ().c ();",
            options: ["always"]
        },
        {
            code: "f () ()",
            options: ["always"]
        },
        {
            code: "(function() {} ())",
            options: ["always"]
        },
        {
            code: "var f = new Foo ()",
            options: ["always"]
        },
        {
            code: "var f = new Foo",
            options: ["always"]
        },
        {
            code: "f ( (0) )",
            options: ["always"]
        },
        {
            code: "f (0) (1)",
            options: ["always"]
        },
        {
            code: "(f) (0)",
            options: ["always"]
        },
        {
            code: "f ();\n t   ();",
            options: ["always"]
        },
        {
            code: "import (source)",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 }
        },

        // "always", "allowNewlines": true
        {
            code: "f\n();",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f.b \n ();",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f\n() ().b \n()\n ()",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "var f = new Foo\n();",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f// comment\n()",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f // comment\n ()",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f\n/*\n*/\n()",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f\r();",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f\u2028();",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f\u2029();",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "f\r\n();",
            options: ["always", { allowNewlines: true }]
        },
        {
            code: "import\n(source)",
            options: ["always", { allowNewlines: true }],
            parserOptions: { ecmaVersion: 2020 }
        },

        // Optional chaining
        {
            code: "func?.()",
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "func ?.()",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "func?. ()",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "func ?. ()",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 }
        }
    ],
    invalid: [

        // default ("never")
        {
            code: "f ();",
            output: "f();",
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f (a, b);",
            output: "f(a, b);",
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f.b ();",
            output: "f.b();",
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    column: 4,
                    line: 1,
                    endColumn: 4,
                    endLine: 1
                }
            ]
        },
        {
            code: "f.b().c ();",
            output: "f.b().c();",
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    column: 8,
                    line: 1,
                    endColumn: 8,
                    endLine: 1
                }
            ]
        },
        {
            code: "f() ()",
            output: "f()()",
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "(function() {} ())",
            output: "(function() {}())",
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "var f = new Foo ()",
            output: "var f = new Foo()",
            errors: [{ messageId: "unexpectedWhitespace", type: "NewExpression" }]
        },
        {
            code: "f ( (0) )",
            output: "f( (0) )",
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f(0) (1)",
            output: "f(0)(1)",
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "(f) (0)",
            output: "(f)(0)",
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f ();\n t   ();",
            output: "f();\n t();",
            errors: [
                { messageId: "unexpectedWhitespace", type: "CallExpression" },
                { messageId: "unexpectedWhitespace", type: "CallExpression" }
            ]
        },
        {
            code: "import (source);",
            output: "import(source);",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", type: "ImportExpression" }]
        },

        // https://github.com/eslint/eslint/issues/7787
        {
            code: "f\n();",
            output: null, // no change
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f\r();",
            output: null, // no change
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f\u2028();",
            output: null, // no change
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f\u2029();",
            output: null, // no change
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f\r\n();",
            output: null, // no change
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "import\n(source);",
            output: null,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", type: "ImportExpression" }]
        },

        // "never"
        {
            code: "f ();",
            output: "f();",
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f (a, b);",
            output: "f(a, b);",
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f.b  ();",
            output: "f.b();",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    column: 4,
                    line: 1,
                    endColumn: 5,
                    endLine: 1
                }
            ]
        },
        {
            code: "f.b().c ();",
            output: "f.b().c();",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    column: 8,
                    line: 1,
                    endColumn: 8,
                    endLine: 1
                }
            ]
        },
        {
            code: "f() ()",
            output: "f()()",
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "(function() {} ())",
            output: "(function() {}())",
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "var f = new Foo ()",
            output: "var f = new Foo()",
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace", type: "NewExpression" }]
        },
        {
            code: "f ( (0) )",
            output: "f( (0) )",
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f(0) (1)",
            output: "f(0)(1)",
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "(f) (0)",
            output: "(f)(0)",
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace", type: "CallExpression" }]
        },
        {
            code: "f ();\n t   ();",
            output: "f();\n t();",
            options: ["never"],
            errors: [
                { messageId: "unexpectedWhitespace", type: "CallExpression" },
                { messageId: "unexpectedWhitespace", type: "CallExpression" }
            ]
        },
        {
            code: "import (source);",
            output: "import(source);",
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace", type: "ImportExpression" }]
        },

        // https://github.com/eslint/eslint/issues/7787
        {
            code: "f\n();",
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    line: 1,
                    column: 2,
                    endLine: 2,
                    endColumn: 0
                }
            ]
        },
        {
            code: [
                "this.cancelled.add(request)",
                "this.decrement(request)",
                "(0, request.reject)(new api.Cancel())"
            ].join("\n"),
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    line: 2,
                    column: 24,
                    endLine: 3,
                    endColumn: 0
                }
            ]
        },
        {
            code: [
                "var a = foo",
                "(function(global) {}(this));"
            ].join("\n"),
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    line: 1,
                    column: 12,
                    endLine: 2,
                    endColumn: 0
                }
            ]
        },
        {
            code: [
                "var a = foo",
                "(0, baz())"
            ].join("\n"),
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    line: 1,
                    column: 12,
                    endColumn: 0,
                    endLine: 2
                }
            ]
        },
        {
            code: "f\r();",
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "f\u2028();",
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "f\u2029();",
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "f\r\n();",
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression"
                }
            ]
        },

        // "always"
        {
            code: "f();",
            output: "f ();",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f\n();",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [{ messageId: "unexpectedNewline", type: "CallExpression" }]
        },
        {
            code: "f(a, b);",
            output: "f (a, b);",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f\n(a, b);",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [{ messageId: "unexpectedNewline", type: "CallExpression" }]
        },
        {
            code: "f.b();",
            output: "f.b ();",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "CallExpression",
                    column: 3,
                    line: 1,
                    endLine: 1,
                    endColumn: 4
                }
            ]
        },
        {
            code: "f.b\n();",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [
                {
                    messageId: "unexpectedNewline",
                    type: "CallExpression",
                    column: 4,
                    line: 1,
                    endColumn: 1,
                    endLine: 2
                }
            ]
        },
        {
            code: "f.b().c ();",
            output: "f.b ().c ();",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression", column: 3 }]
        },
        {
            code: "f.b\n().c ();",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [
                {
                    messageId: "unexpectedNewline",
                    type: "CallExpression",
                    column: 4,
                    line: 1,
                    endColumn: 1,
                    endLine: 2
                }
            ]
        },
        {
            code: "f() ()",
            output: "f () ()",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f\n() ()",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [{ messageId: "unexpectedNewline", type: "CallExpression" }]
        },
        {
            code: "f\n()()",
            output: "f\n() ()", // Don't fix the first error to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [
                { messageId: "unexpectedNewline", type: "CallExpression" },
                { messageId: "missing", type: "CallExpression" }
            ]
        },
        {
            code: "(function() {}())",
            output: "(function() {} ())",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "var f = new Foo()",
            output: "var f = new Foo ()",
            options: ["always"],
            errors: [{ messageId: "missing", type: "NewExpression" }]
        },
        {
            code: "f( (0) )",
            output: "f ( (0) )",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f(0) (1)",
            output: "f (0) (1)",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "(f)(0)",
            output: "(f) (0)",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "import(source);",
            output: "import (source);",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "missing", type: "ImportExpression" }]
        },
        {
            code: "f();\n t();",
            output: "f ();\n t ();",
            options: ["always"],
            errors: [
                { messageId: "missing", type: "CallExpression" },
                { messageId: "missing", type: "CallExpression" }
            ]
        },
        {
            code: "f\r();",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [{ messageId: "unexpectedNewline", type: "CallExpression" }]
        },
        {
            code: "f\u2028();",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [{ messageId: "unexpectedNewline", type: "CallExpression" }]
        },
        {
            code: "f\u2029();",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [{ messageId: "unexpectedNewline", type: "CallExpression" }]
        },
        {
            code: "f\r\n();",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [{ messageId: "unexpectedNewline", type: "CallExpression" }]
        },

        // "always", "allowNewlines": true
        {
            code: "f();",
            output: "f ();",
            options: ["always", { allowNewlines: true }],
            errors: [
                { messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f(a, b);",
            output: "f (a, b);",
            options: ["always", { allowNewlines: true }],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f.b();",
            output: "f.b ();",
            options: ["always", { allowNewlines: true }],
            errors: [
                {
                    messageId: "missing",
                    type: "CallExpression",
                    column: 3
                }
            ]
        },
        {
            code: "f.b().c ();",
            output: "f.b ().c ();",
            options: ["always", { allowNewlines: true }],
            errors: [{ messageId: "missing", type: "CallExpression", column: 3 }]
        },
        {
            code: "f() ()",
            output: "f () ()",
            options: ["always", { allowNewlines: true }],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "(function() {}())",
            output: "(function() {} ())",
            options: ["always", { allowNewlines: true }],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "var f = new Foo()",
            output: "var f = new Foo ()",
            options: ["always", { allowNewlines: true }],
            errors: [{ messageId: "missing", type: "NewExpression" }]
        },
        {
            code: "f( (0) )",
            output: "f ( (0) )",
            options: ["always", { allowNewlines: true }],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f(0) (1)",
            output: "f (0) (1)",
            options: ["always", { allowNewlines: true }],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "(f)(0)",
            output: "(f) (0)",
            options: ["always", { allowNewlines: true }],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f();\n t();",
            output: "f ();\n t ();",
            options: ["always", { allowNewlines: true }],
            errors: [
                { messageId: "missing", type: "CallExpression" },
                { messageId: "missing", type: "CallExpression" }
            ]
        },
        {
            code: "f    ();",
            output: "f();",
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 5
                }
            ]
        },
        {
            code: "f\n ();",
            output: null,
            errors: [
                {
                    messageId: "unexpectedWhitespace",
                    type: "CallExpression",
                    line: 1,
                    column: 2,
                    endLine: 2,
                    endColumn: 1
                }
            ]
        },
        {
            code: "fn();",
            output: "fn ();",
            options: ["always"],
            errors: [
                {
                    messageId: "missing",
                    type: "CallExpression",
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 3
                }
            ]
        },
        {
            code: "fnn\n (a, b);",
            output: null, // Don't fix to avoid hiding no-unexpected-multiline (https://github.com/eslint/eslint/issues/7787)
            options: ["always"],
            errors: [
                {
                    messageId: "unexpectedNewline",
                    type: "CallExpression",
                    line: 1,
                    column: 4,
                    endLine: 2,
                    endColumn: 2
                }
            ]
        },
        {
            code: "f /*comment*/ ()",
            output: null, // Don't remove comments
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace" }]
        },
        {
            code: "f /*\n*/ ()",
            output: null, // Don't remove comments
            options: ["never"],
            errors: [{ messageId: "unexpectedWhitespace" }]
        },
        {
            code: "f/*comment*/()",
            output: "f/*comment*/ ()",
            options: ["always"],
            errors: [{ messageId: "missing" }]
        },

        // Optional chaining
        {
            code: "func ?.()",
            output: "func?.()",
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace" }]
        },
        {
            code: "func?. ()",
            output: "func?.()",
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace" }]
        },
        {
            code: "func ?. ()",
            output: "func?.()",
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace" }]
        },
        {
            code: "func\n?.()",
            output: "func?.()",
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace" }]
        },
        {
            code: "func\n//comment\n?.()",
            output: null, // Don't remove comments
            options: ["never"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedWhitespace" }]
        },
        {
            code: "func?.()",
            output: null, // Not sure inserting a space into either before/after `?.`.
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "missing" }]
        },
        {
            code: "func\n  ?.()",
            output: "func ?.()",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedNewline" }]
        },
        {
            code: "func?.\n  ()",
            output: "func?. ()",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedNewline" }]
        },
        {
            code: "func  ?.\n  ()",
            output: "func ?. ()",
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedNewline" }]
        },
        {
            code: "func\n /*comment*/ ?.()",
            output: null, // Don't remove comments
            options: ["always"],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpectedNewline" }]
        }
    ]
});
