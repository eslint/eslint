/**
 * @fileoverview Tests for the no-new-symbol rule
 * @author Alberto Rodríguez
 * @copyright 2016 Alberto Rodríguez. All rights reserved.
 * See LICENSE file in root directory for full license.

 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-new-symbol"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("no-new-symbol", rule, {
    valid: [
        {code: "var foo = Symbol('foo');", env: {es6: true} },
        {code: "function bar(Symbol) { var baz = new Symbol('baz');}", env: {es6: true} },
        {code: "function Symbol() {} new Symbol();", env: {es6: true} }
    ],
    invalid: [
        {
            code: "var foo = new Symbol('foo');",
            env: {es6: true},
            errors: [{ message: "`Symbol` cannot be called as a constructor."}]
        },
        {
            code: "function bar() { return function Symbol() {}; } var baz = new Symbol('baz');",
            env: {es6: true},
            errors: [{ message: "`Symbol` cannot be called as a constructor."}]
        }
    ]
});
