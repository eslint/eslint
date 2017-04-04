/**
 * @fileoverview Tests for constructor-super rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/constructor-super");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("constructor-super", rule, {
    valid: [

        // non derived classes.
        "class A { }",
        "class A { constructor() { } }",

        // inherit from non constructors.
        // those are valid if we don't define the constructor.
        "class A extends null { }",

        // derived classes.
        "class A extends B { }",
        "class A extends B { constructor() { super(); } }",
        "class A extends B { constructor() { if (true) { super(); } else { super(); } } }",
        "class A extends (class B {}) { constructor() { super(); } }",
        "class A extends (B = C) { constructor() { super(); } }",
        "class A extends (B || C) { constructor() { super(); } }",
        "class A extends (a ? B : C) { constructor() { super(); } }",
        "class A extends (B, C) { constructor() { super(); } }",

        // nested.
        "class A { constructor() { class B extends C { constructor() { super(); } } } }",
        "class A extends B { constructor() { super(); class C extends D { constructor() { super(); } } } }",
        "class A extends B { constructor() { super(); class C { constructor() { } } } }",

        // ignores out of constructors.
        "class A { b() { super(); } }",
        "function a() { super(); }",

        // multi code path.
        "class A extends B { constructor() { a ? super() : super(); } }",
        "class A extends B { constructor() { if (a) super(); else super(); } }",
        "class A extends B { constructor() { switch (a) { case 0: super(); break; default: super(); } } }",
        "class A extends B { constructor() { try {} finally { super(); } } }",
        "class A extends B { constructor() { if (a) throw Error(); super(); } }",

        // returning value is a substitute of 'super()'.
        "class A extends B { constructor() { if (true) return a; super(); } }",
        "class A extends null { constructor() { return a; } }",
        "class A { constructor() { return a; } }",

        // https://github.com/eslint/eslint/issues/5261
        "class A extends B { constructor(a) { super(); for (const b of a) { this.a(); } } }",

        // https://github.com/eslint/eslint/issues/5319
        "class Foo extends Object { constructor(method) { super(); this.method = method || function() {}; } }",

        // https://github.com/eslint/eslint/issues/5394
        [
            "class A extends Object {",
            "    constructor() {",
            "        super();",
            "        for (let i = 0; i < 0; i++);",
            "    }",
            "}"
        ].join("\n"),

        // https://github.com/eslint/eslint/issues/5894
        "class A { constructor() { return; super(); } }"
    ],
    invalid: [

        // non derived classes.
        {
            code: "class A { constructor() { super(); } }",
            errors: [{ message: "Unexpected 'super()'.", type: "CallExpression" }]
        },

        // inherit from non constructors.
        {
            code: "class A extends null { constructor() { super(); } }",
            errors: [{ message: "Unexpected 'super()' because 'super' is not a constructor.", type: "CallExpression" }]
        },
        {
            code: "class A extends null { constructor() { } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends 100 { constructor() { super(); } }",
            errors: [{ message: "Unexpected 'super()' because 'super' is not a constructor.", type: "CallExpression" }]
        },
        {
            code: "class A extends 'test' { constructor() { super(); } }",
            errors: [{ message: "Unexpected 'super()' because 'super' is not a constructor.", type: "CallExpression" }]
        },

        // derived classes.
        {
            code: "class A extends B { constructor() { } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { for (var a of b) super.foo(); } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition" }]
        },

        // nested execution scope.
        {
            code: "class A extends B { constructor() { function c() { super(); } } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { var c = function() { super(); } } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { var c = () => super(); } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { class C extends D { constructor() { super(); } } } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition", column: 21 }]
        },
        {
            code: "class A extends B { constructor() { var C = class extends D { constructor() { super(); } } } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition", column: 21 }]
        },
        {
            code: "class A extends B { constructor() { super(); class C extends D { constructor() { } } } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition", column: 66 }]
        },
        {
            code: "class A extends B { constructor() { super(); var C = class extends D { constructor() { } } } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition", column: 72 }]
        },

        // lacked in some code path.
        {
            code: "class A extends B { constructor() { if (a) super(); } }",
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { if (a); else super(); } }",
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { a && super(); } }",
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: super(); } } }",
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: break; default: super(); } } }",
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { try { super(); } catch (err) {} } }",
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { try { a; } catch (err) { super(); } } }",
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" }]
        },
        {
            code: "class A extends B { constructor() { if (a) return; super(); } }",
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" }]
        },

        // duplicate.
        {
            code: "class A extends B { constructor() { super(); super(); } }",
            errors: [{ message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 46 }]
        },
        {
            code: "class A extends B { constructor() { super() || super(); } }",
            errors: [{ message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 48 }]
        },
        {
            code: "class A extends B { constructor() { if (a) super(); super(); } }",
            errors: [{ message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 53 }]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: super(); default: super(); } } }",
            errors: [{ message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 76 }]
        },
        {
            code: "class A extends B { constructor(a) { while (a) super(); } }",
            errors: [
                { message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition" },
                { message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 48 }
            ]
        },

        // ignores `super()` on unreachable paths.
        {
            code: "class A extends B { constructor() { return; super(); } }",
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition" }]
        },

        // https://github.com/eslint/eslint/issues/8248
        {
            code: `class Foo extends Bar {
                constructor() {
                    for (a in b) for (c in d);
                }
            }`,
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition" }]
        }
    ]
});
