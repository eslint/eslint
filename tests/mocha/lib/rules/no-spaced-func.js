/**
 * @fileoverview Tests for no-spaced-func rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-spaced-func", {
    valid: [
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
        "(function(){ if (foo) { bar(); } }());"
    ],
    invalid: [
        { code: "f ();", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "f (a, b);", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "f\n();", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "f.b ();", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "f.b().c ();", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "f() ()", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "(function() {} ())", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "var f = new Foo ()", errors: [{ message: "Spaced function application is not allowed.", type: "NewExpression"}] },
        { code: "f ( (0) )", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "f(0) (1)", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] },
        { code: "(f) (0)", errors: [{ message: "Spaced function application is not allowed.", type: "CallExpression"}] }
    ]
});
