/**
 * @fileoverview Tests for no-useless-computed-key rule.
 * @author Burak Yigit Kaya
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-computed-key"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });

ruleTester.run("no-useless-computed-key", rule, {
    valid: [
        "({ 'a': 0, b(){} })",
        "({ [x]: 0 });",
        "({ a: 0, [b](){} })",
        "({ ['__proto__']: [] })"
    ],
    invalid: [
        {
            code: "({ ['0']: 0 })",
            output: "({ '0': 0 })",
            errors: [{
                message: "Unnecessarily computed property ['0'] found.", type: "Property"
            }]
        }, {
            code: "({ ['0+1,234']: 0 })",
            output: "({ '0+1,234': 0 })",
            errors: [{
                message: "Unnecessarily computed property ['0+1,234'] found.", type: "Property"
            }]
        }, {
            code: "({ [0]: 0 })",
            output: "({ 0: 0 })",
            errors: [{
                message: "Unnecessarily computed property [0] found.", type: "Property"
            }]
        }, {
            code: "({ ['x']: 0 })",
            output: "({ 'x': 0 })",
            errors: [{
                message: "Unnecessarily computed property ['x'] found.", type: "Property"
            }]
        }, {
            code: "({ ['x']() {} })",
            output: "({ 'x'() {} })",
            errors: [{
                message: "Unnecessarily computed property ['x'] found.", type: "Property"
            }]
        }, {
            code: "({ [/* this comment prevents a fix */ 'x']: 0 })",
            output: null,
            errors: [{
                message: "Unnecessarily computed property ['x'] found.", type: "Property"
            }]
        }, {
            code: "({ ['x' /* this comment also prevents a fix */]: 0 })",
            output: null,
            errors: [{
                message: "Unnecessarily computed property ['x'] found.", type: "Property"
            }]
        }, {
            code: "({ [('x')]: 0 })",
            output: "({ 'x': 0 })",
            errors: [{
                message: "Unnecessarily computed property ['x'] found.", type: "Property"
            }]
        }, {
            code: "({ *['x']() {} })",
            output: "({ *'x'() {} })",
            errors: [{
                message: "Unnecessarily computed property ['x'] found.", type: "Property"
            }]
        }, {
            code: "({ async ['x']() {} })",
            output: "({ async 'x'() {} })",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                message: "Unnecessarily computed property ['x'] found.", type: "Property"
            }]
        }, {
            code: "({ get[.2]() {} })",
            output: "({ get.2() {} })",
            errors: [{
                message: "Unnecessarily computed property [.2] found.", type: "Property"
            }]
        }, {
            code: "({ set[.2](value) {} })",
            output: "({ set.2(value) {} })",
            errors: [{
                message: "Unnecessarily computed property [.2] found.", type: "Property"
            }]
        }, {
            code: "({ async[.2]() {} })",
            output: "({ async.2() {} })",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                message: "Unnecessarily computed property [.2] found.", type: "Property"
            }]
        }, {
            code: "({ [2]() {} })",
            output: "({ 2() {} })",
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }, {
            code: "({ get [2]() {} })",
            output: "({ get 2() {} })",
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }, {
            code: "({ set [2](value) {} })",
            output: "({ set 2(value) {} })",
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }, {
            code: "({ async [2]() {} })",
            output: "({ async 2() {} })",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }, {
            code: "({ get[2]() {} })",
            output: "({ get 2() {} })",
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }, {
            code: "({ set[2](value) {} })",
            output: "({ set 2(value) {} })",
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }, {
            code: "({ async[2]() {} })",
            output: "({ async 2() {} })",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }, {
            code: "({ get['foo']() {} })",
            output: "({ get'foo'() {} })",
            errors: [{
                message: "Unnecessarily computed property ['foo'] found.", type: "Property"
            }]
        }, {
            code: "({ *[2]() {} })",
            output: "({ *2() {} })",
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }, {
            code: "({ async*[2]() {} })",
            output: "({ async*2() {} })",
            errors: [{
                message: "Unnecessarily computed property [2] found.", type: "Property"
            }]
        }
    ]
});
