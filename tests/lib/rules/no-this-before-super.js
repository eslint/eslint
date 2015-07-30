/**
 * @fileoverview Tests for no-this-before-super rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-this-before-super");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-this-before-super", rule, {
    valid: [
        // if the class has no extends or `extends null`, just ignores.
        // those cannot call `super()`.
        { code: "class A { }", ecmaFeatures: {classes: true} },
        { code: "class A { constructor() { } }", ecmaFeatures: {classes: true} },
        { code: "class A { constructor() { this.b = 0; } }", ecmaFeatures: {classes: true} },
        { code: "class A { constructor() { this.b(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends null { }", ecmaFeatures: {classes: true} },
        { code: "class A extends null { constructor() { } }", ecmaFeatures: {classes: true} },

        // allows `this`/`super` after `super()`.
        { code: "class A extends B { }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { super(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { super(); this.c = this.d; } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { super(); this.c(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { super(); super.c(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { if (true) { super(); } else { super(); } this.c(); } }", ecmaFeatures: {classes: true} },

        // allows `this`/`super` in nested executable scopes, even if before `super()`.
        { code: "class A extends B { constructor() { class B extends C { constructor() { super(); this.d = 0; } } super(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { var B = class extends C { constructor() { super(); this.d = 0; } }; super(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { function c() { this.d(); } super(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { var c = function c() { this.d(); }; super(); } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { constructor() { var c = () => this.d(); super(); } }", ecmaFeatures: {classes: true, arrowFunctions: true} },

        // ignores out of constructors.
        { code: "class A { b() { this.c = 0; } }", ecmaFeatures: {classes: true} },
        { code: "class A extends B { c() { this.d = 0; } }", ecmaFeatures: {classes: true} },
        { code: "function a() { this.b = 0; }", ecmaFeatures: {classes: true} }
    ],
    invalid: [
        // disallows all `this`/`super` if `super()` is missing.
        {
            code: "class A extends B { constructor() { this.c = 0; } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"this\" is not allowed before super()", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { this.c(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"this\" is not allowed before super()", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { super.c(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"super\" is not allowed before super()", type: "Super"}]
        },

        // disallows `this`/`super` before `super()`.
        {
            code: "class A extends B { constructor() { this.c = 0; super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"this\" is not allowed before super()", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { this.c(); super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"this\" is not allowed before super()", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { super.c(); super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"super\" is not allowed before super()", type: "Super"}]
        },

        // disallows `this`/`super` in arguments of `super()`.
        {
            code: "class A extends B { constructor() { super(this.c); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"this\" is not allowed before super()", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { super(this.c()); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"this\" is not allowed before super()", type: "ThisExpression"}]
        },
        {
            code: "class A extends B { constructor() { super(super.c()); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"super\" is not allowed before super()", type: "Super"}]
        },

        // even if is nested, reports correctly.
        {
            code: "class A extends B { constructor() { class C extends D { constructor() { super(); this.e(); } } this.f(); super(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"this\" is not allowed before super()", type: "ThisExpression", column: 96}]
        },
        {
            code: "class A extends B { constructor() { class C extends D { constructor() { this.e(); super(); } } super(); this.f(); } }",
            ecmaFeatures: {classes: true},
            errors: [{ message: "\"this\" is not allowed before super()", type: "ThisExpression", column: 73}]
        }
    ]
});
