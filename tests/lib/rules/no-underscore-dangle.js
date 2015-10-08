/**
 * @fileoverview Test for no-underscore-dangle rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-underscore-dangle"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-underscore-dangle", rule, {
    valid: [
        "var foo_bar = 1;",
        "function foo_bar() {}",
        "foo.bar.__proto__;",
        "console.log(__filename); console.log(__dirname);",
        "var _ = require('underscore');",
        "var a = b._;",
        { code: "export default function() {}", ecmaFeatures: { modules: true }},
        { code: "var _foo = 1", options: [{ allow: ["_foo"] }]},
        { code: "var __proto__ = 1;", options: [{ allow: ["__proto__"] }]},
        { code: "foo._bar;", options: [{ allow: ["_bar"] }]},
        { code: "function _foo() {}", options: [{ allow: ["_foo"] }]}
    ],
    invalid: [
        { code: "var _foo = 1", errors: [{ message: "Unexpected dangling \"_\" in \"_foo\".", type: "VariableDeclarator"}] },
        { code: "var foo_ = 1", errors: [{ message: "Unexpected dangling \"_\" in \"foo_\".", type: "VariableDeclarator"}] },
        { code: "function _foo() {}", errors: [{ message: "Unexpected dangling \"_\" in \"_foo\".", type: "FunctionDeclaration"}] },
        { code: "function foo_() {}", errors: [{ message: "Unexpected dangling \"_\" in \"foo_\".", type: "FunctionDeclaration"}] },
        { code: "var __proto__ = 1;", errors: [{ message: "Unexpected dangling \"_\" in \"__proto__\".", type: "VariableDeclarator"}] },
        { code: "foo._bar;", errors: [{ message: "Unexpected dangling \"_\" in \"_bar\".", type: "MemberExpression"}] }
    ]
});
