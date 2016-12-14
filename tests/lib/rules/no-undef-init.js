/**
 * @fileoverview Tests for undefined rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-undef-init"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-undef-init", rule, {
    valid: [
        "var a;",
        { code: "const foo = undefined", parserOptions: { ecmaVersion: 6 } },
        "var undefined = 5; var foo = undefined;"
    ],
    invalid: [
        {
            code: "var a = undefined;",
            output: "var a;",
            errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "var a = undefined, b = 1;",
            output: "var a, b = 1;",
            errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "var a = 1, b = undefined, c = 5;",
            output: "var a = 1, b, c = 5;",
            errors: [{ message: "It's not necessary to initialize 'b' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "var [a] = undefined;",
            output: "var [a] = undefined;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize '[a]' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "var {a} = undefined;",
            output: "var {a} = undefined;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize '{a}' to undefined.", type: "VariableDeclarator" }]
        }
    ]
});
