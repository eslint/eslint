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

const ruleTester = new RuleTester();

ruleTester.run("prefer-rest-params", rule, {
    valid: [
        "arguments;",
        "function foo(arguments) { arguments; }",
        "function foo() { var arguments; arguments; }",
        {code: "var foo = () => arguments;", parserOptions: { ecmaVersion: 6 }}, // Arrows don't have "arguments".,
        {code: "function foo(...args) { args; }", parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {code: "function foo() { arguments; }", errors: [{type: "Identifier", message: "Use the rest parameters instead of 'arguments'."}]}
    ]
});
