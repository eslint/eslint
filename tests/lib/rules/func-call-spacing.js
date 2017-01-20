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
            code: "f// comment\n()",
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
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f();"
        },
        {
            code: "f (a, b);",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f(a, b);"
        },
        {
            code: "f.b ();",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression", column: 3 }],
            output: "f.b();"
        },
        {
            code: "f.b().c ();",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression", column: 7 }],
            output: "f.b().c();"
        },
        {
            code: "f() ()",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f()()"
        },
        {
            code: "(function() {} ())",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "(function() {}())"
        },
        {
            code: "var f = new Foo ()",
            errors: [{ message: "Unexpected space between function name and paren.", type: "NewExpression" }],
            output: "var f = new Foo()"
        },
        {
            code: "f ( (0) )",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f( (0) )"
        },
        {
            code: "f(0) (1)",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f(0)(1)"
        },
        {
            code: "(f) (0)",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "(f)(0)"
        },
        {
            code: "f ();\n t   ();",
            errors: [
                { message: "Unexpected space between function name and paren.", type: "CallExpression" },
                { message: "Unexpected space between function name and paren.", type: "CallExpression" }
            ],
            output: "f();\n t();"
        },

        // https://github.com/eslint/eslint/issues/7787
        {
            code: "f\n();",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f\n();" // no change
        },
        {
            code: "f\r();",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f\r();" // no change
        },
        {
            code: "f\u2028();",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f\u2028();" // no change
        },
        {
            code: "f\u2029();",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f\u2029();" // no change
        },
        {
            code: "f\r\n();",
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f\r\n();" // no change
        },

        // "never"
        {
            code: "f ();",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f();"
        },
        {
            code: "f (a, b);",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f(a, b);"
        },
        {
            code: "f.b ();",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression", column: 3 }],
            output: "f.b();"
        },
        {
            code: "f.b().c ();",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression", column: 7 }],
            output: "f.b().c();"
        },
        {
            code: "f() ()",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f()()"
        },
        {
            code: "(function() {} ())",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "(function() {}())"
        },
        {
            code: "var f = new Foo ()",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "NewExpression" }],
            output: "var f = new Foo()"
        },
        {
            code: "f ( (0) )",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f( (0) )"
        },
        {
            code: "f(0) (1)",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "f(0)(1)"
        },
        {
            code: "(f) (0)",
            options: ["never"],
            errors: [{ message: "Unexpected space between function name and paren.", type: "CallExpression" }],
            output: "(f)(0)"
        },
        {
            code: "f ();\n t   ();",
            options: ["never"],
            errors: [
                { message: "Unexpected space between function name and paren.", type: "CallExpression" },
                { message: "Unexpected space between function name and paren.", type: "CallExpression" }
            ],
            output: "f();\n t();"
        },

        // https://github.com/eslint/eslint/issues/7787
        {
            code: "f\n();",
            options: ["never"],
            errors: [
                {
                    message: "Unexpected space between function name and paren.",
                    type: "CallExpression"
                }
            ],
            output: "f\n();" // no change
        },
        {
            code: [
                "this.cancelled.add(request)",
                "this.decrement(request)",
                "(0, request.reject)(new api.Cancel())"
            ].join("\n"),
            options: ["never"],
            errors: [
                {
                    message: "Unexpected space between function name and paren.",
                    type: "CallExpression",
                    line: 2,
                    column: 23
                }
            ],
            output: [
                "this.cancelled.add(request)",
                "this.decrement(request)",
                "(0, request.reject)(new api.Cancel())"
            ].join("\n") // no change
        },
        {
            code: [
                "var a = foo",
                "(function(global) {}(this));"
            ].join("\n"),
            options: ["never"],
            errors: [
                {
                    message: "Unexpected space between function name and paren.",
                    type: "CallExpression",
                    line: 1,
                    column: 9
                }
            ],
            output: [
                "var a = foo",
                "(function(global) {}(this));"
            ].join("\n") // no change
        },
        {
            code: [
                "var a = foo",
                "(0, baz())"
            ].join("\n"),
            options: ["never"],
            errors: [
                {
                    message: "Unexpected space between function name and paren.",
                    type: "CallExpression",
                    line: 1,
                    column: 9
                }
            ],
            output: [
                "var a = foo",
                "(0, baz())"
            ].join("\n") // no change
        },
        {
            code: "f\r();",
            options: ["never"],
            errors: [
                {
                    message: "Unexpected space between function name and paren.",
                    type: "CallExpression"
                }
            ],
            output: "f\r();" // no change
        },
        {
            code: "f\u2028();",
            options: ["never"],
            errors: [
                {
                    message: "Unexpected space between function name and paren.",
                    type: "CallExpression"
                }
            ],
            output: "f\u2028();" // no change
        },
        {
            code: "f\u2029();",
            options: ["never"],
            errors: [
                {
                    message: "Unexpected space between function name and paren.",
                    type: "CallExpression"
                }
            ],
            output: "f\u2029();" // no change
        },
        {
            code: "f\r\n();",
            options: ["never"],
            errors: [
                {
                    message: "Unexpected space between function name and paren.",
                    type: "CallExpression"
                }
            ],
            output: "f\r\n();" // no change
        },

        // "always"
        {
            code: "f();",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f ();"
        },
        {
            code: "f\n();",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression" }],
            output: "f ();"
        },
        {
            code: "f(a, b);",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f (a, b);"
        },
        {
            code: "f\n(a, b);",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression" }],
            output: "f (a, b);"
        },
        {
            code: "f.b();",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression", column: 3 }],
            output: "f.b ();"
        },
        {
            code: "f.b\n();",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression", column: 3 }],
            output: "f.b ();"
        },
        {
            code: "f.b().c ();",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression", column: 3 }],
            output: "f.b ().c ();"
        },
        {
            code: "f.b\n().c ();",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression", column: 3 }],
            output: "f.b ().c ();"
        },
        {
            code: "f() ()",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f () ()"
        },
        {
            code: "f\n() ()",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression" }],
            output: "f () ()"
        },
        {
            code: "f\n()()",
            options: ["always"],
            errors: [
                { message: "Unexpected newline between function name and paren.", type: "CallExpression" },
                { message: "Missing space between function name and paren.", type: "CallExpression" }
            ],
            output: "f () ()"
        },
        {
            code: "(function() {}())",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "(function() {} ())"
        },
        {
            code: "var f = new Foo()",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "NewExpression" }],
            output: "var f = new Foo ()"
        },
        {
            code: "f( (0) )",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f ( (0) )"
        },
        {
            code: "f(0) (1)",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f (0) (1)"
        },
        {
            code: "(f)(0)",
            options: ["always"],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "(f) (0)"
        },
        {
            code: "f();\n t();",
            options: ["always"],
            errors: [
                { message: "Missing space between function name and paren.", type: "CallExpression" },
                { message: "Missing space between function name and paren.", type: "CallExpression" }
            ],
            output: "f ();\n t ();"
        },
        {
            code: "f\r();",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression" }],
            output: "f ();"
        },
        {
            code: "f\u2028();",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression" }],
            output: "f ();"
        },
        {
            code: "f\u2029();",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression" }],
            output: "f ();"
        },
        {
            code: "f\r\n();",
            options: ["always"],
            errors: [{ message: "Unexpected newline between function name and paren.", type: "CallExpression" }],
            output: "f ();"
        },

        // "always", "allowNewlines": true
        {
            code: "f();",
            options: ["always", { allowNewlines: true }],
            errors: [
                { message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f ();"
        },
        {
            code: "f(a, b);",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f (a, b);"
        },
        {
            code: "f.b();",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression", column: 3 }],
            output: "f.b ();"
        },
        {
            code: "f.b().c ();",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression", column: 3 }],
            output: "f.b ().c ();"
        },
        {
            code: "f() ()",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f () ()"
        },
        {
            code: "(function() {}())",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "(function() {} ())"
        },
        {
            code: "var f = new Foo()",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "NewExpression" }],
            output: "var f = new Foo ()"
        },
        {
            code: "f( (0) )",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f ( (0) )"
        },
        {
            code: "f(0) (1)",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "f (0) (1)"
        },
        {
            code: "(f)(0)",
            options: ["always", { allowNewlines: true }],
            errors: [{ message: "Missing space between function name and paren.", type: "CallExpression" }],
            output: "(f) (0)"
        },
        {
            code: "f();\n t();",
            options: ["always", { allowNewlines: true }],
            errors: [
                { message: "Missing space between function name and paren.", type: "CallExpression" },
                { message: "Missing space between function name and paren.", type: "CallExpression" }
            ],
            output: "f ();\n t ();"
        }
    ]
});
