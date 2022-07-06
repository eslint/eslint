/**
 * @fileoverview Tests for no-useless-computed-key rule.
 * @author Burak Yigit Kaya
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-computed-key"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

ruleTester.run("no-useless-computed-key", rule, {
    valid: [
        "({ 'a': 0, b(){} })",
        "({ [x]: 0 });",
        "({ a: 0, [b](){} })",
        "({ ['__proto__']: [] })",
        { code: "class Foo { a() {} }", options: [{ enforceForClassMembers: true }] },
        { code: "class Foo { 'a'() {} }", options: [{ enforceForClassMembers: true }] },
        { code: "class Foo { [x]() {} }", options: [{ enforceForClassMembers: true }] },
        { code: "class Foo { ['constructor']() {} }", options: [{ enforceForClassMembers: true }] },
        { code: "class Foo { static ['prototype']() {} }", options: [{ enforceForClassMembers: true }] },
        { code: "(class { 'a'() {} })", options: [{ enforceForClassMembers: true }] },
        { code: "(class { [x]() {} })", options: [{ enforceForClassMembers: true }] },
        { code: "(class { ['constructor']() {} })", options: [{ enforceForClassMembers: true }] },
        { code: "(class { static ['prototype']() {} })", options: [{ enforceForClassMembers: true }] },
        "class Foo { ['x']() {} }",
        "(class { ['x']() {} })",
        "class Foo { static ['constructor']() {} }",
        "class Foo { ['prototype']() {} }",
        { code: "class Foo { ['x']() {} }", options: [{ enforceForClassMembers: false }] },
        { code: "(class { ['x']() {} })", options: [{ enforceForClassMembers: false }] },
        { code: "class Foo { static ['constructor']() {} }", options: [{ enforceForClassMembers: false }] },
        { code: "class Foo { ['prototype']() {} }", options: [{ enforceForClassMembers: false }] },
        { code: "class Foo { a }", options: [{ enforceForClassMembers: true }] },
        { code: "class Foo { ['constructor'] }", options: [{ enforceForClassMembers: true }] },
        { code: "class Foo { static ['constructor'] }", options: [{ enforceForClassMembers: true }] },
        { code: "class Foo { static ['prototype'] }", options: [{ enforceForClassMembers: true }] },

        /*
         * Well-known browsers throw syntax error bigint literals on property names,
         * so, this rule doesn't touch those for now.
         */
        {
            code: "({ [99999999999999999n]: 0 })",
            parserOptions: { ecmaVersion: 2020 }
        }
    ],
    invalid: [
        {
            code: "({ ['0']: 0 })",
            output: "({ '0': 0 })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'0'" },
                type: "Property"
            }]
        }, {
            code: "({ ['0+1,234']: 0 })",
            output: "({ '0+1,234': 0 })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'0+1,234'" },
                type: "Property"
            }]
        }, {
            code: "({ [0]: 0 })",
            output: "({ 0: 0 })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "0" },
                type: "Property"
            }]
        }, {
            code: "({ ['x']: 0 })",
            output: "({ 'x': 0 })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "Property"
            }]
        }, {
            code: "({ ['x']() {} })",
            output: "({ 'x'() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "Property"
            }]
        }, {
            code: "({ [/* this comment prevents a fix */ 'x']: 0 })",
            output: null,
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "Property"
            }]
        }, {
            code: "({ ['x' /* this comment also prevents a fix */]: 0 })",
            output: null,
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "Property"
            }]
        }, {
            code: "({ [('x')]: 0 })",
            output: "({ 'x': 0 })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "Property"
            }]
        }, {
            code: "({ *['x']() {} })",
            output: "({ *'x'() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "Property"
            }]
        }, {
            code: "({ async ['x']() {} })",
            output: "({ async 'x'() {} })",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "Property"
            }]
        }, {
            code: "({ get[.2]() {} })",
            output: "({ get.2() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: ".2" },
                type: "Property"
            }]
        }, {
            code: "({ set[.2](value) {} })",
            output: "({ set.2(value) {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: ".2" },
                type: "Property"
            }]
        }, {
            code: "({ async[.2]() {} })",
            output: "({ async.2() {} })",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: ".2" },
                type: "Property"
            }]
        }, {
            code: "({ [2]() {} })",
            output: "({ 2() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ get [2]() {} })",
            output: "({ get 2() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ set [2](value) {} })",
            output: "({ set 2(value) {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ async [2]() {} })",
            output: "({ async 2() {} })",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ get[2]() {} })",
            output: "({ get 2() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ set[2](value) {} })",
            output: "({ set 2(value) {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ async[2]() {} })",
            output: "({ async 2() {} })",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ get['foo']() {} })",
            output: "({ get'foo'() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'foo'" },
                type: "Property"
            }]
        }, {
            code: "({ *[2]() {} })",
            output: "({ *2() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ async*[2]() {} })",
            output: "({ async*2() {} })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "Property"
            }]
        }, {
            code: "({ ['constructor']: 1 })",
            output: "({ 'constructor': 1 })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'constructor'" },
                type: "Property"
            }]
        }, {
            code: "({ ['prototype']: 1 })",
            output: "({ 'prototype': 1 })",
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'prototype'" },
                type: "Property"
            }]
        }, {
            code: "class Foo { ['0']() {} }",
            output: "class Foo { '0'() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'0'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { ['0+1,234']() {} }",
            output: "class Foo { '0+1,234'() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'0+1,234'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { ['x']() {} }",
            output: "class Foo { 'x'() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { [/* this comment prevents a fix */ 'x']() {} }",
            output: null,
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { ['x' /* this comment also prevents a fix */]() {} }",
            output: null,
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { [('x')]() {} }",
            output: "class Foo { 'x'() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { *['x']() {} }",
            output: "class Foo { *'x'() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { async ['x']() {} }",
            output: "class Foo { async 'x'() {} }",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { get[.2]() {} }",
            output: "class Foo { get.2() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: ".2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { set[.2](value) {} }",
            output: "class Foo { set.2(value) {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: ".2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { async[.2]() {} }",
            output: "class Foo { async.2() {} }",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: ".2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { [2]() {} }",
            output: "class Foo { 2() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { get [2]() {} }",
            output: "class Foo { get 2() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { set [2](value) {} }",
            output: "class Foo { set 2(value) {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { async [2]() {} }",
            output: "class Foo { async 2() {} }",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { get[2]() {} }",
            output: "class Foo { get 2() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { set[2](value) {} }",
            output: "class Foo { set 2(value) {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { async[2]() {} }",
            output: "class Foo { async 2() {} }",
            options: [{ enforceForClassMembers: true }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { get['foo']() {} }",
            output: "class Foo { get'foo'() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'foo'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { *[2]() {} }",
            output: "class Foo { *2() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { async*[2]() {} }",
            output: "class Foo { async*2() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "2" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { static ['constructor']() {} }",
            output: "class Foo { static 'constructor'() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'constructor'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { ['prototype']() {} }",
            output: "class Foo { 'prototype'() {} }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'prototype'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "(class { ['x']() {} })",
            output: "(class { 'x'() {} })",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'x'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "(class { ['__proto__']() {} })",
            output: "(class { '__proto__'() {} })",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'__proto__'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "(class { static ['__proto__']() {} })",
            output: "(class { static '__proto__'() {} })",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'__proto__'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "(class { static ['constructor']() {} })",
            output: "(class { static 'constructor'() {} })",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'constructor'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "(class { ['prototype']() {} })",
            output: "(class { 'prototype'() {} })",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'prototype'" },
                type: "MethodDefinition"
            }]
        }, {
            code: "class Foo { ['0'] }",
            output: "class Foo { '0' }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'0'" },
                type: "PropertyDefinition"
            }]
        }, {
            code: "class Foo { ['0'] = 0 }",
            output: "class Foo { '0' = 0 }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'0'" },
                type: "PropertyDefinition"
            }]
        }, {
            code: "class Foo { static[0] }",
            output: "class Foo { static 0 }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "0" },
                type: "PropertyDefinition"
            }]
        }, {
            code: "class Foo { ['#foo'] }",
            output: "class Foo { '#foo' }",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'#foo'" },
                type: "PropertyDefinition"
            }]
        }, {
            code: "(class { ['__proto__'] })",
            output: "(class { '__proto__' })",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'__proto__'" },
                type: "PropertyDefinition"
            }]
        }, {
            code: "(class { static ['__proto__'] })",
            output: "(class { static '__proto__' })",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'__proto__'" },
                type: "PropertyDefinition"
            }]
        }, {
            code: "(class { ['prototype'] })",
            output: "(class { 'prototype' })",
            options: [{ enforceForClassMembers: true }],
            errors: [{
                messageId: "unnecessarilyComputedProperty",
                data: { property: "'prototype'" },
                type: "PropertyDefinition"
            }]
        }
    ]
});
