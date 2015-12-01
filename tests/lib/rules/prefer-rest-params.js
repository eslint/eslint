/**
 * @fileoverview Tests for prefer-rest-params rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer-rest-params"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("prefer-rest-params", rule, {
    valid: [
        "arguments;",
        "function foo(arguments) { arguments; }",
        "function foo() { var arguments; arguments; }",
        {code: "var foo = () => arguments;", ecmaFeatures: {arrowFunctions: true}}, // Arrows don't have "arguments".,
        {code: "function foo(...args) { args; }", ecmaFeatures: {restParams: true}}
    ],
    invalid: [
        {code: "function foo() { arguments; }", errors: [{type: "Identifier", message: "Use the rest parameters instead of \"arguments\"."}]}
    ]
});
