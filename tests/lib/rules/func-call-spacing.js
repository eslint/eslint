/**
 * @fileoverview Tests for func-call-spacing rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-call-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
        }
    ],
    invalid: [

        // default ("never")
        {
            code: "f ();",
            output: "f();",
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f (a, b);",
            output: "f(a, b);",
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f.b ();",
            output: "f.b();",
            errors: [{ messageId: "unexpected", type: "CallExpression", column: 3 }]
        },
        {
            code: "f.b().c ();",
            output: "f.b().c();",
            errors: [{ messageId: "unexpected", type: "CallExpression", column: 7 }]
        },
        {
            code: "f() ()",
            output: "f()()",
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "(function() {} ())",
            output: "(function() {}())",
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "var f = new Foo ()",
            output: "var f = new Foo()",
            errors: [{ messageId: "unexpected", type: "NewExpression" }]
        },
        {
            code: "f ( (0) )",
            output: "f( (0) )",
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f(0) (1)",
            output: "f(0)(1)",
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "(f) (0)",
            output: "(f)(0)",
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f ();\n t   ();",
            output: "f();\n t();",
            errors: [
                { messageId: "unexpected", type: "CallExpression" },
                { messageId: "unexpected", type: "CallExpression" }
            ]
        },

        // https://github.com/eslint/eslint/issues/7787
        {
            code: "f\n();",
            output: null, // no change
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f\r();",
            output: null, // no change
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f\u2028();",
            output: null, // no change
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f\u2029();",
            output: null, // no change
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f\r\n();",
            output: null, // no change
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },

        // "never"
        {
            code: "f ();",
            output: "f();",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f (a, b);",
            output: "f(a, b);",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f.b ();",
            output: "f.b();",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression", column: 3 }]
        },
        {
            code: "f.b().c ();",
            output: "f.b().c();",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression", column: 7 }]
        },
        {
            code: "f() ()",
            output: "f()()",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "(function() {} ())",
            output: "(function() {}())",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "var f = new Foo ()",
            output: "var f = new Foo()",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "NewExpression" }]
        },
        {
            code: "f ( (0) )",
            output: "f( (0) )",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f(0) (1)",
            output: "f(0)(1)",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "(f) (0)",
            output: "(f)(0)",
            options: ["never"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f ();\n t   ();",
            output: "f();\n t();",
            options: ["never"],
            errors: [
                { messageId: "unexpected", type: "CallExpression" },
                { messageId: "unexpected", type: "CallExpression" }
            ]
        },

        // https://github.com/eslint/eslint/issues/7787
        {
            code: "f\n();",
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
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
                    messageId: "unexpected",
                    type: "CallExpression",
                    line: 2,
                    column: 23
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
                    messageId: "unexpected",
                    type: "CallExpression",
                    line: 1,
                    column: 9
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
                    messageId: "unexpected",
                    type: "CallExpression",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            code: "f\r();",
            output: null, // no change
            options: ["never"],
            errors: [
                {
                    messageId: "unexpected",
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
                    messageId: "unexpected",
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
                    messageId: "unexpected",
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
                    messageId: "unexpected",
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
            output: "f ();",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f(a, b);",
            output: "f (a, b);",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f\n(a, b);",
            output: "f (a, b);",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f.b();",
            output: "f.b ();",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression", column: 3 }]
        },
        {
            code: "f.b\n();",
            output: "f.b ();",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression", column: 3 }]
        },
        {
            code: "f.b().c ();",
            output: "f.b ().c ();",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression", column: 3 }]
        },
        {
            code: "f.b\n().c ();",
            output: "f.b ().c ();",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression", column: 3 }]
        },
        {
            code: "f() ()",
            output: "f () ()",
            options: ["always"],
            errors: [{ messageId: "missing", type: "CallExpression" }]
        },
        {
            code: "f\n() ()",
            output: "f () ()",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f\n()()",
            output: "f () ()",
            options: ["always"],
            errors: [
                { messageId: "unexpected", type: "CallExpression" },
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
            output: "f ();",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f\u2028();",
            output: "f ();",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f\u2029();",
            output: "f ();",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
        },
        {
            code: "f\r\n();",
            output: "f ();",
            options: ["always"],
            errors: [{ messageId: "unexpected", type: "CallExpression" }]
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
            errors: [{ messageId: "missing", type: "CallExpression", column: 3 }]
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
        }
    ]
});
