/**
 * @fileoverview Tests for no-lone-blocks rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-lone-blocks"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-lone-blocks", rule, {
    valid: [
        "if (foo) { if (bar) { baz(); } }",
        "do { bar(); } while (foo)",
        "function foo() { while (bar) { baz() } }",

        // Block-level bindings
        { code: "{ let x = 1; }", parserOptions: { ecmaVersion: 6 } },
        { code: "{ const x = 1; }", parserOptions: { ecmaVersion: 6 } },
        { code: "'use strict'; { function bar() {} }", parserOptions: { ecmaVersion: 6 } },
        { code: "{ function bar() {} }", parserOptions: { ecmaVersion: 6, ecmaFeatures: { impliedStrict: true } } },
        { code: "{ class Bar {} }", parserOptions: { ecmaVersion: 6 } },

        { code: "{ {let y = 1;} let x = 1; }", parserOptions: { ecmaVersion: 6 } },
        `
          switch (foo) {
            case bar: {
              baz;
            }
          }
        `,
        `
          switch (foo) {
            case bar: {
              baz;
            }
            case qux: {
              boop;
            }
          }
        `,
        `
          switch (foo) {
            case bar:
            {
              baz;
            }
          }
        `
    ],
    invalid: [
        { code: "{}", errors: [{ message: "Block is redundant.", type: "BlockStatement" }] },
        { code: "{var x = 1;}", errors: [{ message: "Block is redundant.", type: "BlockStatement" }] },
        { code: "foo(); {} bar();", errors: [{ message: "Block is redundant.", type: "BlockStatement" }] },
        { code: "if (foo) { bar(); {} baz(); }", errors: [{ message: "Nested block is redundant.", type: "BlockStatement" }] },
        {
            code: "{ \n{ } }",
            errors: [
                { message: "Block is redundant.", type: "BlockStatement", line: 1 },
                { message: "Nested block is redundant.", type: "BlockStatement", line: 2 }]
        },
        { code: "function foo() { bar(); {} baz(); }", errors: [{ message: "Nested block is redundant.", type: "BlockStatement" }] },
        { code: "while (foo) { {} }", errors: [{ message: "Nested block is redundant.", type: "BlockStatement" }] },

        // Non-block-level bindings, even in ES6
        { code: "{ function bar() {} }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Block is redundant.", type: "BlockStatement" }] },
        { code: "{var x = 1;}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Block is redundant.", type: "BlockStatement" }] },

        {
            code: "{ \n{var x = 1;}\n let y = 2; } {let z = 1;}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Nested block is redundant.", type: "BlockStatement", line: 2 }]
        },
        {
            code: "{ \n{let x = 1;}\n var y = 2; } {let z = 1;}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Block is redundant.", type: "BlockStatement", line: 1 }]
        },
        {
            code: "{ \n{var x = 1;}\n var y = 2; }\n {var z = 1;}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Block is redundant.", type: "BlockStatement", line: 1 },
                { message: "Nested block is redundant.", type: "BlockStatement", line: 2 },
                { message: "Block is redundant.", type: "BlockStatement", line: 4 }
            ]
        },
        {
            code: `
              switch (foo) {
                case 1:
                    foo();
                    {
                        bar;
                    }
              }
            `,
            errors: [{ message: "Block is redundant.", type: "BlockStatement", line: 5 }]
        },
        {
            code: `
              switch (foo) {
                case 1:
                {
                    bar;
                }
                foo();
              }
            `,
            errors: [{ message: "Block is redundant.", type: "BlockStatement", line: 4 }]
        }
    ]
});
