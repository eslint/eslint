/**
 * @fileoverview Tests for no-unused-expressions rule.
 * @author Michael Ficarra
 * @copyright 2013 Michael Ficarra. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unused-expressions"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
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
        { code: "var foo = () => {\"use strict\"; return true; }", ecmaFeatures: { arrowFunctions: true } },
        "function foo() {\"directive one\"; \"directive two\"; f(); }",
        "function foo() { var foo = \"use strict\"; return true; }",
        {
            code: "function* foo(){ yield 0; }",
            ecmaFeatures: { "generators": true }
        }
    ],
    invalid: [
        { code: "0", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "f(), 0", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "{0}", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "[]", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "a && b();", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "a() || false", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a || (b = c)", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a ? b() || (c = d) : e", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }] },
        { code: "a && b()", options: [{ allowTernary: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }]},
        { code: "a ? b() : c()", options: [{ allowShortCircuit: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement" }]},
        { code: "a || b", options: [{ allowShortCircuit: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "a() && b", options: [{ allowShortCircuit: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "a ? b : 0", options: [{ allowTernary: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "a ? b : c()", options: [{ allowTernary: true }], errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "foo.bar;", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "!a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "+a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "\"directive one\"; f(); \"directive two\";", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "function foo() {\"directive one\"; f(); \"directive two\"; }", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "if (0) { \"not a directive\"; f(); }", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "function foo() { var foo = true; \"use strict\"; }", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "var foo = () => { var foo = true; \"use strict\"; }", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] }
    ]
});
