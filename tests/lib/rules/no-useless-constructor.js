/**
 * @fileoverview Tests for no-useless-constructor rule.
 * @author Alberto Rodriguez
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-constructor");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const error = {message: "Useless constructor.", type: "MethodDefinition"};

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
        },
        {
            code: "class A { dummyMethod(){ doSomething(); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B.C { constructor() { super(foo); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B.C { constructor([a, b, c]) { super(...arguments); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B.C { constructor(a = f()) { super(...arguments); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(a, b, c) { super(a, b); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(foo, bar){ super(foo); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(test) { super(); } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor() { foo; } }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A extends B { constructor(foo, bar) { super(bar); } }",
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
            code: "class A extends B { constructor() { super(); } }",
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
            code: "class A extends B.C { constructor() { super(...arguments); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "class A extends B { constructor(a, b, ...c) { super(...arguments); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "class A extends B { constructor(a, b, ...c) { super(a, b, ...c); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        }
    ]
});
