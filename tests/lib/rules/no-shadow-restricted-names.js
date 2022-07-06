/**
 * @fileoverview Disallow shadowing of NaN, undefined, and Infinity (ES5 section 15.1.1)
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-shadow-restricted-names"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-shadow-restricted-names", rule, {
    valid: [
        "function foo(bar){ var baz; }",
        "!function foo(bar){ var baz; }",
        "!function(bar){ var baz; }",
        "try {} catch(e) {}",
        { code: "export default function() {}", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        {
            code: "try {} catch {}",
            parserOptions: { ecmaVersion: 2019 }
        },
        "var undefined;",
        "var undefined; doSomething(undefined);",
        "var undefined; var undefined;",
        {
            code: "let undefined",
            parserOptions: { ecmaVersion: 2015 }
        }
    ],
    invalid: [
        {
            code: "function NaN(NaN) { var NaN; !function NaN(NaN) { try {} catch(NaN) {} }; }",
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "NaN" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "NaN" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "NaN" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "NaN" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "NaN" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "NaN" }, type: "Identifier" }
            ]
        },
        {
            code: "function undefined(undefined) { !function undefined(undefined) { try {} catch(undefined) {} }; }",
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" }
            ]
        },
        {
            code: "function Infinity(Infinity) { var Infinity; !function Infinity(Infinity) { try {} catch(Infinity) {} }; }",
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "Infinity" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "Infinity" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "Infinity" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "Infinity" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "Infinity" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "Infinity" }, type: "Identifier" }
            ]
        },
        {
            code: "function arguments(arguments) { var arguments; !function arguments(arguments) { try {} catch(arguments) {} }; }",
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "arguments" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "arguments" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "arguments" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "arguments" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "arguments" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "arguments" }, type: "Identifier" }
            ]
        },
        {
            code: "function eval(eval) { var eval; !function eval(eval) { try {} catch(eval) {} }; }",
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" }
            ]
        },
        {
            code: "var eval = (eval) => { var eval; !function eval(eval) { try {} catch(eval) {} }; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "eval" }, type: "Identifier" }
            ]
        },
        {
            code: "var [undefined] = [1]",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" }
            ]
        },
        {
            code: "var {undefined} = obj; var {a: undefined} = obj; var {a: {b: {undefined}}} = obj; var {a, ...undefined} = obj;",
            parserOptions: { ecmaVersion: 9 },
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" },
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" }
            ]
        },
        {
            code: "var undefined; undefined = 5;",
            errors: [
                { messageId: "shadowingRestrictedName", data: { name: "undefined" }, type: "Identifier" }
            ]
        }
    ]
});
