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

const ruleTester = new RuleTester();

ruleTester.run("constructor-super", rule, {
    valid: [

        // non derived classes.
        { code: "class A { }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { constructor() { } }", parserOptions: { ecmaVersion: 6 } },

        // inherit from non constructors.
        // those are valid if we don't define the constructor.
        { code: "class A extends null { }", parserOptions: { ecmaVersion: 6 } },

        // derived classes.
        { code: "class A extends B { }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { if (true) { super(); } else { super(); } } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends (class B {}) { constructor() { super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends (B = C) { constructor() { super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends (B || C) { constructor() { super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends (a ? B : C) { constructor() { super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends (B, C) { constructor() { super(); } }", parserOptions: { ecmaVersion: 6 } },

        // nested.
        { code: "class A { constructor() { class B extends C { constructor() { super(); } } } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super(); class C extends D { constructor() { super(); } } } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super(); class C { constructor() { } } } }", parserOptions: { ecmaVersion: 6 } },

        // ignores out of constructors.
        { code: "class A { b() { super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "function a() { super(); }", parserOptions: { ecmaVersion: 6 } },

        // multi code path.
        { code: "class A extends B { constructor() { a ? super() : super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { if (a) super(); else super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { switch (a) { case 0: super(); break; default: super(); } } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { try {} finally { super(); } } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { if (a) throw Error(); super(); } }", parserOptions: { ecmaVersion: 6 } },

        // returning value is a substitute of 'super()'.
        { code: "class A extends B { constructor() { if (true) return a; super(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends null { constructor() { return a; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { constructor() { return a; } }", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/5261
        { code: "class A extends B { constructor(a) { super(); for (const b of a) { this.a(); } } }", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/5319
        { code: "class Foo extends Object { constructor(method) { super(); this.method = method || function() {}; } }", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/5394
        {
            code: [
                "class A extends Object {",
                "    constructor() {",
                "        super();",
                "        for (let i = 0; i < 0; i++);",
                "    }",
                "}"
            ].join("\n"),
            parserOptions: {ecmaVersion: 6}
        },

        // https://github.com/eslint/eslint/issues/5894
        { code: "class A { constructor() { return; super(); } }", parserOptions: {ecmaVersion: 6} }
    ],
    invalid: [

        // non derived classes.
        {
            code: "class A { constructor() { super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected 'super()'.", type: "CallExpression"}]
        },

        // inherit from non constructors.
        {
            code: "class A extends null { constructor() { super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected 'super()' because 'super' is not a constructor.", type: "CallExpression"}]
        },
        {
            code: "class A extends null { constructor() { } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends 100 { constructor() { super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected 'super()' because 'super' is not a constructor.", type: "CallExpression"}]
        },
        {
            code: "class A extends 'test' { constructor() { super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected 'super()' because 'super' is not a constructor.", type: "CallExpression"}]
        },

        // derived classes.
        {
            code: "class A extends B { constructor() { } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { for (var a of b) super.foo(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition"}]
        },

        // nested execution scope.
        {
            code: "class A extends B { constructor() { function c() { super(); } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { var c = function() { super(); } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { var c = () => super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { class C extends D { constructor() { super(); } } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition", column: 21}]
        },
        {
            code: "class A extends B { constructor() { var C = class extends D { constructor() { super(); } } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition", column: 21}]
        },
        {
            code: "class A extends B { constructor() { super(); class C extends D { constructor() { } } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition", column: 66}]
        },
        {
            code: "class A extends B { constructor() { super(); var C = class extends D { constructor() { } } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition", column: 72}]
        },

        // lacked in some code path.
        {
            code: "class A extends B { constructor() { if (a) super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { if (a); else super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { a && super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: super(); } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: break; default: super(); } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { try { super(); } catch (err) {} } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { try { a; } catch (err) { super(); } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"}]
        },
        {
            code: "class A extends B { constructor() { if (a) return; super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"}]
        },

        // duplicate.
        {
            code: "class A extends B { constructor() { super(); super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 46}]
        },
        {
            code: "class A extends B { constructor() { super() || super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 48}]
        },
        {
            code: "class A extends B { constructor() { if (a) super(); super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 53}]
        },
        {
            code: "class A extends B { constructor() { switch (a) { case 0: super(); default: super(); } } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 76}]
        },
        {
            code: "class A extends B { constructor(a) { while (a) super(); } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Lacked a call of 'super()' in some code paths.", type: "MethodDefinition"},
                { message: "Unexpected duplicate 'super()'.", type: "CallExpression", column: 48}
            ]
        },

        // ignores `super()` on unreachable paths.
        {
            code: "class A extends B { constructor() { return; super(); } }",
            parserOptions: {ecmaVersion: 6},
            errors: [{ message: "Expected to call 'super()'.", type: "MethodDefinition"}]
        }
    ]
});
