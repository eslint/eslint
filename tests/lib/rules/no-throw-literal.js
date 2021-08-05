/**
 * @fileoverview Tests for no-throw-literal rule.
 * @author Dieter Oberkofler
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-throw-literal"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        { code: "class C { #field; foo() { throw foo.#field; } }", parserOptions: { ecmaVersion: 2022 } }, // MemberExpression
        "throw foo = new Error();", // AssignmentExpression with the `=` operator
        { code: "throw foo.bar ||= 'literal'", parserOptions: { ecmaVersion: 2021 } }, // AssignmentExpression with a logical operator
        { code: "throw foo[bar] ??= 'literal'", parserOptions: { ecmaVersion: 2021 } }, // AssignmentExpression with a logical operator
        "throw 1, 2, new Error();", // SequenceExpression
        "throw 'literal' && new Error();", // LogicalExpression (right)
        "throw new Error() || 'literal';", // LogicalExpression (left)
        "throw foo ? new Error() : 'literal';", // ConditionalExpression (consequent)
        "throw foo ? 'literal' : new Error();", // ConditionalExpression (alternate)
        { code: "throw tag `${foo}`;", parserOptions: { ecmaVersion: 6 } }, // TaggedTemplateExpression
        { code: "function* foo() { var index = 0; throw yield index++; }", parserOptions: { ecmaVersion: 6 } }, // YieldExpression
        { code: "async function foo() { throw await bar; }", parserOptions: { ecmaVersion: 8 } }, // AwaitExpression
        { code: "throw obj?.foo", parserOptions: { ecmaVersion: 2020 } }, // ChainExpression
        { code: "throw obj?.foo()", parserOptions: { ecmaVersion: 2020 } } // ChainExpression
    ],
    invalid: [
        {
            code: "throw 'error';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw 0;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw false;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw null;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw {};",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw undefined;",
            errors: [{
                messageId: "undef",
                type: "ThrowStatement"
            }]
        },

        // String concatenation
        {
            code: "throw 'a' + 'b';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "var b = new Error(); throw 'a' + b;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // AssignmentExpression
        {
            code: "throw foo = 'error';", // RHS is a literal
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw foo += new Error();", // evaluates to a primitive value, or throws while evaluating
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw foo &= new Error();", // evaluates to a primitive value, or throws while evaluating
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw foo &&= 'literal'", // evaluates either to a falsy value of `foo` (which, then, cannot be an Error object), or to 'literal'
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // SequenceExpression
        {
            code: "throw new Error(), 1, 2, 3;",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // LogicalExpression
        {
            code: "throw 'literal' && 'not an Error';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },
        {
            code: "throw foo && 'literal'", // evaluates either to a falsy value of `foo` (which, then, cannot be an Error object), or to 'literal'
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // ConditionalExpression
        {
            code: "throw foo ? 'not an Error' : 'literal';",
            errors: [{
                messageId: "object",
                type: "ThrowStatement"
            }]
        },

        // TemplateLiteral
        {
            code: "throw `${err}`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "object",
                type: "ThrowStatement"

            }]
        }
    ]
});
