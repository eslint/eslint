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
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var foo = bar, toast = most;",
            output: "let foo = bar, toast = most;",
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var foo = bar; let toast = most;",
            output: "let foo = bar; let toast = most;",
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (var a of b) { console.log(a); }",
            output: "for (let a of b) { console.log(a); }",
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (var a in b) { console.log(a); }",
            output: "for (let a in b) { console.log(a); }",
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (let a of b) { var c = 1; console.log(c); }",
            output: "for (let a of b) { let c = 1; console.log(c); }",
            errors: [
                {
                    messageId: "unexpectedVar",
                    type: "VariableDeclaration"
                }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (var i = 0; i < list.length; ++i) { foo(i) }",
            output: "for (let i = 0; i < list.length; ++i) { foo(i) }",
            errors: [
                { messageId: "unexpectedVar", type: "VariableDeclaration" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (var i = 0, i = 0; false;);",
            output: null,
            errors: [
                { messageId: "unexpectedVar", type: "VariableDeclaration" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var i = 0; for (var i = 1; false;); console.log(i);",
            output: null,
            errors: [
                { messageId: "unexpectedVar", type: "VariableDeclaration" },
                { messageId: "unexpectedVar", type: "VariableDeclaration" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },

        // Not fix if it's redeclared or it's used from outside of the scope or it's declared on a case chunk.
        {
            code: "var a, b, c; var a;",
            output: null,
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var a; if (b) { var a; }",
            output: null,
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "if (foo) { var a, b, c; } a;",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (var i = 0; i < 10; ++i) {} i;",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (var a in obj) {} a;",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (var a of list) {} a;",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "switch (a) { case 0: var b = 1 }",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },

        // Don't fix if the variable is in a loop and the behavior might change.
        {
            code: "for (var a of b) { arr.push(() => a); }",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "for (let a of b) { var c; console.log(c); c = 'hello'; }",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },

        // https://github.com/eslint/eslint/issues/7950
        {
            code: "var a = a",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var {a = a} = {}",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var {a = b, b} = {}",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var {a, b = a} = {}",
            output: "let {a, b = a} = {}",
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var a = b, b = 1",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },
        {
            code: "var a = b; var b = 1",
            output: "let a = b; var b = 1",
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },

        /*
         * This case is not in TDZ, but it's very hard to distinguish the reference is in TDZ or not.
         * So this rule does not fix it for safe.
         */
        {
            code: "function foo() { a } var a = 1; foo()",
            output: null,
            errors: [
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { ecmaVersion: 2015, parserOptions: { ecmaFeatures: { globalReturn: true } } }
        },

        // https://github.com/eslint/eslint/issues/7961
        {
            code: "if (foo) var bar = 1;",
            output: null,
            errors: [
                { messageId: "unexpectedVar", type: "VariableDeclaration" }
            ],
            languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } }
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
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },

        // https://github.com/eslint/eslint/issues/11594
        {
            code: "declare var foo = 2;",
            output: "declare let foo = 2;",
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: {
                ecmaVersion: 6,
                sourceType: "module",
                parser: require("../../fixtures/parsers/typescript-parsers/declare-var")
            }
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
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var foo = function () { foo() };",
            output: "let foo = function () { foo() };",
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var foo = () => foo();",
            output: "let foo = () => foo();",
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var foo = (function () { foo(); })();",
            output: null,
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var foo = bar(function () { foo(); });",
            output: null,
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var bar = foo, foo = function () { foo(); };",
            output: null,
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var bar = foo; var foo = function () { foo(); };",
            output: "let bar = foo; var foo = function () { foo(); };",
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var { foo = foo } = function () { foo(); };",
            output: null,
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var { bar = foo, foo } = function () { foo(); };",
            output: null,
            errors: [{ messageId: "unexpectedVar" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "var bar = function () { foo(); }; var foo = function() {};",
            output: "let bar = function () { foo(); }; var foo = function() {};",
            errors: [
                { messageId: "unexpectedVar" },
                { messageId: "unexpectedVar" }
            ],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        }
    ]
});
