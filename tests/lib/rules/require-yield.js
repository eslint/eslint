/**
 * @fileoverview Tests for require-yield rule
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/require-yield");
let RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let errorMessage = "This generator function does not have 'yield'.";

let ruleTester = new RuleTester();

ruleTester.run("require-yield", rule, {
    valid: [
        {
            code: "function foo() { return 0; }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function* foo() { yield 0; }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function* foo() { }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function* foo() { yield 0; })();",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function* foo() { })();",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = { *foo() { yield 0; } };",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = { *foo() { } };",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { *foo() { yield 0; } };",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { *foo() { } };",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "function* foo() { return 0; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: errorMessage, type: "FunctionDeclaration"}]
        },
        {
            code: "(function* foo() { return 0; })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: errorMessage, type: "FunctionExpression"}]
        },
        {
            code: "var obj = { *foo() { return 0; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: errorMessage, type: "FunctionExpression"}]
        },
        {
            code: "class A { *foo() { return 0; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: errorMessage, type: "FunctionExpression"}]
        },
        {
            code: "function* foo() { function* bar() { yield 0; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: errorMessage,
                type: "FunctionDeclaration",
                column: 1
            }]
        },
        {
            code: "function* foo() { function* bar() { return 0; } yield 0; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: errorMessage,
                type: "FunctionDeclaration",
                column: 19
            }]
        }
    ]
});
