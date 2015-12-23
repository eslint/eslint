/**
 * @fileoverview Tests for no-useless-constructor rule.
 * @author Alberto Rodriguez
 * @copyright 2015 Alberto Rodriguez. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-useless-constructor");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
var error = {message: "Useless constructor.", type: "MethodDefinition"};
ruleTester.run("no-useless-constructor", rule, {
    valid: [
        {
            code: "class A { }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { constructor(){ doSomething(); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { constructor(){ super('foo'); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(){} }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(){ super('foo'); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(foo, bar){ super(foo, bar, 1); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(){ super(); doSomething(); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(...args){ super(...args); doSomething(); } }",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "class A { constructor(){} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "class A { 'constructor'(){} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "class A extends B { constructor(foo){ super(foo); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "class A extends B { constructor(foo, bar){ super(foo, bar); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "class A extends B { constructor(...args){ super(...args); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "class A extends B { constructor(foo, bar){ super(foo); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        }

    ]
});
