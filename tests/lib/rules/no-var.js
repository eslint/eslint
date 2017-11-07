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
        "let moo = 'car';",
        {
            code: "const JOE = 'schmoe';",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "let moo = 'car';",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        }
    ],

    invalid: [
        {
            code: "var foo = bar;",
            output: "let foo = bar;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
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
            parserOptions: { ecmaFeatures: { globalReturn: true } },
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
            parserOptions: { ecmaFeatures: { globalReturn: true } },
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
            parserOptions: { ecmaFeatures: { globalReturn: true } },
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
            parserOptions: { ecmaFeatures: { globalReturn: true } },
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
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                {
                    message: "Unexpected var, use let or const instead.",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "for (var i = 0; i < list.length; ++i) { foo(i) }",
            output: "for (let i = 0; i < list.length; ++i) { foo(i) }",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                { message: "Unexpected var, use let or const instead.", type: "VariableDeclaration" }
            ]
        },
        {
            code: "for (var i = 0, i = 0; false;);",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                { message: "Unexpected var, use let or const instead.", type: "VariableDeclaration" }
            ]
        },
        {
            code: "var i = 0; for (var i = 1; false;); console.log(i);",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                { message: "Unexpected var, use let or const instead.", type: "VariableDeclaration" },
                { message: "Unexpected var, use let or const instead.", type: "VariableDeclaration" }
            ]
        },

        // Not fix if it's redeclared or it's used from outside of the scope or it's declared on a case chunk.
        {
            code: "var a, b, c; var a;",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead.",
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var a; if (b) { var a; }",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead.",
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "if (foo) { var a, b, c; } a;",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var i = 0; i < 10; ++i) {} i;",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var a in obj) {} a;",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (var a of list) {} a;",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "switch (a) { case 0: var b = 1 }",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },

        // Don't fix if the variable is in a loop and the behavior might change.
        {
            code: "for (var a of b) { arr.push(() => a); }",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "for (let a of b) { var c; console.log(c); c = 'hello'; }",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },

        // https://github.com/eslint/eslint/issues/7950
        {
            code: "var a = a",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var {a = a} = {}",
            output: null,
            parserOptions: { ecmaVersion: 2015, ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var {a = b, b} = {}",
            output: null,
            parserOptions: { ecmaVersion: 2015, ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var {a, b = a} = {}",
            output: "let {a, b = a} = {}",
            parserOptions: { ecmaVersion: 2015, ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var a = b, b = 1",
            output: null,
            parserOptions: { ecmaVersion: 2015, ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },
        {
            code: "var a = b; var b = 1",
            output: "let a = b; var b = 1",
            parserOptions: { ecmaVersion: 2015, ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead.",
                "Unexpected var, use let or const instead."
            ]
        },

        /*
         * This case is not in TDZ, but it's very hard to distinguish the reference is in TDZ or not.
         * So this rule does not fix it for safe.
         */
        {
            code: "function foo() { a } var a = 1; foo()",
            output: null,
            parserOptions: { ecmaVersion: 2015, ecmaFeatures: { globalReturn: true } },
            errors: [
                "Unexpected var, use let or const instead."
            ]
        },

        // https://github.com/eslint/eslint/issues/7961
        {
            code: "if (foo) var bar = 1;",
            output: null,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                { message: "Unexpected var, use let or const instead.", type: "VariableDeclaration" }
            ]
        },

        // https://github.com/eslint/eslint/issues/9520
        {
            code: "var foo = 1",
            output: null,
            errors: ["Unexpected var, use let or const instead."]
        },
        {
            code: "{ var foo = 1 }",
            output: null,
            errors: ["Unexpected var, use let or const instead."]
        },
        {
            code: "if (true) { var foo = 1 }",
            output: null,
            errors: ["Unexpected var, use let or const instead."]
        },
        {
            code: "var foo = 1",
            output: "let foo = 1",
            parserOptions: { sourceType: "module" },
            errors: ["Unexpected var, use let or const instead."]
        }
    ]
});
