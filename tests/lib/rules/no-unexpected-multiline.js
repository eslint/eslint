/**
 * @fileoverview Tests for no-unexpected-multiline rule.
 * @author Glen Mailer
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unexpected-multiline"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("no-unexpected-multiline", rule, {
    valid: [
        "(x || y).aFunction()",
        "[a, b, c].forEach(doSomething)",
        "var a = b;\n(x || y).doSomething()",
        "var a = b\n;(x || y).doSomething()",
        "var a = b\nvoid (x || y).doSomething()",
        "var a = b;\n[1, 2, 3].forEach(console.log)",
        "var a = b\nvoid [1, 2, 3].forEach(console.log)",
        "\"abc\\\n(123)\"",
        "var a = (\n(123)\n)"
    ],
    invalid: [
        {
            code: "var a = b\n(x || y).doSomething()",
            line: 2,
            column: 1,
            errors: [{ message: "Unexpected newline between function and ( of function call." }]
        },
        {
            code: "var a = (a || b)\n(x || y).doSomething()",
            line: 2,
            column: 1,
            errors: [{ message: "Unexpected newline between function and ( of function call." }]
        },
        {
            code: "var a = (a || b)\n(x).doSomething()",
            line: 2,
            column: 1,
            errors: [{ message: "Unexpected newline between function and ( of function call." }]
        },
        {
            code: "var a = b\n[a, b, c].forEach(doSomething)",
            line: 2,
            column: 1,
            errors: [{ message: "Unexpected newline between object and [ of property access." }]
        },
        {
            code: "var a = b\n    (x || y).doSomething()",
            line: 2,
            column: 5,
            errors: [{ message: "Unexpected newline between function and ( of function call." }]
        },
        {
            code: "var a = b\n  [a, b, c].forEach(doSomething)",
            line: 2,
            column: 3,
            errors: [{ message: "Unexpected newline between object and [ of property access." }]
        }
    ]
});
