/**
 * @fileoverview Tests for no-throw-literal rule.
 * @author Dieter Oberkofler
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-throw-literal"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-throw-literal", rule, {
    valid: [
        "throw new Error();",
        "throw new Error('error');",
        "throw Error('error');",
        "var e = new Error(); throw e;",
        "try {throw new Error();} catch (e) {throw e;};",
        "throw a;", // Identifier
        "throw foo();", // CallExpression
        "throw new foo();", // NewExpression
        "throw foo.bar;", // MemberExpression
        "throw foo[bar];", // MemberExpression
        "throw foo = new Error();", // AssignmentExpression
        "throw 1, 2, new Error();", // SequenceExpression
        "throw 'literal' && new Error();", // LogicalExpression (right)
        "throw new Error() || 'literal';", // LogicalExpression (left)
        "throw foo ? new Error() : 'literal';", // ConditionalExpression (consequent)
        "throw foo ? 'literal' : new Error();", // ConditionalExpression (alternate)
        { code: "throw tag `${foo}`;", parserOptions: { ecmaVersion: 6 } }, // TaggedTemplateExpression
        { code: "function* foo() { var index = 0; throw yield index++; }", parserOptions: { ecmaVersion: 6 } }, // YieldExpression
        { code: "async function foo() { throw await bar; }", parserOptions: { ecmaVersion: 8 } } // AwaitExpression
    ],
    invalid: [
        {
            code: "throw 'error';",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw 0;",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw false;",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw null;",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw undefined;",
            errors: [{
                message: "Do not throw undefined.",
                type: "ThrowStatement"
            }]
        },

        // String concatenation
        {
            code: "throw 'a' + 'b';",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },
        {
            code: "var b = new Error(); throw 'a' + b;",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },

        // AssignmentExpression
        {
            code: "throw foo = 'error';",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },

        // SequenceExpression
        {
            code: "throw new Error(), 1, 2, 3;",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },

        // LogicalExpression
        {
            code: "throw 'literal' && 'not an Error';",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },

        // ConditionalExpression
        {
            code: "throw foo ? 'not an Error' : 'literal';",
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"
            }]
        },

        // TemplateLiteral
        {
            code: "throw `${err}`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Expected an object to be thrown.",
                type: "ThrowStatement"

            }]
        }
    ]
});
