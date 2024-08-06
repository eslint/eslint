/**
 * @fileoverview Tests for no-useless--arrow-block rule
 * @author Leon Heess
 */

"use strict";

const rule = require("../../../lib/rules/no-useless-arrow-block");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const languageOptions = {
    ecmaVersion: 2022,
    sourceType: "module"
};

const ruleTester = new RuleTester({ languageOptions });

ruleTester.run("no-useless-arrow-block", rule, {
    valid: [

        // Basic cases
        "() => 5",
        "x => x * 2",
        "(a, b) => a + b",
        "() => ({ foo: 'bar' })",

        // Multi-statement arrow functions
        `
          () => {
            doSomething();
            return result;
          }
        `,
        `
          () => {
            if (condition) {
              return x;
            } else {
              return y;
            }
          }
        `,

        // Arrow functions in class methods and object literals
        "class MyClass { method = () => this.value; }",
        "const obj = { method: () => 42 };",

        // Async arrow functions
        "async () => await promise",
        `async () => {
           const result = await promise;
           return result;
         }`,

        // Arrow functions with destructuring
        "({ x, y }) => x + y",
        "([x, y]) => x + y",

        // Arrow functions with default parameters
        "(x = 1) => x * 2",

        // Arrow functions with rest parameters
        "(...args) => args.length",

        // Comments
        "() => { /* comment */ return 5; }",
        "() => { return /* comment */ 5; }"
    ],

    invalid: [

        // Basic cases
        {
            code: "() => { return 5; }",
            output: "() => 5",
            errors: [{ messageId: "uselessArrowBlock", type: "ArrowFunctionExpression" }]
        },
        {
            code: "x => { return x * 2; }",
            output: "x => x * 2",
            errors: [{ messageId: "uselessArrowBlock", type: "ArrowFunctionExpression" }]
        },
        {
            code: "(a, b) => { return a + b; }",
            output: "(a, b) => a + b",
            errors: [{ messageId: "uselessArrowBlock", type: "ArrowFunctionExpression" }]
        },
        {
            code: "() => { console.log('Hello'); }",
            output: "() => console.log('Hello')",
            errors: [{ messageId: "uselessArrowBlock", type: "ArrowFunctionExpression" }]
        },
        {
            code: "() => { return { foo: 'bar' }; }",
            output: "() => ({ foo: 'bar' })",
            errors: [{ messageId: "uselessArrowBlock", type: "ArrowFunctionExpression" }]
        },

        // Async arrow functions
        {
            code: "async () => { return await promise; }",
            output: "async () => await promise",
            errors: [{ messageId: "uselessArrowBlock", type: "ArrowFunctionExpression" }]
        },

        // Arrow functions with destructuring
        {
            code: "({ x, y }) => { return x + y; }",
            output: "({ x, y }) => x + y",
            errors: [{ messageId: "uselessArrowBlock", type: "ArrowFunctionExpression" }]
        },

        // Arrow functions with default parameters
        {
            code: "(x = 1) => { return x * 2; }",
            output: "(x = 1) => x * 2",
            errors: [{ messageId: "uselessArrowBlock", type: "ArrowFunctionExpression" }]
        }
    ]
});
