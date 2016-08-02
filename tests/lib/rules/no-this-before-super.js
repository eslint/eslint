/**
 * @fileoverview Tests for no-this-before-super rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-this-before-super");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-this-before-super", rule, {
    valid: [

        /*
         * if the class has no extends or `extends null`, just ignore.
         * those classes cannot call `super()`.
         */
        { code: "class A { }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { constructor() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { constructor() { this.b = 0; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { constructor() { this.b(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends null { }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends null { constructor() { } }", parserOptions: { ecmaVersion: 6 } },

        // allows `this`/`super` after `super()`.
        { code: "class A extends B { }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super(); this.c = this.d; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super(); this.c(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super(); super.c(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { if (true) { super(); } else { super(); } this.c(); } }", parserOptions: { ecmaVersion: 6 } },

        // allows `this`/`super` in nested executable scopes, even if before `super()`.
        { code: "class A extends B { constructor() { class B extends C { constructor() { super(); this.d = 0; } } super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { var B = class extends C { constructor() { super(); this.d = 0; } }; super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { function c() { this.d(); } super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { var c = function c() { this.d(); }; super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { var c = () => this.d(); super(); } }", parserOptions: { ecmaVersion: 6 } },

        // ignores out of constructors.
        { code: "class A { b() { this.c = 0; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { c() { this.d = 0; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "function a() { this.b = 0; }", parserOptions: { ecmaVersion: 6 } },

        // multi code path.
        { code: "class A extends B { constructor() { if (a) { super(); this.a(); } else { super(); this.b(); } } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { if (a) super(); else super(); this.a(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { try { super(); } finally {} this.a(); } }", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/5261
        { code: "class A extends B { constructor(a) { super(); for (const b of a) { this.a(); } } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor(a) { for (const b of a) { foo(b); } super(); } }", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/5319
        { code: "class A extends B { constructor(a) { super(); this.a = a && function(){} && this.foo; } }", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/5394
        {
            code: [
                "class A extends Object {",
                "    constructor() {",
                "        super();",
                "        for (let i = 0; i < 0; i++);",
                "        this;",
                "    }",
                "}"
            ].join("\n"),
            parserOptions: {ecmaVersion: 6}
        },

        // https://github.com/eslint/eslint/issues/5894
        { code: "class A { constructor() { return; this; } }", parserOptions: {ecmaVersion: 6} },
        { code: "class A extends B { constructor() { return; this; } }", parserOptions: {ecmaVersion: 6} }
    ],
    invalid: [

        // disallows all `this`/`super` if `super()` is missing.
        {
            code: "class A extends B { constructor() { this.c = 0; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { this.c(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { super.c(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'super' is not allowed before 'super()'.", type: "Super"}]
        },

        // disallows `this`/`super` before `super()`.
        {
            code: "class A extends B { constructor() { this.c = 0; super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { this.c(); super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { super.c(); super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'super' is not allowed before 'super()'.", type: "Super"}]
        },

        // disallows `this`/`super` in arguments of `super()`.
        {
            code: "class A extends B { constructor() { super(this.c); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { super(this.c()); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { super(super.c()); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'super' is not allowed before 'super()'.", type: "Super"}]
        },

        // even if is nested, reports correctly.
        {
            code: "class A extends B { constructor() { class C extends D { constructor() { super(); this.e(); } } this.f(); super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression", column: 96}]
        },
        {
            code: "class A extends B { constructor() { class C extends D { constructor() { this.e(); super(); } } super(); this.f(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression", column: 73}]
        },

        // multi code path.
        {
            code: "class A extends B { constructor() { if (a) super(); this.a(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { try { super(); } finally { this.a; } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { try { super(); } catch (err) { } this.a; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'this' is not allowed before 'super()'.", type: "ThisExpression"}]
        }
    ]
});
