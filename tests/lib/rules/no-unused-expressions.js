/**
 * @fileoverview Tests for no-unused-expressions rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-unused-expressions", {
    valid: [
        "function f(){}",
        "a = b",
        "new a",
        "{}",
        "f(); g()",
        "i++",
        "delete foo.bar",
        "void new C",
        "\"use strict\";",
        "function foo() {\"use strict\"; return true; }",
        "function foo() { var foo = \"use strict\"; return true; }"
    ],
    invalid: [
        { code: "0", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "f(), 0", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "{0}", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "[]", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "a && b();", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "foo.bar;", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "!a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "+a", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] },
        { code: "function foo() { var foo = true; \"use strict\"; }", errors: [{ message: "Expected an assignment or function call and instead saw an expression.", type: "ExpressionStatement"}] }
    ]
});
