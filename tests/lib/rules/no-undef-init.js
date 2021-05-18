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
            output: null,
            errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "var a = undefined, b = 1;",
            output: null,
            errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "var a = 1, b = undefined, c = 5;",
            output: null,
            errors: [{ message: "It's not necessary to initialize 'b' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "var [a] = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize '[a]' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "var {a} = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize '{a}' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "for(var i in [1,2,3]){var a = undefined; for(var j in [1,2,3]){}}",
            output: null,
            errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "let a = undefined;",
            output: "let a;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "let a = undefined, b = 1;",
            output: "let a, b = 1;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "let a = 1, b = undefined, c = 5;",
            output: "let a = 1, b, c = 5;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize 'b' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "let [a] = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize '[a]' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "let {a} = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize '{a}' to undefined.", type: "VariableDeclarator" }]
        },
        {
            code: "for(var i in [1,2,3]){let a = undefined; for(var j in [1,2,3]){}}",
            output: "for(var i in [1,2,3]){let a; for(var j in [1,2,3]){}}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator" }]
        }
    ]
});
