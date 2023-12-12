/**
 * @fileoverview Tests for no-var rule.
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-var"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 6, sourceType: "script" } });

ruleTester.run("no-var", rule, {
    valid: [
        "const JOE = 'schmoe';",
        "let moo = 'car';",
        {
            code: "const JOE = 'schmoe';",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "let moo = 'car';",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        }
    ],

    invalid: [
        {
            code: "var foo = bar;",
            output: "let foo = bar;",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = bar, toast = most;",
            output: "let foo = bar, toast = most;",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "var foo = bar; let toast = most;",
            output: "let foo = bar; let toast = most;",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "for (var a of b) { console.log(a); }",
            output: "for (let a of b) { console.log(a); }",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "for (var a in b) { console.log(a); }",
            output: "for (let a in b) { console.log(a); }",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "for (let a of b) { var c = 1; console.log(c); }",
            output: "for (let a of b) { let c = 1; console.log(c); }",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ]
        },
        {
            code: "for (var i = 0; i < list.length; ++i) { foo(i) }",
            output: "for (let i = 0; i < list.length; ++i) { foo(i) }",
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar", type: "VariableDeclaration" }
            ]
        },
        {
            code: "for (var i = 0, i = 0; false;);",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar", type: "VariableDeclaration" }
            ]
        },
        {
            code: "var i = 0; for (var i = 1; false;); console.log(i);",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar", type: "VariableDeclaration" },
                { messageId: "unexpectedVar", type: "VariableDeclaration" }
            ]
        },

        // Not fix if it's redeclared or it's used from outside of the scope or it's declared on a case chunk.
        {
            code: "var a, b, c; var a;",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "var a; if (b) { var a; }",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "if (foo) { var a, b, c; } a;",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "for (var i = 0; i < 10; ++i) {} i;",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "for (var a in obj) {} a;",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "for (var a of list) {} a;",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "switch (a) { case 0: var b = 1 }",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },

        // Don't fix if the variable is in a loop and the behavior might change.
        {
            code: "for (var a of b) { arr.push(() => a); }",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "for (let a of b) { var c; console.log(c); c = 'hello'; }",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },

        // https://github.com/eslint/eslint/issues/7950
        {
            code: "var a = a",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "var {a = a} = {}",
            output: null,
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "var {a = b, b} = {}",
            output: null,
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "var {a, b = a} = {}",
            output: "let {a, b = a} = {}",
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "var a = b, b = 1",
            output: null,
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "var a = b; var b = 1",
            output: "let a = b; var b = 1",
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ]
        },

        /*
         * This case is not in TDZ, but it's very hard to distinguish the reference is in TDZ or not.
         * So this rule does not fix it for safe.
         */
        {
            code: "function foo() { a } var a = 1; foo()",
            output: null,
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar" }
            ]
        },

        // https://github.com/eslint/eslint/issues/7961
        {
            code: "if (foo) var bar = 1;",
            output: null,
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } },
            errors: [
                { messageId: "unexpectedVar", type: "VariableDeclaration" }
            ]
        },

        // https://github.com/eslint/eslint/issues/9520
        {
            code: "var foo = 1",
            output: null,
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "{ var foo = 1 }",
            output: null,
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "if (true) { var foo = 1 }",
            output: null,
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var foo = 1",
            output: "let foo = 1",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },

        // https://github.com/eslint/eslint/issues/11594
        {
            code: "declare var foo = 2;",
            output: "declare let foo = 2;",
            languageOptions: {
                ecmaVersion: 6,
                sourceType: "module",
                parser: require("../../fixtures/parsers/typescript-parsers/declare-var")
            },
            errors: [{ messageId: "unexpectedVar" }]
        },

        // https://github.com/eslint/eslint/issues/11830
        {
            code: "function foo() { var let; }",
            output: null,
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "function foo() { var { let } = {}; }",
            output: null,
            errors: [{ messageId: "unexpectedVar" }]
        },

        // https://github.com/eslint/eslint/issues/16610
        {
            code: "var fx = function (i = 0) { if (i < 5) { return fx(i + 1); } console.log(i); }; fx();",
            output: "let fx = function (i = 0) { if (i < 5) { return fx(i + 1); } console.log(i); }; fx();",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var foo = function () { foo() };",
            output: "let foo = function () { foo() };",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var foo = () => foo();",
            output: "let foo = () => foo();",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var foo = (function () { foo(); })();",
            output: null,
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var foo = bar(function () { foo(); });",
            output: null,
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var bar = foo, foo = function () { foo(); };",
            output: null,
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var bar = foo; var foo = function () { foo(); };",
            output: "let bar = foo; var foo = function () { foo(); };",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ]
        },
        {
            code: "var { foo = foo } = function () { foo(); };",
            output: null,
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var { bar = foo, foo } = function () { foo(); };",
            output: null,
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{ messageId: "unexpectedVar" }]
        },
        {
            code: "var bar = function () { foo(); }; var foo = function() {};",
            output: "let bar = function () { foo(); }; var foo = function() {};",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ]
        }
    ]
});
