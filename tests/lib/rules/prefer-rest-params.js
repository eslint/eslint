/**
 * @fileoverview Tests for prefer-rest-params rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-rest-params"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("prefer-rest-params", rule, {
    valid: [
        "arguments;",
        "function foo(arguments) { arguments; }",
        "function foo() { var arguments; arguments; }",
        "var foo = () => arguments;", // Arrows don't have "arguments".,
        "function foo(...args) { args; }",
        "function foo() { arguments.length; }",
        "function foo() { arguments.callee; }"
    ],
    invalid: [
        { code: "function foo() { arguments; }", errors: [{ type: "Identifier", message: "Use the rest parameters instead of 'arguments'." }] },
        { code: "function foo() { arguments[0]; }", errors: [{ type: "Identifier", message: "Use the rest parameters instead of 'arguments'." }] },
        { code: "function foo() { arguments[1]; }", errors: [{ type: "Identifier", message: "Use the rest parameters instead of 'arguments'." }] },
        { code: "function foo() { arguments[Symbol.iterator]; }", errors: [{ type: "Identifier", message: "Use the rest parameters instead of 'arguments'." }] }
    ]
});
