/**
 * @fileoverview Tests for no-var rule.
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-var", rule, {
    valid: [
        "const JOE = 'schmoe';",
        "let moo = 'car';"
    ],

    invalid: [
        {
            code: "var foo = bar;",
            output: "let foo = bar;",
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = bar, toast = most;",
            output: "let foo = bar, toast = most;",
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = bar; let toast = most;",
            output: "let foo = bar; let toast = most;",
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "for (var a of b) { console.log(a); }",
            output: "for (let a of b) { console.log(a); }",
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "for (var a in b) { console.log(a); }",
            output: "for (let a in b) { console.log(a); }",
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "for (let a of b) { var c = 1; console.log(c); }",
            output: "for (let a of b) { let c = 1; console.log(c); }",
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },


        // Not fix if it's redeclared or it's used from outside of the scope or it's declared on a case chunk.
        {
            code: "var a, b, c; var a;",
            output: "var a, b, c; var a;",
            errors: [
                "Unexpected var, use let or const instead.",
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var a; if (b) { var a; }",
            output: "var a; if (b) { var a; }",
            errors: [
                "Unexpected var, use let or const instead.",
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "if (foo) { var a, b, c; } a;",
            output: "if (foo) { var a, b, c; } a;",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var i = 0; i < 10; ++i) {} i;",
            output: "for (var i = 0; i < 10; ++i) {} i;",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var a in obj) {} a;",
            output: "for (var a in obj) {} a;",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var a of list) {} a;",
            output: "for (var a of list) {} a;",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "switch (a) { case 0: var b = 1 }",
            output: "switch (a) { case 0: var b = 1 }",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },

        // Don't fix if the variable is in a loop and the behavior might change.
        {
            code: "for (var a of b) { arr.push(() => a); }",
            output: "for (var a of b) { arr.push(() => a); }",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (let a of b) { var c; console.log(c); c = 'hello'; }",
            output: "for (let a of b) { var c; console.log(c); c = 'hello'; }",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },

        // https://github.com/eslint/eslint/issues/7950
        {
            code: "var a = a",
            output: "var a = a",
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var {a = a} = {}",
            output: "var {a = a} = {}",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var {a = b, b} = {}",
            output: "var {a = b, b} = {}",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var {a, b = a} = {}",
            output: "let {a, b = a} = {}",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var a = b, b = 1",
            output: "var a = b, b = 1",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var a = b; var b = 1",
            output: "let a = b; var b = 1",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "Unexpected var, use let or const instead.",
                "Unexpected var, use let or const instead."
            ]
        },

        // This case is not in TDZ, but it's very hard to distinguish the reference is in TDZ or not.
        // So this rule does not fix it for safe.
        {
            code: "function foo() { a } var a = 1; foo()",
            output: "function foo() { a } var a = 1; foo()",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },

        // https://github.com/eslint/eslint/issues/7961
        {
            code: "if (foo) var bar = 1;",
            output: "if (foo) var bar = 1;",
            errors: [
                { message: "Unexpected var, use let or const instead.", type: "VariableDeclaration" }
            ]
        }
    ]
});
