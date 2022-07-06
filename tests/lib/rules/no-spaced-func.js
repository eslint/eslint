/**
 * @fileoverview Tests for no-spaced-func rule.
 * @author Matt DuVall <http://www.mattduvall.com>
 * @deprecated in ESLint v3.3.0
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-spaced-func"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-spaced-func", rule, {
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
        "( f()() )(0)",
        "(function(){ if (foo) { bar(); } }());",
        "f(0, (1))",
        "describe/**/('foo', function () {});",
        "new (foo())"
    ],
    invalid: [
        {
            code: "f ();",
            output: "f();",
            errors: [
                { messageId: "noSpacedFunction", type: "CallExpression" }]
        },
        {
            code: "f (a, b);",
            output: "f(a, b);",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression" }]
        },
        {
            code: "f\n();",
            output: "f();",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression" }]
        },
        {
            code: "f.b ();",
            output: "f.b();",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression", column: 3 }]
        },
        {
            code: "f.b().c ();",
            output: "f.b().c();",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression", column: 7 }]
        },
        {
            code: "f() ()",
            output: "f()()",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression" }]
        },
        {
            code: "(function() {} ())",
            output: "(function() {}())",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression" }]
        },
        {
            code: "var f = new Foo ()",
            output: "var f = new Foo()",
            errors: [{ messageId: "noSpacedFunction", type: "NewExpression" }]
        },
        {
            code: "f ( (0) )",
            output: "f( (0) )",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression" }]
        },
        {
            code: "f(0) (1)",
            output: "f(0)(1)",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression" }]
        },
        {
            code: "(f) (0)",
            output: "(f)(0)",
            errors: [{ messageId: "noSpacedFunction", type: "CallExpression" }]
        },
        {
            code: "f ();\n t   ();",
            output: "f();\n t();",
            errors: [
                { messageId: "noSpacedFunction", type: "CallExpression" },
                { messageId: "noSpacedFunction", type: "CallExpression" }
            ]
        }
    ]
});
